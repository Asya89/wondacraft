import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { defaultLocale, isLocale, locales } from '@/lib/i18n/config';

const SESSION_COOKIE = 'wondacraft_session';

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return new TextEncoder().encode('fallback-dev-secret-not-for-production');
  return new TextEncoder().encode(secret);
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSessionSecret());
    return true;
  } catch {
    return false;
  }
}

function pathnameHasLocale(pathname: string): boolean {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

function nextWithLocale(request: NextRequest, locale: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname !== '/admin/login') {
      const authenticated = await isAuthenticated(request);
      if (!authenticated) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      const authenticated = await isAuthenticated(request);
      if (authenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return nextWithLocale(request, defaultLocale);
  }

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/uploads') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.includes('.')
  ) {
    return nextWithLocale(request, defaultLocale);
  }

  if (!pathnameHasLocale(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const firstSegment = pathname.split('/').filter(Boolean)[0];
  const locale = isLocale(firstSegment) ? firstSegment : defaultLocale;
  return nextWithLocale(request, locale);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
