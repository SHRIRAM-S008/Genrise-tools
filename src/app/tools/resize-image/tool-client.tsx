"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { ImageResult } from "@/components/image-result";
import { BatchResults, type BatchOutput } from "@/components/batch-results";
import { resizeImage } from "@/lib/resizeImage";
import { loadImage } from "@/lib/imageCore";
import { runBatch, toBatchItems, type BatchItem } from "@/lib/batch";

type Mode = "pixels" | "percentage";

const PERCENT_PRESETS = [75, 50, 25];

export default function ResizeImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<BatchItem<BatchOutput>[]>([]);
  const [source, setSource] = useState<{ width: number; height: number } | null>(null);
  const [mode, setMode] = useState<Mode>("pixels");
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [percentage, setPercentage] = useState(50);
  const [lockAspect, setLockAspect] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string; width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(files: File[]) {
    const [selected, ...rest] = files;
    setFile(selected);
    setExtraFiles(rest.length ? toBatchItems<BatchOutput>(files, 0) : []);
    setResult(null);
    setError(null);
    try {
      const { bitmap, width: w, height: h } = await loadImage(selected);
      bitmap.close();
      setSource({ width: w, height: h });
      setWidth(w);
      setHeight(h);
    } catch {
      setSource(null);
      setError("Couldn't read that image. Try a different file.");
    }
  }

  function changeWidth(value: number | "") {
    setWidth(value);
    if (lockAspect && source && value !== "") {
      setHeight(Math.round(value * (source.height / source.width)));
    }
  }

  function changeHeight(value: number | "") {
    setHeight(value);
    if (lockAspect && source && value !== "") {
      setWidth(Math.round(value * (source.width / source.height)));
    }
  }

  function options() {
    return mode === "percentage"
      ? { percentage }
      : {
          width: width === "" ? undefined : width,
          height: height === "" ? undefined : height,
          maintainAspectRatio: lockAspect,
        };
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);

    // Fixed pixel dimensions on a mixed batch would distort every image that
    // isn't the first one, so batches are always scaled by percentage.
    if (extraFiles.length > 1) {
      const queued = extraFiles.map((item) => ({ ...item, status: "queued" as const, result: undefined, error: undefined }));
      setExtraFiles(queued);
      await runBatch(queued, (f) => resizeImage(f, { percentage }), (updated) =>
        setExtraFiles((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      );
      setBusy(false);
      return;
    }

    try {
      const output = await resizeImage(file, options());
      setResult(output);
    } catch {
      setError("Couldn't resize that image. Try a different file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Resize Image" description="Resize by pixel dimensions or percentage, with an optional aspect-ratio lock.">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        multiple
        onFiles={pick}
        label={extraFiles.length > 1 ? `${extraFiles.length} images selected` : file ? file.name : "Click or drop images here"}
        hint="JPG, PNG, or WebP — drop several to resize them all by percentage"
      />

      {source && extraFiles.length <= 1 && (
        <p className="text-sm text-muted-foreground">
          Original: {source.width} × {source.height}px
        </p>
      )}

      {extraFiles.length > 1 && (
        <p className="text-sm text-muted-foreground">
          Batch mode: all {extraFiles.length} images are scaled by percentage, so each keeps its own aspect ratio.
        </p>
      )}

      <div className={`flex gap-2 ${extraFiles.length > 1 ? "hidden" : ""}`}>
        {(["pixels", "percentage"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
              mode === m ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {m === "pixels" ? "By pixels" : "By percentage"}
          </button>
        ))}
      </div>

      {mode === "pixels" && extraFiles.length <= 1 ? (
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Width (px)</span>
            <input
              type="number"
              min={1}
              value={width}
              onChange={(e) => changeWidth(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-28 rounded-lg border border-border px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Height (px)</span>
            <input
              type="number"
              min={1}
              value={height}
              onChange={(e) => changeHeight(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-28 rounded-lg border border-border px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} />
            Lock aspect ratio
          </label>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex flex-1 items-center gap-3 text-sm">
            <span className="whitespace-nowrap font-medium">Scale: {percentage}%</span>
            <input
              type="range"
              min={5}
              max={200}
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="flex-1"
            />
          </label>
          {PERCENT_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setPercentage(p)}
              className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary/40"
            >
              {p}%
            </button>
          ))}
          {source && (
            <span className="text-sm text-muted-foreground">
              → {Math.round(source.width * (percentage / 100))} × {Math.round(source.height * (percentage / 100))}px
            </span>
          )}
        </div>
      )}

      <button
        onClick={run}
        disabled={!file || busy}
        className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        {busy ? "Resizing…" : extraFiles.length > 1 ? `Resize ${extraFiles.length} images` : "Resize"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {extraFiles.length > 1 && (
        <BatchResults
          items={extraFiles}
          zipName="resized-images.zip"
          onRemove={(id) => setExtraFiles((prev) => prev.filter((i) => i.id !== id))}
        />
      )}

      {result && extraFiles.length <= 1 && (
        <ImageResult
          blob={result.blob}
          filename={result.filename}
          originalSize={file?.size}
          dimensions={{ width: result.width, height: result.height }}
        />
      )}
    </ToolLayout>
  );
}
