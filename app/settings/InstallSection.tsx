"use client";

import { useSyncExternalStore } from "react";
import { CheckIcon } from "@/components/icons";
import { useToast } from "@/components/Toast";
import { getInstallState, promptInstall, subscribeInstall, type InstallState } from "@/lib/install";

/** "Install Zoive" card: a one-tap button where the browser supports it, instructions otherwise. */
export function InstallSection({ className }: { className: string }) {
  const toast = useToast();
  const state = useSyncExternalStore<InstallState>(subscribeInstall, getInstallState, () => "manual");

  return (
    <section aria-labelledby="s-install" className={className}>
      <h2 id="s-install" className="text-lg font-bold">
        Install the Zoive app
      </h2>
      <p className="mt-1 text-sm text-muted">
        Add Zoive to your home screen. It opens full-screen like a normal app. Free, no app store needed.
      </p>

      {state === "installed" && (
        <p className="mt-3 flex items-center gap-2 text-sm font-bold">
          <CheckIcon size={18} className="text-accent-ink" /> Zoive is installed on this device.
        </p>
      )}

      {state === "can-prompt" && (
        <button
          type="button"
          onClick={async () => {
            if (await promptInstall()) toast("Zoive installed");
          }}
          className="mt-3 h-11 rounded-full bg-accent px-6 text-sm font-bold uppercase tracking-[0.1em] text-on-accent hover:bg-accent-hover"
        >
          Install app
        </button>
      )}

      {state === "ios" && (
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
          <li>
            Open this page in <span className="font-bold">Safari</span>.
          </li>
          <li>
            Tap the <span className="font-bold">Share</span> button (the square with an arrow).
          </li>
          <li>
            Choose <span className="font-bold">Add to Home Screen</span>, then <span className="font-bold">Add</span>.
          </li>
        </ol>
      )}

      {state === "manual" && (
        <p className="mt-3 text-sm">
          Open your browser&apos;s menu (<span className="font-bold">⋮</span> or <span className="font-bold">…</span>) and
          choose <span className="font-bold">Install app</span> or <span className="font-bold">Add to Home screen</span>.
        </p>
      )}
    </section>
  );
}
