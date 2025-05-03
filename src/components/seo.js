// components/Seo.js
import Head from 'next/head';

export default function Seo({ title, description, image, canonical }) {
  // We no longer call useRouter here.
  // We expect the page to always pass a full canonical URL.

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={canonical} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Canonical */}
      <link rel="canonical" href={canonical} />
    </Head>
  );
}
