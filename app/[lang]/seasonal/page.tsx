import Link from 'next/link';
import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { getAllSeasons, getSeasonTitle } from '@/lib/data/seasons';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';

export const runtime = 'edge';

type Props = { params: { lang: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return buildPageMetadata({
    locale: params.lang,
    title: dict.meta.seasonalTitle,
    description: dict.meta.seasonalDesc,
    pathForLocale: (l) => `/${l}/seasonal`,
  });
}

export default async function SeasonalIndexPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const seasons = getAllSeasons();
  return (
    <div className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/seasonal`, label: dict.nav.bySeason },
      ]} />
      <header className="max-w-3xl mt-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tightish font-display">By season</h1>
        <p className="mt-3 text-muted">{dict.ui.page.seasonalIntro}</p>
      </header>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {seasons.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/${params.lang}/seasonal/${s.slug}`}
              className="block rounded-xl border border-line bg-paper px-6 py-5 card-hover"
            >
              <p className="text-xs uppercase tracking-widest text-accent-deep font-semibold">{s.months.join(' · ')}</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tightish font-display">
                {getSeasonTitle(s, params.lang)}
              </h2>
              <p className="mt-2 text-sm text-muted">{s.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="esim" />
        <PromoBanner locale={params.lang} variant="insurance" />
      </div>
      <SlateRemoteBanner locale={params.lang} className="mt-10" />
    </div>
  );
}
