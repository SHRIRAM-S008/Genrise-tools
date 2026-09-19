"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { CopyButton } from "@/components/copy-button";
import { randomInt, randomItem, shuffle } from "@/lib/random";

const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");

  function toggle(key: keyof typeof options) {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function generate() {
    const enabled = (Object.keys(options) as (keyof typeof options)[]).filter((k) => options[k]);
    if (!enabled.length) return;

    const charset = enabled.map((k) => CHARSETS[k]).join("");

    // One character from every enabled class first, so "include symbols"
    // actually guarantees a symbol, then fill the rest and shuffle.
    const picked = enabled.slice(0, length).map((k) => randomItem(CHARSETS[k].split("")));
    while (picked.length < length) picked.push(charset[randomInt(charset.length)]);

    setPassword(shuffle(picked).join(""));
  }

  return (
    <ToolLayout title="Password Generator" description="Generate strong, secure passwords with custom rules.">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground" htmlFor="length">
          Length: {length}
        </label>
        <input
          id="length"
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="flex-1"
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {(Object.keys(CHARSETS) as (keyof typeof options)[]).map((key) => (
          <label key={key} className="flex items-center gap-2">
            <input type="checkbox" checked={options[key]} onChange={() => toggle(key)} />
            {key === "upper" ? "Uppercase" : key === "lower" ? "Lowercase" : key === "numbers" ? "Numbers" : "Symbols"}
          </label>
        ))}
      </div>

      <button onClick={generate} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
        Generate
      </button>

      {password && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border p-5">
          <span className="break-all font-mono text-sm">{password}</span>
          <CopyButton value={password} label="Copy" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40" />
        </div>
      )}
    </ToolLayout>
  );
}
