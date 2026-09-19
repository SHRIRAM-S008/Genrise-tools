/**
 * The 14 standard PDF fonts are WinAnsi-encoded: pdf-lib throws on any
 * character outside that set (₹, →, emoji, Devanagari…). Replacing those
 * characters keeps a stray paste from failing the whole export.
 */
export function sanitizeWinAnsi(text: string): string {
  return text.replace(/[^\x20-\x7E\xA0-\xFF–—‘’“”•…€]/g, "?");
}
