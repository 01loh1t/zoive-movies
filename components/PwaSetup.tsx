"use client";

import { useEffect } from "react";
import { startInstallCapture } from "@/lib/install";

/** Registers the service worker (production only) and listens for the install prompt. */
export function PwaSetup() {
  useEffect(() => {
    startInstallCapture();
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
