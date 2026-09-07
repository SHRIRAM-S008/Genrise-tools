import type { ToolCategory } from "./tools";

export const categoryTileClass: Record<ToolCategory, string> = {
  Images: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PDFs: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  Documents: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  "Data & Text": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "Security & Privacy": "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  Developer: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  Calculators: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Fun: "bg-pink-500/15 text-pink-600 dark:text-pink-400",
  "Audio & Video": "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
};

export const categoryGlowClass: Record<ToolCategory, string> = {
  Images: "rgba(59,130,246,0.18)",
  PDFs: "rgba(249,115,22,0.18)",
  Documents: "rgba(139,92,246,0.18)",
  "Data & Text": "rgba(16,185,129,0.18)",
  "Security & Privacy": "rgba(244,63,94,0.18)",
  Developer: "rgba(6,182,212,0.18)",
  Calculators: "rgba(245,158,11,0.18)",
  Fun: "rgba(236,72,153,0.18)",
  "Audio & Video": "rgba(99,102,241,0.18)",
};
