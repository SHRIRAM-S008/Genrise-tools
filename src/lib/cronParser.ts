const FIELD_NAMES = ["minute", "hour", "day of month", "month", "day of week"] as const;
const RANGES: [number, number][] = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 7], // 0 and 7 both mean Sunday
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_ALIASES: Record<string, number> = Object.fromEntries(
  MONTH_NAMES.map((name, i) => [name.toUpperCase(), i + 1])
);
const DAY_ALIASES: Record<string, number> = Object.fromEntries(
  DAY_NAMES.map((name, i) => [name.toUpperCase(), i])
);

/** `@daily` and friends, as understood by cron and most schedulers. */
const SHORTCUTS: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

export interface ParsedCron {
  fields: number[][];
  description: string;
  /** Cron ORs day-of-month and day-of-week when both are restricted. */
  domRestricted: boolean;
  dowRestricted: boolean;
}

function resolveToken(token: string, fieldIndex: number): number {
  const upper = token.toUpperCase();
  if (fieldIndex === 3 && upper in MONTH_ALIASES) return MONTH_ALIASES[upper];
  if (fieldIndex === 4 && upper in DAY_ALIASES) return DAY_ALIASES[upper];
  if (!/^\d+$/.test(token)) throw new Error(`Unrecognised value "${token}"`);
  return Number(token);
}

function parseField(raw: string, fieldIndex: number): number[] {
  const [min, max] = RANGES[fieldIndex];
  const values = new Set<number>();

  for (const part of raw.split(",")) {
    const [spec, stepRaw] = part.split("/");
    const step = stepRaw === undefined ? 1 : Number(stepRaw);
    if (!Number.isInteger(step) || step < 1) throw new Error(`Invalid step "${stepRaw}"`);

    let start: number;
    let end: number;

    if (spec === "*" || spec === "") {
      start = min;
      end = max;
    } else if (spec.includes("-")) {
      const [a, b] = spec.split("-");
      start = resolveToken(a, fieldIndex);
      end = resolveToken(b, fieldIndex);
    } else {
      start = resolveToken(spec, fieldIndex);
      // A bare value with a step ("5/15") runs from that value to the end.
      end = stepRaw === undefined ? start : max;
    }

    if (start < min || end > max || start > end) {
      throw new Error(`${FIELD_NAMES[fieldIndex]} out of range`);
    }
    for (let v = start; v <= end; v += step) values.add(v);
  }

  // Day-of-week 7 is Sunday, same as 0.
  if (fieldIndex === 4 && values.has(7)) {
    values.delete(7);
    values.add(0);
  }

  return [...values].sort((a, b) => a - b);
}

export function parseCron(expr: string): ParsedCron | null {
  const normalized = SHORTCUTS[expr.trim().toLowerCase()] ?? expr.trim();
  const parts = normalized.split(/\s+/);
  if (parts.length !== 5) return null;

  try {
    const fields = parts.map((p, i) => parseField(p, i));
    if (fields.some((f) => f.length === 0)) return null;
    return {
      fields,
      description: describeCron(parts, fields),
      domRestricted: parts[2] !== "*",
      dowRestricted: parts[4] !== "*",
    };
  } catch {
    return null;
  }
}

function joinList(values: string[]): string {
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function describeTime(minutes: number[], hours: number[], rawMinute: string): string {
  const everyMinute = minutes.length === 60;
  const everyHour = hours.length === 24;

  if (everyMinute && everyHour) return "every minute";

  const minuteStep = /^\*\/(\d+)$/.exec(rawMinute);
  if (minuteStep && everyHour) return `every ${minuteStep[1]} minutes`;
  if (minuteStep) {
    return `every ${minuteStep[1]} minutes, between ${pad(hours[0])}:00 and ${pad(hours[hours.length - 1])}:59`;
  }

  if (everyMinute) {
    return `every minute of ${joinList(hours.map((h) => `${pad(h)}:00`))}`;
  }

  if (everyHour) {
    return `at minute ${joinList(minutes.map(String))} of every hour`;
  }

  // Small cross-products read fine spelled out; big ones get a summary.
  const times = hours.length * minutes.length;
  if (times <= 6) {
    const stamps = hours.flatMap((h) => minutes.map((m) => `${pad(h)}:${pad(m)}`));
    return `at ${joinList(stamps)}`;
  }
  return `at minute ${joinList(minutes.map(String))} past hours ${joinList(hours.map(String))}`;
}

function describeCron(raw: string[], fields: number[][]): string {
  const [rawMinute, , rawDom, rawMonth, rawDow] = raw;
  const [minutes, hours, doms, months, dows] = fields;

  const timePart = describeTime(minutes, hours, rawMinute);
  const domPart = rawDom === "*" ? "" : ` on day ${joinList(doms.map(String))} of the month`;
  const monthPart = rawMonth === "*" ? "" : ` in ${joinList(months.map((m) => MONTH_NAMES[m - 1]))}`;
  const dowPart = rawDow === "*" ? "" : ` on ${joinList(dows.map((d) => DAY_NAMES[d]))}`;
  const both =
    rawDom !== "*" && rawDow !== "*"
      ? " (cron runs when either the day-of-month or the day-of-week matches)"
      : "";

  return `Runs ${timePart}${domPart}${monthPart}${dowPart}${both}.`;
}

export function nextRunTimes(parsed: ParsedCron, count: number, from = new Date()): Date[] {
  const [minutes, hours, doms, months, dows] = parsed.fields;
  const results: Date[] = [];
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  let iterations = 0;
  const maxIterations = 60 * 24 * 366 * 2;

  while (results.length < count && iterations < maxIterations) {
    iterations++;

    const domMatch = doms.includes(cursor.getDate());
    const dowMatch = dows.includes(cursor.getDay());
    // Cron's quirk: when both day fields are restricted, either one matching
    // is enough. When only one is restricted, only that one counts.
    const dayMatch =
      parsed.domRestricted && parsed.dowRestricted
        ? domMatch || dowMatch
        : parsed.domRestricted
          ? domMatch
          : parsed.dowRestricted
            ? dowMatch
            : true;

    if (
      dayMatch &&
      minutes.includes(cursor.getMinutes()) &&
      hours.includes(cursor.getHours()) &&
      months.includes(cursor.getMonth() + 1)
    ) {
      results.push(new Date(cursor));
    }

    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return results;
}

export { FIELD_NAMES, SHORTCUTS };
