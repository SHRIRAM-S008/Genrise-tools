import { canvasToBlob, drawToCanvas, loadImage, replaceExtension, extensionForMime } from "./imageCore";
import { runInImageWorker } from "./workers/imageWorkerClient";
import type { ImageMime } from "./types";

export interface TargetKbOptions {
  targetKb: number;
  mime?: ImageMime;
  width?: number;
  height?: number;
}

export interface TargetKbResult {
  blob: Blob;
  filename: string;
  sizeKb: number;
  achieved: boolean;
}

/**
 * Binary-searches JPEG/WebP quality, then falls back to progressive
 * downscaling, to land as close as possible under targetKb. Runs in a
 * Web Worker since this can take dozens of canvas encodes per call.
 */
export async function optimizeToTargetKb(file: File, options: TargetKbOptions): Promise<TargetKbResult> {
  try {
    return await runInImageWorker<TargetKbResult>("targetKb", { file, options });
  } catch {
    return optimizeToTargetKbOnMainThread(file, options);
  }
}

async function optimizeToTargetKbOnMainThread(file: File, options: TargetKbOptions): Promise<TargetKbResult> {
  const mime = options.mime ?? (file.type === "image/png" ? "image/png" : "image/jpeg");
  const { bitmap, width: srcW, height: srcH } = await loadImage(file);

  let width = options.width ?? srcW;
  let height = options.height ?? srcH;
  const targetBytes = options.targetKb * 1024;

  let best: Blob | null = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    const canvas = drawToCanvas(bitmap, width, height, mime === "image/jpeg" ? "#ffffff" : undefined);

    if (mime === "image/png") {
      const blob = await canvasToBlob(canvas, mime);
      best = blob;
      if (blob.size <= targetBytes) break;
    } else {
      let lo = 0.05;
      let hi = 0.95;
      let candidate: Blob | null = null;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const blob = await canvasToBlob(canvas, mime, mid);
        if (blob.size <= targetBytes) {
          candidate = blob;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      if (candidate) {
        best = candidate;
        break;
      }
      const smallestQuality = await canvasToBlob(canvas, mime, 0.05);
      best = smallestQuality;
      if (smallestQuality.size <= targetBytes) break;
    }

    width = Math.round(width * 0.8);
    height = Math.round(height * 0.8);
    if (width < 20 || height < 20) break;
  }

  if (!best) throw new Error("Failed to produce output image");

  const ext = extensionForMime(mime);
  return {
    blob: best,
    filename: replaceExtension(file.name, ext),
    sizeKb: Math.round(best.size / 1024),
    achieved: best.size <= targetBytes,
  };
}
