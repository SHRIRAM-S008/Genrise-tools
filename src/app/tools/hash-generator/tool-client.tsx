"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<(typeof ALGORITHMS)[number]>("SHA-256");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest(algorithm, data);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setHash(hex);
    setCopied(false);
  }

  return (
    <ToolLayout title="Hash Generator" description="Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        placeholder="Enter text to hash…"
        className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
      />

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as (typeof ALGORITHMS)[number])}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          {ALGORITHMS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <button onClick={generate} className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
          Generate Hash
        </button>
      </div>

      {hash && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border p-5">
          <span className="break-all font-mono text-sm">{hash}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(hash);
              setCopied(true);
            }}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
