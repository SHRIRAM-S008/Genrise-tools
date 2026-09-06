import { canvasToBlob, loadImage } from "./imageCore";
import type { ImageMime } from "./types";

export interface RotateFlipState {
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
}

export async function applyRotateFlip(file: File, state: RotateFlipState): Promise<{ blob: Blob; filename: string }> {
  const { bitmap, width, height } = await loadImage(file);
  const swapped = state.rotation === 90 || state.rotation === 270;
  const canvas = document.createElement("canvas");
  canvas.width = swapped ? height : width;
  canvas.height = swapped ? width : height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((state.rotation * Math.PI) / 180);
  ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);
  ctx.drawImage(bitmap, -width / 2, -height / 2, width, height);

  const mime = (file.type as ImageMime) || "image/jpeg";
  const blob = await canvasToBlob(canvas, mime);
  return { blob, filename: file.name };
}
