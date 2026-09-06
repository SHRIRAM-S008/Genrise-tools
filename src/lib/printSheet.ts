import { canvasToBlob, loadImage } from "./imageCore";
import { mmToPx, paperSizesMm, type PaperSizeId } from "./photoSizes";
import { runInImageWorker } from "./workers/imageWorkerClient";

export interface PrintSheetOptions {
  paper: PaperSizeId;
  photoWidthMm: number;
  photoHeightMm: number;
  marginMm: number;
  gapMm: number;
  dpi?: number;
}

export interface PrintSheetResult {
  blob: Blob;
  filename: string;
  copies: number;
}

export async function buildPrintSheet(file: File, options: PrintSheetOptions): Promise<PrintSheetResult> {
  try {
    return await runInImageWorker<PrintSheetResult>("printSheet", { file, options });
  } catch {
    return buildPrintSheetOnMainThread(file, options);
  }
}

async function buildPrintSheetOnMainThread(file: File, options: PrintSheetOptions): Promise<PrintSheetResult> {
  const dpi = options.dpi ?? 300;
  const { bitmap } = await loadImage(file);

  const paper = paperSizesMm[options.paper];
  const pageW = mmToPx(paper.widthMm, dpi);
  const pageH = mmToPx(paper.heightMm, dpi);
  const photoW = mmToPx(options.photoWidthMm, dpi);
  const photoH = mmToPx(options.photoHeightMm, dpi);
  const margin = mmToPx(options.marginMm, dpi);
  const gap = mmToPx(options.gapMm, dpi);

  const cols = Math.max(1, Math.floor((pageW - 2 * margin + gap) / (photoW + gap)));
  const rows = Math.max(1, Math.floor((pageH - 2 * margin + gap) / (photoH + gap)));

  const canvas = document.createElement("canvas");
  canvas.width = pageW;
  canvas.height = pageH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, pageW, pageH);

  let copies = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = margin + c * (photoW + gap);
      const y = margin + r * (photoH + gap);
      ctx.drawImage(bitmap, x, y, photoW, photoH);
      ctx.strokeStyle = "#cccccc";
      ctx.strokeRect(x, y, photoW, photoH);
      copies++;
    }
  }

  const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
  return { blob, filename: "print-sheet.jpg", copies };
}
