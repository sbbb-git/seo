#!/usr/bin/env node
// Add `export const revalidate = 600` to every detail page so Next emits
// Cache-Control: s-maxage=600, stale-while-revalidate=... on the response.
// next.config.headers() can't override Next's default Cache-Control on
// prerendered pages; revalidate is the supported lever.
import { readFileSync, writeFileSync } from 'node:fs';

const TARGETS = [
  // SSG (currently `dynamicParams = false; revalidate = false`)
  ['app/[lang]/countries/[country]/page.tsx', 'ssg'],
  ['app/[lang]/cities/[city]/page.tsx', 'ssg'],
  ['app/[lang]/visas/[visa]/page.tsx', 'ssg'],
  // Edge dynamic (just `runtime = 'edge'`, no revalidate)
  ['app/[lang]/guides/[guide]/page.tsx', 'edge'],
  ['app/[lang]/best/[criterion]/page.tsx', 'edge'],
  ['app/[lang]/themes/[theme]/page.tsx', 'edge'],
  ['app/[lang]/regions/[region]/page.tsx', 'edge'],
  ['app/[lang]/seasonal/[season]/page.tsx', 'edge'],
  ['app/[lang]/for/[role]/page.tsx', 'edge'],
  ['app/[lang]/coworking/[city]/page.tsx', 'edge'],
  ['app/[lang]/visas/for/[nationality]/page.tsx', 'edge'],
  ['app/[lang]/visas/type/[type]/page.tsx', 'edge'],
  ['app/[lang]/compare/[pair]/page.tsx', 'edge'],
  ['app/[lang]/cost-of-living/[city]/page.tsx', 'edge'],
];

for (const [f, kind] of TARGETS) {
  let src = readFileSync(f, 'utf8');
  if (src.includes('export const revalidate = 600;')) {
    console.log(`skip ${f} (already set)`);
    continue;
  }
  if (kind === 'ssg') {
    // Replace `export const revalidate = false;` with `revalidate = 600;`.
    const next = src.replace(
      /^export const revalidate = false;$/m,
      'export const revalidate = 600;',
    );
    if (next === src) {
      console.error(`  no SSG revalidate marker found in ${f}`);
      continue;
    }
    writeFileSync(f, next);
  } else {
    // Insert revalidate after the `runtime = 'edge'` line.
    const next = src.replace(
      /(^export const runtime = 'edge';)$/m,
      `$1\nexport const revalidate = 600;`,
    );
    if (next === src) {
      console.error(`  no runtime='edge' marker found in ${f}`);
      continue;
    }
    writeFileSync(f, next);
  }
  console.log(`updated ${f} (${kind})`);
}
