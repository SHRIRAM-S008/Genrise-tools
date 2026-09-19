export interface PdfThumbnail {
  pageIndex: number;
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Renders small JPEG previews of each page so page-level tools can show what
 * the user is actually reordering. Capped by `maxPages` because a 500-page
 * document would otherwise render 500 canvases up front.
 */
export async function renderPdfThumbnails(
  file: File,
  options: { maxWidth?: number; maxPages?: number; onProgress?: (page: number, total: number) => void } = {}
): Promise<PdfThumbnail[]> {
  const maxWidth = options.maxWidth ?? 160;
  const maxPages = options.maxPages ?? 60;

  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const bytes = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
  const total = Math.min(doc.numPages, maxPages);

  const thumbnails: PdfThumbnail[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await doc.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: maxWidth / base.width });

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to render page"))), "image/jpeg", 0.7);
    });

    thumbnails.push({ pageIndex: i - 1, blob, width: canvas.width, height: canvas.height });
    options.onProgress?.(i, total);
  }

  return thumbnails;
}
