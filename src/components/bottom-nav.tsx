"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Home, LayoutGrid, Search, Menu, ArrowRight, Download } from "lucide-react";
import { useSearchOverlay } from "@/components/search-overlay";
import { usePwaInstall } from "@/components/pwa-install-context";

const moreLinks = [
  { href: "/careerkit", label: "CareerKit" },
  { href: "/studentkit", label: "StudentKit" },
  { href: "/devkit", label: "DevKit" },
  { href: "/mediakit", label: "MediaKit" },
  { href: "/pdfkit", label: "PDFKit" },
  { href: "/privacykit", label: "PrivacyKit" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { openSearch } = useSearchOverlay();
  const { canInstall, isIos, prompt } = usePwaInstall();
  const [moreOpen, setMoreOpen] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  const isHome = pathname === "/";
  const isTools = pathname === "/tools";
  const isKit = moreLinks.some((l) => pathname.startsWith(l.href));

  const items = [
    { key: "home", label: "Home", icon: Home, active: isHome, action: false, onClick: () => router.push("/") },
    { key: "tools", label: "Tools", icon: LayoutGrid, active: isTools, action: false, onClick: () => router.push("/tools") },
    { key: "search", label: "Search", icon: Search, active: false, action: true, onClick: openSearch },
    { key: "more", label: "Kits", icon: Menu, active: isKit || moreOpen, action: false, onClick: () => setMoreOpen((v) => !v) },
  ];

  async function handleInstall() {
    if (isIos) {
      setIosHint(true);
      return;
    }
    if (!canInstall) return;
    const ok = await prompt();
    if (ok) setMoreOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-3 z-50 overflow-hidden rounded-3xl border border-border bg-card/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl sm:hidden"
              style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
            >
              <p className="px-4 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Kits
              </p>
              <nav className="flex flex-col">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className="group flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold text-foreground transition-colors active:bg-accent"
                  >
                    {link.label}
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-active:translate-x-0.5" />
                  </Link>
                ))}
              </nav>

              {canInstall && (
                <>
                  <div className="mx-4 my-2 h-px bg-border" />
                  {iosHint && (
                    <p className="px-4 pb-2 text-xs text-muted-foreground">
                      Tap Share, then Add to Home Screen.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleInstall}
                    className="group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold text-foreground transition-colors active:bg-accent"
                  >
                    Install app
                    <Download className="size-4 text-muted-foreground transition-transform group-active:translate-x-0.5" />
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center sm:hidden"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <nav className="flex items-center gap-1 rounded-[28px] border border-border bg-card/80 p-1.5 shadow-[0_16px_36px_-14px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              className="relative flex size-12 items-center justify-center rounded-[20px] transition-colors active:scale-90"
            >
              {item.active && (
                <motion.span
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-[20px] bg-foreground"
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <item.icon
                className={`relative size-5 transition-colors ${
                  item.active ? "text-background" : "text-foreground/80"
                }`}
                strokeWidth={item.active ? 2.4 : 2}
              />
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
