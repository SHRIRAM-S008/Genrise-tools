"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Zap, ArrowRight } from "lucide-react";
import { getToolSample, type ImageArt, type ToolSample } from "@/lib/tool-samples";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface ToolSampleProps {
  slug: string;
}

export function ToolSample({ slug }: ToolSampleProps) {
  const sample = useMemo(() => getToolSample(slug), [slug]);
  const reducedMotion = useReducedMotion();
  if (!sample) return null;

  return (
    <motion.section
      aria-label="Sample output"
      className="mt-8 rounded-xl border border-border bg-card/60 p-4 sm:p-5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={
        reducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <Zap className="size-4 text-primary" />
        <h2 className="text-sm font-semibold tracking-tight">See it in action</h2>
      </div>

      {sample.kind === "file" && <FileDemo sample={sample} />}
      {sample.kind === "image" && <ImageDemo sample={sample} />}
      {sample.kind === "text" && <TextDemo sample={sample} />}
      {sample.kind === "output" && <OutputDemo sample={sample} />}

      {sample.note && (
        <p className="mt-3 text-xs text-muted-foreground">{sample.note}</p>
      )}
      <p className="mt-1 text-[11px] text-muted-foreground/70">
        Sample output — your files never leave your device.
      </p>
    </motion.section>
  );
}

/* ---------- file ---------- */

function FileDemo({ sample }: { sample: Extract<ToolSample, { kind: "file" }> }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <FileChip name={sample.before.name} sub={sample.before.size} />
      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
      <FileChip name={sample.after.name} sub={sample.after.size} highlight />
    </div>
  );
}

function FileChip({
  name,
  sub,
  highlight,
}: {
  name: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex max-w-full flex-col gap-0.5 rounded-lg border px-3 py-2 ${
        highlight ? "border-primary/40 bg-primary/5" : "border-border bg-background"
      }`}
    >
      <span className="truncate font-medium">{name}</span>
      <span className="text-muted-foreground">{sub}</span>
    </div>
  );
}

/* ---------- image ---------- */

function ImageDemo({ sample }: { sample: Extract<ToolSample, { kind: "image" }> }) {
  return (
    <div className="flex items-center gap-3">
      <Thumb thumb={sample.before} />
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
      <Thumb thumb={sample.after} />
    </div>
  );
}

function Thumb({
  thumb,
}: {
  thumb: Extract<ToolSample, { kind: "image" }>["before"];
}) {
  const base =
    "flex aspect-square w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background text-[10px] text-muted-foreground sm:w-32";
  if (thumb.type === "asset") {
    const bgStyle =
      thumb.bg === "checkerboard"
        ? {
            backgroundImage:
              "conic-gradient(#cbd5e1 90deg, transparent 90deg 180deg, #cbd5e1 180deg 270deg, transparent 270deg)",
            backgroundSize: "16px 16px",
            backgroundColor: "#fff",
          }
        : undefined;
    return (
      <div className={`${base} ${thumb.className ?? ""}`} style={bgStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb.src}
          alt={thumb.alt}
          className={thumb.fit === "contain" ? "size-full object-contain" : "size-full object-cover"}
        />
      </div>
    );
  }
  return (
    <div className={base} aria-label={thumb.alt}>
      <ArtArt art={thumb.art} />
    </div>
  );
}

function ArtArt({ art }: { art: ImageArt }) {
  switch (art) {
    case "portrait":
      return (
        <div className="size-full bg-gradient-to-br from-amber-200 via-rose-300 to-indigo-400" />
      );
    case "landscape":
      return (
        <div className="size-full bg-gradient-to-b from-sky-300 via-emerald-200 to-amber-200" />
      );
    case "gradient":
      return (
        <div className="size-full bg-gradient-to-tr from-violet-500 via-fuchsia-400 to-amber-300" />
      );
    case "checkerboard":
      return (
        <div
          className="size-full"
          style={{
            backgroundImage:
              "conic-gradient(#cbd5e1 90deg, transparent 90deg 180deg, #cbd5e1 180deg 270deg, transparent 270deg)",
            backgroundSize: "16px 16px",
          }}
        />
      );
    case "passport-frame":
      return (
        <div className="relative size-full bg-gradient-to-br from-amber-200 to-rose-300">
          <div className="absolute inset-3 border-2 border-white/80" />
        </div>
      );
    case "print-sheet":
      return (
        <div className="grid size-full grid-cols-2 gap-1 p-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-amber-200 to-rose-300" />
          ))}
        </div>
      );
    case "cropped-square":
      return (
        <div className="size-full bg-gradient-to-br from-sky-300 to-emerald-300" />
      );
    case "rotated":
      return (
        <div className="size-full -rotate-12 bg-gradient-to-b from-sky-300 to-amber-200" />
      );
    case "swatches":
      return (
        <div className="grid size-full grid-cols-2 gap-1 p-1">
          {["#ef4444", "#3b82f6", "#10b981", "#f59e0b"].map((c) => (
            <div key={c} style={{ background: c }} />
          ))}
        </div>
      );
    case "collage-grid":
      return (
        <div className="grid size-full grid-cols-2 gap-1 p-1">
          {["from-rose-200 to-rose-400", "from-sky-200 to-sky-400", "from-amber-200 to-amber-400", "from-emerald-200 to-emerald-400"].map(
            (g, i) => (
              <div key={i} className={`bg-gradient-to-br ${g}`} />
            )
          )}
        </div>
      );
    case "palette-row":
      return (
        <div className="flex size-full flex-row">
          {["#0f172a", "#334155", "#64748b", "#94a3b8", "#e2e8f0"].map((c) => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      );
    case "meme":
      return (
        <div className="relative size-full bg-gradient-to-br from-zinc-700 to-zinc-900">
          <span className="absolute inset-x-1 top-1 text-center font-black uppercase text-white [font-size:8px] leading-tight">
            when it works
          </span>
          <span className="absolute inset-x-1 bottom-1 text-center font-black uppercase text-white [font-size:8px] leading-tight">
            on the first try
          </span>
        </div>
      );
    case "ascii":
      return (
        <pre className="size-full overflow-hidden whitespace-pre p-1 text-[6px] leading-none text-foreground/80">
{`#  #  ###
## #  #  
#  ## #  
#  #  ###
        `}
        </pre>
      );
    case "scanned-doc":
      return (
        <div className="flex size-full flex-col gap-0.5 bg-white p-2">
          <div className="h-0.5 w-3/4 bg-zinc-300" />
          <div className="h-0.5 w-2/3 bg-zinc-300" />
          <div className="h-0.5 w-4/5 bg-zinc-300" />
        </div>
      );
    default:
      return null;
  }
}

/* ---------- text ---------- */

function TextDemo({ sample }: { sample: Extract<ToolSample, { kind: "text" }> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <CodeBlock label="Before" content={sample.before} />
      <CodeBlock label="After" content={sample.after} highlight />
    </div>
  );
}

function CodeBlock({
  label,
  content,
  highlight,
}: {
  label: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border ${
        highlight ? "border-primary/40 bg-primary/5" : "border-border bg-background"
      }`}
    >
      <div className="border-b border-inherit px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <pre className="max-h-40 overflow-auto p-2 text-[11px] leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
}

/* ---------- output ---------- */

function OutputDemo({ sample }: { sample: Extract<ToolSample, { kind: "output" }> }) {
  switch (sample.render) {
    case "qr":
      return (
        <div className="flex w-fit flex-col items-center gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/samples/out-qr.png"
            alt="QR code for tools.genrisetech.in"
            className="w-28 rounded-lg border border-border bg-white p-1"
          />
          <span className="text-[10px] text-muted-foreground">tools.genrisetech.in</span>
        </div>
      );
    case "password":
      return (
        <code className="block rounded-lg border border-border bg-background px-3 py-2 text-xs">
          K7$mP9nQv2!Lx4#Rb
        </code>
      );
    case "uuid":
      return (
        <code className="block rounded-lg border border-border bg-background px-3 py-2 text-xs">
          3f1a2c4d-5b6e-4f7a-9c8d-1e2f3a4b5c6d
        </code>
      );
    case "hash":
      return (
        <div className="space-y-1 text-[11px]">
          <div className="text-muted-foreground">SHA-256</div>
          <code className="block break-all rounded-lg border border-border bg-background px-3 py-2">
            9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
          </code>
        </div>
      );
    case "palette":
      return (
        <div className="flex h-12 overflow-hidden rounded-lg border border-border">
          {["#0f172a", "#334155", "#64748b", "#94a3b8", "#e2e8f0"].map((c) => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      );
    case "diff":
      return (
        <pre className="overflow-auto rounded-lg border border-border bg-background p-2 text-[11px] leading-relaxed">
{`- const x = 1
+ const x = 2
  const y = 3
- return x + y
+ return x * y`}
        </pre>
      );
    case "cron":
      return (
        <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
          <code className="font-mono">0 9 * * 1</code>
          <span className="text-muted-foreground"> → Every Monday at 09:00 AM</span>
        </div>
      );
    case "ascii":
      return (
        <pre className="overflow-auto rounded-lg border border-border bg-background p-2 text-[8px] leading-none">
{`  ##   ##
 #######
##  #  ##
##  #  ##
#########
 ##   ##
 ##   ##`}
        </pre>
      );
    case "wheel":
      return (
        <div className="flex size-24 items-center justify-center rounded-full border-4 border-dashed border-primary/40 text-[10px] text-muted-foreground sm:size-28">
          spin
        </div>
      );
    case "dice":
      return (
        <div className="flex gap-2 text-2xl">
          <span className="rounded-md border border-border bg-background px-2 py-1">⚄</span>
          <span className="rounded-md border border-border bg-background px-2 py-1">⚂</span>
        </div>
      );
    case "terminal":
      return (
        <pre className="overflow-hidden rounded-lg border border-border bg-zinc-950 p-2 text-[10px] leading-relaxed text-emerald-400">
{`> initializing...
> bypassing firewall...
> access granted ✓`}
        </pre>
      );
    case "waveform":
      return (
        <div className="flex h-12 items-center gap-0.5">
          {[40, 70, 30, 90, 50, 80, 35, 60, 75, 45, 85, 30, 65, 50, 70].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-primary/60"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );
    case "screen":
      return (
        <div className="aspect-video w-full max-w-xs rounded-lg border border-border bg-zinc-900 p-2">
          <div className="mb-1 flex gap-1">
            <span className="size-1.5 rounded-full bg-rose-400" />
            <span className="size-1.5 rounded-full bg-amber-400" />
            <span className="size-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="h-full w-full rounded bg-zinc-800" />
        </div>
      );
    case "resume":
      return (
        <div className="w-full max-w-xs rounded-lg border border-border bg-white p-3 text-[10px] leading-tight text-zinc-700">
          <div className="mb-1 border-b border-zinc-200 pb-1 font-bold text-zinc-900">
            ADA LOVELACE
          </div>
          <div className="text-[9px] text-zinc-500">Software Engineer · ada@x.com</div>
          <div className="mt-2 font-semibold">Experience</div>
          <div className="text-zinc-600">Senior Engineer · Acme (2022—now)</div>
        </div>
      );
    case "invoice":
      return (
        <div className="w-full max-w-xs rounded-lg border border-border bg-white p-3 text-[10px] leading-tight text-zinc-700">
          <div className="flex justify-between">
            <span className="font-bold text-zinc-900">INVOICE #1042</span>
            <span>$1,200.00</span>
          </div>
          <div className="mt-1 text-zinc-500">Due: Sep 30, 2026</div>
        </div>
      );
    case "file-list":
      return (
        <ul className="space-y-1 text-xs">
          {["resume.pdf", "cover-letter.pdf", "references.pdf"].map((f) => (
            <li key={f} className="rounded-md border border-border bg-background px-2 py-1">
              {f}
            </li>
          ))}
        </ul>
      );
    case "gpa":
      return (
        <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
          <div className="text-muted-foreground">A, A−, B+, A</div>
          <div className="mt-1 font-semibold">GPA 3.77 / 4.0</div>
        </div>
      );
    case "percentage":
      return (
        <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
          18% of 250 = <span className="font-semibold">45</span>
        </div>
      );
    case "age":
      return (
        <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
          Born 1996-03-14 → <span className="font-semibold">30y 5m</span>
        </div>
      );
    case "unit":
      return (
        <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
          5 km = <span className="font-semibold">3.11 mi</span> = 16,404 ft
        </div>
      );
    case "bmi":
      return (
        <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
          70 kg / 1.75 m → <span className="font-semibold">22.9 (normal)</span>
        </div>
      );
    case "date-diff":
      return (
        <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
          2025-01-01 → 2025-09-07 = <span className="font-semibold">250 days</span>
        </div>
      );
    case "file-info":
      return (
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 rounded-lg border border-border bg-background px-3 py-2 text-[11px]">
          <span className="text-muted-foreground">Dimensions</span><span>4032×3024</span>
          <span className="text-muted-foreground">DPI</span><span>72</span>
          <span className="text-muted-foreground">Color space</span><span>sRGB</span>
          <span className="text-muted-foreground">EXIF tags</span><span>14</span>
        </div>
      );
    case "ocr":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-2 text-[10px] text-zinc-700">
            <div className="h-0.5 w-3/4 bg-zinc-300" />
            <div className="mt-1 h-0.5 w-2/3 bg-zinc-300" />
            <div className="mt-1 h-0.5 w-4/5 bg-zinc-300" />
          </div>
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-2 text-[11px]">
            Hello, GenRise!
          </div>
        </div>
      );
    default:
      return null;
  }
}
