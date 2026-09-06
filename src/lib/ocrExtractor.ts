export interface OcrProgress {
  status: string;
  progress: number;
}

async function renderPdfPagesToCanvases(file: File): Promise<HTMLCanvasElement[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const bytes = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: bytes }).promise;

  const canvases: HTMLCanvasElement[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    canvases.push(canvas);
  }
  return canvases;
}

export async function extractText(
  file: File,
  onProgress?: (p: OcrProgress) => void
): Promise<string> {
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker("eng", 1, {
    logger: (m) => onProgress?.({ status: m.status, progress: m.progress }),
  });

  try {
    if (file.type === "application/pdf") {
      const canvases = await renderPdfPagesToCanvases(file);
      const texts: string[] = [];
      for (let i = 0; i < canvases.length; i++) {
        const { data } = await worker.recognize(canvases[i]);
        texts.push(`--- Page ${i + 1} ---\n${data.text.trim()}`);
      }
      return texts.join("\n\n");
    }

    const { data } = await worker.recognize(file);
    return data.text.trim();
  } finally {
    await worker.terminate();
  }
}
