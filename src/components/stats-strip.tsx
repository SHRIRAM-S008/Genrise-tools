import { Check } from "lucide-react";
import { tools } from "@/lib/tools";
import { CountUp } from "@/components/count-up";

const counters = [
  { label: "Free tools & counting", value: tools.length, prefix: "", suffix: "+" },
  { label: "Of your files stay on-device", value: 100, prefix: "", suffix: "%" },
];

const highlights = ["No login needed", "Free forever"];

export function StatsStrip() {
  return (
    <section className="border-y border-border/60 py-8">
      <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
        {counters.map((s) => (
          <div key={s.label}>
            <div className="font-heading text-2xl font-bold sm:text-3xl">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
          </div>
        ))}
        {highlights.map((h) => (
          <div key={h} className="flex flex-col items-center justify-center gap-1.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:size-9">
              <Check className="size-4 sm:size-5" />
            </div>
            <div className="text-xs font-medium sm:text-sm">{h}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
