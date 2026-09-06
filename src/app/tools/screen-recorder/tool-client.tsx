"use client";

import { useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import DownloadButton from "@/components/DownloadButton";

export default function ScreenRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function start() {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
        setResult(blob);
        stream.getTracks().forEach((t) => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      };
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        recorder.stop();
        setRecording(false);
      });
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Screen recording was denied or unavailable.");
    }
  }

  function stop() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <ToolLayout title="Screen Recorder" description="Record your screen and download the video, entirely in your browser.">
      <video ref={videoRef} className="w-full rounded-lg bg-black" />

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
          <video controls src={URL.createObjectURL(result)} className="mb-4 w-full rounded-lg" />
          <DownloadButton blob={result} filename="screen-recording.webm" />
        </div>
      )}
    </ToolLayout>
  );
}
