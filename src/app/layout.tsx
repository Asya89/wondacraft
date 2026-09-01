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
    default: 'Wondacraft — Ձեռագործ խաղալիքներ',
    template: '%s | Wondacraft',
  },
  description:
    'Ձեռագործ խաղալիքներ և դեկորativ արտadranq սիրով պատրastված։ Wondacraft — յուրahatuk dzeragort artadranq։',
  openGraph: {
    type: 'website',
    locale: 'hy_AM',
    siteName: 'Wondacraft',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy">
      <body className={`${notoSans.variable} ${notoSerif.variable} antialiased`}>{children}</body>
    </html>
  );
}
