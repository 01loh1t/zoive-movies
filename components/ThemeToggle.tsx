"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "@/components/icons";

export type Theme = "system" | "light" | "dark";
const THEME_KEY = "zoive-theme";
const EVENT = "zoive:theme";

function readTheme(): Theme {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "light" || t === "dark" || t === "system") return t;
  } catch {}
  return "system";
}

export function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** The saved theme choice, kept in sync across components and tabs. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "system");
}

const ORDER: Theme[] = ["system", "dark", "light"];
const LABEL: Record<Theme, string> = { system: "System theme", dark: "Dark theme", light: "Light theme" };

/** One button that cycles System → Dark → Light. */
export function ThemeToggle() {
  const theme = useTheme();

  // Follow the OS while set to "system".
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => readTheme() === "system" && applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const nextTheme = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const Icon = theme === "dark" ? MoonIcon : theme === "light" ? SunIcon : MonitorIcon;

  return (
    <button
      type="button"
      onClick={() => applyTheme(nextTheme)}
      aria-label={`${LABEL[theme]}. Switch to ${LABEL[nextTheme].toLowerCase()}`}
      title={LABEL[theme]}
      className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      <Icon />
    </button>
  );
}
