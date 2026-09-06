export type UnitCategory = "length" | "weight" | "temperature";

export const unitOptions: Record<UnitCategory, string[]> = {
  length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
  weight: ["mg", "g", "kg", "t", "oz", "lb"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
};

const lengthToMeters: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const weightToGrams: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  t: 1_000_000,
  oz: 28.349523125,
  lb: 453.59237,
};

function toCelsius(value: number, unit: string): number {
  if (unit === "celsius") return value;
  if (unit === "fahrenheit") return ((value - 32) * 5) / 9;
  return value - 273.15;
}

function fromCelsius(value: number, unit: string): number {
  if (unit === "celsius") return value;
  if (unit === "fahrenheit") return (value * 9) / 5 + 32;
  return value + 273.15;
}

export function convertUnit(category: UnitCategory, value: number, from: string, to: string): number {
  if (category === "temperature") {
    return fromCelsius(toCelsius(value, from), to);
  }
  const table = category === "length" ? lengthToMeters : weightToGrams;
  return (value * table[from]) / table[to];
}
