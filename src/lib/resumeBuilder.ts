import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  summary: string;
  experience: { role: string; company: string; period: string; details: string }[];
  education: { school: string; degree: string; period: string }[];
  skills: string;
}

export async function buildResumePdf(data: ResumeData): Promise<{ blob: Blob; filename: string }> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 50;
  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const lineHeight = 16;

  function ensureSpace(needed: number) {
    if (y - needed < margin) {
      page = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  }

  function drawText(text: string, options: { size?: number; useFont?: typeof font; color?: ReturnType<typeof rgb> } = {}) {
    const size = options.size ?? 11;
    const usedFont = options.useFont ?? font;
    const maxWidth = pageWidth - margin * 2;
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      const width = usedFont.widthOfTextAtSize(test, size);
      if (width > maxWidth && line) {
        ensureSpace(lineHeight);
        page.drawText(line, { x: margin, y, size, font: usedFont, color: options.color ?? rgb(0.1, 0.1, 0.1) });
        y -= lineHeight;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) {
      ensureSpace(lineHeight);
      page.drawText(line, { x: margin, y, size, font: usedFont, color: options.color ?? rgb(0.1, 0.1, 0.1) });
      y -= lineHeight;
    }
  }

  function heading(text: string) {
    ensureSpace(24);
    y -= 6;
    page.drawText(text.toUpperCase(), { x: margin, y, size: 12, font: bold, color: rgb(0.05, 0.4, 0.3) });
    y -= 4;
    page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
    y -= 14;
  }

  page.drawText(data.name || "Your Name", { x: margin, y, size: 22, font: bold });
  y -= 26;
  if (data.title) {
    page.drawText(data.title, { x: margin, y, size: 13, font, color: rgb(0.3, 0.3, 0.3) });
    y -= 18;
  }
  const contactLine = [data.email, data.phone].filter(Boolean).join("  •  ");
  if (contactLine) {
    page.drawText(contactLine, { x: margin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    y -= 20;
  }

  if (data.summary) {
    heading("Summary");
    drawText(data.summary);
    y -= 6;
  }

  if (data.experience.length) {
    heading("Experience");
    for (const exp of data.experience) {
      ensureSpace(lineHeight * 2);
      page.drawText(`${exp.role} — ${exp.company}`, { x: margin, y, size: 11, font: bold });
      const periodWidth = font.widthOfTextAtSize(exp.period, 10);
      page.drawText(exp.period, { x: pageWidth - margin - periodWidth, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
      y -= lineHeight;
      if (exp.details) drawText(exp.details, { size: 10, color: rgb(0.25, 0.25, 0.25) });
      y -= 4;
    }
  }

  if (data.education.length) {
    heading("Education");
    for (const edu of data.education) {
      ensureSpace(lineHeight);
      page.drawText(`${edu.degree} — ${edu.school}`, { x: margin, y, size: 11, font: bold });
      const periodWidth = font.widthOfTextAtSize(edu.period, 10);
      page.drawText(edu.period, { x: pageWidth - margin - periodWidth, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
      y -= lineHeight + 4;
    }
  }

  if (data.skills) {
    heading("Skills");
    drawText(data.skills);
  }

  const pdfBytes = await doc.save();
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    filename: `${(data.name || "resume").replace(/\s+/g, "-").toLowerCase()}-resume.pdf`,
  };
}
