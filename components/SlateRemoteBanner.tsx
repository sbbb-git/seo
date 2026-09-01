import type { Locale } from '@/lib/i18n';
import { getUi, fillTpl } from '@/lib/ui';
import { slateremoteHomeUrl, slateremoteCountryUrl, slateremoteRoleUrl } from '@/lib/sister-sites';

type Props = {
  locale: Locale;
  countrySlug?: string;
  countryName?: string;
  role?: string;
  className?: string;
  size?: 'compact' | 'hero';
};

/**
 * Bold, hard-to-miss banner pushing slateremote.com as THE place to find
 * the remote job that funds the slow-travel life this site is about.
 * Designed to be repeated across the site without feeling spammy because
 * it answers a real question ("ok cool, but where do I find the job?").
 */
export function SlateRemoteBanner({
  locale,
  countrySlug,
  countryName,
  role,
  className = '',
  size = 'hero',
}: Props) {
  const url = role
    ? slateremoteRoleUrl(role, locale)
    : countrySlug
    ? slateremoteCountryUrl(countrySlug, locale)
    : slateremoteHomeUrl(locale);

  const ui = getUi(locale);
  const headline = role
    ? fillTpl(ui.jobs.headlineRole, { role })
    : countryName
    ? fillTpl(ui.jobs.headlineCountry, { country: countryName })
    : ui.jobs.headlineGeneric;

  const subline = role
    ? fillTpl(ui.jobs.sublineRole, { role })
    : countryName
    ? fillTpl(ui.jobs.sublineCountry, { country: countryName })
    : ui.jobs.sublineGeneric;

  if (size === 'compact') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className={`group flex items-center justify-between gap-3 rounded-xl border border-ink bg-ink text-cream px-5 py-3.5 hover:bg-accent-deep transition-colors ${className}`}
      >
        <div>
          <p className="text-[10px] uppercase tracking-widest text-cream/70 font-semibold">{ui.jobs.sisterSite} · Slate Remote</p>
          <p className="mt-0.5 text-sm font-semibold tracking-tightish">{headline}</p>
        </div>
        <span aria-hidden className="text-cream group-hover:translate-x-0.5 transition-transform text-lg">↗</span>
      </a>
    );
  }

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-ink bg-ink text-cream px-6 py-8 sm:px-10 sm:py-12 ${className}`}
    >
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-accent/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
      <div className="relative grid lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/10 border border-cream/20 text-cream text-[10px] uppercase tracking-widest font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {ui.jobs.sisterSite} · slateremote.com
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tightish font-display">
            {headline}
          </h2>
          <p className="mt-3 text-cream/80 leading-relaxed max-w-2xl">{subline}</p>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          <a
            href={url}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-md bg-cream text-ink px-6 py-3 text-sm font-semibold hover:bg-accent hover:text-cream transition-colors"
          >
            {ui.jobs.searchJobs} <span aria-hidden>↗</span>
          </a>
          <p className="mt-3 text-[11px] text-cream/60">{ui.jobs.perks}</p>
        </div>
      </div>
    </section>
  );
}
