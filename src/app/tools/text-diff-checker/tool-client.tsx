"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { diffLines } from "@/lib/textDiff";

export default function TextDiffCheckerPage() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");
  const diff = useMemo(() => diffLines(original, changed), [original, changed]);

  return (
    <ToolLayout title="Text Diff Checker" description="Compare two blocks of text and highlight what changed.">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Original</span>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={10}
            className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Changed</span>
          <textarea
            value={changed}
            onChange={(e) => setChanged(e.target.value)}
            rows={10}
            className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
          />
        </label>
      </div>

      {(original || changed) && (
        <div className="overflow-x-auto rounded-2xl border border-border p-3 font-mono text-sm">
          {diff.map((line, i) => (
            <div
              key={i}
              className={
                line.type === "added"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : line.type === "removed"
                    ? "bg-red-500/15 text-red-700 dark:text-red-400"
                    : ""
              }
            >
              <span className="mr-2 select-none text-muted-foreground">
                {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
              </span>
              {line.text || " "}
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
