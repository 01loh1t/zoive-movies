import Link from "next/link";

/** Friendly full-width message for empty, error and setup states. */
export function Notice({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mx-auto my-12 max-w-lg rounded-xl bg-surface p-8 text-center shadow-card">
      <h2 className="text-xl font-bold">{title}</h2>
      {children && <div className="mt-2 text-muted">{children}</div>}
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-bold uppercase tracking-[0.1em] text-on-accent hover:bg-accent-hover"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function MissingTmdb() {
  return (
    <Notice title="Movie data isn't connected yet">
      Add your TMDB API Read Access Token to <code className="font-bold text-text">TMDB_READ_TOKEN</code> in{" "}
      <code className="font-bold text-text">.env.local</code> (or in Vercel → Settings → Environment Variables),
      then restart the app.
    </Notice>
  );
}

export function TmdbFailed() {
  return (
    <Notice title="We couldn't reach the movie database" action={{ href: "/", label: "Try again" }}>
      TMDB didn&apos;t answer just now. Check your connection, or your token if this keeps happening.
    </Notice>
  );
}
