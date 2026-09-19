import { loadImage } from "./imageCore";

export const ASCII_RAMPS = {
  standard: " .:-=+*#%@",
  blocks: " ░▒▓█",
  minimal: " .*#",
  detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
} as const;

export type AsciiRamp = keyof typeof ASCII_RAMPS;

export interface AsciiOptions {
  columns?: number;
  ramp?: AsciiRamp;
  /** Light-on-dark terminals want the ramp reversed. */
  invert?: boolean;
  /** Character cell aspect ratio; monospace glyphs are ~0.55 as wide as tall. */
  aspectCorrection?: number;
}

export async function imageToAscii(file: File, options: AsciiOptions = {}): Promise<string> {
  const cols = Math.max(16, Math.min(400, options.columns ?? 120));
  const rampSource = ASCII_RAMPS[options.ramp ?? "standard"];
  const ramp = options.invert ? [...rampSource].reverse().join("") : rampSource;
  const aspectCorrection = options.aspectCorrection ?? 0.55;

  const { bitmap, width, height } = await loadImage(file);
  const rows = Math.max(1, Math.round((height / width) * cols * aspectCorrection));

  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, cols, rows);
  bitmap.close();

  const { data } = ctx.getImageData(0, 0, cols, rows);
  const lines: string[] = [];

  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      const alpha = data[idx + 3] / 255;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Transparent pixels read as background, not as black.
      const brightness = ((0.299 * r + 0.587 * g + 0.114 * b) / 255) * alpha + (1 - alpha);
      const charIndex = Math.min(ramp.length - 1, Math.max(0, Math.floor(brightness * (ramp.length - 1))));
      line += ramp[charIndex];
    }
    lines.push(line);
  }

  return lines.join("\n");
}
