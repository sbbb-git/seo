import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'EU multi-currency spending',
    heading: 'Spend abroad at the real rate with Revolut.',
    body: 'A free EU account with virtual cards, real-rate FX up to your monthly cap, instant transfers between users, and a spending breakdown that turns "I think it cost €1,400" into a number. The daily-spending half of a nomad money stack.',
    cta: 'Open Revolut',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'Multidevises EU',
    heading: 'Dépense à l’étranger au taux réel avec Revolut.',
    body: 'Compte EU gratuit avec cartes virtuelles, change au taux réel dans la limite mensuelle, virements instantanés entre utilisateurs et un récap des dépenses qui transforme "ça m’a coûté ~1 400 €" en chiffre précis. La moitié dépenses-quotidiennes d’une stack d’argent en nomade.',
    cta: 'Ouvrir Revolut',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Multidivisa UE',
    heading: 'Gasta fuera al cambio real con Revolut.',
    body: 'Cuenta UE gratuita con tarjetas virtuales, cambio al precio real hasta tu límite mensual, transferencias instantáneas entre usuarios y un desglose de gasto que convierte "creo que costó 1.400 €" en una cifra. La mitad gasto-diario de una pila de dinero nómada.',
    cta: 'Abrir Revolut',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Multimoeda UE',
    heading: 'Gasta fora ao câmbio real com a Revolut.',
    body: 'Conta UE gratuita com cartões virtuais, câmbio ao preço real até ao teu plafond mensal, transferências instantâneas entre utilizadores e um resumo de gastos que transforma "acho que custou 1.400 €" num número. A metade gasto-diário de uma stack de dinheiro nómada.',
    cta: 'Abrir Revolut',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Multivaluta UE',
    heading: 'Spendi all’estero al cambio reale con Revolut.',
    body: 'Conto UE gratuito con carte virtuali, cambio al tasso reale fino al tetto mensile, trasferimenti istantanei tra utenti e un riepilogo delle spese che trasforma "credo siano stati 1.400 €" in un numero preciso. La metà spese-quotidiane di uno stack monetario da nomade.',
    cta: 'Aprire Revolut',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Multiwährungs-Alltag in der EU',
    heading: 'Im Ausland zum echten Kurs zahlen mit Revolut.',
    body: 'Kostenloses EU-Konto mit virtuellen Karten, Echtkurs-FX bis zum Monatslimit, Sofortüberweisungen zwischen Nutzern und eine Ausgabenübersicht, die "war wohl 1.400 €" in eine Zahl verwandelt. Die Alltags-Hälfte des Nomaden-Geld-Stacks.',
    cta: 'Revolut eröffnen',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Wielowalutowe wydatki UE',
    heading: 'Wydawaj za granicą po prawdziwym kursie z Revolut.',
    body: 'Darmowe konto UE z kartami wirtualnymi, przewalutowanie po realnym kursie do miesięcznego limitu, błyskawiczne przelewy między użytkownikami i podsumowanie wydatków, które zamienia "chyba ~1 400 €" w konkretną liczbę. Połowa codziennych wydatków stacku finansów nomady.',
    cta: 'Otworzyć Revolut',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function RevolutCTA({ locale }: Props) {
  const p = getPartner('revolut');
  // Revolut is EU-scoped. The page-level router only passes EU locales here,
  // but guard anyway so it never surfaces for an out-of-scope visitor.
  if (!p?.active) return null;
  const EU = new Set(['fr', 'es', 'pt', 'it', 'de', 'pl']);
  if (!EU.has(locale)) return null;
  const c = COPY[locale];

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-widest text-sky font-semibold">{c.eyebrow}</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tightish font-display leading-snug">{c.heading}</h2>
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
        <Link href={`/${locale}/disclosure`} className="hover:text-ink underline-offset-4 hover:underline">{c.disclosure}</Link>
      </p>
    </section>
  );
}
