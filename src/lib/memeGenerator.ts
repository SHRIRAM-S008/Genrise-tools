import { loadImage, canvasToBlob } from "./imageCore";
import type { ImageMime } from "./types";

export interface MemeOptions {
  /** Caption height as a share of image width; 12 ≈ classic Impact size. */
  fontScale?: number;
  fontFamily?: string;
  color?: string;
  strokeColor?: string;
  uppercase?: boolean;
  format?: ImageMime;
}

function drawCaption(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  options: Required<Pick<MemeOptions, "fontFamily" | "color" | "strokeColor" | "uppercase">>,
  anchor: "top" | "bottom"
) {
  ctx.font = `bold ${fontSize}px ${options.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = options.color;
  ctx.strokeStyle = options.strokeColor;
  ctx.lineWidth = Math.max(1, fontSize / 12);
  ctx.lineJoin = "round";

  const source = options.uppercase ? text.toUpperCase() : text;
  const lines: string[] = [];
  for (const paragraph of source.split("\n")) {
    let current = "";
    for (const word of paragraph.split(" ")) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    lines.push(current);
  }

  const lineHeight = fontSize * 1.1;
  // Bottom captions grow upwards so the last line sits on the baseline.
  const startY = anchor === "top" ? y : y - (lines.length - 1) * lineHeight;

  lines.forEach((line, i) => {
    const lineY = startY + i * lineHeight;
    ctx.strokeText(line, x, lineY);
    ctx.fillText(line, x, lineY);
  });
}

export async function generateMeme(
  file: File,
  topText: string,
  bottomText: string,
  options: MemeOptions = {}
): Promise<Blob> {
  const { bitmap, width, height } = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const style = {
    fontFamily: options.fontFamily ?? "Impact, 'Arial Black', sans-serif",
    color: options.color ?? "#ffffff",
    strokeColor: options.strokeColor ?? "#000000",
    uppercase: options.uppercase ?? true,
  };

  const fontSize = Math.max(18, Math.round(width / (options.fontScale ?? 12)));
  if (topText.trim()) {
    drawCaption(ctx, topText, width / 2, fontSize + 10, width * 0.9, fontSize, style, "top");
  }
  if (bottomText.trim()) {
    drawCaption(ctx, bottomText, width / 2, height - fontSize * 0.4, width * 0.9, fontSize, style, "bottom");
  }

  return canvasToBlob(canvas, options.format ?? "image/jpeg", 0.92);
}
