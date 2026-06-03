import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'AI training income',
    heading: 'Get paid by AI labs to train LLMs in your field.',
    body: 'Mercor matches doctors, lawyers, engineers, writers and multilingual experts with AI labs that need real domain knowledge to train better models. Rates run $25 to $60 per hour, sometimes higher. Work async, from any base, on your own schedule.',
    cta: 'Apply on Mercor',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'Revenus en entraînement d’IA',
    heading: 'Sois payé par des labs IA pour entraîner des LLM dans ton domaine.',
    body: 'Mercor met en relation médecins, avocats, ingénieurs, rédacteurs et experts multilingues avec des labs IA qui ont besoin de vraie expertise pour entraîner de meilleurs modèles. Les tarifs vont de 25 à 60 $/h, parfois plus. Travail asynchrone, depuis n’importe quelle base, à ton rythme.',
    cta: 'Candidater sur Mercor',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Ingresos por entrenar IA',
    heading: 'Cobra de los labs de IA por entrenar LLMs en tu campo.',
    body: 'Mercor conecta a médicos, abogados, ingenieros, redactores y expertos multilingües con labs de IA que necesitan conocimiento real para entrenar mejores modelos. Tarifas de 25 a 60 $ por hora, a veces más. Trabajo asíncrono, desde cualquier base, a tu ritmo.',
    cta: 'Solicitar en Mercor',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Rendimento a treinar IA',
    heading: 'Recebe de labs de IA para treinar LLMs na tua área.',
    body: 'A Mercor liga médicos, advogados, engenheiros, escritores e especialistas multilingues a labs de IA que precisam de conhecimento real para treinar modelos melhores. Tarifas de 25 a 60 $ por hora, por vezes mais. Trabalho assíncrono, a partir de qualquer base, ao teu ritmo.',
    cta: 'Candidatar na Mercor',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Reddito da training IA',
    heading: 'Fatti pagare dai lab IA per addestrare LLM nel tuo campo.',
    body: 'Mercor mette in contatto medici, avvocati, ingegneri, scrittori e esperti multilingui con lab IA che hanno bisogno di vera competenza per addestrare modelli migliori. Tariffe da 25 a 60 $ all’ora, a volte di più. Lavoro asincrono, da qualunque base, al tuo ritmo.',
    cta: 'Candidati su Mercor',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Einkommen durch KI-Training',
    heading: 'Lass dich von KI-Labs für das Training von LLMs in deinem Fach bezahlen.',
    body: 'Mercor verbindet Ärzte, Juristen, Ingenieure, Autoren und mehrsprachige Experten mit KI-Labs, die echtes Fachwissen brauchen, um bessere Modelle zu trainieren. Stundensätze von 25 bis 60 $, manchmal mehr. Asynchrone Arbeit, von jeder Basis aus, in deinem Tempo.',
    cta: 'Bei Mercor bewerben',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Dochód z trenowania AI',
    heading: 'Otrzymuj wynagrodzenie od laboratoriów AI za trenowanie LLM w Twojej dziedzinie.',
    body: 'Mercor łączy lekarzy, prawników, inżynierów, pisarzy i ekspertów wielojęzycznych z laboratoriami AI, które potrzebują prawdziwej wiedzy specjalistycznej do trenowania lepszych modeli. Stawki od 25 do 60 $ za godzinę, czasem więcej. Praca asynchroniczna, z dowolnej bazy, we własnym tempie.',
    cta: 'Aplikuj na Mercor',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function MercorCTA({ locale }: Props) {
  const p = getPartner('mercor');
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
