"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import DownloadButton from "@/components/DownloadButton";
import { generateMeme } from "@/lib/memeGenerator";

export default function MemeGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await generateMeme(file, topText, bottomText);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch {
      setError("Couldn't generate this meme.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="Meme Generator" description="Add top and bottom captions to an image and download your meme.">
      <FileDropzone
        accept="image/*"
        onFiles={(files) => {
          setFile(files[0]);
          setResult(null);
        }}
        label={file ? file.name : "Click or drop an image here"}
      />

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Top text</span>
        <input value={topText} onChange={(e) => setTopText(e.target.value)} className="rounded-lg border border-border px-3 py-2" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Bottom text</span>
        <input value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="rounded-lg border border-border px-3 py-2" />
      </label>

      {file && (
        <button
          onClick={run}
          disabled={busy}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Generating…" : "Generate Meme"}
        </button>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-border p-5">
          <img src={result.url} alt="Generated meme" className="max-w-full rounded-lg" />
          <DownloadButton blob={result.blob} filename="meme.png" />
        </div>
      )}
    </ToolLayout>
  );
}
