import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Lifetime deals',
    heading: 'Most of the tools you pay monthly are on AppSumo for one payment.',
    body: 'A typical nomad SaaS stack runs $200 to $500 per month. Replacing three or four subscriptions with lifetime deals at $59 to $99 each often saves you a quarter of rent in your first year, then keeps paying back.',
    cta: 'Browse AppSumo deals',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'Deals à vie',
    heading: 'La plupart des outils mensuels sont sur AppSumo en paiement unique.',
    body: 'Une stack SaaS de nomade coûte entre 200 et 500 $ par mois. Remplacer trois ou quatre abonnements par des deals à vie à 59 ou 99 $ pièce te fait gagner un quart de loyer la première année, et ça compose les années suivantes.',
    cta: 'Voir les deals AppSumo',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Ofertas vitalicias',
    heading: 'La mayoría de las herramientas mensuales están en AppSumo de por vida.',
    body: 'Una stack SaaS típica de nómada cuesta de 200 a 500 $ al mes. Sustituir tres o cuatro suscripciones por ofertas vitalicias de 59 a 99 $ cada una te ahorra un cuarto de alquiler el primer año, y sigue dando el año siguiente.',
    cta: 'Ver ofertas AppSumo',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Ofertas vitalícias',
    heading: 'Quase todas as ferramentas mensais estão na AppSumo num pagamento único.',
    body: 'Um stack SaaS típico de nómada custa entre 200 e 500 $ por mês. Trocar três ou quatro subscrições por ofertas vitalícias de 59 a 99 $ cada poupa um trimestre de renda no primeiro ano, e continua a render depois.',
    cta: 'Ver ofertas AppSumo',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Offerte a vita',
    heading: 'Quasi tutti gli strumenti che paghi al mese sono su AppSumo in un’unica volta.',
    body: 'Uno stack SaaS da nomade costa tra 200 e 500 $ al mese. Sostituire tre o quattro abbonamenti con offerte a vita da 59 a 99 $ ciascuna fa risparmiare un trimestre di affitto nel primo anno e continua a rendere dopo.',
    cta: 'Vedi le offerte AppSumo',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Lifetime Deals',
    heading: 'Die meisten Monats-Tools gibt es auf AppSumo einmalig zahlbar.',
    body: 'Ein typischer Nomaden-SaaS-Stack kostet 200 bis 500 $ pro Monat. Wenn du drei oder vier Abos durch Lifetime Deals zu 59 bis 99 $ ersetzt, sparst du im ersten Jahr ein Quartal Miete, und das rechnet sich weiter.',
    cta: 'AppSumo-Deals ansehen',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Oferty dożywotnie',
    heading: 'Większość narzędzi miesięcznych jest na AppSumo w jednej płatności.',
    body: 'Typowy stack SaaS nomady kosztuje od 200 do 500 $ miesięcznie. Zastąpienie trzech lub czterech subskrypcji ofertami dożywotnimi po 59 lub 99 $ daje oszczędność na poziomie kwartału czynszu w pierwszym roku, i nadal się opłaca.',
    cta: 'Zobacz oferty AppSumo',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function AppSumoCTA({ locale }: Props) {
  const p = getPartner('appsumo');
  if (!p?.active) return null;
  const c = COPY[locale];

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-widest text-sand font-semibold">
            {c.eyebrow}
          </p>
          <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tightish font-display leading-snug">
            {c.heading}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">{c.body}</p>
        </div>
        <a
          href={p.url}
          target="_blank"
          rel="nofollow noopener sponsored"
          className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-5 py-2.5 text-sm font-semibold hover:bg-accent-deep transition-colors whitespace-nowrap"
        >
          {c.cta} <span aria-hidden>↗</span>
        </a>
      </div>
      <p className="mt-3 text-[11px] text-muted">
        <Link href={`/${locale}/disclosure`} className="hover:text-ink underline-offset-4 hover:underline">
          {c.disclosure}
        </Link>
      </p>
    </section>
  );
}
