import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COUNTRY_COOKIE, DEFAULT_COUNTRY } from "@/lib/catalog";
import { hasSupabase } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [{ user }, cookieStore] = await Promise.all([getUser(), cookies()]);
  const country = cookieStore.get(COUNTRY_COOKIE)?.value || DEFAULT_COUNTRY;

  return (
    <div className="mx-auto max-w-2xl pt-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Settings</h1>
      <SettingsForm country={country} email={user?.email ?? null} authEnabled={hasSupabase} />
    </div>
  );
}
