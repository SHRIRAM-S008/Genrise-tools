"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { useSearchOverlay } from "@/components/search-overlay";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { openSearch } = useSearchOverlay();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 flex justify-center" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <motion.header
        animate={{
          marginTop: scrolled ? 12 : 0,
          borderRadius: scrolled ? 999 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`relative flex h-14 items-center justify-between gap-3 px-4 transition-[background-color,box-shadow,backdrop-filter,max-width,width] duration-300 sm:px-6 ${
          scrolled
            ? "w-fit max-w-[92%] bg-background/60 shadow-2xl backdrop-blur-xl sm:w-full sm:max-w-[56rem]"
            : "w-full bg-background/80 backdrop-blur-md sm:max-w-[100rem]"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2 font-black tracking-tight">
          <Image src="/logo.png" alt="GenRise" width={402} height={205} className="h-7 w-auto" priority />
          <span className={scrolled ? "hidden sm:inline" : ""}>GenRise</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-bold sm:flex">
          <Link href="/tools" className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            All Tools
          </Link>
          <Link href="/careerkit" className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            CareerKit
          </Link>
          <Link href="/studentkit" className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            StudentKit
          </Link>
          <Link href="/devkit" className="hidden rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:inline-block">
            DevKit
          </Link>
          <Link href="/mediakit" className="hidden rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:inline-block">
            MediaKit
          </Link>
          <Link href="/pdfkit" className="hidden rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:inline-block">
            PDFKit
          </Link>
        </nav>

        <button
          type="button"
          onClick={openSearch}
          aria-label="Search tools"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent sm:hidden"
        >
          <Search className="size-[18px]" strokeWidth={2.2} />
        </button>
      </motion.header>
    </div>
  );
}
