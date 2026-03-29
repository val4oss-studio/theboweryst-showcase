import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from '@/config/locales'

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Not processing static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If the pathname already includes a locale, continue without redirecting
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return NextResponse.next();

  // Detect browser language
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const prefersFrench = acceptLanguage.toLowerCase().includes('fr');
  const locale = prefersFrench ? 'fr' : defaultLocale;

  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
