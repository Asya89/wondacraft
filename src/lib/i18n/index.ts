import { defaultLocale, type Locale } from './config';
import { en } from './locales/en';
import { hy } from './locales/hy';
import { ru } from './locales/ru';
import type { TranslationKey } from './types';

const translations: Record<Locale, TranslationKey> = {
  hy: hy as TranslationKey,
  en: en as TranslationKey,
  ru: ru as TranslationKey,
};

export function getTranslations(locale: Locale): TranslationKey {
  return translations[locale] ?? translations[defaultLocale];
}

/** @deprecated Prefer getTranslations(locale) in server components or useTranslations() in client components */
export function t(locale: Locale = defaultLocale): TranslationKey {
  return getTranslations(locale);
}

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

export * from './config';
export * from './path';
export type { TranslationKey } from './types';
