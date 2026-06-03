import { getPartners, resolvePartnerUrl, type Partner, type PartnerCategory } from '@/lib/partners';
import { partnerLogo } from '@/lib/images';
import type { Locale } from '@/lib/i18n';

type Props = {
  locale: Locale;
  categories: PartnerCategory[];
  heading?: string;
  limit?: number;
};

/**
 * Eye-catching primary CTA block. Used at the TOP of detail pages
 * to capture attention before the user reads the data.
 */
export function FeaturedPartners({ locale, categories, heading = 'Set up in 2 minutes', limit = 3 }: Props) {
  const partners = getPartners({ categories, locale, tier: 'primary', limit });
  if (partners.length === 0) return null;

  return (
    <section className="mt-6 rounded-2xl border border-accent-soft bg-accent-soft/30 px-5 py-5 sm:px-6 sm:py-6">
      <p className="text-[10px] uppercase tracking-widest text-accent-deep font-semibold">{heading}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {partners.map((p: Partner) => {
          const url = resolvePartnerUrl(p, locale);
          return (
          <li key={p.id}>
            <a
              href={url}
              target="_blank"
              rel="nofollow noopener sponsored"
              className="flex items-start gap-2 rounded-lg bg-paper border border-line px-4 py-3 hover:border-ink card-hover h-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partnerLogo(url)}
                alt=""
                width={28}
                height={28}
                loading="lazy"
                className="w-7 h-7 rounded-md object-contain flex-shrink-0 bg-cream border border-line/60"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm tracking-tightish">{p.name}</span>
                  <span aria-hidden className="text-accent text-sm">↗</span>
                </div>
                <p className="mt-1 text-xs text-muted line-clamp-2">{p.blurb}</p>
              </div>
            </a>
          </li>
          );
        })}
      </ul>
    </section>
  );
}
