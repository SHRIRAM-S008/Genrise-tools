"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40 flex justify-center">
      <motion.header
        animate={{
          maxWidth: scrolled ? "56rem" : "100rem",
          marginTop: scrolled ? 12 : 0,
          borderRadius: scrolled ? 999 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`flex h-14 w-full items-center justify-between px-4 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:px-6 ${
          scrolled
            ? "border border-white/15 bg-background/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] backdrop-blur-xl dark:border-white/10"
            : "border-b border-border/60 bg-background/80 backdrop-blur-md"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Image src="/logo.png" alt="GenRise" width={28} height={28} className="dark:invert" priority />
          GenRise
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/tools" className="hidden rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-block">
            All Tools
          </Link>
          <Link href="/studentkit" className="hidden rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-block">
            StudentKit
          </Link>
          <Link href="/careerkit" className="hidden rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-block">
            CareerKit
          </Link>
          <ThemeToggle />
        </nav>
      </motion.header>
    </div>
  );
}
