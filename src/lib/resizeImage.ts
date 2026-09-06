import { canvasToBlob, drawToCanvas, loadImage, replaceExtension, extensionForMime } from "./imageCore";
import { runInImageWorker } from "./workers/imageWorkerClient";
import type { ImageMime } from "./types";

export interface ResizeOptions {
  width?: number;
  height?: number;
  percentage?: number;
  maintainAspectRatio?: boolean;
  mime?: ImageMime;
  quality?: number;
}

export interface ResizeResult {
  blob: Blob;
  filename: string;
  width: number;
  height: number;
}

export async function resizeImage(file: File, options: ResizeOptions): Promise<ResizeResult> {
  try {
    return await runInImageWorker<ResizeResult>("resize", { file, options });
  } catch {
    return resizeImageOnMainThread(file, options);
  }
}

async function resizeImageOnMainThread(file: File, options: ResizeOptions): Promise<ResizeResult> {
  const { bitmap, width: srcW, height: srcH } = await loadImage(file);

  let targetW: number;
  let targetH: number;

  if (options.percentage) {
    targetW = Math.round(srcW * (options.percentage / 100));
    targetH = Math.round(srcH * (options.percentage / 100));
  } else {
    const aspect = srcW / srcH;
    if (options.width && options.height) {
      if (options.maintainAspectRatio) {
        targetW = options.width;
        targetH = Math.round(options.width / aspect);
      } else {
        targetW = options.width;
        targetH = options.height;
      }
    } else if (options.width) {
      targetW = options.width;
      targetH = Math.round(options.width / aspect);
    } else if (options.height) {
      targetH = options.height;
      targetW = Math.round(options.height * aspect);
    } else {
      targetW = srcW;
      targetH = srcH;
    }
  }

  const mime = options.mime ?? (file.type as ImageMime) ?? "image/jpeg";
  const canvas = drawToCanvas(bitmap, targetW, targetH);
  const blob = await canvasToBlob(canvas, mime, options.quality);
  const filename = replaceExtension(file.name, extensionForMime(mime));

  return { blob, filename, width: targetW, height: targetH };
}
