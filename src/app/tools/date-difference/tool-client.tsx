"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function DateDifferencePage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const result = useMemo(() => {
    if (!start || !end) return null;
    const a = new Date(start);
    const b = new Date(end);
    const earlier = a <= b ? a : b;
    const later = a <= b ? b : a;

    const totalDays = Math.round((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24));

    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { totalDays, weeks: Math.floor(totalDays / 7), years, months, days };
  }, [start, end]);

  return (
    <ToolLayout title="Date Difference Calculator" description="Find the exact number of days, weeks, or months between dates.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Start date
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="rounded-lg border border-border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          End date
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-lg border border-border px-3 py-2" />
        </label>
      </div>

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className="text-lg font-semibold">
            {result.years} years, {result.months} months, {result.days} days
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.totalDays.toLocaleString()} total days · {result.weeks.toLocaleString()} weeks
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
