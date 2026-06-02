import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';

export const config = {
  // Match every path except Next assets, the IndexNow key, static files, llms.txt, /og
  matcher: ['/((?!_next|api|sitemap.xml|robots.txt|icon.svg|llms.txt|opengraph-image|og|.*\\.[a-z0-9]+$).*)'],
};

// All pages are public, deterministic per URL — safe to cache at the edge.
// Browsers revalidate (max-age=0); Cloudflare keeps a 10-min cache and
// serves stale up to 24h while it refreshes.
const PAGE_CACHE = 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // If path is already prefixed by a locale, pass through and add edge cache.
  const first = pathname.split('/')[1];
  if ((LOCALES as readonly string[]).includes(first)) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', PAGE_CACHE);
    return res;
  }
  // Otherwise redirect (root or any unprefixed path) to the default locale
  // (English) as a permanent 308 — preserves the method and signals to
  // crawlers that this canonical location is stable.
  const target = new URL(`/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`, req.url);
  return NextResponse.redirect(target, 308);
}
