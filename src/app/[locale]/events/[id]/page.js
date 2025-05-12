import { notFound } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import EventDetailsClient from './EventDetailsClient';
import AudioForm from "@/components/AudioForm";

// always fetch fresh data (no static caching)
export const dynamic = 'force-dynamic';

// set metadata base for OG images

async function fetchEvent(id) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(
    `${API_URL}/events/${id}?populate=seo.shareImage&populate=artists.Socials&populate=Image&populate=music_genres&populate=hosts.image`,
    { cache: 'no-store' }
  );
  if (!res.ok) return null;
  const json = await res.json();  
  console.log(json);
  
  return json.data;
}

// Next.js will call this on the server to populate <head>
export async function generateMetadata(props) {
  const params = await props.params;
  const { id, locale } = params;
  const event = await fetchEvent(id);
  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'We couldn’t find an event for that ID.',
    };
  }

  const seo = event.seo || {};
  const title = seo.metaTitle || event.Title;
  const description =
    seo.metaDescription ||
    event.description?.find(
      (block) => block.type === 'paragraph' && block.children?.[0]?.text
    )?.children[0].text ||
    '';

  // Fallback image: prefer shareImage, then event.Image[0]
  let images;
  if (seo.shareImage?.formats?.large?.url) {
    images = [seo.shareImage.formats.large.url];
  } else if (event.Image?.[0]?.formats?.large?.url) {
    images = [event.Image[0].formats.large.url];
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/events/${id}`,
      images: absoluteImages,
    },
  };
}

// The actual page render—server component
export default async function EventPage(props) {
  const params = await props.params;
  const { id } = params;
  const event = await fetchEvent(id);
  if (!event) notFound();

  return (
    <div className="bg-transparent min-h-screen text-white">
      <Navbar />
      <AudioForm />
      <EventDetailsClient event={event} />
      <Footer />
    </div>
  );
}