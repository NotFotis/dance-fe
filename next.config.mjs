import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['localhost','https://dance-production-c62a.up.railway.app'],
    },
  };
 
export default withNextIntl(nextConfig);