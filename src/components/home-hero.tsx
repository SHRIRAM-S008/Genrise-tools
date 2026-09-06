"use client";

import { motion } from "motion/react";
import { Lock, Sparkles, Zap } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative pt-14 pb-10 text-center sm:pt-20 sm:pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-32 -bottom-32 -z-10 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        }}
      >
        <div
          className="absolute top-[10%] left-[10%] size-[420px] rounded-full bg-emerald-400/25 blur-[110px] dark:bg-emerald-500/20"
          style={{ animation: "aurora-drift 16s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[15%] right-[10%] size-[380px] rounded-full bg-sky-400/20 blur-[110px] dark:bg-sky-500/15"
          style={{ animation: "aurora-drift 20s ease-in-out infinite reverse" }}
        />
        <div
          className="absolute top-[35%] left-[40%] size-[320px] rounded-full bg-violet-400/15 blur-[110px] dark:bg-violet-500/15"
          style={{ animation: "aurora-drift 24s ease-in-out infinite" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex max-w-2xl flex-col items-center"
      >
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl">
          Every tool you need, right in your browser
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground text-balance">
          Compress, convert, and organize your files — 100% free, with nothing ever uploaded to a server.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            Free
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="size-3.5 text-primary" />
            Private
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="size-3.5 text-primary" />
            Simple
          </span>
        </div>
      </motion.div>
    </section>
  );
}
