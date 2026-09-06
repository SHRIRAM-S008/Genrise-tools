"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import DownloadButton from "@/components/DownloadButton";
import { generateQrPngBlob } from "@/lib/qrCode";

export default function QrCodePage() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(512);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await generateQrPngBlob(text, { size });
      setResult(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't generate a QR code for that text.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="QR Code Generator" description="Create a QR code for a URL, text, or any short message.">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Content</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com"
          rows={3}
          className="rounded-lg border border-border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Size (px)</span>
        <input
          type="number"
          min={128}
          max={2048}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-28 rounded-lg border border-border px-3 py-2"
        />
      </label>

      <button
        onClick={run}
        disabled={!text.trim() || busy}
        className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate QR Code"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {result && previewUrl && (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-border p-5">
          <img src={previewUrl} alt="Generated QR code" className="h-48 w-48" />
          <DownloadButton blob={result} filename="qr-code.png" />
        </div>
      )}
    </ToolLayout>
  );
}
