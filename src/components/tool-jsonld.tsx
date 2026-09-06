import type { ToolMeta } from "@/lib/tools";
import { toolJsonLd } from "@/lib/toolSeo";

export function ToolJsonLd({ tool }: { tool: ToolMeta }) {
  const schemas = toolJsonLd(tool);
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
