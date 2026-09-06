const FIELD_NAMES = ["minute", "hour", "day of month", "month", "day of week"] as const;
const RANGES: [number, number][] = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 6],
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface ParsedCron {
  fields: number[][];
  description: string;
}

function parseField(raw: string, min: number, max: number): number[] {
  const values = new Set<number>();
  for (const part of raw.split(",")) {
    const stepMatch = part.match(/^(\*|\d+-\d+|\d+)\/(\d+)$/);
    if (stepMatch) {
      const [, base, stepStr] = stepMatch;
      const step = Number(stepStr);
      let start = min;
      let end = max;
      if (base !== "*") {
        const rangeMatch = base.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
          start = Number(rangeMatch[1]);
          end = Number(rangeMatch[2]);
        } else {
          start = Number(base);
        }
      }
      for (let v = start; v <= end; v += step) values.add(v);
      continue;
    }

    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      for (let v = start; v <= end; v++) values.add(v);
      continue;
    }

    if (part === "*") {
      for (let v = min; v <= max; v++) values.add(v);
      continue;
    }

    const n = Number(part);
    if (!Number.isNaN(n)) values.add(n);
  }
  return [...values].sort((a, b) => a - b);
}

export function parseCron(expr: string): ParsedCron | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  try {
    const fields = parts.map((p, i) => parseField(p, RANGES[i][0], RANGES[i][1]));
    if (fields.some((f) => f.length === 0)) return null;
    return { fields, description: describeCron(parts, fields) };
  } catch {
    return null;
  }
}

function describeCron(raw: string[], fields: number[][]): string {
  const [minute, hour, dom, month, dow] = raw;

  const timePart =
    minute === "*" && hour === "*"
      ? "every minute"
      : minute !== "*" && hour === "*"
        ? `at minute ${minute} of every hour`
        : `at ${hour.padStart(2, "0")}:${(fields[0][0] ?? 0).toString().padStart(2, "0")}`;

  const domPart = dom === "*" ? "" : ` on day ${dom} of the month`;
  const monthPart = month === "*" ? "" : ` in ${fields[3].map((m) => MONTH_NAMES[m - 1]).join(", ")}`;
  const dowPart = dow === "*" ? "" : ` on ${fields[4].map((d) => DAY_NAMES[d]).join(", ")}`;

  return `Runs ${timePart}${domPart}${monthPart}${dowPart}`.trim() + ".";
}

export function nextRunTimes(fields: number[][], count: number, from = new Date()): Date[] {
  const [minutes, hours, doms, months, dows] = fields;
  const results: Date[] = [];
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  let iterations = 0;
  const maxIterations = 60 * 24 * 366;

  while (results.length < count && iterations < maxIterations) {
    iterations++;
    const matches =
      minutes.includes(cursor.getMinutes()) &&
      hours.includes(cursor.getHours()) &&
      doms.includes(cursor.getDate()) &&
      months.includes(cursor.getMonth() + 1) &&
      dows.includes(cursor.getDay());

    if (matches) {
      results.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return results;
}

export { FIELD_NAMES };
