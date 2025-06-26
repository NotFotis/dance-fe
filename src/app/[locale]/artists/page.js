// app/news/page.jsx
import ArtistsListClient from './ArtistsListClient';

export const revalidate = 60;

export async function generateMetadata() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL     = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(
    `${API_URL}/artist-page-setting?populate=seo`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    console.warn('SEO fetch failed');
    return {
      title: 'Dance Artists',
      description: 'Latest artists from the dance world',
      alternates: { canonical: `${URL}/artists` },
    };
  }
  const json = await res.json();
  const attrs = json.data || {};
  const seo   = attrs.seo || {};

  // 1. Get the best image from Strapi SEO (media, string, or external)
  let image;

  // Try Strapi media field (v4 population)
  if (seo.shareImage?.data?.attributes?.url) {
    image = `${URL}${seo.shareImage.data.attributes.url}`;
  } else if (typeof seo.shareImage === 'string' && seo.shareImage.startsWith('http')) {
    // Fallback if shareImage is a string URL (shouldn't usually happen, but safe)
    image = seo.shareImage;
  } else if (seo.externalImageUrl && seo.externalImageUrl.startsWith('http')) {
    // Fallback to external image url (e.g., Spotify)
    image = seo.externalImageUrl;
  }

  const title       = seo.metaTitle        || 'Dance Artists';
  const description = seo.metaDescription  || 'Latest artists from the dance world';
  const canonical   = seo.canonicalURL     || `${URL}/artists`;
  const keywords    = seo.keywords         || '';
  const metaRobots  = seo.metaRobots       || '';
  return {
    title,
    description,
    alternates: { canonical },
    keywords,
    metaRobots,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'dancetoday',
      images: image ? [image] : [],
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default function NewsPage() {
  return <ArtistsListClient />;
}
