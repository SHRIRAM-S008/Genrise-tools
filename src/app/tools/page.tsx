import type { Metadata } from "next";
import { ToolBrowser } from "@/components/tool-browser";
import { siteUrl, siteName } from "@/lib/toolSeo";

export const metadata: Metadata = {
  title: "All Tools — Free Online Browser-Based Tools",
  description:
    "Browse all free GenRise tools — image compression, PDF merging, QR codes, resume builder, and more. 100% browser-based, no sign-up, no server uploads.",
  alternates: { canonical: `${siteUrl}/tools` },
  openGraph: {
    title: `All Tools — ${siteName}`,
    description:
      "Browse all free browser-based tools for files, images, PDFs, and documents.",
    url: `${siteUrl}/tools`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `All Tools — ${siteName}`,
    description: "Browse all free browser-based tools — no sign-up, no uploads.",
  },
};

export default function ToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-14">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-heading">All Tools</h1>
        <p className="mt-3 text-muted-foreground">
          Browse, search, and filter every tool — all running entirely in your
          browser.
        </p>
      </div>
      <ToolBrowser />
    </main>
  );
}
