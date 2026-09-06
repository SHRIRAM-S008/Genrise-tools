import exifr from "exifr";
import { canvasToBlob, drawToCanvas, loadImage, replaceExtension } from "./imageCore";
import type { ImageMime } from "./types";

export interface MetadataSummary {
  hasMetadata: boolean;
  camera?: string;
  dateTaken?: string;
  gps?: { latitude: number; longitude: number };
  raw: Record<string, unknown> | null;
}

export async function readMetadata(file: File): Promise<MetadataSummary> {
  try {
    const data = await exifr.parse(file, { gps: true });
    if (!data) return { hasMetadata: false, raw: null };
    const camera = [data.Make, data.Model].filter(Boolean).join(" ") || undefined;
    return {
      hasMetadata: true,
      camera,
      dateTaken: data.DateTimeOriginal ? new Date(data.DateTimeOriginal).toLocaleString() : undefined,
      gps: data.latitude && data.longitude ? { latitude: data.latitude, longitude: data.longitude } : undefined,
      raw: data,
    };
  } catch {
    return { hasMetadata: false, raw: null };
  }
}

/**
 * Re-encoding an image through canvas drops all EXIF/XMP metadata,
 * since canvas.toBlob only ever writes fresh pixel data.
 */
export async function stripMetadata(file: File): Promise<{ blob: Blob; filename: string }> {
  const { bitmap, width, height } = await loadImage(file);
  const mime: ImageMime = file.type === "image/png" ? "image/png" : "image/jpeg";
  const canvas = drawToCanvas(bitmap, width, height, mime === "image/jpeg" ? "#ffffff" : undefined);
  const blob = await canvasToBlob(canvas, mime, 0.95);
  return { blob, filename: replaceExtension(file.name, mime === "image/png" ? "png" : "jpg") };
}
