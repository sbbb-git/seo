import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Talent marketplace',
    heading: 'Sell what you do on Fiverr while you travel.',
    body: 'List a single, tight gig (writing, design, dev, video, AI) and let Fiverr put your offer in front of millions of buyers. The fastest path to paid remote work for nomads with no audience yet.',
    cta: 'Start on Fiverr',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'Marketplace freelance',
    heading: 'Vends tes compétences sur Fiverr pendant que tu voyages.',
    body: 'Publie un gig précis (rédaction, design, dev, vidéo, IA) et Fiverr met ton offre devant des millions d’acheteurs. La voie la plus rapide pour gagner ta vie en remote quand tu n’as pas encore d’audience.',
    cta: 'Démarrer sur Fiverr',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Marketplace freelance',
    heading: 'Vende lo que sabes hacer en Fiverr mientras viajas.',
    body: 'Publica un gig concreto (escritura, diseño, dev, vídeo, IA) y Fiverr coloca tu oferta delante de millones de compradores. La vía más rápida al trabajo remoto pagado para nómadas sin audiencia.',
    cta: 'Empezar en Fiverr',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Marketplace de freelancers',
    heading: 'Vende o que sabes fazer no Fiverr enquanto viajas.',
    body: 'Publica um gig focado (escrita, design, dev, vídeo, IA) e o Fiverr coloca a tua oferta à frente de milhões de compradores. O caminho mais rápido para rendimento remoto se ainda não tens audiência.',
    cta: 'Começar no Fiverr',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Marketplace freelance',
    heading: 'Vendi ciò che sai fare su Fiverr mentre viaggi.',
    body: 'Pubblica un gig mirato (scrittura, design, dev, video, IA) e Fiverr mette la tua offerta davanti a milioni di acquirenti. Il modo più rapido per arrivare a un reddito da remoto quando non hai ancora un pubblico.',
    cta: 'Inizia su Fiverr',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Freelance-Marktplatz',
    heading: 'Verkaufe deine Skills auf Fiverr, während du reist.',
    body: 'Veröffentliche einen klaren Gig (Schreiben, Design, Dev, Video, KI), und Fiverr bringt dein Angebot vor Millionen Käufer. Der schnellste Weg zu bezahltem Remote-Einkommen für Nomaden ohne Reichweite.',
    cta: 'Auf Fiverr starten',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Marketplace freelancerów',
    heading: 'Sprzedawaj swoje umiejętności na Fiverr w podróży.',
    body: 'Opublikuj jeden konkretny gig (pisanie, design, dev, wideo, AI), a Fiverr postawi Twoją ofertę przed milionami kupujących. Najszybsza droga do płatnej pracy zdalnej dla nomadów bez audytorium.',
    cta: 'Zacznij na Fiverr',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function FiverrCTA({ locale }: Props) {
  const p = getPartner('fiverr');
  if (!p?.active) return null;
  const c = COPY[locale];

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-widest text-sage font-semibold">
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
