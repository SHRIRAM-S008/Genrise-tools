import type { Metadata } from "next";
import { KitPage, kitMetadata } from "@/components/kit-page";

export const metadata: Metadata = kitMetadata("dockit");

export default function DocKitPage() {
  return <KitPage slug="dockit" />;
}
