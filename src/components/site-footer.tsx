import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { tools, toolCategories, kits } from "@/lib/tools";

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
            href="/tools"
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
                <Image src="/logo.png" alt="GenRise" width={24} height={24} />
                GenRise
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                Free, private, browser-first tools. Nothing you upload here ever leaves your device.
              </p>
              {/* Social links */}
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://github.com/SHRIRAM-S008/Genrise-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="GitHub"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/genrise.tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="Instagram"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
              {/* Kits column */}
              <div>
                <h3 className="text-sm font-semibold">Kits</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {kits.map((kit) => (
                    <li key={kit.slug}>
                      <Link href={`/${kit.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                        {kit.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category columns */}
              {toolCategories.slice(0, 3).map((category) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold">{category}</h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {tools
                      .filter((t) => t.category === category)
                      .slice(0, 5)
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
              <Link href="/careerkit" className="hover:text-primary">CareerKit</Link>
              <Link href="/studentkit" className="hover:text-primary">StudentKit</Link>
              <Link href="/devkit" className="hover:text-primary">DevKit</Link>
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
