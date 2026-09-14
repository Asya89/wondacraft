import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Noto_Sans_Armenian, Noto_Serif_Armenian } from 'next/font/google';
import { getTranslations } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { DEFAULT_SHARE_IMAGE } from '@/lib/seo';
import { getSiteUrl } from '@/lib/utils';
import './globals.css';

const notoSans = Noto_Sans_Armenian({
  subsets: ['armenian', 'latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const notoSerif = Noto_Serif_Armenian({
  subsets: ['armenian', 'latin'],
  variable: '--font-noto-serif',
  display: 'swap',
});

const hySeo = getTranslations('hy').seo;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: hySeo.homeTitle,
    template: '%s | WondaCraft',
  },
  description: hySeo.homeDescription,
  openGraph: {
    type: 'website',
    locale: 'hy_AM',
    siteName: 'WondaCraft',
    title: hySeo.homeTitle,
    description: hySeo.homeDescription,
    url: `${getSiteUrl()}/hy`,
    images: [{ url: DEFAULT_SHARE_IMAGE, alt: hySeo.heroImageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: hySeo.homeTitle,
    description: hySeo.homeDescription,
    images: [DEFAULT_SHARE_IMAGE],
  },
  icons: {
    icon: '/images/logo.webp',
    apple: '/images/logo.webp',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const localeHeader = headerList.get('x-locale') ?? 'hy';
  const locale = isLocale(localeHeader) ? localeHeader : 'hy';

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${notoSans.variable} ${notoSerif.variable} antialiased`}>{children}</body>
    </html>
  );
}
