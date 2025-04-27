import { notFound } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import NewsDetailsClient from './NewsDetailsClient';
import AudioForm from "@/components/AudioForm";

export const dynamic = 'force-dynamic';
export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL);

async function fetchNews(id) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(
    `${API_URL}/dance-new/${id}?populate=*`,
    { cache: 'no-store' }
  );
  if (!res.ok) return null;
  const { data } = await res.json();
  
  return data;
}

// Build <head> from Strapi’s SEO fields (if you have them)
export async function generateMetadata(props) {
  const params = await props.params;
  const { id, locale } = params;
  const news = await fetchNews(id);
  if (!news) {
    return {
      title: 'News Not Found',
      description: 'Couldn’t find that news item.',
    };
  }

  // If you’ve added an SEO component to your news type, populate it:
  const seo = news.seo || {};
  const title = seo.metaTitle || news.Title;
  const description =
    seo.metaDescription ||
    news.description?.find(
      (block) => block.type === 'paragraph' && block.children?.[0]?.text
    )?.children[0].text ||
    '';

  let images;
  if (seo.shareImage?.formats?.large?.url) {
    images = [seo.shareImage.formats.large.url];
  } else if (news.Image?.[0]?.formats?.large?.url) {
    images = [news.Image[0].formats.large.url];
  }

  // Convert relative URLs to absolute via metadataBase
  const absoluteImages = images?.map((src) =>
    new URL(src, process.env.NEXT_PUBLIC_URL).toString()
  );

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/news/${id}`,
      images: absoluteImages,
    },
  };
}

export default async function NewsPage(props) {
  const params = await props.params;
  const news = await fetchNews(params.id);
  if (!news) notFound();

  return (
    <div className="bg-transparent min-h-screen text-white flex flex-col items-center">
      <Navbar />
       <AudioForm />
        <NewsDetailsClient news={news} />
      <Footer />
    </div>
  );
}
