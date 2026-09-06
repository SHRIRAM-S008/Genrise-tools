"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function UrlEncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function encode() {
    setOutput(encodeURIComponent(input));
    setError(null);
  }

  function decode() {
    try {
      setOutput(decodeURIComponent(input));
      setError(null);
    } catch {
      setError("Invalid URL-encoded input.");
    }
  }

  return (
    <ToolLayout title="URL Encoder / Decoder" description="Encode or decode URL components and query strings.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        placeholder="Paste text or a URL-encoded string here…"
        className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
      />

      <div className="flex flex-wrap gap-2">
        <button onClick={encode} className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
          Encode
        </button>
        <button onClick={decode} className="rounded-full border border-border px-6 py-3 font-medium hover:border-primary/40">
          Decode
        </button>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {output && (
        <textarea
          value={output}
          readOnly
          rows={8}
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
      )}
    </ToolLayout>
  );
}
