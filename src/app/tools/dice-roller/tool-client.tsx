"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const DICE_TYPES = [4, 6, 8, 10, 12, 20];

function randomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % max) + 1;
}

export default function DiceRollerPage() {
  const [diceType, setDiceType] = useState(6);
  const [count, setCount] = useState(2);
  const [results, setResults] = useState<number[]>([]);
  const [coin, setCoin] = useState<"Heads" | "Tails" | null>(null);

  function roll() {
    const rolls = Array.from({ length: count }, () => randomInt(diceType));
    setResults(rolls);
  }

  function flipCoin() {
    setCoin(randomInt(2) === 1 ? "Heads" : "Tails");
  }

  return (
    <ToolLayout title="Dice Roller & Coin Flip" description="Roll virtual dice or flip a coin with true randomness.">
      <div className="rounded-2xl border border-border p-5">
        <p className="mb-3 font-medium">Dice</p>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Dice type</span>
            <select
              value={diceType}
              onChange={(e) => setDiceType(Number(e.target.value))}
              className="rounded-lg border border-border px-3 py-2"
            >
              {DICE_TYPES.map((d) => (
                <option key={d} value={d}>
                  d{d}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Count</span>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24 rounded-lg border border-border px-3 py-2"
            />
          </label>
          <button onClick={roll} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
            Roll
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {results.map((r, i) => (
                <span key={i} className="flex size-10 items-center justify-center rounded-lg border border-border font-semibold">
                  {r}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Total: {results.reduce((a, b) => a + b, 0)}</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border p-5">
        <p className="mb-3 font-medium">Coin flip</p>
        <button onClick={flipCoin} className="w-fit rounded-full border border-border px-6 py-3 font-medium">
          Flip
        </button>
        {coin && <p className="mt-3 text-lg font-semibold">{coin}</p>}
      </div>
    </ToolLayout>
  );
}
