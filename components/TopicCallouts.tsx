import type { Locale } from '@/lib/i18n';
import type { Guide } from '@/lib/data/guides';
import { getPartner, resolvePartnerUrl } from '@/lib/partners';
import { partnerLogo } from '@/lib/images';

type Callout = {
  partnerId: string;
  /** One-liner that weaves the partner into the article context, not a sales pitch. */
  text: string;
};

const BY_TOPIC: Record<Guide['topic'], Callout[]> = {
  visas: [
    { partnerId: 'wise', text: 'Open a Wise account before applying — consulates often ask for proof of stable foreign-income flow, and Wise gives you EUR/USD/GBP receiving details on day one.' },
    { partnerId: 'safetywing', text: 'Most digital-nomad visas require travel insurance with a minimum cover. SafetyWing meets the bar for every visa we tracked, and you can cancel monthly.' },
    { partnerId: 'claude', text: 'Translating tax certificates, bank statements and notarised affidavits is the slowest part. Claude handles French, Spanish, Italian and Portuguese translations cleanly.' },
  ],
  tax: [
    { partnerId: 'wise', text: 'Invoice clients in their currency, get paid into a Wise account, convert when the rate is good. Removes one whole layer of tax-residency headache.' },
    { partnerId: 'qonto', text: 'For EU freelancers/SAS, Qonto gives you a proper business IBAN and clean invoicing — the kind of paper trail tax administrations actually want.' },
    { partnerId: 'mercor', text: 'Side income from AI labs (Mercor) is paid in USD — pair with a multi-currency account so you do not bleed 3% on every transfer.' },
  ],
  cost: [
    { partnerId: 'revolut', text: 'Track the real cost of a city by spending only on Revolut for a week. The app categorises everything in EUR, so your "I think it costs ~€1 400/month" turns into a number.' },
    { partnerId: 'wise', text: 'If your income is in another currency, use Wise instead of your home bank — at €2 000/month, the saving on FX margins is roughly €60 every transfer.' },
    { partnerId: 'esketit', text: 'Once your runway is solid, parking the buffer on a P2P platform (Esketit) at 10-13% beats letting it idle at 0.5% on a current account.' },
  ],
  infrastructure: [
    { partnerId: 'airalo', text: 'Land with Airalo (code SACHA6010 for $3 off) so you have data the moment you clear immigration — no kiosk queue, no overpaying at the airport.' },
    { partnerId: 'nordvpn', text: 'Hotel and café wifi is the actual threat model on the road. NordVPN with the kill-switch on means a dropped wifi never silently leaks your work traffic.' },
    { partnerId: 'fireflies', text: 'Patchy internet kills meeting recall. Fireflies records and transcribes Zoom/Meet/Teams so you can rejoin a dropped call without losing the thread.' },
  ],
  'city-guide': [
    { partnerId: 'airalo', text: 'Drop into the city with an Airalo eSIM already activated. Use code SACHA6010 for $3 off the first plan.' },
    { partnerId: 'revolut', text: 'Spend on Revolut for the first week — the app will tell you exactly what the city costs you, in your home currency.' },
    { partnerId: 'classpass', text: 'ClassPass works in most of the cities here — useful if you want one app for yoga, gym and pilates instead of buying a local pass you forget about.' },
  ],
  tools: [
    { partnerId: 'claude', text: 'Claude is the closest thing to a senior collaborator that fits in a window. Long context, careful reasoning — built for the writing/research/code mix nomads run.' },
    { partnerId: 'fireflies', text: 'When you stack 4-5 client calls in a day, Fireflies transcribes and summarises so your evenings stop being "writing notes about the day".' },
    { partnerId: 'beehiiv', text: 'If your client base ever asks "how do I keep up with what you are doing", Beehiiv is the fastest way to spin up a newsletter that monetises later.' },
    { partnerId: 'appsumo', text: 'Most of the tools nomads pay monthly for show up on AppSumo as one-time lifetime deals. Skim the deals page before you sign up for a new SaaS — a $59 lifetime often beats $19/month forever.' },
  ],
  freelancing: [
    { partnerId: 'fiverr', text: 'The fastest way to test a gig idea is to publish it where buyers already search. Fiverr puts your offer in front of millions of clients on day one — no audience, no cold outreach needed.' },
    { partnerId: 'wise', text: 'Fiverr pays out in USD. Withdraw to a Wise account and you keep the real exchange rate instead of losing 3-4% to your home bank every time you cash out.' },
    { partnerId: 'claude', text: 'Use Claude to draft gig descriptions, FAQ answers and client briefs in minutes — then spend your time on the actual delivery that earns the 5-star review.' },
  ],
};

type Props = {
  guide: Guide;
  locale: Locale;
};

/**
 * In-article callouts. Renders 2-3 contextual partner mentions woven
 * into prose — placed between the article header and the FAQ section.
 * Each item is a useful tip first, an affiliate link second.
 */
export function TopicCallouts({ guide, locale }: Props) {
  const callouts = BY_TOPIC[guide.topic] || [];
  const resolved = callouts
    .map((c) => ({ c, p: getPartner(c.partnerId) }))
    .filter((x): x is { c: Callout; p: NonNullable<typeof x.p> } => Boolean(x.p?.active));

  if (resolved.length === 0) return null;

  return (
    <section className="mt-10 max-w-3xl">
      <div className="rounded-2xl border border-line bg-paper-gradient px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-widest text-accent-deep font-semibold">
            Tools we actually use for this
          </p>
          <span className="text-[10px] uppercase tracking-widest text-muted border border-line/70 bg-cream/60 px-1.5 py-0.5 rounded">
            Sponsored
          </span>
        </div>
        <ul className="mt-4 space-y-4">
          {resolved.map(({ c, p }) => {
            const url = resolvePartnerUrl(p, locale);
            return (
              <li key={p.id} className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partnerLogo(url)}
                  alt={`${p.name} logo`}
                  width={28}
                  height={28}
                  loading="lazy"
                  className="w-7 h-7 mt-0.5 rounded-md object-contain flex-shrink-0 bg-cream border border-line/60"
                />
                <p className="text-sm leading-relaxed">
                  {c.text}{' '}
                  <a
                    href={url}
                    target="_blank"
                    rel="nofollow noopener sponsored"
                    className="font-semibold text-accent hover:text-accent-deep underline underline-offset-4 transition-colors whitespace-nowrap"
                  >
                    {p.name} ↗
                  </a>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
