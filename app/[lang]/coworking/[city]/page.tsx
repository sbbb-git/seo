import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { getAllCoworking, getCoworking } from '@/lib/data/coworking';
import { getCity, getCityName } from '@/lib/data/cities';
import { getCountry, getCountryName } from '@/lib/data/countries';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JobsCTA } from '@/components/JobsCTA';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';
import { PartnerStack } from '@/components/PartnerStack';

export const runtime = 'edge';

type Props = { params: { lang: Locale; city: string } };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const co = getCoworking(params.city);
  const city = getCity(params.city);
  if (!co || !city) return {};
  const dict = await getDictionary(params.lang);
  const name = getCityName(city, params.lang);
  const title = dict.meta.coworkingCityTitleTpl
    .replace('{name}', name)
    .replace('{count}', String(co.topSpaces.length));
  const description = dict.meta.coworkingCityDescTpl
    .replace('{name}', name)
    .replace('{min}', String(co.monthlyMin))
    .replace('{max}', String(co.monthlyPremium));
  return buildPageMetadata({
    locale: params.lang,
    title,
    description,
    pathForLocale: (l) => `/${l}/coworking/${co.citySlug}`,
  });
}

export default async function CoworkingDetailPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const co = getCoworking(params.city);
  const city = getCity(params.city);
  if (!co || !city) notFound();
  const name = getCityName(city, params.lang);
  const country = getCountry(city.country);
  const countryName = country ? getCountryName(country, params.lang) : city.country;

  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/coworking`, label: dict.nav.coworking },
        { href: `/${params.lang}/coworking/${co.citySlug}`, label: name },
      ]} />

      <header className="max-w-3xl mt-4">
        {country && (
          <Link
            href={`/${params.lang}/countries/${country.slug}`}
            className="text-sm uppercase tracking-widest text-muted hover:text-ink"
          >
            {countryName}
          </Link>
        )}
        <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tightish font-display">
          Best coworking in {name}
        </h1>
        <p className="mt-3 text-lg text-muted leading-relaxed">{co.note}</p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-muted">Budget</p>
          <p className="mt-1 text-2xl font-semibold">${co.monthlyMin}</p>
          <p className="text-xs text-muted">/month hot desk</p>
        </div>
        <div className="rounded-lg border border-line px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-muted">Average</p>
          <p className="mt-1 text-2xl font-semibold">${co.monthlyAvg}</p>
          <p className="text-xs text-muted">/month hot desk</p>
        </div>
        <div className="rounded-lg border border-line px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-muted">Premium</p>
          <p className="mt-1 text-2xl font-semibold">${co.monthlyPremium}</p>
          <p className="text-xs text-muted">/month private</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tightish">Top picks</h2>
        <ul className="mt-4 space-y-3">
          {co.topSpaces.map((s) => (
            <li key={s.name} className="rounded-xl border border-line bg-paper px-5 py-4">
              <p className="font-semibold tracking-tightish">{s.name}</p>
              <p className="mt-1 text-sm text-muted">{s.vibe}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">How to pick a space in {name}</h2>
        <p className="mt-3 text-muted leading-relaxed">
          Stay first in a co-living or short-stay rental near a central coworking cluster. Try
          day passes at 2-3 spaces before committing to a monthly. Visit during your peak working
          hours to test wifi load and the noise level. Most spaces offer a week trial.
        </p>
        <p className="mt-3 text-muted leading-relaxed">
          For the full local catalog including newer or smaller spaces, search{' '}
          <a
            href={`https://www.coworker.com/search/${co.citySlug.replace(/-/g, '+')}`}
            target="_blank"
            rel="noopener"
            className="text-accent underline underline-offset-4"
          >
            Coworker.com for {name}
          </a>.
        </p>
      </section>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="esim" />
        <PromoBanner locale={params.lang} variant="vpn" />
      </div>
      <SlateRemoteBanner locale={params.lang} countrySlug={country?.slug} countryName={countryName} className="mt-8" />
      <JobsCTA locale={params.lang} cityName={name} countryName={countryName} countrySlug={country?.slug} />
      <PartnerStack
        locale={params.lang}
        categories={['productivity', 'ai-llm', 'voice-ai', 'esim', 'vpn']}
        heading="Tools we use on coworking days"
      />
    </article>
  );
}
