// Runs in a dedicated Worker context. Keep this file free of DOM-only APIs
// (no `document`) — only Worker-safe globals: createImageBitmap, OffscreenCanvas.

type ImageMime = "image/jpeg" | "image/png" | "image/webp";

interface WorkerScope {
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
  onmessage: ((event: MessageEvent) => void) | null;
}

const ctx = self as unknown as WorkerScope;

function extensionForMime(mime: ImageMime): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
  }
}

function replaceExtension(filename: string, ext: string): string {
  const base = filename.replace(/\.[^./\\]+$/, "");
  return `${base}.${ext}`;
}

function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm / 25.4) * dpi);
}

const paperSizesMm = {
  A4: { widthMm: 210, heightMm: 297 },
  Letter: { widthMm: 215.9, heightMm: 279.4 },
} as const;

async function loadBitmap(file: File) {
  const bitmap = await createImageBitmap(file);
  return { bitmap, width: bitmap.width, height: bitmap.height };
}

function drawToOffscreen(bitmap: ImageBitmap, width: number, height: number, background?: string) {
  const canvas = new OffscreenCanvas(width, height);
  const c = canvas.getContext("2d");
  if (!c) throw new Error("2D context not supported");
  if (background) {
    c.fillStyle = background;
    c.fillRect(0, 0, width, height);
  }
  c.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

function toBlob(canvas: OffscreenCanvas, mime: ImageMime, quality?: number): Promise<Blob> {
  return canvas.convertToBlob({ type: mime, quality });
}

// ---- resize ----
interface ResizeOptions {
  width?: number;
  height?: number;
  percentage?: number;
  maintainAspectRatio?: boolean;
  mime?: ImageMime;
  quality?: number;
}

async function opResize(file: File, options: ResizeOptions) {
  const { bitmap, width: srcW, height: srcH } = await loadBitmap(file);

  let targetW: number;
  let targetH: number;

  if (options.percentage) {
    targetW = Math.round(srcW * (options.percentage / 100));
    targetH = Math.round(srcH * (options.percentage / 100));
  } else {
    const aspect = srcW / srcH;
    if (options.width && options.height) {
      if (options.maintainAspectRatio) {
        targetW = options.width;
        targetH = Math.round(options.width / aspect);
      } else {
        targetW = options.width;
        targetH = options.height;
      }
    } else if (options.width) {
      targetW = options.width;
      targetH = Math.round(options.width / aspect);
    } else if (options.height) {
      targetH = options.height;
      targetW = Math.round(options.height * aspect);
    } else {
      targetW = srcW;
      targetH = srcH;
    }
  }

  const mime = options.mime ?? (file.type as ImageMime) ?? "image/jpeg";
  const canvas = drawToOffscreen(bitmap, targetW, targetH);
  const blob = await toBlob(canvas, mime, options.quality);
  const filename = replaceExtension(file.name, extensionForMime(mime));

  return { blob, filename, width: targetW, height: targetH };
}

// ---- convert ----
async function opConvert(file: File, mime: ImageMime, quality?: number) {
  const { bitmap, width, height } = await loadBitmap(file);
  const background = mime === "image/jpeg" ? "#ffffff" : undefined;
  const canvas = drawToOffscreen(bitmap, width, height, background);
  const blob = await toBlob(canvas, mime, quality);
  const filename = replaceExtension(file.name, extensionForMime(mime));
  return { blob, filename };
}

// ---- target KB ----
interface TargetKbOptions {
  targetKb: number;
  mime?: ImageMime;
  width?: number;
  height?: number;
}

async function opTargetKb(file: File, options: TargetKbOptions) {
  const mime = options.mime ?? (file.type === "image/png" ? "image/png" : "image/jpeg");
  const { bitmap, width: srcW, height: srcH } = await loadBitmap(file);

  let width = options.width ?? srcW;
  let height = options.height ?? srcH;
  const targetBytes = options.targetKb * 1024;

  let best: Blob | null = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    const canvas = drawToOffscreen(bitmap, width, height, mime === "image/jpeg" ? "#ffffff" : undefined);

    if (mime === "image/png") {
      const blob = await toBlob(canvas, mime);
      best = blob;
      if (blob.size <= targetBytes) break;
    } else {
      let lo = 0.05;
      let hi = 0.95;
      let candidate: Blob | null = null;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const blob = await toBlob(canvas, mime, mid);
        if (blob.size <= targetBytes) {
          candidate = blob;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      if (candidate) {
        best = candidate;
        break;
      }
      const smallestQuality = await toBlob(canvas, mime, 0.05);
      best = smallestQuality;
      if (smallestQuality.size <= targetBytes) break;
    }

    width = Math.round(width * 0.8);
    height = Math.round(height * 0.8);
    if (width < 20 || height < 20) break;
  }

  if (!best) throw new Error("Failed to produce output image");

  const ext = extensionForMime(mime);
  return {
    blob: best,
    filename: replaceExtension(file.name, ext),
    sizeKb: Math.round(best.size / 1024),
    achieved: best.size <= targetBytes,
  };
}

// ---- passport photo ----
interface PassportPhotoOptions {
  widthMm: number;
  heightMm: number;
  dpi?: number;
  background?: string;
  zoom?: number;
}

async function opPassportPhoto(file: File, options: PassportPhotoOptions) {
  const dpi = options.dpi ?? 300;
  const targetW = mmToPx(options.widthMm, dpi);
  const targetH = mmToPx(options.heightMm, dpi);
  const targetAspect = targetW / targetH;
  const zoom = options.zoom ?? 1;

  const { bitmap, width: srcW, height: srcH } = await loadBitmap(file);
  const srcAspect = srcW / srcH;

  let cropW: number;
  let cropH: number;
  if (srcAspect > targetAspect) {
    cropH = srcH / zoom;
    cropW = cropH * targetAspect;
  } else {
    cropW = srcW / zoom;
    cropH = cropW / targetAspect;
  }
  const cropX = (srcW - cropW) / 2;
  const cropY = (srcH - cropH) / 2;

  const canvas = new OffscreenCanvas(targetW, targetH);
  const c = canvas.getContext("2d");
  if (!c) throw new Error("2D context not supported");
  if (options.background) {
    c.fillStyle = options.background;
    c.fillRect(0, 0, targetW, targetH);
  }
  c.drawImage(bitmap, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);

  const blob = await toBlob(canvas, "image/jpeg", 0.95);
  return { blob, filename: "passport-photo.jpg", widthPx: targetW, heightPx: targetH };
}

// ---- print sheet ----
interface PrintSheetOptions {
  paper: keyof typeof paperSizesMm;
  photoWidthMm: number;
  photoHeightMm: number;
  marginMm: number;
  gapMm: number;
  dpi?: number;
}

async function opPrintSheet(file: File, options: PrintSheetOptions) {
  const dpi = options.dpi ?? 300;
  const { bitmap } = await loadBitmap(file);

  const paper = paperSizesMm[options.paper];
  const pageW = mmToPx(paper.widthMm, dpi);
  const pageH = mmToPx(paper.heightMm, dpi);
  const photoW = mmToPx(options.photoWidthMm, dpi);
  const photoH = mmToPx(options.photoHeightMm, dpi);
  const margin = mmToPx(options.marginMm, dpi);
  const gap = mmToPx(options.gapMm, dpi);

  const cols = Math.max(1, Math.floor((pageW - 2 * margin + gap) / (photoW + gap)));
  const rows = Math.max(1, Math.floor((pageH - 2 * margin + gap) / (photoH + gap)));

  const canvas = new OffscreenCanvas(pageW, pageH);
  const c = canvas.getContext("2d");
  if (!c) throw new Error("2D context not supported");
  c.fillStyle = "#ffffff";
  c.fillRect(0, 0, pageW, pageH);

  let copies = 0;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const x = margin + col * (photoW + gap);
      const y = margin + r * (photoH + gap);
      c.drawImage(bitmap, x, y, photoW, photoH);
      c.strokeStyle = "#cccccc";
      c.strokeRect(x, y, photoW, photoH);
      copies++;
    }
  }

  const blob = await toBlob(canvas, "image/jpeg", 0.92);
  return { blob, filename: "print-sheet.jpg", copies };
}

interface IncomingMessage {
  id: number;
  op: string;
  payload: never;
}

ctx.onmessage = async (event: MessageEvent<IncomingMessage>) => {
  const { id, op, payload } = event.data;
  try {
    let result: unknown;
    switch (op) {
      case "resize": {
        const p = payload as unknown as { file: File; options: ResizeOptions };
        result = await opResize(p.file, p.options);
        break;
      }
      case "convert": {
        const p = payload as unknown as { file: File; mime: ImageMime; quality?: number };
        result = await opConvert(p.file, p.mime, p.quality);
        break;
      }
      case "targetKb": {
        const p = payload as unknown as { file: File; options: TargetKbOptions };
        result = await opTargetKb(p.file, p.options);
        break;
      }
      case "passportPhoto": {
        const p = payload as unknown as { file: File; options: PassportPhotoOptions };
        result = await opPassportPhoto(p.file, p.options);
        break;
      }
      case "printSheet": {
        const p = payload as unknown as { file: File; options: PrintSheetOptions };
        result = await opPrintSheet(p.file, p.options);
        break;
      }
      default:
        throw new Error(`Unknown image worker op: ${op}`);
    }
    ctx.postMessage({ id, result });
  } catch (err) {
    ctx.postMessage({ id, error: err instanceof Error ? err.message : String(err) });
  }
};
