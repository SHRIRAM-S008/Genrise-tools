import { Lock, Zap, Sparkles } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Private by design",
    description: "Every tool runs in your browser using Canvas, WASM, and File APIs. Your files never touch a server.",
  },
  {
    icon: Zap,
    title: "Fast, no waiting",
    description: "No upload, no queue, no processing on someone else's machine. Results appear instantly, locally.",
  },
  {
    icon: Sparkles,
    title: "Always free",
    description: "No sign-up, no paywalls, no watermarks on the basics. GenRise stays free for everyday tasks.",
  },
];

export function WhyGenRise() {
  return (
    <section className="py-16">
      <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">Why GenRise</h2>
      <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground">
        Built on one rule: if your browser can do it, we don&rsquo;t need a server to do it for you.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-heading font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
