"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { parsePageRange, extractPages } from "@/lib/splitPdf";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    file.arrayBuffer().then(async (bytes) => {
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
    });
  }, [file]);

  async function run() {
    if (!file) return;
    const indices = parsePageRange(range, pageCount);
    if (indices.length === 0) {
      setError("Enter a valid page range, e.g. 1-3,5");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const output = await extractPages(file, indices);
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
        onFiles={(files) => {
          setFile(files[0]);
          setResult(null);
        }}
        label={file ? file.name : "Click or drop a PDF here"}
      />

      {pageCount > 0 && (
        <>
          <p className="text-sm text-muted-foreground">{pageCount} page(s)</p>
          <label className="flex flex-col gap-1 text-sm">
            Pages to extract
            <input
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="e.g. 1-3,5"
              className="rounded-lg border border-border px-3 py-2 font-mono"
            />
          </label>
        </>
      )}

      {file && (
        <button
          onClick={run}
          disabled={busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Splitting…" : "Extract Pages"}
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
