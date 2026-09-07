"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { tools, toolCategories } from "@/lib/tools";

const categoryCounts = toolCategories.map((c) => ({
  name: c,
  count: tools.filter((t) => t.category === c).length,
}));

export function HomeHero() {
  return (
    <section className="relative pt-16 pb-8">
      {/* Grainy gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          quality={45}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="mx-auto max-w-3xl px-4 text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Free tools for your files — all in your browser
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-lg text-muted-foreground sm:text-xl"
        >
          Compress images, merge PDFs, build resumes, generate QR codes, and more.
          Nothing you upload here ever leaves your device.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/tools"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse all {tools.length} tools
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/careerkit"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground"
          >
            Explore Kits
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
        >
          <span>100% private</span>
          <span className="text-border">·</span>
          <span>No sign-up</span>
          <span className="text-border">·</span>
          <span>No uploads</span>
          <span className="text-border">·</span>
          <span>Free forever</span>
        </motion.div>
      </div>
    </section>
  );
}
