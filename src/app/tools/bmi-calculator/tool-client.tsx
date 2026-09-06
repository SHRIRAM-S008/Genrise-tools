"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function category(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export default function BmiCalculatorPage() {
  const [heightUnit, setHeightUnit] = useState<"cm" | "ftin">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [heightCm, setHeightCm] = useState("170");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("7");
  const [weight, setWeight] = useState("70");

  const bmi = useMemo(() => {
    const w = Number(weight);
    if (!w) return null;
    const kg = weightUnit === "kg" ? w : w * 0.45359237;

    let meters: number;
    if (heightUnit === "cm") {
      const cm = Number(heightCm);
      if (!cm) return null;
      meters = cm / 100;
    } else {
      const ft = Number(heightFt) || 0;
      const inch = Number(heightIn) || 0;
      const totalIn = ft * 12 + inch;
      if (!totalIn) return null;
      meters = totalIn * 0.0254;
    }

    return kg / (meters * meters);
  }, [heightUnit, weightUnit, heightCm, heightFt, heightIn, weight]);

  return (
    <ToolLayout title="BMI Calculator" description="Calculate Body Mass Index from height and weight.">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setHeightUnit("cm")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${heightUnit === "cm" ? "bg-primary text-primary-foreground" : "border border-border"}`}
        >
          cm
        </button>
        <button
          onClick={() => setHeightUnit("ftin")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${heightUnit === "ftin" ? "bg-primary text-primary-foreground" : "border border-border"}`}
        >
          ft/in
        </button>
        <button
          onClick={() => setWeightUnit("kg")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${weightUnit === "kg" ? "bg-primary text-primary-foreground" : "border border-border"}`}
        >
          kg
        </button>
        <button
          onClick={() => setWeightUnit("lb")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${weightUnit === "lb" ? "bg-primary text-primary-foreground" : "border border-border"}`}
        >
          lb
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {heightUnit === "cm" ? (
          <label className="flex flex-col gap-1 text-sm">
            Height (cm)
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="rounded-lg border border-border px-3 py-2" />
          </label>
        ) : (
          <div className="flex gap-2">
            <label className="flex flex-1 flex-col gap-1 text-sm">
              Feet
              <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="rounded-lg border border-border px-3 py-2" />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm">
              Inches
              <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="rounded-lg border border-border px-3 py-2" />
            </label>
          </div>
        )}
        <label className="flex flex-col gap-1 text-sm">
          Weight ({weightUnit})
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="rounded-lg border border-border px-3 py-2" />
        </label>
      </div>

      {bmi !== null && (
        <div className="rounded-2xl border border-border p-5">
          <p className="text-lg font-semibold">BMI: {bmi.toFixed(1)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{category(bmi)}</p>
        </div>
      )}
    </ToolLayout>
  );
}
