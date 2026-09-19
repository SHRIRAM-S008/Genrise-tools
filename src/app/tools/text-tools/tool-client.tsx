"use client";

import { useMemo, useState } from "react";
import { Undo2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { CopyButton } from "@/components/copy-button";
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
  const [history, setHistory] = useState<string[]>([]);
  const stats = useMemo(() => countStats(text), [text]);

  /** Every transform is destructive, so keep the previous states around. */
  function applyTransform(run: (t: string) => string) {
    setHistory((prev) => [...prev.slice(-19), text]);
    setText(run(text));
  }

  function undo() {
    if (!history.length) return;
    setText(history[history.length - 1]);
    setHistory(history.slice(0, -1));
  }

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
        aria-label="Text to transform"
        className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
      />

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>{stats.words} words</span>
        <span>{stats.characters} characters</span>
        <span>{stats.sentences} sentences</span>
        <span>{stats.lines} lines</span>
        <span>{stats.readingTimeMinutes ? `~${stats.readingTimeMinutes} min read` : "—"}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => applyTransform(a.run)}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={undo}
          disabled={!history.length}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40 disabled:opacity-40"
        >
          <Undo2 className="size-3.5" />
          Undo
        </button>
        <CopyButton value={text} label="Copy text" />
      </div>
    </ToolLayout>
  );
}
