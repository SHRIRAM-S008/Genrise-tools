"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { CopyButton } from "@/components/copy-button";
import { formatBytes } from "@/lib/imageCore";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];
type Source = "text" | "file";

async function digestToHex(algorithm: Algorithm, data: BufferSource): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashGeneratorPage() {
  const [source, setSource] = useState<Source>("text");
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [hash, setHash] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(nextFile = file, nextAlgorithm = algorithm) {
    setError(null);
    setBusy(true);
    try {
      if (source === "file") {
        if (!nextFile) return;
        setHash(await digestToHex(nextAlgorithm, await nextFile.arrayBuffer()));
      } else {
        setHash(await digestToHex(nextAlgorithm, new TextEncoder().encode(input)));
      }
    } catch {
      setError("Couldn't hash that input. Very large files may run out of memory.");
      setHash("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Hash Generator" description="Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes of text or a file.">
      <div className="flex gap-2">
        {(["text", "file"] as Source[]).map((s) => (
          <button
            key={s}
            onClick={() => {
              setSource(s);
              setHash("");
              setError(null);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              source === s ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {s === "text" ? "Hash text" : "Hash a file"}
          </button>
        ))}
      </div>

      {source === "text" ? (
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHash("");
          }}
          rows={8}
          placeholder="Enter text to hash…"
          aria-label="Text to hash"
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
      ) : (
        <>
          <FileDropzone
            onFiles={(files) => {
              setFile(files[0]);
              setHash("");
              generate(files[0]);
            }}
            label={file ? file.name : "Click or drop any file here"}
            hint="Checksums are computed locally — nothing is uploaded"
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              {file.name} · {formatBytes(file.size)}
            </p>
          )}
        </>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={algorithm}
          onChange={(e) => {
            const next = e.target.value as Algorithm;
            setAlgorithm(next);
            setHash("");
            if (source === "file" && file) generate(file, next);
          }}
          aria-label="Hash algorithm"
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          {ALGORITHMS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <button
          onClick={() => generate()}
          disabled={busy || (source === "file" ? !file : false)}
          className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Hashing…" : "Generate Hash"}
        </button>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {hash && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border p-5">
          <span className="break-all font-mono text-sm">{hash}</span>
          <CopyButton
            value={hash}
            label="Copy"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
          />
        </div>
      )}
    </ToolLayout>
  );
}
