import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, LOCALES, type Locale } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { getAllThemes, getTheme, getThemeTitle, getCitiesForTheme } from '@/lib/data/themes';
import { CityCard } from '@/components/CityCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PartnerStack } from '@/components/PartnerStack';
import { JobsCTA } from '@/components/JobsCTA';
import { PromoBanner } from '@/components/PromoBanner';
import { SlateRemoteBanner } from '@/components/SlateRemoteBanner';

export const runtime = 'edge';

type Props = { params: { lang: Locale; theme: string } };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const theme = getTheme(params.theme);
  if (!theme) return {};
  return buildPageMetadata({
    locale: params.lang,
    title: getThemeTitle(theme, params.lang),
    description: theme.description,
    pathForLocale: (l) => `/${l}/themes/${theme.slug}`,
  });
}

export default async function ThemeDetailPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const theme = getTheme(params.theme);
  if (!theme) notFound();
  const title = getThemeTitle(theme, params.lang);
  const cities = getCitiesForTheme(theme.slug);

  return (
    <article className="py-14">
      <Breadcrumbs items={[
        { href: `/${params.lang}`, label: dict.common.home },
        { href: `/${params.lang}/themes`, label: dict.nav.themes },
        { href: `/${params.lang}/themes/${theme.slug}`, label: title },
      ]} />

      <header className="max-w-3xl mt-4">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tightish font-display">{title}</h1>
        <p className="mt-3 text-lg text-muted leading-relaxed">{theme.description}</p>
        <p className="mt-2 text-sm text-muted">{cities.length} cities match.</p>
      </header>

      <section className="mt-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => (
            <li key={c.slug}>
              <CityCard city={c} locale={params.lang} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <PromoBanner locale={params.lang} variant="setup" />
        <PromoBanner locale={params.lang} variant="esim" />
      </div>
      <SlateRemoteBanner locale={params.lang} className="mt-8" />
      <JobsCTA locale={params.lang} />
      <PartnerStack
        locale={params.lang}
        categories={['banking', 'insurance', 'esim', 'accommodation', 'fitness-credits']}
      />
    </article>
  );
}
