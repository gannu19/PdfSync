/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images:{remotePatterns:[
    {protocol:'https', hostname:'covers.openlibrary.org'}
  ]}
};

module.exports = nextConfig;
