import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Zoive Movies stores, which services it uses, and how to delete your data.",
};

const UPDATED = "8 November 2026";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-8">
      <h2 id={id} className="text-xl font-bold">
        {title}
      </h2>
      <div className="mt-2 space-y-3 leading-relaxed text-muted [&_strong]:text-text">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl pt-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated {UPDATED}</p>

      <p className="mt-6 leading-relaxed">
        Zoive Movies is a free, non-commercial app for finding movies. We collect as little as possible: no ads, no
        tracking, no selling of data.
      </p>

      <Section id="p-collect" title="What we store">
        <p>
          <strong>If you create an account:</strong> your email address (used only to send you sign-in links), plus
          the movies you add to your watchlist, the star ratings you give, and your last 10 searches. If Google
          sign-in is offered and you use it, we also receive the name and profile picture on your Google account.
        </p>
        <p>
          <strong>On your device only:</strong> your theme choice and recent searches (when signed out) are kept in
          your browser&apos;s storage, and your streaming country in a cookie. These never leave your device except
          the country, which is sent to our server to show the right streaming services.
        </p>
        <p>
          We use one essential cookie to keep you signed in. We don&apos;t use analytics, advertising or tracking
          cookies.
        </p>
      </Section>

      <Section id="p-services" title="Services Zoive uses">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Supabase:</strong> sign-in and the database for your account data.
          </li>
          <li>
            <strong>Vercel:</strong> hosts the website (keeps standard, short-lived server logs such as IP address
            and pages requested).
          </li>
          <li>
            <strong>TMDB (The Movie Database):</strong> movie information. Posters and photos load directly from
            TMDB&apos;s image servers. Streaming availability comes from JustWatch through TMDB.
          </li>
          <li>
            <strong>YouTube:</strong> trailers play from youtube-nocookie.com, and only after you press &ldquo;Play
            trailer&rdquo;.
          </li>
        </ul>
        <p>Each service handles data under its own privacy policy.</p>
      </Section>

      <Section id="p-use" title="How we use it">
        <p>
          Only to run the app: signing you in, showing your watchlist and ratings, and suggesting movies based on what
          you liked. We never sell or share your data with advertisers.
        </p>
      </Section>

      <Section id="p-control" title="Your choices and deleting your data">
        <ul className="list-disc space-y-2 pl-5">
          <li>Remove any movie from your watchlist or clear a rating at any time.</li>
          <li>
            Clear your search history in <Link href="/settings" className="font-bold text-text underline">Settings</Link>.
          </li>
          <li>
            Delete your whole account in{" "}
            <Link href="/settings" className="font-bold text-text underline">
              Settings → Delete my account
            </Link>
            . This permanently removes your email address, watchlist, ratings and search history straight away.
          </li>
        </ul>
      </Section>

      <Section id="p-kids" title="Children">
        <p>Zoive isn&apos;t aimed at children under 13, and we don&apos;t knowingly collect their data.</p>
      </Section>

      <Section id="p-contact" title="Questions and changes">
        <p>
          Questions or requests? Open an issue on{" "}
          <a
            href="https://github.com/01loh1t/zoive-movies/issues"
            className="font-bold text-text underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zoive&apos;s GitHub page<span className="sr-only"> (opens in a new tab)</span>
          </a>
          . If this policy changes, we&apos;ll update the date at the top.
        </p>
      </Section>
    </article>
  );
}
