// Centralised affiliate catalog. Source of truth = AFFILIATIONS_EXPORT.md.
// Placement: contextual per page (3-6 partners max). Filter by locale when
// the program is region-locked.

import type { Locale } from '@/lib/i18n';

export type PartnerCategory =
  | 'banking'
  | 'insurance'
  | 'esim'
  | 'vpn'
  | 'accommodation'
  | 'travel-meta'
  | 'tours'
  | 'newsletter'
  | 'productivity'
  | 'ai-llm'
  | 'voice-ai'
  | 'earn-while-traveling'
  | 'investing'
  | 'marketplace'
  | 'mobility-credits'
  | 'fitness-credits'
  | 'shopping-credits';

export type PartnerTier = 'primary' | 'secondary';
export type PartnerScope = 'global' | 'fr-only' | 'eu-only' | 'pt-only';

export type Partner = {
  id: string;
  name: string;
  url: string;
  blurb: string;
  category: PartnerCategory;
  tier: PartnerTier;
  scope?: PartnerScope;
  active: boolean;
};

const SAFETYWING =
  process.env.NEXT_PUBLIC_AFF_SAFETYWING ||
  'https://safetywing.com/?referenceID=26533496&utm_source=26533496&utm_medium=Ambassador';
const TRAVELPAYOUTS = process.env.NEXT_PUBLIC_AFF_TRAVELPAYOUTS || 'TOKEN_TRAVELPAYOUTS';
const VIATOR = process.env.NEXT_PUBLIC_AFF_VIATOR || 'TOKEN_VIATOR';

// Wise has per-currency affiliate links. We route by locale to the
// most likely target currency for the audience. JPY/AUD/GBP aren't
// tied to any of our 7 locales today but the helper is ready for
// future additions (e.g. en-AU, en-GB, ja).
const WISE_LINKS = {
  EUR: 'https://wise.prf.hn/click/camref:1100l5KwDi',
  USD: 'https://wise.prf.hn/click/camref:1100l5KwDm',
  JPY: 'https://wise.prf.hn/click/camref:1100l5KwDk',
  AUD: 'https://wise.prf.hn/click/camref:1100l5KwDh',
  GBP: 'https://wise.prf.hn/click/camref:1100l5KwDj',
} as const;

const WISE_BY_LOCALE: Partial<Record<Locale, keyof typeof WISE_LINKS>> = {
  fr: 'EUR',
  es: 'EUR',
  pt: 'EUR',
  it: 'EUR',
  de: 'EUR',
  pl: 'EUR',
  en: 'USD',
};

export function wiseUrl(locale?: Locale | string): string {
  const currency = locale && WISE_BY_LOCALE[locale as Locale];
  return WISE_LINKS[currency || 'USD'];
}

export const PARTNERS: Partner[] = [
  // Banking
  {
    id: 'wise',
    name: 'Wise',
    url: WISE_LINKS.USD,
    blurb: 'Multi-currency account with real exchange rates. Receive in 40+ currencies.',
    category: 'banking',
    tier: 'primary',
    active: true,
  },
  {
    id: 'revolut',
    name: 'Revolut',
    url: 'https://revolut.com/referral/?referral-code=sacha5bp%21MAY2-26-AR-TR5DDH1-H1&geo-redirect',
    blurb: 'Free EU account with virtual cards. Spend abroad at the real exchange rate.',
    category: 'banking',
    tier: 'primary',
    scope: 'eu-only',
    active: true,
  },
  {
    id: 'qonto',
    name: 'Qonto',
    url: 'https://qonto.com/r/sacha-bitoun',
    blurb: 'Business banking for freelancers and SMEs in France and Europe. 60-100€ welcome bonus.',
    category: 'banking',
    tier: 'primary',
    scope: 'eu-only',
    active: true,
  },

  // Insurance
  {
    id: 'safetywing',
    name: 'SafetyWing',
    url: SAFETYWING,
    blurb: 'Nomad health insurance built for remote workers. From $45/month, works in 175+ countries.',
    category: 'insurance',
    tier: 'primary',
    active: true,
  },

  // Connectivity
  {
    id: 'airalo',
    name: 'Airalo',
    url: 'https://www.airalo.com/?ref=SACHA6010',
    blurb: 'eSIM data plans in 200+ countries. Use code SACHA6010 for $3 off your first plan.',
    category: 'esim',
    tier: 'primary',
    active: true,
  },
  {
    id: 'nordvpn',
    name: 'NordVPN',
    url: 'https://refer-nordvpn.com/duxeAtWzEDy',
    blurb: 'VPN for hotel wifi, geo-restrictions and basic privacy. 6 devices, 60+ countries.',
    category: 'vpn',
    tier: 'primary',
    active: true,
  },

  // Earn while travelling
  {
    id: 'fiverr',
    name: 'Fiverr',
    url:
      process.env.NEXT_PUBLIC_AFF_FIVERR ||
      'https://go.fiverr.com/visit/?bta=1169210&brand=fiverrmarketplace',
    blurb: 'World’s biggest freelance marketplace. Sell writing, design, dev, video and AI gigs to clients worldwide — perfect remote income for nomads.',
    category: 'earn-while-traveling',
    tier: 'primary',
    active: true,
  },
  // Host on Airbnb — referral for property owners who want to list their place
  {
    id: 'airbnb-host',
    name: 'Host on Airbnb',
    url: 'https://airbnb.fr/rp/sbitoun2?p=stay',
    blurb: 'Empty apartment while you travel? List it on Airbnb and cover your trip. Onboarding bonus for new hosts.',
    category: 'earn-while-traveling',
    tier: 'secondary',
    active: true,
  },

  // Travel meta
  {
    id: 'travelpayouts',
    name: 'Travelpayouts',
    url: TRAVELPAYOUTS.startsWith('http') ? TRAVELPAYOUTS : 'https://www.travelpayouts.com',
    blurb: 'Single account for Booking, Skyscanner, Kiwi, GetYourGuide and 90+ travel brands.',
    category: 'travel-meta',
    tier: 'primary',
    active: TRAVELPAYOUTS.startsWith('http'),
  },
  {
    id: 'viator',
    name: 'Viator',
    url: VIATOR.startsWith('http') ? VIATOR : 'https://www.viator.com',
    blurb: 'Tours, day trips and activities in 2 500+ destinations.',
    category: 'tours',
    tier: 'primary',
    active: VIATOR.startsWith('http'),
  },

  // Newsletter / email
  {
    id: 'beehiiv',
    name: 'Beehiiv',
    url: 'https://www.beehiiv.com/?via=sacha-bitoun',
    blurb: 'Modern newsletter platform with built-in monetisation. Used by the top nomad creators.',
    category: 'newsletter',
    tier: 'primary',
    active: true,
  },
  {
    id: 'aweber',
    name: 'AWeber',
    url: 'https://www.aweber.com/easy-email.htm?id=560652',
    blurb: 'Email marketing for solopreneurs. Free up to 500 subscribers, drag-and-drop automation.',
    category: 'newsletter',
    tier: 'primary',
    active: true,
  },

  // Productivity
  {
    id: 'fireflies',
    name: 'Fireflies',
    url: 'https://fireflies.ai/?fpr=sacha61',
    blurb: 'AI meeting notes. Auto-transcribes Zoom, Meet and Teams calls so you stay present.',
    category: 'productivity',
    tier: 'primary',
    active: true,
  },
  {
    id: 'skool',
    name: 'Skool',
    url: 'https://www.skool.com/signup?ref=ed047124b59a477596ccc32e3c786ee7',
    blurb: 'Paid communities for creators and educators. Where most nomad mastermind groups host.',
    category: 'productivity',
    tier: 'primary',
    active: true,
  },

  // AI / LLM
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/referral/zUyyYBl9ZQ',
    blurb: 'Anthropic Claude. Best LLM for long-form reasoning, research and writing.',
    category: 'ai-llm',
    tier: 'primary',
    active: true,
  },

  // Voice AI
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    url: 'https://try.elevenlabs.io/x3g7rn9eiuq9',
    blurb: 'Best-in-class AI voice cloning and TTS. 30+ languages, indistinguishable from human.',
    category: 'voice-ai',
    tier: 'primary',
    active: true,
  },
  {
    id: 'speechify',
    name: 'Speechify',
    url: 'https://share.speechify.com/mzTUJxt',
    blurb: 'Text-to-speech for reading articles, books and emails out loud. Perfect on travel days.',
    category: 'voice-ai',
    tier: 'primary',
    active: true,
  },
  {
    id: 'murf',
    name: 'Murf.ai',
    url: 'https://get.murf.ai/vurkutbp9bpv',
    blurb: 'AI voiceover for videos and podcasts. 120+ realistic voices in 20+ languages.',
    category: 'voice-ai',
    tier: 'primary',
    active: true,
  },

  // Earn while travelling
  {
    id: 'mercor',
    name: 'Mercor',
    url: 'https://t.mercor.com/sk2JJ',
    blurb: 'Get paid by AI labs to train LLMs in your field of expertise. Side income for nomads.',
    category: 'earn-while-traveling',
    tier: 'primary',
    active: true,
  },
  {
    id: 'braintrust',
    name: 'Braintrust',
    url: 'https://app.usebraintrust.com/r/sacha67/',
    blurb: 'Tech freelance marketplace with no platform fees. For devs, designers, PMs.',
    category: 'earn-while-traveling',
    tier: 'primary',
    active: true,
  },

  // Investing
  {
    id: 'esketit',
    name: 'Esketit',
    url: 'https://esketit.com/registration/?promo=R1005651463',
    blurb: 'P2P lending with 10-13% yields. Diversify part of your nomad savings outside crypto.',
    category: 'investing',
    tier: 'primary',
    scope: 'eu-only',
    active: true,
  },
  {
    id: 'enerfip',
    name: 'Enerfip',
    url: 'https://enerfip.fr/?ref=SB221ENF',
    blurb: 'Crowdfunding for renewable energy projects in France. 5-8% yields, tax-incentivised.',
    category: 'investing',
    tier: 'primary',
    scope: 'fr-only',
    active: true,
  },

  // Marketplace
  {
    id: 'appsumo',
    name: 'AppSumo',
    url: process.env.NEXT_PUBLIC_AFF_APPSUMO || 'https://appsumo.8odi.net/gRgbDg',
    blurb: 'Lifetime deals on SaaS tools for freelancers, creators and nomads. Pay once, use forever — build your stack for a fraction of subscription cost.',
    category: 'marketplace',
    tier: 'primary',
    active: true,
  },
  {
    id: 'amazon-fr',
    name: 'Amazon',
    url: 'https://amzn.to/4v8i8tB',
    blurb: 'Marketplace for nomad accessories: power banks, packing cubes, ear plugs, kindle.',
    category: 'marketplace',
    tier: 'primary',
    scope: 'fr-only',
    active: true,
  },

  // Mobility credits (secondary)
  {
    id: 'uber',
    name: 'Uber',
    url: 'https://referrals.uber.com/refer?id=cjxcxxkgctxw',
    blurb: 'Ride-share in every nomad city. 50% off your first 5 rides via this link.',
    category: 'mobility-credits',
    tier: 'secondary',
    active: true,
  },
  {
    id: 'uber-eats',
    name: 'Uber Eats',
    url: 'https://ubereats.com/feed?promoCode=eats-t3bvakknbc',
    blurb: 'Food delivery. New users get €10 off their first order.',
    category: 'mobility-credits',
    tier: 'secondary',
    active: true,
  },
  {
    id: 'lime',
    name: 'Lime',
    url: 'https://lime.bike/referral_signin/RAQYEB4',
    blurb: 'E-scooters and bikes in 200+ cities. Free €5 credit on signup.',
    category: 'mobility-credits',
    tier: 'secondary',
    active: true,
  },

  // Fitness credits
  {
    id: 'classpass',
    name: 'ClassPass',
    url: 'https://classpass.com/refer/ENGSJDT30?placement=OnDemand',
    blurb: 'Yoga, gym, pilates classes in 1 800+ cities. Stay fit while moving between bases.',
    category: 'fitness-credits',
    tier: 'secondary',
    active: true,
  },

  // Shopping credits
  {
    id: 'vinted',
    name: 'Vinted',
    url: 'https://www.vinted.fr/invite/sacha1718',
    blurb: 'Sell clothes you no longer need before hitting the road. EU marketplace.',
    category: 'shopping-credits',
    tier: 'secondary',
    scope: 'eu-only',
    active: true,
  },
];

export function getPartner(id: string): Partner | undefined {
  return PARTNERS.find((p) => p.id === id);
}

/**
 * Some partners (Wise) have per-currency affiliate links that we route by
 * locale. Use this at render time so each page links to the variant most
 * relevant to the visitor.
 */
export function resolvePartnerUrl(p: Partner, locale?: Locale | string): string {
  if (p.id === 'wise') return wiseUrl(locale);
  return p.url;
}

export function getPartnersByCategory(category: PartnerCategory): Partner[] {
  return PARTNERS.filter((p) => p.active && p.category === category);
}

export function getActivePartners(): Partner[] {
  return PARTNERS.filter((p) => p.active);
}

export function getPartners(opts: {
  categories?: PartnerCategory[];
  tier?: PartnerTier;
  locale?: Locale;
  limit?: number;
} = {}): Partner[] {
  const { categories, tier, locale, limit } = opts;
  let list = PARTNERS.filter((p) => p.active);
  if (categories?.length) list = list.filter((p) => categories.includes(p.category));
  if (tier) list = list.filter((p) => p.tier === tier);
  if (locale) {
    list = list.filter((p) => {
      if (!p.scope || p.scope === 'global') return true;
      if (p.scope === 'eu-only') {
        return locale === 'fr' || locale === 'es' || locale === 'pt' || locale === 'it' || locale === 'de' || locale === 'pl';
      }
      if (p.scope === 'fr-only') return locale === 'fr';
      if (p.scope === 'pt-only') return locale === 'pt';
      return true;
    });
  }
  if (limit) list = list.slice(0, limit);
  return list;
}
