"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function diff(birth: Date, asOf: Date) {
  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((asOf.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  return { years, months, days, totalDays };
}

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState("");
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().slice(0, 10));

  const result = useMemo(() => {
    if (!birthDate || !asOfDate) return null;
    const birth = new Date(birthDate);
    const asOf = new Date(asOfDate);
    if (birth > asOf) return null;
    return diff(birth, asOf);
  }, [birthDate, asOfDate]);

  return (
    <ToolLayout title="Age Calculator" description="Calculate exact age in years, months, and days from a date.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Birth date
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          As of date
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="rounded-lg border border-border px-3 py-2"
          />
        </label>
      </div>

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <p className="text-lg font-semibold">
            {result.years} years, {result.months} months, {result.days} days
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{result.totalDays.toLocaleString()} total days</p>
        </div>
      )}
    </ToolLayout>
  );
}
