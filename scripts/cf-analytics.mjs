#!/usr/bin/env node
// Pulls a quick Cloudflare analytics snapshot for slowmadly.com.
// Run with the read-only zone token in CLOUDFLARE_API_TOKEN env var.
// Usage: CLOUDFLARE_API_TOKEN=cfut_... node scripts/cf-analytics.mjs

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
if (!TOKEN) {
  console.error('Missing CLOUDFLARE_API_TOKEN. Set it before running.');
  process.exit(1);
}
const ZONE = '48262f0f82c8ec8aba64cd5f17e75a81';
const SINCE = new Date(Date.now() - 23 * 3600 * 1000).toISOString().replace(/\.\d{3}/, '');

async function gql(query) {
  const r = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0].message);
  return j.data.viewer.zones[0];
}

function fmt(rows) {
  return rows.map((r) => {
    const dims = Object.entries(r.dimensions || {}).map(([k, v]) => `${k}=${String(v).slice(0, 80)}`).join(' ');
    return `${String(r.count).padStart(7)}  ${dims}`;
  }).join('\n');
}

console.log(`Cloudflare analytics — slowmadly.com — last 23h since ${SINCE}\n`);

// 1) Total traffic + cache breakdown for 200s.
const cache = (await gql(`{ viewer { zones(filter: {zoneTag: "${ZONE}"}) {
  httpRequestsAdaptiveGroups(limit: 10, filter: {datetime_geq: "${SINCE}", edgeResponseStatus: 200}, orderBy: [count_DESC]) {
    count dimensions { cacheStatus }
  } } } }`)).httpRequestsAdaptiveGroups;
const total200 = cache.reduce((s, x) => s + x.count, 0);
const hits = cache.filter((x) => ['hit', 'revalidated'].includes(x.dimensions.cacheStatus)).reduce((s, x) => s + x.count, 0);
const hitRatio = total200 ? ((hits / total200) * 100).toFixed(1) : '0';
console.log('CACHE STATUS (200s)');
console.log(fmt(cache));
console.log(`\n  -> ${total200} total 200s, ${hits} hit/revalidated -> hit ratio ${hitRatio}%\n`);

// 2) HTTP status breakdown.
const status = (await gql(`{ viewer { zones(filter: {zoneTag: "${ZONE}"}) {
  httpRequestsAdaptiveGroups(limit: 15, filter: {datetime_geq: "${SINCE}"}, orderBy: [count_DESC]) {
    count dimensions { edgeResponseStatus }
  } } } }`)).httpRequestsAdaptiveGroups;
console.log('HTTP STATUS');
console.log(fmt(status));
console.log();

// 3) Top 25 paths (status 200).
const paths = (await gql(`{ viewer { zones(filter: {zoneTag: "${ZONE}"}) {
  httpRequestsAdaptiveGroups(limit: 25, filter: {datetime_geq: "${SINCE}", edgeResponseStatus: 200}, orderBy: [count_DESC]) {
    count dimensions { clientRequestPath }
  } } } }`)).httpRequestsAdaptiveGroups;
console.log('TOP 25 PATHS (200)');
console.log(fmt(paths));
console.log();

// 4) Top 4xx paths (the noise from scanners).
const errs = (await gql(`{ viewer { zones(filter: {zoneTag: "${ZONE}"}) {
  httpRequestsAdaptiveGroups(limit: 15, filter: {datetime_geq: "${SINCE}", edgeResponseStatus_geq: 400, edgeResponseStatus_lt: 500}, orderBy: [count_DESC]) {
    count dimensions { clientRequestPath edgeResponseStatus }
  } } } }`)).httpRequestsAdaptiveGroups;
console.log('TOP 15 4xx PATHS');
console.log(fmt(errs));
console.log();

// 5) Top countries (real-people split).
const countries = (await gql(`{ viewer { zones(filter: {zoneTag: "${ZONE}"}) {
  httpRequestsAdaptiveGroups(limit: 12, filter: {datetime_geq: "${SINCE}"}, orderBy: [count_DESC]) {
    count dimensions { clientCountryName }
  } } } }`)).httpRequestsAdaptiveGroups;
console.log('TOP COUNTRIES');
console.log(fmt(countries));
