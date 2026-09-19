import JSZip from "jszip";

export interface PdfToImageOptions {
  format?: "image/png" | "image/jpeg";
  /** Render resolution; 150 DPI is fine on screen, 300 for print. */
  dpi?: number;
  quality?: number;
  onProgress?: (page: number, total: number) => void;
}

export interface PdfToImageResult {
  blob: Blob;
  filename: string;
  pageCount: number;
  /** True when the result is a ZIP rather than a single image. */
  zipped: boolean;
}

export async function renderPdfToImages(
  file: File,
  options: PdfToImageOptions = {}
): Promise<PdfToImageResult> {
  const format = options.format ?? "image/png";
  const dpi = options.dpi ?? 150;
  const quality = options.quality ?? 0.92;
  const extension = format === "image/png" ? "png" : "jpg";

  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const bytes = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
  const base = file.name.replace(/\.pdf$/i, "");
  // PDF pages are measured in 72-dpi points.
  const scale = dpi / 72;

  const pageBlobs: Blob[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    if (format === "image/jpeg") {
      // JPEG has no alpha; without this, transparent PDF areas render black.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to encode page"))), format, quality);
    });

    pageBlobs.push(blob);
    options.onProgress?.(i, doc.numPages);
  }

  // A one-page PDF shouldn't force the user to unzip anything.
  if (pageBlobs.length === 1) {
    return {
      blob: pageBlobs[0],
      filename: `${base}.${extension}`,
      pageCount: 1,
      zipped: false,
    };
  }

  const zip = new JSZip();
  const pad = String(pageBlobs.length).length;
  pageBlobs.forEach((blob, index) => {
    zip.file(`${base}-page-${String(index + 1).padStart(pad, "0")}.${extension}`, blob);
  });

  return {
    blob: await zip.generateAsync({ type: "blob" }),
    filename: `${base}-images.zip`,
    pageCount: pageBlobs.length,
    zipped: true,
  };
}
