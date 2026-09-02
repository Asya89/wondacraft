'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { defaultLocale, getTranslations } from '@/lib/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const translations = getTranslations(defaultLocale);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-warm-brown">{translations.errors.serverError}</h1>
      <p className="mt-4 text-muted">{translations.common.tryAgain}</p>
      <Button onClick={reset} className="mt-8">
        {translations.common.tryAgain}
      </Button>
    </div>
  );
}
