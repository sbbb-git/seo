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
// __NOP_PAGE_CACHE_WRAPPER__ — overrides Cache-Control on locale pages so
// Cloudflare can edge-cache the response. Next hard-codes
// 'public, max-age=0, must-revalidate' on prerendered routes and Cache-Rules
// can't be set with our zone-read API token; this patch closes the gap.
const __NOP_PAGE_CACHE = 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400';
const __NOP_LOCALE_RE = /^\\/(en|fr|es|pt|it|de|pl)(\\/|$)/;
const __NOP_wrapped = {
  async fetch(req, env, ctx) {
    const res = await ${exportName}.fetch(req, env, ctx);
    if (!res || res.status !== 200) return res;
    const path = new URL(req.url).pathname;
    if (!__NOP_LOCALE_RE.test(path)) return res;
    if (path.startsWith('/_next/')) return res;
    const cc = (res.headers && res.headers.get('cache-control')) || '';
    const stale = cc.includes('must-revalidate') || (!cc.includes('s-maxage') && !cc.includes('immutable'));
    if (!stale) return res;
    const headers = new Headers(res.headers);
    headers.set('Cache-Control', __NOP_PAGE_CACHE);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  },
};
export { __NOP_wrapped as default };
`;

const patched = src.replace(/export\s*\{\s*\w+\s+as\s+default\s*\}\s*;?/, '') + wrapper;
writeFileSync(PATH, patched);
console.log(`[wrap-worker] wrapped default export (was ${exportName}) with cache-control override.`);
