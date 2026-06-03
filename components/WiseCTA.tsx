import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { wiseUrl } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Multi-currency banking',
    heading: 'Get paid in any currency and stop bleeding on FX.',
    body: 'A Wise multi-currency account gives you EUR, USD, GBP and 40+ other receiving details, real-rate conversion when you choose, and one card that spends abroad without a markup. The default nomad money pipe.',
    cta: 'Open a Wise account',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'Compte multidevises',
    heading: 'Sois payé dans toutes les devises sans saigner sur le change.',
    body: 'Un compte Wise te donne des coordonnées en EUR, USD, GBP et 40+ autres, une conversion au taux réel quand tu choisis, et une carte qui dépense à l’étranger sans surcoût. Le tuyau de base pour l’argent en nomade.',
    cta: 'Ouvrir un compte Wise',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Cuenta multidivisa',
    heading: 'Cobra en cualquier divisa y deja de perder en el cambio.',
    body: 'Una cuenta Wise te da datos para recibir en EUR, USD, GBP y más de 40 divisas, conversión al cambio real cuando tú decides, y una tarjeta que gasta en el extranjero sin recargo. La tubería estándar del dinero nómada.',
    cta: 'Abrir cuenta Wise',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Conta multimoeda',
    heading: 'Recebe em qualquer moeda e deixa de perder no câmbio.',
    body: 'Uma conta Wise dá-te dados para receber em EUR, USD, GBP e mais de 40 moedas, conversão ao câmbio real quando quiseres, e um cartão que gasta no estrangeiro sem agravamento. O canal padrão do dinheiro de nómada.',
    cta: 'Abrir conta Wise',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Conto multivaluta',
    heading: 'Fatti pagare in ogni valuta senza perdere sul cambio.',
    body: 'Un conto Wise ti dà dati per ricevere in EUR, USD, GBP e oltre 40 valute, conversione al cambio reale quando decidi tu, e una carta che spende all’estero senza maggiorazioni. Il canale standard del denaro da nomade.',
    cta: 'Aprire un conto Wise',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Multiwährungskonto',
    heading: 'Lass dich in jeder Währung bezahlen und spare den FX-Aufschlag.',
    body: 'Ein Wise-Multiwährungskonto gibt dir EUR-, USD-, GBP- und 40+ Empfangsdaten, Umtausch zum echten Kurs, wann du willst, und eine Karte, die im Ausland ohne Markup zahlt. Die Standard-Geldleitung für Nomaden.',
    cta: 'Wise-Konto eröffnen',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Konto wielowalutowe',
    heading: 'Otrzymuj płatności w każdej walucie i przestań tracić na FX.',
    body: 'Konto Wise daje Ci dane do odbioru w EUR, USD, GBP i ponad 40 walutach, przewalutowanie po prawdziwym kursie wtedy, kiedy chcesz, oraz kartę bez prowizji za płatności za granicą. Standardowy kanał pieniędzy nomady.',
    cta: 'Otwórz konto Wise',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function WiseCTA({ locale }: Props) {
  const url = wiseUrl(locale);
  const c = COPY[locale];

  return (
    <section className="mt-12 rounded-2xl border border-line bg-paper-gradient px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-widest text-sky font-semibold">
            {c.eyebrow}
          </p>
          <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tightish font-display leading-snug">
            {c.heading}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">{c.body}</p>
        </div>
        <a
          href={url}
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
