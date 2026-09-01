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
    title: `${dict.footer.legal} ${SITE_NAME}`,
    description: dict.meta.legalDesc,
    pathForLocale: (l) => `/${l}/legal`,
  });
}

export default async function LegalPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  return (
    <div className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/legal`, label: dict.footer.legal },
      ]} />
      <article className="max-w-prose mt-6 prose-content">
        <h1 className="text-4xl font-semibold tracking-tightish">{dict.footer.legal}</h1>
        <h2>About this site</h2>
        <p>
          {SITE_NAME} is an editorial site providing research and guides on long-stay
          travel destinations. Information is provided for general guidance only and
          does not constitute legal, immigration, tax or financial advice. Always verify
          with the official sources linked on each visa page.
        </p>
        <h2>{dict.ui.page.affiliateDisclosure}</h2>
        <p>
          Some outbound links are affiliate links. If you sign up or buy through them,
          we may earn a commission at no extra cost to you. This never influences our
          rankings or recommendations.
        </p>
        <h2>Privacy</h2>
        <p>
          We use Vercel Analytics, which is GDPR-friendly and does not set cookies or
          collect personal information. We do not run third-party advertising cookies
          on this site.
        </p>
      </article>
    </div>
  );
}
