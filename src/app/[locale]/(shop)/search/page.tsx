import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { localizedPath } from '@/lib/i18n/path';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: false },
};

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : 'hy';
  const { q } = await searchParams;

  if (q) {
    redirect(`${localizedPath('/products', locale)}?search=${encodeURIComponent(q)}`);
  }

  redirect(localizedPath('/products', locale));
}
