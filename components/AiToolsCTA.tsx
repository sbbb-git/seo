import type { Locale } from '@/lib/i18n';
import { SISTER_AI, aiByJobRoleUrl, aiByJobHomeUrl, aiTagline } from '@/lib/sister-sites';

type Props = {
  locale?: Locale;
  role?: string;
  heading?: string;
  variant?: 'card' | 'inline';
};

export function AiToolsCTA({ locale, role, heading, variant = 'card' }: Props) {
  const url = role ? aiByJobRoleUrl(role, locale) : aiByJobHomeUrl(locale);
  const computedHeading =
    heading ||
    (role
      ? `AI tools to make remote work as a ${role} lighter`
      : 'AI tools to make remote work lighter');

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
          Browse on {SISTER_AI.domain} ↗
        </a>
      </p>
    );
  }

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-accent-deep font-semibold">Sister site</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tightish font-display">{computedHeading}</h2>
        <p className="mt-2 text-sm text-muted max-w-md">{aiTagline(locale)}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 rounded-md bg-ink text-cream px-5 py-2.5 text-sm font-medium hover:bg-accent-deep transition-colors whitespace-nowrap"
      >
        Browse on {SISTER_AI.domain} <span aria-hidden>↗</span>
      </a>
    </section>
  );
}
