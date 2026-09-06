import { Lock, Zap, Server } from "lucide-react";

const pillars = [
  {
    icon: Lock,
    title: "Private by design",
    body: "Every tool runs in your browser using Canvas, WASM, and File APIs. Your files never touch a server.",
  },
  {
    icon: Zap,
    title: "Instant, not queued",
    body: "No upload, no queue, no processing on someone else's machine. Results appear the moment you drop a file.",
  },
  {
    icon: Server,
    title: "No backend, by choice",
    body: "If your browser can do it, we don't need a server to do it for you. That's the entire architecture.",
  },
];

export function WhyGenRise() {
  return (
    <section className="py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        {/* Left: statement */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Why GenRise
          </h2>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
            One rule: if your browser can do it, we don&rsquo;t need a server to
            do it for you.
          </p>
        </div>

        {/* Right: pillars as a stacked list, not cards */}
        <div className="flex flex-col divide-y divide-border">
          {pillars.map((p) => (
            <div key={p.title} className="flex gap-5 py-6 first:pt-0 last:pb-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <p.icon className="size-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
