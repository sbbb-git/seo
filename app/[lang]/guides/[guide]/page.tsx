import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import {
  getAllGuides,
  getGuide,
  getGuideTitle,
  getGuideDescription,
} from '@/lib/data/guides';
import { getCountry, getCountryName } from '@/lib/data/countries';
import { getCity, getCityName } from '@/lib/data/cities';
import { getVisa } from '@/lib/data/visas';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { PartnerStack } from '@/components/PartnerStack';
import { CountryCard } from '@/components/CountryCard';
import { CityCard } from '@/components/CityCard';
import { VisaCard } from '@/components/VisaCard';
import { GuideCard } from '@/components/GuideCard';
import { AiToolsCTA } from '@/components/AiToolsCTA';
import { JobsCTA } from '@/components/JobsCTA';
import { TopicCallouts } from '@/components/TopicCallouts';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';
import { FiverrCTA } from '@/components/FiverrCTA';
import { AppSumoCTA } from '@/components/AppSumoCTA';
import { BeehiivCTA } from '@/components/BeehiivCTA';
import { WiseCTA } from '@/components/WiseCTA';
import { SafetyWingCTA } from '@/components/SafetyWingCTA';
import { MercorCTA } from '@/components/MercorCTA';
import { NordVPNCTA } from '@/components/NordVPNCTA';
import { AiraloCTA } from '@/components/AiraloCTA';
import { SkoolCTA } from '@/components/SkoolCTA';
import { RevolutCTA } from '@/components/RevolutCTA';
import { ClaudeCTA } from '@/components/ClaudeCTA';

const EU_LOCALES: Locale[] = ['fr', 'es', 'pt', 'it', 'de', 'pl'];
const has = (slug: string, ...keys: string[]) => keys.some((k) => slug.includes(k));

function pickSponsoredCTA(topic: string, slug: string, locale: Locale) {
  // Visa / residency pages -> health insurance
  if (topic === 'visas') return <SafetyWingCTA locale={locale} />;

  // Money topics: Revolut for EU spending guides, Wise as the default
  if (topic === 'tax' || topic === 'cost') {
    if (
      EU_LOCALES.includes(locale) &&
      has(slug, 'revolut', 'eu-', 'european-', 'europe', 'schengen', 'spending', 'cost-of-living', 'accommodation', 'long-stay')
    ) {
      return <RevolutCTA locale={locale} />;
    }
    return <WiseCTA locale={locale} />;
  }

  // Freelancing -> Mercor for expert/AI training; Skool for community; Fiverr default
  if (topic === 'freelancing') {
    if (has(slug, 'mercor', 'ai-training', 'ai-labeling', 'ai-labelling', 'expert-side-income', 'side-income', '-doctors', '-lawyers', '-engineers', '-writers')) {
      return <MercorCTA locale={locale} />;
    }
    if (has(slug, 'skool', 'community', 'paid-community', 'mastermind', 'personal-brand')) {
      return <SkoolCTA locale={locale} />;
    }
    return <FiverrCTA locale={locale} />;
  }

  // Tools -> Claude for AI/writing, Beehiiv for newsletters, AppSumo default
  if (topic === 'tools') {
    if (has(slug, 'newsletter', 'beehiiv', 'email')) return <BeehiivCTA locale={locale} />;
    if (has(slug, 'claude', 'ai-writing', 'ai-tool', 'productivity', 'meeting-transcription', 'voice')) {
      return <ClaudeCTA locale={locale} />;
    }
    return <AppSumoCTA locale={locale} />;
  }

  // Infrastructure / connectivity / VPN -> NordVPN for VPN, Airalo for eSIM/data
  if (topic === 'infrastructure') {
    if (has(slug, 'vpn', 'privacy', 'censor', 'streaming')) return <NordVPNCTA locale={locale} />;
    return <AiraloCTA locale={locale} />;
  }

  return null;
}

export const runtime = 'edge';
export const revalidate = 600;

type Props = { params: { lang: Locale; guide: string } };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide(params.guide);
  if (!guide) return {};
  return buildPageMetadata({
    locale: params.lang,
    title: getGuideTitle(guide, params.lang),
    description: getGuideDescription(guide, params.lang),
    pathForLocale: (l) => `/${l}/guides/${guide.slug}`,
  });
}

export default async function GuideDetailPage({ params }: Props) {
  const guide = getGuide(params.guide);
  if (!guide) notFound();
  const dict = await getDictionary(params.lang);
  const title = getGuideTitle(guide, params.lang);
  const description = getGuideDescription(guide, params.lang);

  const faqLd = guide.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  const articleUrl = `${SITE_URL}/${params.lang}/guides/${guide.slug}`;
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: params.lang,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    image: [`${SITE_URL}/og`],
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
    articleSection: guide.topic,
  };

  const relatedCountries = (guide.relatedCountries || [])
    .map(getCountry)
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const relatedCities = (guide.relatedCities || [])
    .map(getCity)
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const relatedVisas = (guide.relatedVisas || [])
    .map(getVisa)
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const moreOnTopic = getAllGuides()
    .filter((g) => g.topic === guide.topic && g.slug !== guide.slug)
    .slice(0, 6);

  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/guides`, label: dict.nav.guides },
        { href: `/${params.lang}/guides/${guide.slug}`, label: title },
      ]} />

      <header className="max-w-3xl mt-4">
        <p className="text-xs uppercase tracking-widest text-muted">{guide.topic}</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tightish leading-[1.1]">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">{description}</p>
      </header>

      <TopicCallouts guide={guide} locale={params.lang} />

      {guide.faq.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tightish">Frequently asked</h2>
          <dl className="mt-6 space-y-6">
            {guide.faq.map((f) => (
              <div key={f.q} className="border-b border-line pb-6 last:border-0">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-2 text-muted leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {relatedCountries.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">Related countries</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCountries.map((c) => (
              <li key={c.slug}>
                <CountryCard country={c} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedCities.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">Related cities</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCities.map((c) => (
              <li key={c.slug}>
                <CityCard city={c} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedVisas.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">Related visas</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedVisas.map((v) => (
              <li key={v.slug}>
                <VisaCard visa={v} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {moreOnTopic.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tightish">More on {guide.topic.replace('-', ' ')}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {moreOnTopic.map((g) => (
              <li key={g.slug}>
                <GuideCard guide={g} locale={params.lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {(guide.topic === 'visas' || guide.topic === 'tax') && (
        <JobsCTA locale={params.lang} heading={dict.detail.haveVisaNeedJob} />
      )}
      {(guide.topic === 'tools' || guide.topic === 'city-guide' || guide.topic === 'freelancing') && <AiToolsCTA locale={params.lang} />}

      <SlateRemoteBanner locale={params.lang} className="mt-12" size="compact" />

      <PartnerStack
        locale={params.lang}
        categories={
          guide.topic === 'tools'
            ? ['productivity', 'ai-llm', 'voice-ai', 'newsletter', 'marketplace', 'vpn', 'esim']
            : guide.topic === 'freelancing'
            ? ['earn-while-traveling', 'banking', 'ai-llm', 'newsletter']
            : guide.topic === 'tax' || guide.topic === 'visas'
            ? ['banking', 'insurance', 'esim', 'ai-llm']
            : guide.topic === 'cost'
            ? ['banking', 'accommodation', 'mobility-credits', 'investing']
            : guide.topic === 'infrastructure'
            ? ['esim', 'vpn', 'productivity']
            : ['banking', 'insurance', 'esim', 'accommodation']
        }
      />
      {pickSponsoredCTA(guide.topic, guide.slug, params.lang)}
      <JsonLd data={articleLd} />
      {faqLd && <JsonLd data={faqLd} />}
    </article>
  );
}
