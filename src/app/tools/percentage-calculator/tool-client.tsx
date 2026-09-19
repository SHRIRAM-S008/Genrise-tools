"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border px-3 py-2"
      />
    </label>
  );
}

function num(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function PercentageCalculatorPage() {
  const [x1, setX1] = useState("");
  const [y1, setY1] = useState("");
  const r1 = num(x1) !== null && num(y1) !== null ? (num(x1)! / 100) * num(y1)! : null;

  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");
  const r2 = num(x2) !== null && num(y2) ? (num(x2)! / num(y2)!) * 100 : null;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const r3 = num(from) && num(to) !== null ? ((num(to)! - num(from)!) / num(from)!) * 100 : null;

  return (
    <ToolLayout title="Percentage Calculator" description="Calculate percentages, increase, decrease, and ratios.">
      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-3 font-medium">X% of Y</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="X (%)" value={x1} onChange={setX1} />
          <Field label="Y" value={y1} onChange={setY1} />
        </div>
        {r1 !== null && <p className="mt-3 text-lg font-semibold">{r1.toLocaleString()}</p>}
      </div>

      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-3 font-medium">X is what % of Y</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="X" value={x2} onChange={setX2} />
          <Field label="Y" value={y2} onChange={setY2} />
        </div>
        {r2 !== null && <p className="mt-3 text-lg font-semibold">{r2.toFixed(2)}%</p>}
      </div>

      <div className="rounded-2xl border border-border p-5">
        <h2 className="mb-3 font-medium">% Increase / Decrease</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="From" value={from} onChange={setFrom} />
          <Field label="To" value={to} onChange={setTo} />
        </div>
        {r3 !== null && (
          <p className="mt-3 text-lg font-semibold">
            {r3 >= 0 ? "+" : ""}
            {r3.toFixed(2)}%
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
