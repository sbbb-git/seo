import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Newsletter platform',
    heading: 'Turn your writing into a newsletter on Beehiiv.',
    body: 'Beehiiv is what most independent nomad creators picked in 2025 and 2026 for paid subscriptions, ads, recommendations and growth tools, with deliverability that actually lands in inbox.',
    cta: 'Start a newsletter',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'Plateforme newsletter',
    heading: 'Transforme ton écriture en newsletter sur Beehiiv.',
    body: 'Beehiiv, c’est la plateforme qu’ont choisie la plupart des créateurs nomades indépendants en 2025 et 2026 pour les abonnements payants, la pub, les recommandations et la croissance, avec une délivrabilité qui arrive vraiment en inbox.',
    cta: 'Lancer une newsletter',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Plataforma de newsletter',
    heading: 'Convierte tu escritura en newsletter con Beehiiv.',
    body: 'Beehiiv es la plataforma que eligieron la mayoría de creadores nómadas en 2025 y 2026 para suscripciones de pago, anuncios, recomendaciones y herramientas de crecimiento, con una entregabilidad que sí llega a la bandeja de entrada.',
    cta: 'Crear una newsletter',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Plataforma de newsletter',
    heading: 'Transforma a tua escrita numa newsletter no Beehiiv.',
    body: 'O Beehiiv foi a escolha da maioria dos criadores nómadas independentes em 2025 e 2026 para subscrições pagas, anúncios, recomendações e crescimento, com uma entregabilidade que chega mesmo à caixa de entrada.',
    cta: 'Criar uma newsletter',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Piattaforma newsletter',
    heading: 'Trasforma la tua scrittura in una newsletter su Beehiiv.',
    body: 'Beehiiv è la piattaforma scelta dalla maggior parte dei creator nomadi indipendenti nel 2025 e 2026 per abbonamenti a pagamento, sponsor, raccomandazioni e crescita, con una deliverability che arriva davvero in inbox.',
    cta: 'Avvia una newsletter',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Newsletter-Plattform',
    heading: 'Mach aus deinem Schreiben einen Newsletter auf Beehiiv.',
    body: 'Beehiiv ist die Plattform, die die meisten unabhängigen Nomaden-Creator 2025 und 2026 für bezahlte Abos, Werbung, Empfehlungen und Wachstum gewählt haben, mit einer Zustellbarkeit, die tatsächlich im Posteingang landet.',
    cta: 'Newsletter starten',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Platforma newsletterowa',
    heading: 'Zamień swoje pisanie w newsletter na Beehiiv.',
    body: 'Beehiiv to platforma, którą wybrała większość niezależnych twórców nomadów w 2025 i 2026 roku, dzięki płatnym subskrypcjom, reklamom, rekomendacjom i narzędziom wzrostu, z dostarczalnością, która faktycznie trafia do skrzynki.',
    cta: 'Załóż newsletter',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function BeehiivCTA({ locale }: Props) {
  const p = getPartner('beehiiv');
  if (!p?.active) return null;
  const c = COPY[locale];

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-widest text-accent-deep font-semibold">
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
