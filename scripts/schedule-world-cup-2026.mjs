#!/usr/bin/env node
// One-shot: 8 World Cup 2026 themed guides, scheduled June 15 -> June 22 2026.
// They layer ON TOP of the existing one-per-day queue so the daily-content cron
// drops two articles those days — riding the tournament traffic during the
// USA/Canada/Mexico group stage and into the round of 32.
import { readFileSync, writeFileSync } from 'node:fs';

const QUEUE = 'data/guides-queue.json';
const GUIDES = 'data/guides.json';

// Each entry slots into pickSponsoredCTA (app/[lang]/guides/[guide]/page.tsx):
//   infrastructure + "vpn" -> NordVPN | infrastructure -> Airalo
//   cost -> Wise (no EU keyword) | tools + "ai-tool"/"productivity" -> Claude
//   freelancing (default) -> Fiverr
const ARTICLES = [
  {
    slug: 'watching-world-cup-2026-from-anywhere-vpn-streaming-guide',
    topic: 'infrastructure',
    title: {
      en: 'Watching the World Cup 2026 From Anywhere: A VPN & Streaming Guide',
      fr: 'Regarder la Coupe du Monde 2026 depuis n’importe où : guide VPN & streaming',
      es: 'Ver el Mundial 2026 desde cualquier sitio: guía de VPN y streaming',
      pt: 'Ver o Mundial 2026 de qualquer lugar: guia de VPN e streaming',
      it: 'Vedere il Mondiale 2026 da ovunque: guida VPN e streaming',
      de: 'Die WM 2026 von überall sehen: VPN- und Streaming-Guide',
      pl: 'Oglądanie Mistrzostw Świata 2026 z dowolnego miejsca: poradnik VPN i streaming',
    },
    description: {
      en: 'Nomads chasing the World Cup 2026 across timezones — which broadcaster is best per country, how a VPN unlocks your home stream abroad, and the setup that just works.',
      fr: 'Nomades qui suivent la Coupe du Monde 2026 entre fuseaux — quel diffuseur par pays, comment un VPN débloque le stream du pays d’origine, et le setup qui marche.',
      es: 'Nómadas siguiendo el Mundial 2026 entre husos — qué emisora por país, cómo un VPN desbloquea el stream de casa y la configuración que funciona.',
      pt: 'Nómadas a seguir o Mundial 2026 entre fusos — que emissora por país, como uma VPN desbloqueia o stream de casa e a configuração que funciona.',
      it: 'Nomadi che seguono il Mondiale 2026 tra fusi — quale emittente per paese, come una VPN sblocca lo stream di casa e la configurazione che funziona.',
      de: 'Nomaden, die die WM 2026 über Zeitzonen verfolgen — welcher Sender pro Land, wie ein VPN den Heimstream im Ausland freischaltet und das Setup, das läuft.',
      pl: 'Nomadzi śledzący MŚ 2026 między strefami — który nadawca w którym kraju, jak VPN odblokowuje stream z domu i konfiguracja, która działa.',
    },
    faq: [
      { q: 'Why do I need a VPN to watch the World Cup abroad?', a: 'Streaming rights are sold per country, so the broadcaster you pay for at home blocks you the moment your IP is foreign. A VPN routes you through a server in your home country so the same login plays normally — same account, same subscription, just unblocked.' },
      { q: 'Which broadcasters carry the 2026 tournament?', a: 'It varies by country and changes per cycle, but typically the national public broadcaster shares matches with one or two paid platforms in each market. Check the home-country listings before you travel, and confirm your subscription covers live football, not just on-demand.' },
      { q: 'What VPN settings give the best stream?', a: 'Use a fast protocol like WireGuard, pick a server in your home country closest to your stream’s edge, and enable the kill switch so the stream cuts out instead of leaking your real location if the tunnel drops. Test the day before kickoff, not at 90 minutes plus injury time.' },
      { q: 'Is it legal to watch with a VPN abroad?', a: 'Using a VPN itself is legal in most countries; whether the stream’s terms allow it is a separate question. In practice, watching content you have already paid for at home from a hotel in another country sits in a quiet grey zone enforced rarely if ever.' },
    ],
  },
  {
    slug: 'esim-across-usa-canada-mexico-during-world-cup-2026',
    topic: 'infrastructure',
    title: {
      en: 'eSIM Across USA, Canada and Mexico During the World Cup 2026',
      fr: 'eSIM aux États-Unis, Canada et Mexique pendant la Coupe du Monde 2026',
      es: 'eSIM en EE.UU., Canadá y México durante el Mundial 2026',
      pt: 'eSIM nos EUA, Canadá e México durante o Mundial 2026',
      it: 'eSIM tra USA, Canada e Messico durante il Mondiale 2026',
      de: 'eSIM in USA, Kanada und Mexiko während der WM 2026',
      pl: 'eSIM w USA, Kanadzie i Meksyku podczas MŚ 2026',
    },
    description: {
      en: 'The 2026 tournament spans three countries — how a regional eSIM keeps you online across the border hops without a new SIM in every host city, plus data plan sizes for fans.',
      fr: 'Le tournoi 2026 couvre trois pays — comment une eSIM régionale garde la connexion entre frontières sans changer de SIM, et les forfaits data adaptés aux fans.',
      es: 'El torneo 2026 cubre tres países — cómo una eSIM regional te mantiene online cruzando fronteras sin cambiar de SIM, y los planes de datos para fans.',
      pt: 'O torneio 2026 abrange três países — como uma eSIM regional mantém ligação ao atravessar fronteiras sem trocar de SIM, e os planos de dados para fãs.',
      it: 'Il torneo 2026 si svolge in tre paesi — come una eSIM regionale ti tiene online tra confini senza cambiare SIM, e i piani dati pensati per i tifosi.',
      de: 'Das Turnier 2026 läuft in drei Ländern — wie eine regionale eSIM dich beim Grenzwechsel online hält, ohne neue SIM, plus passende Datenpakete für Fans.',
      pl: 'Turniej 2026 obejmuje trzy kraje — jak regionalna eSIM utrzymuje cię online przy przekraczaniu granic bez zmiany karty, plus pakiety danych dla kibiców.',
    },
    faq: [
      { q: 'Do I need separate SIMs for the US, Canada and Mexico?', a: 'Not if you use a North-America eSIM. A single regional plan covers all three hosts, so changing match cities does not mean changing SIMs, queueing in a shop, or roaming-priced minutes. You land, switch eSIM profile if needed, and keep working.' },
      { q: 'How much data should a fan plan for during the tournament?', a: 'For maps, ride apps, social posting and the odd half watched on the phone, budget 5–10 GB per week. Add more if you intend to live-stream matches outside Wi-Fi. Choose a plan you can top up rather than picking the cheapest tier and running out at half-time.' },
      { q: 'Can I hotspot to a laptop for work between matches?', a: 'Yes on most regional eSIMs — check the plan specifically allows tethering. For nomads working between matches the eSIM doubles as your office connection in stadium hotels and on the bus to the next host city.' },
      { q: 'What about the home phone number for banking codes?', a: 'Keep your home SIM or eSIM live in a second slot just for SMS-based 2FA, and run the data eSIM in the first. Most modern phones support both at once so you never lose a banking code while abroad chasing matches.' },
    ],
  },
  {
    slug: 'multi-currency-banking-for-world-cup-2026-travel',
    topic: 'cost',
    title: {
      en: 'Multi-Currency Banking for World Cup 2026 Travel: USD, CAD and MXN',
      fr: 'Banque multidevise pour la Coupe du Monde 2026 : USD, CAD et MXN',
      es: 'Banca multidivisa para el Mundial 2026: USD, CAD y MXN',
      pt: 'Banca multimoeda para o Mundial 2026: USD, CAD e MXN',
      it: 'Conti multivaluta per il Mondiale 2026: USD, CAD e MXN',
      de: 'Multiwährungs-Banking für die WM 2026: USD, CAD und MXN',
      pl: 'Bankowość wielowalutowa na MŚ 2026: USD, CAD i MXN',
    },
    description: {
      en: 'Following matches across three host countries means three currencies — how fans avoid 3% fees per swipe, hold USD, CAD and MXN side by side, and stop bleeding money at terminals.',
      fr: 'Suivre les matches dans trois pays hôtes, c’est trois devises — comment éviter les 3 % de frais par paiement, détenir USD, CAD et MXN, et arrêter de perdre aux terminaux.',
      es: 'Seguir los partidos en tres países anfitriones es tres divisas — cómo evitar 3 % de comisión por pago, tener USD, CAD y MXN a la vez y dejar de perder en terminales.',
      pt: 'Seguir os jogos em três países anfitriões são três moedas — como evitar 3 % por pagamento, ter USD, CAD e MXN lado a lado e parar de perder em terminais.',
      it: 'Seguire le partite in tre paesi ospitanti significa tre valute — come evitare il 3 % per acquisto, tenere USD, CAD e MXN insieme e smettere di perdere ai POS.',
      de: 'Spielen in drei Gastgeberländern folgen heißt drei Währungen — wie Fans 3 % pro Zahlung vermeiden, USD, CAD und MXN nebeneinander halten und nicht am Terminal verlieren.',
      pl: 'Śledzenie meczów w trzech krajach gospodarzy to trzy waluty — jak uniknąć 3 % od transakcji, trzymać USD, CAD i MXN obok siebie i nie tracić w terminalach.',
    },
    faq: [
      { q: 'Why do regular cards bleed money on a USA-Canada-Mexico trip?', a: 'Most home cards add a foreign-transaction fee on every purchase, mark up the exchange rate, and charge again at ATMs. Across a month of hotels, tickets and ride apps in three currencies that quietly costs a couple of nice dinners. A multi-currency account skips the whole stack.' },
      { q: 'How do I avoid dynamic currency conversion at terminals?', a: 'Always pay in the local currency — USD in the US, CAD in Canada, MXN in Mexico — and decline any "pay in your home currency" prompt. That prompt is dynamic currency conversion, which adds a hidden 5–10 % markup. Saying no is the single fastest way to stop losing money.' },
      { q: 'Should I hold all three currencies on one account?', a: 'Yes — a multi-currency account lets you carry USD, CAD and MXN balances simultaneously and pay from the right one automatically. You convert at the mid-market rate in advance, when the rate is good, instead of letting the card do it per swipe.' },
      { q: 'What about cash for street food and small vendors?', a: 'Pull cash once per country in a larger amount to amortise any ATM fee, and always decline the machine’s currency conversion. Keep most of your spending on a fee-free card and reserve cash for markets, taxis off-app and the smaller bars where matches are on.' },
    ],
  },
  {
    slug: 'working-remotely-around-world-cup-2026-matches',
    topic: 'tools',
    title: {
      en: 'Working Remotely Around World Cup 2026 Matches Without Burning Out',
      fr: 'Télétravailler autour des matches de la Coupe du Monde 2026 sans s’épuiser',
      es: 'Trabajar en remoto entre partidos del Mundial 2026 sin quemarse',
      pt: 'Trabalhar remoto entre jogos do Mundial 2026 sem se esgotar',
      it: 'Lavorare da remoto tra le partite del Mondiale 2026 senza esaurirsi',
      de: 'Remote arbeiten rund um WM-2026-Spiele, ohne auszubrennen',
      pl: 'Praca zdalna wokół meczów MŚ 2026 bez wypalenia',
    },
    description: {
      en: 'For a month the calendar belongs to football — a productivity workflow that protects matches, ships client work in compressed blocks, and uses AI tools to save the hours back.',
      fr: 'Un mois durant le foot tient le calendrier — un workflow qui protège les matches, livre le travail client en blocs, et utilise des outils IA pour récupérer les heures.',
      es: 'Un mes el calendario es del fútbol — un flujo que protege los partidos, entrega el trabajo en bloques y usa herramientas IA para recuperar las horas perdidas.',
      pt: 'Durante um mês o calendário pertence ao futebol — um fluxo que protege os jogos, entrega trabalho em blocos e usa ferramentas IA para recuperar horas.',
      it: 'Per un mese il calendario è del calcio — un flusso che protegge le partite, consegna lavoro in blocchi e usa strumenti IA per recuperare le ore.',
      de: 'Einen Monat lang gehört der Kalender dem Fußball — ein Workflow, der Spiele schützt, Kundenarbeit in Blöcken liefert und KI-Tools nutzt, um die Stunden zurückzuholen.',
      pl: 'Przez miesiąc kalendarz należy do piłki — workflow, który chroni mecze, dostarcza pracę klientom w blokach i używa AI, by odzyskać godziny.',
    },
    faq: [
      { q: 'How do I plan a work week around the match schedule?', a: 'Front-load deep work to the mornings of match days and treat afternoons or evenings as protected. Block kickoff times in your calendar like real meetings; clients respect what they see scheduled, and you stop feeling guilty about half-watching with a laptop open.' },
      { q: 'Which AI tools genuinely save hours during the tournament?', a: 'A capable assistant that handles first drafts of emails, summaries of meeting recordings, and rough-cut research on briefs lets you compress a full work day into a focused half day, leaving the rest for the football without dropping deliverables.' },
      { q: 'How do I handle clients across multiple timezones?', a: 'Be explicit in writing: a single line in your signature that you respond Monday–Friday in your current timezone’s mornings sets the expectation. Most clients only need predictability — not constant availability — and the tournament is a great forcing function to enforce it.' },
      { q: 'What about deep-focus time in a stadium-busy city?', a: 'Mornings before kickoff are gold. Café opens, three hours of deep work, then you are free for the afternoon match. Working in fan-zone evenings is fantasy; protect the calm hours and stop pretending you will out-grind a packed bar at full volume.' },
    ],
  },
  {
    slug: 'coworking-near-world-cup-2026-host-cities',
    topic: 'infrastructure',
    title: {
      en: 'Coworking Near World Cup 2026 Host Cities: Where Nomads Should Base',
      fr: 'Coworking près des villes hôtes de la Coupe du Monde 2026 : où baser les nomades',
      es: 'Coworking cerca de las sedes del Mundial 2026: dónde basarse como nómada',
      pt: 'Coworking perto das sedes do Mundial 2026: onde basear-se como nómada',
      it: 'Coworking vicino alle sedi del Mondiale 2026: dove basarsi da nomade',
      de: 'Coworking nahe WM-2026-Spielorten: Wo Nomaden sich einquartieren',
      pl: 'Coworking blisko miast-gospodarzy MŚ 2026: gdzie się zatrzymać jako nomada',
    },
    description: {
      en: 'Stadiums are not where you want your office — how to pick a coworking neighbourhood near each host city that keeps the commute short, the Wi-Fi fast and the budget intact.',
      fr: 'Les stades ne sont pas où installer son bureau — choisir un quartier de coworking près de chaque ville hôte avec trajet court, Wi-Fi rapide et budget intact.',
      es: 'Los estadios no son el sitio de tu oficina — cómo elegir un barrio de coworking cerca de cada sede con trayecto corto, wifi rápido y presupuesto bajo control.',
      pt: 'Os estádios não são onde quer o escritório — como escolher um bairro de coworking perto de cada sede com trajeto curto, Wi-Fi rápido e orçamento controlado.',
      it: 'Gli stadi non sono dove vuoi l’ufficio — come scegliere un quartiere coworking vicino a ogni sede con tragitto breve, Wi-Fi veloce e budget intatto.',
      de: 'Stadien sind nicht dein Büro — wie du nahe jedem Spielort ein Coworking-Viertel wählst mit kurzem Weg, schnellem WLAN und intaktem Budget.',
      pl: 'Stadiony to nie miejsce na biuro — jak wybrać dzielnicę coworkingu blisko każdej sceny z krótkim dojazdem, szybkim wifi i zachowanym budżetem.',
    },
    faq: [
      { q: 'How far from the stadium should I base?', a: 'Twenty to thirty minutes by transit is the sweet spot — close enough to reach kickoff without a panic, far enough that hotel prices and crowds drop sharply. Right next to the stadium is fun once; for a working trip it gets old by match day three.' },
      { q: 'Will coworking spaces be packed during the tournament?', a: 'Some will, especially in host-city downtowns. Book a hot desk for the days you genuinely need to ship deep work, and treat hotel lobbies and quiet cafés as overflow. A week-long pass is usually a better price than burning day rates at the busiest spots.' },
      { q: 'What about Wi-Fi during big match days?', a: 'Mobile and public Wi-Fi degrade noticeably around stadium areas before kickoff. Anchor important calls to your coworking or hotel’s wired connection, and keep a data eSIM with a solid plan as backup. The day of a final is not the day to test new tech.' },
      { q: 'Is it cheaper to base outside the host city?', a: 'Often yes — staying in a neighbouring city or quieter suburb and commuting in for matches can halve accommodation cost during the tournament. Calculate the trade against transit time and the matches you actually want to be at, not the ones you might.' },
    ],
  },
  {
    slug: 'world-cup-2026-host-city-price-jump-what-nomads-pay',
    topic: 'cost',
    title: {
      en: 'Cost-of-Living Spike in World Cup 2026 Host Cities: What Nomads Should Expect',
      fr: 'Flambée du coût de la vie dans les villes hôtes 2026 : ce qu’attendre',
      es: 'Subida del coste de vida en sedes del Mundial 2026: qué esperar como nómada',
      pt: 'Subida do custo de vida nas sedes do Mundial 2026: o que esperar',
      it: 'Aumento del costo della vita nelle sedi del Mondiale 2026: cosa aspettarsi',
      de: 'Lebenshaltungs-Spike in WM-2026-Spielorten: Was Nomaden erwartet',
      pl: 'Skok kosztów życia w miastach-gospodarzach MŚ 2026: czego się spodziewać',
    },
    description: {
      en: 'Host cities turn expensive fast during a World Cup — how much hotels, eating out and ride apps really jump, and where the price stays normal one neighbourhood over.',
      fr: 'Les villes hôtes deviennent chères vite pendant un Mondial — combien grimpent hôtels, restos et VTC, et où le prix reste normal un quartier plus loin.',
      es: 'Las sedes se encarecen rápido en un Mundial — cuánto suben hoteles, comer fuera y apps de viaje, y dónde el precio sigue normal un barrio más allá.',
      pt: 'As sedes ficam caras depressa num Mundial — quanto sobem hotéis, comer fora e apps de viagem, e onde o preço continua normal um bairro à frente.',
      it: 'Le sedi diventano care in fretta durante un Mondiale — quanto salgono hotel, ristoranti e ride app, e dove il prezzo resta normale un quartiere più in là.',
      de: 'Gastgeberstädte werden während einer WM schnell teuer — wie stark Hotels, Restaurants und Fahrdienste steigen und wo es ein Viertel weiter normal bleibt.',
      pl: 'Miasta-gospodarze szybko drożeją podczas mundialu — jak skaczą hotele, gastronomia i aplikacje przejazdowe i gdzie ceny pozostają normalne kilometr dalej.',
    },
    faq: [
      { q: 'How much do hotels really jump during the tournament?', a: 'Match-day rates in walking distance of a stadium routinely double or triple compared to the same month next year. Apartments booked months ahead hold closer to normal; same-day prices are a different planet. The earlier you commit, the less the tournament tax bites.' },
      { q: 'Is eating out also more expensive?', a: 'Restaurants near fan zones run special menus and queues; you pay for the atmosphere as much as the food. One neighbourhood removed prices stay close to normal. A short walk away usually saves you 30–50 % per meal across a trip.' },
      { q: 'What about ride-share and taxis post-match?', a: 'Surge pricing on big matches is brutal — three to five times normal in the hour after final whistle. Wait 20 minutes in a quieter bar, walk a few blocks before requesting, or pre-book a transfer. Patience is cheaper than a panicked ride home.' },
      { q: 'Where do nomads actually base to keep costs sane?', a: 'In the cheaper neighbouring city or a residential district one transit hop from the stadium, ideally with a longer-stay rental booked early. You attend the matches you want and live at non-tournament prices the rest of the time.' },
    ],
  },
  {
    slug: 'earning-in-dollars-during-world-cup-2026-season',
    topic: 'freelancing',
    title: {
      en: 'Earning in Dollars During the World Cup 2026 Season as a Freelancer',
      fr: 'Gagner en dollars pendant la saison de la Coupe du Monde 2026 en freelance',
      es: 'Ganar en dólares durante la temporada del Mundial 2026 como freelance',
      pt: 'Ganhar em dólares na temporada do Mundial 2026 como freelancer',
      it: 'Guadagnare in dollari durante la stagione del Mondiale 2026 da freelance',
      de: 'Während der WM-2026-Saison als Freelancer in Dollar verdienen',
      pl: 'Zarabianie w dolarach w sezonie MŚ 2026 jako freelancer',
    },
    description: {
      en: 'The tournament moves through North America for a month — how freelancers ride US-client demand around it, price for the noise, and keep a pipeline that survives the post-final slump.',
      fr: 'Le tournoi traverse l’Amérique du Nord un mois — comment les freelances surfent la demande client US autour, tarifent malgré le bruit, et tiennent un pipeline post-finale.',
      es: 'El torneo recorre Norteamérica un mes — cómo los freelancers aprovechan la demanda US, fijan precio pese al ruido y mantienen pipeline tras la final.',
      pt: 'O torneio atravessa a América do Norte por um mês — como os freelancers surfam a procura US, definem preço apesar do ruído e mantêm pipeline após a final.',
      it: 'Il torneo attraversa il Nord America per un mese — come i freelance cavalcano la domanda USA, prezzano nel rumore e tengono la pipeline post-finale.',
      de: 'Das Turnier zieht einen Monat durch Nordamerika — wie Freelancer die US-Nachfrage drumherum nutzen, sauber bepreisen und die Pipeline nach dem Finale halten.',
      pl: 'Turniej przemierza Amerykę Północną przez miesiąc — jak freelancerzy łapią popyt klientów z USA, wyceniają mimo szumu i utrzymują pipeline po finale.',
    },
    faq: [
      { q: 'Does freelance demand actually change during a World Cup?', a: 'Yes, in patterns. Sports-adjacent brands, media, hospitality and travel ramp content and campaigns in the lead-up; many other industries quietly slow during big match windows. The freelancer who knows which clients lean in and which step back wins both phases.' },
      { q: 'Should I raise rates for tournament-window projects?', a: 'For genuinely tournament-related work with a hard deadline tied to a match or final, yes — urgency plus a fixed date justifies a premium. For ordinary projects that happen to overlap, holding your rate and your turnaround is the steadier move.' },
      { q: 'How do I keep a US-client pipeline through July and beyond?', a: 'Pitch in May and June for projects that ship around or after the final, so August does not arrive empty. The slump after a big event is real; the freelancers who avoid it lined up the next contracts before the tournament started, not after.' },
      { q: 'Is being in a US timezone an advantage right now?', a: 'For US clients, yes — overlapping working hours during a high-activity month shortens turnaround and wins repeat work. If you can base in a Central or Eastern timezone for the tournament, even on a short stay, the conversion rate on inbound goes up noticeably.' },
    ],
  },
  {
    slug: 'ai-tools-to-follow-world-cup-2026-like-a-pro',
    topic: 'tools',
    title: {
      en: 'AI Tools to Follow World Cup 2026 Like a Pro (and Win the Office Pool)',
      fr: 'Outils IA pour suivre la Coupe du Monde 2026 comme un pro (et gagner le pool)',
      es: 'Herramientas IA para seguir el Mundial 2026 como un pro (y ganar la quiniela)',
      pt: 'Ferramentas IA para seguir o Mundial 2026 como um profissional (e ganhar o bolão)',
      it: 'Strumenti IA per seguire il Mondiale 2026 da pro (e vincere il fantamondiale)',
      de: 'KI-Tools, um die WM 2026 wie ein Profi zu verfolgen (und das Büro-Tippspiel zu gewinnen)',
      pl: 'Narzędzia AI do śledzenia MŚ 2026 jak profesjonalista (i wygrania zakładu w biurze)',
    },
    description: {
      en: 'Beyond the score: how an AI tool turns long match reports, stats dumps and group-stage chaos into a daily briefing you actually have time to read — and a pool pick that holds up.',
      fr: 'Au-delà du score : comment un outil IA transforme rapports, stats et chaos de poules en brief quotidien lisible — et un pronostic de pool qui tient debout.',
      es: 'Más allá del marcador: cómo una herramienta IA convierte informes, estadísticas y caos de grupos en un brief diario legible — y una porra que aguanta.',
      pt: 'Para além do resultado: como uma ferramenta IA transforma relatórios, estatísticas e o caos da fase de grupos num briefing diário lido — e um palpite que aguenta.',
      it: 'Oltre il risultato: come uno strumento IA trasforma report, statistiche e caos dei gironi in un briefing quotidiano leggibile — e un pronostico che regge.',
      de: 'Mehr als das Ergebnis: Wie ein KI-Tool lange Spielberichte, Statistik-Berge und Gruppen-Chaos in ein lesbares Tages-Briefing verwandelt — und einen tragfähigen Tipp.',
      pl: 'Więcej niż wynik: jak narzędzie AI zamienia długie raporty, statystyki i chaos fazy grupowej w czytalny dzienny brief — i typ, który się trzyma.',
    },
    faq: [
      { q: 'Why use AI to follow a tournament you can just watch?', a: 'You cannot watch 64 matches and still ship client work. An AI assistant compresses overnight games into a five-minute summary in the morning, flags the upsets worth catching the replay of, and saves the rest as background — coverage without the calendar destruction.' },
      { q: 'How do I use it for pool predictions?', a: 'Feed it the latest form, injuries, head-to-head and the betting markets, and ask it to reason out a probability range rather than a single pick. Use the reasoning to spot where your gut disagrees with the market — the upset picks pools are won on.' },
      { q: 'Can it really keep up with live tournament data?', a: 'With the right setup, yes — give it access to live stats sources and it reads the same numbers analysts do. Use it to digest, not to predict miracles; the wins come from speed and synthesis, not crystal balls.' },
      { q: 'What is the smartest single workflow during the group stage?', a: 'A morning briefing prompt: "summarise yesterday’s matches, flag the three storylines, and update my bracket predictions with reasoning." Five minutes a day, ten times more informed conversations at the fan zone that night.' },
    ],
  },
];

const queue = JSON.parse(readFileSync(QUEUE, 'utf8'));
const guides = JSON.parse(readFileSync(GUIDES, 'utf8'));
const existing = new Set([...queue, ...guides].map((g) => g.slug));

// World Cup 2026 group stage runs through June 27 and into the knockouts after.
// Drop one WC piece per day starting June 15 (tomorrow UTC at run time) so each
// match-day has fresh themed content layered on the regular daily article.
const start = new Date('2026-06-15T00:00:00Z');
const added = [];
let cursor = new Date(start);
for (const art of ARTICLES) {
  if (existing.has(art.slug)) {
    console.error(`SKIP (slug exists): ${art.slug}`);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    continue;
  }
  const publishOn = cursor.toISOString().slice(0, 10);
  queue.push({ ...art, publishOn });
  added.push({ slug: art.slug, publishOn, topic: art.topic });
  existing.add(art.slug);
  cursor.setUTCDate(cursor.getUTCDate() + 1);
}

writeFileSync(QUEUE, JSON.stringify(queue, null, 2) + '\n');
console.log(`Scheduled ${added.length} World Cup 2026 guides.`);
console.log(`Queue now ${queue.length} items.`);
for (const a of added) console.log(`  ${a.publishOn}  [${a.topic}]  ${a.slug}`);
