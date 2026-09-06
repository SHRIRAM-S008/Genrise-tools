import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { kits, toolsByKit } from "@/lib/tools";

export function KitsShowcase() {
  return (
    <section className="py-4">
      <h2 className="mb-5 text-center font-heading text-2xl font-bold">
        Tool Kits
      </h2>
      <p className="mx-auto mb-8 max-w-lg text-center text-sm text-muted-foreground">
        Curated bundles for a specific task. Each kit groups the right tools
        together so you don&rsquo;t have to hunt.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {kits.map((kit) => {
          const count = toolsByKit(kit.slug).length;
          return (
            <Link
              key={kit.slug}
              href={`/${kit.slug}`}
              className={`group relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-br p-7 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl ${kit.accent}`}
            >
              <div
                className={`flex size-12 items-center justify-center rounded-2xl ${kit.iconClass}`}
              >
                <kit.icon className="size-6" strokeWidth={2} />
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold">
                {kit.title}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {kit.tagline}
              </p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {kit.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {count} tools
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Explore
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
