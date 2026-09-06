import type { MetadataRoute } from "next";
import { siteUrl, siteName } from "@/lib/toolSeo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} — Free Browser-Based Tools`,
    short_name: siteName,
    description:
      "Free online tools to compress, convert, merge, and organize images, PDFs, and documents — 100% private, no sign-up, no server uploads.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "any",
    categories: ["productivity", "utilities", "developer"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Compress Image",
        short_name: "Compress",
        url: "/tools/compress-image",
      },
      {
        name: "Merge PDF",
        short_name: "Merge PDF",
        url: "/tools/merge-pdf",
      },
      {
        name: "QR Code Generator",
        short_name: "QR Code",
        url: "/tools/qr-code",
      },
    ],
    id: siteUrl,
  };
}
