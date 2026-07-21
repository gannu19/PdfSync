import type { NextConfig } from "next";

// Next.js configuration object. Add any project-specific build or runtime
// settings here as the app evolves.
const nextConfig: NextConfig = {
  /* config options here */
  images:{remotePatterns:[
    {protocol:'https', hostname:'covers.openlibrary.org'}
  ]}
};

export default nextConfig;
