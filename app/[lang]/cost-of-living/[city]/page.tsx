import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LOCALES, type Locale, getDictionary } from '@/lib/i18n';
import { buildPageMetadata, SITE_URL } from '@/lib/seo';
import { fillTpl } from '@/lib/ui';
import { getAllCities, getCity, getCityName } from '@/lib/data/cities';
import { getCountry, getCountryName } from '@/lib/data/countries';
import { estimateForCity } from '@/lib/data/cost';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { PartnerStack } from '@/components/PartnerStack';
import { JobsCTA } from '@/components/JobsCTA';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';

export const runtime = 'edge';
export const revalidate = 600;

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

/** Lean and premium budgets, derived from the same index as the headline total. */
function budgetTiers(cost: ReturnType<typeof estimateForCity>) {
  const lean =
    cost.rent1brOutside +
    cost.utilities +
    cost.internet +
    cost.groceries +
    cost.publicTransport +
    Math.round(cost.mealLocal * 6);
  const premium =
    Math.round(cost.rent1brCenter * 1.35) +
    cost.utilities +
    cost.internet +
    cost.groceries +
    Math.round(cost.coworking * 1.6) +
    cost.publicTransport +
    Math.round(cost.mealMid * 16 + cost.mealLocal * 8);
  return { lean, premium };
}

export default async function CostOfLivingDetailPage({ params }: Props) {
  const city = getCity(params.city);
  if (!city) notFound();
  const dict = await getDictionary(params.lang);
  const t = dict.cost;
  const name = getCityName(city, params.lang);
  const country = getCountry(city.country);
  const countryName = country ? getCountryName(country, params.lang) : city.country;
  const cost = estimateForCity(city);
  const { lean, premium } = budgetTiers(cost);

  const position =
    city.costIndex <= 45 ? t.posCheap : city.costIndex >= 70 ? t.posExpensive : t.posMid;

  const fill = (s: string) =>
    s
      .replace(/{name}/g, name)
      .replace(/{index}/g, String(city.costIndex))
      .replace(/{total}/g, String(cost.total.solo))
      .replace(/{couple}/g, String(cost.total.couple))
      .replace(/{family}/g, String(cost.total.family))
      .replace(/{rentOut}/g, String(cost.rent1brOutside))
      .replace(/{rent}/g, String(cost.rent1brCenter))
      .replace(/{lean}/g, String(lean))
      .replace(/{premium}/g, String(premium))
      .replace(/{position}/g, position);

  const rows: { label: string; value: string }[] = [
    { label: t.rentCenter, value: `$${cost.rent1brCenter}/mo` },
    { label: t.rentOutside, value: `$${cost.rent1brOutside}/mo` },
    { label: t.utilities, value: `$${cost.utilities}/mo` },
    { label: t.internet, value: `$${cost.internet}/mo` },
    { label: t.mealLocal, value: `$${cost.mealLocal}` },
    { label: t.mealMid, value: `$${cost.mealMid}` },
    { label: t.coffee, value: `$${cost.coffee}` },
    { label: t.groceries, value: `$${cost.groceries}/mo` },
    { label: t.coworking, value: `$${cost.coworking}/mo` },
    { label: t.transport, value: `$${cost.publicTransport}/mo` },
  ];

  // Peer cities for context — doubles as internal linking between cost pages.
  const peers = getAllCities().filter((c) => c.slug !== city.slug);
  const cheaper = peers
    .filter((c) => c.costIndex < city.costIndex)
    .sort((a, b) => b.costIndex - a.costIndex || b.nomadScore - a.nomadScore)
    .slice(0, 3);
  const pricier = peers
    .filter((c) => c.costIndex > city.costIndex)
    .sort((a, b) => a.costIndex - b.costIndex || b.nomadScore - a.nomadScore)
    .slice(0, 3);

  const tiers = [
    { name: t.leanName, amount: lean, desc: t.leanDesc },
    { name: t.comfortName, amount: cost.total.solo, desc: t.comfortDesc },
    { name: t.premiumName, amount: premium, desc: t.premiumDesc },
  ];

  const faq = t.faq.map((f) => ({ q: fill(f.q), a: fill(f.a) }));

  const pageUrl = `${SITE_URL}/${params.lang}/cost-of-living/${city.slug}`;
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: fill(t.h1Tpl),
    description: fill(t.introTpl),
    inLanguage: params.lang,
    url: pageUrl,
    creator: { '@type': 'Organization', name: 'Slowmadly', url: SITE_URL },
    variableMeasured: rows.map((r) => ({
      '@type': 'PropertyValue',
      name: r.label,
      value: r.value,
    })),
  };

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
          {fill(t.h1Tpl)}
        </h1>
        <p className="mt-3 text-lg text-muted leading-relaxed">{fill(t.introTpl)}</p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: t.solo, value: cost.total.solo },
          { label: t.couple, value: cost.total.couple },
          { label: t.family, value: cost.total.family },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-line px-5 py-4">
            <p className="text-xs uppercase tracking-widest text-muted">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold">${c.value}</p>
            <p className="text-xs text-muted">{t.perMonth}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tightish">{fill(t.breakdownHeading)}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-3 text-xs uppercase tracking-widest text-muted">{t.item}</th>
                <th className="text-left py-3 text-xs uppercase tracking-widest text-muted">{t.average}</th>
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
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">{fill(t.tiersHeading)}</h2>
        <p className="mt-3 text-muted leading-relaxed">{t.tiersIntro}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="rounded-lg border border-line px-5 py-4">
              <p className="text-xs uppercase tracking-widest text-muted">{tier.name}</p>
              <p className="mt-1 text-2xl font-semibold">${tier.amount}</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {(cheaper.length > 0 || pricier.length > 0) && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tightish">{fill(t.contextHeading)}</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {pricier.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">{t.cheaperThan}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {pricier.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${params.lang}/cost-of-living/${c.slug}`}
                        className="text-accent underline underline-offset-4"
                      >
                        {getCityName(c, params.lang)}
                      </Link>
                      <span className="text-muted"> · {c.costIndex}/100</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cheaper.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">{t.pricierThan}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {cheaper.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${params.lang}/cost-of-living/${c.slug}`}
                        className="text-accent underline underline-offset-4"
                      >
                        {getCityName(c, params.lang)}
                      </Link>
                      <span className="text-muted"> · {c.costIndex}/100</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">{t.faqHeading}</h2>
        <dl className="mt-4 space-y-6">
          {faq.map((f) => (
            <div key={f.q}>
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 text-muted leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">{t.methodHeading}</h2>
        <p className="mt-3 text-muted leading-relaxed">{fill(t.methodTpl)}</p>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">{fill(t.moreHeading)}</h2>
        <p className="mt-3">
          <Link
            href={`/${params.lang}/cities/${city.slug}`}
            className="text-accent underline underline-offset-4"
          >
            {fill(t.fullGuideTpl)}
          </Link>
        </p>
      </section>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="banking" />
        <PromoBanner locale={params.lang} variant="esim" />
      </div>
      <SlateRemoteBanner locale={params.lang} countrySlug={country?.slug} countryName={countryName} className="mt-8" />
      <JobsCTA locale={params.lang} cityName={name} heading={fillTpl(dict.ui.headings.jobToFund, { name })} />
      <PartnerStack
        locale={params.lang}
        categories={['banking', 'accommodation', 'mobility-credits', 'esim', 'insurance']}
        heading={dict.ui.headings.dailyCosts}
      />

      <JsonLd data={faqLd} />
      <JsonLd data={datasetLd} />
    </article>
  );
}
