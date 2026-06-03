import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { getAllVisas, getVisa } from '@/lib/data/visas';
import { getCountry, getCountryName } from '@/lib/data/countries';
import { PartnerStack } from '@/components/PartnerStack';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { FaqSection } from '@/components/FaqSection';
import { visaFaqs } from '@/lib/faq-templates';
import { GuideCard } from '@/components/GuideCard';
import { getGuidesForVisa } from '@/lib/data/guides';
import { JobsCTA } from '@/components/JobsCTA';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';

export const dynamicParams = false;
export const revalidate = 600;

type Props = { params: { lang: Locale; visa: string } };

export function generateStaticParams() {
  const visas = getAllVisas();
  return LOCALES.flatMap((lang) =>
    visas.map((v) => ({ lang, visa: v.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const visa = getVisa(params.visa);
  if (!visa) return {};
  const dict = await getDictionary(params.lang);
  const country = getCountry(visa.country);
  const cName = country ? getCountryName(country, params.lang) : visa.country;
  const income = visa.minIncomeMonthlyEur
    ? dict.meta.visaIncomeFrom.replace('{amount}', visa.minIncomeMonthlyEur.toLocaleString())
    : dict.meta.visaIncomeNone;
  const description = dict.meta.visaDescTpl
    .replace('{name}', visa.name)
    .replace('{country}', cName)
    .replace('{income}', income)
    .replace('{months}', String(visa.durationMonths))
    .replace('{days}', String(visa.processingDays));
  return buildPageMetadata({
    locale: params.lang,
    title: `${visa.name} (2026): ${dict.meta.visaTitleSuffix}`,
    description,
    pathForLocale: (l) => `/${l}/visas/${visa.slug}`,
    ogType: 'article',
  });
}

export default async function VisaDetailPage({ params }: Props) {
  const visa = getVisa(params.visa);
  if (!visa) notFound();
  const dict = await getDictionary(params.lang);
  const country = getCountry(visa.country);
  const cName = country ? getCountryName(country, params.lang) : visa.country;

  const govPermit = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentPermit',
    name: visa.name,
    issuedBy: country ? { '@type': 'Country', name: cName } : undefined,
    permitAudience: {
      '@type': 'Audience',
      audienceType: 'Digital nomads and remote workers',
    },
    validFor: `P${visa.durationMonths}M`,
    url: visa.officialUrl,
  };

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to apply for the ${visa.name}`,
    description: `Step-by-step application process for the ${visa.name}.`,
    totalTime: `PT${Math.round(visa.processingDays * 24)}H`,
    estimatedCost: visa.minIncomeMonthlyEur
      ? { '@type': 'MonetaryAmount', currency: 'EUR', value: 200 }
      : undefined,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Verify eligibility',
        text: visa.minIncomeMonthlyEur
          ? `Confirm you earn at least €${visa.minIncomeMonthlyEur.toLocaleString()} per month from non-${cName} sources. Gather 3-6 months of bank statements or invoices as proof.`
          : `Verify your nationality is eligible. Gather bank statements showing financial means even if no minimum is stated.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Gather documents',
        text: 'Valid passport (12+ months remaining), clean criminal record, health insurance covering the destination, proof of accommodation, proof of remote employment or contracts.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Submit application',
        text: `Apply through the official portal or your nearest ${cName} consulate. Pay the application fee (typically €50-300).`,
        url: visa.officialUrl,
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Wait for processing',
        text: `Processing takes around ${visa.processingDays} days. Some consulates request additional documents during this period.`,
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Travel and register',
        text: `Once approved, travel to ${cName} and register locally within the first 30-90 days as instructed on your approval letter.`,
      },
    ],
  };

  const facts = [
    { label: 'Minimum income', value: visa.minIncomeMonthlyEur ? `€${visa.minIncomeMonthlyEur.toLocaleString()} / month` : 'No threshold' },
    { label: 'Duration', value: `${visa.durationMonths} months` },
    { label: 'Renewable', value: visa.renewable ? 'Yes' : 'No' },
    { label: 'Family eligible', value: visa.familyEligible ? 'Yes' : 'No' },
    { label: 'Processing', value: `~${visa.processingDays} days` },
    { label: 'Tax residency', value: visa.taxResidency.replace('-', ' ') },
  ];

  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/visas`, label: dict.nav.visas },
        { href: `/${params.lang}/visas/${visa.slug}`, label: visa.name },
      ]} />

      <header className="max-w-3xl mt-4">
        {country && (
          <Link
            href={`/${params.lang}/countries/${country.slug}`}
            className="text-sm uppercase tracking-widest text-muted hover:text-ink"
          >
            {cName}
          </Link>
        )}
        <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tightish">
          {visa.name}
        </h1>
        <p className="mt-3 text-sm text-muted uppercase tracking-widest">
          {visa.type.replace('-', ' ')} visa
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} className="rounded-lg border border-line px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-muted">{f.label}</p>
            <p className="mt-1 font-semibold capitalize">{f.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">Why this visa</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {visa.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 max-w-3xl">
        <a
          href={visa.officialUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center rounded-md bg-ink text-cream px-5 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          Official application portal
        </a>
      </section>

      {(() => {
        const relatedGuides = getGuidesForVisa(visa.slug);
        if (relatedGuides.length === 0) return null;
        return (
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tightish">{dict.nav.guides}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGuides.map((g) => (
                <li key={g.slug}>
                  <GuideCard guide={g} locale={params.lang} />
                </li>
              ))}
            </ul>
          </section>
        );
      })()}

      {/* How-to apply steps as visible content */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">How to apply for the {visa.name}</h2>
        <ol className="mt-4 space-y-4 list-decimal pl-6">
          {howToLd.step.map((s) => (
            <li key={s.position}>
              <p className="font-semibold tracking-tightish">{s.name}</p>
              <p className="mt-1 text-sm text-muted leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="setup" />
        <PromoBanner locale={params.lang} variant="insurance" />
      </div>

      <SlateRemoteBanner
        locale={params.lang}
        countrySlug={country?.slug}
        countryName={cName}
        className="mt-8"
      />

      <JobsCTA
        locale={params.lang}
        countryName={cName}
        countrySlug={country?.slug}
        heading={dict.detail.haveVisaNeedJob}
      />
      <PartnerStack
        locale={params.lang}
        categories={['banking', 'insurance', 'esim', 'ai-llm']}
        heading={dict.detail.setupBeforeApply}
      />
      <FaqSection faqs={visaFaqs(visa, params.lang)} />
      <JsonLd data={govPermit} />
      <JsonLd data={howToLd} />
    </article>
  );
}
