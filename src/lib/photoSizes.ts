export interface PhotoSize {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
}

export const photoSizes: PhotoSize[] = [
  { id: "passport-us", label: "US Passport (2x2 in)", widthMm: 50.8, heightMm: 50.8 },
  { id: "passport-in", label: "India Passport (35x45mm)", widthMm: 35, heightMm: 45 },
  { id: "passport-uk", label: "UK Passport (35x45mm)", widthMm: 35, heightMm: 45 },
  { id: "passport-eu", label: "Schengen Visa (35x45mm)", widthMm: 35, heightMm: 45 },
  { id: "id-card", label: "ID Card (25x35mm)", widthMm: 25, heightMm: 35 },
  { id: "custom", label: "Custom size", widthMm: 35, heightMm: 45 },
];

export const paperSizesMm = {
  A4: { widthMm: 210, heightMm: 297 },
  Letter: { widthMm: 215.9, heightMm: 279.4 },
} as const;

export type PaperSizeId = keyof typeof paperSizesMm;

export function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm / 25.4) * dpi);
}
