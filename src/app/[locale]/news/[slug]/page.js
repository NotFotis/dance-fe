import { notFound } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import NewsDetailsClient from './NewsDetailsClient';
import AudioForm from "@/components/AudioForm";

export const dynamic = 'force-dynamic';
const STRAPI_LOCALE_MAP = {
  en: 'en',
  'el': 'el-GR',
  'el-GR': 'el-GR'
};
async function fetchNewsBySlug(slug, locale, fallbackLocale = 'en') {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const strapiLocale = STRAPI_LOCALE_MAP[locale] || locale;
  let url = `${API_URL}/dance-new?filters[slug][$eq]=${slug}&locale=${strapiLocale}&populate=Image&populate=author&populate=music_genres&populate=localizations`;
  let res = await fetch(url, { cache: 'no-store' });
  
  if (!res.ok) return null;
  const json = await res.json();
    console.log(json);

  let data = json.data?.[0];

  // Fallback to English if not found and fallback allowed
  if (!data && locale !== fallbackLocale) {
    url = `${API_URL}/dance-new?filters[slug][$eq]=${slug}&locale=${fallbackLocale}&populate=Image&populate=author&populate=music_genres`;
    res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const fallbackJson = await res.json();
    data = fallbackJson.data?.[0];
  }
  return data || null;
}

// Don't forget to await params in server components!
export default async function NewsPage({ params }) {
  const { slug, locale } = await params;  // <-- await params
  const news = await fetchNewsBySlug(slug, locale);
  if (!news) notFound();
  const localeToSlug = { [locale]: news.slug };
  if (news.localizations) {
    news.localizations.forEach(loc => {
      localeToSlug[loc.locale] = loc.slug;
    });
  }
  return (
    <div className="bg-transparent min-h-screen text-white flex flex-col items-center">
      <Navbar localeToSlug={localeToSlug} routeSegment='news'/>
      <AudioForm />
      <NewsDetailsClient news={news} />
      <Footer />
    </div>
  );
}

// For SEO
export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const news = await fetchNewsBySlug(slug, locale);
  if (!news) {
    return {
      title: 'News Not Found',
      description: 'Couldn’t find that news item.',
    };
  }
  const seo = news.seo || {};
  const title = seo.metaTitle || news.Title;
  const description = seo.metaDescription || '';
  let images;
  if (seo.shareImage?.formats?.large?.url) {
    images = [seo.shareImage.formats.large.url];
  } else if (news.Image?.[0]?.formats?.large?.url) {
    images = [news.Image[0].formats.large.url];
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/news/${slug}`,
      images: absoluteImages,
    },
  };
}
