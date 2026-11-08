"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export function LoginForm({
  next,
  linkError,
  googleEnabled,
}: {
  next: string;
  linkError: boolean;
  googleEnabled: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(
    linkError ? "That sign-in link has expired or was already used. Request a new one below." : null,
  );

  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setStatus("sending");
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo() },
    });
    if (error) {
      setStatus("idle");
      setError(
        error.status === 429
          ? "Too many emails sent. Wait a minute and try again."
          : "We couldn't send the email. Check the address and try again.",
      );
    } else setStatus("sent");
  }

  async function google() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo() },
    });
    if (error) setError("Google sign-in isn't switched on yet. Use the email link instead.");
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-xl bg-surface-2 p-6 text-center">
        <p className="text-lg font-bold">Check your email 📬</p>
        <p className="mt-1 text-muted">
          We sent a sign-in link to <span className="font-bold text-text">{email}</span>. Open it on this device.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-full px-4 py-2 text-sm font-bold text-muted hover:bg-surface-3 hover:text-text"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      <form onSubmit={sendLink} className="space-y-3">
        <label htmlFor="email" className="block text-sm font-bold">
          Email address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-12 w-full rounded-full bg-surface-2 px-5 text-text shadow-[inset_0_0_0_1px_var(--border)] placeholder:text-muted focus:shadow-[inset_0_0_0_2px_var(--accent-ink)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-12 w-full rounded-full bg-accent text-sm font-bold uppercase tracking-[0.1em] text-on-accent hover:bg-accent-hover disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>

      {googleEnabled && (
        <>
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={google}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-surface-2 text-sm font-bold shadow-[inset_0_0_0_1px_var(--border)] hover:bg-surface-3"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        Continue with Google
      </button>
        </>
      )}
    </div>
  );
}
