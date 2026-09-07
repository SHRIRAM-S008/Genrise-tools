"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, X } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { usePwaInstall } from "@/components/pwa-install-context";

export function InstallPrompt() {
  const { canInstall, isIos, prompt } = usePwaInstall();
  const reducedMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!window.localStorage.getItem("genrise-install-dismissed");
  });

  const visible = canInstall && !dismissed;

  async function install() {
    const ok = await prompt();
    if (ok) setDismissed(true);
  }

  function dismiss() {
    setDismissed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("genrise-install-dismissed", "1");
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }
          }
          className="fixed left-3 right-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[55] sm:left-auto sm:right-4 sm:bottom-4 sm:w-80 sm:max-w-sm"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Download className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Install GenRise</p>
              <p className="text-xs text-muted-foreground">
                {isIos
                  ? "Tap Share, then Add to Home Screen."
                  : "Add to your home screen for quick access."}
              </p>
            </div>
            {!isIos && (
              <button
                type="button"
                onClick={install}
                className="shrink-0 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform active:scale-95"
              >
                Install
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss install prompt"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
