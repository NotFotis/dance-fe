import { notFound } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AudioForm from '@/components/AudioForm';
import GenreDetailsClient from './GenreDetailsClient';

export const dynamic = 'force-dynamic';

const STRAPI_LOCALE_MAP = {
  en: 'en',
  'el': 'el-GR',
  'el-GR': 'el-GR'
};

// Fetch the genre by slug
async function fetchGenreBySlug(slug, locale, fallbackLocale = 'en') {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const strapiLocale = STRAPI_LOCALE_MAP[locale] || locale;
  let url = `${API_URL}/Music-Genres?filters[slug][$eq]=${slug}`;
console.log(url);

  let res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  let genre = json.data?.[0];

  // Fallback to English if not found
  if (!genre && locale !== fallbackLocale) {
    url = `${API_URL}/Music-Genres?filters[slug][$eq]=${slug}`;
    res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const fallbackJson = await res.json();
    genre = fallbackJson.data?.[0];
  }
  return genre || null;
}

// Fetch all artists for this genre
async function fetchArtistsForGenre(genreId, locale) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const strapiLocale = STRAPI_LOCALE_MAP[locale] || locale;
  const url = `${API_URL}/artists?populate=Image&populate=music_genres&locale=${strapiLocale}&filters[music_genres][id][$eq]=${genreId}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

// Fetch all (upcoming) events for this genre
async function fetchEventsForGenre(genreId, locale) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const strapiLocale = STRAPI_LOCALE_MAP[locale] || locale;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const url = `${API_URL}/events?populate=Image&populate=music_genres&locale=${strapiLocale}&filters[music_genres][id][$eq]=${genreId}&filters[Date][$gte]=${today}&sort=Date:asc`;
  console.log(url);
  
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

// Fetch all news for this genre
async function fetchNewsForGenre(genreId, locale) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const strapiLocale = STRAPI_LOCALE_MAP[locale] || locale;
  const url = `${API_URL}/dance-new?populate=Image&locale=${strapiLocale}&filters[music_genres][id][$eq]=${genreId}&sort=publishedAt:desc`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

export default async function GenrePage({ params }) {
  const { slug, locale } = params;
  const genre = await fetchGenreBySlug(slug, locale);

  if (!genre) notFound();

  // For Navbar language switcher (slug per locale)
  const localeToSlug = { [locale]: genre.slug };
  if (genre.localizations) {
    genre.localizations.forEach(loc => {
      localeToSlug[loc.locale] = loc.slug;
    });
  }

  // Fetch associated data
  const artists = await fetchArtistsForGenre(genre.id, locale);
  const events = await fetchEventsForGenre(genre.id, locale);
  const news = await fetchNewsForGenre(genre.id, locale);

  return (
    <div className="bg-transparent min-h-screen text-white flex flex-col items-center">
      <Navbar localeToSlug={localeToSlug} routeSegment="genres" />
      <AudioForm/>
      <GenreDetailsClient genre={genre} artists={artists} events={events} news={news}/>
      <CookieBanner />
      <Footer />
    </div>
  );
}

// Optionally: SEO Metadata
export async function generateMetadata({ params }) {
  const { slug, locale } = params;
  const genre = await fetchGenreBySlug(slug, locale);
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  if (!genre) {
    return {
      title: 'Genre Not Found',
      description: 'Couldn’t find that genre.',
      openGraph: {
        title: 'Genre Not Found',
        description: 'Couldn’t find that genre.',
      },
      twitter: {
        title: 'Genre Not Found',
        description: 'Couldn’t find that genre.',
      },
    };
  }

  // Optional: Use genre image for OG
  let images = [];
  if (genre.Image?.formats?.large?.url) {
    images = [genre.Image.formats.large.url];
  } else if (genre.Image?.url) {
    images = [genre.Image.url];
  }
  const absoluteImages = images.map(src =>
    src.startsWith('http') ? src : new URL(src, SITE_URL).toString()
  );
  const title = genre.name || 'Music Genre';
  const description = genre.seo?.metaDescription || '';
  const canonical = genre.seo?.canonicalURL || `${SITE_URL}/${locale}/genres/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'dancetoday',
      images: absoluteImages,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: absoluteImages,
    },
  };
}
