import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'AI for serious work',
    heading: 'A thinking partner that fits in a window.',
    body: 'Claude is the closest thing to a senior collaborator most nomads have access to: long context, careful reasoning, clean writing in seven plus languages, and the kind of judgment that handles client briefs, research and code. The async tool that earns back its sub the first week.',
    cta: 'Try Claude',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'IA pour travail sérieux',
    heading: 'Un partenaire de réflexion qui tient dans une fenêtre.',
    body: 'Claude, c’est ce qui ressemble le plus à un collaborateur senior pour la plupart des nomades : contexte long, raisonnement soigneux, écriture propre dans 7+ langues et un jugement qui encaisse brief client, recherche et code. L’outil asynchrone qui rentabilise son abo dès la première semaine.',
    cta: 'Essayer Claude',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'IA para trabajo serio',
    heading: 'Un compañero de pensamiento que cabe en una ventana.',
    body: 'Claude es lo más parecido a un colaborador senior que tienen la mayoría de nómadas: contexto largo, razonamiento cuidadoso, escritura limpia en 7+ idiomas y un juicio que aguanta briefs de cliente, investigación y código. La herramienta asíncrona que recupera su suscripción la primera semana.',
    cta: 'Probar Claude',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'IA para trabalho a sério',
    heading: 'Um parceiro de pensamento que cabe numa janela.',
    body: 'O Claude é o mais perto de um colaborador sénior que a maior parte dos nómadas tem: contexto longo, raciocínio cuidadoso, escrita limpa em 7+ línguas e um juízo que aguenta briefs de cliente, investigação e código. A ferramenta assíncrona que paga a subscrição na primeira semana.',
    cta: 'Experimentar Claude',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'IA per lavoro serio',
    heading: 'Un compagno di pensiero che sta in una finestra.',
    body: 'Claude è quanto di più vicino a un collaboratore senior abbiano la maggior parte dei nomadi: contesto lungo, ragionamento accurato, scrittura pulita in 7+ lingue e un giudizio che regge brief cliente, ricerca e codice. Il tool asincrono che si ripaga l’abbonamento la prima settimana.',
    cta: 'Provare Claude',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'KI für ernsthafte Arbeit',
    heading: 'Ein Denkpartner, der in ein Fenster passt.',
    body: 'Claude ist das, was den meisten Nomaden am nächsten zu einem Senior-Kollaborateur kommt: langer Kontext, sorgfältiges Denken, sauberes Schreiben in 7+ Sprachen und ein Urteil, das Kunden-Briefs, Recherche und Code trägt. Das asynchrone Tool, dessen Abo sich in der ersten Woche bezahlt macht.',
    cta: 'Claude testen',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'AI do poważnej pracy',
    heading: 'Partner do myślenia, który mieści się w jednym oknie.',
    body: 'Claude to dla większości nomadów najbliższe doświadczenie współpracy z seniorem: długi kontekst, staranne rozumowanie, czyste pisanie w 7+ językach i osąd, który ogarnia brief klienta, research i kod. Asynchroniczne narzędzie, które zwraca koszt abonamentu w pierwszym tygodniu.',
    cta: 'Wypróbuj Claude’a',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function ClaudeCTA({ locale }: Props) {
  const p = getPartner('claude');
  if (!p?.active) return null;
  const c = COPY[locale];

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-widest text-sand font-semibold">{c.eyebrow}</p>
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
