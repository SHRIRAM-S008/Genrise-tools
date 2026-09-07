"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { tools } from "@/lib/tools";
import { categoryTileClass } from "@/lib/categoryStyles";

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

function useGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Working late?";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const shortcuts = tools.filter((t) =>
  ["compress-image", "merge-pdf", "qr-code", "resume-builder"].includes(t.slug)
);

export function PwaWelcome() {
  const isStandalone = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const greeting = useGreeting();

  if (!isStandalone) return null;

  return (
    <section className="px-4 pt-5 pb-2 sm:hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-primary/15 via-card to-card p-5"
      >
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {greeting}
        </p>
        <h2 className="mt-1 font-heading text-xl font-bold tracking-tight">
          What are we fixing today?
        </h2>

        <div className="mt-4 grid grid-cols-4 gap-2.5">
          {shortcuts.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col items-center gap-1.5 active:scale-95"
            >
              <div
                className={`flex size-12 items-center justify-center rounded-2xl shadow-sm transition-transform group-active:scale-90 ${categoryTileClass[tool.category]}`}
              >
                <tool.icon className="size-5" strokeWidth={2} />
              </div>
              <span className="line-clamp-1 text-center text-[10.5px] font-medium text-muted-foreground">
                {tool.title.split(" ")[0]}
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/tools"
          className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-foreground py-3 text-sm font-semibold text-background transition-opacity active:opacity-80"
        >
          Browse all {tools.length} tools
          <ArrowRight className="size-4" />
        </Link>
      </motion.div>
    </section>
  );
}
