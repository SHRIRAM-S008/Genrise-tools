"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Copy, Check, Download } from "lucide-react";
import { extractText, type OcrProgress } from "@/lib/ocrExtractor";

export default function OcrTextExtractorPage() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setText(null);
    setProgress(null);
    try {
      const result = await extractText(file, setProgress);
      setText(result);
    } catch {
      setError("Couldn't extract text from this file. Try a clearer image or a different file.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  function copyText() {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function downloadText() {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout title="OCR Text Extractor" description="Pull text out of images and scanned PDFs.">
      <FileDropzone
        accept="image/*,application/pdf"
        onFiles={(files) => handleFile(files[0])}
        label={busy ? "Reading…" : "Click or drop an image or PDF here"}
      />

      {busy && progress && (
        <p className="text-sm text-muted-foreground">
          {progress.status} {progress.progress > 0 ? `(${Math.round(progress.progress * 100)}%)` : ""}
        </p>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {text !== null && (
        <div className="flex flex-col gap-3">
          <textarea
            readOnly
            value={text}
            rows={12}
            className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyText}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied!" : "Copy text"}
            </button>
            <button
              onClick={downloadText}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
            >
              <Download className="size-3.5" />
              Download .txt
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
