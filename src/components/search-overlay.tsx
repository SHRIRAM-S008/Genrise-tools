"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Search, X } from "lucide-react";
import { tools } from "@/lib/tools";
import { categoryTileClass } from "@/lib/categoryStyles";

const SearchOverlayContext = createContext<{ openSearch: () => void } | null>(null);

export function useSearchOverlay() {
  const ctx = useContext(SearchOverlayContext);
  if (!ctx) throw new Error("useSearchOverlay must be used within SearchOverlayProvider");
  return ctx;
}

const suggested = tools.filter((t) => t.popular).slice(0, 6);

export function SearchOverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const openSearch = () => setOpen(true);
  const closeSearch = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tools.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [query]);

  const list = query.trim() ? results : suggested;

  function selectTool(slug: string) {
    closeSearch();
    router.push(`/tools/${slug}`);
  }

  return (
    <SearchOverlayContext.Provider value={{ openSearch }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[70] flex flex-col bg-background"
          >
            <div
              className="flex items-center gap-2 border-b border-border px-3 pt-3 pb-3"
              style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
            >
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors active:bg-accent"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div className="flex h-11 flex-1 items-center gap-2.5 rounded-2xl bg-muted px-3.5">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 57 tools…"
                  className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-background"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-8">
              {!query.trim() && (
                <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Suggested
                </p>
              )}
              {query.trim() && list.length === 0 ? (
                <p className="mt-10 text-center text-sm text-muted-foreground">
                  No tools match &ldquo;{query}&rdquo;.
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {list.map((tool) => (
                    <button
                      key={tool.slug}
                      type="button"
                      onClick={() => selectTool(tool.slug)}
                      className="flex items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors active:bg-muted"
                    >
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${categoryTileClass[tool.category]}`}
                      >
                        <tool.icon className="size-5" strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{tool.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SearchOverlayContext.Provider>
  );
}
