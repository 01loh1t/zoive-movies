import type { MetadataRoute } from "next";

// Tells phones and computers how to install Zoive as an app (name, icon, colors).
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Zoive Movies",
    short_name: "Zoive",
    description: "Find your next favorite movie: trending, trailers, where to stream, and your watchlist.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#121212",
    theme_color: "#121212",
    categories: ["entertainment"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Search", url: "/search", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Discover", url: "/discover", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Watchlist", url: "/watchlist", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
