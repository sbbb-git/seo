#!/usr/bin/env node
// Run AFTER `@cloudflare/next-on-pages` (so the worker bundle exists) and
// BEFORE `wrangler pages deploy`. Wraps the generated worker's default
// export so we can override Cache-Control on locale page responses without
// touching Next, the middleware or next.config (none of which can force
// the value past Next's hard-coded must-revalidate on prerendered pages).
//
// The wrapper only fires on 200 responses to /{locale}/... paths and only
// replaces the header if Next sent its no-cache default. _next/static and
// already-cache-friendly responses are left untouched.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const PATH = '.vercel/output/static/_worker.js/index.js';

if (!existsSync(PATH)) {
  console.error(`[wrap-worker] ${PATH} not found — did next-on-pages run?`);
  process.exit(1);
}

const src = readFileSync(PATH, 'utf8');

if (src.includes('__NOP_PAGE_CACHE_WRAPPER__')) {
  console.log('[wrap-worker] wrapper already applied — skipping.');
  process.exit(0);
}

const m = src.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}\s*;?/);
if (!m) {
  console.error('[wrap-worker] could not locate default export in worker bundle.');
  process.exit(1);
}
const exportName = m[1];

const wrapper = `
// __NOP_PAGE_CACHE_WRAPPER__ — overrides Cache-Control AND actively
// stores responses in the Cloudflare edge cache for locale pages.
// Setting s-maxage alone is not enough on CF Pages worker responses:
// they default to cf-cache-status:DYNAMIC. The Cache API write below
// is what makes them HIT on subsequent requests.
const __NOP_PAGE_CACHE = 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400';
const __NOP_LOCALE_RE = /^\\/(en|fr|es|pt|it|de|pl)(\\/|$)/;

function __nopShouldCache(req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  const path = new URL(req.url).pathname;
  if (!__NOP_LOCALE_RE.test(path)) return false;
  if (path.startsWith('/_next/')) return false;
  // Skip RSC payloads (client-side navigation prefetches) — Next varies on RSC.
  if (req.headers.get('RSC') || req.headers.get('Next-Router-State-Tree')) return false;
  return true;
}

const __NOP_wrapped = {
  async fetch(req, env, ctx) {
    const cacheable = __nopShouldCache(req);

    // Cache lookup before invoking the origin worker.
    if (cacheable) {
      const cache = caches.default;
      const hit = await cache.match(req);
      if (hit) return hit;
    }

    const res = await ${exportName}.fetch(req, env, ctx);
    if (!cacheable || !res || res.status !== 200) return res;

    // Override Cache-Control on outgoing response (and on the version
    // we stash so the edge knows the TTL on retrieval too).
    const headers = new Headers(res.headers);
    const cc = headers.get('cache-control') || '';
    if (cc.includes('must-revalidate') || (!cc.includes('s-maxage') && !cc.includes('immutable'))) {
      headers.set('Cache-Control', __NOP_PAGE_CACHE);
    }

    const cached = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });

    // Stash a clone in the edge cache so the next request HITs.
    try {
      ctx.waitUntil(caches.default.put(req, cached.clone()));
    } catch (_) {
      // Cache writes can fail for streamed responses on some routes;
      // never break the request because of a cache write.
    }
    return cached;
  },
};
export { __NOP_wrapped as default };
`;

const patched = src.replace(/export\s*\{\s*\w+\s+as\s+default\s*\}\s*;?/, '') + wrapper;
writeFileSync(PATH, patched);
console.log(`[wrap-worker] wrapped default export (was ${exportName}) with cache-control override.`);
