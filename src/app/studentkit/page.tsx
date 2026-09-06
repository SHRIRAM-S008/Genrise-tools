import type { Metadata } from "next";
import { KitPage, kitMetadata } from "@/components/kit-page";

export const metadata: Metadata = kitMetadata("studentkit");

export default function StudentKitPage() {
  return <KitPage slug="studentkit" />;
}
