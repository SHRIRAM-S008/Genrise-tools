import type { Metadata } from "next";
import { KitPage, kitMetadata } from "@/components/kit-page";

export const metadata: Metadata = kitMetadata("privacykit");

export default function PrivacyKitPage() {
  return <KitPage slug="privacykit" />;
}
