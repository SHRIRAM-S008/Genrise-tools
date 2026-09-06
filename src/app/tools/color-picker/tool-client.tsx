"use client";

import { useEffect, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";

interface Picked {
  hex: string;
  rgb: string;
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, "0");
}

export default function ColorPickerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [current, setCurrent] = useState<Picked | null>(null);
  const [history, setHistory] = useState<Picked[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const maxWidth = 640;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [file]);

  function pick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const picked = { hex, rgb };
    setCurrent(picked);
    setHistory((prev) => [picked, ...prev].slice(0, 12));
  }

  return (
    <ToolLayout title="Color Picker from Image" description="Upload an image and pick exact pixel colors with hex codes.">
      <FileDropzone accept="image/*" onFiles={(files) => setFile(files[0])} label={file ? file.name : "Click or drop an image here"} />

      {file && (
        <canvas
          ref={canvasRef}
          onClick={pick}
          className="max-w-full cursor-crosshair rounded-lg border border-border"
        />
      )}

      {current && (
        <div className="flex items-center gap-4 rounded-2xl border border-border p-5">
          <div className="size-12 shrink-0 rounded-lg border border-border" style={{ backgroundColor: current.hex }} />
          <div className="flex flex-col gap-1 text-sm">
            <button onClick={() => navigator.clipboard.writeText(current.hex)} className="font-mono hover:text-primary">
              {current.hex}
            </button>
            <button onClick={() => navigator.clipboard.writeText(current.rgb)} className="font-mono text-muted-foreground hover:text-primary">
              {current.rgb}
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {history.map((c, i) => (
            <button
              key={i}
              onClick={() => navigator.clipboard.writeText(c.hex)}
              title={c.hex}
              className="size-8 rounded-full border border-border"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
