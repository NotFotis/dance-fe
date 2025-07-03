import createMiddleware from 'next-intl/middleware';
import { routing } from '../i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';

const locales = ['en', 'el'];
const defaultLocale = 'en';
const UNLOCK_COOKIE = 'site_unlocked';
const UNLOCK_QUERY = 'letmein';
const COMING_SOON_PATH = '/coming-soon';

// --- This part comes first: coming soon logic ---
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Don't block static files, API, Next internals, or the coming-soon page itself
  if (
    pathname.endsWith(COMING_SOON_PATH) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/trpc') ||
    pathname.startsWith('/_vercel') ||
    pathname.match(/\.[^\/]+$/)
  ) {
    return NextResponse.next();
  }

  // UNLOCK logic: via cookie
  if (request.cookies.get(UNLOCK_COOKIE)?.value === 'true') {
    // Proceed to normal locale logic
  } else if (searchParams.has(UNLOCK_QUERY)) {
    // Set the unlock cookie and redirect to the homepage (or any page)
    const url = request.nextUrl.clone();
    url.searchParams.delete(UNLOCK_QUERY);
    url.pathname = `/${getLocale(pathname)}`;
    const res = NextResponse.redirect(url);
    res.cookies.set(UNLOCK_COOKIE, 'true', { path: '/' });
    return res;
  } else {
    // Not unlocked: redirect to the Coming Soon page
    const userLocale = getLocale(pathname) || getCookieLocale(request) || defaultLocale;
    const comingSoonUrl = new URL(request.url);
    comingSoonUrl.pathname = `/${userLocale}${COMING_SOON_PATH}`;
    return NextResponse.rewrite(comingSoonUrl);
  }

  // --- If unlocked, run next-intl's middleware ---
  return createMiddleware(routing)(request);
}

// Helper to get the locale from pathname
function getLocale(pathname) {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}`)) return locale;
  }
  return null;
}

// Helper to get the locale from cookie
function getCookieLocale(request) {
  return request.cookies.get('NEXT_LOCALE')?.value;
}

// --- Matcher: same as before ---
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
