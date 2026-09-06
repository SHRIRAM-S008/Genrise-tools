"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import { tools, toolCategories, type ToolCategory } from "@/lib/tools";
import { categoryTileClass } from "@/lib/categoryStyles";

type Filter = "All" | ToolCategory;

const taskChips = [
  { label: "Get a job", kit: "careerkit" as const },
  { label: "Apply to college", kit: "studentkit" as const },
  { label: "Fix my images", kit: "mediakit" as const },
  { label: "Work with PDFs", kit: "pdfkit" as const },
  { label: "Developer tools", kit: "devkit" as const },
  { label: "Stay private", kit: "privacykit" as const },
];

export function ToolBrowser() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("tool-search")?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesCategory = filter === "All" || t.category === filter;
      const matchesQuery =
        !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, filter]);

  const popularTools = useMemo(() => tools.filter((t) => t.popular), []);

  const filters: Filter[] = ["All", ...toolCategories];

  const showPopular = filter === "All" && !query.trim();

  return (
    <div id="tools">
      {/* Task chips */}
      <div className="mb-5 -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
        {taskChips.map((chip) => (
          <Link
            key={chip.kit}
            href={`/${chip.kit}`}
            className="shrink-0 whitespace-nowrap rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:text-foreground active:scale-95"
          >
            {chip.label}
          </Link>
        ))}
      </div>

      {/* Search */}
      <div className="relative mx-auto mb-5 max-w-md sm:mb-6">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="tool-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 57 tools…"
          className="h-12 w-full rounded-2xl border border-border bg-card pr-16 pl-11 text-base shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary/50 focus:shadow-[0_8px_30px_-8px_var(--color-primary)] sm:text-sm"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </div>

      {/* Category filters */}
      <div className="mb-8 -mx-4 flex items-center gap-1.5 overflow-x-auto rounded-full border border-border bg-muted/60 p-1.5 px-4 [scrollbar-width:none] sm:mx-auto sm:w-fit sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-1.5 sm:mb-10 [&::-webkit-scrollbar]:hidden">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === f
                ? "bg-foreground text-background shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]"
                : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Popular strip — only on default view */}
      <AnimatePresence>
        {showPopular && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden"
          >
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Popular tools
            </h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {popularTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card/70 p-3.5 backdrop-blur-sm transition-all active:scale-[0.98] sm:p-4 sm:hover:-translate-y-0.5 sm:hover:border-primary/40 sm:hover:shadow-lg"
                >
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10 ${categoryTileClass[tool.category]}`}
                  >
                    <tool.icon className="size-4.5 sm:size-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{tool.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All tools grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground"
          >
            No tools match &ldquo;{query}&rdquo;.
          </motion.p>
        ) : (
          <motion.div
            key={`${filter}-${query}`}
            className="grid auto-rows-[1fr] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {filtered.map((tool, i) => (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
              >
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-border/70 bg-card/70 p-4 backdrop-blur-sm transition-all duration-300 active:scale-[0.98] sm:rounded-[28px] sm:p-5 sm:hover:-translate-y-1 sm:hover:border-transparent sm:hover:shadow-2xl sm:hover:shadow-primary/10"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-[28px]"
                    style={{
                      padding: 1,
                      background: "linear-gradient(135deg, var(--color-primary), transparent 60%)",
                      WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                  <div
                    className={`flex size-11 items-center justify-center rounded-2xl shadow-inner sm:size-14 ${categoryTileClass[tool.category]}`}
                  >
                    <tool.icon className="size-5 sm:size-6" strokeWidth={2} />
                  </div>
                  <h3 className="mt-3 font-heading text-sm font-semibold sm:mt-4 sm:text-base">{tool.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:mt-1.5 sm:text-sm">
                    {tool.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
