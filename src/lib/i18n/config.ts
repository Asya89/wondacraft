export const locales = ['hy', 'en', 'ru'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'hy';

export const localeLabels: Record<Locale, string> = {
  hy: 'HY',
  en: 'EN',
  ru: 'RU',
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
