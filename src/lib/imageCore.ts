import type { ImageMime } from "./types";

export interface LoadedImage {
  bitmap: ImageBitmap;
  width: number;
  height: number;
}

export async function loadImage(file: File): Promise<LoadedImage> {
  const bitmap = await createImageBitmap(file);
  return { bitmap, width: bitmap.width, height: bitmap.height };
}

export function drawToCanvas(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  background?: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: ImageMime,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to encode image"))),
      mime,
      quality
    );
  });
}

export function extensionForMime(mime: ImageMime): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
  }
}

export function replaceExtension(filename: string, ext: string): string {
  const base = filename.replace(/\.[^./\\]+$/, "");
  return `${base}.${ext}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
