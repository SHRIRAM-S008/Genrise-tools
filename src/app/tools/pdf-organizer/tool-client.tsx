"use client";

import { useEffect, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { ChevronLeft, ChevronRight, RotateCw, Trash2, Undo2 } from "lucide-react";
import { getPageCount, rebuildPdf, type PdfPageState } from "@/lib/pdfOrganizer";
import { renderPdfThumbnails } from "@/lib/pdfThumbnails";

const MAX_THUMBNAILS = 60;

export default function PdfOrganizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageState[]>([]);
  const [thumbnails, setThumbnails] = useState<Map<number, string>>(new Map());
  const [rendering, setRendering] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Object URLs for the thumbnails live as long as the loaded document does.
  useEffect(() => {
    return () => {
      thumbnails.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [thumbnails]);

  async function load(selected: File) {
    setFile(selected);
    setResult(null);
    setError(null);
    setThumbnails(new Map());

    try {
      const count = await getPageCount(selected);
      setPages(Array.from({ length: count }, (_, i) => ({ originalIndex: i, rotation: 0, deleted: false })));
    } catch {
      setError("Couldn't read that PDF. Make sure it isn't password protected.");
      return;
    }

    setRendering("Rendering page previews…");
    try {
      const rendered = await renderPdfThumbnails(selected, {
        maxPages: MAX_THUMBNAILS,
        onProgress: (page, total) => setRendering(`Rendering previews… ${page}/${total}`),
      });
      setThumbnails(new Map(rendered.map((t) => [t.pageIndex, URL.createObjectURL(t.blob)])));
    } catch {
      // Previews are a nicety — the page list still works without them.
    } finally {
      setRendering(null);
    }
  }

  function move(index: number, target: number) {
    if (target < 0 || target >= pages.length) return;
    setPages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
    setResult(null);
  }

  function update(index: number, patch: Partial<PdfPageState>) {
    setPages((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
    setResult(null);
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setResult(await rebuildPdf(file, pages));
    } catch {
      setError("Couldn't rebuild the PDF.");
    } finally {
      setBusy(false);
    }
  }

  const keptCount = pages.filter((p) => !p.deleted).length;

  return (
    <ToolLayout title="PDF Page Organizer" description="Reorder, rotate, or delete pages visually, then export a new PDF.">
      <FileDropzone accept="application/pdf" onFiles={(files) => load(files[0])} label={file ? file.name : "Click or drop a PDF here"} />

      {rendering && <p className="text-sm text-muted-foreground">{rendering}</p>}

      {pages.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {keptCount} of {pages.length} page(s) kept · drag a page to reorder it
            {pages.length > MAX_THUMBNAILS ? ` · previews shown for the first ${MAX_THUMBNAILS} pages` : ""}
          </p>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {pages.map((page, i) => {
              const thumbnail = thumbnails.get(page.originalIndex);
              return (
                <li
                  key={`${page.originalIndex}-${i}`}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null && dragIndex !== i) move(dragIndex, i);
                    setDragIndex(null);
                  }}
                  onDragEnd={() => setDragIndex(null)}
                  className={`flex cursor-grab flex-col gap-2 rounded-xl border p-2 transition-colors active:cursor-grabbing ${
                    page.deleted ? "border-destructive/40 bg-destructive/5" : "border-border"
                  } ${dragIndex === i ? "opacity-50" : ""}`}
                >
                  <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-accent/30">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt={`Page ${page.originalIndex + 1}`}
                        className={`max-h-full max-w-full object-contain transition-transform ${page.deleted ? "opacity-30" : ""}`}
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">Page {page.originalIndex + 1}</span>
                    )}
                    <span className="absolute left-1 top-1 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium">
                      {page.originalIndex + 1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex gap-1">
                      <button
                        aria-label={`Move page ${page.originalIndex + 1} earlier`}
                        onClick={() => move(i, i - 1)}
                        disabled={i === 0}
                        className="text-muted-foreground hover:text-primary disabled:opacity-30"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        aria-label={`Move page ${page.originalIndex + 1} later`}
                        onClick={() => move(i, i + 1)}
                        disabled={i === pages.length - 1}
                        className="text-muted-foreground hover:text-primary disabled:opacity-30"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </span>
                    <span className="flex gap-2">
                      <button
                        aria-label={`Rotate page ${page.originalIndex + 1}`}
                        onClick={() => update(i, { rotation: (page.rotation + 90) % 360 })}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <RotateCw className="size-4" />
                      </button>
                      <button
                        aria-label={`${page.deleted ? "Restore" : "Delete"} page ${page.originalIndex + 1}`}
                        onClick={() => update(i, { deleted: !page.deleted })}
                        className={page.deleted ? "text-primary" : "text-muted-foreground hover:text-destructive"}
                      >
                        {page.deleted ? <Undo2 className="size-4" /> : <Trash2 className="size-4" />}
                      </button>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          <button
            onClick={run}
            disabled={busy || keptCount === 0}
            className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Rebuilding…" : `Export ${keptCount} page PDF`}
          </button>
          {keptCount === 0 && <p className="text-sm text-muted-foreground">Keep at least one page to export.</p>}
        </>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
