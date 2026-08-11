#!/usr/bin/env node
// Adds a localized `cost` block to every locale dictionary. The
// cost-of-living pages previously hard-coded every label in English on all
// 7 locales, which made the non-EN versions near-duplicates of the EN one
// and left them at ~517 words — far too thin for the "cost of living in X"
// queries that Search Console shows are this site's strongest intent.
import { readFileSync, writeFileSync } from 'node:fs';

const BLOCK = {
  en: {
    h1Tpl: 'Cost of living in {name} 2026',
    introTpl:
      'What it actually costs to live in {name} as a remote worker in 2026 — rent, food, coworking, transport and the monthly total for a solo nomad, a couple and a family.',
    solo: 'Solo nomad', couple: 'Couple', family: 'Family of 4',
    perMonth: 'per month, all-in',
    breakdownHeading: 'Monthly cost breakdown in {name}',
    item: 'Item', average: 'Average',
    rentCenter: 'Rent (1BR, city centre)', rentOutside: 'Rent (1BR, outside centre)',
    utilities: 'Utilities (electricity, water)', internet: 'Home internet',
    mealLocal: 'Meal at a local restaurant', mealMid: 'Meal, mid-range restaurant',
    coffee: 'Coffee at a café', groceries: 'Groceries (solo, monthly)',
    coworking: 'Coworking (hot desk, monthly)', transport: 'Public transport (monthly pass)',
    tiersHeading: 'Three realistic budgets for {name}',
    tiersIntro:
      'The single monthly figure hides a lot. Here is what the same city costs at three different lifestyles.',
    leanName: 'Lean', leanDesc:
      'Shared flat or a studio outside the centre, cooking most meals, working from home and cafés, public transport only.',
    comfortName: 'Comfortable', comfortDesc:
      'Your own one-bedroom in a good neighbourhood, eating out several times a week, a coworking membership, the occasional taxi.',
    premiumName: 'Premium', premiumDesc:
      'Central apartment, restaurants most nights, a dedicated desk rather than a hot desk, gym and regular weekend trips.',
    contextHeading: 'How {name} compares',
    cheaperThan: 'Cheaper than', pricierThan: 'More expensive than',
    similarTo: 'Similar to',
    methodHeading: 'How we calculate these numbers',
    methodTpl:
      'Figures are 2026 estimates built from the {name} cost index ({index}/100), cross-referenced against Numbeo and Nomad List reporting and adjusted for what remote workers actually spend. Real prices move with neighbourhood, season and lifestyle, so treat this as a baseline to adjust rather than a quote.',
    faqHeading: 'Frequently asked questions',
    faq: [
      { q: 'How much does it cost to live in {name}?',
        a: 'A solo digital nomad should budget around ${total} per month all-in for {name} in 2026. That covers a one-bedroom flat in the centre, utilities, internet, groceries, some eating out, a coworking desk and public transport. A couple runs closer to ${couple} and a family of four around ${family}.' },
      { q: 'Is {name} expensive for digital nomads?',
        a: 'With a cost index of {index} out of 100, {name} sits {position}. The single biggest lever is rent: ${rent} per month in the centre versus ${rentOut} just outside it. Moving one neighbourhood out is usually worth more than every other saving combined.' },
      { q: 'How much is rent in {name}?',
        a: 'Expect about ${rent} a month for a one-bedroom apartment in the city centre of {name}, or roughly ${rentOut} outside the centre. Short lets aimed at nomads are typically priced above these figures, so a longer commitment is where the savings are.' },
      { q: 'Can you live in {name} on a tight budget?',
        a: 'Yes — a lean month in {name} comes in near ${lean}. That means a room in a shared flat or a studio away from the centre, cooking most meals, working from home and cafés rather than a coworking space, and sticking to public transport.' },
      { q: 'How much do you need per month to live comfortably in {name}?',
        a: 'Comfortable in {name} lands around ${total} a month: your own one-bedroom in a decent area, eating out a few times a week, a coworking membership and no real thought before booking a taxi. Push to roughly ${premium} and you are into central-apartment, restaurants-most-nights territory.' },
    ],
    posCheap: 'at the affordable end for remote workers',
    posMid: 'in the mid range for remote workers',
    posExpensive: 'at the pricier end for remote workers',
    moreHeading: 'More on {name}',
    fullGuideTpl: 'Full digital nomad guide to {name}',
  },
  fr: {
    h1Tpl: 'Coût de la vie à {name} en 2026',
    introTpl:
      'Ce que coûte réellement la vie à {name} pour un travailleur à distance en 2026 — loyer, nourriture, coworking, transport et le total mensuel pour un nomade seul, un couple et une famille.',
    solo: 'Nomade seul', couple: 'Couple', family: 'Famille de 4',
    perMonth: 'par mois, tout compris',
    breakdownHeading: 'Détail des dépenses mensuelles à {name}',
    item: 'Poste', average: 'Moyenne',
    rentCenter: 'Loyer (T2, centre-ville)', rentOutside: 'Loyer (T2, hors centre)',
    utilities: 'Charges (électricité, eau)', internet: 'Internet à domicile',
    mealLocal: 'Repas au restaurant local', mealMid: 'Repas, restaurant milieu de gamme',
    coffee: 'Café au comptoir', groceries: 'Courses (seul, par mois)',
    coworking: 'Coworking (poste flexible, mensuel)', transport: 'Transports (abonnement mensuel)',
    tiersHeading: 'Trois budgets réalistes pour {name}',
    tiersIntro:
      'Un seul chiffre mensuel cache beaucoup de choses. Voici ce que coûte la même ville selon trois modes de vie.',
    leanName: 'Serré', leanDesc:
      'Colocation ou studio hors du centre, cuisine maison la plupart du temps, travail depuis chez soi et les cafés, transports en commun uniquement.',
    comfortName: 'Confortable', comfortDesc:
      'Votre propre T2 dans un bon quartier, restaurant plusieurs fois par semaine, abonnement coworking, taxi de temps en temps.',
    premiumName: 'Premium', premiumDesc:
      'Appartement en plein centre, restaurant presque tous les soirs, bureau dédié plutôt que poste flexible, salle de sport et week-ends réguliers.',
    contextHeading: 'Comment se situe {name}',
    cheaperThan: 'Moins cher que', pricierThan: 'Plus cher que',
    similarTo: 'Comparable à',
    methodHeading: 'Comment nous calculons ces chiffres',
    methodTpl:
      'Ces montants sont des estimations 2026 construites à partir de l’indice de coût de {name} ({index}/100), recoupées avec les données Numbeo et Nomad List puis ajustées sur ce que dépensent réellement les travailleurs à distance. Les prix réels varient selon le quartier, la saison et le mode de vie : prenez ceci comme une base à ajuster, pas comme un devis.',
    faqHeading: 'Questions fréquentes',
    faq: [
      { q: 'Combien coûte la vie à {name} ?',
        a: 'Un nomade seul doit prévoir environ {total} $ par mois tout compris à {name} en 2026. Cela couvre un T2 dans le centre, les charges, internet, les courses, quelques sorties au restaurant, un poste de coworking et les transports. Comptez plutôt {couple} $ pour un couple et {family} $ pour une famille de quatre.' },
      { q: '{name} est-elle une ville chère pour les nomades ?',
        a: 'Avec un indice de coût de {index} sur 100, {name} se situe {position}. Le principal levier reste le loyer : {rent} $ par mois dans le centre contre {rentOut} $ juste à l’extérieur. Déménager d’un quartier rapporte en général plus que toutes les autres économies réunies.' },
      { q: 'Quel est le prix d’un loyer à {name} ?',
        a: 'Comptez environ {rent} $ par mois pour un T2 dans le centre de {name}, ou à peu près {rentOut} $ en dehors du centre. Les locations courtes visant les nomades se situent au-dessus de ces montants : c’est sur la durée que se font les économies.' },
      { q: 'Peut-on vivre à {name} avec un petit budget ?',
        a: 'Oui — un mois serré à {name} tourne autour de {lean} $. Cela suppose une chambre en colocation ou un studio loin du centre, la cuisine maison, le travail depuis chez soi et les cafés plutôt qu’un coworking, et uniquement les transports en commun.' },
      { q: 'Quel budget mensuel pour vivre confortablement à {name} ?',
        a: 'Le confortable à {name} se situe autour de {total} $ par mois : votre propre T2 dans un quartier correct, restaurant quelques fois par semaine, abonnement coworking et aucun calcul avant de prendre un taxi. Montez vers {premium} $ et vous passez en appartement central avec restaurant presque tous les soirs.' },
    ],
    posCheap: 'dans la fourchette abordable pour les travailleurs à distance',
    posMid: 'dans la moyenne pour les travailleurs à distance',
    posExpensive: 'dans la fourchette haute pour les travailleurs à distance',
    moreHeading: 'En savoir plus sur {name}',
    fullGuideTpl: 'Guide complet du nomade digital à {name}',
  },
  es: {
    h1Tpl: 'Coste de vida en {name} en 2026',
    introTpl:
      'Lo que cuesta realmente vivir en {name} como trabajador remoto en 2026 — alquiler, comida, coworking, transporte y el total mensual para un nómada solo, una pareja y una familia.',
    solo: 'Nómada solo', couple: 'Pareja', family: 'Familia de 4',
    perMonth: 'al mes, todo incluido',
    breakdownHeading: 'Desglose de gastos mensuales en {name}',
    item: 'Concepto', average: 'Media',
    rentCenter: 'Alquiler (1 hab., centro)', rentOutside: 'Alquiler (1 hab., fuera del centro)',
    utilities: 'Suministros (luz, agua)', internet: 'Internet en casa',
    mealLocal: 'Comida en restaurante local', mealMid: 'Comida, restaurante medio',
    coffee: 'Café en cafetería', groceries: 'Compra (solo, mensual)',
    coworking: 'Coworking (mesa flexible, mensual)', transport: 'Transporte público (abono mensual)',
    tiersHeading: 'Tres presupuestos realistas para {name}',
    tiersIntro:
      'Una sola cifra mensual esconde mucho. Esto es lo que cuesta la misma ciudad con tres estilos de vida distintos.',
    leanName: 'Ajustado', leanDesc:
      'Piso compartido o estudio fuera del centro, cocinar casi siempre, trabajar desde casa y cafeterías, solo transporte público.',
    comfortName: 'Cómodo', comfortDesc:
      'Tu propio piso de una habitación en buen barrio, salir a comer varias veces por semana, cuota de coworking y algún taxi.',
    premiumName: 'Premium', premiumDesc:
      'Piso céntrico, restaurantes casi todas las noches, mesa fija en lugar de flexible, gimnasio y escapadas de fin de semana.',
    contextHeading: 'Cómo se compara {name}',
    cheaperThan: 'Más barato que', pricierThan: 'Más caro que',
    similarTo: 'Similar a',
    methodHeading: 'Cómo calculamos estas cifras',
    methodTpl:
      'Son estimaciones de 2026 construidas a partir del índice de coste de {name} ({index}/100), contrastadas con datos de Numbeo y Nomad List y ajustadas a lo que gastan de verdad los trabajadores remotos. Los precios reales varían según barrio, temporada y estilo de vida: tómalo como una base que ajustar, no como un presupuesto cerrado.',
    faqHeading: 'Preguntas frecuentes',
    faq: [
      { q: '¿Cuánto cuesta vivir en {name}?',
        a: 'Un nómada solo debería presupuestar unos {total} $ al mes todo incluido en {name} en 2026. Cubre un piso de una habitación en el centro, suministros, internet, la compra, algunas comidas fuera, una mesa de coworking y transporte. Una pareja se acerca a {couple} $ y una familia de cuatro a {family} $.' },
      { q: '¿Es {name} una ciudad cara para nómadas digitales?',
        a: 'Con un índice de coste de {index} sobre 100, {name} se sitúa {position}. La palanca principal es el alquiler: {rent} $ al mes en el centro frente a {rentOut} $ justo fuera. Cambiar de barrio suele ahorrar más que todo lo demás junto.' },
      { q: '¿Cuánto cuesta el alquiler en {name}?',
        a: 'Cuenta con unos {rent} $ al mes por un piso de una habitación en el centro de {name}, o alrededor de {rentOut} $ fuera del centro. Los alquileres cortos orientados a nómadas están por encima de estas cifras: el ahorro está en el compromiso largo.' },
      { q: '¿Se puede vivir en {name} con poco presupuesto?',
        a: 'Sí — un mes ajustado en {name} ronda los {lean} $. Eso implica habitación en piso compartido o estudio lejos del centro, cocinar casi siempre, trabajar desde casa y cafeterías en vez de coworking, y solo transporte público.' },
      { q: '¿Cuánto se necesita al mes para vivir bien en {name}?',
        a: 'Lo cómodo en {name} está cerca de {total} $ al mes: tu propio piso de una habitación en una zona decente, salir a comer varias veces por semana, cuota de coworking y ningún cálculo antes de coger un taxi. Sube a unos {premium} $ y entras en piso céntrico con restaurante casi cada noche.' },
    ],
    posCheap: 'en la franja asequible para trabajadores remotos',
    posMid: 'en la franja media para trabajadores remotos',
    posExpensive: 'en la franja alta para trabajadores remotos',
    moreHeading: 'Más sobre {name}',
    fullGuideTpl: 'Guía completa del nómada digital en {name}',
  },
  pt: {
    h1Tpl: 'Custo de vida em {name} em 2026',
    introTpl:
      'O que custa realmente viver em {name} como trabalhador remoto em 2026 — renda, alimentação, coworking, transportes e o total mensal para um nómada sozinho, um casal e uma família.',
    solo: 'Nómada sozinho', couple: 'Casal', family: 'Família de 4',
    perMonth: 'por mês, tudo incluído',
    breakdownHeading: 'Detalhe dos custos mensais em {name}',
    item: 'Item', average: 'Média',
    rentCenter: 'Renda (T1, centro)', rentOutside: 'Renda (T1, fora do centro)',
    utilities: 'Despesas (eletricidade, água)', internet: 'Internet em casa',
    mealLocal: 'Refeição em restaurante local', mealMid: 'Refeição, restaurante médio',
    coffee: 'Café no café', groceries: 'Compras (sozinho, mensal)',
    coworking: 'Coworking (secretária flexível, mensal)', transport: 'Transportes (passe mensal)',
    tiersHeading: 'Três orçamentos realistas para {name}',
    tiersIntro:
      'Um único número mensal esconde muita coisa. Eis quanto custa a mesma cidade em três estilos de vida.',
    leanName: 'Apertado', leanDesc:
      'Quarto partilhado ou estúdio fora do centro, cozinhar quase sempre, trabalhar de casa e de cafés, apenas transportes públicos.',
    comfortName: 'Confortável', comfortDesc:
      'O seu próprio T1 num bom bairro, comer fora várias vezes por semana, mensalidade de coworking e um táxi ocasional.',
    premiumName: 'Premium', premiumDesc:
      'Apartamento central, restaurantes quase todas as noites, secretária dedicada em vez de flexível, ginásio e escapadinhas de fim de semana.',
    contextHeading: 'Como se compara {name}',
    cheaperThan: 'Mais barato do que', pricierThan: 'Mais caro do que',
    similarTo: 'Semelhante a',
    methodHeading: 'Como calculamos estes números',
    methodTpl:
      'São estimativas para 2026 construídas a partir do índice de custo de {name} ({index}/100), cruzadas com dados da Numbeo e da Nomad List e ajustadas ao que os trabalhadores remotos gastam de facto. Os preços reais variam com o bairro, a época e o estilo de vida: use isto como base a ajustar, não como orçamento fechado.',
    faqHeading: 'Perguntas frequentes',
    faq: [
      { q: 'Quanto custa viver em {name}?',
        a: 'Um nómada sozinho deve contar com cerca de {total} $ por mês, tudo incluído, em {name} em 2026. Cobre um T1 no centro, despesas, internet, compras, algumas refeições fora, uma secretária de coworking e transportes. Um casal fica perto de {couple} $ e uma família de quatro à volta de {family} $.' },
      { q: '{name} é cara para nómadas digitais?',
        a: 'Com um índice de custo de {index} em 100, {name} situa-se {position}. A maior alavanca é a renda: {rent} $ por mês no centro contra {rentOut} $ mesmo à saída. Mudar um bairro costuma valer mais do que todas as outras poupanças juntas.' },
      { q: 'Quanto custa a renda em {name}?',
        a: 'Conte com cerca de {rent} $ por mês por um T1 no centro de {name}, ou aproximadamente {rentOut} $ fora do centro. Os arrendamentos curtos dirigidos a nómadas ficam acima destes valores: a poupança está no compromisso longo.' },
      { q: 'Dá para viver em {name} com pouco orçamento?',
        a: 'Sim — um mês apertado em {name} ronda os {lean} $. Implica quarto partilhado ou estúdio longe do centro, cozinhar quase sempre, trabalhar de casa e de cafés em vez de coworking, e só transportes públicos.' },
      { q: 'Quanto é preciso por mês para viver bem em {name}?',
        a: 'O confortável em {name} anda pelos {total} $ por mês: o seu próprio T1 numa zona decente, comer fora algumas vezes por semana, mensalidade de coworking e nenhuma conta antes de chamar um táxi. Suba para cerca de {premium} $ e entra em apartamento central com restaurante quase todas as noites.' },
    ],
    posCheap: 'na faixa acessível para trabalhadores remotos',
    posMid: 'na faixa média para trabalhadores remotos',
    posExpensive: 'na faixa alta para trabalhadores remotos',
    moreHeading: 'Mais sobre {name}',
    fullGuideTpl: 'Guia completo do nómada digital em {name}',
  },
  it: {
    h1Tpl: 'Costo della vita a {name} nel 2026',
    introTpl:
      'Quanto costa davvero vivere a {name} da lavoratore da remoto nel 2026 — affitto, cibo, coworking, trasporti e il totale mensile per un nomade singolo, una coppia e una famiglia.',
    solo: 'Nomade singolo', couple: 'Coppia', family: 'Famiglia di 4',
    perMonth: 'al mese, tutto incluso',
    breakdownHeading: 'Dettaglio delle spese mensili a {name}',
    item: 'Voce', average: 'Media',
    rentCenter: 'Affitto (bilocale, centro)', rentOutside: 'Affitto (bilocale, fuori centro)',
    utilities: 'Utenze (luce, acqua)', internet: 'Internet a casa',
    mealLocal: 'Pasto in trattoria', mealMid: 'Pasto, ristorante di fascia media',
    coffee: 'Caffè al bar', groceries: 'Spesa (singolo, mensile)',
    coworking: 'Coworking (postazione flessibile, mensile)', transport: 'Trasporti (abbonamento mensile)',
    tiersHeading: 'Tre budget realistici per {name}',
    tiersIntro:
      'Un solo numero mensile nasconde molto. Ecco quanto costa la stessa città con tre stili di vita diversi.',
    leanName: 'Essenziale', leanDesc:
      'Stanza in condivisione o monolocale fuori centro, cucinare quasi sempre, lavorare da casa e dai bar, solo mezzi pubblici.',
    comfortName: 'Confortevole', comfortDesc:
      'Il tuo bilocale in un buon quartiere, mangiare fuori più volte a settimana, abbonamento coworking e qualche taxi.',
    premiumName: 'Premium', premiumDesc:
      'Appartamento in centro, ristorante quasi ogni sera, postazione fissa invece che flessibile, palestra e weekend fuori.',
    contextHeading: 'Come si colloca {name}',
    cheaperThan: 'Più economica di', pricierThan: 'Più cara di',
    similarTo: 'Simile a',
    methodHeading: 'Come calcoliamo questi numeri',
    methodTpl:
      'Sono stime 2026 costruite sull’indice di costo di {name} ({index}/100), incrociate con i dati Numbeo e Nomad List e corrette su quanto spendono davvero i lavoratori da remoto. I prezzi reali cambiano con quartiere, stagione e stile di vita: usali come base da adattare, non come preventivo.',
    faqHeading: 'Domande frequenti',
    faq: [
      { q: 'Quanto costa vivere a {name}?',
        a: 'Un nomade singolo dovrebbe mettere in conto circa {total} $ al mese tutto incluso a {name} nel 2026. Coprono un bilocale in centro, utenze, internet, spesa, qualche cena fuori, una postazione di coworking e i trasporti. Una coppia si avvicina a {couple} $ e una famiglia di quattro a {family} $.' },
      { q: '{name} è cara per i nomadi digitali?',
        a: 'Con un indice di costo di {index} su 100, {name} si colloca {position}. La leva principale è l’affitto: {rent} $ al mese in centro contro {rentOut} $ appena fuori. Spostarsi di un quartiere vale di solito più di tutti gli altri risparmi messi insieme.' },
      { q: 'Quanto costa l’affitto a {name}?',
        a: 'Considera circa {rent} $ al mese per un bilocale in centro a {name}, o all’incirca {rentOut} $ fuori centro. Gli affitti brevi pensati per i nomadi stanno sopra queste cifre: il risparmio sta nell’impegno lungo.' },
      { q: 'Si può vivere a {name} con poco?',
        a: 'Sì — un mese essenziale a {name} si aggira sui {lean} $. Significa stanza in condivisione o monolocale lontano dal centro, cucinare quasi sempre, lavorare da casa e dai bar invece che in coworking, e solo mezzi pubblici.' },
      { q: 'Quanto serve al mese per vivere bene a {name}?',
        a: 'Il confortevole a {name} sta intorno ai {total} $ al mese: il tuo bilocale in una zona decente, cene fuori un paio di volte a settimana, abbonamento coworking e nessun calcolo prima di prendere un taxi. Sali verso i {premium} $ ed entri nell’appartamento centrale con ristorante quasi ogni sera.' },
    ],
    posCheap: 'nella fascia accessibile per i lavoratori da remoto',
    posMid: 'nella fascia media per i lavoratori da remoto',
    posExpensive: 'nella fascia alta per i lavoratori da remoto',
    moreHeading: 'Altro su {name}',
    fullGuideTpl: 'Guida completa al nomade digitale a {name}',
  },
  de: {
    h1Tpl: 'Lebenshaltungskosten in {name} 2026',
    introTpl:
      'Was das Leben in {name} als Remote-Worker 2026 wirklich kostet — Miete, Essen, Coworking, Nahverkehr und die Monatssumme für Alleinreisende, Paare und Familien.',
    solo: 'Alleinreisender Nomade', couple: 'Paar', family: 'Familie mit 4',
    perMonth: 'pro Monat, alles inklusive',
    breakdownHeading: 'Monatliche Kostenaufstellung für {name}',
    item: 'Position', average: 'Durchschnitt',
    rentCenter: 'Miete (2-Zimmer, Zentrum)', rentOutside: 'Miete (2-Zimmer, außerhalb)',
    utilities: 'Nebenkosten (Strom, Wasser)', internet: 'Internet zu Hause',
    mealLocal: 'Essen im lokalen Restaurant', mealMid: 'Essen, mittlere Preisklasse',
    coffee: 'Kaffee im Café', groceries: 'Lebensmittel (allein, monatlich)',
    coworking: 'Coworking (Flex-Desk, monatlich)', transport: 'Nahverkehr (Monatskarte)',
    tiersHeading: 'Drei realistische Budgets für {name}',
    tiersIntro:
      'Eine einzelne Monatszahl verdeckt viel. So viel kostet dieselbe Stadt bei drei verschiedenen Lebensstilen.',
    leanName: 'Sparsam', leanDesc:
      'WG-Zimmer oder Studio außerhalb des Zentrums, meist selbst kochen, von zu Hause und aus Cafés arbeiten, nur Nahverkehr.',
    comfortName: 'Komfortabel', comfortDesc:
      'Eigene 2-Zimmer-Wohnung in guter Lage, mehrmals pro Woche essen gehen, Coworking-Mitgliedschaft, gelegentlich ein Taxi.',
    premiumName: 'Premium', premiumDesc:
      'Zentrale Wohnung, fast jeden Abend Restaurant, fester Schreibtisch statt Flex-Desk, Fitnessstudio und regelmäßige Wochenendtrips.',
    contextHeading: 'Wie {name} im Vergleich dasteht',
    cheaperThan: 'Günstiger als', pricierThan: 'Teurer als',
    similarTo: 'Vergleichbar mit',
    methodHeading: 'Wie wir diese Zahlen berechnen',
    methodTpl:
      'Die Angaben sind Schätzungen für 2026 auf Basis des Kostenindex von {name} ({index}/100), abgeglichen mit Daten von Numbeo und Nomad List und angepasst an das, was Remote-Worker tatsächlich ausgeben. Reale Preise schwanken je nach Viertel, Saison und Lebensstil — nimm das als Ausgangsbasis, nicht als Angebot.',
    faqHeading: 'Häufige Fragen',
    faq: [
      { q: 'Wie viel kostet das Leben in {name}?',
        a: 'Ein alleinreisender Nomade sollte 2026 rund {total} $ pro Monat für {name} einplanen, alles inklusive. Das deckt eine 2-Zimmer-Wohnung im Zentrum, Nebenkosten, Internet, Lebensmittel, gelegentliches Essengehen, einen Coworking-Platz und den Nahverkehr. Ein Paar liegt näher an {couple} $, eine vierköpfige Familie bei etwa {family} $.' },
      { q: 'Ist {name} teuer für digitale Nomaden?',
        a: 'Mit einem Kostenindex von {index} von 100 liegt {name} {position}. Der größte Hebel ist die Miete: {rent} $ pro Monat im Zentrum gegenüber {rentOut} $ direkt außerhalb. Ein Viertel weiter zu ziehen bringt meist mehr als alle anderen Einsparungen zusammen.' },
      { q: 'Wie hoch ist die Miete in {name}?',
        a: 'Rechne mit etwa {rent} $ pro Monat für eine 2-Zimmer-Wohnung im Zentrum von {name} oder rund {rentOut} $ außerhalb. Kurzzeitmieten für Nomaden liegen über diesen Werten — gespart wird über die längere Bindung.' },
      { q: 'Kann man in {name} mit kleinem Budget leben?',
        a: 'Ja — ein sparsamer Monat in {name} liegt bei etwa {lean} $. Das heißt WG-Zimmer oder Studio abseits des Zentrums, überwiegend selbst kochen, von zu Hause und aus Cafés statt im Coworking arbeiten und ausschließlich Nahverkehr.' },
      { q: 'Wie viel braucht man monatlich, um in {name} gut zu leben?',
        a: 'Komfortabel bedeutet in {name} etwa {total} $ im Monat: eigene 2-Zimmer-Wohnung in ordentlicher Lage, ein paarmal pro Woche essen gehen, Coworking-Mitgliedschaft und kein Nachdenken vor einer Taxifahrt. Bei rund {premium} $ bist du bei zentraler Wohnung und Restaurant an den meisten Abenden.' },
    ],
    posCheap: 'im günstigen Bereich für Remote-Worker',
    posMid: 'im mittleren Bereich für Remote-Worker',
    posExpensive: 'im oberen Bereich für Remote-Worker',
    moreHeading: 'Mehr zu {name}',
    fullGuideTpl: 'Kompletter Digital-Nomaden-Guide für {name}',
  },
  pl: {
    h1Tpl: 'Koszty życia w {name} w 2026',
    introTpl:
      'Ile naprawdę kosztuje życie w {name} jako pracownik zdalny w 2026 — czynsz, jedzenie, coworking, transport i miesięczna suma dla nomady solo, pary i rodziny.',
    solo: 'Nomada solo', couple: 'Para', family: 'Rodzina 4-osobowa',
    perMonth: 'miesięcznie, wszystko wliczone',
    breakdownHeading: 'Miesięczne koszty w {name} — szczegóły',
    item: 'Pozycja', average: 'Średnia',
    rentCenter: 'Czynsz (2 pokoje, centrum)', rentOutside: 'Czynsz (2 pokoje, poza centrum)',
    utilities: 'Media (prąd, woda)', internet: 'Internet domowy',
    mealLocal: 'Posiłek w lokalnej restauracji', mealMid: 'Posiłek, restauracja średniej klasy',
    coffee: 'Kawa w kawiarni', groceries: 'Zakupy spożywcze (solo, miesięcznie)',
    coworking: 'Coworking (biurko elastyczne, miesięcznie)', transport: 'Komunikacja miejska (bilet miesięczny)',
    tiersHeading: 'Trzy realistyczne budżety dla {name}',
    tiersIntro:
      'Jedna miesięczna liczba wiele ukrywa. Oto ile kosztuje to samo miasto przy trzech stylach życia.',
    leanName: 'Oszczędnie', leanDesc:
      'Pokój we współdzielonym mieszkaniu lub kawalerka poza centrum, gotowanie w domu, praca z domu i kawiarni, wyłącznie komunikacja miejska.',
    comfortName: 'Komfortowo', comfortDesc:
      'Własne dwupokojowe mieszkanie w dobrej dzielnicy, jedzenie na mieście kilka razy w tygodniu, karnet coworkingowy i okazjonalna taksówka.',
    premiumName: 'Premium', premiumDesc:
      'Mieszkanie w centrum, restauracje niemal co wieczór, własne biurko zamiast elastycznego, siłownia i regularne wypady weekendowe.',
    contextHeading: 'Jak wypada {name}',
    cheaperThan: 'Taniej niż', pricierThan: 'Drożej niż',
    similarTo: 'Podobnie jak',
    methodHeading: 'Jak liczymy te kwoty',
    methodTpl:
      'To szacunki na 2026 zbudowane na indeksie kosztów {name} ({index}/100), skonfrontowane z danymi Numbeo i Nomad List oraz skorygowane o to, ile realnie wydają pracownicy zdalni. Realne ceny zmieniają się wraz z dzielnicą, sezonem i stylem życia — potraktuj to jako punkt wyjścia, nie wycenę.',
    faqHeading: 'Najczęstsze pytania',
    faq: [
      { q: 'Ile kosztuje życie w {name}?',
        a: 'Nomada solo powinien założyć około {total} $ miesięcznie ze wszystkim w {name} w 2026. Obejmuje to dwupokojowe mieszkanie w centrum, media, internet, zakupy, trochę jedzenia na mieście, biurko coworkingowe i komunikację. Para to bliżej {couple} $, a czteroosobowa rodzina około {family} $.' },
      { q: 'Czy {name} jest drogie dla cyfrowych nomadów?',
        a: 'Przy indeksie kosztów {index} na 100 {name} plasuje się {position}. Największą dźwignią jest czynsz: {rent} $ miesięcznie w centrum wobec {rentOut} $ tuż poza nim. Przeprowadzka o jedną dzielnicę daje zwykle więcej niż wszystkie inne oszczędności razem wzięte.' },
      { q: 'Ile kosztuje wynajem w {name}?',
        a: 'Licz się z około {rent} $ miesięcznie za dwupokojowe mieszkanie w centrum {name} lub mniej więcej {rentOut} $ poza centrum. Najem krótkoterminowy kierowany do nomadów jest droższy — oszczędność leży w dłuższym zobowiązaniu.' },
      { q: 'Czy da się mieszkać w {name} przy niskim budżecie?',
        a: 'Tak — oszczędny miesiąc w {name} to około {lean} $. Oznacza to pokój we współdzielonym mieszkaniu lub kawalerkę z dala od centrum, gotowanie w domu, pracę z domu i kawiarni zamiast coworkingu oraz wyłącznie komunikację miejską.' },
      { q: 'Ile trzeba miesięcznie, by żyć wygodnie w {name}?',
        a: 'Komfortowo w {name} to około {total} $ miesięcznie: własne dwupokojowe mieszkanie w przyzwoitej okolicy, jedzenie na mieście kilka razy w tygodniu, karnet coworkingowy i zero kalkulacji przed zamówieniem taksówki. Przy około {premium} $ wchodzisz w mieszkanie w centrum i restauracje niemal co wieczór.' },
    ],
    posCheap: 'w przystępnym przedziale dla pracowników zdalnych',
    posMid: 'w średnim przedziale dla pracowników zdalnych',
    posExpensive: 'w wyższym przedziale dla pracowników zdalnych',
    moreHeading: 'Więcej o {name}',
    fullGuideTpl: 'Pełny przewodnik cyfrowego nomady po {name}',
  },
};

for (const [locale, block] of Object.entries(BLOCK)) {
  const path = `locales/${locale}.json`;
  const dict = JSON.parse(readFileSync(path, 'utf8'));
  dict.cost = block;
  writeFileSync(path, JSON.stringify(dict, null, 2) + '\n');
  console.log(`${locale}: added cost block (${block.faq.length} FAQ entries)`);
}
console.log('Done.');
