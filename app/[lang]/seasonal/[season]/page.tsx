import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import {
  getAllSeasons,
  getSeason,
  getSeasonTitle,
  getCitiesForSeason,
  getCountriesForSeason,
} from '@/lib/data/seasons';
import { CityCard } from '@/components/CityCard';
import { CountryCard } from '@/components/CountryCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PartnerStack } from '@/components/PartnerStack';
import { JobsCTA } from '@/components/JobsCTA';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';

export const runtime = 'edge';
export const revalidate = 600;

type Props = { params: { lang: Locale; season: string } };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSeason(params.season);
  if (!s) return {};
  return buildPageMetadata({
    locale: params.lang,
    title: getSeasonTitle(s, params.lang),
    description: s.description,
    pathForLocale: (l) => `/${l}/seasonal/${s.slug}`,
  });
}

export default async function SeasonDetailPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const s = getSeason(params.season);
  if (!s) notFound();
  const title = getSeasonTitle(s, params.lang);
  const cities = getCitiesForSeason(s);
  const countries = getCountriesForSeason(s);

  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/seasonal`, label: dict.nav.bySeason },
        { href: `/${params.lang}/seasonal/${s.slug}`, label: title },
      ]} />

      <header className="max-w-3xl mt-4">
        <p className="text-xs uppercase tracking-widest text-accent-deep font-semibold">{s.months.join(' · ')}</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tightish font-display">{title}</h1>
        <p className="mt-3 text-lg text-muted leading-relaxed">{s.description}</p>
      </header>

      {cities.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">Cities at their best</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.slice(0, 18).map((c) => (
              <li key={c.slug}>
                <CityCard city={c} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {countries.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">Countries to base in</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countries.slice(0, 18).map((c) => (
              <li key={c.slug}>
                <CountryCard country={c} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="esim" />
        <PromoBanner locale={params.lang} variant="insurance" />
      </div>
      <SlateRemoteBanner locale={params.lang} className="mt-8" />
      <JobsCTA locale={params.lang} />
      <PartnerStack
        locale={params.lang}
        categories={['travel-meta', 'accommodation', 'insurance', 'esim', 'banking']}
      />
    </article>
  );
}
