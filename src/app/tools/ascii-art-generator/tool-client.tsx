"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { imageToAscii } from "@/lib/asciiArt";

export default function AsciiArtGeneratorPage() {
  const [busy, setBusy] = useState(false);
  const [ascii, setAscii] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    setAscii(null);
    try {
      const result = await imageToAscii(file);
      setAscii(result);
    } catch {
      setError("Couldn't process this image.");
    } finally {
      setBusy(false);
    }
  }

  function copy() {
    if (!ascii) return;
    navigator.clipboard.writeText(ascii);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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
    <ToolLayout title="ASCII Art Generator" description="Turn any image into text-based ASCII art.">
      <FileDropzone accept="image/*" onFiles={handleFiles} label="Click or drop an image here" />

      {busy && <p className="text-muted-foreground">Converting…</p>}
      {error && <p className="text-destructive">{error}</p>}

      {ascii && (
        <div className="rounded-2xl border border-border p-5">
          <pre className="overflow-x-auto text-[6px] leading-[6px] sm:text-[7px] sm:leading-[7px]">{ascii}</pre>
          <div className="mt-4 flex gap-3">
            <button onClick={copy} className="w-fit rounded-full border border-border px-6 py-3 font-medium">
              {copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={download} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
              Download .txt
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
