import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Notice } from "@/components/Notice";
import { hasSupabase } from "@/lib/env";
import { safeNext } from "@/lib/safe-next";
import { getAuthProviders } from "@/lib/supabase/providers";
import { getUser } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const next = safeNext(sp.next);

  if (!hasSupabase) {
    return (
      <Notice title="Accounts aren't set up yet" action={{ href: "/", label: "Back to movies" }}>
        Add your Supabase URL and anon key to <code className="font-bold text-text">.env.local</code> to turn on
        sign-in, watchlists and ratings.
      </Notice>
    );
  }

  const [{ user }, providers] = await Promise.all([getUser(), getAuthProviders()]);
  if (user) redirect(next);

  return (
    <div className="mx-auto max-w-md pt-12">
      <h1 className="text-center text-3xl font-extrabold tracking-tight">Sign in to Zoive</h1>
      <p className="mt-2 text-center text-muted">
        Save a watchlist, rate movies and get suggestions on any device. No password needed.
      </p>
      <div className="mt-8 rounded-xl bg-surface p-6 shadow-card sm:p-8">
        <LoginForm next={next} linkError={sp.error === "link"} googleEnabled={providers.google} />
      </div>
    </div>
  );
}
