import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { buildPageMetadata, SITE_NAME } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const runtime = 'edge';

type Props = { params: { lang: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return buildPageMetadata({
    locale: params.lang,
    title: `${dict.nav.about} ${SITE_NAME}`,
    description: dict.meta.aboutDesc.replace('{site}', SITE_NAME),
    pathForLocale: (l) => `/${l}/about`,
  });
}

export default async function AboutPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  return (
    <div className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/about`, label: dict.nav.about },
      ]} />
      <article className="max-w-prose mt-6 prose-content">
        <h1 className="text-4xl font-semibold tracking-tightish">{dict.nav.about}</h1>
        <p>
          {SITE_NAME} is a research project documenting the countries and cities that
          welcome long-stay travelers in 2026. We track digital nomad visas, cost of
          living, internet speed, safety and weather to help you pick a basecamp that
          fits the way you actually work.
        </p>
        <p>
          We focus on slow travel: 1 to 12 months in one place instead of 3 days in
          ten cities. The data is reviewed quarterly. The guides are written without
          recycling press releases.
        </p>
        <h2>{dict.ui.page.affiliateDisclosure}</h2>
        <p>
          Some links on this site are affiliate links. If you sign up through one of
          them we may earn a small commission at no extra cost to you. We only feature
          tools we would use or have used ourselves.
        </p>
      </article>
    </div>
  );
}
