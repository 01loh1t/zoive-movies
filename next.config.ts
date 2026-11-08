import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TMDB already serves pre-sized images, so we skip Vercel's image optimizer
    // (keeps the free plan's image quota untouched).
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
  // Always fetch the newest service worker, so app updates reach installed users.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;
