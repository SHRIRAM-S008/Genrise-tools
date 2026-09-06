import type { Metadata } from "next";
import { KitPage, kitMetadata } from "@/components/kit-page";

export const metadata: Metadata = kitMetadata("mediakit");

export default function MediaKitPage() {
  return <KitPage slug="mediakit" />;
}
