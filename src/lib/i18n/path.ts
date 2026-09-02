import type { Locale } from './config';

export function localizedPath(path: string, locale: Locale): string {
  if (path.startsWith('/#')) {
    return `/${locale}${path.slice(1)}`;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (normalized === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}

export function stripLocaleFromPath(pathname: string, locale: Locale): string {
  const prefix = `/${locale}`;
  if (pathname === prefix) return '/';
  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length) || '/';
  }
  return pathname;
}

export function replaceLocaleInPath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${nextLocale}`;

  const [, ...rest] = segments;
  const pathWithoutLocale = rest.length > 0 ? `/${rest.join('/')}` : '/';
  return localizedPath(pathWithoutLocale, nextLocale);
}
