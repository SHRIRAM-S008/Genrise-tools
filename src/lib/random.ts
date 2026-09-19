/**
 * Uniform random integer in [0, max). Plain `crypto.getRandomValues()[0] % max`
 * is biased whenever max doesn't divide 2^32 evenly, so values above the
 * largest whole multiple of `max` are rejected and redrawn.
 */
export function randomInt(max: number): number {
  if (max <= 0) throw new Error("max must be positive");
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

/** Uniform random element of a non-empty array. */
export function randomItem<T>(items: readonly T[]): T {
  return items[randomInt(items.length)];
}

/** Fisher-Yates shuffle using the unbiased generator above. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
