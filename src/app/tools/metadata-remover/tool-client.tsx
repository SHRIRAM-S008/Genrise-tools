"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { CheckCircle2 } from "lucide-react";
import { readMetadata, stripMetadata, type MetadataSummary } from "@/lib/metadataRemover";

export default function MetadataRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<MetadataSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function inspect(selected: File) {
    setFile(selected);
    setResult(null);
    setError(null);
    setBusy(true);
    try {
      const meta = await readMetadata(selected);
      setSummary(meta);
    } finally {
      setBusy(false);
    }
  }

  async function clean() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const output = await stripMetadata(file);
      setResult(output);
    } catch {
      setError("Couldn't clean that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="Metadata Remover"
      description="See — and remove — hidden camera, date, and GPS location data embedded in a photo before you share it."
    >
      <FileDropzone accept="image/jpeg,image/png,image/webp" onFiles={(files) => inspect(files[0])} label={file ? file.name : "Click or drop a photo here"} />

      {summary && (
        <div className="rounded-2xl border border-border p-5 text-sm">
          {summary.hasMetadata ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              {summary.camera && (<><dt className="text-muted-foreground">Camera</dt><dd>{summary.camera}</dd></>)}
              {summary.dateTaken && (<><dt className="text-muted-foreground">Date taken</dt><dd>{summary.dateTaken}</dd></>)}
              {summary.gps && (<><dt className="text-muted-foreground">GPS</dt><dd>{summary.gps.latitude.toFixed(4)}, {summary.gps.longitude.toFixed(4)}</dd></>)}
            </dl>
          ) : (
            <p className="text-muted-foreground">No readable metadata found in this file.</p>
          )}
        </div>
      )}

      {file && (
        <button onClick={clean} disabled={busy} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50">
          {busy ? "Cleaning…" : "Remove metadata & download"}
        </button>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className="flex items-center gap-1.5 text-sm text-primary"><CheckCircle2 className="size-4" /> Metadata stripped</p>
          <div className="mt-3">
            <DownloadButton blob={result.blob} filename={result.filename} />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
