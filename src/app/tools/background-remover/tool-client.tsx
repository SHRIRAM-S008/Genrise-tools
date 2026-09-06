"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { removeImageBackground } from "@/lib/backgroundRemover";

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const originalUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const resultUrl = useMemo(() => (result ? URL.createObjectURL(result.blob) : null), [result]);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress("Loading model…");
    try {
      const output = await removeImageBackground(file, (key, current, total) => {
        setProgress(`${key} (${current}/${total})`);
      });
      setResult(output);
    } catch {
      setError("Couldn't remove the background from this image. Try a different file.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <ToolLayout title="Image Background Remover" description="Remove image backgrounds instantly, on-device.">
      <FileDropzone
        accept="image/*"
        onFiles={(files) => {
          setFile(files[0]);
          setResult(null);
        }}
        label={file ? file.name : "Click or drop an image here"}
      />

      <p className="text-sm text-muted-foreground">
        The first run downloads a small on-device model, then everything runs locally in your browser
        — your image is never uploaded to a server.
      </p>

      {file && (
        <button
          onClick={run}
          disabled={busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? progress ?? "Removing background…" : "Remove Background"}
        </button>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {(originalUrl || resultUrl) && (
        <div className="grid grid-cols-2 gap-4">
          {originalUrl && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Original" className="w-full rounded-lg border border-border" />
            </div>
          )}
          {resultUrl && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Background removed</p>
              <div
                className="w-full overflow-hidden rounded-lg border border-border"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Background removed" className="w-full" />
              </div>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
