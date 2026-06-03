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

const SCANNER_EXCLUDES = [
  '/c7468c4053484ae9ba32038f762f4085.txt',
  // WordPress probes
  '/wp-admin/*', '/wp-login.php', '/wp-content/*', '/wordpress/*',
  '/wp-config.php*', '/wp-includes/*', '/wp-json/*', '/xmlrpc.php',
  '/administrator/*',
  // Dotfile probes
  '/.env*', '/.git/*', '/.gitattributes', '/.gitignore', '/.gitmodules',
  '/.aws/*', '/.svn/*', '/.docker/*', '/.vscode/*', '/.idea/*',
  '/.htaccess', '/.htpasswd', '/.s3cfg',
  // API/env exposures
  '/api/.env*', '/api/config*', '/api/v1/.env*',
  '/app/.env*', '/server/.env*', '/server/config/*',
  '/shop/.env*', '/qa/.env*', '/dev/.env*', '/developer/.env*',
  '/backend/.env*', '/backend/constant.js', '/admin/config/*',
  '/erp/*', '/stripe/*', '/webhooks/*', '/aws/*', '/oauth/*',
  // Common app paths probed for leaks
  '/sites/*', '/storage/*', '/var/*', '/laravel/*', '/node/*',
  '/config/*.php', '/config/*.json', '/configs/*', '/conf/*',
  '/secret*', '/credentials*', '/credentials.js', '/database*',
  '/infos.php', '/info.php', '/phpinfo.php', '/test.php',
  '/composer.json', '/composer.lock',
  '/Gemfile*', '/Dockerfile', '/dockerfile',
  '/compose.yaml', '/docker-compose*',
  '/appsettings*.json', '/web.config', '/database.yml',
  '/secrets.yml', '/secrets.json',
  '/cgi-bin/*', '/s3.key', '/package-updates/*',
  '/var/task/*', '/software/update.cgi', '/index.js',
  // Generic SaaS app patterns scanners probe
  '/rest/*', '/v2/*', '/[tenant]/*', '/[id]',
];

const TARGET = '.vercel/output/static/_routes.json';

if (!existsSync(TARGET)) {
  console.error(`[finalize-routes] target ${TARGET} missing — did next-on-pages run?`);
  process.exit(1);
}

const target = JSON.parse(readFileSync(TARGET, 'utf8'));
const existing = new Set(target.exclude || []);
const before = existing.size;
for (const p of SCANNER_EXCLUDES) existing.add(p);

const merged = {
  version: target.version || 1,
  description: 'Route everything through Next except known scanner paths (served as static 404).',
  include: target.include?.length ? target.include : ['/*'],
  exclude: [...existing],
};

const total = (merged.include?.length || 0) + (merged.exclude?.length || 0);
if (total > 100) {
  console.error(`[finalize-routes] WARNING: ${total} rules total — Cloudflare's hard cap is 100.`);
}

writeFileSync(TARGET, JSON.stringify(merged, null, 2));
console.log(`[finalize-routes] target had ${before} excludes; final has ${merged.exclude.length}.`);
