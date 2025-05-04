export default function robots() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: '/private/',
        },
      ],
      sitemap: `${siteUrl}/sitemap.xml`,
    }
  }
  