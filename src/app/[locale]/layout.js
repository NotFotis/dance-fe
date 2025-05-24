// app/[locale]/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script";

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
export async function generateMetadata({ params }) {
  let siteName         = "dancetoday";
  let siteDescription  = "all about dance music";
  let defaultSeo       = {};
  let favicon          = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/global`,
      { cache: "force-cache" }
    );
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    const data = json.data ?? null;

    if (data) {
      siteName        = data.siteName        ?? siteName;
      siteDescription = data.siteDescription ?? siteDescription;
      defaultSeo      = data.defaultSeo      ?? defaultSeo;
      favicon         = data.favicon         ?? favicon;
    }
  } catch (err) {
    // optional: log so you can debug production issues
    console.warn("Could not load global metadata, using defaults:", err);
  }

  // now safe to read defaults or fetched values
  const title       = defaultSeo.metaTitle       ?? siteName;
  const description = defaultSeo.metaDescription ?? siteDescription;
  const iconUrl     = favicon?.url
    ? `${favicon.url}`
    : undefined;

  return {
    title,
    description,
    icons: iconUrl
      ? { icon: iconUrl, shortcut: iconUrl }
      : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: iconUrl
        ? [{
            url: iconUrl,
            width:  favicon.width,
            height: favicon.height,
            alt:    favicon.alternativeText,
          }]
        : [],
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title,
    description,
  };
}

// NOTE: accept a single props object and await it before using `params`
export default async function RootLayout(props) {
  const params = await props.params;
  const { children } = props;
  const locale = params.locale || "en";
  const messages = (await import(`../../../locales/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX',{ anonymize_ip: true });
          `}
        </Script>
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
