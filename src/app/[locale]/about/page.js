// app/Events/page.jsx
import AboutListClient from './AboutListClient';
import { notFound } from 'next/navigation';

export const revalidate = 60; // optional ISR

export async function generateMetadata() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL     = process.env.NEXT_PUBLIC_SITE_URL;

  // 1) Fetch the singleton “Events Page Settings”
  const res = await fetch(
    `${API_URL}/about-page-setting?populate=seo`,
    { cache: 'no-store' }
  );
  console.log(res);
  
  if (!res.ok) {
    console.warn('SEO fetch failed');
    // still return some defaults…
    return {
      title: 'About Us',
      description: 'Latest updates from the dance world',
      alternates: { canonical: `${URL}/about` },
    };
  }
  const json = await res.json();
  console.log(json);
  
  const attrs = json.data || {};
  const seo   = attrs.seo || {};

  // 2) Normalize fields
  const title       = seo.metaTitle        || 'About Us';
  const description = seo.metaDescription  || 'Latest updates from the dance world';
  const canonical   = seo.canonicalURL     || `${URL}/about`;
  let   image;
  if (seo.shareImage?.data?.attributes?.url) {
    image = `${seo.shareImage.data.attributes.url}`;
  }

  // 3) Return the Metadata object
  return {
    title,
    description,
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
  return <AboutListClient />;
}
