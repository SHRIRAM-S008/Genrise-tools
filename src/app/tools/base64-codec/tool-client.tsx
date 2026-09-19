"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { CopyButton } from "@/components/copy-button";
import { formatBytes } from "@/lib/imageCore";

type Mode = "text" | "file";

function encodeUtf8Base64(text: string): string {
  return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
}

function decodeUtf8Base64(text: string): string {
  return decodeURIComponent(
    atob(text.trim())
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

function bytesToBase64(bytes: Uint8Array): string {
  // Chunked so a large file doesn't blow the argument limit of fromCharCode.
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export default function Base64CodecPage() {
  const [mode, setMode] = useState<Mode>("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number; type: string } | null>(null);
  const [busy, setBusy] = useState(false);
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

  async function encodeFile(file: File) {
    setBusy(true);
    setError(null);
    setDataUrl("");
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const base64 = bytesToBase64(bytes);
      setOutput(base64);
      setFileMeta({ name: file.name, size: file.size, type: file.type || "application/octet-stream" });
      setDataUrl(`data:${file.type || "application/octet-stream"};base64,${base64}`);
    } catch {
      setError("Couldn't read that file. Very large files may run out of memory.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Base64 Encoder / Decoder" description="Encode text or a file to Base64, or decode Base64 back to text.">
      <div className="flex gap-2">
        {(["text", "file"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setOutput("");
              setDataUrl("");
              setError(null);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mode === m ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {m === "text" ? "Text" : "File"}
          </button>
        ))}
      </div>

      {mode === "text" ? (
        <>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder="Paste text or Base64 here…"
            aria-label="Input"
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
        </>
      ) : (
        <>
          <FileDropzone
            onFiles={(files) => encodeFile(files[0])}
            label={busy ? "Encoding…" : fileMeta ? fileMeta.name : "Click or drop any file here"}
            hint="Encoded locally — nothing is uploaded"
          />
          {fileMeta && (
            <p className="text-sm text-muted-foreground">
              {fileMeta.type} · {formatBytes(fileMeta.size)} → {formatBytes(output.length)} of Base64
            </p>
          )}
        </>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {output && (
        <div className="flex flex-col gap-2">
          <textarea
            value={output}
            readOnly
            rows={8}
            aria-label="Output"
            className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <CopyButton value={output} label="Copy output" />
            {dataUrl && <CopyButton value={dataUrl} label="Copy as data URL" />}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
