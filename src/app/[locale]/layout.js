// app/[locale]/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";

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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/global?populate=*`,
    { cache: "force-cache" }
  );
  const { data } = await res.json();
  const { siteName, siteDescription, defaultSeo, favicon } = data;

  const title = defaultSeo?.metaTitle || siteName;
  const description = defaultSeo?.metaDescription || siteDescription;
  const iconUrl = favicon
    ? `${process.env.NEXT_PUBLIC_URL}${favicon.url}`
    : undefined;

  return {
    title,
    description,
    icons: iconUrl
      ? {
          icon: iconUrl,
          shortcut: iconUrl,
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: iconUrl
        ? [
            {
              url: iconUrl,
              width: favicon.width,
              height: favicon.height,
              alt: favicon.alternativeText,
            },
          ]
        : [],
    },
  };
}

// NOTE: accept a single props object and await it before using `params`
export default async function RootLayout({ children, params }) {
  // now safe to read params.locale immediately
  const locale = params.locale || "en";
  const messages = (await import(`../../../locales/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
