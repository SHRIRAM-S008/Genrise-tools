"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { videoToGif, readVideoDuration } from "@/lib/videoToGif";
import { formatBytes } from "@/lib/imageCore";
import { useObjectUrl } from "@/lib/useObjectUrl";

const WIDTHS = [320, 480, 640];

export default function VideoToGifPage() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [startSec, setStartSec] = useState(0);
  const [clipSec, setClipSec] = useState(5);
  const [fps, setFps] = useState(8);
  const [maxWidth, setMaxWidth] = useState(480);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resultUrl = useObjectUrl(result);

  async function pick(selected: File) {
    setFile(selected);
    setResult(null);
    setError(null);
    setStartSec(0);
    try {
      const seconds = await readVideoDuration(selected);
      setDuration(seconds);
      setClipSec(Math.min(5, Math.max(1, Math.floor(seconds))));
    } catch {
      setDuration(0);
      setError("Couldn't read that video. Try a different file.");
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const blob = await videoToGif(file, {
        fps,
        maxWidth,
        startSec,
        durationSec: clipSec,
        onProgress: (stage, ratio) =>
          setProgress(`${stage === "capturing" ? "Capturing frames" : "Encoding GIF"} — ${Math.round(ratio * 100)}%`),
      });
      setResult(blob);
    } catch {
      setError("Couldn't convert this video. Try a shorter clip or a smaller size.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  const estimatedFrames = Math.min(150, Math.max(1, Math.floor(clipSec * fps)));

  return (
    <ToolLayout title="Video to GIF Converter" description="Convert part of a video clip into an animated GIF.">
      <FileDropzone
        accept="video/*"
        onFiles={(files) => pick(files[0])}
        label={file ? file.name : "Click or drop a video here"}
        hint="Pick the exact section and size below"
      />

      {file && duration > 0 && (
        <>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Start at: {startSec.toFixed(1)}s</span>
              <input
                type="range"
                min={0}
                max={Math.max(0, duration - 1)}
                step={0.1}
                value={startSec}
                onChange={(e) => setStartSec(Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Clip length: {clipSec}s</span>
              <input
                type="range"
                min={1}
                max={Math.max(1, Math.min(15, Math.floor(duration - startSec) || 1))}
                value={clipSec}
                onChange={(e) => setClipSec(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Frames per second: {fps}</span>
              <input type="range" min={2} max={20} value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-40" />
            </label>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Width</span>
              <div className="flex gap-2">
                {WIDTHS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setMaxWidth(w)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      maxWidth === w ? "bg-primary text-primary-foreground" : "border border-border"
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {estimatedFrames} frames · video is {duration.toFixed(1)}s long. Fewer frames and a smaller
            width mean a much smaller GIF.
          </p>
        </>
      )}

      {file && (
        <button
          onClick={run}
          disabled={busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? progress ?? "Converting…" : "Convert to GIF"}
        </button>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-border p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {resultUrl && <img src={resultUrl} alt="Generated GIF" className="max-w-full rounded-lg" />}
          <p className="text-sm text-muted-foreground">{formatBytes(result.size)}</p>
          <DownloadButton blob={result} filename="converted.gif" />
        </div>
      )}
    </ToolLayout>
  );
}
