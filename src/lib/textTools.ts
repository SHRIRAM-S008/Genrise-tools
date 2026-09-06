export function countStats(text: string) {
  const words = text.trim().length ? text.trim().split(/\s+/) : [];
  const sentences = text.trim().length ? text.split(/[.!?]+\s*/).filter(Boolean) : [];
  const lines = text.length ? text.split(/\r\n|\r|\n/) : [];
  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: words.length,
    sentences: sentences.length,
    lines: lines.length,
    readingTimeMinutes: Math.max(1, Math.round(words.length / 200)),
  };
}

export const caseConverters = {
  upper: (t: string) => t.toUpperCase(),
  lower: (t: string) => t.toLowerCase(),
  title: (t: string) =>
    t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  sentence: (t: string) =>
    t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (m) => m.toUpperCase()),
};

export function removeDuplicateLines(text: string): string {
  const seen = new Set<string>();
  return text
    .split(/\r\n|\r|\n/)
    .filter((line) => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    })
    .join("\n");
}

export function removeEmptyLines(text: string): string {
  return text
    .split(/\r\n|\r|\n/)
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

export function sortLines(text: string, direction: "asc" | "desc" = "asc"): string {
  const lines = text.split(/\r\n|\r|\n/);
  lines.sort((a, b) => (direction === "asc" ? a.localeCompare(b) : b.localeCompare(a)));
  return lines.join("\n");
}

export function reverseLines(text: string): string {
  return text.split(/\r\n|\r|\n/).reverse().join("\n");
}

export function removeExtraSpaces(text: string): string {
  return text.replace(/[ \t]+/g, " ").replace(/ +\n/g, "\n");
}
