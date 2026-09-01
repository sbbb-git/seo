import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { fillTpl } from '@/lib/ui';
import { getAllRegions, getRegion, getRegionName } from '@/lib/data/regions';
import { getCountry } from '@/lib/data/countries';
import { CountryCard } from '@/components/CountryCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JobsCTA } from '@/components/JobsCTA';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';
import { PartnerStack } from '@/components/PartnerStack';

export const runtime = 'edge';
export const revalidate = 600;

type Props = { params: { lang: Locale; region: string } };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = getRegion(params.region);
  if (!region) return {};
  const dict = await getDictionary(params.lang);
  const name = getRegionName(region, params.lang);
  const title = dict.meta.regionTitleTpl
    .replace('{name}', name)
    .replace('{count}', String(region.countries.length));
  return buildPageMetadata({
    locale: params.lang,
    title,
    description: region.description,
    pathForLocale: (l) => `/${l}/regions/${region.slug}`,
  });
}

export default async function RegionDetailPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const region = getRegion(params.region);
  if (!region) notFound();
  const name = getRegionName(region, params.lang);
  const countries = region.countries
    .map(getCountry)
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/regions`, label: dict.nav.regions },
        { href: `/${params.lang}/regions/${region.slug}`, label: name },
      ]} />

      <header className="max-w-3xl mt-4">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tightish">{name}</h1>
        <p className="mt-3 text-lg text-muted leading-relaxed">{region.description}</p>
      </header>

      <section className="mt-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => (
            <li key={c.slug}>
              <CountryCard country={c} locale={params.lang} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="setup" />
        <PromoBanner locale={params.lang} variant="insurance" />
      </div>
      <SlateRemoteBanner locale={params.lang} className="mt-8" />
      <JobsCTA locale={params.lang} heading={fillTpl(dict.ui.headings.remoteRolesAcross, { name })} />
      <PartnerStack
        locale={params.lang}
        categories={['banking', 'insurance', 'esim', 'travel-meta', 'accommodation']}
      />
    </article>
  );
}
