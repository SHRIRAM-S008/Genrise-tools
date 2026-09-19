export interface OcrProgress {
  status: string;
  progress: number;
}

/** Tesseract traineddata codes, downloaded on demand at first use. */
export const OCR_LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "por", label: "Portuguese" },
  { code: "ita", label: "Italian" },
  { code: "nld", label: "Dutch" },
  { code: "hin", label: "Hindi" },
  { code: "ara", label: "Arabic" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "jpn", label: "Japanese" },
  { code: "kor", label: "Korean" },
  { code: "rus", label: "Russian" },
] as const;

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
  onProgress?: (p: OcrProgress) => void,
  language = "eng"
): Promise<string> {
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker(language, 1, {
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
