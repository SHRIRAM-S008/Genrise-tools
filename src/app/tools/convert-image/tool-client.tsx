"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { ImageResult } from "@/components/image-result";
import { BatchResults, type BatchOutput } from "@/components/batch-results";
import { convertImage } from "@/lib/convertImage";
import { runBatch, toBatchItems, type BatchItem } from "@/lib/batch";
import type { ImageMime } from "@/lib/types";

const formats: { value: ImageMime; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

export default function ConvertImagePage() {
  const [items, setItems] = useState<BatchItem<BatchOutput>[]>([]);
  const [target, setTarget] = useState<ImageMime>("image/png");
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);

  const lossy = target !== "image/png";
  const single = items.length === 1 ? items[0] : null;

  async function process(next: BatchItem<BatchOutput>[], mime: ImageMime) {
    setBusy(true);
    const queued = next.map((item) => ({ ...item, status: "queued" as const, result: undefined, error: undefined }));
    setItems(queued);
    await runBatch(
      queued,
      (file) => convertImage(file, mime, mime === "image/png" ? undefined : quality / 100),
      (updated) => setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    );
    setBusy(false);
  }

  function addFiles(files: File[]) {
    setItems([...items, ...toBatchItems<BatchOutput>(files, items.length)]);
  }

  return (
    <ToolLayout title="Convert Image" description="Convert JPG, PNG, WebP, GIF, BMP or AVIF into JPG, PNG or WebP — one file or many.">
      <FileDropzone
        accept="image/*"
        multiple
        onFiles={addFiles}
        label={items.length ? `${items.length} image(s) selected` : "Click or drop images here"}
        hint="Anything your browser can open — drop several at once"
      />

      <div className="flex gap-2">
        {formats.map((f) => (
          <button
            key={f.value}
            onClick={() => setTarget(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              target === f.value ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            To {f.label}
          </button>
        ))}
      </div>

      {lossy && (
        <label className="flex max-w-sm items-center gap-3 text-sm">
          <span className="whitespace-nowrap font-medium">Quality: {quality}%</span>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="flex-1"
          />
        </label>
      )}

      {target === "image/jpeg" && (
        <p className="text-sm text-muted-foreground">JPG has no transparency — transparent areas become white.</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => process(items, target)}
          disabled={!items.length || busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Converting…" : items.length > 1 ? `Convert ${items.length} images` : "Convert"}
        </button>
        {items.length > 0 && (
          <button onClick={() => setItems([])} className="w-fit rounded-full border border-border px-6 py-3 font-medium">
            Clear
          </button>
        )}
      </div>

      {single && single.status === "done" && single.result ? (
        <ImageResult blob={single.result.blob} filename={single.result.filename} originalSize={single.file.size} />
      ) : (
        <BatchResults
          items={items}
          zipName="converted-images.zip"
          onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        />
      )}

      {single?.status === "error" && <p className="text-destructive">{single.error}</p>}
    </ToolLayout>
  );
}
