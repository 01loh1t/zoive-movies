"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export type SessionUser = { id: string; email: string | null } | null;

const Ctx = createContext<{ user: SessionUser; authEnabled: boolean }>({ user: null, authEnabled: false });

/** Shares the signed-in user (read on the server) with client components. */
export function UserProvider({
  user,
  authEnabled,
  children,
}: {
  user: SessionUser;
  authEnabled: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    // When you sign in or out in another tab, refresh server data here too.
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") router.refresh();
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  return <Ctx.Provider value={{ user, authEnabled }}>{children}</Ctx.Provider>;
}

export const useUser = () => useContext(Ctx);
