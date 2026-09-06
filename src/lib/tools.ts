import type { LucideIcon } from "lucide-react";
import {
  Shrink,
  Scaling,
  RefreshCw,
  Target,
  IdCard,
  Printer,
  PenTool,
  ShieldCheck,
  FileImage,
  Combine,
  FileDown,
  LayoutList,
  QrCode,
  FileSearch,
  Archive,
  FileJson,
  Type,
  FileText,
  Receipt,
  PackageCheck,
  GraduationCap,
} from "lucide-react";

export type ToolCategory = "Images" | "PDFs" | "Documents" | "Data & Text" | "Privacy";

export interface ToolMeta {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
}

export const tools: ToolMeta[] = [
  {
    slug: "compress-image",
    title: "Compress Image",
    description: "Shrink JPG, PNG, or WebP files without leaving your browser.",
    icon: Shrink,
    category: "Images",
  },
  {
    slug: "resize-image",
    title: "Resize Image",
    description: "Resize by pixels or percentage, with optional aspect-ratio lock.",
    icon: Scaling,
    category: "Images",
  },
  {
    slug: "convert-image",
    title: "Convert Image",
    description: "Convert between JPG, PNG, and WebP.",
    icon: RefreshCw,
    category: "Images",
  },
  {
    slug: "target-kb",
    title: "UploadReady (Target KB)",
    description: "Tell us the size you need — we compress your photo to fit.",
    icon: Target,
    category: "Images",
  },
  {
    slug: "passport-photo",
    title: "Passport Photo Maker",
    description: "Crop and resize a photo to an exact passport, visa, or ID size.",
    icon: IdCard,
    category: "Images",
  },
  {
    slug: "print-sheet",
    title: "Print Sheet Maker",
    description: "Arrange repeated photo copies on one printable page.",
    icon: Printer,
    category: "Images",
  },
  {
    slug: "signature-optimizer",
    title: "Signature Optimizer",
    description: "Resize a signature photo to exact dimensions and file size.",
    icon: PenTool,
    category: "Images",
  },
  {
    slug: "metadata-remover",
    title: "Metadata Remover",
    description: "See and strip hidden camera, date, and GPS data from a photo.",
    icon: ShieldCheck,
    category: "Privacy",
  },
  {
    slug: "image-to-pdf",
    title: "Image to PDF",
    description: "Combine one or more images into a single PDF.",
    icon: FileImage,
    category: "PDFs",
  },
  {
    slug: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one, in order.",
    icon: Combine,
    category: "PDFs",
  },
  {
    slug: "compress-pdf",
    title: "Compress PDF",
    description: "Shrink a PDF's file size for easier sharing.",
    icon: FileDown,
    category: "PDFs",
  },
  {
    slug: "pdf-organizer",
    title: "PDF Page Organizer",
    description: "Reorder, rotate, or delete PDF pages, then export.",
    icon: LayoutList,
    category: "PDFs",
  },
  {
    slug: "qr-code",
    title: "QR Code Generator",
    description: "Create a QR code for a URL, text, Wi-Fi, or contact info.",
    icon: QrCode,
    category: "Data & Text",
  },
  {
    slug: "file-info",
    title: "File Info Checker",
    description: "Inspect a file's type, size, dimensions, or page count.",
    icon: FileSearch,
    category: "Data & Text",
  },
  {
    slug: "zip-creator",
    title: "ZIP Creator",
    description: "Bundle multiple files into a single ZIP archive.",
    icon: Archive,
    category: "Data & Text",
  },
  {
    slug: "csv-json",
    title: "CSV / JSON Tools",
    description: "Convert, format, and minify CSV and JSON data.",
    icon: FileJson,
    category: "Data & Text",
  },
  {
    slug: "text-tools",
    title: "Text Tools",
    description: "Word counts, case conversion, and line cleanup utilities.",
    icon: Type,
    category: "Data & Text",
  },
  {
    slug: "resume-builder",
    title: "Resume Builder",
    description: "Fill in your details and export a clean PDF resume.",
    icon: FileText,
    category: "Documents",
  },
  {
    slug: "invoice-generator",
    title: "Invoice Generator",
    description: "Create a simple, professional invoice PDF for a client.",
    icon: Receipt,
    category: "Documents",
  },
  {
    slug: "application-pack",
    title: "Application Pack Builder",
    description: "Bundle your resume, photo, signature, and certificates into one ZIP.",
    icon: PackageCheck,
    category: "Documents",
  },
  {
    slug: "gpa-calculator",
    title: "GPA Calculator",
    description: "Calculate your GPA on a standard 4.0 scale.",
    icon: GraduationCap,
    category: "Documents",
  },
];

export const toolCategories: ToolCategory[] = ["Images", "PDFs", "Documents", "Data & Text", "Privacy"];
