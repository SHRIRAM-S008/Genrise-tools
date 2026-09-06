import imageCompression from "browser-image-compression";
import type { ImageMime } from "./types";
import { extensionForMime, replaceExtension } from "./imageCore";

export interface CompressOptions {
  maxSizeMB?: number;
  mime?: ImageMime;
  quality?: number;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<{ blob: Blob; filename: string }> {
  const mime = options.mime ?? (file.type as ImageMime);
  const blob = await imageCompression(file, {
    maxSizeMB: options.maxSizeMB ?? 1,
    useWebWorker: true,
    fileType: mime,
    initialQuality: options.quality,
  });
  const ext = extensionForMime(mime);
  return { blob, filename: replaceExtension(file.name, ext) };
}
