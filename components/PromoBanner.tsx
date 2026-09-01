import { getPartner, resolvePartnerUrl } from '@/lib/partners';
import { partnerLogo } from '@/lib/images';
import { partnerBlurb } from '@/lib/partner-blurbs';
import type { Locale } from '@/lib/i18n';
import { getUi } from '@/lib/ui';

type Variant = 'setup' | 'insurance' | 'banking' | 'esim' | 'vpn' | 'ai';

// Partner + styling per variant; the copy itself is localized via `ui.promo`.
const VARIANTS: Record<Variant, { partnerId: string; tone: 'accent' | 'sage' | 'sky' | 'sand' }> = {
  setup: { partnerId: 'wise', tone: 'sage' },
  insurance: { partnerId: 'safetywing', tone: 'accent' },
  banking: { partnerId: 'revolut', tone: 'sky' },
  esim: { partnerId: 'airalo', tone: 'sand' },
  vpn: { partnerId: 'nordvpn', tone: 'sky' },
  ai: { partnerId: 'claude', tone: 'accent' },
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
  const ui = getUi(locale);
  const copy = ui.promo[variant];

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
            <span className="text-[10px] uppercase tracking-widest text-accent-deep font-semibold">{copy.eyebrow}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted border border-line/70 bg-cream/60 px-1.5 py-0.5 rounded">{ui.sponsored}</span>
          </div>
          <h3 className="mt-1.5 font-semibold tracking-tightish text-base sm:text-lg leading-snug">{copy.headline}</h3>
          <p className="mt-1 text-xs text-muted line-clamp-2">{partnerBlurb(partner.id, partner.blurb, locale)}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-accent-deep transition-colors">
            {copy.cta} <span aria-hidden>↗</span>
          </div>
        </div>
      </div>
    </a>
  );
}
