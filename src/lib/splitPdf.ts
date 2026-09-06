import { PDFDocument } from "pdf-lib";

export function parsePageRange(input: string, pageCount: number): number[] {
  const indices = new Set<number>();
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Math.max(1, parseInt(rangeMatch[1], 10));
      const end = Math.min(pageCount, parseInt(rangeMatch[2], 10));
      for (let i = start; i <= end; i++) indices.add(i - 1);
    } else if (/^\d+$/.test(part)) {
      const n = parseInt(part, 10);
      if (n >= 1 && n <= pageCount) indices.add(n - 1);
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

export async function extractPages(file: File, pageIndices: number[]): Promise<{ blob: Blob; filename: string }> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes);
  const output = await PDFDocument.create();
  const copied = await output.copyPages(source, pageIndices);
  copied.forEach((page) => output.addPage(page));

  const pdfBytes = await output.save();
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: file.name.replace(/\.pdf$/i, "-split.pdf"),
  };
}
