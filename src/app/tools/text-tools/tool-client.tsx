"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import {
  countStats,
  caseConverters,
  removeDuplicateLines,
  removeEmptyLines,
  removeExtraSpaces,
  reverseLines,
  sortLines,
} from "@/lib/textTools";

export default function TextToolsPage() {
  const [text, setText] = useState("");
  const stats = useMemo(() => countStats(text), [text]);

  const actions: { label: string; run: (t: string) => string }[] = [
    { label: "UPPERCASE", run: caseConverters.upper },
    { label: "lowercase", run: caseConverters.lower },
    { label: "Title Case", run: caseConverters.title },
    { label: "Sentence case", run: caseConverters.sentence },
    { label: "Remove duplicate lines", run: removeDuplicateLines },
    { label: "Remove empty lines", run: removeEmptyLines },
    { label: "Remove extra spaces", run: removeExtraSpaces },
    { label: "Sort A→Z", run: (t) => sortLines(t, "asc") },
    { label: "Sort Z→A", run: (t) => sortLines(t, "desc") },
    { label: "Reverse line order", run: reverseLines },
  ];

  return (
    <ToolLayout title="Text Tools" description="Word counts, case conversion, and line cleanup — all client-side.">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Paste or type text here…"
        className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
      />

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>{stats.words} words</span>
        <span>{stats.characters} characters</span>
        <span>{stats.sentences} sentences</span>
        <span>{stats.lines} lines</span>
        <span>~{stats.readingTimeMinutes} min read</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => setText(a.run(text))}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
          >
            {a.label}
          </button>
        ))}
      </div>
    </ToolLayout>
  );
}
