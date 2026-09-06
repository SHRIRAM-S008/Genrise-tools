"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const COLORS = ["#f43f5e", "#f59e0b", "#22c55e", "#06b6d4", "#6366f1", "#a855f7", "#ec4899", "#84cc16"];

export default function RandomPickerWheelPage() {
  const [raw, setRaw] = useState("Pizza\nSushi\nTacos\nBurgers\nSalad");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const options = useMemo(() => raw.split("\n").map((s) => s.trim()).filter(Boolean), [raw]);
  const sliceAngle = options.length ? 360 / options.length : 0;

  const gradient = useMemo(() => {
    if (!options.length) return "conic-gradient(#e5e7eb 0deg 360deg)";
    const stops = options.map((_, i) => {
      const color = COLORS[i % COLORS.length];
      return `${color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  }, [options, sliceAngle]);

  function spin() {
    if (!options.length || spinning) return;
    setSpinning(true);
    setWinner(null);
    const winningIndex = Math.floor(Math.random() * options.length);
    const targetSliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
    const spins = 5 * 360;
    const newRotation = rotation + spins + (360 - targetSliceCenter) - (rotation % 360);

    setRotation(newRotation);
    window.setTimeout(() => {
      setSpinning(false);
      setWinner(options[winningIndex]);
    }, 4000);
  }

  return (
    <ToolLayout title="Random Picker Wheel" description="Spin a wheel to randomly pick from your list of options.">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Options (one per line)</span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
      </label>

      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative">
          <div
            className="size-64 rounded-full border-4 border-border shadow-lg transition-transform ease-out sm:size-80"
            style={{ background: gradient, transform: `rotate(${rotation}deg)`, transitionDuration: "4000ms" }}
          />
          <div className="absolute left-1/2 top-1/2 flex size-64 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:size-80">
            {options.map((opt, i) => {
              const angle = i * sliceAngle + sliceAngle / 2;
              return (
                <span
                  key={i}
                  className="absolute select-none text-xs font-medium text-white"
                  style={{ transform: `rotate(${angle}deg) translateY(-90px)` }}
                >
                  {opt}
                </span>
              );
            })}
          </div>
          <div className="absolute -top-2 left-1/2 size-0 -translate-x-1/2 border-x-8 border-t-[14px] border-x-transparent border-t-primary" />
        </div>

        <button
          onClick={spin}
          disabled={!options.length || spinning}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {spinning ? "Spinning…" : "Spin"}
        </button>

        {winner && <p className="text-lg font-semibold">🎉 {winner}</p>}
      </div>
    </ToolLayout>
  );
}
