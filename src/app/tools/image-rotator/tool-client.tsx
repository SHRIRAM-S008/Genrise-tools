"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";
import { applyRotateFlip, type RotateFlipState } from "@/lib/imageRotator";

export default function ImageRotatorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<RotateFlipState>({ rotation: 0, flipH: false, flipV: false });
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function apply(next: RotateFlipState, targetFile = file) {
    if (!targetFile) return;
    setState(next);
    setBusy(true);
    try {
      const output = await applyRotateFlip(targetFile, next);
      setResult(output);
    } finally {
      setBusy(false);
    }
  }

  const previewUrl = useMemo(() => (result ? URL.createObjectURL(result.blob) : null), [result]);

  return (
    <ToolLayout title="Image Rotator" description="Rotate or flip images by 90, 180, or 270 degrees.">
      <FileDropzone
        accept="image/*"
        onFiles={(files) => {
          const picked = files[0];
          const next = { rotation: 0 as const, flipH: false, flipV: false };
          setFile(picked);
          setResult(null);
          void apply(next, picked);
        }}
        label={file ? file.name : "Click or drop an image here"}
      />

      {file && (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => apply({ ...state, rotation: ((state.rotation + 90) % 360) as RotateFlipState["rotation"] })}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
            >
              <RotateCw className="size-4" /> Rotate 90°
            </button>
            <button
              onClick={() => apply({ ...state, flipH: !state.flipH })}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${state.flipH ? "bg-primary text-primary-foreground" : "border border-border hover:border-primary/40"}`}
            >
              <FlipHorizontal className="size-4" /> Flip horizontal
            </button>
            <button
              onClick={() => apply({ ...state, flipV: !state.flipV })}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${state.flipV ? "bg-primary text-primary-foreground" : "border border-border hover:border-primary/40"}`}
            >
              <FlipVertical className="size-4" /> Flip vertical
            </button>
          </div>

          {previewUrl && (
            <div className="rounded-2xl border border-border p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="mx-auto max-h-96 rounded-lg" />
            </div>
          )}

          {busy && <p className="text-sm text-muted-foreground">Processing…</p>}

          {result && (
            <div className="rounded-2xl border border-border p-5">
              <DownloadButton blob={result.blob} filename={result.filename} />
            </div>
          )}
        </>
      )}
    </ToolLayout>
  );
}
