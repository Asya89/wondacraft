import type { Metadata } from 'next';
import { Noto_Sans_Armenian, Noto_Serif_Armenian } from 'next/font/google';
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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'WondaCraft — Ձեռagort khaghalikner',
    template: '%s | WondaCraft',
  },
  description:
    'Ձեռagort khaghalikner, amigurumi ayiukner, zajikner ev patayi jamatsuytsner. WondaCraft — yurahatuk dzergagort artadranq.',
  openGraph: {
    type: 'website',
    locale: 'hy_AM',
    siteName: 'WondaCraft',
  },
  icons: {
    icon: '/images/logo.webp',
    apple: '/images/logo.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy">
      <body className={`${notoSans.variable} ${notoSerif.variable} antialiased`}>{children}</body>
    </html>
  );
}
