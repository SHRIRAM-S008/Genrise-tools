import { canvasToBlob, loadImage } from "./imageCore";
import type { ImageMime } from "./types";

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function cropImage(file: File, rect: CropRect): Promise<{ blob: Blob; filename: string }> {
  const { bitmap } = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(rect.width));
  canvas.height = Math.max(1, Math.round(rect.height));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(bitmap, rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height);

  const mime = (file.type as ImageMime) || "image/jpeg";
  const blob = await canvasToBlob(canvas, mime);
  return { blob, filename: file.name };
}
