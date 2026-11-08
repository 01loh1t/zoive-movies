"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto my-12 max-w-lg rounded-xl bg-surface p-8 text-center shadow-card">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-muted">That&apos;s on us. Try again, and if it keeps happening, reload the page.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 h-11 rounded-full bg-accent px-6 text-sm font-bold uppercase tracking-[0.1em] text-on-accent hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
