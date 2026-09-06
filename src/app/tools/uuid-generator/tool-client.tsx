"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function UuidGeneratorPage() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const list = Array.from({ length: Math.max(1, Math.min(count, 100)) }, () => crypto.randomUUID());
    setUuids(list);
    setCopied(false);
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
  }

  return (
    <ToolLayout title="UUID Generator" description="Generate random UUIDs (v4) in bulk, instantly.">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground" htmlFor="count">
          How many?
        </label>
        <input
          id="count"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-24 rounded-lg border border-border px-3 py-2 text-sm"
        />
        <button onClick={generate} className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
          Generate
        </button>
      </div>

      {uuids.length > 0 && (
        <div className="rounded-2xl border border-border p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{uuids.length} UUID(s)</span>
            <button onClick={copyAll} className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40">
              {copied ? "Copied!" : "Copy all"}
            </button>
          </div>
          <ul className="flex flex-col gap-1 font-mono text-sm">
            {uuids.map((u, i) => (
              <li key={i} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 hover:bg-accent/40">
                <span>{u}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(u)}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ToolLayout>
  );
}
