import type { Locale } from '@/lib/i18n';
import { LOCALES } from '@/lib/i18n';

export const SISTER_JOBS = {
  name: 'Slate Remote',
  domain: 'slateremote.com',
  url: 'https://slateremote.com',
  tagline: 'Remote tech jobs from across the web, refreshed daily.',
} as const;

export const SISTER_AI = {
  name: 'AI by Job',
  domain: 'ai-by-job.com',
  url: 'https://ai-by-job.com',
  tagline: 'The best AI tools for every job, in 7 languages.',
} as const;

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Pick a locale supported by the sister sites (same 7 locales today). Falls back to 'en'. */
function pickSisterLocale(locale?: Locale | string): Locale {
  if (locale && (LOCALES as readonly string[]).includes(locale)) return locale as Locale;
  return 'en';
}

export function slateremoteHomeUrl(locale?: Locale | string): string {
  return `${SISTER_JOBS.url}/${pickSisterLocale(locale)}`;
}

export function aiByJobHomeUrl(locale?: Locale | string): string {
  return `${SISTER_AI.url}/${pickSisterLocale(locale)}`;
}

export function slateremoteCountryUrl(country?: string, locale?: Locale | string): string {
  const l = pickSisterLocale(locale);
  if (!country) return `${SISTER_JOBS.url}/${l}`;
  return `${SISTER_JOBS.url}/${l}/locations/${slug(country)}`;
}

export function slateremoteRoleUrl(role?: string, locale?: Locale | string): string {
  const l = pickSisterLocale(locale);
  if (!role) return `${SISTER_JOBS.url}/${l}`;
  return `${SISTER_JOBS.url}/${l}/jobs/${slug(role)}`;
}

export function aiByJobRoleUrl(role?: string, locale?: Locale | string): string {
  const l = pickSisterLocale(locale);
  if (!role) return `${SISTER_AI.url}/${l}`;
  return `${SISTER_AI.url}/${l}/jobs/${slug(role)}`;
}

// Localized taglines. The `tagline` constants above stay as the English
// source of truth (llms.txt and any non-localized surface still use them);
// UI components resolve through these so the footer and the Jobs / AI CTA
// blocks are not English islands on the six other locales.
const JOBS_TAGLINE: Partial<Record<Locale, string>> = {
  fr: 'Des offres tech en remote venues de tout le web, actualisées chaque jour.',
  es: 'Empleos tech en remoto de toda la web, actualizados a diario.',
  pt: 'Vagas tech remotas de toda a web, atualizadas diariamente.',
  it: 'Offerte tech da remoto da tutto il web, aggiornate ogni giorno.',
  de: 'Remote-Tech-Jobs aus dem ganzen Web, täglich aktualisiert.',
  pl: 'Zdalne oferty tech z całego internetu, odświeżane codziennie.',
};

const AI_TAGLINE: Partial<Record<Locale, string>> = {
  fr: 'Les meilleurs outils IA pour chaque métier, en 7 langues.',
  es: 'Las mejores herramientas de IA para cada profesión, en 7 idiomas.',
  pt: 'As melhores ferramentas de IA para cada profissão, em 7 idiomas.',
  it: 'I migliori strumenti IA per ogni professione, in 7 lingue.',
  de: 'Die besten KI-Tools für jeden Beruf, in 7 Sprachen.',
  pl: 'Najlepsze narzędzia AI do każdego zawodu, w 7 językach.',
};

export function jobsTagline(locale?: Locale): string {
  return (locale && JOBS_TAGLINE[locale]) || SISTER_JOBS.tagline;
}

export function aiTagline(locale?: Locale): string {
  return (locale && AI_TAGLINE[locale]) || SISTER_AI.tagline;
}
