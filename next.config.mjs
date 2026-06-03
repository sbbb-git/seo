/** @type {import('next').NextConfig} */
const SECURITY = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
// Override Next's default `max-age=0, must-revalidate` on locale pages so
// Cloudflare can edge-cache them (s-maxage=600 + 24h stale-while-revalidate).
// Middleware can't override the page handler's Cache-Control; next.config
// headers() can.
const PAGE_CACHE = 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  experimental: {
    optimizePackageImports: ['gray-matter'],
  },
  async headers() {
    return [
      // All locale-prefixed pages — short browser cache, long edge cache.
      {
        source: '/:lang(en|fr|es|pt|it|de|pl)/:path*',
        headers: [...SECURITY, { key: 'Cache-Control', value: PAGE_CACHE }],
      },
      // Locale root pages (e.g. /en).
      {
        source: '/:lang(en|fr|es|pt|it|de|pl)',
        headers: [...SECURITY, { key: 'Cache-Control', value: PAGE_CACHE }],
      },
      // Edge utility endpoints.
      { source: '/og', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' }] },
      { source: '/sitemap.xml', headers: [{ key: 'Cache-Control', value: 'public, max-age=600, s-maxage=600' }] },
      { source: '/robots.txt', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' }] },
      { source: '/llms.txt', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' }] },
      { source: '/feed.xml', headers: [{ key: 'Cache-Control', value: 'public, max-age=600, s-maxage=600' }] },
      // Security headers on everything else.
      { source: '/:path*', headers: SECURITY },
    ];
  },
};

export default nextConfig;
