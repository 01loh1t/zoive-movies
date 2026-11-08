"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cleanSupabaseUrl } from "@/lib/env";

let client: SupabaseClient | null = null;

/** Browser Supabase client (uses the public anon key; Row Level Security protects data). */
export function getSupabaseBrowser() {
  const url = cleanSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createBrowserClient(url, key);
  return client;
}
