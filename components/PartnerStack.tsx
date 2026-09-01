import { getPartners, resolvePartnerUrl, type PartnerCategory } from '@/lib/partners';
import { partnerLogo } from '@/lib/images';
import { partnerBlurb } from '@/lib/partner-blurbs';
import type { Locale } from '@/lib/i18n';
import { getUi } from '@/lib/ui';

type Props = {
  locale?: Locale;
  categories?: PartnerCategory[];
  heading?: string;
  limit?: number;
};

export function PartnerStack({
  locale,
  categories,
  heading,
  limit = 6,
}: Props) {
  const partners = getPartners({ categories, locale, limit });
  const resolvedHeading = heading || getUi(locale).partnerStackHeading;
  if (partners.length === 0) return null;

  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="text-sm uppercase tracking-widest text-muted">{resolvedHeading}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {partners.map((p) => {
          const url = resolvePartnerUrl(p, locale);
          return (
          <li key={p.id}>
            <a
              href={url}
              target="_blank"
              rel="nofollow noopener sponsored"
              className="flex items-start gap-3 rounded-lg border border-line bg-paper px-4 py-3 card-hover"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partnerLogo(url)}
                alt={`${p.name} logo`}
                width={32}
                height={32}
                loading="lazy"
                className="w-8 h-8 rounded-md object-contain flex-shrink-0 bg-cream border border-line/60"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold tracking-tightish">{p.name}</p>
                  <span className="text-[10px] uppercase tracking-widest text-muted">
                    {p.category.replace('-', ' ')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted leading-snug">{partnerBlurb(p.id, p.blurb, locale)}</p>
              </div>
            </a>
          </li>
          );
        })}
      </ul>
    </section>
  );
}
