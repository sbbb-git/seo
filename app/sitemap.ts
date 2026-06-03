import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n';
import { SITE_URL } from '@/lib/seo';
import { getAllCountries } from '@/lib/data/countries';
import { getAllCities } from '@/lib/data/cities';
import { getAllVisas } from '@/lib/data/visas';
import { getAllComparisons } from '@/lib/data/comparisons';
import { getAllGuides } from '@/lib/data/guides';
import { getAllRegions } from '@/lib/data/regions';
import { getAllCriteria } from '@/lib/data/criteria';
import { getAllThemes } from '@/lib/data/themes';
import { getAllNationalities } from '@/lib/data/nationalities';
import { getAllSeasons } from '@/lib/data/seasons';
import { getAllRoles } from '@/lib/data/roles';
import { getAllCoworking } from '@/lib/data/coworking';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const lang of LOCALES) {
    entries.push({ url: `${SITE_URL}/${lang}`, lastModified: now, changeFrequency: 'weekly', priority: 1 });

    // Index pages
    entries.push({ url: `${SITE_URL}/${lang}/countries`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });
    entries.push({ url: `${SITE_URL}/${lang}/cities`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });
    entries.push({ url: `${SITE_URL}/${lang}/finder`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 });
    entries.push({ url: `${SITE_URL}/${lang}/visas`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });
    entries.push({ url: `${SITE_URL}/${lang}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 });
    entries.push({ url: `${SITE_URL}/${lang}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });
    entries.push({ url: `${SITE_URL}/${lang}/regions`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
    entries.push({ url: `${SITE_URL}/${lang}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 });
    entries.push({ url: `${SITE_URL}/${lang}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 });
    entries.push({ url: `${SITE_URL}/${lang}/legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 });
    entries.push({ url: `${SITE_URL}/${lang}/disclosure`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 });

    // Country pages
    for (const c of getAllCountries()) {
      entries.push({
        url: `${SITE_URL}/${lang}/countries/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    // City pages
    for (const c of getAllCities()) {
      entries.push({
        url: `${SITE_URL}/${lang}/cities/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    // Visa pages
    for (const v of getAllVisas()) {
      entries.push({
        url: `${SITE_URL}/${lang}/visas/${v.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
    // Comparison pages
    for (const c of getAllComparisons()) {
      entries.push({
        url: `${SITE_URL}/${lang}/compare/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    // Guide pages
    for (const g of getAllGuides()) {
      entries.push({
        url: `${SITE_URL}/${lang}/guides/${g.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
    // Region pages
    for (const r of getAllRegions()) {
      entries.push({
        url: `${SITE_URL}/${lang}/regions/${r.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    // Best-by-criterion pages
    entries.push({ url: `${SITE_URL}/${lang}/best`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
    for (const c of getAllCriteria()) {
      entries.push({
        url: `${SITE_URL}/${lang}/best/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    // Cost of living pages
    entries.push({ url: `${SITE_URL}/${lang}/cost-of-living`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });
    for (const c of getAllCities()) {
      entries.push({
        url: `${SITE_URL}/${lang}/cost-of-living/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // Visa type pages
    for (const t of ['digital-nomad', 'passive-income', 'investor', 'freelance']) {
      entries.push({
        url: `${SITE_URL}/${lang}/visas/type/${t}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    // Glossary
    entries.push({ url: `${SITE_URL}/${lang}/glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 });

    // Lifestyle theme pages
    entries.push({ url: `${SITE_URL}/${lang}/themes`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
    for (const t of getAllThemes()) {
      entries.push({
        url: `${SITE_URL}/${lang}/themes/${t.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    // Nationality-specific visa pages
    entries.push({ url: `${SITE_URL}/${lang}/visas/for`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
    for (const n of getAllNationalities()) {
      entries.push({
        url: `${SITE_URL}/${lang}/visas/for/${n.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // Seasonal pages
    entries.push({ url: `${SITE_URL}/${lang}/seasonal`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
    for (const s of getAllSeasons()) {
      entries.push({
        url: `${SITE_URL}/${lang}/seasonal/${s.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // Search page
    entries.push({ url: `${SITE_URL}/${lang}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 });
    // Tools (affiliate directory) — high commercial intent
    entries.push({ url: `${SITE_URL}/${lang}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });

    // Job-role pages
    entries.push({ url: `${SITE_URL}/${lang}/for`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
    for (const r of getAllRoles()) {
      entries.push({
        url: `${SITE_URL}/${lang}/for/${r.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // Coworking by city
    entries.push({ url: `${SITE_URL}/${lang}/coworking`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
    for (const c of getAllCoworking()) {
      entries.push({
        url: `${SITE_URL}/${lang}/coworking/${c.citySlug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
