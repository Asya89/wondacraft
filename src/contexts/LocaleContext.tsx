'use client';

import { createContext, useContext } from 'react';
import { getTranslations, type Locale, type TranslationKey } from '@/lib/i18n';

const LocaleContext = createContext<Locale>('hy');

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useTranslations(): TranslationKey {
  return getTranslations(useLocale());
}
