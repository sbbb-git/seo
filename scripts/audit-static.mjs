// Offline audit of prerendered SSG HTML in .next/server/app — no server needed.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const LOCALES = ['en', 'fr', 'es', 'pt', 'it', 'de', 'pl'];
const ROOT = '.next/server/app';

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const htmlFiles = walk(ROOT);

// Map: route path (e.g. /en/countries/portugal) -> true
const validRoutes = new Set();
for (const f of htmlFiles) {
  const route = f.replace(ROOT, '').replace(/\.html$/, '');
  validRoutes.add(route === '/index' ? '/' : route);
}

// Known dynamic (non-prerendered, edge) route patterns that are valid but have no .html.
// Detail pages that are now edge-rendered render on demand at request time.
const DYN_INDEX = new Set([
  '', 'countries', 'cities', 'visas', 'guides', 'compare', 'regions', 'about',
  'contact', 'legal', 'finder', 'best', 'cost-of-living', 'glossary', 'themes',
  'visas/for', 'seasonal', 'search', 'tools', 'for', 'coworking',
]);
const DYN_DETAIL_PREFIX = [
  'guides/', 'best/', 'themes/', 'regions/', 'seasonal/', 'for/',
  'coworking/', 'compare/', 'cost-of-living/', 'visas/for/', 'visas/type/',
];
const dynamicValid = (p) => {
  const parts = p.split('/').filter(Boolean); // [lang, ...]
  if (parts.length < 1) return false;
  if (!LOCALES.includes(parts[0])) return false;
  const rest = parts.slice(1).join('/');
  if (DYN_INDEX.has(rest)) return true;
  return DYN_DETAIL_PREFIX.some((pre) => rest.startsWith(pre));
};

const titleLen = (h) => { const m = h.match(/<title>([^<]*)<\/title>/i); return m ? decode(m[1]).length : null; };
const descLen = (h) => { const m = h.match(/<meta name="description" content="([^"]*)"/i); return m ? decode(m[1]).length : null; };
const htmlLang = (h) => { const m = h.match(/<html[^>]*\blang="([^"]+)"/i); return m ? m[1] : null; };
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&hellip;|…/g, '…');
function ogCheck(h) { const has = (p) => new RegExp(`property="${p}"`, 'i').test(h); return { title: has('og:title'), desc: has('og:description'), image: has('og:image'), url: has('og:url'), type: has('og:type') }; }
function hreflangs(h) { return [...h.matchAll(/rel="alternate"[^>]*hreflang="([^"]+)"/gi)].map((m) => m[1]); }
function internalLinks(h) {
  return [...h.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1])
    .filter((p) => !p.startsWith('//') && !/\.(png|jpg|jpeg|svg|ico|css|js|txt|xml|webmanifest|json)$/i.test(p))
    .map((p) => (p.length > 1 ? p.replace(/\/$/, '') : p));
}

const issues = { titleLong: [], descShort: [], descLong: [], ogIncomplete: [], langMismatch: [] };
const linkSources = new Map();
let n = 0;

for (const f of htmlFiles) {
  if (f.endsWith('_not-found.html')) continue;
  const route = f.replace(ROOT, '').replace(/\.html$/, '');
  const lang = route.split('/').filter(Boolean)[0];
  const h = readFileSync(f, 'utf8');
  const t = titleLen(h), d = descLen(h), og = ogCheck(h), hl = htmlLang(h), hf = hreflangs(h);
  if (t && t > 60) issues.titleLong.push(`${route} (${t})`);
  if (d != null && d < 110) issues.descShort.push(`${route} (${d})`);
  if (d != null && d > 158) issues.descLong.push(`${route} (${d})`);
  if (!og.title || !og.desc || !og.image || !og.url || !og.type) issues.ogIncomplete.push(`${route} ${JSON.stringify(og)}`);
  if (hl !== lang || !hf.includes(lang)) issues.langMismatch.push(`${route} htmlLang=${hl} hreflangs=[${hf.join(',')}]`);
  for (const p of new Set(internalLinks(h))) {
    let s = linkSources.get(p); if (!s) { s = new Set(); linkSources.set(p, s); }
    if (s.size < 5) s.add(route);
  }
  if (++n % 500 === 0) console.error(`  scanned ${n}/${htmlFiles.length}`);
}

console.log(`Scanned ${n} prerendered pages.\n`);
for (const [k, v] of Object.entries(issues)) {
  console.log(`${k}: ${v.length}`);
  v.slice(0, 12).forEach((x) => console.log(`   - ${x}`));
}

// Broken-link check: a link is broken if it's neither a prerendered route nor a known dynamic route.
const links = [...linkSources.keys()];
const broken = links.filter((p) => !validRoutes.has(p) && !dynamicValid(p));
console.log(`\nunique internal link targets: ${links.length}`);
console.log(`broken internal links (no matching route): ${broken.length}`);
broken.sort().slice(0, 80).forEach((p) => {
  const src = [...(linkSources.get(p) || [])].slice(0, 3);
  console.log(`   - ${p}   <- ${src.join(' , ')}`);
});
