import { PDFDocument } from "pdf-lib";
import { runInPdfWorker } from "./workers/pdfWorkerClient";

export interface MergePdfResult {
  blob: Blob;
  filename: string;
}

export async function mergePdfs(files: File[]): Promise<MergePdfResult> {
  try {
    return await runInPdfWorker<MergePdfResult>("mergePdfs", { files });
  } catch {
    return mergePdfsOnMainThread(files);
  }
}

async function mergePdfsOnMainThread(files: File[]): Promise<MergePdfResult> {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  const pdfBytes = await merged.save();
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: "merged.pdf",
  };
}
