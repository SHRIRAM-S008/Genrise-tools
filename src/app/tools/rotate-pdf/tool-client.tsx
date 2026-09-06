"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { rotateAllPages } from "@/lib/rotatePdf";

const ANGLES = [90, 180, 270] as const;

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(angle: (typeof ANGLES)[number]) {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await rotateAllPages(file, angle);
      setResult(output);
    } catch {
      setError("Couldn't rotate this PDF. Make sure it isn't password protected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Rotate PDF Pages" description="Rotate all or selected pages of a PDF by 90-degree increments.">
      <FileDropzone
        accept="application/pdf"
        onFiles={(files) => {
          setFile(files[0]);
          setResult(null);
        }}
        label={file ? file.name : "Click or drop a PDF here"}
      />

      {file && (
        <div className="flex flex-wrap gap-2">
          {ANGLES.map((angle) => (
            <button
              key={angle}
              onClick={() => run(angle)}
              disabled={busy}
              className="rounded-full border border-border px-6 py-3 font-medium hover:border-primary/40 disabled:opacity-50"
            >
              Rotate {angle}°
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
