import { PDFDocument, PDFName, PDFDict, PDFArray, PDFStream, degrees } from "pdf-lib";

interface WorkerScope {
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
  onmessage: ((event: MessageEvent) => void) | null;
}

const ctx = self as unknown as WorkerScope;

function toBlob(bytes: Uint8Array): Blob {
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

// ---- merge ----
async function opMergePdfs(files: File[]) {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  const pdfBytes = await merged.save();
  return { blob: toBlob(pdfBytes), filename: "merged.pdf" };
}

// ---- images to pdf ----
async function opImagesToPdf(files: File[]) {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const isPng = file.type === "image/png";
    const image = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  const pdfBytes = await pdfDoc.save();
  return { blob: toBlob(pdfBytes), filename: "images.pdf" };
}

// ---- page organizer ----
interface PdfPageState {
  originalIndex: number;
  rotation: number;
  deleted: boolean;
}

async function opRebuildPdf(file: File, pages: PdfPageState[]) {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes);
  const output = await PDFDocument.create();

  const active = pages.filter((p) => !p.deleted);
  const copied = await output.copyPages(source, active.map((p) => p.originalIndex));

  copied.forEach((page, i) => {
    const extraRotation = active[i].rotation;
    if (extraRotation) {
      const current = page.getRotation().angle;
      page.setRotation(degrees(current + extraRotation));
    }
    output.addPage(page);
  });

  const pdfBytes = await output.save();
  return { blob: toBlob(pdfBytes), filename: file.name.replace(/\.pdf$/i, "-edited.pdf") };
}

// ---- compress (real image recompression for DCTDecode/JPEG XObjects) ----
interface CompressPdfOptions {
  quality?: number;
  maxWidth?: number;
}

function isDctDecode(filter: unknown): boolean {
  if (filter === PDFName.of("DCTDecode")) return true;
  if (filter instanceof PDFArray) {
    return filter.size() === 1 && filter.lookup(0) === PDFName.of("DCTDecode");
  }
  return false;
}

async function opCompressPdf(file: File, options: CompressPdfOptions) {
  const quality = options.quality ?? 0.6;
  const maxWidth = options.maxWidth ?? 1600;

  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const context = doc.context;

  let imagesCompressed = 0;

  for (const page of doc.getPages()) {
    const resources = page.node.Resources();
    if (!resources) continue;

    const xObjects = resources.lookupMaybe(PDFName.of("XObject"), PDFDict);
    if (!xObjects) continue;

    for (const [name, ref] of xObjects.entries()) {
      try {
        const stream = context.lookup(ref, PDFStream);
        const subtype = stream.dict.get(PDFName.of("Subtype"));
        if (subtype !== PDFName.of("Image")) continue;

        const filter = stream.dict.get(PDFName.of("Filter"));
        if (!isDctDecode(filter)) continue;

        const jpegBytes = stream.getContents();
        const blob = new Blob([new Uint8Array(jpegBytes)], { type: "image/jpeg" });
        const bitmap = await createImageBitmap(blob);

        const scale = Math.min(1, maxWidth / bitmap.width);
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));

        const canvas = new OffscreenCanvas(width, height);
        const c = canvas.getContext("2d");
        if (!c) continue;
        c.drawImage(bitmap, 0, 0, width, height);
        const newBlob = await canvas.convertToBlob({ type: "image/jpeg", quality });
        const newBytes = new Uint8Array(await newBlob.arrayBuffer());

        if (newBytes.byteLength >= jpegBytes.byteLength) continue;

        const newImage = await doc.embedJpg(newBytes);
        xObjects.set(name, newImage.ref);
        imagesCompressed++;
      } catch {
        // Not a recompressible image XObject (form, mask, unsupported filter) — leave untouched.
        continue;
      }
    }
  }

  const pdfBytes = await doc.save({ useObjectStreams: true });
  return {
    blob: toBlob(pdfBytes),
    filename: file.name.replace(/\.pdf$/i, "-compressed.pdf"),
    originalSize: file.size,
    newSize: pdfBytes.byteLength,
    imagesCompressed,
  };
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
      case "mergePdfs": {
        const p = payload as unknown as { files: File[] };
        result = await opMergePdfs(p.files);
        break;
      }
      case "imagesToPdf": {
        const p = payload as unknown as { files: File[] };
        result = await opImagesToPdf(p.files);
        break;
      }
      case "rebuildPdf": {
        const p = payload as unknown as { file: File; pages: PdfPageState[] };
        result = await opRebuildPdf(p.file, p.pages);
        break;
      }
      case "compressPdf": {
        const p = payload as unknown as { file: File; options: CompressPdfOptions };
        result = await opCompressPdf(p.file, p.options);
        break;
      }
      default:
        throw new Error(`Unknown pdf worker op: ${op}`);
    }
    ctx.postMessage({ id, result });
  } catch (err) {
    ctx.postMessage({ id, error: err instanceof Error ? err.message : String(err) });
  }
};
