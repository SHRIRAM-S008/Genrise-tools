"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { CheckCircle2 } from "lucide-react";
import { optimizeToTargetKb, type TargetKbResult } from "@/lib/targetKb";

export default function SignatureOptimizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(120);
  const [targetKb, setTargetKb] = useState(20);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TargetKbResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const output = await optimizeToTargetKb(file, {
        targetKb,
        width,
        height,
        mime: "image/png",
      });
      setResult(output);
    } catch {
      setError("Couldn't optimize that signature. Try a different photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="Signature Optimizer"
      description="Resize a scanned or photographed signature to exact dimensions and file size, keeping transparency."
    >
      <FileDropzone
        accept="image/png,image/jpeg"
        onFiles={(files) => setFile(files[0])}
        label={file ? file.name : "Click or drop your signature image here"}
        hint="PNG with a transparent background works best"
      />

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Width (px)</span>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-28 rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Height (px)</span>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-28 rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Max size (KB)</span>
          <input
            type="number"
            value={targetKb}
            onChange={(e) => setTargetKb(Number(e.target.value))}
            className="w-28 rounded-lg border border-border px-3 py-2"
          />
        </label>
      </div>

      <button
        onClick={run}
        disabled={!file || busy}
        className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        {busy ? "Optimizing…" : "Optimize signature"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className={`flex items-center gap-1.5 text-sm ${result.achieved ? "text-primary" : "text-amber-600"}`}>
            {result.achieved ? (
              <>
                <CheckCircle2 className="size-4" /> Done — {result.sizeKb} KB, {width}×{height}px
              </>
            ) : (
              `Closest we could get: ${result.sizeKb} KB (target ${targetKb} KB)`
            )}
          </p>
          <div className="mt-3">
            <DownloadButton blob={result.blob} filename={result.filename} />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
