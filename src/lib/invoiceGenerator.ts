import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { sanitizeWinAnsi as sanitize } from "./pdfText";

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  businessName: string;
  businessAddress: string;
  customerName: string;
  invoiceNumber: string;
  date: string;
  items: InvoiceItem[];
  taxPercent: number;
  discount: number;
  /** Symbol or code shown next to every amount, e.g. "$", "£", "₹". */
  currency?: string;
  notes?: string;
}

export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "EUR " },
  { code: "GBP", symbol: "GBP " },
  { code: "INR", symbol: "INR " },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
  { code: "", symbol: "" },
] as const;

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;

/** Greedy word wrap against the embedded font's real metrics. */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (!text) return [""];
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildInvoicePdf(data: InvoiceData): Promise<{ blob: Blob; filename: string }> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const currency = data.currency ?? "";
  const money = (value: number) => sanitize(`${currency}${value.toFixed(2)}`);

  const colX = {
    desc: MARGIN,
    qty: PAGE_WIDTH - MARGIN - 170,
    price: PAGE_WIDTH - MARGIN - 110,
    total: PAGE_WIDTH - MARGIN - 50,
  };
  const descWidth = colX.qty - MARGIN - 12;

  let page: PDFPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function drawTableHeader() {
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    y -= 16;
    page.drawText("Item", { x: colX.desc, y, size: 10, font: bold });
    page.drawText("Qty", { x: colX.qty, y, size: 10, font: bold });
    page.drawText("Price", { x: colX.price, y, size: 10, font: bold });
    page.drawText("Total", { x: colX.total, y, size: 10, font: bold });
    y -= 8;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });
    y -= 16;
  }

  /** Starts a new page (repeating the table header) when `needed` won't fit. */
  function ensureSpace(needed: number, repeatHeader = false) {
    if (y - needed >= MARGIN) return;
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
    if (repeatHeader) drawTableHeader();
  }

  page.drawText("INVOICE", { x: MARGIN, y, size: 24, font: bold, color: rgb(0.05, 0.4, 0.3) });
  const invoiceNumber = sanitize(`#${data.invoiceNumber}`);
  page.drawText(invoiceNumber, {
    x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(invoiceNumber, 12),
    y: y + 4,
    size: 12,
    font,
  });
  y -= 34;

  page.drawText(sanitize(data.businessName), { x: MARGIN, y, size: 13, font: bold });
  y -= 16;
  for (const line of wrapText(sanitize(data.businessAddress), font, 10, PAGE_WIDTH - MARGIN * 2)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    y -= 13;
  }
  y -= 15;

  page.drawText("Bill To:", { x: MARGIN, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
  y -= 14;
  page.drawText(sanitize(data.customerName), { x: MARGIN, y, size: 12, font: bold });

  const dateLine = sanitize(`Date: ${data.date}`);
  page.drawText(dateLine, {
    x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(dateLine, 10),
    y: y + 14,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 30;

  drawTableHeader();

  let subtotal = 0;
  for (const item of data.items) {
    const lineTotal = item.quantity * item.price;
    subtotal += lineTotal;

    const descLines = wrapText(sanitize(item.description), font, 10, descWidth);
    ensureSpace(descLines.length * 13 + 6, true);

    const rowTop = y;
    descLines.forEach((line, i) => {
      page.drawText(line, { x: colX.desc, y: rowTop - i * 13, size: 10, font });
    });
    page.drawText(String(item.quantity), { x: colX.qty, y: rowTop, size: 10, font });
    page.drawText(money(item.price), { x: colX.price, y: rowTop, size: 10, font });
    page.drawText(money(lineTotal), { x: colX.total, y: rowTop, size: 10, font });

    y = rowTop - Math.max(1, descLines.length) * 13 - 5;
  }

  const discountAmount = (subtotal * data.discount) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * data.taxPercent) / 100;
  const total = taxable + taxAmount;

  // Keep the whole summary block together rather than orphaning the total.
  ensureSpace(90);
  y -= 6;
  page.drawLine({
    start: { x: PAGE_WIDTH - MARGIN - 200, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });
  y -= 16;

  function summaryLine(label: string, value: string, emphasize = false) {
    const f = emphasize ? bold : font;
    const size = emphasize ? 12 : 10;
    page.drawText(label, { x: PAGE_WIDTH - MARGIN - 200, y, size, font: f });
    page.drawText(value, {
      x: PAGE_WIDTH - MARGIN - f.widthOfTextAtSize(value, size),
      y,
      size,
      font: f,
    });
    y -= 18;
  }

  summaryLine("Subtotal", money(subtotal));
  if (data.discount) summaryLine(`Discount (${data.discount}%)`, `-${money(discountAmount)}`);
  if (data.taxPercent) summaryLine(`Tax (${data.taxPercent}%)`, money(taxAmount));
  summaryLine("Total", money(total), true);

  if (data.notes?.trim()) {
    ensureSpace(60);
    y -= 14;
    page.drawText("Notes", { x: MARGIN, y, size: 10, font: bold, color: rgb(0.4, 0.4, 0.4) });
    y -= 14;
    for (const line of wrapText(sanitize(data.notes), font, 10, PAGE_WIDTH - MARGIN * 2)) {
      ensureSpace(13);
      page.drawText(line, { x: MARGIN, y, size: 10, font, color: rgb(0.25, 0.25, 0.25) });
      y -= 13;
    }
  }

  const pdfBytes = await doc.save();
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: `invoice-${data.invoiceNumber || "draft"}.pdf`,
  };
}
