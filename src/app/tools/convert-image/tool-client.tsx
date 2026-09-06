"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { convertImage } from "@/lib/convertImage";
import type { ImageMime } from "@/lib/types";

const formats: { value: ImageMime; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

export default function ConvertImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<ImageMime>("image/png");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(selected: File, mime: ImageMime) {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await convertImage(selected, mime);
      setResult(output);
    } catch {
      setError("Couldn't convert that image. Try a different file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Convert Image" description="Convert between JPG, PNG, and WebP formats.">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        onFiles={(files) => setFile(files[0])}
        label={file ? file.name : "Click or drop an image here"}
        hint="JPG, PNG, or WebP"
      />

      <div className="flex gap-2">
        {formats.map((f) => (
          <button
            key={f.value}
            onClick={() => setTarget(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              target === f.value
                ? "bg-primary text-primary-foreground"
                : "border border-border"
            }`}
          >
            To {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => file && run(file, target)}
        disabled={!file || busy}
        className="w-fit rounded-full bg-secondary px-6 py-3 font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
      >
        {busy ? "Converting…" : "Convert"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
