"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { createZip } from "@/lib/zipCreator";
import { formatBytes } from "@/lib/imageCore";

export default function ZipCreatorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState("archive.zip");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const output = await createZip(files, zipName || "archive.zip");
      setResult(output);
    } catch {
      setError("Couldn't create the ZIP file.");
    } finally {
      setBusy(false);
    }
  }

  function remove(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <ToolLayout title="ZIP Creator" description="Bundle multiple files into a single ZIP archive, right in your browser.">
      <FileDropzone multiple onFiles={(newFiles) => setFiles((prev) => [...prev, ...newFiles])} label={files.length ? `${files.length} file(s) selected` : "Click or drop files here"} />

      {files.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <span className="truncate">{f.name} <span className="text-muted-foreground">({formatBytes(f.size)})</span></span>
              <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">Remove</button>
            </li>
          ))}
        </ul>
      )}

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">ZIP file name</span>
        <input value={zipName} onChange={(e) => setZipName(e.target.value)} className="w-64 rounded-lg border border-border px-3 py-2" />
      </label>

      <button onClick={run} disabled={files.length === 0 || busy} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50">
        {busy ? "Zipping…" : "Create ZIP"}
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
