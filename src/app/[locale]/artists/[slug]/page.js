import { notFound } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ArtistDetailsClient from './ArtistDetailsClient';
import CookieBanner from '@/components/CookieBanner';

export const dynamic = 'force-dynamic';

const STRAPI_LOCALE_MAP = {
  en: 'en',
  'el': 'el-GR',
  'el-GR': 'el-GR'
};

async function fetchArtistBySlug(slug, locale, fallbackLocale = 'en') {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const strapiLocale = STRAPI_LOCALE_MAP[locale] || locale;
  let url = `${API_URL}/artists?filters[slug][$eq]=${slug}&locale=${strapiLocale}&populate=Image&populate=music_genres`;
  console.log(url);
  
  let res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) return null;
  const json = await res.json();
  let artist = json.data?.[0];

  // Fallback to English if not found and fallback allowed
  if (!artist && locale !== fallbackLocale) {
    url = `${API_URL}/artists?filters[slug][$eq]=${slug}&locale=${fallbackLocale}&populate=Image&populate=music_genres`;
    res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const fallbackJson = await res.json();
    artist = fallbackJson.data?.[0];
  }
  return artist || null;
}

async function fetchUpcomingEventsForArtist(artistId, locale) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const strapiLocale = STRAPI_LOCALE_MAP[locale] || locale;
  const now = new Date().toISOString();
  // Assuming your event has an "artists" many-to-many field
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const url = `${API_URL}/events?populate=Image&populate=music_genres&locale=${strapiLocale}&filters[artists][id][$eq]=${artistId}&filters[Date][$gte]=${today}&sort=Date:asc`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  console.log(json);
  
  return Array.isArray(json.data) ? json.data : [];
}
export default async function ArtistPage({ params }) {
  const { slug, locale } = await params;
  const artist = await fetchArtistBySlug(slug, locale);
  console.log(artist);
  
  if (!artist) notFound();

  // Create locale-to-slug mapping for language switcher in Navbar
  const localeToSlug = { [locale]: artist.slug };
  if (artist.localizations) {
    artist.localizations.forEach(loc => {
      localeToSlug[loc.locale] = loc.slug;
    });
  }

  // Get upcoming events for this artist (filter out past events)
  const events = await fetchUpcomingEventsForArtist(artist.id, locale);

  return (
    <div className="bg-transparent min-h-screen text-white flex flex-col items-center">
      <Navbar localeToSlug={localeToSlug} routeSegment="artists" />
      <ArtistDetailsClient artist={artist} events={events} />
      <CookieBanner />
      <Footer />
    </div>
  );
}

// SEO: Optional, like your news setup
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const artist = await fetchArtistBySlug(slug, locale);
  if (!artist) {
    return {
      title: 'Artist Not Found',
      description: 'Couldn’t find that artist.',
    };
  }
  const title = artist.Name;
  const description = artist.description || '';
  let images;
  if (artist.Image?.formats?.large?.url) {
    images = [artist.Image.formats.large.url];
  } else if (artist.Image?.url) {
    images = [artist.Image.url];
  }
  const absoluteImages = images?.map((src) =>
    new URL(src, process.env.NEXT_PUBLIC_URL).toString()
  );
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/artists/${slug}`,
      images: absoluteImages,
    },
  };
}
