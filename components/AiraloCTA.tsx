import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Data the moment you land',
    heading: 'Skip the airport SIM kiosk. Land already connected.',
    body: 'Airalo gives you an eSIM in 200 plus countries that activates in minutes from the app, with country and regional plans plus tethering. Use code SACHA6010 for 3 $ off your first plan; it pays the eSIM itself on most short trips.',
    cta: 'Get an Airalo eSIM',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'De la data dès l’atterrissage',
    heading: 'Saute le kiosque SIM de l’aéroport. Atterris déjà connecté.',
    body: 'Airalo te donne une eSIM dans 200+ pays, activée en quelques minutes depuis l’app, avec forfaits pays ou régionaux et le partage de connexion. Code SACHA6010 pour 3 $ de réduction sur ton premier plan, ça paie l’eSIM elle-même sur la plupart des trajets courts.',
    cta: 'Prendre une eSIM Airalo',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Datos al aterrizar',
    heading: 'Sáltate el quiosco de SIMs del aeropuerto. Aterriza ya conectado.',
    body: 'Airalo te da una eSIM en más de 200 países, activada en minutos desde la app, con planes por país o región y hotspot. Usa el código SACHA6010 para 3 $ de descuento en tu primer plan; suele pagar la propia eSIM en viajes cortos.',
    cta: 'Activar eSIM Airalo',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Dados assim que aterras',
    heading: 'Salta o quiosque SIM do aeroporto. Aterra já ligado.',
    body: 'A Airalo dá-te um eSIM em mais de 200 países, ativado em minutos pela app, com planos por país ou região e partilha de dados. Usa o código SACHA6010 para 3 $ de desconto no primeiro plano, geralmente paga o próprio eSIM em viagens curtas.',
    cta: 'Ativar eSIM Airalo',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Connessione appena atterri',
    heading: 'Salta il chiosco SIM in aeroporto. Atterra già connesso.',
    body: 'Airalo ti dà un eSIM in oltre 200 paesi, attivato in pochi minuti dall’app, con piani per paese o regione e tethering. Usa il codice SACHA6010 per 3 $ di sconto sul primo piano; spesso ripaga lo stesso eSIM nei viaggi brevi.',
    cta: 'Attivare un eSIM Airalo',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Daten ab Landung',
    heading: 'Spar dir den SIM-Kiosk am Flughafen. Lande schon online.',
    body: 'Airalo gibt dir eine eSIM in 200+ Ländern, die in Minuten in der App aktiv ist, mit Länder- und Regionalplänen plus Tethering. Code SACHA6010 für 3 $ Rabatt auf deinen ersten Plan; auf vielen Kurztrips zahlt sich die eSIM dadurch selbst.',
    cta: 'Airalo-eSIM holen',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Dane od razu po wylądowaniu',
    heading: 'Pomiń kiosk SIM na lotnisku. Wyląduj już z internetem.',
    body: 'Airalo daje Ci eSIM w ponad 200 krajach, aktywowany w minutę z aplikacji, z planami krajowymi i regionalnymi oraz tetheringiem. Użyj kodu SACHA6010, by zyskać 3 $ zniżki na pierwszy plan, często pokrywa cenę samego eSIM przy krótszych wyjazdach.',
    cta: 'Wziąć eSIM Airalo',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function AiraloCTA({ locale }: Props) {
  const p = getPartner('airalo');
  if (!p?.active) return null;
  const c = COPY[locale];

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-widest text-accent font-semibold">{c.eyebrow}</p>
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
