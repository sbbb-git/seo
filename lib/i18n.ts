export const LOCALES = ['en', 'fr', 'es', 'pt', 'it', 'de', 'pl'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  de: 'Deutsch',
  pl: 'Polski',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function assertLocale(value: string): Locale {
  if (!isLocale(value)) throw new Error(`Invalid locale: ${value}`);
  return value;
}

// Dictionaries are loaded lazily and cached at module level.
const dictCache = new Map<Locale, Dictionary>();

export type Dictionary = {
  nav: {
    countries: string;
    cities: string;
    visas: string;
    guides: string;
    compare: string;
    regions: string;
    about: string;
    findMyCity: string;
    themes: string;
    byJobRole: string;
    bySeason: string;
    costOfLiving: string;
    coworking: string;
    bestFor: string;
    tools: string;
    glossary: string;
    search: string;
  };
  footer: {
    tagline: string;
    legal: string;
    contact: string;
    rights: string;
    affiliateNotice: string;
    disclosure: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    exploreCountries: string;
    exploreCities: string;
    findMyBestCity: string;
    trendingKicker: string;
    trendingTitle: string;
    topCities: string;
    seeAll: string;
    browseByCriterion: string;
    allFilters: string;
    digitalNomadVisas: string;
    longStayGuides: string;
    pitchFinderTitle: string;
    pitchFinderText: string;
    pitchFinderCta: string;
    pitchFilterTitle: string;
    pitchFilterText: string;
    pitchFilterCta: string;
    pitchJobsTitle: string;
    pitchJobsText: string;
    pitchJobsCta: string;
    countriesLabel: string;
    nomadCitiesLabel: string;
    nomadVisasLabel: string;
    longGuidesLabel: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    curatedBadge: string;
  };
  country: {
    overview: string;
    visa: string;
    costOfLiving: string;
    internet: string;
    safety: string;
    weather: string;
    keyFacts: string;
  };
  detail: {
    setupBefore: string;
    setupBeforeApply: string;
    whereNomadsStay: string;
    otherCitiesIn: string;
    citiesIn: string;
    visasFor: string;
    guidesFor: string;
    relatedCountries: string;
    relatedCities: string;
    relatedVisas: string;
    haveVisaNeedJob: string;
    takeQuiz: string;
    sponsored: string;
    shortStay: string;
    digitalNomadVisa: string;
    passiveIncomeVisa: string;
    matchYourFilters: string;
    noMatch: string;
  };
  common: {
    updated: string;
    loading: string;
    notFound: string;
    home: string;
  };
  meta: {
    forNomads2026: string;
    finderTitle: string;
    finderDesc: string;
    countriesDesc: string;
    citiesDesc: string;
    visasDesc: string;
    guidesDesc: string;
    bestTitle: string;
    bestDesc: string;
    compareTitle: string;
    compareDesc: string;
    regionsTitle: string;
    regionsDesc: string;
    glossaryTitle: string;
    glossaryDesc: string;
    themesTitle: string;
    themesDesc: string;
    coworkingTitle: string;
    coworkingDesc: string;
    costOfLivingTitle: string;
    costOfLivingDesc: string;
    forTitle: string;
    forDesc: string;
    seasonalTitle: string;
    seasonalDesc: string;
    searchTitle: string;
    searchDesc: string;
    countryTitleSuffix: string;
    countryDescTpl: string;
    cityTitleSuffix: string;
    cityDescTpl: string;
    visaTitleSuffix: string;
    visaDescTpl: string;
    visaIncomeFrom: string;
    visaIncomeNone: string;
    legalDesc: string;
    aboutDesc: string;
    contactDesc: string;
    toolsTitle: string;
    toolsDesc: string;
    visasForTitle: string;
    visasForDesc: string;
    coworkingCityTitleTpl: string;
    coworkingCityDescTpl: string;
    costCityTitleTpl: string;
    costCityDescTpl: string;
    compareTitleTpl: string;
    compareDescTpl: string;
    regionTitleTpl: string;
    roleTitleTpl: string;
    nationalityTitleTpl: string;
    nationalityDescTpl: string;
    visaTypeTitleSuffix: string;
  };
  visaType: Record<
    'digital-nomad' | 'passive-income' | 'investor' | 'freelance',
    { label: string; desc: string }
  >;
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const cached = dictCache.get(locale);
  if (cached) return cached;
  const dict = (await import(`@/locales/${locale}.json`)).default as Dictionary;
  dictCache.set(locale, dict);
  return dict;
}
