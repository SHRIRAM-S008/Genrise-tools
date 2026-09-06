"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { CheckCircle2 } from "lucide-react";
import { optimizeToTargetKb, type TargetKbResult } from "@/lib/targetKb";

export default function TargetKbPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState(50);
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
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
        width: width === "" ? undefined : width,
        height: height === "" ? undefined : height,
      });
      setResult(output);
    } catch {
      setError("Couldn't hit that target. Try a larger size or a different photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      title="UploadReady"
      description="Tell us the exact size you need. We'll compress your photo to fit — no sliders required."
    >
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        onFiles={(files) => setFile(files[0])}
        label={file ? file.name : "Click or drop a photo here"}
        hint="JPG, PNG, or WebP"
      />

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Maximum size (KB)</span>
          <input
            type="number"
            min={5}
            value={targetKb}
            onChange={(e) => setTargetKb(Number(e.target.value))}
            className="w-28 rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Width (px, optional)</span>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-28 rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Height (px, optional)</span>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-28 rounded-lg border border-border px-3 py-2"
          />
        </label>
      </div>

      <button
        onClick={run}
        disabled={!file || busy}
        className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        {busy ? "Optimizing…" : "Make it ready"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className={`flex items-center gap-1.5 text-sm ${result.achieved ? "text-primary" : "text-amber-600"}`}>
            {result.achieved ? (
              <>
                <CheckCircle2 className="size-4" /> Done — {result.sizeKb} KB (target {targetKb} KB)
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
