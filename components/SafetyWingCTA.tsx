import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Nomad health insurance',
    heading: 'Cover required by most digital nomad visas, from $45 per month.',
    body: 'SafetyWing meets the minimum cover most consulates ask for and works in 175+ countries. You can cancel monthly, add or remove family, and switch base countries without re-applying. The default insurance line on a visa application.',
    cta: 'Get a SafetyWing quote',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'Assurance santé nomade',
    heading: 'Couverture exigée par la plupart des visas nomades, à partir de 45 $ par mois.',
    body: 'SafetyWing couvre le minimum demandé par la majorité des consulats et fonctionne dans 175+ pays. Tu peux résilier au mois, ajouter ou retirer la famille, changer de pays de base sans tout refaire. La ligne d’assurance par défaut sur un dossier de visa.',
    cta: 'Devis SafetyWing',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Seguro de salud nómada',
    heading: 'Cobertura exigida por casi todos los visados de nómada, desde 45 $ al mes.',
    body: 'SafetyWing cumple el mínimo que piden la mayoría de consulados y funciona en más de 175 países. Cancelas al mes, añades o quitas familia, cambias de país base sin volver a empezar. La línea de seguro por defecto en una solicitud de visado.',
    cta: 'Cotizar SafetyWing',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Seguro de saúde para nómadas',
    heading: 'Cobertura exigida pela maioria dos vistos nómadas, a partir de 45 $ por mês.',
    body: 'A SafetyWing cumpre o mínimo que a maioria dos consulados pede e funciona em 175+ países. Cancelas ao mês, adicionas ou retiras família, mudas de país base sem voltar a candidatar. A linha de seguro padrão num pedido de visto.',
    cta: 'Orçamento SafetyWing',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Assicurazione sanitaria nomade',
    heading: 'Copertura richiesta dalla maggior parte dei visti nomadi, da 45 $ al mese.',
    body: 'SafetyWing rispetta il minimo che chiedono i consolati e funziona in oltre 175 paesi. Disdici al mese, aggiungi o togli familiari, cambi paese base senza ripartire da zero. La linea assicurativa di default in una domanda di visto.',
    cta: 'Preventivo SafetyWing',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Nomaden-Krankenversicherung',
    heading: 'Vom Konsulat verlangter Versicherungsschutz, ab 45 $ pro Monat.',
    body: 'SafetyWing erfüllt den Mindestschutz, den die meisten Konsulate verlangen, und funktioniert in 175+ Ländern. Du kündigst monatlich, fügst Familie hinzu oder raus, wechselst das Basisland ohne neuen Antrag. Die Standard-Versicherung im Visumantrag.',
    cta: 'SafetyWing-Angebot',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Ubezpieczenie zdrowotne dla nomadów',
    heading: 'Pokrycie wymagane przez większość wiz nomadów, od 45 $ miesięcznie.',
    body: 'SafetyWing spełnia minimum, którego wymaga większość konsulatów, i działa w ponad 175 krajach. Rezygnujesz w skali miesiąca, dodajesz lub usuwasz rodzinę, zmieniasz kraj bazowy bez ponownego wniosku. Standardowa pozycja ubezpieczeniowa we wniosku wizowym.',
    cta: 'Wycena SafetyWing',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function SafetyWingCTA({ locale }: Props) {
  const p = getPartner('safetywing');
  if (!p?.active) return null;
  const c = COPY[locale];

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-widest text-accent font-semibold">
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
