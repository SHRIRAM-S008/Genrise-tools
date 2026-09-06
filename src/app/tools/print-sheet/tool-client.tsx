"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { buildPrintSheet } from "@/lib/printSheet";
import type { PaperSizeId } from "@/lib/photoSizes";

export default function PrintSheetPage() {
  const [file, setFile] = useState<File | null>(null);
  const [paper, setPaper] = useState<PaperSizeId>("A4");
  const [photoW, setPhotoW] = useState(35);
  const [photoH, setPhotoH] = useState(45);
  const [margin, setMargin] = useState(5);
  const [gap, setGap] = useState(3);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string; copies: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const output = await buildPrintSheet(file, {
        paper,
        photoWidthMm: photoW,
        photoHeightMm: photoH,
        marginMm: margin,
        gapMm: gap,
      });
      setResult(output);
    } catch {
      setError("Couldn't build a print sheet from that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="Print Sheet Maker"
      description="Arrange repeated copies of a photo on one printable page — perfect for passport photos, labels, or stickers."
    >
      <FileDropzone
        accept="image/jpeg,image/png"
        onFiles={(files) => setFile(files[0])}
        label={file ? file.name : "Click or drop a photo here"}
      />

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Paper</span>
          <select value={paper} onChange={(e) => setPaper(e.target.value as PaperSizeId)} className="rounded-lg border border-border px-3 py-2">
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Photo width (mm)</span>
          <input type="number" value={photoW} onChange={(e) => setPhotoW(Number(e.target.value))} className="w-24 rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Photo height (mm)</span>
          <input type="number" value={photoH} onChange={(e) => setPhotoH(Number(e.target.value))} className="w-24 rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Margin (mm)</span>
          <input type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-20 rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Gap (mm)</span>
          <input type="number" value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-20 rounded-lg border border-border px-3 py-2" />
        </label>
      </div>

      <button
        onClick={run}
        disabled={!file || busy}
        className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        {busy ? "Building…" : "Generate Sheet"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">{result.copies} copies fit on this sheet.</p>
          <div className="mt-3">
            <DownloadButton blob={result.blob} filename={result.filename} />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
