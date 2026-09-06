import { PDFDocument } from "pdf-lib";
import { runInPdfWorker } from "./workers/pdfWorkerClient";

export interface ImagesToPdfResult {
  blob: Blob;
  filename: string;
}

export async function imagesToPdf(files: File[]): Promise<ImagesToPdfResult> {
  try {
    return await runInPdfWorker<ImagesToPdfResult>("imagesToPdf", { files });
  } catch {
    return imagesToPdfOnMainThread(files);
  }
}

async function imagesToPdfOnMainThread(files: File[]): Promise<ImagesToPdfResult> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const isPng = file.type === "image/png";
    const image = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  const pdfBytes = await pdfDoc.save();
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: "images.pdf",
  };
}
