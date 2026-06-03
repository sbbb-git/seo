import { getPartner, resolvePartnerUrl } from '@/lib/partners';
import type { Locale } from '@/lib/i18n';

type Props = {
  id: string;
  locale?: Locale;
  /** Optional text override for the link */
  text?: string;
  /** Sentence prefix, e.g. "Save on transfers with" */
  prefix?: string;
  /** Sentence suffix */
  suffix?: string;
};

/**
 * Inline contextual mention of a partner. Used inside body copy.
 * Renders as: "Save on transfers with Wise →"
 */
export function PartnerInline({ id, locale, text, prefix, suffix }: Props) {
  const p = getPartner(id);
  if (!p) return null;
  const url = resolvePartnerUrl(p, locale);
  return (
    <span className="inline">
      {prefix && <span>{prefix} </span>}
      <a
        href={url}
        target="_blank"
        rel="nofollow noopener sponsored"
        className="font-semibold text-accent hover:text-accent-deep underline underline-offset-4 transition-colors"
      >
        {text || p.name}
        <span aria-hidden> ↗</span>
      </a>
      {suffix && <span> {suffix}</span>}
    </span>
  );
}
