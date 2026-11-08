import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Figtree } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/Nav";
import { PwaSetup } from "@/components/PwaSetup";
import { ToastProvider } from "@/components/Toast";
import { UserProvider } from "@/components/UserProvider";
import { hasSupabase } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Zoive Movies: find your next favorite film", template: "%s · Zoive Movies" },
  description:
    "Search movies, see what's trending, watch trailers, find where to stream, and keep a watchlist with personal suggestions.",
  applicationName: "Zoive Movies",
  appleWebApp: { capable: true, title: "Zoive", statusBarStyle: "black" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#f6f6f4" },
  ],
};

// Sets light/dark before the first paint, so there's no white flash.
const themeScript = `(function(){try{var t=localStorage.getItem('zoive-theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){document.documentElement.classList.add('dark')}})()`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = await getUser();
  const sessionUser = user ? { id: user.id, email: user.email ?? null } : null;

  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://image.tmdb.org" />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-accent px-4 py-2 font-bold text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          Skip to content
        </a>
        <UserProvider user={sessionUser} authEnabled={hasSupabase}>
          <ToastProvider>
            <Header user={sessionUser} authEnabled={hasSupabase} />
            <main id="main" className="mx-auto min-h-[70dvh] max-w-7xl px-4 pb-28 sm:px-6 md:pb-16">
              {children}
            </main>
            <footer className="mx-auto max-w-7xl px-4 pb-28 text-sm text-muted sm:px-6 md:pb-10">
              <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  This product uses the TMDB API but is not endorsed or certified by{" "}
                  <a href="https://www.themoviedb.org" className="underline hover:text-text">
                    TMDB
                  </a>
                  . Streaming data by JustWatch.
                </p>
                <div className="flex gap-4">
                  <Link href="/privacy" className="hover:text-text">
                    Privacy
                  </Link>
                  <Link href="/settings" className="hover:text-text">
                    Settings
                  </Link>
                </div>
              </div>
            </footer>
            <MobileNav />
            <PwaSetup />
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}
