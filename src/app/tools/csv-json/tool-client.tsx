"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { csvToJson, jsonToCsv, formatJson, minifyJson } from "@/lib/csvJson";

type Mode = "csv-to-json" | "json-to-csv" | "format-json" | "minify-json";

export default function CsvJsonPage() {
  const [mode, setMode] = useState<Mode>("csv-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    try {
      switch (mode) {
        case "csv-to-json":
          setOutput(csvToJson(input));
          break;
        case "json-to-csv":
          setOutput(jsonToCsv(input));
          break;
        case "format-json":
          setOutput(formatJson(input));
          break;
        case "minify-json":
          setOutput(minifyJson(input));
          break;
      }
    } catch {
      setError("Couldn't parse that input. Check the format and try again.");
      setOutput("");
    }
  }

  function download() {
    const isCsv = mode === "json-to-csv";
    const blob = new Blob([output], { type: isCsv ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isCsv ? "output.csv" : "output.json";
    a.click();
  }

  const modes: { id: Mode; label: string }[] = [
    { id: "csv-to-json", label: "CSV → JSON" },
    { id: "json-to-csv", label: "JSON → CSV" },
    { id: "format-json", label: "Format JSON" },
    { id: "minify-json", label: "Minify JSON" },
  ];

  return (
    <ToolLayout title="CSV / JSON Tools" description="Convert, format, and minify CSV and JSON data — all in your browser.">
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${mode === m.id ? "bg-primary text-primary-foreground" : "border border-border"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Input</span>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
      </label>

      <button onClick={run} disabled={!input.trim()} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50">
        Convert
      </button>

      {error && <p className="text-destructive">{error}</p>}

      {output && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Output</span>
          <textarea readOnly value={output} rows={8} className="rounded-lg border border-border px-3 py-2 font-mono text-sm" />
          <button onClick={download} className="w-fit rounded-full border border-border px-5 py-2 text-sm font-medium">
            Download
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
