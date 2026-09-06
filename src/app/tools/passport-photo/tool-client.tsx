"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { generatePassportPhoto } from "@/lib/passportPhoto";
import { photoSizes } from "@/lib/photoSizes";

export default function PassportPhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sizeId, setSizeId] = useState(photoSizes[1].id);
  const [customW, setCustomW] = useState(35);
  const [customH, setCustomH] = useState(45);
  const [background, setBackground] = useState("#ffffff");
  const [zoom, setZoom] = useState(1);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string; widthPx: number; heightPx: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectedSize = photoSizes.find((s) => s.id === sizeId)!;
  const widthMm = sizeId === "custom" ? customW : selectedSize.widthMm;
  const heightMm = sizeId === "custom" ? customH : selectedSize.heightMm;

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const output = await generatePassportPhoto(file, { widthMm, heightMm, background, zoom });
      setResult(output);
      setPreviewUrl(URL.createObjectURL(output.blob));
    } catch {
      setError("Couldn't generate a passport photo from that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="Passport Photo Maker"
      description="Crop and resize a photo to an exact passport, visa, or ID-card size."
    >
      <FileDropzone
        accept="image/jpeg,image/png"
        onFiles={(files) => setFile(files[0])}
        label={file ? file.name : "Click or drop a portrait photo here"}
      />

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Photo size</span>
        <select
          value={sizeId}
          onChange={(e) => setSizeId(e.target.value)}
          className="w-fit rounded-lg border border-border px-3 py-2"
        >
          {photoSizes.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </label>

      {sizeId === "custom" && (
        <div className="flex gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Width (mm)</span>
            <input type="number" value={customW} onChange={(e) => setCustomW(Number(e.target.value))} className="w-24 rounded-lg border border-border px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Height (mm)</span>
            <input type="number" value={customH} onChange={(e) => setCustomH(Number(e.target.value))} className="w-24 rounded-lg border border-border px-3 py-2" />
          </label>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Background</span>
          <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-10 w-16 rounded-lg border border-border" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Zoom into face ({zoom.toFixed(1)}x)</span>
          <input type="range" min={1} max={2} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-40" />
        </label>
      </div>

      <button
        onClick={run}
        disabled={!file || busy}
        className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate Photo"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {result && previewUrl && (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-border p-5">
          <img src={previewUrl} alt="Passport photo preview" className="h-40 border border-border" />
          <p className="text-sm text-muted-foreground">{result.widthPx} × {result.heightPx}px ({widthMm}×{heightMm}mm)</p>
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
