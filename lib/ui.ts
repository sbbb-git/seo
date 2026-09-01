// Synchronous accessor for the shared `ui` copy.
//
// Components like PromoBanner, JobsCTA and PartnerStack render on ~5200 pages
// and only ever receive a `locale` — they cannot await getDictionary(), and
// threading the strings down from every one of the 114 call sites would be
// both noisy and easy to get wrong. Importing the locale files statically here
// gives those components a sync lookup; the modules are shared with
// getDictionary()'s dynamic import, so this does not duplicate them.
import type { Locale, Ui } from '@/lib/i18n';
import { DEFAULT_LOCALE } from '@/lib/i18n';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import es from '@/locales/es.json';
import pt from '@/locales/pt.json';
import it from '@/locales/it.json';
import de from '@/locales/de.json';
import pl from '@/locales/pl.json';

const UI: Record<Locale, Ui> = {
  en: en.ui as Ui,
  fr: fr.ui as Ui,
  es: es.ui as Ui,
  pt: pt.ui as Ui,
  it: it.ui as Ui,
  de: de.ui as Ui,
  pl: pl.ui as Ui,
};

export function getUi(locale?: Locale): Ui {
  return (locale && UI[locale]) || UI[DEFAULT_LOCALE];
}

/** Replace {placeholders} in a template string. */
export function fillTpl(tpl: string, vars: Record<string, string | undefined>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}
