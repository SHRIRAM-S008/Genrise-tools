"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import ToolLayout from "@/components/ToolLayout";
import DownloadButton from "@/components/DownloadButton";
import { formatBytes } from "@/lib/imageCore";
import { cachedFormats, NO_FORMATS, subscribeToFormats } from "@/lib/mediaRecording";
import { useObjectUrl } from "@/lib/useObjectUrl";

export default function VoiceRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [formatIndex, setFormatIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const resultUrl = useObjectUrl(result);
  const formats = useSyncExternalStore(
    subscribeToFormats,
    () => cachedFormats("audio"),
    () => NO_FORMATS
  );
  const format = formats[formatIndex];

  useEffect(() => {
    if (!recording || paused) return;
    const startedAt = Date.now() - elapsed * 1000;
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => window.clearInterval(id);
    // elapsed is the seed for resuming after a pause, not a trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording, paused]);

  // Release the microphone if the user navigates away while recording.
  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  async function start() {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      function draw() {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        analyser.getByteTimeDomainData(data);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(120,120,255,0.6)";
        const barWidth = canvas.width / data.length;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          const h = Math.abs(v) * canvas.height;
          ctx.fillRect(i * barWidth, canvas.height / 2 - h / 2, barWidth, h);
        }
        rafRef.current = requestAnimationFrame(draw);
      }
      draw();

      const recorder = new MediaRecorder(stream, format ? { mimeType: format.mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        setResult(new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }));
        stream.getTracks().forEach((t) => t.stop());
        void audioCtx.close();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
      recorder.start();
      recorderRef.current = recorder;
      setElapsed(0);
      setPaused(false);
      setRecording(true);
    } catch {
      setError("Microphone access was denied or unavailable.");
    }
  }

  function togglePause() {
    const recorder = recorderRef.current;
    if (!recorder) return;
    if (recorder.state === "recording") {
      recorder.pause();
      setPaused(true);
    } else if (recorder.state === "paused") {
      recorder.resume();
      setPaused(false);
    }
  }

  function stop() {
    if (recorderRef.current?.state !== "inactive") recorderRef.current?.stop();
    setRecording(false);
    setPaused(false);
  }

  const elapsedLabel = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const extension = format?.extension ?? "webm";

  return (
    <ToolLayout title="Voice Recorder" description="Record audio from your microphone, pause as you go, and download it.">
      <canvas ref={canvasRef} width={640} height={120} className="w-full rounded-lg bg-accent/30" />

      {formats.length > 1 && !recording && (
        <label className="flex w-fit flex-col gap-2 text-sm">
          <span className="font-medium">Format</span>
          <select
            value={formatIndex}
            onChange={(e) => setFormatIndex(Number(e.target.value))}
            className="rounded-lg border border-border px-3 py-2"
          >
            {formats.map((f, i) => (
              <option key={f.mimeType} value={i}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {!recording ? (
          <button onClick={start} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
            Start Recording
          </button>
        ) : (
          <>
            <button onClick={stop} className="w-fit rounded-full border border-border px-6 py-3 font-medium">
              Stop
            </button>
            <button onClick={togglePause} className="w-fit rounded-full border border-border px-6 py-3 font-medium">
              {paused ? "Resume" : "Pause"}
            </button>
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className={`size-2 rounded-full bg-destructive ${paused ? "" : "animate-pulse"}`} />
              {paused ? "Paused" : "Recording"} {elapsedLabel}
            </span>
          </>
        )}
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          {resultUrl && <audio controls src={resultUrl} className="mb-4 w-full" />}
          <p className="mb-3 text-sm text-muted-foreground">
            {elapsedLabel} · {formatBytes(result.size)}
          </p>
          <DownloadButton blob={result} filename={`recording.${extension}`} />
        </div>
      )}
    </ToolLayout>
  );
}
