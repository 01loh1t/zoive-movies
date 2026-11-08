"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/** Permanently deletes your account and everything saved with it (two-step confirm). */
export function DeleteAccount() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<"idle" | "confirm" | "deleting">("idle");
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setStep("deleting");
    setError(null);
    const { error } = await supabase.rpc("delete_my_account");
    if (error) {
      setStep("confirm");
      setError(
        error.code === "PGRST202"
          ? "Account deletion isn't switched on in the database yet. Run supabase/delete-account.sql in Supabase, then try again."
          : "We couldn't delete your account just now. Check your connection and try again.",
      );
      return;
    }
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    try {
      localStorage.removeItem("zoive-recent-searches");
    } catch {}
    toast("Your account and all your data were deleted");
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="mt-6 border-t border-line pt-5">
      <h3 className="font-bold">Delete my account</h3>
      <p className="mt-1 text-sm text-muted">
        Permanently removes your account, watchlist, ratings and search history. This can&apos;t be undone.
      </p>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      {step === "idle" ? (
        <button
          type="button"
          onClick={() => setStep("confirm")}
          className="mt-3 h-11 rounded-full px-5 text-sm font-bold text-danger shadow-[inset_0_0_0_1px_var(--danger)] hover:bg-danger/10"
        >
          Delete my account
        </button>
      ) : (
        <div role="group" aria-label="Confirm account deletion" className="mt-3 rounded-lg bg-danger/10 p-4">
          <p className="text-sm font-bold">Delete your account and everything in it? This is permanent.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={remove}
              disabled={step === "deleting"}
              className="h-11 rounded-full bg-danger px-5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
            >
              {step === "deleting" ? "Deleting…" : "Yes, delete everything"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("idle");
                setError(null);
              }}
              disabled={step === "deleting"}
              className="h-11 rounded-full bg-surface-2 px-5 text-sm font-bold hover:bg-surface-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
