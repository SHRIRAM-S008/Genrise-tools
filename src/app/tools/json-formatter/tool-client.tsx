"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { CopyButton } from "@/components/copy-button";
import { JsonTree } from "@/components/json-tree";

type View = "text" | "tree";

interface ParseFailure {
  message: string;
  line?: number;
  column?: number;
}

/** Turns "Unexpected token } in JSON at position 42" into a line/column. */
function describeError(error: unknown, source: string): ParseFailure {
  const message = error instanceof Error ? error.message : "Invalid JSON";
  const match = /position (\d+)/.exec(message);
  if (!match) return { message };

  const position = Number(match[1]);
  const upTo = source.slice(0, position);
  const line = upTo.split("\n").length;
  const column = position - upTo.lastIndexOf("\n");
  return { message, line, column };
}

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [parsed, setParsed] = useState<unknown>(null);
  const [view, setView] = useState<View>("text");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [failure, setFailure] = useState<ParseFailure | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  function sortDeep(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(sortDeep);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => [k, sortDeep(v)])
      );
    }
    return value;
  }

  function run(mode: "format" | "minify" | "validate") {
    try {
      const data = JSON.parse(input);
      const prepared = sortKeys ? sortDeep(data) : data;
      setParsed(prepared);
      setFailure(null);

      if (mode === "validate") {
        setOutput("");
        setStatus(`Valid JSON — ${describeShape(prepared)}`);
        return;
      }

      setStatus(null);
      setOutput(mode === "format" ? JSON.stringify(prepared, null, indent) : JSON.stringify(prepared));
    } catch (e) {
      setFailure(describeError(e, input));
      setOutput("");
      setParsed(null);
      setStatus(null);
    }
  }

  return (
    <ToolLayout title="JSON Formatter" description="Format, validate, minify and explore JSON data instantly.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        placeholder="Paste JSON here…"
        aria-label="JSON input"
        className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          Indent
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-lg border border-border px-2 py-1">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>None</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} />
          Sort keys
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => run("format")} className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
          Format
        </button>
        <button onClick={() => run("minify")} className="rounded-full border border-border px-6 py-3 font-medium hover:border-primary/40">
          Minify
        </button>
        <button onClick={() => run("validate")} className="rounded-full border border-border px-6 py-3 font-medium hover:border-primary/40">
          Validate
        </button>
      </div>

      {failure && (
        <p className="text-destructive">
          {failure.message}
          {failure.line ? ` (line ${failure.line}, column ${failure.column})` : ""}
        </p>
      )}

      {status && <p className="text-primary">{status}</p>}

      {parsed !== null && (
        <div className="flex gap-2">
          {(["text", "tree"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                view === v ? "bg-primary text-primary-foreground" : "border border-border"
              }`}
            >
              {v === "text" ? "Text output" : "Tree view"}
            </button>
          ))}
        </div>
      )}

      {view === "tree" && parsed !== null ? (
        <div className="max-h-[32rem] overflow-auto rounded-lg border border-border p-4">
          <JsonTree value={parsed} />
        </div>
      ) : (
        output && (
          <div className="flex flex-col gap-2">
            <textarea
              value={output}
              readOnly
              rows={10}
              aria-label="Output JSON"
              className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
            />
            <CopyButton value={output} label="Copy output" />
          </div>
        )
      )}
    </ToolLayout>
  );
}

function describeShape(value: unknown): string {
  if (Array.isArray(value)) return `array with ${value.length} item(s)`;
  if (value && typeof value === "object") return `object with ${Object.keys(value).length} key(s)`;
  return typeof value;
}
