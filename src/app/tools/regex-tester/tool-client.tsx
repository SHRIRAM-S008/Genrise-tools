"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const { error, matches, highlighted } = useMemo(() => {
    if (!pattern) return { error: null, matches: [] as RegExpMatchArray[], highlighted: text };

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
    } catch {
      return { error: "Invalid regular expression.", matches: [] as RegExpMatchArray[], highlighted: text };
    }

    const found: RegExpMatchArray[] = [];
    let lastIndex = 0;
    const parts: string[] = [];
    const MAX_MATCHES = 1000;

    for (const match of text.matchAll(regex)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;

      // Zero-length matches (e.g. /^/gm or /\b/g) are real matches; they just
      // can't be highlighted, so count them and keep scanning.
      if (end > start) {
        parts.push(escapeHtml(text.slice(lastIndex, start)));
        parts.push(`<mark class="rounded bg-primary/30 text-inherit">${escapeHtml(match[0])}</mark>`);
        lastIndex = end;
      }

      found.push(match);
      if (found.length >= MAX_MATCHES) break;
    }
    parts.push(escapeHtml(text.slice(lastIndex)));

    return { error: null, matches: found, highlighted: parts.join("") };
  }, [pattern, flags, text]);

  return (
    <ToolLayout title="Regex Tester" description="Test regular expressions against sample text with live match highlighting.">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-medium">Pattern</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\\d+"
            className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="flex w-full flex-col gap-2 sm:w-32">
          <span className="text-sm font-medium">Flags</span>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gi"
            className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Test string</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Paste text to test against…"
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
      </label>

      {error && <p className="text-destructive">{error}</p>}

      {!error && text && (
        <div className="rounded-2xl border border-border p-5">
          <p className="mb-2 text-sm font-medium">Highlighted matches ({matches.length})</p>
          <p
            className="whitespace-pre-wrap break-words font-mono text-sm"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}

      {!error && matches.length > 0 && (
        <div className="rounded-2xl border border-border p-5">
          <p className="mb-2 text-sm font-medium">Capture groups</p>
          <ul className="flex flex-col gap-2 text-sm">
            {matches.map((m, i) => (
              <li key={i} className="rounded-lg border border-border px-3 py-2">
                <span className="mr-2 text-xs text-muted-foreground">@{m.index ?? 0}</span>
                <span className="font-mono">{m[0] === "" ? "(empty match)" : m[0]}</span>
                {m.length > 1 && (
                  <span className="ml-2 text-muted-foreground">
                    groups: {m.slice(1).map((g) => g ?? "—").join(", ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </ToolLayout>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
