import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Disable client-side route cache for dynamic routes so list pages
  // always re-fetch server components after create/edit/delete.
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.igdb.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
