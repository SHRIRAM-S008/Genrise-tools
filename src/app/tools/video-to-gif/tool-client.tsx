"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { videoToGif } from "@/lib/videoToGif";

export default function VideoToGifPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const blob = await videoToGif(file);
      setResult(blob);
    } catch {
      setError("Couldn't convert this video. Try a shorter clip.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Video to GIF Converter" description="Convert a video clip into an animated GIF.">
      <FileDropzone
        accept="video/*"
        onFiles={(files) => {
          setFile(files[0]);
          setResult(null);
        }}
        label={file ? file.name : "Click or drop a video here"}
        hint="Clips longer than 15 seconds are trimmed automatically"
      />

      {file && (
        <button
          onClick={run}
          disabled={busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Converting…" : "Convert to GIF"}
        </button>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-border p-5">
          <img src={URL.createObjectURL(result)} alt="Generated GIF" className="max-w-full rounded-lg" />
          <DownloadButton blob={result} filename="converted.gif" />
        </div>
      )}
    </ToolLayout>
  );
}
