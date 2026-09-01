import type { Locale } from '@/lib/i18n';
import { getUi, fillTpl } from '@/lib/ui';
import { SISTER_JOBS, slateremoteCountryUrl, slateremoteHomeUrl, jobsTagline } from '@/lib/sister-sites';

type Props = {
  locale?: Locale;
  countrySlug?: string;
  countryName?: string;
  cityName?: string;
  heading?: string;
  variant?: 'card' | 'inline';
};

export function JobsCTA({ locale, countrySlug, countryName, cityName, heading, variant = 'card' }: Props) {
  const url = countrySlug ? slateremoteCountryUrl(countrySlug, locale) : slateremoteHomeUrl(locale);
  const ui = getUi(locale);
  const computedHeading =
    heading ||
    (cityName
      ? fillTpl(ui.jobs.ctaCity, { name: countryName || cityName })
      : countryName
      ? fillTpl(ui.jobs.ctaCountry, { country: countryName })
      : ui.jobs.ctaGeneric);

  if (variant === 'inline') {
    return (
      <p className="mt-6 text-sm text-muted">
        {computedHeading}{' '}
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="text-accent font-semibold hover:text-accent-deep transition-colors underline-offset-4 hover:underline"
        >
          {ui.jobs.browseOn} {SISTER_JOBS.domain} ↗
        </a>
      </p>
    );
  }

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-accent-deep font-semibold">Sister site</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tightish font-display">{computedHeading}</h2>
        <p className="mt-2 text-sm text-muted max-w-md">{jobsTagline(locale)}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 rounded-md bg-ink text-cream px-5 py-2.5 text-sm font-medium hover:bg-accent-deep transition-colors whitespace-nowrap"
      >
        {ui.jobs.browseOn} {SISTER_JOBS.domain} <span aria-hidden>↗</span>
      </a>
    </section>
  );
}
