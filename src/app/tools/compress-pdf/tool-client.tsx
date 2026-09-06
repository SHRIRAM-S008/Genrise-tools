"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { compressPdf, type CompressPdfResult } from "@/lib/compressPdf";
import { formatBytes } from "@/lib/imageCore";

const qualityLevels = [
  { id: "low", label: "Smallest size", quality: 0.4, maxWidth: 1200 },
  { id: "medium", label: "Balanced", quality: 0.6, maxWidth: 1600 },
  { id: "high", label: "Best quality", quality: 0.8, maxWidth: 2000 },
] as const;

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<(typeof qualityLevels)[number]["id"]>("medium");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CompressPdfResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(selected: File, levelId: (typeof qualityLevels)[number]["id"]) {
    const chosen = qualityLevels.find((l) => l.id === levelId)!;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await compressPdf(selected, { quality: chosen.quality, maxWidth: chosen.maxWidth });
      setResult(output);
    } catch {
      setError("Couldn't compress that PDF. Make sure it isn't password protected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="Compress PDF"
      description="Recompresses embedded photos and scans to shrink file size — gains depend on how image-heavy the source PDF is."
    >
      <FileDropzone
        accept="application/pdf"
        onFiles={(files) => {
          setFile(files[0]);
          run(files[0], level);
        }}
        label={file ? file.name : "Click or drop a PDF here"}
      />

      <div className="flex gap-2">
        {qualityLevels.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              setLevel(l.id);
              if (file) run(file, l.id);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              level === l.id ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {result && file && (
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">
            Original: {formatBytes(result.originalSize)} → New: {formatBytes(result.newSize)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.imagesCompressed > 0
              ? `Recompressed ${result.imagesCompressed} image${result.imagesCompressed === 1 ? "" : "s"}.`
              : "No compressible embedded images found — only removed redundant structure."}
          </p>
          <div className="mt-3">
            <DownloadButton blob={result.blob} filename={result.filename} />
          </div>
        </div>
      )}
      {busy && <p className="text-sm text-muted-foreground">Compressing…</p>}
    </ToolLayout>
  );
}
