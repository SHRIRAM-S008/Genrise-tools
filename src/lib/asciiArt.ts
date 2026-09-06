import { loadImage } from "./imageCore";

const GRADIENT = " .:-=+*#%@";

export async function imageToAscii(file: File, cols = 120): Promise<string> {
  const { bitmap, width, height } = await loadImage(file);
  const aspectCorrection = 0.55;
  const rows = Math.max(1, Math.round((height / width) * cols * aspectCorrection));

  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, cols, rows);

  const { data } = ctx.getImageData(0, 0, cols, rows);
  const lines: string[] = [];

  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const charIndex = Math.min(GRADIENT.length - 1, Math.floor(brightness * (GRADIENT.length - 1)));
      line += GRADIENT[charIndex];
    }
    lines.push(line);
  }

  return lines.join("\n");
}
