"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function format() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  function validate() {
    try {
      JSON.parse(input);
      setError(null);
      setOutput("Valid JSON ✓");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  return (
    <ToolLayout title="JSON Formatter" description="Format, validate, and minify JSON data instantly.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        placeholder="Paste JSON here…"
        className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
      />

      <div className="flex flex-wrap gap-2">
        <button onClick={format} className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
          Format
        </button>
        <button onClick={minify} className="rounded-full border border-border px-6 py-3 font-medium hover:border-primary/40">
          Minify
        </button>
        <button onClick={validate} className="rounded-full border border-border px-6 py-3 font-medium hover:border-primary/40">
          Validate
        </button>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {output && (
        <textarea
          value={output}
          readOnly
          rows={10}
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
      )}
    </ToolLayout>
  );
}
