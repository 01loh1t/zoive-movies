import { Notice } from "@/components/Notice";
import { hasSupabase } from "@/lib/env";

/** Shown on account-only pages when you're signed out (or accounts aren't configured). */
export function RequireAccount({ what, next }: { what: string; next: string }) {
  if (!hasSupabase) {
    return (
      <Notice title="Accounts aren't set up yet">
        Add your Supabase keys to <code className="font-bold text-text">.env.local</code> to use {what}.
      </Notice>
    );
  }
  return (
    <Notice title={`Sign in to see ${what}`} action={{ href: `/login?next=${next}`, label: "Sign in" }}>
      It only takes an email address, and your list follows you on every device.
    </Notice>
  );
}
