import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TMDB already serves pre-sized images, so we skip Vercel's image optimizer
    // (keeps the free plan's image quota untouched).
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
};

export default nextConfig;
