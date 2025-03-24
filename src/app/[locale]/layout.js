import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "dancetoday",
  description: "Dance with us",
};

export default async function RootLayout({ children, params }) {
  // Await params before accessing its properties.
  const awaitedParams = await params;
  const locale = awaitedParams.locale || 'en';

  // Dynamically load the correct translation file
  const messages = (await import(`../../../locales/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

