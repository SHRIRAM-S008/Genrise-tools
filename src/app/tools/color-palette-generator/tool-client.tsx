"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Copy, Check } from "lucide-react";
import { extractPalette, type PaletteColor } from "@/lib/colorPalette";

export default function ColorPaletteGeneratorPage() {
  const [busy, setBusy] = useState(false);
  const [colors, setColors] = useState<PaletteColor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setColors(null);
    try {
      const palette = await extractPalette(file);
      setColors(palette);
    } catch {
      setError("Couldn't read this image. Try a different file.");
    } finally {
      setBusy(false);
    }
  }

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  }

  function copyAll(asCssVars: boolean) {
    if (!colors) return;
    const text = asCssVars
      ? colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")
      : colors.map((c) => c.hex).join(", ");
    navigator.clipboard.writeText(asCssVars ? `:root {\n${text}\n}` : text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  return (
    <ToolLayout title="Color Palette Generator" description="Extract a color palette from any image.">
      <FileDropzone
        accept="image/*"
        onFiles={(files) => handleFile(files[0])}
        label={busy ? "Analyzing…" : "Click or drop an image here"}
      />

      {error && <p className="text-destructive">{error}</p>}

      {colors && colors.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => copyHex(c.hex)}
                className="flex flex-col overflow-hidden rounded-lg border border-border text-left"
              >
                <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
                <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                  <span className="font-mono text-xs">{c.hex}</span>
                  {copiedHex === c.hex ? (
                    <Check className="size-3.5 text-primary" />
                  ) : (
                    <Copy className="size-3.5 text-muted-foreground" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copyAll(false)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
            >
              {copiedAll ? "Copied!" : "Copy all hex codes"}
            </button>
            <button
              onClick={() => copyAll(true)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary/40"
            >
              Copy as CSS variables
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
