"use client";

import { useEffect, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { CopyButton } from "@/components/copy-button";
import { Download } from "lucide-react";
import { imageToAscii, type AsciiRamp } from "@/lib/asciiArt";

const RAMPS: { id: AsciiRamp; label: string }[] = [
  { id: "standard", label: "Standard" },
  { id: "detailed", label: "Detailed" },
  { id: "blocks", label: "Blocks" },
  { id: "minimal", label: "Minimal" },
];

export default function AsciiArtGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState(120);
  const [ramp, setRamp] = useState<AsciiRamp>("standard");
  const [invert, setInvert] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ascii, setAscii] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Re-render whenever a setting changes, so the controls feel live.
  useEffect(() => {
    if (!file) return;
    let cancelled = false;

    const id = window.setTimeout(async () => {
      setBusy(true);
      try {
        const result = await imageToAscii(file, { columns, ramp, invert });
        if (!cancelled) {
          setAscii(result);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Couldn't process this image.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 150);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [file, columns, ramp, invert]);

  function download() {
    if (!ascii) return;
    const blob = new Blob([ascii], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ascii-art.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout title="ASCII Art Generator" description="Turn any image into text-based ASCII art — tune the width, character set and contrast.">
      <FileDropzone
        accept="image/*"
        onFiles={(files) => setFile(files[0])}
        label={file ? file.name : "Click or drop an image here"}
      />

      {file && (
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Width: {columns} chars</span>
            <input type="range" min={40} max={300} step={10} value={columns} onChange={(e) => setColumns(Number(e.target.value))} className="w-44" />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Character set</span>
            <select value={ramp} onChange={(e) => setRamp(e.target.value as AsciiRamp)} className="rounded-lg border border-border px-3 py-2">
              {RAMPS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} />
            Invert (for dark backgrounds)
          </label>
        </div>
      )}

      {busy && <p className="text-muted-foreground">Converting…</p>}
      {error && <p className="text-destructive">{error}</p>}

      {ascii && (
        <div className="rounded-2xl border border-border p-5">
          <pre className="overflow-x-auto text-[6px] leading-[6px] sm:text-[7px] sm:leading-[7px]">{ascii}</pre>
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton value={ascii} label="Copy" />
            <button onClick={download} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
              <Download className="size-4" />
              Download .txt
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
