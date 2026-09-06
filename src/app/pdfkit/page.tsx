import type { Metadata } from "next";
import { KitPage, kitMetadata } from "@/components/kit-page";

export const metadata: Metadata = kitMetadata("pdfkit");

export default function PdfKitPage() {
  return <KitPage slug="pdfkit" />;
}
