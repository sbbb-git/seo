import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { getAllComparisons, getComparison } from '@/lib/data/comparisons';
import { getCountry, getCountryName } from '@/lib/data/countries';
import { getCity, getCityName } from '@/lib/data/cities';
import { PartnerStack } from '@/components/PartnerStack';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JobsCTA } from '@/components/JobsCTA';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';

export const runtime = 'edge';

type Props = { params: { lang: Locale; pair: string } };


type Side = {
  name: string;
  costIndex?: number;
  internetMbps?: number;
  safetyIndex?: number;
  tempMinC?: number;
  tempMaxC?: number;
};

function resolveSide(slug: string, type: 'country' | 'city', locale: Locale): Side | null {
  if (type === 'country') {
    const c = getCountry(slug);
    if (!c) return null;
    return {
      name: getCountryName(c, locale),
      costIndex: c.costIndex,
      internetMbps: c.internetMbps,
      safetyIndex: c.safetyIndex,
      tempMinC: c.weather.tempMinC,
      tempMaxC: c.weather.tempMaxC,
    };
  }
  const c = getCity(slug);
  if (!c) return null;
  return {
    name: getCityName(c, locale),
    costIndex: c.costIndex,
    internetMbps: c.internetMbps,
    safetyIndex: c.safetyIndex,
    tempMinC: c.tempMinC,
    tempMaxC: c.tempMaxC,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comp = getComparison(params.pair);
  if (!comp) return {};
  const a = resolveSide(comp.a, comp.type, params.lang);
  const b = resolveSide(comp.b, comp.type, params.lang);
  if (!a || !b) return {};
  const dict = await getDictionary(params.lang);
  const title = dict.meta.compareTitleTpl
    .replace('{a}', a.name)
    .replace('{b}', b.name);
  const description = dict.meta.compareDescTpl
    .replace('{a}', a.name)
    .replace('{b}', b.name)
    .replace('{verdict}', comp.verdict.slice(0, 100));
  return buildPageMetadata({
    locale: params.lang,
    title,
    description,
    pathForLocale: (l) => `/${l}/compare/${comp.slug}`,
  });
}

export default async function ComparePairPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const comp = getComparison(params.pair);
  if (!comp) notFound();
  const a = resolveSide(comp.a, comp.type, params.lang);
  const b = resolveSide(comp.b, comp.type, params.lang);
  if (!a || !b) notFound();

  const linkBase = comp.type === 'country' ? 'countries' : 'cities';

  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/compare`, label: dict.nav.compare },
        { href: `/${params.lang}/compare/${comp.slug}`, label: `${a.name} vs ${b.name}` },
      ]} />

      <header className="max-w-3xl mt-4">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tightish">
          {a.name} <span className="text-muted font-normal">vs</span> {b.name}
        </h1>
        <p className="mt-3 text-muted">For digital nomads in 2026.</p>
      </header>

      <section className="mt-10 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-3 text-xs uppercase tracking-widest text-muted">Criterion</th>
              <th className="text-left py-3 font-semibold">
                <a href={`/${params.lang}/${linkBase}/${comp.a}`} className="hover:text-accent">{a.name}</a>
              </th>
              <th className="text-left py-3 font-semibold">
                <a href={`/${params.lang}/${linkBase}/${comp.b}`} className="hover:text-accent">{b.name}</a>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            <tr><td className="py-3 text-muted">Cost of living index</td><td className="py-3">{a.costIndex} / 100</td><td className="py-3">{b.costIndex} / 100</td></tr>
            <tr><td className="py-3 text-muted">Internet (Mbps avg)</td><td className="py-3">{a.internetMbps}</td><td className="py-3">{b.internetMbps}</td></tr>
            <tr><td className="py-3 text-muted">Safety index</td><td className="py-3">{a.safetyIndex} / 100</td><td className="py-3">{b.safetyIndex} / 100</td></tr>
            <tr><td className="py-3 text-muted">Temperature range</td><td className="py-3">{a.tempMinC}° – {a.tempMaxC}°C</td><td className="py-3">{b.tempMinC}° – {b.tempMaxC}°C</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">Our take</h2>
        <p className="mt-3 leading-relaxed">{comp.verdict}</p>
      </section>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="setup" />
        <PromoBanner locale={params.lang} variant="insurance" />
      </div>
      <SlateRemoteBanner locale={params.lang} className="mt-8" />
      <JobsCTA locale={params.lang} heading={`Remote roles in ${a.name} or ${b.name}?`} />
      <PartnerStack
        locale={params.lang}
        categories={['banking', 'insurance', 'esim', 'vpn', 'accommodation']}
      />
    </article>
  );
}
