"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { ChevronUp, ChevronDown } from "lucide-react";
import { mergePdfs } from "@/lib/mergePdf";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await mergePdfs(files);
      setResult(output);
    } catch {
      setError("Couldn't merge these PDFs. Make sure they aren't password protected.");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <ToolLayout title="Merge PDF" description="Combine multiple PDF files into one, in the order you choose.">
      <FileDropzone
        accept="application/pdf"
        multiple
        onFiles={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
        label={files.length ? `${files.length} PDF(s) selected` : "Click or drop PDFs here"}
        hint="Add at least two PDFs"
      />

      {files.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <span>{i + 1}. {f.name}</span>
              <span className="flex gap-1">
                <button onClick={() => move(i, -1)} className="text-muted-foreground hover:text-primary"><ChevronUp className="size-4" /></button>
                <button onClick={() => move(i, 1)} className="text-muted-foreground hover:text-primary"><ChevronDown className="size-4" /></button>
              </span>
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
          {busy ? "Merging…" : "Merge PDFs"}
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
