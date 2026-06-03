import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { PARTNERS, getPartners, type PartnerCategory } from '@/lib/partners';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';

export const runtime = 'edge';

type Props = { params: { lang: Locale } };

const SECTIONS: { title: string; categories: PartnerCategory[]; intro: string }[] = [
  {
    title: 'Banking and money',
    categories: ['banking'],
    intro: 'Multi-currency accounts and business banking for nomads. The first setup before you leave.',
  },
  {
    title: 'Insurance',
    categories: ['insurance'],
    intro: 'Health coverage that travels with you. Hospital, dental, evacuation.',
  },
  {
    title: 'Connectivity',
    categories: ['esim', 'vpn'],
    intro: 'Stay online and private from day one. eSIM for data, VPN for hotel wifi.',
  },
  {
    title: 'Stays',
    categories: ['accommodation', 'travel-meta', 'tours'],
    intro: 'Where to sleep, fly, and do day trips. Use the monthly filter on Airbnb to drop rents 30-50%.',
  },
  {
    title: 'Productivity and AI',
    categories: ['productivity', 'ai-llm', 'voice-ai'],
    intro: 'The tools that let you work from a café in Bali like you would from a HQ desk.',
  },
  {
    title: 'Earn while traveling',
    categories: ['earn-while-traveling'],
    intro: 'Side income for nomads. AI-labels, freelance marketplaces.',
  },
  {
    title: 'Investing',
    categories: ['investing'],
    intro: 'Park the savings while you live abroad. P2P lending and renewable energy crowdfunding.',
  },
  {
    title: 'Newsletter and email',
    categories: ['newsletter'],
    intro: 'Build an audience while traveling. Most nomad creators run newsletters on these platforms.',
  },
  {
    title: 'Local mobility, fitness and shopping',
    categories: ['mobility-credits', 'fitness-credits', 'shopping-credits', 'marketplace'],
    intro: 'Daily-life referrals: get credit when you sign up. Bonus, not core stack.',
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return buildPageMetadata({
    locale: params.lang,
    title: dict.meta.toolsTitle,
    description: dict.meta.toolsDesc,
    pathForLocale: (l) => `/${l}/tools`,
  });
}

export default async function ToolsPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const total = getPartners({ locale: params.lang }).length;
  return (
    <div className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/tools`, label: dict.nav.tools },
      ]} />
      <header className="max-w-3xl mt-4">
        <p className="text-xs uppercase tracking-widest text-accent-deep font-semibold">Curated for 2026</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tightish font-display">
          Best tools for digital nomads
        </h1>
        <p className="mt-3 text-lg text-muted leading-relaxed">
          {total} tools we actually use, with what each one is for. Banking, insurance, eSIM, VPN,
          AI, productivity, earn-while-traveling and more. Affiliate links: we earn a small
          commission at no cost to you.
        </p>
      </header>

      <div className="mt-12 space-y-14">
        {SECTIONS.map((section) => {
          const partners = getPartners({ categories: section.categories, locale: params.lang });
          if (partners.length === 0) return null;
          return (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold tracking-tightish font-display">{section.title}</h2>
              <p className="mt-2 text-sm text-muted max-w-2xl">{section.intro}</p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {partners.map((p) => (
                  <li key={p.id}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="nofollow noopener sponsored"
                      className="flex flex-col h-full rounded-xl border border-line bg-paper px-5 py-5 card-hover"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-semibold tracking-tightish">{p.name}</p>
                        <span className="text-[10px] uppercase tracking-widest text-muted">
                          {p.tier === 'primary' ? 'Cash' : 'Credit'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted leading-snug flex-1">{p.blurb}</p>
                      <p className="mt-3 text-xs text-accent font-semibold uppercase tracking-widest">
                        Open {p.name} ↗
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tightish">A note on affiliate links</h2>
        <p className="mt-3 text-muted leading-relaxed">
          Every link on this page is an affiliate link. If you sign up through one of them, we earn
          a small commission at no extra cost to you. We only list tools we have used or that we
          actively use. No paid placements, no &quot;sponsored&quot; reviews of mediocre products.
        </p>
      </section>

      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="ai" />
        <PromoBanner locale={params.lang} variant="setup" />
      </div>
      <SlateRemoteBanner locale={params.lang} className="mt-10" />
    </div>
  );
}
