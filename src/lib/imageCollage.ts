import { loadImage, canvasToBlob } from "./imageCore";

export interface CollageOptions {
  /** 0 = auto (closest to square). */
  columns?: number;
  cellSize?: number;
  gap?: number;
  background?: string;
  /** "cover" crops to fill each cell, "contain" fits the whole image in. */
  fit?: "cover" | "contain";
  rounded?: number;
}

function gridSize(count: number, columns?: number): { cols: number; rows: number } {
  const cols = columns && columns > 0 ? Math.min(columns, count) : Math.ceil(Math.sqrt(count));
  return { cols, rows: Math.ceil(count / cols) };
}

export async function createCollage(
  files: File[],
  options: CollageOptions = {}
): Promise<{ blob: Blob; filename: string }> {
  const cellSize = options.cellSize ?? 400;
  const gap = options.gap ?? 8;
  const background = options.background ?? "#ffffff";
  const fit = options.fit ?? "cover";
  const rounded = options.rounded ?? 0;

  const { cols, rows } = gridSize(files.length, options.columns);
  const canvas = document.createElement("canvas");
  canvas.width = cols * cellSize + gap * (cols + 1);
  canvas.height = rows * cellSize + gap * (rows + 1);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(files.map((f) => loadImage(f)));

  images.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const dx = gap + col * (cellSize + gap);
    const dy = gap + row * (cellSize + gap);

    ctx.save();
    if (rounded > 0) {
      ctx.beginPath();
      ctx.roundRect(dx, dy, cellSize, cellSize, rounded);
      ctx.clip();
    }

    if (fit === "contain") {
      const scale = Math.min(cellSize / img.width, cellSize / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img.bitmap, dx + (cellSize - w) / 2, dy + (cellSize - h) / 2, w, h);
    } else {
      const scale = Math.max(cellSize / img.width, cellSize / img.height);
      const sw = cellSize / scale;
      const sh = cellSize / scale;
      ctx.drawImage(
        img.bitmap,
        (img.width - sw) / 2,
        (img.height - sh) / 2,
        sw,
        sh,
        dx,
        dy,
        cellSize,
        cellSize
      );
    }
    ctx.restore();
    img.bitmap.close();
  });

  const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
  return { blob, filename: "collage.jpg" };
}
