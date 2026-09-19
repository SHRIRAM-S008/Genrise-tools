"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { ImageResult } from "@/components/image-result";
import { BatchResults, type BatchOutput } from "@/components/batch-results";
import { compressImage } from "@/lib/compressImage";
import { runBatch, toBatchItems, type BatchItem } from "@/lib/batch";

export default function CompressImagePage() {
  const [items, setItems] = useState<BatchItem<BatchOutput>[]>([]);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [busy, setBusy] = useState(false);
  const [stale, setStale] = useState(false);

  const single = items.length === 1 ? items[0] : null;

  async function process(next: BatchItem<BatchOutput>[], target: number) {
    setBusy(true);
    setStale(false);
    const queued = next.map((item) => ({ ...item, status: "queued" as const, result: undefined, error: undefined }));
    setItems(queued);
    await runBatch(queued, (file) => compressImage(file, { maxSizeMB: target }), (updated) =>
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    );
    setBusy(false);
  }

  function addFiles(files: File[]) {
    const next = [...items, ...toBatchItems<BatchOutput>(files, items.length)];
    setItems(next);
    void process(next, maxSizeMB);
  }

  return (
    <ToolLayout
      title="Compress Image"
      description="Reduce one image — or a whole batch — entirely in your browser."
    >
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        multiple
        onFiles={addFiles}
        label={items.length ? `${items.length} image(s) selected` : "Click or drop images here"}
        hint="JPG, PNG, or WebP — drop several at once"
      />

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Target max size (MB)</span>
          <input
            type="number"
            min={0.05}
            step={0.1}
            value={maxSizeMB}
            onChange={(e) => {
              setMaxSizeMB(Number(e.target.value));
              setStale(true);
            }}
            className="w-32 rounded-lg border border-border px-3 py-2"
          />
        </label>

        {items.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => process(items, maxSizeMB)}
              disabled={busy}
              className={`rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-50 ${
                stale ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {busy ? "Compressing…" : stale ? "Apply new target" : "Re-compress all"}
            </button>
            <button
              onClick={() => setItems([])}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {single && single.status === "done" && single.result ? (
        <ImageResult
          blob={single.result.blob}
          filename={single.result.filename}
          originalSize={single.file.size}
          note={stale ? "Settings changed — re-compress to apply" : undefined}
        />
      ) : (
        <BatchResults
          items={items}
          zipName="compressed-images.zip"
          onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        />
      )}

      {single?.status === "error" && <p className="text-destructive">{single.error}</p>}
    </ToolLayout>
  );
}
