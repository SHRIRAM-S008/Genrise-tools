"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { CopyButton } from "@/components/copy-button";

export default function UuidGeneratorPage() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  function generate() {
    const list = Array.from({ length: Math.max(1, Math.min(count, 100)) }, () => crypto.randomUUID());
    setUuids(list);
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
            <CopyButton value={uuids.join("\n")} label="Copy all" />
          </div>
          <ul className="flex flex-col gap-1 font-mono text-sm">
            {uuids.map((u, i) => (
              <li key={i} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 hover:bg-accent/40">
                <span>{u}</span>
                <CopyButton
                  value={u}
                  label="Copy"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </ToolLayout>
  );
}
