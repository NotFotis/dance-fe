"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalyticsLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Listen for cookie consent
    if (localStorage.getItem("cookieAccepted") === "yes") {
      setEnabled(true);
    }
    // Optional: Listen for changes if you want to enable dynamically after user accepts
    const onStorage = (e) => {
      if (e.key === "cookieAccepted" && e.newValue === "yes") {
        setEnabled(true);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
