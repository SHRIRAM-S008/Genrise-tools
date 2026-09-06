"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { renderMarkdown } from "@/lib/markdown";

const DEFAULT_MD = `# Hello\n\nWrite some **Markdown** on the left and see it rendered here.\n\n- supports lists\n- \`inline code\`\n- [links](https://example.com)\n\n> blockquotes too`;

export default function MarkdownPreviewerPage() {
  const [text, setText] = useState(DEFAULT_MD);
  const html = useMemo(() => renderMarkdown(text), [text]);

  return (
    <ToolLayout title="Markdown Previewer" description="Write Markdown and see the rendered HTML preview live.">
      <div className="grid gap-4 sm:grid-cols-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={16}
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
        <div
          className="markdown-preview overflow-y-auto rounded-lg border border-border px-4 py-3 text-sm [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-accent/50 [&_code]:px-1 [&_h1]:mt-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mt-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-accent/40 [&_pre]:p-3"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </ToolLayout>
  );
}
