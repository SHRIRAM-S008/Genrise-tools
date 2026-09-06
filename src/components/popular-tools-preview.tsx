import Link from "next/link";
import { ArrowRight, Grid3x3 } from "lucide-react";
import { tools } from "@/lib/tools";
import { categoryTileClass } from "@/lib/categoryStyles";

export function PopularToolsPreview() {
  const popularTools = tools.filter((t) => t.popular);

  return (
    <section className="py-10">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
          Popular right now
        </h2>
        <Link
          href="/tools"
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          All {tools.length} tools
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {popularTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex flex-col gap-3 bg-card p-5 transition-colors hover:bg-accent/40"
          >
            <div
              className={`flex size-10 items-center justify-center rounded-lg ${categoryTileClass[tool.category]}`}
            >
              <tool.icon className="size-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold leading-tight">
                {tool.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}

        {/* More tools card */}
        <Link
          href="/tools"
          className="group flex flex-col gap-3 bg-muted/30 p-5 transition-colors hover:bg-muted/50"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Grid3x3 className="size-5" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold leading-tight text-muted-foreground">
              More tools
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground/70">
              Browse all {tools.length} tools by category
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            Browse all
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
