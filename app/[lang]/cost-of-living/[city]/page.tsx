import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LOCALES, type Locale, getDictionary } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { getAllCities, getCity, getCityName } from '@/lib/data/cities';
import { getCountry, getCountryName } from '@/lib/data/countries';
import { estimateForCity } from '@/lib/data/cost';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PartnerStack } from '@/components/PartnerStack';
import { JobsCTA } from '@/components/JobsCTA';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';

export const runtime = 'edge';

type Props = { params: { lang: Locale; city: string } };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCity(params.city);
  if (!city) return {};
  const dict = await getDictionary(params.lang);
  const name = getCityName(city, params.lang);
  const cost = estimateForCity(city);
  const title = dict.meta.costCityTitleTpl
    .replace('{name}', name)
    .replace('{total}', String(cost.total.solo));
  const description = dict.meta.costCityDescTpl
    .replace('{name}', name)
    .replace('{total}', String(cost.total.solo));
  return buildPageMetadata({
    locale: params.lang,
    title,
    description,
    pathForLocale: (l) => `/${l}/cost-of-living/${city.slug}`,
  });
}

export default async function CostOfLivingDetailPage({ params }: Props) {
  const city = getCity(params.city);
  if (!city) notFound();
  const dict = await getDictionary(params.lang);
  const name = getCityName(city, params.lang);
  const country = getCountry(city.country);
  const countryName = country ? getCountryName(country, params.lang) : city.country;
  const cost = estimateForCity(city);

  const rows: { label: string; value: string }[] = [
    { label: 'Rent (1BR city center)', value: `$${cost.rent1brCenter}/month` },
    { label: 'Rent (1BR outside center)', value: `$${cost.rent1brOutside}/month` },
    { label: 'Utilities (electric, water)', value: `$${cost.utilities}/month` },
    { label: 'Home internet', value: `$${cost.internet}/month` },
    { label: 'Meal at local restaurant', value: `$${cost.mealLocal}` },
    { label: 'Meal mid-range restaurant', value: `$${cost.mealMid}` },
    { label: 'Coffee at café', value: `$${cost.coffee}` },
    { label: 'Groceries (solo monthly)', value: `$${cost.groceries}/month` },
    { label: 'Coworking (hot desk monthly)', value: `$${cost.coworking}/month` },
    { label: 'Public transport (monthly pass)', value: `$${cost.publicTransport}/month` },
  ];

  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/cost-of-living`, label: dict.nav.costOfLiving },
        { href: `/${params.lang}/cost-of-living/${city.slug}`, label: name },
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
        <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tightish">
          Cost of living in {name} 2026
        </h1>
        <p className="mt-3 text-muted">
          Estimated monthly budget breakdown for a digital nomad in {name}.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-muted">Solo nomad</p>
          <p className="mt-1 text-2xl font-semibold">${cost.total.solo}</p>
          <p className="text-xs text-muted">per month, all-in</p>
        </div>
        <div className="rounded-lg border border-line px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-muted">Couple</p>
          <p className="mt-1 text-2xl font-semibold">${cost.total.couple}</p>
          <p className="text-xs text-muted">per month, all-in</p>
        </div>
        <div className="rounded-lg border border-line px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-muted">Family of 4</p>
          <p className="mt-1 text-2xl font-semibold">${cost.total.family}</p>
          <p className="text-xs text-muted">per month, all-in</p>
        </div>
      </section>

      <section className="mt-10 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-3 text-xs uppercase tracking-widest text-muted">Item</th>
              <th className="text-left py-3 text-xs uppercase tracking-widest text-muted">Average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="py-3 text-muted">{r.label}</td>
                <td className="py-3 font-medium">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">Methodology</h2>
        <p className="mt-3 text-muted leading-relaxed">
          Numbers above are 2026 estimates derived from city cost index ({city.costIndex} / 100),
          cross-referenced with Numbeo and Nomadlist data. Real prices vary by neighborhood,
          season and lifestyle. Use these as a baseline budget, then adjust for your
          accommodation type and dining habits.
        </p>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">Want more on {name}?</h2>
        <p className="mt-3">
          <Link
            href={`/${params.lang}/cities/${city.slug}`}
            className="text-accent underline underline-offset-4"
          >
            Full digital nomad guide to {name}
          </Link>
        </p>
      </section>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="banking" />
        <PromoBanner locale={params.lang} variant="esim" />
      </div>
      <SlateRemoteBanner locale={params.lang} countrySlug={country?.slug} countryName={countryName} className="mt-8" />
      <JobsCTA locale={params.lang} cityName={name} heading={`Need a remote job to fund ${name}?`} />
      <PartnerStack
        locale={params.lang}
        categories={['banking', 'accommodation', 'mobility-credits', 'esim', 'insurance']}
        heading="Daily costs add up — here's what helps"
      />
    </article>
  );
}
