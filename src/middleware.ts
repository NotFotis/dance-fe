import createMiddleware from 'next-intl/middleware';
import {routing} from '../i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';
 
export default createMiddleware(routing);
 
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Define your supported locales
  const locales = ['en', 'el'];
  const defaultLocale = 'en';

  // Optionally, read a cookie for a previously selected locale.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  console.log(cookieLocale);
  
  const localeToUse = cookieLocale || defaultLocale;

  // If the pathname doesn't start with a supported locale, redirect.
  if (!locales.some((locale) => pathname.startsWith(`/${locale}`))) {
    return NextResponse.redirect(
      new URL(`/${localeToUse}${pathname}`, request.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
