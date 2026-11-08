import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasSupabase, supabaseAnonKey, supabaseUrl } from "@/lib/env";

/** Server Supabase client that reads the signed-in user from cookies. */
export async function getSupabaseServer() {
  if (!hasSupabase) return null;
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are read-only there.
          // The proxy (proxy.ts) refreshes the session instead.
        }
      },
    },
  });
}

/** The signed-in user, or null (also null when Supabase isn't configured). */
export async function getUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) return { supabase: null, user: null };
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}
