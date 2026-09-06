import { canvasToBlob, drawToCanvas, loadImage, replaceExtension, extensionForMime } from "./imageCore";
import { runInImageWorker } from "./workers/imageWorkerClient";
import type { ImageMime } from "./types";

export interface ConvertResult {
  blob: Blob;
  filename: string;
}

export async function convertImage(file: File, mime: ImageMime, quality?: number): Promise<ConvertResult> {
  try {
    return await runInImageWorker<ConvertResult>("convert", { file, mime, quality });
  } catch {
    return convertImageOnMainThread(file, mime, quality);
  }
}

async function convertImageOnMainThread(file: File, mime: ImageMime, quality?: number): Promise<ConvertResult> {
  const { bitmap, width, height } = await loadImage(file);
  const background = mime === "image/jpeg" ? "#ffffff" : undefined;
  const canvas = drawToCanvas(bitmap, width, height, background);
  const blob = await canvasToBlob(canvas, mime, quality);
  const filename = replaceExtension(file.name, extensionForMime(mime));
  return { blob, filename };
}
