import { PDFDocument } from "pdf-lib";

export interface FileInfoResult {
  name: string;
  type: string;
  sizeBytes: number;
  lastModified: string;
  width?: number;
  height?: number;
  pageCount?: number;
}

export async function inspectFile(file: File): Promise<FileInfoResult> {
  const base: FileInfoResult = {
    name: file.name,
    type: file.type || "unknown",
    sizeBytes: file.size,
    lastModified: new Date(file.lastModified).toLocaleString(),
  };

  if (file.type.startsWith("image/")) {
    try {
      const bitmap = await createImageBitmap(file);
      base.width = bitmap.width;
      base.height = bitmap.height;
    } catch {
      // unsupported image type for decoding; skip dimensions
    }
  }

  if (file.type === "application/pdf") {
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      base.pageCount = doc.getPageCount();
    } catch {
      // encrypted or malformed PDF; skip page count
    }
  }

  return base;
}
