import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
            gtag('config', 'G-QCMBG32WK0',{ anonymize_ip: true });
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
