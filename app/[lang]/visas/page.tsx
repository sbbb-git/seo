import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { getAllVisas } from '@/lib/data/visas';
import { VisaCard } from '@/components/VisaCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';

export const runtime = 'edge';

type Props = { params: { lang: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return buildPageMetadata({
    locale: params.lang,
    title: `${dict.nav.visas} ${dict.meta.forNomads2026}`,
    description: dict.meta.visasDesc,
    pathForLocale: (l) => `/${l}/visas`,
  });
}

export default async function VisasIndexPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const visas = getAllVisas();

  return (
    <div className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/visas`, label: dict.nav.visas },
      ]} />
      <header className="max-w-3xl mt-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tightish">
          Digital nomad {dict.nav.visas.toLowerCase()}
        </h1>
        <p className="mt-3 text-muted">
          {visas.length} digital nomad and freelance visa programs, ranked by income threshold and ease.
        </p>
      </header>
      <section className="mt-10 rounded-2xl border border-line bg-paper-gradient px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tightish">{dict.ui.page.filterByPassport}</h2>
          <p className="mt-1 text-sm text-muted">8 passport profiles. US / EU / UK / CA / AU / IN / ZA / BR.</p>
        </div>
        <a
          href={`/${params.lang}/visas/for`}
          className="rounded-md bg-ink text-cream px-5 py-2.5 text-sm font-medium hover:bg-accent-deep transition-colors"
        >
          See by nationality →
        </a>
      </section>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visas.map((v) => (
          <li key={v.slug}>
            <VisaCard visa={v} locale={params.lang} />
          </li>
        ))}
      </ul>

      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="setup" />
        <PromoBanner locale={params.lang} variant="insurance" />
      </div>
      <SlateRemoteBanner locale={params.lang} className="mt-10" />
    </div>
  );
}
