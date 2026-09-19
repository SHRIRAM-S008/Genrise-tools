"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { renderPdfToImages, type PdfToImageResult } from "@/lib/pdfToImage";
import { formatBytes } from "@/lib/imageCore";

const FORMATS = [
  { id: "image/png" as const, label: "PNG", hint: "lossless, bigger files" },
  { id: "image/jpeg" as const, label: "JPG", hint: "smaller, good for scans" },
];

const RESOLUTIONS = [
  { dpi: 96, label: "Screen (96 DPI)" },
  { dpi: 150, label: "Balanced (150 DPI)" },
  { dpi: 300, label: "Print (300 DPI)" },
];

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<(typeof FORMATS)[number]["id"]>("image/png");
  const [dpi, setDpi] = useState(150);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<PdfToImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await renderPdfToImages(file, {
        format,
        dpi,
        onProgress: (page, total) => setProgress(`Rendering page ${page} of ${total}…`),
      });
      setResult(output);
    } catch {
      setError("Couldn't convert this PDF. Make sure it isn't password protected.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <ToolLayout title="PDF to Image" description="Convert each PDF page into a downloadable image.">
      <FileDropzone
        accept="application/pdf"
        onFiles={(files) => {
          setFile(files[0]);
          setResult(null);
          setError(null);
        }}
        label={file ? file.name : "Click or drop a PDF here"}
      />

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Format</span>
          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFormat(f.id);
                  setResult(null);
                }}
                title={f.hint}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  format === f.id ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Resolution</span>
          <select
            value={dpi}
            onChange={(e) => {
              setDpi(Number(e.target.value));
              setResult(null);
            }}
            className="rounded-lg border border-border px-3 py-2"
          >
            {RESOLUTIONS.map((r) => (
              <option key={r.dpi} value={r.dpi}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {file && (
        <button
          onClick={run}
          disabled={busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? progress ?? "Converting…" : "Convert to Images"}
        </button>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className="mb-3 text-sm text-muted-foreground">
            {result.zipped
              ? `${result.pageCount} pages exported as a ZIP · ${formatBytes(result.blob.size)}`
              : `Single page exported · ${formatBytes(result.blob.size)}`}
          </p>
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
