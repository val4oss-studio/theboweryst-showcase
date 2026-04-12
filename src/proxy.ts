import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale } from '@/config/locales'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /{defaultLocale} et /{defaultLocale}/* → / et /*
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const newPath = pathname === `/${defaultLocale}`
      ? '/'
      : pathname.slice(defaultLocale.length + 1)
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
