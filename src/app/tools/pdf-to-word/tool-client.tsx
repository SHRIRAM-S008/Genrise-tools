"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { pdfToWord } from "@/lib/pdfToWord";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await pdfToWord(file);
      setResult(output);
    } catch {
      setError("Couldn't convert this PDF. Make sure it isn't password protected.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="PDF to Word" description="Convert PDF pages into an editable Word document.">
      <FileDropzone
        accept="application/pdf"
        onFiles={(files) => {
          setFile(files[0]);
          setResult(null);
        }}
        label={file ? file.name : "Click or drop a PDF here"}
      />

      <p className="text-sm text-muted-foreground">
        This extracts the PDF&apos;s text into an editable .docx file. Complex layouts, images, and
        exact formatting are not preserved — text and page breaks are.
      </p>

      {file && (
        <button
          onClick={run}
          disabled={busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Converting…" : "Convert to Word"}
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
