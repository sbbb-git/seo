import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Paid communities',
    heading: 'Turn your audience into recurring income on Skool.',
    body: 'Skool bundles a community feed, a course tool and gamification in one product so creators sell monthly access without stitching tools together. Async-friendly, ships from a laptop, and the platform most nomad mastermind groups quietly chose in 2025.',
    cta: 'Start on Skool',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'Communautés payantes',
    heading: 'Transforme ton audience en revenu récurrent sur Skool.',
    body: 'Skool réunit un feed de communauté, un outil de cours et de la gamification dans un seul produit, pour vendre un accès mensuel sans coller dix outils. Asynchrone, géré depuis un laptop, c’est la plateforme qu’ont silencieusement choisie la plupart des masterminds nomades en 2025.',
    cta: 'Lancer sur Skool',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Comunidades de pago',
    heading: 'Convierte tu audiencia en ingresos recurrentes con Skool.',
    body: 'Skool reúne un feed de comunidad, un creador de cursos y gamificación en un solo producto para vender acceso mensual sin pegar mil herramientas. Asíncrono, se gestiona desde un portátil, la plataforma que en 2025 eligieron en silencio la mayoría de masterminds nómadas.',
    cta: 'Empezar en Skool',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Comunidades pagas',
    heading: 'Transforma a tua audiência em rendimento recorrente no Skool.',
    body: 'O Skool junta um feed de comunidade, uma ferramenta de cursos e gamificação num só produto para vender acesso mensal sem colar dez ferramentas. Assíncrono, gerido a partir de um portátil, a plataforma que a maior parte dos masterminds nómadas escolheu em 2025 sem alarde.',
    cta: 'Começar no Skool',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Community a pagamento',
    heading: 'Trasforma la tua audience in reddito ricorrente su Skool.',
    body: 'Skool unisce feed di community, strumento corsi e gamification in un solo prodotto, così vendi l’accesso mensile senza incollare dieci tool. Asincrono, si gestisce da un laptop, la piattaforma scelta nel 2025 dalla maggior parte dei mastermind nomadi.',
    cta: 'Avvia su Skool',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Bezahlte Communities',
    heading: 'Mach aus deinem Publikum wiederkehrendes Einkommen auf Skool.',
    body: 'Skool bündelt Community-Feed, Kurs-Tool und Gamification in einem Produkt, damit Creator monatlichen Zugang verkaufen, ohne zehn Tools zusammenzukleben. Async-freundlich, vom Laptop aus geführt, und die Plattform, die 2025 die meisten Nomaden-Mastermind-Gruppen leise gewählt haben.',
    cta: 'Auf Skool starten',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Płatne społeczności',
    heading: 'Zamień swoją publiczność w stały dochód na Skool.',
    body: 'Skool łączy feed społeczności, narzędzie do kursów i gamifikację w jednym produkcie, dzięki czemu sprzedajesz miesięczny dostęp bez sklejania dziesięciu narzędzi. Asynchroniczne, prowadzone z laptopa, platforma, którą w 2025 po cichu wybrała większość mastermindów nomadów.',
    cta: 'Zacznij na Skool',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function SkoolCTA({ locale }: Props) {
  const p = getPartner('skool');
  if (!p?.active) return null;
  const c = COPY[locale];

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-widest text-accent-deep font-semibold">{c.eyebrow}</p>
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
