'use client';

import { createContext, useContext } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { TranslationKey } from '@/lib/i18n/types';

const LocaleContext = createContext<Locale>('hy');
const TranslationsContext = createContext<TranslationKey | null>(null);

export function LocaleProvider({
  locale,
  translations,
  children,
}: {
  locale: Locale;
  translations: TranslationKey;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>
      <TranslationsContext.Provider value={translations}>{children}</TranslationsContext.Provider>
    </LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useTranslations(): TranslationKey {
  const translations = useContext(TranslationsContext);
  if (!translations) {
    throw new Error('useTranslations must be used within LocaleProvider');
  }
  return translations;
}
