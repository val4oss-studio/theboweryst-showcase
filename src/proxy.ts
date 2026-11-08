import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, locales } from '@/config/locales'
import { LOCALE_HEADER } from '@/config/seo'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /{defaultLocale} et /{defaultLocale}/* → / et /*
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const newPath = pathname === `/${defaultLocale}`
      ? '/'
      : pathname.slice(defaultLocale.length + 1)
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // Unknown first segment (`/xyz`): a real 404 status. `[locale]` would
  // answer it with a streamed not-found page, sent with a 200 status.
  const segment = pathname.split('/')[1]
  if (segment && segment !== 'api' && !locales.some((l) => l === segment)) {
    return NextResponse.rewrite(new URL('/_not-found', request.url))
  }

  // Locale of the page for the root layout's `<html lang>`.
  const locale = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  ) ?? defaultLocale
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LOCALE_HEADER, locale)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
