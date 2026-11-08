import "server-only";

import { hasSupabase, supabaseAnonKey, supabaseUrl } from "@/lib/env";

/**
 * Which sign-in methods are switched on in Supabase (public endpoint).
 * Cached for 5 minutes, so enabling Google in Supabase shows the button soon after.
 */
export async function getAuthProviders(): Promise<{ google: boolean }> {
  if (!hasSupabase) return { google: false };
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseAnonKey },
      next: { revalidate: 300 },
    });
    if (!res.ok) return { google: false };
    const data = (await res.json()) as { external?: Record<string, boolean> };
    return { google: Boolean(data.external?.google) };
  } catch {
    return { google: false };
  }
}
