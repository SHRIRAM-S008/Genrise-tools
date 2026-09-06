import type { ToolCategory } from "./tools";

export const categoryTileClass: Record<ToolCategory, string> = {
  Images: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PDFs: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  Documents: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  "Data & Text": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Privacy: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};
