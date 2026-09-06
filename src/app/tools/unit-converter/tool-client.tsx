"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { convertUnit, unitOptions, type UnitCategory } from "@/lib/unitConverter";

const CATEGORIES: UnitCategory[] = ["length", "weight", "temperature"];

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [from, setFrom] = useState(unitOptions.length[0]);
  const [to, setTo] = useState(unitOptions.length[1]);
  const [value, setValue] = useState("1");

  function changeCategory(next: UnitCategory) {
    setCategory(next);
    setFrom(unitOptions[next][0]);
    setTo(unitOptions[next][1]);
  }

  const result = useMemo(() => {
    const num = Number(value);
    if (Number.isNaN(num)) return null;
    return convertUnit(category, num, from, to);
  }, [category, from, to, value]);

  return (
    <ToolLayout title="Unit Converter" description="Convert between length, weight, temperature, and more.">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => changeCategory(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
              category === c ? "bg-primary text-primary-foreground" : "border border-border hover:border-primary/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
        <label className="flex flex-col gap-1 text-sm">
          Value
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-lg border border-border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          From
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-border px-3 py-2">
            {unitOptions[category].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          To
          <select value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-border px-3 py-2">
            {unitOptions[category].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>

      {result !== null && (
        <div className="rounded-2xl border border-border p-5">
          <p className="text-lg font-semibold">
            {value} {from} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
