"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { parsePageRange, extractPages, getPdfPageCount, splitIntoSinglePages } from "@/lib/splitPdf";

type Mode = "range" | "single-pages";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("range");
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(selected: File) {
    setFile(selected);
    setResult(null);
    setError(null);
    setPageCount(0);
    try {
      setPageCount(await getPdfPageCount(selected));
    } catch {
      setError("Couldn't read this PDF. Make sure it isn't password protected.");
    }
  }

  const selectedCount = mode === "range" ? parsePageRange(range, pageCount).length : pageCount;

  async function run() {
    if (!file) return;
    setError(null);

    if (mode === "range" && selectedCount === 0) {
      setError("Enter a valid page range, e.g. 1-3,5");
      return;
    }

    setBusy(true);
    setResult(null);
    try {
      const output =
        mode === "single-pages"
          ? await splitIntoSinglePages(file)
          : await extractPages(file, parsePageRange(range, pageCount));
      setResult(output);
    } catch {
      setError("Couldn't split this PDF. Make sure it isn't password protected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Split PDF" description="Extract specific pages or split a PDF into separate files.">
      <FileDropzone
        accept="application/pdf"
        onFiles={(files) => pick(files[0])}
        label={file ? file.name : "Click or drop a PDF here"}
      />

      {pageCount > 0 && (
        <>
          <p className="text-sm text-muted-foreground">{pageCount} page(s)</p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMode("range")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mode === "range" ? "bg-primary text-primary-foreground" : "border border-border"
              }`}
            >
              Extract a page range
            </button>
            <button
              onClick={() => setMode("single-pages")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mode === "single-pages" ? "bg-primary text-primary-foreground" : "border border-border"
              }`}
            >
              One file per page (ZIP)
            </button>
          </div>

          {mode === "range" && (
            <label className="flex flex-col gap-1 text-sm">
              Pages to extract
              <input
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g. 1-3,5"
                className="rounded-lg border border-border px-3 py-2 font-mono"
              />
              <span className="text-xs text-muted-foreground">
                {range.trim()
                  ? `${selectedCount} page(s) selected`
                  : `Use commas and ranges, e.g. 1-3,5 (pages 1 to ${pageCount})`}
              </span>
            </label>
          )}
        </>
      )}

      {file && (
        <button
          onClick={run}
          disabled={busy || pageCount === 0}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Splitting…" : mode === "single-pages" ? "Split into single pages" : "Extract Pages"}
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
