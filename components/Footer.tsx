import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/i18n';
import { Logo } from './Logo';
import { SISTER_JOBS, SISTER_AI, slateremoteHomeUrl, aiByJobHomeUrl } from '@/lib/sister-sites';

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function Footer({ locale, dict }: Props) {
  const year = new Date().getFullYear();
  const jobsUrl = slateremoteHomeUrl(locale);
  const aiUrl = aiByJobHomeUrl(locale);

  const sections = [
    {
      title: 'Explore',
      links: [
        { href: `/${locale}/countries`, label: dict.nav.countries },
        { href: `/${locale}/cities`, label: dict.nav.cities },
        { href: `/${locale}/regions`, label: dict.nav.regions },
        { href: `/${locale}/best`, label: 'Best for…' },
        { href: `/${locale}/themes`, label: 'By lifestyle' },
        { href: `/${locale}/seasonal`, label: 'By season' },
        { href: `/${locale}/for`, label: 'By job role' },
      ],
    },
    {
      title: 'Practical',
      links: [
        { href: `/${locale}/visas`, label: dict.nav.visas },
        { href: `/${locale}/visas/for`, label: 'Visas by nationality' },
        { href: `/${locale}/cost-of-living`, label: 'Cost of living' },
        { href: `/${locale}/coworking`, label: 'Coworking by city' },
        { href: `/${locale}/tools`, label: 'Tools we use' },
        { href: `/${locale}/glossary`, label: 'Glossary' },
        { href: `/${locale}/guides`, label: dict.nav.guides },
      ],
    },
    {
      title: 'About',
      links: [
        { href: `/${locale}/about`, label: dict.nav.about },
        { href: `/${locale}/contact`, label: dict.footer.contact },
        { href: `/${locale}/legal`, label: dict.footer.legal },
        { href: `/${locale}/disclosure`, label: dict.footer.disclosure },
        { href: `/${locale}/search`, label: 'Search' },
      ],
    },
  ];

  return (
    <footer className="mt-28 border-t border-line/70 bg-paper-gradient">
      <div className="max-w-container mx-auto px-5 sm:px-8 py-14 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-muted max-w-xs">{dict.footer.tagline}</p>
        </div>
        {sections.map((s) => (
          <div key={s.title}>
            <p className="text-xs uppercase tracking-widest text-muted">{s.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line/70 bg-accent-soft/40">
        <div className="max-w-container mx-auto px-5 sm:px-8 py-7 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent-deep font-semibold">Need a remote tech job?</p>
              <p className="mt-1 text-sm font-medium tracking-tightish">{SISTER_JOBS.tagline}</p>
            </div>
            <a
              href={jobsUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 rounded-md bg-ink text-cream px-4 py-2 text-xs font-semibold hover:bg-accent-deep transition-colors whitespace-nowrap self-start"
            >
              {SISTER_JOBS.domain} <span aria-hidden>↗</span>
            </a>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:pl-4 sm:border-l sm:border-line/70">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent-deep font-semibold">Need AI tools?</p>
              <p className="mt-1 text-sm font-medium tracking-tightish">{SISTER_AI.tagline}</p>
            </div>
            <a
              href={aiUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 rounded-md bg-ink text-cream px-4 py-2 text-xs font-semibold hover:bg-accent-deep transition-colors whitespace-nowrap self-start"
            >
              {SISTER_AI.domain} <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="max-w-container mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-muted">
          <p>
            © {year} Slowmadly. {dict.footer.rights} Part of a small network with{' '}
            <a href={jobsUrl} target="_blank" rel="noopener" className="hover:text-accent transition-colors">{SISTER_JOBS.domain}</a>
            {' '}and{' '}
            <a href={aiUrl} target="_blank" rel="noopener" className="hover:text-accent transition-colors">{SISTER_AI.domain}</a>.
          </p>
          <p className="max-w-md sm:text-right">{dict.footer.affiliateNotice}</p>
        </div>
      </div>
    </footer>
  );
}
