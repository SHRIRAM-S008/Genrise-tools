import { tools } from "@/lib/tools";

export function StatsStrip() {
  return (
    <section className="border-b border-border py-5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm text-muted-foreground">
        <span>
          <span className="font-bold text-foreground">{tools.length}</span> free tools
        </span>
        <span className="text-border">·</span>
        <span>
          <span className="font-bold text-foreground">100%</span> on-device
        </span>
        <span className="text-border">·</span>
        <span>No sign-up</span>
        <span className="text-border">·</span>
        <span>No uploads</span>
        <span className="text-border">·</span>
        <span>No watermarks</span>
      </div>
    </section>
  );
}
