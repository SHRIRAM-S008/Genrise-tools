import { loadImage, canvasToBlob } from "./imageCore";

function drawCaption(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, fontSize: number) {
  ctx.font = `bold ${fontSize}px Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = fontSize / 12;
  ctx.lineJoin = "round";

  const words = text.toUpperCase().split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  lines.forEach((line, i) => {
    const lineY = y + i * fontSize * 1.1;
    ctx.strokeText(line, x, lineY);
    ctx.fillText(line, x, lineY);
  });
}

export async function generateMeme(file: File, topText: string, bottomText: string): Promise<Blob> {
  const { bitmap, width, height } = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const fontSize = Math.max(24, Math.round(width / 12));
  if (topText.trim()) drawCaption(ctx, topText, width / 2, fontSize + 10, width * 0.9, fontSize);
  if (bottomText.trim()) drawCaption(ctx, bottomText, width / 2, height - fontSize * 0.6, width * 0.9, fontSize);

  return canvasToBlob(canvas, "image/png");
}
