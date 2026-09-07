"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { usePwaInstall } from "@/components/pwa-install-context";

export function InstallCta() {
  const { canInstall, isIos, prompt } = usePwaInstall();
  const [iosHint, setIosHint] = useState(false);

  async function handleInstall() {
    if (isIos) {
      setIosHint(true);
      return;
    }
    await prompt();
  }

  return (
    <div className="mb-12 flex flex-col items-center justify-between gap-6 rounded-xl bg-neutral-950 px-8 py-10 text-center sm:flex-row sm:text-left">
      <div>
        <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
          Take GenRise with you
        </h2>
        <p className="mt-1.5 max-w-md text-sm text-white/50">
          {isIos
            ? "Tap Share, then Add to Home Screen for one-tap access to every tool."
            : "Install the app for quick, offline-ready access to every tool."}
        </p>
        {iosHint && (
          <p className="mt-2 text-xs text-emerald-400">
            Tap the Share button in your browser, then choose Add to Home Screen.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleInstall}
        disabled={!canInstall}
        className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition-all hover:gap-3 disabled:opacity-50 disabled:hover:gap-2"
      >
        {canInstall ? "Install this app" : "Installed"}
        {canInstall && <Download className="size-4" />}
      </button>
    </div>
  );
}
