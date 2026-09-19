import JSZip from "jszip";

export interface BatchItem<T> {
  id: string;
  file: File;
  status: "queued" | "working" | "done" | "error";
  result?: T;
  error?: string;
}

export function toBatchItems<T>(files: File[], startIndex = 0): BatchItem<T>[] {
  return files.map((file, i) => ({
    id: `${startIndex + i}-${file.name}-${file.lastModified}`,
    file,
    status: "queued",
  }));
}

/**
 * Runs `work` over every queued item one at a time — sequential on purpose,
 * since each job already saturates a worker and parallel canvas encodes are
 * what make mobile browsers drop the tab.
 */
export async function runBatch<T>(
  items: BatchItem<T>[],
  work: (file: File) => Promise<T>,
  onUpdate: (item: BatchItem<T>) => void
): Promise<void> {
  for (const item of items) {
    onUpdate({ ...item, status: "working" });
    try {
      const result = await work(item.file);
      onUpdate({ ...item, status: "done", result });
    } catch (err) {
      onUpdate({
        ...item,
        status: "error",
        error: err instanceof Error && err.message ? err.message : "Couldn't process this file",
      });
    }
  }
}

/** Bundles finished results, de-duplicating names like "photo (2).jpg". */
export async function zipResults(
  entries: { blob: Blob; filename: string }[],
  zipName: string
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();
  const used = new Map<string, number>();

  for (const entry of entries) {
    const seen = used.get(entry.filename) ?? 0;
    used.set(entry.filename, seen + 1);
    const name = seen === 0 ? entry.filename : addSuffix(entry.filename, seen + 1);
    zip.file(name, entry.blob);
  }

  return { blob: await zip.generateAsync({ type: "blob" }), filename: zipName };
}

function addSuffix(filename: string, n: number): string {
  const dot = filename.lastIndexOf(".");
  if (dot <= 0) return `${filename} (${n})`;
  return `${filename.slice(0, dot)} (${n})${filename.slice(dot)}`;
}
