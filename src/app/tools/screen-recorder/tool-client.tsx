"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import ToolLayout from "@/components/ToolLayout";
import DownloadButton from "@/components/DownloadButton";
import { formatBytes } from "@/lib/imageCore";
import { cachedFormats, NO_FORMATS, subscribeToFormats } from "@/lib/mediaRecording";
import { useObjectUrl } from "@/lib/useObjectUrl";

export default function ScreenRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [withMic, setWithMic] = useState(false);
  // MediaRecorder support can only be probed in the browser; the server
  // snapshot is empty, so hydration stays consistent.
  const formats = useSyncExternalStore(
    subscribeToFormats,
    () => cachedFormats("video"),
    () => NO_FORMATS
  );
  const [formatIndex, setFormatIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tracksRef = useRef<MediaStreamTrack[]>([]);

  const resultUrl = useObjectUrl(result);
  const format = formats[formatIndex];

  useEffect(() => {
    if (!recording) return;
    const startedAt = Date.now();
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => window.clearInterval(id);
  }, [recording]);

  // Stop sharing the screen (and the mic) if the user navigates away.
  useEffect(
    () => () => {
      tracksRef.current.forEach((t) => t.stop());
    },
    []
  );

  function cleanup() {
    tracksRef.current.forEach((t) => t.stop());
    tracksRef.current = [];
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function start() {
    setError(null);
    setResult(null);
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const tracks = [...display.getTracks()];

      if (withMic) {
        try {
          const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
          tracks.push(...mic.getAudioTracks());
        } catch {
          setError("Screen capture started, but the microphone was unavailable.");
        }
      }

      const stream = new MediaStream(tracks);
      tracksRef.current = tracks;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream, format ? { mimeType: format.mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        setResult(new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" }));
        cleanup();
      };

      // Clicking the browser's own "Stop sharing" bar ends the recording too.
      display.getVideoTracks()[0].addEventListener("ended", () => {
        if (recorder.state !== "inactive") recorder.stop();
        setRecording(false);
      });

      recorder.start();
      recorderRef.current = recorder;
      setElapsed(0);
      setRecording(true);
    } catch {
      setError("Screen recording was denied or unavailable.");
      cleanup();
    }
  }

  function stop() {
    if (recorderRef.current?.state !== "inactive") recorderRef.current?.stop();
    setRecording(false);
  }

  const elapsedLabel = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const extension = format?.extension ?? "webm";

  return (
    <ToolLayout title="Screen Recorder" description="Record your screen — with system or microphone audio — entirely in your browser.">
      <video ref={videoRef} className="w-full rounded-lg bg-black" />

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={withMic} onChange={(e) => setWithMic(e.target.checked)} disabled={recording} />
          Also record my microphone
        </label>

        {formats.length > 1 && (
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Format</span>
            <select
              value={formatIndex}
              onChange={(e) => setFormatIndex(Number(e.target.value))}
              disabled={recording}
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
      </div>

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
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-destructive" />
              Recording {elapsedLabel}
            </span>
          </>
        )}
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          {resultUrl && <video controls src={resultUrl} className="mb-4 w-full rounded-lg" />}
          <p className="mb-3 text-sm text-muted-foreground">{formatBytes(result.size)}</p>
          <DownloadButton blob={result} filename={`screen-recording.${extension}`} />
        </div>
      )}
    </ToolLayout>
  );
}
