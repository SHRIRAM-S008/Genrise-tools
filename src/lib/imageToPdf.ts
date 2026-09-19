import { PDFDocument } from "pdf-lib";
import { runInPdfWorker } from "./workers/pdfWorkerClient";

export type PdfPageSize = "image" | "A4" | "Letter";

export interface ImagesToPdfOptions {
  /** "image" gives each page the image's own physical size at 96 DPI. */
  pageSize?: PdfPageSize;
  /** Page margin in millimetres. Ignored when pageSize is "image". */
  marginMm?: number;
}

export interface ImagesToPdfResult {
  blob: Blob;
  filename: string;
}

/** PDF user-space units are points (1/72 in); browser pixels are 1/96 in. */
export const PX_TO_PT = 72 / 96;
export const MM_TO_PT = 72 / 25.4;

export const PAGE_SIZES_PT: Record<Exclude<PdfPageSize, "image">, [number, number]> = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
};

/** Largest width/height that fits `box` while keeping the source aspect ratio. */
export function fitInside(
  srcWidth: number,
  srcHeight: number,
  boxWidth: number,
  boxHeight: number
): { width: number; height: number } {
  const scale = Math.min(boxWidth / srcWidth, boxHeight / srcHeight);
  return { width: srcWidth * scale, height: srcHeight * scale };
}

export async function imagesToPdf(
  files: File[],
  options: ImagesToPdfOptions = {}
): Promise<ImagesToPdfResult> {
  try {
    return await runInPdfWorker<ImagesToPdfResult>("imagesToPdf", { files, options });
  } catch {
    return imagesToPdfOnMainThread(files, options);
  }
}

/**
 * pdf-lib can only embed PNG and JPEG. Anything else the browser can decode
 * (WebP, AVIF, GIF, BMP, HEIC on Safari) is re-encoded to JPEG first, so the
 * tool accepts whatever the file picker accepted.
 */
async function toEmbeddableBytes(file: File): Promise<{ bytes: ArrayBuffer; isPng: boolean }> {
  if (file.type === "image/png") return { bytes: await file.arrayBuffer(), isPng: true };
  if (file.type === "image/jpeg") return { bytes: await file.arrayBuffer(), isPng: false };

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))), "image/jpeg", 0.92);
  });
  return { bytes: await blob.arrayBuffer(), isPng: false };
}

async function imagesToPdfOnMainThread(
  files: File[],
  options: ImagesToPdfOptions
): Promise<ImagesToPdfResult> {
  const pageSize = options.pageSize ?? "A4";
  const marginPt = (options.marginMm ?? 0) * MM_TO_PT;
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const { bytes, isPng } = await toEmbeddableBytes(file);
    const image = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);

    if (pageSize === "image") {
      const width = image.width * PX_TO_PT;
      const height = image.height * PX_TO_PT;
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
      continue;
    }

    const [pw, ph] = PAGE_SIZES_PT[pageSize];
    // Match the page orientation to the image so landscape photos aren't shrunk.
    const landscape = image.width > image.height;
    const pageWidth = landscape ? ph : pw;
    const pageHeight = landscape ? pw : ph;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const box = fitInside(
      image.width,
      image.height,
      pageWidth - marginPt * 2,
      pageHeight - marginPt * 2
    );
    page.drawImage(image, {
      x: (pageWidth - box.width) / 2,
      y: (pageHeight - box.height) / 2,
      width: box.width,
      height: box.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: "images.pdf",
  };
}
