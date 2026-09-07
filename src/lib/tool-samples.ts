// Hand-crafted sample specs for every tool page.
// Keyed by tool slug. Missing slug => card hidden (safe fallback).
// Kinds:
//   file   -> before/after file chips with size delta
//   image  -> before/after visual thumbs (CSS/SVG art or bundled asset path)
//   text   -> before/after code/text blocks
//   output -> rendered result (qr, password, uuid, hash, palette, diff, etc.)

export type ToolSampleKind = "file" | "image" | "text" | "output";

export interface FileSample {
  kind: "file";
  before: { name: string; size: string };
  after: { name: string; size: string };
  note?: string;
}

export interface ImageSample {
  kind: "image";
  before: ImageThumb;
  after: ImageThumb;
  note?: string;
}

export type ImageThumb =
  | {
      type: "asset";
      src: string;
      alt: string;
      className?: string;
      bg?: "checkerboard" | "plain";
      fit?: "cover" | "contain";
    }
  | { type: "art"; art: ImageArt; alt: string };

export type ImageArt =
  | "portrait"
  | "landscape"
  | "checkerboard"
  | "passport-frame"
  | "print-sheet"
  | "cropped-square"
  | "rotated"
  | "swatches"
  | "collage-grid"
  | "palette-row"
  | "meme"
  | "ascii"
  | "gradient"
  | "scanned-doc";

export interface TextSample {
  kind: "text";
  before: string;
  after: string;
  lang?: "json" | "text" | "markdown" | "csv" | "jwt" | "regex";
  note?: string;
}

export interface OutputSample {
  kind: "output";
  render:
    | "qr"
    | "password"
    | "uuid"
    | "hash"
    | "palette"
    | "diff"
    | "cron"
    | "ascii"
    | "wheel"
    | "dice"
    | "terminal"
    | "waveform"
    | "screen"
    | "resume"
    | "invoice"
    | "file-list"
    | "gpa"
    | "percentage"
    | "age"
    | "unit"
    | "bmi"
    | "date-diff"
    | "file-info"
    | "ocr";
  note?: string;
}

export type ToolSample = FileSample | ImageSample | TextSample | OutputSample;

export const toolSamples: Record<string, ToolSample> = {
  // ---------- Images ----------
  "compress-image": {
    kind: "file",
    before: { name: "photo.jpg", size: "4.2 MB" },
    after: { name: "photo.jpg", size: "640 KB" },
    note: "85% smaller — same visible quality",
  },
  "resize-image": {
    kind: "image",
    before: { type: "asset", src: "/samples/landscape.jpg", alt: "4032×3024 original" },
    after: {
      type: "asset",
      src: "/samples/out-resized.jpg",
      alt: "800×600 resized",
      fit: "contain",
    },
    note: "4032×3024 → 800×600",
  },
  "convert-image": {
    kind: "file",
    before: { name: "photo.png", size: "8.1 MB" },
    after: { name: "photo.webp", size: "420 KB" },
    note: "PNG → WebP, 95% smaller",
  },
  "target-kb": {
    kind: "file",
    before: { name: "avatar.png", size: "2.4 MB" },
    after: { name: "avatar.jpg", size: "99 KB" },
    note: "Hit a 100 KB upload limit exactly",
  },
  "passport-photo": {
    kind: "image",
    before: { type: "asset", src: "/samples/bg-remoev-before.png", alt: "Casual photo" },
    after: {
      type: "asset",
      src: "/samples/out-passport.jpg",
      alt: "2×2 inch passport crop",
      fit: "contain",
    },
    note: "Auto-cropped to 2×2 inch with head guide",
  },
  "print-sheet": {
    kind: "image",
    before: { type: "asset", src: "/samples/bg-remoev-before.png", alt: "Single photo" },
    after: {
      type: "asset",
      src: "/samples/out-printsheet.jpg",
      alt: "4-up print sheet",
      fit: "contain",
    },
    note: "One photo → 4-up 4×6 inch print sheet",
  },
  "signature-optimizer": {
    kind: "image",
    before: { type: "asset", src: "/samples/document.jpg", alt: "Phone photo of signature" },
    after: {
      type: "asset",
      src: "/samples/out-signature.png",
      alt: "Cleaned transparent signature",
      fit: "contain",
    },
    note: "Background removed, contrast boosted",
  },
  "image-cropper": {
    kind: "image",
    before: { type: "asset", src: "/samples/landscape.jpg", alt: "Full photo" },
    after: {
      type: "asset",
      src: "/samples/out-cropped.jpg",
      alt: "1:1 crop",
      fit: "contain",
    },
    note: "Free crop to any aspect ratio",
  },
  "image-rotator": {
    kind: "image",
    before: { type: "asset", src: "/samples/landscape.jpg", alt: "Original photo" },
    after: { type: "asset", src: "/samples/out-rotated.jpg", alt: "Rotated 90°" },
    note: "Rotate 90° / 180° / 270° or fine-tune",
  },
  "color-picker": {
    kind: "image",
    before: { type: "asset", src: "/samples/colorful.jpg", alt: "Source image" },
    after: {
      type: "asset",
      src: "/samples/out-colorpick.png",
      alt: "Picked color swatches",
      fit: "contain",
    },
    note: "Pick exact hex codes from any pixel",
  },
  "image-collage": {
    kind: "image",
    before: { type: "asset", src: "/samples/bg-remoev-before.png", alt: "4 separate photos" },
    after: {
      type: "asset",
      src: "/samples/out-collage.jpg",
      alt: "2×2 collage",
      fit: "contain",
    },
    note: "Drag-and-drop grid layouts",
  },
  "background-remover": {
    kind: "image",
    before: {
      type: "asset",
      src: "/samples/bg-remoev-before.png",
      alt: "Photo with background",
    },
    after: {
      type: "asset",
      src: "/samples/bg-remoev-after.png",
      alt: "Transparent cutout",
      bg: "checkerboard",
      fit: "contain",
    },
    note: "Subject isolated, transparent PNG output",
  },
  "color-palette-generator": {
    kind: "image",
    before: { type: "asset", src: "/samples/colorful.jpg", alt: "Source image" },
    after: {
      type: "asset",
      src: "/samples/out-palette.png",
      alt: "5-color palette",
      fit: "contain",
    },
    note: "Dominant colors extracted automatically",
  },
  "meme-generator": {
    kind: "image",
    before: { type: "asset", src: "/samples/colorful.jpg", alt: "Blank template" },
    after: {
      type: "asset",
      src: "/samples/out-meme.jpg",
      alt: "Captioned meme",
      fit: "contain",
    },
    note: "Top + bottom text, classic Impact font",
  },
  "ascii-art-generator": {
    kind: "image",
    before: { type: "asset", src: "/samples/bg-remoev-before.png", alt: "Source photo" },
    after: {
      type: "asset",
      src: "/samples/out-ascii.png",
      alt: "ASCII art",
      fit: "contain",
    },
    note: "Photo → ASCII text art",
  },

  // ---------- PDFs ----------
  "image-to-pdf": {
    kind: "file",
    before: { name: "scan-01.jpg, scan-02.jpg, scan-03.jpg", size: "3 files" },
    after: { name: "scans.pdf", size: "1.8 MB" },
    note: "3 images → 1 PDF",
  },
  "merge-pdf": {
    kind: "file",
    before: { name: "part-1.pdf, part-2.pdf", size: "2 files" },
    after: { name: "merged.pdf", size: "1 file" },
    note: "Combine PDFs in any order",
  },
  "compress-pdf": {
    kind: "file",
    before: { name: "report.pdf", size: "12 MB" },
    after: { name: "report.pdf", size: "2.1 MB" },
    note: "82% smaller, email-friendly",
  },
  "pdf-organizer": {
    kind: "file",
    before: { name: "doc.pdf", size: "12 pages" },
    after: { name: "doc.pdf", size: "9 pages" },
    note: "Reorder, delete, drag pages",
  },
  "split-pdf": {
    kind: "file",
    before: { name: "big.pdf", size: "30 pages" },
    after: { name: "part-1.pdf, part-2.pdf, part-3.pdf", size: "3 files" },
    note: "Split by page ranges",
  },
  "pdf-to-image": {
    kind: "file",
    before: { name: "deck.pdf", size: "8 pages" },
    after: { name: "page-1.png … page-8.png", size: "8 images" },
    note: "Each page → PNG/JPG",
  },
  "rotate-pdf": {
    kind: "file",
    before: { name: "scanned.pdf", size: "5 pages" },
    after: { name: "scanned.pdf", size: "5 pages" },
    note: "All pages rotated 90°",
  },
  "pdf-to-word": {
    kind: "file",
    before: { name: "contract.pdf", size: "480 KB" },
    after: { name: "contract.docx", size: "62 KB" },
    note: "Editable Word output",
  },

  // ---------- Data & Text ----------
  "qr-code": {
    kind: "output",
    render: "qr",
    note: "Scan to open tools.genrisetech.in",
  },
  "file-info": {
    kind: "output",
    render: "file-info",
    note: "Dimensions, DPI, color space, EXIF — all visible",
  },
  "zip-creator": {
    kind: "file",
    before: { name: "assets/ (12 files)", size: "8.4 MB" },
    after: { name: "assets.zip", size: "6.1 MB" },
    note: "Bundle files into one ZIP",
  },
  "csv-json": {
    kind: "text",
    lang: "csv",
    before: "name,age\nAda,28\nGrace,31",
    after: '[\n  { "name": "Ada", "age": 28 },\n  { "name": "Grace", "age": 31 }\n]',
    note: "CSV ↔ JSON, both directions",
  },
  "text-tools": {
    kind: "text",
    before: "  hello   WORLD\n  foo\tbar\n",
    after: "hello world\nfoo bar",
    note: "Trim, lowercase, dedupe, sort lines",
  },
  "ocr-text-extractor": {
    kind: "output",
    render: "ocr",
    note: "Image of text → editable text",
  },

  // ---------- Documents ----------
  "resume-builder": {
    kind: "output",
    render: "resume",
    note: "Fill the form → print-ready PDF",
  },
  "invoice-generator": {
    kind: "output",
    render: "invoice",
    note: "Line items, tax, totals — PDF invoice",
  },
  "application-pack": {
    kind: "output",
    render: "file-list",
    note: "Resume + cover letter + references, one bundle",
  },

  // ---------- Developers ----------
  "json-formatter": {
    kind: "text",
    lang: "json",
    before: '{"name":"Ada","skills":["js","ts"],"meta":{"active":true}}',
    after: '{\n  "name": "Ada",\n  "skills": ["js", "ts"],\n  "meta": { "active": true }\n}',
    note: "Beautify or minify JSON",
  },
  "base64-codec": {
    kind: "text",
    before: "Hello, GenRise!",
    after: "SGVsbG8sIEdlblJpc2Uh",
    note: "Encode ↔ decode Base64",
  },
  "uuid-generator": {
    kind: "output",
    render: "uuid",
    note: "RFC 4122 v4 UUIDs",
  },
  "password-generator": {
    kind: "output",
    render: "password",
    note: "Cryptographically random, customizable length",
  },
  "hash-generator": {
    kind: "output",
    render: "hash",
    note: "SHA-256 / SHA-1 / MD5 of any input",
  },
  "url-encoder": {
    kind: "text",
    before: "https://x.com/search?q=hello world&lang=en",
    after: "https%3A%2F%2Fx.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Den",
    note: "URL-encode ↔ decode",
  },
  "regex-tester": {
    kind: "text",
    lang: "regex",
    before: "/\\b[A-Z][a-z]+\\b/g\nAda Lovelace and Grace Hopper",
    after: "Match: Ada\nMatch: Lovelace\nMatch: Grace\nMatch: Hopper",
    note: "Live match highlighting + capture groups",
  },
  "jwt-decoder": {
    kind: "text",
    lang: "jwt",
    before: "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRhIiwicm9sZSI6ImFkbWluIn0.abc",
    after: '{\n  "user": "ada",\n  "role": "admin"\n}',
    note: "Decode header + payload, no verification",
  },
  "markdown-previewer": {
    kind: "text",
    lang: "markdown",
    before: "# Title\n\n**bold** and _italic_\n\n- item\n- item",
    after: "→ rendered HTML preview",
    note: "Live GitHub-flavored markdown preview",
  },
  "text-diff-checker": {
    kind: "output",
    render: "diff",
    note: "Line-by-line diff with +/- highlighting",
  },
  "cron-explainer": {
    kind: "output",
    render: "cron",
    note: "0 9 * * 1 → Every Monday at 09:00",
  },

  // ---------- Fun ----------
  "random-picker-wheel": {
    kind: "output",
    render: "wheel",
    note: "Add options → spin → random winner",
  },
  "dice-roller": {
    kind: "output",
    render: "dice",
    note: "Roll dice, flip coins, pick cards",
  },
  "hacker-terminal": {
    kind: "output",
    render: "terminal",
    note: "Fake 'hacking' terminal animation",
  },

  // ---------- Audio / Video ----------
  "audio-trimmer": {
    kind: "file",
    before: { name: "interview.mp3", size: "42 min" },
    after: { name: "interview-cut.mp3", size: "8 min" },
    note: "Trim to the good part, lossless cuts",
  },
  "voice-recorder": {
    kind: "output",
    render: "waveform",
    note: "Record in-browser, no install",
  },
  "screen-recorder": {
    kind: "output",
    render: "screen",
    note: "Capture any tab or window",
  },
  "video-to-gif": {
    kind: "file",
    before: { name: "clip.mp4", size: "12 MB" },
    after: { name: "clip.gif", size: "3.4 MB" },
    note: "Trim + convert to looping GIF",
  },

  // ---------- Calculators ----------
  "percentage-calculator": {
    kind: "output",
    render: "percentage",
    note: "What is 18% of 250? → 45",
  },
  "age-calculator": {
    kind: "output",
    render: "age",
    note: "Born 1996-03-14 → 30 years, 5 months",
  },
  "unit-converter": {
    kind: "output",
    render: "unit",
    note: "5 km → 3.11 mi → 16,404 ft",
  },
  "bmi-calculator": {
    kind: "output",
    render: "bmi",
    note: "70 kg / 1.75 m → BMI 22.9 (normal)",
  },
  "date-difference": {
    kind: "output",
    render: "date-diff",
    note: "2025-01-01 → 2025-09-07 = 250 days",
  },
  "gpa-calculator": {
    kind: "output",
    render: "gpa",
    note: "4 courses, A/A−/B+/A → GPA 3.77",
  },

  // ---------- Security ----------
  "metadata-remover": {
    kind: "file",
    before: { name: "photo.jpg", size: "GPS + 14 EXIF tags" },
    after: { name: "photo.jpg", size: "0 tags" },
    note: "Strip GPS, camera, author metadata",
  },
};

// Helper: get sample for a slug, or null
export function getToolSample(slug: string): ToolSample | null {
  return toolSamples[slug] ?? null;
}
