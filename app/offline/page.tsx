import type { Metadata } from "next";

export const metadata: Metadata = { title: "You're offline" };

/** Shown by the service worker when there's no internet connection. */
export default function OfflinePage() {
  return (
    <div className="mx-auto my-16 max-w-md rounded-xl bg-surface p-8 text-center shadow-card">
      <p className="text-4xl" aria-hidden="true">
        📡
      </p>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight">You&apos;re offline</h1>
      <p className="mt-2 text-muted">
        Zoive needs an internet connection to load movies. Check your Wi-Fi or mobile data, then try again.
      </p>
      {/* A plain link (full reload, not client navigation) so the browser really retries the network. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-bold uppercase tracking-[0.1em] text-on-accent hover:bg-accent-hover"
      >
        Try again
      </a>
    </div>
  );
}
