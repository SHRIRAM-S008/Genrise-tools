import { loadImage, canvasToBlob } from "./imageCore";

function gridSize(count: number): { cols: number; rows: number } {
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  return { cols, rows };
}

export async function createCollage(files: File[], cellSize = 400, gap = 8): Promise<{ blob: Blob; filename: string }> {
  const { cols, rows } = gridSize(files.length);
  const canvas = document.createElement("canvas");
  canvas.width = cols * cellSize + gap * (cols + 1);
  canvas.height = rows * cellSize + gap * (rows + 1);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(files.map((f) => loadImage(f)));

  images.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const dx = gap + col * (cellSize + gap);
    const dy = gap + row * (cellSize + gap);

    const scale = Math.max(cellSize / img.width, cellSize / img.height);
    const sw = cellSize / scale;
    const sh = cellSize / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;

    ctx.drawImage(img.bitmap, sx, sy, sw, sh, dx, dy, cellSize, cellSize);
  });

  const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
  return { blob, filename: "collage.jpg" };
}
