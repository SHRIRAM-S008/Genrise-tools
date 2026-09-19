export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "data"
  | "time";

export const unitOptions: Record<UnitCategory, string[]> = {
  length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi", "nmi"],
  weight: ["mg", "g", "kg", "t", "oz", "lb", "st"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
  area: ["mm²", "cm²", "m²", "km²", "in²", "ft²", "acre", "hectare"],
  volume: ["ml", "l", "m³", "tsp", "tbsp", "cup", "fl oz", "pint", "quart", "gallon"],
  speed: ["m/s", "km/h", "mph", "knot", "ft/s"],
  data: ["bit", "byte", "KB", "MB", "GB", "TB", "KiB", "MiB", "GiB", "TiB"],
  time: ["ms", "s", "min", "h", "day", "week", "month", "year"],
};

/** Every non-temperature unit expressed in the category's base unit. */
const FACTORS: Record<Exclude<UnitCategory, "temperature">, Record<string, number>> = {
  length: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, nmi: 1852 },
  weight: { mg: 0.001, g: 1, kg: 1000, t: 1_000_000, oz: 28.349523125, lb: 453.59237, st: 6350.29318 },
  area: {
    "mm²": 1e-6,
    "cm²": 1e-4,
    "m²": 1,
    "km²": 1e6,
    "in²": 0.00064516,
    "ft²": 0.09290304,
    acre: 4046.8564224,
    hectare: 10000,
  },
  volume: {
    ml: 0.001,
    l: 1,
    "m³": 1000,
    tsp: 0.00492892159375,
    tbsp: 0.01478676478125,
    cup: 0.2365882365,
    "fl oz": 0.0295735295625,
    pint: 0.473176473,
    quart: 0.946352946,
    gallon: 3.785411784,
  },
  speed: { "m/s": 1, "km/h": 1 / 3.6, mph: 0.44704, knot: 0.514444444, "ft/s": 0.3048 },
  data: {
    bit: 0.125,
    byte: 1,
    KB: 1e3,
    MB: 1e6,
    GB: 1e9,
    TB: 1e12,
    KiB: 1024,
    MiB: 1024 ** 2,
    GiB: 1024 ** 3,
    TiB: 1024 ** 4,
  },
  time: {
    ms: 0.001,
    s: 1,
    min: 60,
    h: 3600,
    day: 86400,
    week: 604800,
    month: 2_629_746, // average Gregorian month
    year: 31_556_952, // average Gregorian year
  },
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
  const table = FACTORS[category];
  const fromFactor = table[from];
  const toFactor = table[to];
  if (!fromFactor || !toFactor) return Number.NaN;
  return (value * fromFactor) / toFactor;
}
