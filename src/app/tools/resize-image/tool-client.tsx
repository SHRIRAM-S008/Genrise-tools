"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { resizeImage } from "@/lib/resizeImage";

export default function ResizeImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [lockAspect, setLockAspect] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string; width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await resizeImage(file, {
        width: width === "" ? undefined : width,
        height: height === "" ? undefined : height,
        maintainAspectRatio: lockAspect,
      });
      setResult(output);
    } catch {
      setError("Couldn't resize that image. Try a different file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Resize Image" description="Resize by pixel dimensions, with an optional aspect-ratio lock.">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        onFiles={(files) => setFile(files[0])}
        label={file ? file.name : "Click or drop an image here"}
        hint="JPG, PNG, or WebP"
      />

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Width (px)</span>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-28 rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Height (px)</span>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-28 rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} />
          Lock aspect ratio
        </label>
      </div>

      <button
        onClick={run}
        disabled={!file || busy}
        className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        {busy ? "Resizing…" : "Resize"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">
            New dimensions: {result.width} × {result.height}px
          </p>
          <div className="mt-3">
            <DownloadButton blob={result.blob} filename={result.filename} />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
