import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import {
  getAllNationalities,
  getNationality,
  getNationalityName,
  getEligibleVisas,
} from '@/lib/data/nationalities';
import { VisaCard } from '@/components/VisaCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PartnerStack } from '@/components/PartnerStack';
import { JobsCTA } from '@/components/JobsCTA';

export const runtime = 'edge';
export const revalidate = 600;

type Props = { params: { lang: Locale; nationality: string } };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = getNationality(params.nationality);
  if (!n) return {};
  const dict = await getDictionary(params.lang);
  const name = getNationalityName(n, params.lang);
  const title = dict.meta.nationalityTitleTpl.replace('{name}', name);
  const description = dict.meta.nationalityDescTpl
    .replace('{count}', String(n.eligibleVisaSlugs.length))
    .replace('{nameLower}', name.toLowerCase());
  return buildPageMetadata({
    locale: params.lang,
    title,
    description,
    pathForLocale: (l) => `/${l}/visas/for/${n.slug}`,
  });
}

export default async function NationalityPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const n = getNationality(params.nationality);
  if (!n) notFound();
  const name = getNationalityName(n, params.lang);
  const visas = getEligibleVisas(n);

  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/visas`, label: dict.nav.visas },
        { href: `/${params.lang}/visas/for/${n.slug}`, label: `For ${name}` },
      ]} />

      <header className="max-w-3xl mt-4">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tightish font-display">
          Best digital nomad visas for {name}
        </h1>
        <p className="mt-3 text-lg text-muted leading-relaxed">{n.note}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-accent-soft text-accent-deep font-semibold">
            {n.passportName}
          </span>
          <span className="px-3 py-1 rounded-full bg-sage-soft text-ink">
            {n.visaFreeCount} visa-free destinations
          </span>
          <span className="px-3 py-1 rounded-full bg-sky-soft text-ink">
            {visas.length} relevant DNVs
          </span>
        </div>
      </header>

      <section className="mt-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visas.map((v) => (
            <li key={v.slug}>
              <VisaCard visa={v} locale={params.lang} />
            </li>
          ))}
        </ul>
      </section>

      <JobsCTA locale={params.lang} heading={`Remote job for ${name}? See sister site.`} />
      <PartnerStack
        locale={params.lang}
        categories={['banking', 'insurance', 'esim', 'ai-llm', 'earn-while-traveling']}
        heading="Set up before you apply"
      />
    </article>
  );
}
