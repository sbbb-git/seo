import { getPartner, resolvePartnerUrl } from '@/lib/partners';
import { partnerLogo } from '@/lib/images';
import type { Locale } from '@/lib/i18n';

type Variant = 'setup' | 'insurance' | 'banking' | 'esim' | 'vpn' | 'ai';

const VARIANTS: Record<Variant, { partnerId: string; eyebrow: string; headline: string; cta: string; tone: 'accent' | 'sage' | 'sky' | 'sand' }> = {
  setup: {
    partnerId: 'wise',
    eyebrow: 'Before you board the flight',
    headline: 'Open a multi-currency account in 2 minutes',
    cta: 'Get Wise (free)',
    tone: 'sage',
  },
  insurance: {
    partnerId: 'safetywing',
    eyebrow: 'Travel insurance for nomads',
    headline: 'From $45/mo. Covers 175+ countries. Cancel anytime.',
    cta: 'See SafetyWing plans',
    tone: 'accent',
  },
  banking: {
    partnerId: 'revolut',
    eyebrow: 'Spend abroad without fees',
    headline: 'Revolut: real exchange rate, virtual cards, free EU IBAN',
    cta: 'Open Revolut',
    tone: 'sky',
  },
  esim: {
    partnerId: 'airalo',
    eyebrow: 'Land with data already on',
    headline: 'eSIM for 200+ countries. $3 off with code SACHA6010.',
    cta: 'Get Airalo eSIM',
    tone: 'sand',
  },
  vpn: {
    partnerId: 'nordvpn',
    eyebrow: 'Hotel wifi is a minefield',
    headline: 'NordVPN: 6 devices, 60+ countries, kill switch',
    cta: 'Get NordVPN',
    tone: 'sky',
  },
  ai: {
    partnerId: 'claude',
    eyebrow: 'Your remote-work copilot',
    headline: 'Claude: long-form research, writing, and code from anywhere',
    cta: 'Try Claude',
    tone: 'accent',
  },
};

const TONE_CLASSES: Record<'accent' | 'sage' | 'sky' | 'sand', string> = {
  accent: 'border-accent-soft bg-accent-soft/40',
  sage: 'border-sage-soft bg-sage-soft/50',
  sky: 'border-sky-soft bg-sky-soft/50',
  sand: 'border-sand-soft bg-sand-soft/50',
};

type Props = {
  locale: Locale;
  variant: Variant;
  className?: string;
};

export function PromoBanner({ locale, variant, className = '' }: Props) {
  const cfg = VARIANTS[variant];
  const partner = getPartner(cfg.partnerId);
  if (!partner || !partner.active) return null;
  const url = resolvePartnerUrl(partner, locale);

  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow noopener sponsored"
      className={`group relative block overflow-hidden rounded-2xl border ${TONE_CLASSES[cfg.tone]} px-5 py-5 sm:px-6 sm:py-6 card-hover ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={partnerLogo(url)}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          className="w-12 h-12 rounded-lg object-contain flex-shrink-0 bg-cream border border-line/60 p-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest text-accent-deep font-semibold">{cfg.eyebrow}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted border border-line/70 bg-cream/60 px-1.5 py-0.5 rounded">Sponsored</span>
          </div>
          <h3 className="mt-1.5 font-semibold tracking-tightish text-base sm:text-lg leading-snug">{cfg.headline}</h3>
          <p className="mt-1 text-xs text-muted line-clamp-2">{partner.blurb}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-accent-deep transition-colors">
            {cfg.cta} <span aria-hidden>↗</span>
          </div>
        </div>
      </div>
    </a>
  );
}
