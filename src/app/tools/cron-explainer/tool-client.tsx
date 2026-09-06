"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { parseCron, nextRunTimes } from "@/lib/cronParser";

export default function CronExplainerPage() {
  const [expr, setExpr] = useState("*/15 9-17 * * 1-5");

  const parsed = useMemo(() => parseCron(expr), [expr]);
  const nextRuns = useMemo(() => (parsed ? nextRunTimes(parsed.fields, 5) : []), [parsed]);

  return (
    <ToolLayout title="Cron Expression Explainer" description="Turn a cron expression into plain English and see upcoming run times.">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Cron expression</span>
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="* * * * *"
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
        <span className="text-xs text-muted-foreground">minute hour day-of-month month day-of-week</span>
      </label>

      {!parsed && expr.trim() && <p className="text-destructive">Couldn&apos;t parse this cron expression.</p>}

      {parsed && (
        <>
          <div className="rounded-2xl border border-border p-5">
            <p className="font-medium">{parsed.description}</p>
          </div>

          <div className="rounded-2xl border border-border p-5">
            <p className="mb-2 text-sm font-medium">Next 5 run times</p>
            <ul className="flex flex-col gap-1 text-sm">
              {nextRuns.map((d, i) => (
                <li key={i} className="text-muted-foreground">
                  {d.toLocaleString()}
                </li>
              ))}
              {nextRuns.length === 0 && <li className="text-muted-foreground">No upcoming runs found.</li>}
            </ul>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
