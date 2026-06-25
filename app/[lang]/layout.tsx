import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LOCALES, getDictionary, isLocale, type Locale } from '@/lib/i18n';
import '../globals.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#fafaf8',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://slowmadly.com'),
  title: {
    default: 'Slowmadly: country guides for slow nomads',
    template: '%s · Slowmadly',
  },
  description: 'Long-stay country and city guides for digital nomads who travel slowly.',
  robots: { index: true, follow: true },
};

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export default async function LangLayout({ children, params }: Props) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;
  const dict = await getDictionary(locale);
  const cfToken =
    process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN ||
    'e22d5f9e3bf74faaa2399d1a7ef53ee3';
  const ahrefsKey =
    process.env.NEXT_PUBLIC_AHREFS_KEY ||
    'YowbqBmffmzExnDFmRGerw';
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-64263K0RDW';

  return (
    <html lang={locale}>
      <body className="min-h-screen antialiased">
        <Header locale={locale} dict={dict} />
        <main className="max-w-container mx-auto px-5 sm:px-8">{children}</main>
        <Footer locale={locale} dict={dict} />
        {cfToken && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cfToken })}
            strategy="afterInteractive"
          />
        )}
        {ahrefsKey && (
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key={ahrefsKey}
            strategy="afterInteractive"
          />
        )}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
