"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { ImageResult } from "@/components/image-result";
import { cropImage, type CropRect } from "@/lib/imageCropper";
import { useObjectUrl } from "@/lib/useObjectUrl";

type Handle = "nw" | "ne" | "sw" | "se" | "move" | "new";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ASPECTS: { id: string; label: string; ratio: number | null }[] = [
  { id: "free", label: "Free", ratio: null },
  { id: "1:1", label: "1:1", ratio: 1 },
  { id: "4:3", label: "4:3", ratio: 4 / 3 },
  { id: "3:4", label: "3:4", ratio: 3 / 4 },
  { id: "16:9", label: "16:9", ratio: 16 / 9 },
  { id: "9:16", label: "9:16", ratio: 9 / 16 },
];

const MIN_SIZE = 16;

export default function ImageCropperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [display, setDisplay] = useState({ width: 0, height: 0 });
  const [box, setBox] = useState<Box>({ x: 0, y: 0, width: 0, height: 0 });
  const [aspect, setAspect] = useState<string>("free");
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [cropSize, setCropSize] = useState<{ width: number; height: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ handle: Handle; startX: number; startY: number; origin: Box } | null>(null);

  const imageUrl = useObjectUrl(file);
  const ratio = ASPECTS.find((a) => a.id === aspect)?.ratio ?? null;

  const measure = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.clientWidth) return;
    setDisplay((prev) => {
      if (prev.width === img.clientWidth && prev.height === img.clientHeight) return prev;
      // Keep the selection in the same *relative* spot when the layout changes.
      if (prev.width > 0) {
        const scaleX = img.clientWidth / prev.width;
        const scaleY = img.clientHeight / prev.height;
        setBox((b) => ({ x: b.x * scaleX, y: b.y * scaleY, width: b.width * scaleX, height: b.height * scaleY }));
      }
      return { width: img.clientWidth, height: img.clientHeight };
    });
  }, []);

  // The displayed size drives the pixel mapping, so track it across window
  // resizes and device rotation rather than measuring once on load.
  useEffect(() => {
    if (!imageUrl) return;
    const observer = new ResizeObserver(measure);
    const img = imgRef.current;
    if (img) observer.observe(img);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [imageUrl, measure]);

  function applyRatio(next: Box, anchorRight = false, anchorBottom = false): Box {
    if (!ratio) return next;
    const width = Math.max(MIN_SIZE, next.width);
    const height = width / ratio;
    return {
      x: anchorRight ? next.x + next.width - width : next.x,
      y: anchorBottom ? next.y + next.height - height : next.y,
      width,
      height,
    };
  }

  function clamp(next: Box): Box {
    const width = Math.min(next.width, display.width);
    const height = Math.min(next.height, display.height);
    return {
      width,
      height,
      x: Math.min(Math.max(0, next.x), display.width - width),
      y: Math.min(Math.max(0, next.y), display.height - height),
    };
  }

  function onImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    setNatural({ width: img.naturalWidth, height: img.naturalHeight });
    setDisplay({ width: img.clientWidth, height: img.clientHeight });
    const initial = {
      x: img.clientWidth * 0.1,
      y: img.clientHeight * 0.1,
      width: img.clientWidth * 0.8,
      height: img.clientHeight * 0.8,
    };
    setBox(ratio ? clampToArea(applyRatio(initial), img.clientWidth, img.clientHeight) : initial);
  }

  function clampToArea(next: Box, areaW: number, areaH: number): Box {
    const width = Math.min(next.width, areaW);
    const height = Math.min(next.height, areaH);
    return {
      width,
      height,
      x: Math.min(Math.max(0, next.x), areaW - width),
      y: Math.min(Math.max(0, next.y), areaH - height),
    };
  }

  /** Always measured against the image box, whichever element was grabbed. */
  function pointerPosition(e: React.PointerEvent<HTMLElement>) {
    const rect = (containerRef.current ?? e.currentTarget).getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDrag(e: React.PointerEvent<HTMLElement>, handle: Handle) {
    e.preventDefault();
    e.stopPropagation();
    containerRef.current?.setPointerCapture(e.pointerId);
    const { x, y } = pointerPosition(e);
    dragRef.current = { handle, startX: x, startY: y, origin: box };
    if (handle === "new") setBox({ x, y, width: 0, height: 0 });
  }

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const { x, y } = pointerPosition(e);
    const dx = x - drag.startX;
    const dy = y - drag.startY;
    const o = drag.origin;

    if (drag.handle === "move") {
      setBox(clamp({ ...o, x: o.x + dx, y: o.y + dy }));
      return;
    }

    if (drag.handle === "new") {
      const rect = {
        x: Math.min(drag.startX, x),
        y: Math.min(drag.startY, y),
        width: Math.abs(x - drag.startX),
        height: Math.abs(y - drag.startY),
      };
      setBox(clamp(ratio ? applyRatio(rect) : rect));
      return;
    }

    const east = drag.handle === "ne" || drag.handle === "se";
    const south = drag.handle === "se" || drag.handle === "sw";
    const width = Math.max(MIN_SIZE, east ? o.width + dx : o.width - dx);
    const height = Math.max(MIN_SIZE, south ? o.height + dy : o.height - dy);
    const next = {
      x: east ? o.x : o.x + (o.width - width),
      y: south ? o.y : o.y + (o.height - height),
      width,
      height,
    };
    setBox(clamp(ratio ? applyRatio(next, !east, !south) : next));
  }

  function endDrag() {
    dragRef.current = null;
  }

  function changeAspect(id: string) {
    setAspect(id);
    const next = ASPECTS.find((a) => a.id === id)?.ratio ?? null;
    if (!next || !display.width) return;
    const width = Math.min(box.width, display.width);
    setBox(clamp({ ...box, width, height: width / next }));
  }

  async function run() {
    if (!file || !display.width || box.width < 1 || box.height < 1) return;
    setError(null);
    setBusy(true);
    const scaleX = natural.width / display.width;
    const scaleY = natural.height / display.height;
    const rect: CropRect = {
      x: box.x * scaleX,
      y: box.y * scaleY,
      width: box.width * scaleX,
      height: box.height * scaleY,
    };
    try {
      setResult(await cropImage(file, rect));
      setCropSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    } catch {
      setError("Couldn't crop that image. Try a different file.");
    } finally {
      setBusy(false);
    }
  }

  const handleClass =
    "absolute size-4 rounded-full border-2 border-primary bg-background shadow-sm touch-none";

  return (
    <ToolLayout title="Image Cropper" description="Crop images to any dimension or a fixed aspect ratio, right in your browser.">
      <FileDropzone
        accept="image/*"
        onFiles={(files) => {
          setFile(files[0]);
          setResult(null);
          setError(null);
        }}
        label={file ? file.name : "Click or drop an image here"}
      />

      {imageUrl && (
        <>
          <div className="flex flex-wrap gap-2">
            {ASPECTS.map((a) => (
              <button
                key={a.id}
                onClick={() => changeAspect(a.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  aspect === a.id ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div
            ref={containerRef}
            className="relative w-fit touch-none select-none overflow-hidden rounded-lg"
            onPointerDown={(e) => startDrag(e, "new")}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageUrl}
              alt="To crop"
              onLoad={onImageLoad}
              className="max-h-[28rem] max-w-full rounded-lg"
              draggable={false}
            />

            {box.width > 0 && (
              <>
                <div
                  className="absolute cursor-move border-2 border-primary"
                  style={{
                    left: box.x,
                    top: box.y,
                    width: box.width,
                    height: box.height,
                    // Darkens everything outside the selection in one go.
                    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)",
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.3) 1px, transparent 1px)",
                    backgroundSize: `${box.width / 3}px ${box.height / 3}px`,
                  }}
                  onPointerDown={(e) => startDrag(e, "move")}
                >
                  <span className={`${handleClass} -left-2 -top-2 cursor-nwse-resize`} onPointerDown={(e) => startDrag(e, "nw")} />
                  <span className={`${handleClass} -right-2 -top-2 cursor-nesw-resize`} onPointerDown={(e) => startDrag(e, "ne")} />
                  <span className={`${handleClass} -bottom-2 -left-2 cursor-nesw-resize`} onPointerDown={(e) => startDrag(e, "sw")} />
                  <span className={`${handleClass} -bottom-2 -right-2 cursor-nwse-resize`} onPointerDown={(e) => startDrag(e, "se")} />
                </div>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Drag inside the box to move it, the corners to resize, or anywhere on the image to draw a new
            selection
            {display.width > 0 && box.width > 0
              ? ` · crop: ${Math.round((box.width * natural.width) / display.width)} × ${Math.round(
                  (box.height * natural.height) / display.height
                )}px`
              : ""}
          </p>
        </>
      )}

      {file && (
        <button
          onClick={run}
          disabled={box.width < 1 || busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Cropping…" : "Crop"}
        </button>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && <ImageResult blob={result.blob} filename={result.filename} dimensions={cropSize ?? undefined} />}
    </ToolLayout>
  );
}
