"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { ImageResult } from "@/components/image-result";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createCollage, type CollageOptions } from "@/lib/imageCollage";

export default function ImageCollagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [columns, setColumns] = useState(0);
  const [gap, setGap] = useState(8);
  const [background, setBackground] = useState("#ffffff");
  const [fit, setFit] = useState<NonNullable<CollageOptions["fit"]>>("cover");
  const [rounded, setRounded] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function move(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  }

  async function run() {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await createCollage(files, { columns, gap, background, fit, rounded }));
    } catch {
      setError("Couldn't create the collage. Try fewer or smaller images.");
    } finally {
      setBusy(false);
    }
  }

  const autoColumns = Math.ceil(Math.sqrt(files.length || 1));

  return (
    <ToolLayout title="Image Collage Maker" description="Combine images into a grid collage — your layout, your spacing.">
      <FileDropzone
        accept="image/*"
        multiple
        onFiles={(newFiles) => {
          setFiles((prev) => [...prev, ...newFiles]);
          setResult(null);
        }}
        label={files.length ? `${files.length} image(s) selected` : "Click or drop images here"}
        hint="Add at least two images"
      />

      {files.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <span className="truncate">
                {i + 1}. {f.name}
              </span>
              <span className="flex shrink-0 gap-1">
                <button aria-label={`Move ${f.name} earlier`} onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-primary disabled:opacity-30">
                  <ChevronLeft className="size-4" />
                </button>
                <button aria-label={`Move ${f.name} later`} onClick={() => move(i, 1)} disabled={i === files.length - 1} className="text-muted-foreground hover:text-primary disabled:opacity-30">
                  <ChevronRight className="size-4" />
                </button>
                <button
                  aria-label={`Remove ${f.name}`}
                  onClick={() => {
                    setFiles((prev) => prev.filter((_, j) => j !== i));
                    setResult(null);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Columns</span>
          <select value={columns} onChange={(e) => setColumns(Number(e.target.value))} className="rounded-lg border border-border px-3 py-2">
            <option value={0}>Auto ({autoColumns})</option>
            {[1, 2, 3, 4, 5, 6].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Gap: {gap}px</span>
          <input type="range" min={0} max={60} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-36" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Corner radius: {rounded}px</span>
          <input type="range" min={0} max={80} value={rounded} onChange={(e) => setRounded(Number(e.target.value))} className="w-36" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Background</span>
          <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-10 w-16 rounded-lg border border-border" />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Fit</span>
          <div className="flex gap-2">
            {(["cover", "contain"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFit(f)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  fit === f ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                {f === "cover" ? "Fill cell" : "Fit whole image"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={run}
          disabled={files.length < 2 || busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create Collage"}
        </button>
        {files.length > 0 && (
          <button
            onClick={() => {
              setFiles([]);
              setResult(null);
            }}
            className="w-fit rounded-full border border-border px-6 py-3 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {result && <ImageResult blob={result.blob} filename={result.filename} />}
    </ToolLayout>
  );
}
