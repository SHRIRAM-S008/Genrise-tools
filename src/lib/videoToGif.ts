interface GifInstance {
  addFrame: (canvas: HTMLCanvasElement, opts: { delay: number; copy: boolean }) => void;
  on: (event: "finished", cb: (blob: Blob) => void) => void;
  render: () => void;
}

interface GifConstructor {
  new (opts: { workers: number; quality: number; width: number; height: number; workerScript: string }): GifInstance;
}

const MAX_FRAMES = 150;

export async function videoToGif(
  file: File,
  frameIntervalMs = 150,
  maxDurationSec = 15
): Promise<Blob> {
  const mod = await import("gif.js");
  const GIF = (mod.default ?? mod) as unknown as GifConstructor;

  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  video.muted = true;
  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error("Couldn't load video"));
  });

  const width = video.videoWidth;
  const height = video.videoHeight;
  const duration = Math.min(video.duration, maxDurationSec);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const gif = new GIF({
    workers: 2,
    quality: 10,
    width,
    height,
    workerScript: "/gif.worker.js",
  });

  const frameCount = Math.min(MAX_FRAMES, Math.floor((duration * 1000) / frameIntervalMs));

  for (let i = 0; i < frameCount; i++) {
    const t = (i * frameIntervalMs) / 1000;
    await seekTo(video, t);
    ctx.drawImage(video, 0, 0, width, height);
    gif.addFrame(canvas, { delay: frameIntervalMs, copy: true });
  }

  URL.revokeObjectURL(video.src);

  return new Promise<Blob>((resolve) => {
    gif.on("finished", (blob) => resolve(blob));
    gif.render();
  });
}

function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    function onSeeked() {
      video.removeEventListener("seeked", onSeeked);
      resolve();
    }
    video.addEventListener("seeked", onSeeked);
    video.currentTime = time;
  });
}
