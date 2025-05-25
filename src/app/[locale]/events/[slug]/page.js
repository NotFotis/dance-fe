import { notFound } from 'next/navigation';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import EventDetailsClient from './EventDetailsClient';
import AudioForm from "@/components/AudioForm";
import CookieBanner from '@/components/CookieBanner';

export const dynamic = 'force-dynamic';
const STRAPI_LOCALE_MAP = {
  en: 'en',
  'el': 'el-GR',
  'el-GR': 'el-GR'
};
async function fetchEventBySlug(slug, locale, fallbackLocale = 'en') {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const strapiLocale = STRAPI_LOCALE_MAP[locale] || locale;
  let url = `${API_URL}/events?filters[slug][$eq]=${slug}&locale=${strapiLocale}&populate=seo.shareImage&populate=artists.Socials&populate=Image&populate=music_genres&populate=hosts.image&populate=localizations`;
  let res = await fetch(url, { cache: 'no-store' });
  console.log(res);
  
  if (!res.ok) return null;
  const json = await res.json();
  let data = json.data?.[0];

  // Fallback if not found
  if (!data && locale !== fallbackLocale) {
    url = `${API_URL}/events?filters[slug][$eq]=${slug}&locale=${strapiLocale}&populate=seo.shareImage&populate=artists.Socials&populate=Image&populate=music_genres&populate=hosts.image&populate=localizations`;
    res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const fallbackJson = await res.json();
    data = fallbackJson.data?.[0];
  }
  return data || null;
}

function buildLocaleToSlug(event, locale) {
  const localeToSlug = { [locale]: event.slug };
  if (event.localizations) {
    event.localizations.forEach(loc => {
      // If you want 'el-GR' to be 'el' in your URLs:
      localeToSlug[loc.locale.replace("el-GR", "el")] = loc.slug;
      localeToSlug[loc.locale] = loc.slug;
    });
  }
  return localeToSlug;
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const event = await fetchEventBySlug(slug, locale);
  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'We couldn’t find an event for that slug.',
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
  let images;
  if (seo.shareImage?.formats?.large?.url) {
    images = [seo.shareImage.formats.large.url];
  } else if (event.Image?.[0]?.formats?.large?.url) {
    images = [event.Image[0].formats.large.url];
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/events/${slug}`,
      images: absoluteImages,
    },
  };
}

export default async function EventPage({ params }) {
  const { slug, locale } = await params;
  const event = await fetchEventBySlug(slug, locale);
  if (!event) notFound();

  // Build a mapping: locale => slug for language switcher
  const localeToSlug = buildLocaleToSlug(event, locale);

  return (
    <div className="bg-transparent min-h-screen text-white">
      <Navbar localeToSlug={localeToSlug} routeSegment='events'/>
      <AudioForm />
      <EventDetailsClient event={event} />
      <CookieBanner />
      <Footer />
    </div>
  );
}
