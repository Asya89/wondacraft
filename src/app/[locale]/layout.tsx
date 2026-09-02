import { notFound } from 'next/navigation';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { LocaleHtmlLang } from '@/components/layout/LocaleHtmlLang';
import { isLocale, locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <LocaleProvider locale={locale}>
      <LocaleHtmlLang />
      {children}
    </LocaleProvider>
  );
}
