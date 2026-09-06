import { PDFDocument } from "pdf-lib";
import { runInPdfWorker } from "./workers/pdfWorkerClient";

export interface CompressPdfOptions {
  /** JPEG re-encode quality for embedded photos, 0-1. Default 0.6. */
  quality?: number;
  /** Downscale embedded images wider than this, in px. Default 1600. */
  maxWidth?: number;
}

export interface CompressPdfResult {
  blob: Blob;
  filename: string;
  originalSize: number;
  newSize: number;
  imagesCompressed: number;
}

/**
 * Recompresses embedded JPEG (DCTDecode) images at a lower quality/size and
 * re-serializes the document with object streams. This is where most of a
 * scanned/photo-heavy PDF's size lives — pdf-lib alone can't touch embedded
 * image bytes, so we do it manually via its low-level XObject APIs.
 * Non-JPEG images (Flate/CCITT-encoded) are left untouched.
 */
export async function compressPdf(file: File, options: CompressPdfOptions = {}): Promise<CompressPdfResult> {
  try {
    return await runInPdfWorker<CompressPdfResult>("compressPdf", { file, options });
  } catch {
    return compressPdfOnMainThread(file);
  }
}

/** Fallback when Web Workers are unavailable: structure-only compression. */
async function compressPdfOnMainThread(file: File): Promise<CompressPdfResult> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const pdfBytes = await doc.save({ useObjectStreams: true });
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: file.name.replace(/\.pdf$/i, "-compressed.pdf"),
    originalSize: file.size,
    newSize: pdfBytes.byteLength,
    imagesCompressed: 0,
  };
}
