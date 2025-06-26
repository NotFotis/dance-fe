// app/Events/page.jsx
import AdvertiseListClient from './AdvertiseListClient';
import { notFound } from 'next/navigation';

export const revalidate = 60; // optional ISR

export async function generateMetadata() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL     = process.env.NEXT_PUBLIC_SITE_URL;

  // 1) Fetch the singleton “Advertise Page Settings”
  const res = await fetch(
    `${API_URL}/advertise-page-setting?populate=seo`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    console.warn('SEO fetch failed');
    return {
      title: 'Advertise With Us',
      description: 'Latest updates from the dance world',
      alternates: { canonical: `${URL}/advertise` },
    };
  }

  const json = await res.json();
  const attrs = json.data || {};
  const seo   = attrs.seo || {};

  // 2) Find the best image (media, string, or external)
  let image;

  if (seo.shareImage?.data?.attributes?.url) {
    image = seo.shareImage.data.attributes.url.startsWith('http')
      ? seo.shareImage.data.attributes.url
      : `${URL}${seo.shareImage.data.attributes.url}`;
  } else if (typeof seo.shareImage === 'string' && seo.shareImage.startsWith('http')) {
    image = seo.shareImage;
  } else if (seo.externalImageUrl && seo.externalImageUrl.startsWith('http')) {
    image = seo.externalImageUrl;
  }

  const title       = seo.metaTitle        || 'Advertise With Us';
  const description = seo.metaDescription  || 'Latest updates from the dance world';
  const canonical   = seo.canonicalURL     || `${URL}/advertise`;
  const keywords    = seo.keywords         || '';
  const metaRobots  = seo.metaRobots       || '';
  // 3) Return the Metadata object
  return {
    title,
    description,
        keywords,
    metaRobots,
    alternates: { canonical },
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

export default function EventsPage() {
  return <AdvertiseListClient />;
}

