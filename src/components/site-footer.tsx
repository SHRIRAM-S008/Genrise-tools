import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { tools, toolCategories } from "@/lib/tools";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-muted/50 px-3 pt-3 pb-0 sm:px-6 sm:pt-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        {/* CTA card — black, vignette-masked edges */}
        <div
          className="relative overflow-hidden rounded-[32px] bg-neutral-950 px-6 py-20 text-center sm:py-24"
          style={{
            maskImage: "radial-gradient(ellipse 85% 100% at 50% 50%, black 55%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 100% at 50% 50%, black 55%, transparent 100%)",
          }}
        >
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">Why GenRise?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/50">
            Every tool runs locally in your browser — free, private, and instant. No account, no upload, no waiting.
          </p>
          <Link
            href="/"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition-transform hover:scale-105"
          >
            Browse all tools
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Links card — white/card surface */}
        <div className="rounded-[32px] bg-card p-8 sm:p-10">
          <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
                <Image src="/logo.png" alt="GenRise" width={24} height={24} className="dark:invert" />
                GenRise
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                Free, private, browser-first tools. Nothing you upload here ever leaves your device.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
              {toolCategories.slice(0, 4).map((category) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold">{category}</h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {tools
                      .filter((t) => t.category === category)
                      .slice(0, 4)
                      .map((t) => (
                        <li key={t.slug}>
                          <Link href={`/tools/${t.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {t.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} GenRise. All processing happens in your browser.</p>
            <div className="flex items-center gap-4">
              <Link href="/tools" className="hover:text-primary">All Tools</Link>
              <Link href="/studentkit" className="hover:text-primary">StudentKit</Link>
              <Link href="/careerkit" className="hover:text-primary">CareerKit</Link>
              <a href="https://github.com/SHRIRAM-S008/Genrise-tools" target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub</a>
            </div>
          </div>
        </div>

        {/* Giant wordmark, clipped by the page edge */}
        <div aria-hidden className="h-20 overflow-hidden text-center leading-none sm:h-28">
          <span className="font-heading text-[20vw] font-extrabold text-foreground/[0.06] sm:text-[14vw]">
            GenRise
          </span>
        </div>
      </div>
    </footer>
  );
}
