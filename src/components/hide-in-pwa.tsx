"use client";

import { useSyncExternalStore, type ReactNode } from "react";

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(display-mode: standalone)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  const standalone = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return standalone || iosStandalone;
}

function getServerSnapshot() {
  return false;
}

/** Hides its children when the app is running as an installed PWA (standalone display mode). */
export function HideInPwa({ children }: { children: ReactNode }) {
  const isStandalone = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (isStandalone) return null;
  return <>{children}</>;
}
