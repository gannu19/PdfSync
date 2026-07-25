const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'covers.openlibrary.org' },
      { protocol: 'https', hostname: 'image.unsplash.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }
    ]
  }
};

module.exports = nextConfig;
