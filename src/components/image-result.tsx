"use client";

import DownloadButton from "@/components/DownloadButton";
import { formatBytes } from "@/lib/imageCore";
import { useObjectUrl } from "@/lib/useObjectUrl";

interface ImageResultProps {
  blob: Blob;
  filename: string;
  /** Size of the input file, to show the before → after saving. */
  originalSize?: number;
  dimensions?: { width: number; height: number };
  note?: string;
  children?: React.ReactNode;
}

/** Result card with a visual preview, so nobody has to download blind. */
export function ImageResult({ blob, filename, originalSize, dimensions, note, children }: ImageResultProps) {
  const url = useObjectUrl(blob);
  const delta =
    originalSize && originalSize > 0 ? Math.round(((originalSize - blob.size) / originalSize) * 100) : null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border p-5">
      {url && (
        <div
          className="flex max-h-80 justify-center overflow-hidden rounded-lg border border-border"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Result preview" className="max-h-80 w-auto object-contain" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {originalSize !== undefined ? (
          <span>
            {formatBytes(originalSize)} → <span className="text-foreground">{formatBytes(blob.size)}</span>
            {delta !== null && delta > 0 ? ` (${delta}% smaller)` : ""}
          </span>
        ) : (
          <span>{formatBytes(blob.size)}</span>
        )}
        {dimensions && (
          <span>
            {dimensions.width} × {dimensions.height}px
          </span>
        )}
        {note && <span>{note}</span>}
      </div>

      {children}

      <DownloadButton blob={blob} filename={filename} />
    </div>
  );
}
