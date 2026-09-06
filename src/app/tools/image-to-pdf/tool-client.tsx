"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { imagesToPdf } from "@/lib/imageToPdf";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await imagesToPdf(files);
      setResult(output);
    } catch {
      setError("Couldn't build the PDF. Only JPG and PNG images are supported.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Image to PDF" description="Combine one or more JPG/PNG images into a single PDF, in order.">
      <FileDropzone
        accept="image/jpeg,image/png"
        multiple
        onFiles={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
        label={files.length ? `${files.length} image(s) selected` : "Click or drop images here"}
        hint="JPG or PNG — add as many as you like"
      />

      {files.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
          {files.map((f, i) => (
            <li key={i}>{i + 1}. {f.name}</li>
          ))}
        </ul>
      )}

      <div className="flex gap-3">
        <button
          onClick={run}
          disabled={files.length === 0 || busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Building PDF…" : "Create PDF"}
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

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
