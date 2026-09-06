import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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
}

export async function buildInvoicePdf(data: InvoiceData): Promise<{ blob: Blob; filename: string }> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 50;
  const page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  page.drawText("INVOICE", { x: margin, y, size: 24, font: bold, color: rgb(0.05, 0.4, 0.3) });
  const invNumWidth = font.widthOfTextAtSize(`#${data.invoiceNumber}`, 12);
  page.drawText(`#${data.invoiceNumber}`, { x: pageWidth - margin - invNumWidth, y: y + 4, size: 12, font });
  y -= 34;

  page.drawText(data.businessName, { x: margin, y, size: 13, font: bold });
  y -= 16;
  page.drawText(data.businessAddress, { x: margin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
  y -= 28;

  page.drawText("Bill To:", { x: margin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
  y -= 14;
  page.drawText(data.customerName, { x: margin, y, size: 12, font: bold });

  const dateWidth = font.widthOfTextAtSize(`Date: ${data.date}`, 10);
  page.drawText(`Date: ${data.date}`, { x: pageWidth - margin - dateWidth, y: y + 14, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
  y -= 30;

  const colX = { desc: margin, qty: pageWidth - margin - 160, price: pageWidth - margin - 100, total: pageWidth - margin - 40 };
  page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });
  y -= 16;
  page.drawText("Item", { x: colX.desc, y, size: 10, font: bold });
  page.drawText("Qty", { x: colX.qty, y, size: 10, font: bold });
  page.drawText("Price", { x: colX.price, y, size: 10, font: bold });
  page.drawText("Total", { x: colX.total, y, size: 10, font: bold });
  y -= 8;
  page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
  y -= 16;

  let subtotal = 0;
  for (const item of data.items) {
    const lineTotal = item.quantity * item.price;
    subtotal += lineTotal;
    page.drawText(item.description, { x: colX.desc, y, size: 10, font });
    page.drawText(String(item.quantity), { x: colX.qty, y, size: 10, font });
    page.drawText(item.price.toFixed(2), { x: colX.price, y, size: 10, font });
    page.drawText(lineTotal.toFixed(2), { x: colX.total, y, size: 10, font });
    y -= 18;
  }

  y -= 6;
  page.drawLine({ start: { x: pageWidth - margin - 200, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
  y -= 16;

  const discountAmount = (subtotal * data.discount) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * data.taxPercent) / 100;
  const total = taxable + taxAmount;

  function summaryLine(label: string, value: string, emphasize = false) {
    const f = emphasize ? bold : font;
    const size = emphasize ? 12 : 10;
    page.drawText(label, { x: pageWidth - margin - 200, y, size, font: f });
    const valueWidth = f.widthOfTextAtSize(value, size);
    page.drawText(value, { x: pageWidth - margin - valueWidth, y, size, font: f });
    y -= 18;
  }

  summaryLine("Subtotal", subtotal.toFixed(2));
  if (data.discount) summaryLine(`Discount (${data.discount}%)`, `-${discountAmount.toFixed(2)}`);
  if (data.taxPercent) summaryLine(`Tax (${data.taxPercent}%)`, taxAmount.toFixed(2));
  summaryLine("Total", total.toFixed(2), true);

  const pdfBytes = await doc.save();
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: `invoice-${data.invoiceNumber || "draft"}.pdf`,
  };
}
