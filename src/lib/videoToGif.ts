interface GifInstance {
  addFrame: (canvas: HTMLCanvasElement, opts: { delay: number; copy: boolean }) => void;
  on: (event: "finished" | "progress", cb: (value: never) => void) => void;
  render: () => void;
}

interface GifConstructor {
  new (opts: {
    workers: number;
    quality: number;
    width: number;
    height: number;
    workerScript: string;
    dither?: boolean | string;
  }): GifInstance;
}

const MAX_FRAMES = 150;

export interface VideoToGifOptions {
  /** Frames per second of the output GIF. */
  fps?: number;
  /** Seconds of source video to capture, from `startSec`. */
  durationSec?: number;
  startSec?: number;
  /** Longest output edge in pixels — the main lever on file size. */
  maxWidth?: number;
  /** 1 = best colours/slowest, 20 = roughest/fastest. */
  quality?: number;
  onProgress?: (stage: "capturing" | "encoding", ratio: number) => void;
}

export async function videoToGif(file: File, options: VideoToGifOptions = {}): Promise<Blob> {
  const fps = Math.min(30, Math.max(1, options.fps ?? 8));
  const maxDurationSec = options.durationSec ?? 10;
  const startSec = options.startSec ?? 0;
  const maxWidth = options.maxWidth ?? 480;
  const quality = options.quality ?? 10;
  const frameIntervalMs = Math.round(1000 / fps);

  const mod = await import("gif.js");
  const GIF = (mod.default ?? mod) as unknown as GifConstructor;

  const video = document.createElement("video");
  const sourceUrl = URL.createObjectURL(file);
  video.src = sourceUrl;
  video.muted = true;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Couldn't load video"));
    });

    // Full-resolution frames make GIFs enormous (and can exhaust memory),
    // so scale the longest edge down to maxWidth.
    const scale = Math.min(1, maxWidth / video.videoWidth);
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));

    const available = Math.max(0, video.duration - startSec);
    const duration = Math.min(available, maxDurationSec);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    const gif = new GIF({
      workers: 2,
      quality,
      width,
      height,
      workerScript: "/gif.worker.js",
    });

    const frameCount = Math.max(1, Math.min(MAX_FRAMES, Math.floor((duration * 1000) / frameIntervalMs)));

    for (let i = 0; i < frameCount; i++) {
      await seekTo(video, startSec + (i * frameIntervalMs) / 1000);
      ctx.drawImage(video, 0, 0, width, height);
      gif.addFrame(canvas, { delay: frameIntervalMs, copy: true });
      options.onProgress?.("capturing", (i + 1) / frameCount);
    }

    return await new Promise<Blob>((resolve) => {
      gif.on("progress", ((ratio: number) => options.onProgress?.("encoding", ratio)) as never);
      gif.on("finished", ((blob: Blob) => resolve(blob)) as never);
      gif.render();
    });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

export async function readVideoDuration(file: File): Promise<number> {
  const video = document.createElement("video");
  const url = URL.createObjectURL(file);
  video.src = url;
  try {
    return await new Promise<number>((resolve, reject) => {
      video.onloadedmetadata = () => resolve(video.duration);
      video.onerror = () => reject(new Error("Couldn't load video"));
    });
  } finally {
    URL.revokeObjectURL(url);
  }
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
