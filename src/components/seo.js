// components/Seo.js
import Head from 'next/head';

// Helper to get the image URL from shareImage (media), externalImageUrl (string), or fallback
function getSeoImageUrl(seo) {
  if (!seo) return null;
  if (seo.shareImage && typeof seo.shareImage === 'object' && seo.shareImage.url) {
    return seo.shareImage.url;
  }
  if (seo.externalImageUrl) return seo.externalImageUrl;
  if (typeof seo.shareImage === 'string') return seo.shareImage;
  return null;
}

export default function Seo({ seo = {}, fallbackTitle = 'Dance Today', locale = 'en' }) {
  const {
    metaTitle,
    metaDescription,
    keywords,
    canonicalURL,
    metaRobots,
    structuredData,
  } = seo || {};

  const image = getSeoImageUrl(seo);
  const title = metaTitle || fallbackTitle;
  const description = metaDescription || '';
  const canonical = canonicalURL || '';

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {metaRobots && <meta name="robots" content={metaRobots} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:locale" content={locale === 'gr' ? 'el_GR' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Head>
  );
}
