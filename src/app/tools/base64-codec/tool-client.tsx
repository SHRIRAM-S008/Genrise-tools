"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function encodeUtf8Base64(text: string): string {
  return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
}

function decodeUtf8Base64(text: string): string {
  return decodeURIComponent(
    atob(text)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function Base64CodecPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function encode() {
    try {
      setOutput(encodeUtf8Base64(input));
      setError(null);
    } catch {
      setError("Couldn't encode this text.");
    }
  }

  function decode() {
    try {
      setOutput(decodeUtf8Base64(input));
      setError(null);
    } catch {
      setError("Invalid Base64 input.");
    }
  }

  return (
    <ToolLayout title="Base64 Encoder / Decoder" description="Encode text to Base64 or decode Base64 back to text.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        placeholder="Paste text or Base64 here…"
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
