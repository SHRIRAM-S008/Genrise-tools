import JSZip from "jszip";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function paragraphXml(text: string): string {
  if (!text.trim()) {
    return `<w:p/>`;
  }
  return `<w:p><w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function pageBreakXml(): string {
  return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
}

const CONTENT_TYPES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOCUMENT_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;

function documentXml(pages: string[][]): string {
  const body = pages
    .map((lines, i) => {
      const paragraphs = lines.map(paragraphXml).join("");
      return i < pages.length - 1 ? paragraphs + pageBreakXml() : paragraphs;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}<w:sectPr/></w:body>
</w:document>`;
}

export async function pdfToWord(file: File): Promise<{ blob: Blob; filename: string }> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const bytes = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: bytes }).promise;

  const pages: string[][] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();

    const lines: string[] = [];
    let currentLine = "";
    let lastY: number | null = null;
    let lastEndX: number | null = null;

    for (const item of content.items) {
      if (!("str" in item)) continue;
      const transform = item.transform as number[];
      const x = transform[4];
      const y = transform[5];
      const fontHeight = Math.abs(transform[3]) || 10;
      const itemWidth = "width" in item && typeof item.width === "number" ? item.width : 0;

      // A new baseline (or an explicit end-of-line marker) starts a new line.
      if (lastY !== null && Math.abs(y - lastY) > fontHeight * 0.5) {
        lines.push(currentLine);
        currentLine = "";
        lastEndX = null;
      } else if (
        lastEndX !== null &&
        currentLine &&
        !currentLine.endsWith(" ") &&
        !item.str.startsWith(" ") &&
        x - lastEndX > fontHeight * 0.2
      ) {
        // PDFs encode inter-word gaps as positioning, not space characters —
        // without this, "Hello World" comes back as "HelloWorld".
        currentLine += " ";
      }

      currentLine += item.str;
      lastY = y;
      lastEndX = x + itemWidth;

      if ("hasEOL" in item && item.hasEOL) {
        lines.push(currentLine);
        currentLine = "";
        lastY = null;
        lastEndX = null;
      }
    }
    if (currentLine) lines.push(currentLine);

    pages.push(lines.length ? lines : [""]);
  }

  const zip = new JSZip();
  zip.file("[Content_Types].xml", CONTENT_TYPES_XML);
  zip.folder("_rels")!.file(".rels", RELS_XML);
  const wordFolder = zip.folder("word")!;
  wordFolder.file("document.xml", documentXml(pages));
  wordFolder.folder("_rels")!.file("document.xml.rels", DOCUMENT_RELS_XML);

  const blob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  return {
    blob,
    filename: file.name.replace(/\.pdf$/i, ".docx"),
  };
}
