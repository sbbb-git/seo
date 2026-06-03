// Curated Unsplash image IDs for top cities and countries.
// Format: each entry is a stable Unsplash photo ID with crop hints.
// Fallback for non-listed: gradient + flag.

const W_HERO = 1600;
const H_HERO = 600;

function unsplash(id: string, w = W_HERO, h = H_HERO): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

const CITY_PHOTOS: Record<string, string> = {
  lisbon: '1555881400-74d7acaacd8b',         // tram on hill
  porto: '1555881400-69a805f5dc59',
  madeira: '1564406960-0fae39e2e80f',
  funchal: '1564406960-0fae39e2e80f',
  barcelona: '1583422409516-2895a77efded',
  madrid: '1543783207-ec64e4d95325',
  valencia: '1597156591757-3a17c5c5e7e0',
  seville: '1543783207-ec64e4d95325',
  granada: '1559564320-0a8625cd5c46',
  malaga: '1597156591757-3a17c5c5e7e0',
  paris: '1502602898657-3e91760cbb34',
  lyon: '1502602898657-3e91760cbb34',
  nice: '1564507592333-c60657eea523',
  marseille: '1502602898657-3e91760cbb34',
  bordeaux: '1502602898657-3e91760cbb34',
  london: '1513635269975-59663e0ac1ad',
  edinburgh: '1559564320-0a8625cd5c46',
  manchester: '1513635269975-59663e0ac1ad',
  dublin: '1559564320-0a8625cd5c46',
  amsterdam: '1534351590666-13e3e96c5017',
  berlin: '1554072675-66db59dba46f',
  munich: '1554072675-66db59dba46f',
  hamburg: '1554072675-66db59dba46f',
  rome: '1552832230-c0197dd311b5',
  florence: '1552832230-c0197dd311b5',
  milan: '1552832230-c0197dd311b5',
  bologna: '1552832230-c0197dd311b5',
  naples: '1552832230-c0197dd311b5',
  vienna: '1554072675-66db59dba46f',
  prague: '1541849546-216549ae216d',
  budapest: '1541849546-216549ae216d',
  krakow: '1541849546-216549ae216d',
  warsaw: '1541849546-216549ae216d',
  athens: '1555993539-1732b0258235',
  thessaloniki: '1555993539-1732b0258235',
  split: '1555881400-74d7acaacd8b',
  'split-croatia': '1555881400-74d7acaacd8b',
  dubrovnik: '1555881400-74d7acaacd8b',
  hvar: '1555881400-74d7acaacd8b',
  kotor: '1555881400-74d7acaacd8b',
  belgrade: '1541849546-216549ae216d',
  tirana: '1541849546-216549ae216d',
  sarajevo: '1541849546-216549ae216d',
  sofia: '1541849546-216549ae216d',
  plovdiv: '1541849546-216549ae216d',
  bucharest: '1541849546-216549ae216d',
  riga: '1541849546-216549ae216d',
  tallinn: '1541849546-216549ae216d',
  helsinki: '1542859832-2c5e96d70ad8',
  stockholm: '1542859832-2c5e96d70ad8',
  oslo: '1542859832-2c5e96d70ad8',
  copenhagen: '1542859832-2c5e96d70ad8',
  istanbul: '1541432901042-2d8bd64b4a9b',
  antalya: '1541432901042-2d8bd64b4a9b',
  'tel-aviv': '1556704743-7eddb1f80f78',
  dubai: '1512453979798-5ea266f8880c',
  'hong-kong': '1496939376851-89342e90adcd',
  singapore: '1496939376851-89342e90adcd',
  bangkok: '1563492065599-3520f775eeed',
  'chiang-mai': '1528181304800-259b08848526',
  phuket: '1528181304800-259b08848526',
  'koh-phangan': '1528181304800-259b08848526',
  bali: '1537996194471-e657df975ab4',
  ubud: '1537996194471-e657df975ab4',
  yogyakarta: '1537996194471-e657df975ab4',
  hanoi: '1535139262971-c51845709a48',
  'ho-chi-minh': '1535139262971-c51845709a48',
  'da-nang': '1535139262971-c51845709a48',
  'hoi-an': '1535139262971-c51845709a48',
  'kuala-lumpur': '1496939376851-89342e90adcd',
  penang: '1496939376851-89342e90adcd',
  manila: '1535139262971-c51845709a48',
  cebu: '1535139262971-c51845709a48',
  tokyo: '1540959733332-eab4deabeeaf',
  osaka: '1540959733332-eab4deabeeaf',
  seoul: '1540959733332-eab4deabeeaf',
  taipei: '1496939376851-89342e90adcd',
  goa: '1528181304800-259b08848526',
  kandy: '1528181304800-259b08848526',
  tbilisi: '1565041378439-19ad5d11b9b3',
  batumi: '1565041378439-19ad5d11b9b3',
  'mexico-city': '1518105779142-d975f22f1b0a',
  'playa-del-carmen': '1518105779142-d975f22f1b0a',
  oaxaca: '1518105779142-d975f22f1b0a',
  merida: '1518105779142-d975f22f1b0a',
  'merida-yucatan': '1518105779142-d975f22f1b0a',
  tulum: '1518105779142-d975f22f1b0a',
  queretaro: '1518105779142-d975f22f1b0a',
  medellin: '1531219572328-a0171b4448a3',
  bogota: '1531219572328-a0171b4448a3',
  cartagena: '1531219572328-a0171b4448a3',
  'buenos-aires': '1551801841-ecad875c1ef0',
  'rio-de-janeiro': '1483729558449-99ef09a8c325',
  florianopolis: '1483729558449-99ef09a8c325',
  cusco: '1531219572328-a0171b4448a3',
  asuncion: '1531219572328-a0171b4448a3',
  'san-jose': '1483729558449-99ef09a8c325',
  'cape-town': '1580060839134-75a5edca2e99',
  marrakech: '1539020140153-e479b8c5b8b3',
  auckland: '1542359649-31e03cd4d909',
  'las-palmas': '1564507592333-c60657eea523',
  tenerife: '1564507592333-c60657eea523',
  sintra: '1555881400-74d7acaacd8b',
};

const COUNTRY_PHOTOS: Record<string, string> = {
  portugal: '1555881400-74d7acaacd8b',
  spain: '1543783207-ec64e4d95325',
  france: '1502602898657-3e91760cbb34',
  italy: '1552832230-c0197dd311b5',
  greece: '1555993539-1732b0258235',
  germany: '1554072675-66db59dba46f',
  netherlands: '1534351590666-13e3e96c5017',
  croatia: '1555881400-74d7acaacd8b',
  thailand: '1563492065599-3520f775eeed',
  indonesia: '1537996194471-e657df975ab4',
  vietnam: '1535139262971-c51845709a48',
  japan: '1540959733332-eab4deabeeaf',
  'south-korea': '1540959733332-eab4deabeeaf',
  taiwan: '1496939376851-89342e90adcd',
  malaysia: '1496939376851-89342e90adcd',
  philippines: '1535139262971-c51845709a48',
  mexico: '1518105779142-d975f22f1b0a',
  colombia: '1531219572328-a0171b4448a3',
  argentina: '1551801841-ecad875c1ef0',
  brazil: '1483729558449-99ef09a8c325',
  uae: '1512453979798-5ea266f8880c',
  morocco: '1539020140153-e479b8c5b8b3',
  'south-africa': '1580060839134-75a5edca2e99',
  georgia: '1565041378439-19ad5d11b9b3',
  turkey: '1541432901042-2d8bd64b4a9b',
  estonia: '1541849546-216549ae216d',
  latvia: '1541849546-216549ae216d',
  bulgaria: '1541849546-216549ae216d',
  romania: '1541849546-216549ae216d',
  poland: '1541849546-216549ae216d',
  hungary: '1541849546-216549ae216d',
  'czech-republic': '1541849546-216549ae216d',
  'new-zealand': '1542359649-31e03cd4d909',
  'hong-kong': '1496939376851-89342e90adcd',
  singapore: '1496939376851-89342e90adcd',
  iceland: '1542859832-2c5e96d70ad8',
  norway: '1542859832-2c5e96d70ad8',
  sweden: '1542859832-2c5e96d70ad8',
  denmark: '1542859832-2c5e96d70ad8',
  finland: '1542859832-2c5e96d70ad8',
  ireland: '1559564320-0a8625cd5c46',
  uk: '1513635269975-59663e0ac1ad',
  austria: '1554072675-66db59dba46f',
  serbia: '1541849546-216549ae216d',
  bosnia: '1541849546-216549ae216d',
  albania: '1555993539-1732b0258235',
  montenegro: '1555881400-74d7acaacd8b',
  cyprus: '1555993539-1732b0258235',
  malta: '1555881400-74d7acaacd8b',
  india: '1528181304800-259b08848526',
  'sri-lanka': '1528181304800-259b08848526',
  israel: '1556704743-7eddb1f80f78',
  ecuador: '1531219572328-a0171b4448a3',
  peru: '1531219572328-a0171b4448a3',
  chile: '1531219572328-a0171b4448a3',
  paraguay: '1531219572328-a0171b4448a3',
  uruguay: '1551801841-ecad875c1ef0',
  panama: '1483729558449-99ef09a8c325',
  'costa-rica': '1483729558449-99ef09a8c325',
  barbados: '1483729558449-99ef09a8c325',
  'cape-verde': '1564406960-0fae39e2e80f',
  mauritius: '1564406960-0fae39e2e80f',
  armenia: '1565041378439-19ad5d11b9b3',
};

export function cityPhoto(slug: string, w = W_HERO, h = H_HERO): string | undefined {
  const id = CITY_PHOTOS[slug];
  return id ? unsplash(id, w, h) : undefined;
}

export function countryPhoto(slug: string, w = W_HERO, h = H_HERO): string | undefined {
  const id = COUNTRY_PHOTOS[slug];
  return id ? unsplash(id, w, h) : undefined;
}

/** Country flag SVG via flagcdn. width is one of: 20, 40, 80, 160, 320, 640, 1280, 2560 */
export function flagSvg(code: string | undefined, width = 80): string | undefined {
  if (!code || code.length !== 2) return undefined;
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;
}

// Affiliate links often use a tracking host that has no favicon. Map those
// back to the brand domain so the logo proxy resolves a real icon.
const BRAND_HOST: Record<string, string> = {
  'ablink.affiliates.fiverr.com': 'fiverr.com',
  'go.fiverr.com': 'fiverr.com',
  'appsumo.8odi.net': 'appsumo.com',
  'app.usebraintrust.com': 'usebraintrust.com',
  'wise.prf.hn': 'wise.com',
  'refer-nordvpn.com': 'nordvpn.com',
  'try.elevenlabs.io': 'elevenlabs.io',
  'share.speechify.com': 'speechify.com',
  'get.murf.ai': 'murf.ai',
  't.mercor.com': 'mercor.com',
  'amzn.to': 'amazon.com',
  'referrals.uber.com': 'uber.com',
};

/** Brand favicon for a partner via DuckDuckGo icon proxy (free, no auth) */
export function partnerLogo(url: string): string {
  try {
    const raw = new URL(url).hostname.replace(/^www\./, '');
    const host = BRAND_HOST[raw] || raw;
    return `https://icons.duckduckgo.com/ip3/${host}.ico`;
  } catch {
    return '';
  }
}

/** Deterministic gradient for a slug (fallback when no photo) */
export function gradientFor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash << 5) - hash + slug.charCodeAt(i);
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 30) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 50%, 65%) 0%, hsl(${h2}, 45%, 50%) 100%)`;
}
