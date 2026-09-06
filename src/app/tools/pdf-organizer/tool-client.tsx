"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { ChevronUp, ChevronDown, RotateCw } from "lucide-react";
import { getPageCount, rebuildPdf, type PdfPageState } from "@/lib/pdfOrganizer";

export default function PdfOrganizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageState[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(selected: File) {
    setFile(selected);
    setResult(null);
    setError(null);
    try {
      const count = await getPageCount(selected);
      setPages(Array.from({ length: count }, (_, i) => ({ originalIndex: i, rotation: 0, deleted: false })));
    } catch {
      setError("Couldn't read that PDF. Make sure it isn't password protected.");
    }
  }

  function move(index: number, direction: -1 | 1) {
    setPages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toggleDelete(index: number) {
    setPages((prev) => prev.map((p, i) => (i === index ? { ...p, deleted: !p.deleted } : p)));
  }

  function rotate(index: number) {
    setPages((prev) => prev.map((p, i) => (i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p)));
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const output = await rebuildPdf(file, pages);
      setResult(output);
    } catch {
      setError("Couldn't rebuild the PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="PDF Page Organizer" description="Reorder, rotate, or delete pages, then export a new PDF.">
      <FileDropzone accept="application/pdf" onFiles={(files) => load(files[0])} label={file ? file.name : "Click or drop a PDF here"} />

      {pages.length > 0 && (
        <ul className="flex flex-col gap-1">
          {pages.map((p, i) => (
            <li
              key={i}
              className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ${
                p.deleted ? "border-destructive/30 bg-destructive/10 line-through opacity-50" : "border-border"
              }`}
            >
              <span>Page {p.originalIndex + 1}{p.rotation ? ` (rotated ${p.rotation}°)` : ""}</span>
              <span className="flex gap-2">
                <button onClick={() => move(i, -1)} className="text-muted-foreground hover:text-primary"><ChevronUp className="size-4" /></button>
                <button onClick={() => move(i, 1)} className="text-muted-foreground hover:text-primary"><ChevronDown className="size-4" /></button>
                <button onClick={() => rotate(i)} className="text-muted-foreground hover:text-primary"><RotateCw className="size-4" /></button>
                <button onClick={() => toggleDelete(i)} className="text-muted-foreground hover:text-destructive">
                  {p.deleted ? "Restore" : "Delete"}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {pages.length > 0 && (
        <button
          onClick={run}
          disabled={busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Rebuilding…" : "Export PDF"}
        </button>
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
