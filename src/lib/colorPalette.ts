import { loadImage, drawToCanvas } from "./imageCore";

export interface PaletteColor {
  hex: string;
  rgb: [number, number, number];
  count: number;
}

function toHex(rgb: [number, number, number]): string {
  return "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");
}

export async function extractPalette(file: File, swatchCount = 8): Promise<PaletteColor[]> {
  const { bitmap, width, height } = await loadImage(file);

  const maxDim = 200;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const sampleWidth = Math.max(1, Math.round(width * scale));
  const sampleHeight = Math.max(1, Math.round(height * scale));

  const canvas = drawToCanvas(bitmap, sampleWidth, sampleHeight);
  const ctx = canvas.getContext("2d")!;
  const { data } = ctx.getImageData(0, 0, sampleWidth, sampleHeight);

  const buckets = new Map<string, { sum: [number, number, number]; count: number }>();
  const bucketSize = 24;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 128) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const key = [
      Math.floor(r / bucketSize),
      Math.floor(g / bucketSize),
      Math.floor(b / bucketSize),
    ].join(",");

    const existing = buckets.get(key);
    if (existing) {
      existing.sum[0] += r;
      existing.sum[1] += g;
      existing.sum[2] += b;
      existing.count += 1;
    } else {
      buckets.set(key, { sum: [r, g, b], count: 1 });
    }
  }

  const colors: PaletteColor[] = Array.from(buckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, swatchCount)
    .map(({ sum, count }) => {
      const rgb: [number, number, number] = [
        Math.round(sum[0] / count),
        Math.round(sum[1] / count),
        Math.round(sum[2] / count),
      ];
      return { rgb, hex: toHex(rgb), count };
    });

  return colors;
}
