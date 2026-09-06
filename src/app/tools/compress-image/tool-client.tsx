"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { compressImage } from "@/lib/compressImage";
import { formatBytes } from "@/lib/imageCore";

export default function CompressImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(selected: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await compressImage(selected, { maxSizeMB });
      setResult(output);
    } catch {
      setError("Couldn't compress that image. Try a different file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="Compress Image"
      description="Reduce a JPG, PNG, or WebP file's size, entirely in your browser."
    >
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        onFiles={(files) => {
          setFile(files[0]);
          run(files[0]);
        }}
        label={file ? file.name : "Click or drop an image here"}
        hint="JPG, PNG, or WebP"
      />

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Target max size (MB)</span>
        <input
          type="number"
          min={0.05}
          step={0.1}
          value={maxSizeMB}
          onChange={(e) => setMaxSizeMB(Number(e.target.value))}
          className="w-32 rounded-lg border border-border px-3 py-2"
        />
      </label>
      {file && (
        <button
          onClick={() => run(file)}
          disabled={busy}
          className="w-fit rounded-full bg-secondary px-5 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
        >
          {busy ? "Compressing…" : "Re-compress"}
        </button>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">
            Original: {file && formatBytes(file.size)} → New: {formatBytes(result.blob.size)}
          </p>
          <div className="mt-3">
            <DownloadButton blob={result.blob} filename={result.filename} />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
