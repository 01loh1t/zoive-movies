"use client";

// Keeps the browser's "install this app" prompt so Settings can offer an Install button.
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: InstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let started = false;
export function startInstallCapture() {
  if (started) return;
  started = true;
  window.addEventListener("beforeinstallprompt", (e) => {
    deferred = e as InstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installed = true;
    notify();
  });
}

export function subscribeInstall(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export type InstallState = "installed" | "can-prompt" | "ios" | "manual";

let lastState: InstallState = "manual";
export function getInstallState(): InstallState {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  lastState = installed || standalone
    ? "installed"
    : deferred
      ? "can-prompt"
      : /iPad|iPhone|iPod/.test(navigator.userAgent)
        ? "ios"
        : "manual";
  return lastState;
}

export async function promptInstall() {
  if (!deferred) return false;
  await deferred.prompt();
  const choice = await deferred.userChoice;
  deferred = null;
  notify();
  return choice.outcome === "accepted";
}
