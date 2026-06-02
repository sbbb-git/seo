import { getAllGuides, getGuideTitle, getGuideDescription } from '@/lib/data/guides';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

export const runtime = 'edge';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const guides = getAllGuides();
  const lastBuild = new Date().toUTCString();
  const items = guides
    .map((g) => {
      const title = escapeXml(getGuideTitle(g, 'en'));
      const desc = escapeXml(getGuideDescription(g, 'en'));
      const link = `${SITE_URL}/en/guides/${g.slug}`;
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${desc}</description>
      <category>${escapeXml(g.topic)}</category>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Guides for digital nomads</title>
    <link>${SITE_URL}/en/guides</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Country, city, visa, tax and tooling guides for long-stay digital nomads.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
}
