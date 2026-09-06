import type { Metadata } from "next";
import { KitPage, kitMetadata } from "@/components/kit-page";

export const metadata: Metadata = kitMetadata("devkit");

export default function DevKitPage() {
  return <KitPage slug="devkit" />;
}
