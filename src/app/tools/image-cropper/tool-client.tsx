"use client";

import { useMemo, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { cropImage, type CropRect } from "@/lib/imageCropper";

export default function ImageCropperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [box, setBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const startRef = useRef({ x: 0, y: 0 });

  const imageUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  function onImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setDisplaySize({ width: img.clientWidth, height: img.clientHeight });
    setBox({ x: img.clientWidth * 0.1, y: img.clientHeight * 0.1, width: img.clientWidth * 0.8, height: img.clientHeight * 0.8 });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    startRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setBox({ x: startRef.current.x, y: startRef.current.y, width: 0, height: 0 });
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const x = Math.min(startRef.current.x, curX);
    const y = Math.min(startRef.current.y, curY);
    const width = Math.abs(curX - startRef.current.x);
    const height = Math.abs(curY - startRef.current.y);
    setBox({ x, y, width, height });
  }

  function onPointerUp() {
    setDragging(false);
  }

  async function run() {
    if (!file || !displaySize.width) return;
    const scaleX = naturalSize.width / displaySize.width;
    const scaleY = naturalSize.height / displaySize.height;
    const rect: CropRect = {
      x: box.x * scaleX,
      y: box.y * scaleY,
      width: box.width * scaleX,
      height: box.height * scaleY,
    };
    if (rect.width < 1 || rect.height < 1) return;
    const output = await cropImage(file, rect);
    setResult(output);
  }

  return (
    <ToolLayout title="Image Cropper" description="Crop images to any dimension right in your browser.">
      <FileDropzone
        accept="image/*"
        onFiles={(files) => {
          setFile(files[0]);
          setResult(null);
        }}
        label={file ? file.name : "Click or drop an image here"}
      />

      {imageUrl && (
        <div
          className="relative w-fit cursor-crosshair select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={imageUrl} alt="To crop" onLoad={onImageLoad} className="max-h-[28rem] max-w-full rounded-lg" draggable={false} />
          {box.width > 0 && (
            <div
              className="pointer-events-none absolute border-2 border-primary bg-primary/10"
              style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
            />
          )}
        </div>
      )}

      {imageUrl && (
        <p className="text-sm text-muted-foreground">Drag on the image to draw a crop box, then click Crop.</p>
      )}

      {file && (
        <button
          onClick={run}
          disabled={box.width < 1}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          Crop
        </button>
      )}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
