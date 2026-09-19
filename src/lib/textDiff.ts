export type DiffLine = {
  type: "same" | "added" | "removed";
  text: string;
  /** Word-level segments, set on paired add/remove lines. */
  words?: DiffWord[];
};

export type DiffWord = { text: string; changed: boolean };

const MAX_LCS_CELLS = 4_000_000;

export function diffLines(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");

  const result =
    linesA.length * linesB.length > MAX_LCS_CELLS
      ? cheapDiff(linesA, linesB)
      : lcsDiff(linesA, linesB);

  return annotateWords(result);
}

/** Classic LCS backtrack — exact, but quadratic in memory. */
function lcsDiff(linesA: string[], linesB: string[]): DiffLine[] {
  const n = linesA.length;
  const m = linesB.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = linesA[i] === linesB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (linesA[i] === linesB[j]) {
      result.push({ type: "same", text: linesA[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "removed", text: linesA[i] });
      i++;
    } else {
      result.push({ type: "added", text: linesB[j] });
      j++;
    }
  }
  while (i < n) result.push({ type: "removed", text: linesA[i++] });
  while (j < m) result.push({ type: "added", text: linesB[j++] });

  return result;
}

/**
 * Fallback for very large inputs: a positional comparison. Less precise than
 * LCS but it can't exhaust memory on two 10k-line files.
 */
function cheapDiff(linesA: string[], linesB: string[]): DiffLine[] {
  const result: DiffLine[] = [];
  const max = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < max; i++) {
    const left = linesA[i];
    const right = linesB[i];
    if (left === right) {
      result.push({ type: "same", text: left ?? "" });
      continue;
    }
    if (left !== undefined) result.push({ type: "removed", text: left });
    if (right !== undefined) result.push({ type: "added", text: right });
  }
  return result;
}

/** Marks which words differ on a removed line immediately followed by an added one. */
function annotateWords(lines: DiffLine[]): DiffLine[] {
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].type !== "removed" || lines[i + 1].type !== "added") continue;
    const [left, right] = diffWords(lines[i].text, lines[i + 1].text);
    lines[i].words = left;
    lines[i + 1].words = right;
  }
  return lines;
}

function tokenize(text: string): string[] {
  return text.match(/\s+|[^\s]+/g) ?? [];
}

export function diffWords(a: string, b: string): [DiffWord[], DiffWord[]] {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);

  // Trim the shared prefix and suffix, then mark whatever is left as changed.
  let start = 0;
  while (start < tokensA.length && start < tokensB.length && tokensA[start] === tokensB[start]) start++;

  let endA = tokensA.length;
  let endB = tokensB.length;
  while (endA > start && endB > start && tokensA[endA - 1] === tokensB[endB - 1]) {
    endA--;
    endB--;
  }

  const build = (tokens: string[], end: number): DiffWord[] => {
    const words: DiffWord[] = [];
    if (start > 0) words.push({ text: tokens.slice(0, start).join(""), changed: false });
    if (end > start) words.push({ text: tokens.slice(start, end).join(""), changed: true });
    if (end < tokens.length) words.push({ text: tokens.slice(end).join(""), changed: false });
    return words;
  };

  return [build(tokensA, endA), build(tokensB, endB)];
}
