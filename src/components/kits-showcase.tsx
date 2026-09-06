import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { kits, toolsByKit } from "@/lib/tools";

export function KitsShowcase() {
  return (
    <section className="py-10">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
          Tool Kits
        </h2>
        <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
          Curated bundles for a specific task — the right tools grouped together
          so you don&rsquo;t hunt.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {kits.map((kit) => {
          const count = toolsByKit(kit.slug).length;
          return (
            <Link
              key={kit.slug}
              href={`/${kit.slug}`}
              className="group flex flex-col gap-4 bg-card p-6 transition-colors hover:bg-accent/40"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex size-11 items-center justify-center rounded-lg ${kit.iconClass}`}
                >
                  <kit.icon className="size-5" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {count} tools
                </span>
              </div>
              <div>
                <h3 className="font-heading text-base font-bold">{kit.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {kit.description}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                Explore
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}

        {/* Coming Soon card to fill the grid */}
        <div className="flex flex-col gap-4 bg-muted/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Clock className="size-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Coming soon
            </span>
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-muted-foreground">
              More kits
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground/70">
              We&rsquo;re building more curated bundles. Stay tuned.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Clock className="size-3" />
            In progress
          </span>
        </div>
      </div>
    </section>
  );
}
