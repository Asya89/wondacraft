import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { isLocale, type Locale } from '@/lib/i18n/config';

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)]">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
