import JSZip from "jszip";

export async function renderPdfToImages(file: File, scale = 2): Promise<{ blob: Blob; filename: string }> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const bytes = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: bytes }).promise;

  const zip = new JSZip();

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to encode page"))), "image/png");
    });

    zip.file(`page-${String(i).padStart(2, "0")}.png`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return { blob: zipBlob, filename: file.name.replace(/\.pdf$/i, "-images.zip") };
}
