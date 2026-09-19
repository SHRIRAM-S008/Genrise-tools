/**
 * Parses a `YYYY-MM-DD` value from an <input type="date"> as a *local*
 * midnight. `new Date("2000-01-01")` parses as UTC midnight, which is the
 * previous calendar day everywhere west of Greenwich — enough to make an
 * age or a day count come out one day short.
 */
export function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Whole days between two local dates, immune to DST shifts. */
export function daysBetween(earlier: Date, later: Date): number {
  const a = Date.UTC(earlier.getFullYear(), earlier.getMonth(), earlier.getDate());
  const b = Date.UTC(later.getFullYear(), later.getMonth(), later.getDate());
  return Math.round((b - a) / 86_400_000);
}

/** Today as `YYYY-MM-DD` in the user's own timezone. */
export function todayInputValue(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
