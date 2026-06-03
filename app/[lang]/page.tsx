import Link from 'next/link';
import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { buildPageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import { getTopCities } from '@/lib/data/cities';
import { getAllCountries, getCountry, getCountryName } from '@/lib/data/countries';
import { getAllVisas } from '@/lib/data/visas';
import { getAllGuides } from '@/lib/data/guides';
import { getAllCriteria, getCriterionTitle } from '@/lib/data/criteria';
import { CityCard } from '@/components/CityCard';
import { CountryCard } from '@/components/CountryCard';
import { VisaCard } from '@/components/VisaCard';
import { GuideCard } from '@/components/GuideCard';
import { JsonLd } from '@/components/JsonLd';
import { LogoMark } from '@/components/Logo';
import { flagEmoji } from '@/lib/flag';
import { cityPhoto, countryPhoto, flagSvg } from '@/lib/images';
import { getCity, getCityName } from '@/lib/data/cities';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';
import { FiverrCTA } from '@/components/FiverrCTA';

export const runtime = 'edge';

type Props = { params: { lang: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return buildPageMetadata({
    locale: params.lang,
    title: dict.home.heroTitle,
    description: dict.home.heroSubtitle,
    pathForLocale: (l) => `/${l}`,
  });
}

export default async function HomePage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const cities = getTopCities(9);
  const visas = getAllVisas().slice(0, 6);
  const guides = getAllGuides().slice(0, 6);
  const countries = getAllCountries();
  const trendingCountries = countries.filter((c) => c.tags.includes('trending')).slice(0, 5);
  const criteria = getAllCriteria().slice(0, 6);

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: params.lang,
    description: dict.home.heroSubtitle,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${params.lang}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
  };

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: dict.home.heroSubtitle,
  };

  // Pick a featured city for the hero background (top nomad score with a real photo)
  const featuredCity = cities.find((c) => cityPhoto(c.slug)) || cities[0];
  const featuredPhoto = featuredCity ? cityPhoto(featuredCity.slug) : undefined;

  return (
    <>
      {/* Hero — full bleed photo background */}
      <section className="relative -mx-5 sm:-mx-8 overflow-hidden">
        <div className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center">
          {featuredPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featuredPhoto}
              alt=""
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-ink/85 via-ink/60 to-ink/40" />
          <div className="absolute inset-0 bg-noise opacity-30" />

          <div className="relative max-w-container w-full mx-auto px-5 sm:px-8 py-20 sm:py-24 grid lg:grid-cols-12 gap-10 items-center text-cream">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/15 backdrop-blur-sm text-cream text-xs font-semibold uppercase tracking-widest border border-cream/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {dict.home.curatedBadge}
              </div>
              <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tightest leading-[1.02] font-display">
                {dict.home.heroTitle}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-cream/85 leading-relaxed max-w-2xl">
                {dict.home.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/${params.lang}/finder`}
                  className="inline-flex items-center gap-2 rounded-md bg-accent text-cream px-6 py-3 text-sm font-semibold hover:bg-accent-deep transition-colors shadow-lg"
                >
                  {dict.home.findMyBestCity}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href={`/${params.lang}/cities`}
                  className="inline-flex items-center gap-2 rounded-md bg-cream text-ink px-6 py-3 text-sm font-semibold hover:bg-accent hover:text-cream transition-colors"
                >
                  {dict.home.exploreCities}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href={`/${params.lang}/visas`}
                  className="inline-flex items-center rounded-md border border-cream/30 text-cream px-6 py-3 text-sm font-semibold hover:bg-cream/10 transition-colors"
                >
                  {dict.nav.visas}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-cream/10 backdrop-blur-sm border border-cream/15 p-5">
                <p className="text-3xl font-semibold tracking-tightest text-cream">{countries.length}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream/70">{dict.home.countriesLabel}</p>
              </div>
              <div className="rounded-2xl bg-cream/10 backdrop-blur-sm border border-cream/15 p-5">
                <p className="text-3xl font-semibold tracking-tightest text-cream">{cities.length}+</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream/70">{dict.home.nomadCitiesLabel}</p>
              </div>
              <div className="rounded-2xl bg-cream/10 backdrop-blur-sm border border-cream/15 p-5">
                <p className="text-3xl font-semibold tracking-tightest text-cream">{visas.length}+</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream/70">{dict.home.nomadVisasLabel}</p>
              </div>
              <div className="rounded-2xl bg-cream/10 backdrop-blur-sm border border-cream/15 p-5">
                <p className="text-3xl font-semibold tracking-tightest text-cream">{guides.length}+</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-cream/70">{dict.home.longGuidesLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The pitch — three things this site does */}
      <section className="mt-16 grid gap-4 lg:grid-cols-3">
        <Link
          href={`/${params.lang}/finder`}
          className="group block rounded-2xl border border-line bg-paper p-6 card-hover"
        >
          <div className="text-2xl">🎯</div>
          <h3 className="mt-3 text-lg font-semibold tracking-tightish">{dict.home.pitchFinderTitle}</h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">{dict.home.pitchFinderText}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-accent">{dict.home.pitchFinderCta} →</span>
        </Link>
        <Link
          href={`/${params.lang}/cities`}
          className="group block rounded-2xl border border-line bg-paper p-6 card-hover"
        >
          <div className="text-2xl">🔍</div>
          <h3 className="mt-3 text-lg font-semibold tracking-tightish">{dict.home.pitchFilterTitle}</h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">{dict.home.pitchFilterText}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-accent">{dict.home.pitchFilterCta} →</span>
        </Link>
        <a
          href={`https://slateremote.com/${params.lang}`}
          target="_blank"
          rel="noopener"
          className="group block rounded-2xl border border-ink bg-ink text-cream p-6 card-hover"
        >
          <div className="text-2xl">💼</div>
          <h3 className="mt-3 text-lg font-semibold tracking-tightish">{dict.home.pitchJobsTitle}</h3>
          <p className="mt-2 text-sm text-cream/80 leading-relaxed">{dict.home.pitchJobsText}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-accent">{dict.home.pitchJobsCta} ↗</span>
        </a>
      </section>

      {/* High-revenue affiliate banners */}
      <section className="mt-12 grid gap-4 lg:grid-cols-3">
        <PromoBanner locale={params.lang} variant="setup" />
        <PromoBanner locale={params.lang} variant="insurance" />
        <PromoBanner locale={params.lang} variant="esim" />
      </section>

      {/* Trending */}
      {trendingCountries.length > 0 && (
        <section className="mt-20">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold">{dict.home.trendingKicker}</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tightish font-display">
                {dict.home.trendingTitle}
              </h2>
            </div>
            <Link
              href={`/${params.lang}/best/trending-countries`}
              className="text-sm text-accent hover:underline underline-offset-4"
            >
              {dict.home.seeAll} →
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {trendingCountries.map((c) => {
              const photo = countryPhoto(c.slug);
              const flag = flagSvg(c.code, 80);
              return (
                <li key={c.slug}>
                  <Link
                    href={`/${params.lang}/countries/${c.slug}`}
                    className="group relative block rounded-xl overflow-hidden border border-line h-44 card-hover"
                  >
                    {photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-between text-cream">
                      {flag && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={flag} alt="" width={32} height={24} className="rounded shadow-md self-start border border-cream/20" />
                      )}
                      <div>
                        <div className="font-semibold tracking-tightish">{getCountryName(c, params.lang)}</div>
                        <div className="mt-0.5 text-xs text-cream/70">{c.region}</div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Top cities */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightish font-display">{dict.home.topCities}</h2>
          <Link href={`/${params.lang}/cities`} className="text-sm text-accent hover:underline underline-offset-4">
            {dict.home.seeAll} →
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => (
            <li key={c.slug}>
              <CityCard city={c} locale={params.lang} />
            </li>
          ))}
        </ul>
      </section>

      {/* Browse by criterion */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightish font-display">{dict.home.browseByCriterion}</h2>
          <Link href={`/${params.lang}/best`} className="text-sm text-accent hover:underline underline-offset-4">
            {dict.home.allFilters} →
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {criteria.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${params.lang}/best/${c.slug}`}
                className="block rounded-xl border border-line bg-paper px-5 py-4 card-hover"
              >
                <h3 className="font-semibold tracking-tightish">{getCriterionTitle(c, params.lang)}</h3>
                <p className="mt-1 text-sm text-muted line-clamp-2">{c.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Visas */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightish font-display">{dict.home.digitalNomadVisas}</h2>
          <Link href={`/${params.lang}/visas`} className="text-sm text-accent hover:underline underline-offset-4">
            {dict.home.seeAll} →
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visas.map((v) => (
            <li key={v.slug}>
              <VisaCard visa={v} locale={params.lang} />
            </li>
          ))}
        </ul>
      </section>

      {/* Guides */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tightish font-display">{dict.home.longStayGuides}</h2>
          <Link href={`/${params.lang}/guides`} className="text-sm text-accent hover:underline underline-offset-4">
            {dict.home.seeAll} →
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <li key={g.slug}>
              <GuideCard guide={g} locale={params.lang} />
            </li>
          ))}
        </ul>
      </section>

      <SlateRemoteBanner locale={params.lang} className="mt-20" />

      {/* CTA strip */}
      <section className="mt-24 rounded-3xl bg-paper-gradient border border-line p-10 sm:p-14 text-center">
        <LogoMark size={48} className="text-accent mx-auto" />
        <h2 className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tightest font-display">
          {dict.home.ctaTitle}
        </h2>
        <p className="mt-3 text-muted max-w-xl mx-auto">
          {dict.home.ctaSubtitle}
        </p>
        <div className="mt-7">
          <Link
            href={`/${params.lang}/best`}
            className="inline-flex items-center gap-2 rounded-md bg-ink text-cream px-6 py-3 text-sm font-medium hover:bg-accent-deep transition-colors"
          >
            {dict.home.ctaButton} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <FiverrCTA locale={params.lang} />

      <JsonLd data={websiteLd} />
      <JsonLd data={organizationLd} />
    </>
  );
}
