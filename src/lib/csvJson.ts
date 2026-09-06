export function csvToJson(csv: string): string {
  const rows = parseCsv(csv);
  if (rows.length === 0) return "[]";
  const [header, ...body] = rows;
  const objects = body.map((row) => {
    const obj: Record<string, string> = {};
    header.forEach((key, i) => {
      obj[key] = row[i] ?? "";
    });
    return obj;
  });
  return JSON.stringify(objects, null, 2);
}

export function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const rows: Record<string, unknown>[] = Array.isArray(data) ? data : [data];
  if (rows.length === 0) return "";
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const lines = [headers.map(escapeCsvCell).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsvCell(String(row[h] ?? ""))).join(","));
  }
  return lines.join("\n");
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

export function formatJson(json: string): string {
  return JSON.stringify(JSON.parse(json), null, 2);
}

export function minifyJson(json: string): string {
  return JSON.stringify(JSON.parse(json));
}
