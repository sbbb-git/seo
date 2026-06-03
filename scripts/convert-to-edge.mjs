#!/usr/bin/env node
// Convert secondary detail page routes from SSG to edge Dynamic.
// next-on-pages 1.13.16 crashes ("Invalid string length") on 8000+
// prerendered routes — we keep countries/cities/visas as SSG (highest
// SEO value), demote the rest. Middleware Cache-Control still caches
// these at the edge for 10 min + SWR.
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  'app/[lang]/guides/[guide]/page.tsx',
  'app/[lang]/best/[criterion]/page.tsx',
  'app/[lang]/themes/[theme]/page.tsx',
  'app/[lang]/regions/[region]/page.tsx',
  'app/[lang]/seasonal/[season]/page.tsx',
  'app/[lang]/for/[role]/page.tsx',
  'app/[lang]/coworking/[city]/page.tsx',
  'app/[lang]/visas/for/[nationality]/page.tsx',
  'app/[lang]/visas/type/[type]/page.tsx',
  'app/[lang]/compare/[pair]/page.tsx',
  'app/[lang]/cost-of-living/[city]/page.tsx',
];

for (const f of FILES) {
  let src = readFileSync(f, 'utf8');
  const before = src.length;

  // 1) Replace the two SSG markers with `export const runtime = 'edge';`
  src = src.replace(
    /^export const dynamicParams = false;\nexport const revalidate = false;$/m,
    "export const runtime = 'edge';",
  );

  // 2) Remove generateStaticParams (multi-line function — match brace-balanced block).
  src = src.replace(
    /\nexport function generateStaticParams\(\)[\s\S]*?\n\}\n/m,
    '\n',
  );

  if (src.length === before) {
    console.error(`  no change applied to ${f} — manual check needed`);
    continue;
  }
  writeFileSync(f, src);
  console.log(`converted ${f}`);
}
