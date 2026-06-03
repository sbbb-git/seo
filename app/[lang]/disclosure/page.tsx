import type { Metadata } from 'next';
import { getDictionary, type Locale } from '@/lib/i18n';
import { buildPageMetadata, SITE_NAME } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const runtime = 'edge';
export const revalidate = 600;

type Props = { params: { lang: Locale } };

type Copy = {
  title: string;
  intro: string;
  sectionTitle: string;
  body: string;
  pricingTitle: string;
  pricing: string;
  partnersTitle: string;
  partners: string;
  contactTitle: string;
  contact: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    title: 'Affiliate disclosure',
    intro: 'How we make money on this site, and what that does or does not mean for you.',
    sectionTitle: 'Affiliate relationship',
    body: `This site uses affiliate links. When you sign up for a service via one of our links, we may receive a small commission at no extra cost to you. Affiliate links are marked with rel="sponsored". Pricing and product features are identical whether you use our link or not.`,
    pricingTitle: 'Pricing is identical for you',
    pricing: 'Affiliate links never change the price you pay. We are paid by the partner from their own marketing budget, not from your subscription.',
    partnersTitle: 'Who we partner with',
    partners: `Our active affiliate partners include Fiverr, AppSumo, Wise, Revolut, SafetyWing, Airalo, NordVPN, Beehiiv, Skool, Claude, Mercor and a small set of others listed across the site. We only feature tools we have used or actively use. We never accept paid placements for products we do not stand behind.`,
    contactTitle: 'Questions or corrections',
    contact: 'If a recommendation feels off, or you have spotted a stale fact on a guide, write to contact@slowmadly.com and we will fix it.',
  },
  fr: {
    title: 'Divulgation d’affiliation',
    intro: 'Comment ce site gagne de l’argent, et ce que ça implique vraiment pour toi.',
    sectionTitle: 'Relation d’affiliation',
    body: `Ce site utilise des liens affiliés. Quand tu t’inscris à un service via un de nos liens, nous pouvons recevoir une petite commission sans surcoût pour toi. Les liens affiliés portent l’attribut rel="sponsored". Le prix et les fonctionnalités sont identiques que tu passes par notre lien ou pas.`,
    pricingTitle: 'Le prix reste le même pour toi',
    pricing: 'Les liens affiliés ne changent jamais le prix que tu paies. Le partenaire nous rémunère sur son propre budget marketing, pas sur ton abonnement.',
    partnersTitle: 'Avec qui nous travaillons',
    partners: `Nos partenaires actifs incluent Fiverr, AppSumo, Wise, Revolut, SafetyWing, Airalo, NordVPN, Beehiiv, Skool, Claude, Mercor et quelques autres listés sur le site. On ne met en avant que des outils qu’on a utilisés ou qu’on utilise. Aucun placement payé pour un produit qu’on ne défendrait pas.`,
    contactTitle: 'Questions ou corrections',
    contact: 'Si une recommandation te semble bancale, ou si tu repères une info périmée, écris à contact@slowmadly.com, on corrige.',
  },
  es: {
    title: 'Divulgación de afiliación',
    intro: 'Cómo ganamos dinero con este sitio, y qué significa o no para ti.',
    sectionTitle: 'Relación de afiliación',
    body: `Este sitio usa enlaces de afiliado. Si te registras en un servicio a través de uno de nuestros enlaces, podemos recibir una pequeña comisión sin coste extra para ti. Los enlaces de afiliado llevan rel="sponsored". El precio y las funciones son idénticos si usas nuestro enlace o no.`,
    pricingTitle: 'El precio para ti no cambia',
    pricing: 'Los enlaces de afiliado nunca alteran el precio que pagas. El socio nos paga con su presupuesto de marketing, no con tu suscripción.',
    partnersTitle: 'Con quién trabajamos',
    partners: `Nuestros socios afiliados activos incluyen Fiverr, AppSumo, Wise, Revolut, SafetyWing, Airalo, NordVPN, Beehiiv, Skool, Claude, Mercor y algunos más listados en el sitio. Solo destacamos herramientas que hemos usado o usamos. Nunca aceptamos colocaciones pagadas de productos que no defendemos.`,
    contactTitle: 'Dudas o correcciones',
    contact: 'Si una recomendación no encaja, o ves un dato caducado en una guía, escribe a contact@slowmadly.com y lo arreglamos.',
  },
  pt: {
    title: 'Divulgação de afiliação',
    intro: 'Como ganhamos dinheiro com este site, e o que isso implica ou não para ti.',
    sectionTitle: 'Relação de afiliação',
    body: `Este site usa links de afiliado. Quando te inscreves num serviço através de um dos nossos links, podemos receber uma pequena comissão sem custo extra para ti. Os links de afiliado têm rel="sponsored". O preço e as funcionalidades são idênticos quer uses o nosso link, quer não.`,
    pricingTitle: 'O preço para ti não muda',
    pricing: 'Os links de afiliado nunca alteram o preço que pagas. O parceiro paga-nos do orçamento de marketing dele, não da tua subscrição.',
    partnersTitle: 'Com quem trabalhamos',
    partners: `Os nossos parceiros afiliados ativos incluem Fiverr, AppSumo, Wise, Revolut, SafetyWing, Airalo, NordVPN, Beehiiv, Skool, Claude, Mercor e outros listados no site. Só destacamos ferramentas que usámos ou usamos. Não aceitamos colocações pagas de produtos que não defendemos.`,
    contactTitle: 'Dúvidas ou correções',
    contact: 'Se uma recomendação te parecer estranha, ou se vires um dado desatualizado num guia, escreve para contact@slowmadly.com e corrigimos.',
  },
  it: {
    title: 'Divulgazione di affiliazione',
    intro: 'Come guadagniamo con questo sito e cosa significa o non significa per te.',
    sectionTitle: 'Rapporto di affiliazione',
    body: `Questo sito usa link affiliati. Quando ti iscrivi a un servizio tramite uno dei nostri link, possiamo ricevere una piccola commissione senza costi aggiuntivi per te. I link affiliati hanno rel="sponsored". Prezzo e funzionalità sono identici sia che tu usi il nostro link sia che non lo usi.`,
    pricingTitle: 'Per te il prezzo non cambia',
    pricing: 'I link affiliati non cambiano mai il prezzo che paghi. Il partner ci paga dal proprio budget marketing, non dal tuo abbonamento.',
    partnersTitle: 'Con chi collaboriamo',
    partners: `I nostri partner affiliati attivi includono Fiverr, AppSumo, Wise, Revolut, SafetyWing, Airalo, NordVPN, Beehiiv, Skool, Claude, Mercor e altri elencati nel sito. Mettiamo in evidenza solo strumenti che abbiamo usato o usiamo. Niente placement pagati per prodotti che non sosteniamo.`,
    contactTitle: 'Domande o correzioni',
    contact: 'Se una raccomandazione ti sembra strana, o noti un dato superato in una guida, scrivi a contact@slowmadly.com e correggiamo.',
  },
  de: {
    title: 'Affiliate-Offenlegung',
    intro: 'Wie wir mit dieser Seite Geld verdienen, und was das für dich bedeutet (oder eben nicht).',
    sectionTitle: 'Affiliate-Beziehung',
    body: `Diese Seite nutzt Affiliate-Links. Wenn du dich über einen unserer Links für einen Dienst anmeldest, erhalten wir möglicherweise eine kleine Provision, ohne dass dir Mehrkosten entstehen. Affiliate-Links sind mit rel="sponsored" markiert. Preise und Funktionen sind identisch, ob du unseren Link nutzt oder nicht.`,
    pricingTitle: 'Der Preis ändert sich für dich nicht',
    pricing: 'Affiliate-Links ändern niemals deinen Preis. Der Partner zahlt uns aus seinem eigenen Marketingbudget, nicht aus deinem Abo.',
    partnersTitle: 'Mit wem wir zusammenarbeiten',
    partners: `Unsere aktiven Affiliate-Partner sind unter anderem Fiverr, AppSumo, Wise, Revolut, SafetyWing, Airalo, NordVPN, Beehiiv, Skool, Claude, Mercor und einige weitere, die auf der Seite gelistet sind. Wir empfehlen nur Tools, die wir genutzt haben oder aktiv nutzen. Keine bezahlten Platzierungen für Produkte, hinter denen wir nicht stehen.`,
    contactTitle: 'Fragen oder Korrekturen',
    contact: 'Wenn eine Empfehlung seltsam wirkt oder du einen veralteten Fakt in einem Guide siehst, schreib an contact@slowmadly.com und wir korrigieren.',
  },
  pl: {
    title: 'Informacja o afiliacji',
    intro: 'Jak zarabiamy na tej stronie i co to dla Ciebie oznacza, a czego nie oznacza.',
    sectionTitle: 'Relacja afiliacyjna',
    body: `Ta strona używa linków afiliacyjnych. Gdy zapiszesz się na usługę przez jeden z naszych linków, możemy otrzymać niewielką prowizję bez dodatkowych kosztów dla Ciebie. Linki afiliacyjne mają rel="sponsored". Cena i funkcje są identyczne, niezależnie czy używasz naszego linku, czy nie.`,
    pricingTitle: 'Cena dla Ciebie się nie zmienia',
    pricing: 'Linki afiliacyjne nigdy nie zmieniają ceny, którą płacisz. Partner płaci nam ze swojego budżetu marketingowego, nie z Twojej subskrypcji.',
    partnersTitle: 'Z kim współpracujemy',
    partners: `Nasi aktywni partnerzy afiliacyjni to między innymi Fiverr, AppSumo, Wise, Revolut, SafetyWing, Airalo, NordVPN, Beehiiv, Skool, Claude, Mercor i kilku innych wymienionych na stronie. Pokazujemy tylko narzędzia, których używaliśmy lub używamy. Nie przyjmujemy płatnych umieszczeń produktów, za którymi nie stoimy.`,
    contactTitle: 'Pytania lub korekty',
    contact: 'Jeśli rekomendacja wydaje Ci się nietrafiona lub widzisz nieaktualny fakt w poradniku, napisz na contact@slowmadly.com i poprawimy.',
  },
};

const META: Record<Locale, { title: string; desc: string }> = {
  en: { title: 'Affiliate disclosure', desc: 'How Slowmadly makes money, what affiliate links mean for you, and which partners we work with.' },
  fr: { title: 'Divulgation d’affiliation', desc: 'Comment Slowmadly gagne de l’argent, ce que signifient les liens affiliés pour toi, et avec quels partenaires nous travaillons.' },
  es: { title: 'Divulgación de afiliación', desc: 'Cómo Slowmadly genera ingresos, qué significan los enlaces de afiliado para ti, y con qué socios trabajamos.' },
  pt: { title: 'Divulgação de afiliação', desc: 'Como a Slowmadly ganha dinheiro, o que significam os links de afiliado para ti, e com que parceiros trabalhamos.' },
  it: { title: 'Divulgazione di affiliazione', desc: 'Come Slowmadly guadagna, cosa significano i link affiliati per te, e con quali partner collaboriamo.' },
  de: { title: 'Affiliate-Offenlegung', desc: 'Wie Slowmadly Geld verdient, was Affiliate-Links für dich bedeuten, und mit welchen Partnern wir arbeiten.' },
  pl: { title: 'Informacja o afiliacji', desc: 'Jak Slowmadly zarabia, co linki afiliacyjne oznaczają dla Ciebie, i z jakimi partnerami współpracujemy.' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = META[params.lang];
  return buildPageMetadata({
    locale: params.lang,
    title: `${meta.title} ${SITE_NAME}`,
    description: meta.desc,
    pathForLocale: (l) => `/${l}/disclosure`,
  });
}

export default async function DisclosurePage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const c = COPY[params.lang];

  return (
    <div className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/disclosure`, label: c.title },
      ]} />
      <article className="max-w-prose mt-6 prose-content">
        <h1 className="text-4xl font-semibold tracking-tightish">{c.title}</h1>
        <p className="text-lg text-muted leading-relaxed">{c.intro}</p>
        <h2>{c.sectionTitle}</h2>
        <p>{c.body}</p>
        <h2>{c.pricingTitle}</h2>
        <p>{c.pricing}</p>
        <h2>{c.partnersTitle}</h2>
        <p>{c.partners}</p>
        <h2>{c.contactTitle}</h2>
        <p>{c.contact}</p>
      </article>
    </div>
  );
}
