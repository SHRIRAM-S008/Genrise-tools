import type { Metadata } from "next";
import Link from "next/link";
import { tools, toolCategories } from "@/lib/tools";
import { categoryTileClass } from "@/lib/categoryStyles";
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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-14">
      <h1 className="text-3xl font-bold font-heading">All Tools</h1>
      <p className="mt-3 text-muted-foreground">
        {tools.length} free tools that run entirely in your browser. No sign-up,
        no uploads, no watermarks.
      </p>

      <div className="mt-10 flex flex-col gap-12">
        {toolCategories.map((category) => {
          const categoryTools = tools.filter((t) => t.category === category);
          return (
            <div key={category}>
              <h2 className="text-xl font-semibold font-heading">{category}</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl ${categoryTileClass[tool.category]}`}
                    >
                      <tool.icon className="size-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-medium">{tool.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
