import type { Metadata } from "next";
import { tools } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/toolSeo";
import { ToolJsonLd } from "@/components/tool-jsonld";
import { ToolFaq } from "@/components/tool-faq";
import { ToolSeoContent } from "@/components/tool-seo-content";
import ToolClient from "./tool-client";

const tool = tools.find((t) => t.slug === "image-collage")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function Page() {
  return (
    <>
      <ToolJsonLd tool={tool} />
      <ToolClient />
      <ToolFaq tool={tool} />
      <ToolSeoContent tool={tool} />
    </>
  );
}
