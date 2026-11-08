"use client";

// Recent searches: saved to your account when signed in, otherwise to this browser.
import { getSupabaseBrowser } from "@/lib/supabase/client";

const KEY = "zoive-recent-searches";
const EVENT = "zoive:recent";
const MAX = 10;

function readLocal(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}
function writeLocal(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {}
}
const notify = () => window.dispatchEvent(new Event(EVENT));

export function onRecentChange(fn: () => void) {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}

export async function loadRecent(userId: string | null): Promise<string[]> {
  const supabase = getSupabaseBrowser();
  if (!userId || !supabase) return readLocal();
  const { data } = await supabase
    .from("recent_searches")
    .select("query")
    .order("searched_at", { ascending: false })
    .limit(MAX);
  return (data ?? []).map((r) => r.query as string);
}

export async function addRecent(raw: string, userId: string | null) {
  const query = raw.trim().replace(/\s+/g, " ").slice(0, 100);
  if (query.length < 2) return;
  const supabase = getSupabaseBrowser();
  if (!userId || !supabase) {
    writeLocal([query, ...readLocal().filter((q) => q.toLowerCase() !== query.toLowerCase())]);
  } else {
    await supabase
      .from("recent_searches")
      .upsert({ query, searched_at: new Date().toISOString() }, { onConflict: "user_id,query" });
  }
  notify();
}

export async function removeRecent(query: string, userId: string | null) {
  const supabase = getSupabaseBrowser();
  if (!userId || !supabase) writeLocal(readLocal().filter((q) => q !== query));
  else await supabase.from("recent_searches").delete().eq("query", query);
  notify();
}

export async function clearRecent(userId: string | null) {
  const supabase = getSupabaseBrowser();
  if (!userId || !supabase) writeLocal([]);
  else await supabase.from("recent_searches").delete().eq("user_id", userId);
  notify();
}
