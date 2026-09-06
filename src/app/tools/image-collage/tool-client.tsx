"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { createCollage } from "@/lib/imageCollage";

export default function ImageCollagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const output = await createCollage(files);
      setResult(output);
    } catch {
      setError("Couldn't create the collage.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Image Collage Maker" description="Combine multiple images into a single collage layout.">
      <FileDropzone
        accept="image/*"
        multiple
        onFiles={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
        label={files.length ? `${files.length} image(s) selected` : "Click or drop images here"}
        hint="Add at least two images"
      />

      {files.length > 0 && (
        <ul className="flex flex-wrap gap-2 text-sm">
          {files.map((f, i) => (
            <li key={i} className="rounded-full border border-border px-3 py-1">
              {f.name}
            </li>
          ))}
        </ul>
      )}

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

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
