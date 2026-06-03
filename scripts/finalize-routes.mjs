#!/usr/bin/env node
// Run AFTER `@cloudflare/next-on-pages` and BEFORE `wrangler pages deploy`.
// next-on-pages always overwrites .vercel/output/static/_routes.json with
// a minimal { include:["/*"], exclude:["/_next/static/*"] }. We want our
// custom scanner-exclusion list (from public/_routes.json) merged into
// the built file so vulnerability scanners hitting /wp-admin, /.env, etc.
// skip the Worker entirely and get a static 404 from the assets layer.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SOURCE = 'public/_routes.json';
const TARGET = '.vercel/output/static/_routes.json';

if (!existsSync(SOURCE)) {
  console.error(`[finalize-routes] source ${SOURCE} missing — nothing to merge.`);
  process.exit(0);
}
if (!existsSync(TARGET)) {
  console.error(`[finalize-routes] target ${TARGET} missing — did next-on-pages run?`);
  process.exit(1);
}

const source = JSON.parse(readFileSync(SOURCE, 'utf8'));
const target = JSON.parse(readFileSync(TARGET, 'utf8'));

const merged = {
  version: target.version || source.version || 1,
  description: source.description || target.description,
  include: target.include?.length ? target.include : (source.include || ['/*']),
  exclude: [...new Set([...(target.exclude || []), ...(source.exclude || [])])],
};

// Cloudflare Pages caps total rules; warn if we go above 100.
const total = (merged.include?.length || 0) + (merged.exclude?.length || 0);
if (total > 100) {
  console.error(`[finalize-routes] WARNING: ${total} rules total — Cloudflare's hard cap is 100.`);
}

writeFileSync(TARGET, JSON.stringify(merged, null, 2));
console.log(`[finalize-routes] merged ${source.exclude?.length || 0} exclusions from source; final exclude=${merged.exclude.length}.`);
