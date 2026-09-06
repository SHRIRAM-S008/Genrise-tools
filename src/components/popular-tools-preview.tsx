import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools } from "@/lib/tools";
import { categoryTileClass } from "@/lib/categoryStyles";

export function PopularToolsPreview() {
  const popularTools = tools.filter((t) => t.popular);

  return (
    <section className="py-4">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Popular tools</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The most-used tools on GenRise.
          </p>
        </div>
        <Link
          href="/tools"
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary"
        >
          Browse all {tools.length}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {popularTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-[24px] border border-border/70 bg-card/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-2xl hover:shadow-primary/10"
          >
            <div
              className={`flex size-12 items-center justify-center rounded-2xl shadow-inner ${categoryTileClass[tool.category]}`}
            >
              <tool.icon className="size-5" strokeWidth={2} />
            </div>
            <h3 className="mt-3.5 font-heading text-sm font-semibold leading-tight">
              {tool.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
