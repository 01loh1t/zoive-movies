"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckIcon } from "@/components/icons";

type Action = { label: string; onClick: () => void };
type Toast = { id: number; message: string; tone: "ok" | "error"; action?: Action };
type Show = (message: string, tone?: Toast["tone"], action?: Action) => void;

const Ctx = createContext<Show>(() => {});

/** Small confirmation messages ("Added to watchlist"), announced to screen readers. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const show = useCallback<Show>(
    (message, tone = "ok", action) => {
      const id = next.current++;
      setToasts((t) => [...t.slice(-2), { id, message, tone, action }]);
      // Give people longer when there's an Undo button to reach.
      setTimeout(() => dismiss(id), action ? 6000 : 3200);
    },
    [dismiss],
  );

  return (
    <Ctx.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-full py-2.5 pl-4 text-sm font-bold shadow-pop ${
              t.action ? "pr-2" : "pr-4"
            } ${t.tone === "error" ? "bg-danger text-white" : "bg-text text-bg"}`}
          >
            {t.tone === "ok" && <CheckIcon size={16} />}
            {t.message}
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
                className="ml-1 rounded-full px-3 py-1 text-accent underline-offset-2 hover:underline dark:text-[#b33c0c]"
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
