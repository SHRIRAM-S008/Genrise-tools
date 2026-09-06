"use client";

import { useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import DownloadButton from "@/components/DownloadButton";

export default function VoiceRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

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
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
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

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setResult(blob);
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Microphone access was denied or unavailable.");
    }
  }

  function stop() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <ToolLayout title="Voice Recorder" description="Record audio from your microphone and download it.">
      <canvas ref={canvasRef} width={640} height={120} className="w-full rounded-lg bg-accent/30" />

      <div className="flex gap-3">
        {!recording ? (
          <button onClick={start} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
            Start Recording
          </button>
        ) : (
          <button onClick={stop} className="w-fit rounded-full border border-border px-6 py-3 font-medium">
            Stop
          </button>
        )}
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <audio controls src={URL.createObjectURL(result)} className="mb-4 w-full" />
          <DownloadButton blob={result} filename="recording.webm" />
        </div>
      )}
    </ToolLayout>
  );
}
