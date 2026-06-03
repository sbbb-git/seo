import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getPartner } from '@/lib/partners';

type Copy = { eyebrow: string; heading: string; body: string; cta: string; disclosure: string };

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Privacy and access',
    heading: 'Public wifi is the threat model nomads forget.',
    body: 'NordVPN with the kill-switch on means hotel and café wifi can drop without leaking your work traffic. Six devices on one account, fast servers in 60 plus countries, and the side benefit of getting your bank app to talk to you from anywhere.',
    cta: 'Get NordVPN',
    disclosure: 'Affiliate link, see disclosure',
  },
  fr: {
    eyebrow: 'Confidentialité et accès',
    heading: 'Le wifi public, c’est le vrai risque qu’on sous-estime en nomade.',
    body: 'NordVPN avec kill-switch actif : le wifi de l’hôtel ou du café peut sauter sans laisser fuir ton trafic boulot. Six appareils sur un compte, serveurs rapides dans 60+ pays, bonus la banque qui te parle depuis n’importe où.',
    cta: 'Prendre NordVPN',
    disclosure: 'Lien affilié, voir la divulgation',
  },
  es: {
    eyebrow: 'Privacidad y acceso',
    heading: 'El wifi público es el riesgo real que los nómadas pasan por alto.',
    body: 'NordVPN con el kill-switch activo: el wifi del hotel o del café se cae sin filtrar tu tráfico de trabajo. Seis dispositivos por cuenta, servidores rápidos en más de 60 países, y de paso tu banco te habla desde donde estés.',
    cta: 'Activar NordVPN',
    disclosure: 'Enlace afiliado, ver divulgación',
  },
  pt: {
    eyebrow: 'Privacidade e acesso',
    heading: 'O wifi público é o risco real que os nómadas esquecem.',
    body: 'NordVPN com kill-switch ligado: o wifi do hotel ou do café pode cair sem expor o teu tráfego de trabalho. Seis dispositivos por conta, servidores rápidos em mais de 60 países, e de bónus o teu banco aceita falar contigo de qualquer lado.',
    cta: 'Obter NordVPN',
    disclosure: 'Link de afiliado, ver divulgação',
  },
  it: {
    eyebrow: 'Privacy e accesso',
    heading: 'Il wifi pubblico è il rischio che i nomadi sottovalutano.',
    body: 'NordVPN con il kill-switch attivo: il wifi dell’hotel o del bar può cadere senza far uscire il tuo traffico di lavoro. Sei dispositivi su un account, server rapidi in oltre 60 paesi e bonus la banca che ti parla da ovunque.',
    cta: 'Attivare NordVPN',
    disclosure: 'Link affiliato, vedi la divulgazione',
  },
  de: {
    eyebrow: 'Privatsphäre und Zugriff',
    heading: 'Öffentliches WLAN ist das Bedrohungsmodell, das Nomaden vergessen.',
    body: 'NordVPN mit Kill-Switch: Hotel- oder Café-WLAN darf zusammenbrechen, ohne dass dein Arbeitsverkehr nach außen leakt. Sechs Geräte pro Konto, schnelle Server in 60+ Ländern, und nebenbei spricht deine Bank-App wieder mit dir.',
    cta: 'NordVPN holen',
    disclosure: 'Affiliate-Link, siehe Offenlegung',
  },
  pl: {
    eyebrow: 'Prywatność i dostęp',
    heading: 'Publiczne wifi to model zagrożenia, o którym nomadowie zapominają.',
    body: 'NordVPN z włączonym kill-switchem: wifi w hotelu lub kawiarni może paść, a Twój ruch roboczy nie wycieknie. Sześć urządzeń na konto, szybkie serwery w ponad 60 krajach, a w bonusie aplikacja bankowa znów z Tobą rozmawia.',
    cta: 'Wziąć NordVPN',
    disclosure: 'Link afiliacyjny, zobacz informację',
  },
};

type Props = { locale: Locale };

export function NordVPNCTA({ locale }: Props) {
  const p = getPartner('nordvpn');
  if (!p?.active) return null;
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
