import Link from 'next/link';
import type { Metadata } from 'next';
import { defaultLocale, getTranslations } from '@/lib/i18n';
import { localizedPath } from '@/lib/i18n/path';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const translations = getTranslations(defaultLocale);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-serif text-6xl text-warm-brown">404</h1>
      <p className="mt-4 text-muted">{translations.errors.notFound}</p>
      <Link href={localizedPath('/', defaultLocale)} className="mt-8 inline-block">
        <Button>{translations.common.back}</Button>
      </Link>
    </div>
  );
}
