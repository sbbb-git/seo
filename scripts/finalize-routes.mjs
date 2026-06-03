#!/usr/bin/env node
// Run AFTER `@cloudflare/next-on-pages` and BEFORE `wrangler pages deploy`.
// next-on-pages always overwrites both public/_routes.json AND
// .vercel/output/static/_routes.json with a minimal
// { include:["/*"], exclude:["/_next/static/*"] } — so we cannot rely on
// the source file at this point. Keep the canonical scanner-exclusion
// list inline here.
//
// When these patterns match an incoming request, Cloudflare Pages skips
// the Next Worker entirely and serves a static 404 from the assets layer.
// That spares edge-function invocations on tens of thousands of monthly
// vulnerability-scanner probes.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// Cloudflare Pages rejects an exclude list where any wildcard rule overlaps
// another rule. Keep patterns disjoint: prefer the broader wildcard and drop
// any sibling literal it already catches (eg. /secret* covers /secrets.yml).
const SCANNER_EXCLUDES = [
  '/c7468c4053484ae9ba32038f762f4085.txt',
  // WordPress probes
  '/wp-admin/*', '/wp-login.php', '/wp-content/*', '/wp-includes/*',
  '/wp-json/*', '/wp-config.php*', '/wordpress/*', '/xmlrpc.php',
  '/administrator/*',
  // Dotfiles (root level)
  '/.env*', '/.git/*', '/.gitattributes', '/.gitignore', '/.gitmodules',
  '/.aws/*', '/.svn/*', '/.docker/*', '/.vscode/*', '/.idea/*',
  '/.htaccess', '/.htpasswd', '/.s3cfg',
  // App/env exposures
  '/api/.env*', '/api/config*', '/api/v1/.env*',
  '/app/.env*', '/server/.env*', '/server/config/*',
  '/shop/.env*', '/qa/.env*', '/dev/.env*', '/developer/.env*',
  '/backend/.env*', '/backend/constant.js', '/admin/config/*',
  // SaaS / cloud paths
  '/erp/*', '/stripe/*', '/webhooks/*', '/aws/*', '/oauth/*',
  // Common deploy / framework probes (broader wildcards swallow siblings)
  '/sites/*', '/storage/*', '/var/*', '/laravel/*', '/node/*',
  '/config/*.php', '/config/*.json', '/configs/*', '/conf/*',
  '/secret*', '/credentials*', '/database*',
  '/infos.php', '/info.php', '/phpinfo.php', '/test.php',
  '/composer.json', '/composer.lock',
  '/Gemfile*', '/Dockerfile', '/dockerfile',
  '/compose.yaml', '/docker-compose*',
  '/appsettings*', '/web.config',
  '/cgi-bin/*', '/s3.key', '/package-updates/*',
  '/software/update.cgi', '/index.js',
  // Generic SaaS app patterns scanners probe
  '/rest/*', '/v2/*',
];

const TARGET = '.vercel/output/static/_routes.json';

if (!existsSync(TARGET)) {
  console.error(`[finalize-routes] target ${TARGET} missing — did next-on-pages run?`);
  process.exit(1);
}

const target = JSON.parse(readFileSync(TARGET, 'utf8'));
const before = (target.exclude || []).length;

// Replace, don't merge — keep only the system-required excludes (next-on-pages
// always emits /_next/static/*) plus our canonical scanner list. Merging would
// preserve stale overlapping entries from a previous build.
const REQUIRED_EXCLUDES = ['/_next/static/*'];
const exclude = [...new Set([...REQUIRED_EXCLUDES, ...SCANNER_EXCLUDES])];

const merged = {
  version: target.version || 1,
  description: 'Route everything through Next except known scanner paths (served as static 404).',
  include: target.include?.length ? target.include : ['/*'],
  exclude,
};

const total = (merged.include?.length || 0) + (merged.exclude?.length || 0);
if (total > 100) {
  console.error(`[finalize-routes] WARNING: ${total} rules total — Cloudflare's hard cap is 100.`);
}

// Cloudflare Pages rejects the deploy if any rule with a trailing/wildcard *
// overlaps another rule in the same list. Catch this here so a bad edit
// surfaces in local builds instead of in a failed CI deploy.
function matchesPattern(pattern, path) {
  if (pattern === path) return true;
  if (!pattern.includes('*')) return false;
  // Translate Cloudflare-style glob into a regex anchored at the start.
  const re = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
  return re.test(path);
}
const overlaps = [];
for (let i = 0; i < merged.exclude.length; i++) {
  const a = merged.exclude[i];
  for (let j = i + 1; j < merged.exclude.length; j++) {
    const b = merged.exclude[j];
    if (a === b) continue;
    if (matchesPattern(a, b) || matchesPattern(b, a)) overlaps.push([a, b]);
  }
}
if (overlaps.length > 0) {
  console.error('[finalize-routes] ERROR: overlapping exclude patterns:');
  for (const [a, b] of overlaps) console.error(`  ${a}  <->  ${b}`);
  process.exit(1);
}

writeFileSync(TARGET, JSON.stringify(merged, null, 2));
console.log(`[finalize-routes] target had ${before} excludes; final has ${merged.exclude.length} (no overlaps).`);
