"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Search, Share2, Link2, Check } from "lucide-react";
import { tools, toolCategories, type ToolCategory, type ToolMeta } from "@/lib/tools";
import { categoryTileClass, categoryGlowClass } from "@/lib/categoryStyles";

type Filter = "All" | ToolCategory;

const taskChips = [
  { label: "Get a job", kit: "careerkit" as const },
  { label: "Apply to college", kit: "studentkit" as const },
  { label: "Fix my images", kit: "mediakit" as const },
  { label: "Work with PDFs", kit: "pdfkit" as const },
  { label: "Developer tools", kit: "devkit" as const },
  { label: "Stay private", kit: "privacykit" as const },
];

const edgeFade =
  "[mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]";

/** Long-press (or right-click) to trigger a callback without also firing the wrapping Link's click. */
function useLongPress(onLongPress: () => void, ms = 480) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredRef = useRef(false);

  function start() {
    triggeredRef.current = false;
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      if (navigator.vibrate) navigator.vibrate(8);
      onLongPress();
    }, ms);
  }
  function clear() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }
  function onClickCapture(e: React.MouseEvent) {
    if (triggeredRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      onLongPress();
    },
    onClickCapture,
    style: { WebkitTouchCallout: "none" } as CSSProperties,
  };
}

function PopularToolCard({ tool, onQuickActions }: { tool: ToolMeta; onQuickActions: (t: ToolMeta) => void }) {
  const longPress = useLongPress(() => onQuickActions(tool));
  return (
    <Link
      href={`/tools/${tool.slug}`}
      {...longPress}
      className="group relative flex w-[132px] shrink-0 snap-start flex-col items-start gap-2.5 overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-3.5 transition-all duration-200 select-none active:scale-[0.98] sm:w-auto sm:flex-row sm:items-center sm:p-4 sm:hover:-translate-y-0.5 sm:hover:border-primary/30 sm:hover:bg-card sm:hover:shadow-lg"
      style={{ "--spotlight": categoryGlowClass[tool.category] } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), var(--spotlight), transparent 50%)",
        }}
      />
      <div
        className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 sm:size-10 ${categoryTileClass[tool.category]}`}
      >
        <tool.icon className="size-4.5 sm:size-5" strokeWidth={2} />
      </div>
      <div className="relative z-10 min-w-0">
        <p className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-foreground sm:truncate sm:leading-normal">
          {tool.title}
        </p>
      </div>
    </Link>
  );
}

function ToolGridCard({ tool, onQuickActions }: { tool: ToolMeta; onQuickActions: (t: ToolMeta) => void }) {
  const longPress = useLongPress(() => onQuickActions(tool));

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  function onMouseLeave(e: React.MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.style.setProperty("--x", "50%");
    e.currentTarget.style.setProperty("--y", "50%");
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      {...longPress}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-border/70 bg-card/70 p-4 transition-all duration-300 select-none active:scale-[0.98] sm:rounded-[28px] sm:p-5 sm:hover:-translate-y-1 sm:hover:border-primary/20 sm:hover:bg-card sm:hover:shadow-2xl sm:hover:shadow-primary/5"
      style={{ "--spotlight": categoryGlowClass[tool.category] } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[22px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-[28px]"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), var(--spotlight), transparent 45%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[22px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-[28px]"
        style={{
          padding: 1,
          background: "linear-gradient(135deg, var(--color-primary), transparent 60%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative z-10 flex flex-1 flex-col">
        <div
          className={`flex size-11 items-center justify-center rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-110 sm:size-14 ${categoryTileClass[tool.category]}`}
        >
          <tool.icon className="size-5 sm:size-6" strokeWidth={2} />
        </div>
        <h3 className="mt-3 font-heading text-sm font-semibold transition-colors group-hover:text-primary sm:mt-4 sm:text-base">
          {tool.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:mt-1.5 sm:text-sm">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}

export function ToolBrowser() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [quickTool, setQuickTool] = useState<ToolMeta | null>(null);
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();

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

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("focus")) {
      document.getElementById("tool-search")?.focus();
    }
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
      {/* Command bar */}
      <div className="mx-auto mb-6 max-w-xl rounded-[26px] border border-border bg-card p-4 shadow-[0_12px_36px_-16px_rgba(0,0,0,0.18)] sm:mb-8 sm:p-5">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          Ask GenRise
        </p>
        <div className="mt-2 flex items-center gap-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            id="tool-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “shrink a photo under 200kb”…"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
          />
          <kbd className="hidden shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
            ⌘K
          </kbd>
        </div>
        <div className={`mt-3 -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${edgeFade}`}>
          {taskChips.map((chip) => (
            <Link
              key={chip.kit}
              href={`/${chip.kit}`}
              className="shrink-0 whitespace-nowrap rounded-full bg-muted/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className={`mb-8 -mx-4 flex items-center gap-1.5 overflow-x-auto rounded-full border border-border bg-muted/60 p-1.5 px-4 [scrollbar-width:none] sm:mx-auto sm:w-fit sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-1.5 sm:mb-10 sm:[mask-image:none] sm:[-webkit-mask-image:none] [&::-webkit-scrollbar]:hidden ${edgeFade}`}>
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
            transition={reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-10 overflow-hidden"
          >
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Popular tools
            </h2>
            <div
              className={`-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:px-0 sm:[mask-image:none] sm:[-webkit-mask-image:none] [&::-webkit-scrollbar]:hidden ${edgeFade}`}
            >
              {popularTools.map((tool) => (
                <PopularToolCard key={tool.slug} tool={tool} onQuickActions={setQuickTool} />
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
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.25, delay: Math.min(i * 0.025, 0.25), ease: [0.22, 1, 0.36, 1] as const }
                }
              >
                <ToolGridCard tool={tool} onQuickActions={setQuickTool} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Long-press quick actions */}
      <AnimatePresence>
        {quickTool && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setQuickTool(null)}
              className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
              className="fixed inset-x-3 z-[61] overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-2xl"
              style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
            >
              <div className="flex items-center gap-3 border-b border-border px-2 pb-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${categoryTileClass[quickTool.category]}`}
                >
                  <quickTool.icon className="size-5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{quickTool.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{quickTool.description}</p>
                </div>
              </div>
              <div className="flex flex-col pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    const url = `${window.location.origin}/tools/${quickTool.slug}`;
                    if (navigator.share) {
                      try {
                        await navigator.share({ title: quickTool.title, url });
                      } catch {
                        // user dismissed the share sheet — no action needed
                      }
                      setQuickTool(null);
                    } else {
                      await navigator.clipboard.writeText(url);
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                        setQuickTool(null);
                      }, 900);
                    }
                  }}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors active:bg-muted"
                >
                  <Share2 className="size-4 text-muted-foreground" />
                  Share
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(`${window.location.origin}/tools/${quickTool.slug}`);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                      setQuickTool(null);
                    }, 900);
                  }}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-colors active:bg-muted"
                >
                  {copied ? (
                    <Check className="size-4 text-primary" />
                  ) : (
                    <Link2 className="size-4 text-muted-foreground" />
                  )}
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
