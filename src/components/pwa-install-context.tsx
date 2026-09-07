"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

interface PwaInstallContextValue {
  canInstall: boolean;
  isIos: boolean;
  prompt: () => Promise<boolean>;
}

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function getIsIos() {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: boolean }).MSStream
  );
}

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos] = useState(() => getIsIos());

  useEffect(() => {
    if (typeof window === "undefined" || isStandalone() || isIos) return;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, [isIos]);

  async function prompt() {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
    return outcome === "accepted";
  }

  const canInstall = !isStandalone() && (!!deferredPrompt || isIos);

  return (
    <PwaInstallContext.Provider value={{ canInstall, isIos, prompt }}>
      {children}
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstall() {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) throw new Error("usePwaInstall must be used within PwaInstallProvider");
  return ctx;
}
