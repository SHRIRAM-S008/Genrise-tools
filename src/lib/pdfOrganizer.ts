import { PDFDocument, degrees } from "pdf-lib";
import { runInPdfWorker } from "./workers/pdfWorkerClient";

export interface PdfPageState {
  originalIndex: number;
  rotation: number; // additional rotation in degrees, applied on top of source
  deleted: boolean;
}

export interface RebuildPdfResult {
  blob: Blob;
  filename: string;
}

export async function getPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

export async function rebuildPdf(file: File, pages: PdfPageState[]): Promise<RebuildPdfResult> {
  try {
    return await runInPdfWorker<RebuildPdfResult>("rebuildPdf", { file, pages });
  } catch {
    return rebuildPdfOnMainThread(file, pages);
  }
}

async function rebuildPdfOnMainThread(file: File, pages: PdfPageState[]): Promise<RebuildPdfResult> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes);
  const output = await PDFDocument.create();

  const active = pages.filter((p) => !p.deleted);
  const copied = await output.copyPages(source, active.map((p) => p.originalIndex));

  copied.forEach((page, i) => {
    const extraRotation = active[i].rotation;
    if (extraRotation) {
      const current = page.getRotation().angle;
      page.setRotation(degrees(current + extraRotation));
    }
    output.addPage(page);
  });

  const pdfBytes = await output.save();
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: file.name.replace(/\.pdf$/i, "-edited.pdf"),
  };
}
