export type ImageMime = "image/jpeg" | "image/png" | "image/webp";

export interface ProcessedFile {
  blob: Blob;
  filename: string;
}
