import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { getAllCities } from '@/lib/data/cities';
import { getAllCountries } from '@/lib/data/countries';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CitiesFilters } from '@/components/CitiesFilters';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';
import { PromoBanner } from '@/components/PromoBanner';

export const runtime = 'edge';

type Props = { params: { lang: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return buildPageMetadata({
    locale: params.lang,
    title: `${dict.nav.cities} ${dict.meta.forNomads2026}`,
    description: dict.meta.citiesDesc,
    pathForLocale: (l) => `/${l}/cities`,
  });
}

export default async function CitiesIndexPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const cities = getAllCities();
  const countries = getAllCountries();

  return (
    <div className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/cities`, label: dict.nav.cities },
      ]} />
      <header className="max-w-3xl mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tightish">
            {dict.nav.cities}
          </h1>
          <p className="mt-3 text-muted">
            {cities.length} cities ranked for digital nomads in 2026. Filter, sort, find your basecamp.
          </p>
        </div>
        <Link
          href={`/${params.lang}/finder`}
          className="inline-flex items-center gap-2 rounded-md bg-accent text-cream px-5 py-2.5 text-sm font-semibold hover:bg-accent-deep transition-colors whitespace-nowrap"
        >
          {dict.detail.takeQuiz} →
        </Link>
      </header>

      <div className="mt-10">
        <CitiesFilters cities={cities} countries={countries} locale={params.lang} ui={dict.ui.filters} />
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="esim" />
        <PromoBanner locale={params.lang} variant="insurance" />
      </div>

      <SlateRemoteBanner locale={params.lang} className="mt-10" />
    </div>
  );
}
