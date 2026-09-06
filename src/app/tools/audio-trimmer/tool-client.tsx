"use client";

import { useEffect, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { decodeAudioFile, drawWaveform, trimAudioBuffer, audioBufferToWav } from "@/lib/audioTrimmer";

export default function AudioTrimmerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  useEffect(() => {
    if (buffer && canvasRef.current) drawWaveform(canvasRef.current, buffer);
  }, [buffer]);

  async function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const decoded = await decodeAudioFile(file);
      setBuffer(decoded);
      setStart(0);
      setEnd(decoded.duration);
    } catch {
      setError("Couldn't decode this audio file.");
    } finally {
      setBusy(false);
    }
  }

  function trim() {
    if (!buffer) return;
    const trimmed = trimAudioBuffer(buffer, start, end);
    setResult(audioBufferToWav(trimmed));
  }

  return (
    <ToolLayout title="Audio Trimmer" description="Trim an audio file to the exact section you need and export it.">
      <FileDropzone accept="audio/*" onFiles={handleFiles} label="Click or drop an audio file here" />

      {busy && <p className="text-muted-foreground">Decoding…</p>}
      {error && <p className="text-destructive">{error}</p>}

      {buffer && (
        <div className="rounded-2xl border border-border p-5">
          <canvas ref={canvasRef} width={640} height={120} className="w-full rounded-lg bg-accent/30" />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 flex-col gap-2">
              <span className="text-sm font-medium">Start (s): {start.toFixed(2)}</span>
              <input
                type="range"
                min={0}
                max={buffer.duration}
                step={0.01}
                value={start}
                onChange={(e) => setStart(Math.min(Number(e.target.value), end))}
              />
            </label>
            <label className="flex flex-1 flex-col gap-2">
              <span className="text-sm font-medium">End (s): {end.toFixed(2)}</span>
              <input
                type="range"
                min={0}
                max={buffer.duration}
                step={0.01}
                value={end}
                onChange={(e) => setEnd(Math.max(Number(e.target.value), start))}
              />
            </label>
          </div>

          <button
            onClick={trim}
            disabled={end <= start}
            className="mt-4 w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
          >
            Trim &amp; Export
          </button>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <audio controls src={URL.createObjectURL(result)} className="mb-4 w-full" />
          <DownloadButton blob={result} filename="trimmed-audio.wav" />
        </div>
      )}
    </ToolLayout>
  );
}
