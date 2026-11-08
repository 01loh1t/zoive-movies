// Tells the app which services are configured, so pages can show a friendly
// message instead of crashing when a key is missing.

export const hasTmdb = Boolean(process.env.TMDB_READ_TOKEN);

/** Tolerates a URL copied from the "Data API" page (ending in /rest/v1/). */
export const cleanSupabaseUrl = (url: string | undefined) => (url ?? "").trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

export const supabaseUrl = cleanSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);
