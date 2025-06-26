// app/[locale]/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import GoogleAnalyticsLoader from "@/components/GoogleAnalyticsLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Server‐side metadata generation from Strapi global collection
 */
export async function generateMetadata() {
  let siteName        = "dancetoday";
  let siteDescription = "all about dance music";
  let defaultSeo      = {};
  let favicon         = null;

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/global?populate=*`,
      { cache: "force-cache" }
    );
    console.log(res);
    
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    const data = json.data ?? null;

    if (data) {
      siteName        = data.siteName        ?? siteName;
      siteDescription = data.siteDescription ?? siteDescription;
      defaultSeo      = data.defaultSeo      ?? defaultSeo;
      favicon         = data.favicon         ?? favicon;
    }
    console.log(data);
    
  } catch (err) {
    console.warn("Could not load global metadata, using defaults:", err);
  }

  // Title & description
  const title       = defaultSeo.metaTitle       ?? siteName;
  const description = defaultSeo.metaDescription ?? siteDescription;
  const keywords = defaultSeo.keywords || '';
  const metaRobots = defaultSeo.metaRobots || '';
  // Favicon: Strapi v4 media object or direct string
  let iconUrl, iconWidth, iconHeight, iconAlt;
  if (favicon?.url) {
    iconUrl  = favicon.url.startsWith('http') ? favicon.url : `${BASE_URL}${favicon.url}`;
    iconWidth = favicon.width;
    iconHeight = favicon.height;
    iconAlt   = favicon.alternativeText || favicon.name || "icon";
  } else if (favicon?.data?.attributes?.url) {
    // Strapi v4 REST population
    iconUrl  = favicon.data.attributes.url.startsWith('http')
      ? favicon.data.attributes.url
      : `${BASE_URL}${favicon.data.attributes.url}`;
    iconWidth = favicon.data.attributes.width;
    iconHeight = favicon.data.attributes.height;
    iconAlt   = favicon.data.attributes.alternativeText || favicon.data.attributes.name || "icon";
  } else if (typeof favicon === 'string' && favicon.startsWith('http')) {
    iconUrl = favicon;
    iconAlt = "icon";
  }

  return {
    title,
    description,
    keywords,
    metaRobots,
    icons: iconUrl ? { icon: iconUrl, shortcut: iconUrl } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: iconUrl
        ? [{
            url: iconUrl,
            width:  iconWidth,
            height: iconHeight,
            alt:    iconAlt,
          }]
        : [],
      siteName,
    },
    metadataBase: new URL(BASE_URL),
  };
}


// NOTE: accept a single props object and await it before using `params`
export default async function LocaleLayout(props) {
  const params = await props.params;
  const { children } = props;
  const locale = params.locale || "en";
  const messages = (await import(`../../../locales/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <GoogleAnalyticsLoader />
      {/* You can add other providers/components here */}
    </NextIntlClientProvider>
  );
}
