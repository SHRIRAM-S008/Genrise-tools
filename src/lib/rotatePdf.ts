import { PDFDocument, degrees } from "pdf-lib";

export async function rotateAllPages(file: File, angle: 90 | 180 | 270): Promise<{ blob: Blob; filename: string }> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);

  for (const page of doc.getPages()) {
    const current = page.getRotation().angle;
    page.setRotation(degrees(current + angle));
  }

  const pdfBytes = await doc.save();
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: file.name.replace(/\.pdf$/i, "-rotated.pdf"),
  };
}
