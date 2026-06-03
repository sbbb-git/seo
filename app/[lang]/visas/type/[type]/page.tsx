import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { getVisasByType, type Visa } from '@/lib/data/visas';
import { VisaCard } from '@/components/VisaCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JobsCTA } from '@/components/JobsCTA';
import { PartnerStack } from '@/components/PartnerStack';

const VALID: Visa['type'][] = ['digital-nomad', 'passive-income', 'investor', 'freelance'];

export const runtime = 'edge';

type Props = { params: { lang: Locale; type: Visa['type'] } };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!VALID.includes(params.type)) return {};
  const dict = await getDictionary(params.lang);
  const vt = dict.visaType[params.type];
  return buildPageMetadata({
    locale: params.lang,
    title: `${vt.label} ${dict.meta.visaTypeTitleSuffix}`,
    description: vt.desc,
    pathForLocale: (l) => `/${l}/visas/type/${params.type}`,
  });
}

export default async function VisaTypePage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  if (!VALID.includes(params.type)) notFound();
  const visas = getVisasByType(params.type);
  const vt = dict.visaType[params.type];
  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/visas`, label: dict.nav.visas },
        { href: `/${params.lang}/visas/type/${params.type}`, label: vt.label },
      ]} />
      <header className="max-w-3xl mt-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tightish">
          {vt.label}
        </h1>
        <p className="mt-3 text-muted">{vt.desc}</p>
      </header>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visas.map((v) => (
          <li key={v.slug}>
            <VisaCard visa={v} locale={params.lang} />
          </li>
        ))}
      </ul>

      <JobsCTA locale={params.lang} heading={dict.detail.haveVisaNeedJob} />
      <PartnerStack
        locale={params.lang}
        categories={['banking', 'insurance', 'esim', 'ai-llm']}
        heading={dict.detail.setupBeforeApply}
      />
    </article>
  );
}
