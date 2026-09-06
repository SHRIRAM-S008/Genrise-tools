import type { Metadata } from "next";
import { KitPage, kitMetadata } from "@/components/kit-page";

export const metadata: Metadata = kitMetadata("careerkit");

export default function CareerKitPage() {
  return <KitPage slug="careerkit" />;
}
