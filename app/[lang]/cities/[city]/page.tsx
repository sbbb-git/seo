import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata, SITE_URL } from '@/lib/seo';
import {
  getAllCities,
  getCity,
  getCityName,
  getCitiesByCountry,
} from '@/lib/data/cities';
import { getCountry, getCountryName } from '@/lib/data/countries';
import { getVisasByCountry } from '@/lib/data/visas';
import { PartnerStack } from '@/components/PartnerStack';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { VisaCard } from '@/components/VisaCard';
import { CityCard } from '@/components/CityCard';
import { GuideCard } from '@/components/GuideCard';
import { FaqSection } from '@/components/FaqSection';
import { cityFaqs } from '@/lib/faq-templates';
import { getGuidesForCity, getGuidesByTopic } from '@/lib/data/guides';
import { JobsCTA } from '@/components/JobsCTA';
import { HeroImage } from '@/components/HeroImage';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';
import { cityPhoto, flagSvg } from '@/lib/images';
import { WiseCTA } from '@/components/WiseCTA';

export const dynamicParams = false;
export const revalidate = 600;

type Props = { params: { lang: Locale; city: string } };

export function generateStaticParams() {
  const cities = getAllCities();
  return LOCALES.flatMap((lang) =>
    cities.map((c) => ({ lang, city: c.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCity(params.city);
  if (!city) return {};
  const dict = await getDictionary(params.lang);
  const name = getCityName(city, params.lang);
  const description = dict.meta.cityDescTpl
    .replace('{name}', name)
    .replace('{nomadScore}', String(city.nomadScore))
    .replace('{internetMbps}', String(city.internetMbps));
  return buildPageMetadata({
    locale: params.lang,
    title: `${name} ${dict.meta.cityTitleSuffix}`,
    description,
    pathForLocale: (l) => `/${l}/cities/${city.slug}`,
    ogType: 'article',
    ogImage: cityPhoto(city.slug),
  });
}

export default async function CityDetailPage({ params }: Props) {
  const city = getCity(params.city);
  if (!city) notFound();
  const dict = await getDictionary(params.lang);
  const country = getCountry(city.country);
  const name = getCityName(city, params.lang);
  const countryName = country ? getCountryName(country, params.lang) : city.country;
  const visas = country ? getVisasByCountry(country.slug) : [];
  const siblingCities = country
    ? getCitiesByCountry(country.slug).filter((c) => c.slug !== city.slug)
    : [];
  const guides = getGuidesForCity(city.slug);
  const relatedSlugs = new Set(guides.map((g) => g.slug));
  const workGuides = getGuidesByTopic('freelancing').filter((g) => !relatedSlugs.has(g.slug)).slice(0, 3);
  const toolGuides = getGuidesByTopic('tools').filter((g) => !relatedSlugs.has(g.slug)).slice(0, 3);
  const moreGuides = [...workGuides, ...toolGuides];

  const place = {
    '@context': 'https://schema.org',
    '@type': 'City',
    name,
    containedInPlace: country ? { '@type': 'Country', name: countryName } : undefined,
    url: `${SITE_URL}/${params.lang}/cities/${city.slug}`,
    description: city.highlight,
  };

  const stats = [
    { label: dict.country.costOfLiving, value: `Index ${city.costIndex} / 100` },
    { label: dict.country.internet, value: `${city.internetMbps} Mbps avg` },
    { label: dict.country.safety, value: `Index ${city.safetyIndex} / 100` },
    { label: dict.country.weather, value: `${city.tempMinC}° – ${city.tempMaxC}°C` },
  ];

  return (
    <article className="pb-14">
      <div className="pt-6">
        <Breadcrumbs items={[
          { href: `/${params.lang}`, label: dict.common.home },
          { href: `/${params.lang}/cities`, label: dict.nav.cities },
          { href: `/${params.lang}/cities/${city.slug}`, label: name },
        ]} />
      </div>

      <HeroImage
        slug={city.slug}
        src={cityPhoto(city.slug)}
        alt={`${name} digital nomad guide`}
        kicker={country ? countryName : undefined}
        title={name}
        titleSuffix={dict.meta.cityTitleSuffix}
        subtitle={`${city.highlight} · Nomad score ${city.nomadScore}/10 · ${city.coworkingCount}+ coworking spaces`}
        flagSrc={country ? flagSvg(country.code, 160) : undefined}
      />

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-line px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-muted">{s.label}</p>
            <p className="mt-1 font-semibold">{s.value}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="esim" />
        <PromoBanner locale={params.lang} variant="insurance" />
      </div>

      <SlateRemoteBanner
        locale={params.lang}
        countrySlug={country?.slug}
        countryName={country ? countryName : undefined}
        className="mt-8"
      />

      {city.neighborhoods.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tightish">{dict.detail.whereNomadsStay}</h2>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {city.neighborhoods.map((n) => (
              <li key={n} className="px-3 py-1 rounded-full border border-line">
                {n}
              </li>
            ))}
          </ul>
        </section>
      )}

      {visas.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">
            {dict.detail.visasFor} {countryName}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visas.map((v) => (
              <li key={v.slug}>
                <VisaCard visa={v} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {siblingCities.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">
            {dict.detail.otherCitiesIn} {countryName}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblingCities.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <CityCard city={c} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {guides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">
            {dict.nav.guides}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <GuideCard guide={g} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {moreGuides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">Working from {name}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {moreGuides.map((g) => (
              <li key={g.slug}>
                <GuideCard guide={g} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <JobsCTA locale={params.lang} cityName={name} countryName={country ? countryName : undefined} countrySlug={country?.slug} />
      <PartnerStack
        locale={params.lang}
        categories={['banking', 'insurance', 'esim', 'accommodation', 'vpn', 'travel-meta']}
        heading={`${dict.detail.setupBefore} — ${name}`}
      />
      <FaqSection faqs={cityFaqs(city, name, params.lang)} />
      <WiseCTA locale={params.lang} />
      <JsonLd data={place} />
    </article>
  );
}
