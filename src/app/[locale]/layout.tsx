import { notFound } from 'next/navigation';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { getTranslations, isLocale, locales } from '@/lib/i18n';

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
    <LocaleProvider locale={locale} translations={getTranslations(locale)}>
      {children}
    </LocaleProvider>
  );
}
