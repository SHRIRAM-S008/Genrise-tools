import type { ToolMeta } from "@/lib/tools";
import { buildToolFaqs } from "@/lib/toolSeo";

export function ToolFaq({ tool }: { tool: ToolMeta }) {
  const faqs = buildToolFaqs(tool);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-16">
      <h2 className="text-lg font-semibold">Frequently asked questions</h2>
      <div className="mt-4 flex flex-col divide-y divide-border rounded-2xl border border-border">
        {faqs.map((faq) => (
          <div key={faq.question} className="p-5">
            <h3 className="font-medium">{faq.question}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
