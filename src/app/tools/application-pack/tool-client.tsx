"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import { createZip } from "@/lib/zipCreator";
import { formatBytes } from "@/lib/imageCore";

export default function ApplicationPackPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function move(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function run() {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const output = await createZip(files, "application-pack.zip");
      setResult(output);
    } catch {
      setError("Couldn't build the application pack.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="Application Pack Builder"
      description="Gather your resume, photo, signature, and certificates into one organized ZIP, ready to submit."
    >
      <FileDropzone multiple onFiles={(newFiles) => setFiles((prev) => [...prev, ...newFiles])} label={files.length ? `${files.length} file(s) added` : "Click or drop your documents here"} hint="Resume, photo, signature, certificates — any file type" />

      {files.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <span className="truncate">{i + 1}. {f.name} <span className="text-muted-foreground">({formatBytes(f.size)})</span></span>
              <span className="flex gap-2">
                <button onClick={() => move(i, -1)} className="text-muted-foreground hover:text-primary"><ChevronUp className="size-4" /></button>
                <button onClick={() => move(i, 1)} className="text-muted-foreground hover:text-primary"><ChevronDown className="size-4" /></button>
                <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">Remove</button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <button onClick={run} disabled={files.length === 0 || busy} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50">
        {busy ? "Packing…" : "Build Application Pack"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className="flex items-center gap-1.5 text-sm text-primary"><CheckCircle2 className="size-4" /> Pack ready — {files.length} files</p>
          <div className="mt-3">
            <DownloadButton blob={result.blob} filename={result.filename} />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
