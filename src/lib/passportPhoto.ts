import { canvasToBlob, loadImage } from "./imageCore";
import { mmToPx } from "./photoSizes";
import { runInImageWorker } from "./workers/imageWorkerClient";

export interface PassportPhotoOptions {
  widthMm: number;
  heightMm: number;
  dpi?: number;
  background?: string;
  zoom?: number; // 1 = fit, >1 = zoom into center
}

export interface PassportPhotoResult {
  blob: Blob;
  filename: string;
  widthPx: number;
  heightPx: number;
}

export async function generatePassportPhoto(file: File, options: PassportPhotoOptions): Promise<PassportPhotoResult> {
  try {
    return await runInImageWorker<PassportPhotoResult>("passportPhoto", { file, options });
  } catch {
    return generatePassportPhotoOnMainThread(file, options);
  }
}

async function generatePassportPhotoOnMainThread(file: File, options: PassportPhotoOptions): Promise<PassportPhotoResult> {
  const dpi = options.dpi ?? 300;
  const targetW = mmToPx(options.widthMm, dpi);
  const targetH = mmToPx(options.heightMm, dpi);
  const targetAspect = targetW / targetH;
  const zoom = options.zoom ?? 1;

  const { bitmap, width: srcW, height: srcH } = await loadImage(file);
  const srcAspect = srcW / srcH;

  let cropW: number;
  let cropH: number;
  if (srcAspect > targetAspect) {
    cropH = srcH / zoom;
    cropW = cropH * targetAspect;
  } else {
    cropW = srcW / zoom;
    cropH = cropW / targetAspect;
  }
  const cropX = (srcW - cropW) / 2;
  const cropY = (srcH - cropH) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  if (options.background) {
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.drawImage(bitmap, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);

  const blob = await canvasToBlob(canvas, "image/jpeg", 0.95);
  return { blob, filename: "passport-photo.jpg", widthPx: targetW, heightPx: targetH };
}
