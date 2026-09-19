function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
    const safeSrc = /^https?:\/\//i.test(src) ? src : "";
    return safeSrc ? `<img src="${safeSrc}" alt="${alt}" />` : escapeHtml(alt);
  });
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    const safeHref = /^https?:\/\//i.test(href) ? href : "#";
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  return out;
}

function tableRowCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDivider(line: string): boolean {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);
}

export function renderMarkdown(source: string): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];

  let inCodeBlock = false;
  let codeLines: string[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" = "ul";

  function flushList() {
    if (!listBuffer.length) return;
    const items = listBuffer.map((li) => `<li>${inline(li)}</li>`).join("");
    html.push(`<${listType}>${items}</${listType}>`);
    listBuffer = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        html.push(`<pre><code>${codeLines.map(escapeHtml).join("\n")}</code></pre>`);
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // GitHub-style table: a header row followed by a |---|---| divider.
    if (line.includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      flushList();
      const headers = tableRowCells(line);
      const bodyRows: string[][] = [];
      let cursor = i + 2;
      while (cursor < lines.length && lines[cursor].includes("|") && lines[cursor].trim()) {
        bodyRows.push(tableRowCells(lines[cursor]));
        cursor++;
      }
      const head = headers.map((h) => `<th>${inline(h)}</th>`).join("");
      const body = bodyRows
        .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`)
        .join("");
      html.push(`<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`);
      i = cursor - 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      flushList();
      html.push("<hr />");
      continue;
    }

    const orderedItem = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (orderedItem) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(orderedItem[1]);
      continue;
    }

    const listItem = line.match(/^\s*[-*+]\s+(.*)$/);
    if (listItem) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(listItem[1]);
      continue;
    }
    flushList();

    if (line.trim().startsWith(">")) {
      html.push(`<blockquote>${inline(line.replace(/^\s*>\s?/, ""))}</blockquote>`);
      continue;
    }

    if (line.trim() === "") continue;

    html.push(`<p>${inline(line)}</p>`);
  }

  flushList();
  if (inCodeBlock) {
    html.push(`<pre><code>${codeLines.map(escapeHtml).join("\n")}</code></pre>`);
  }

  return html.filter((l) => l !== "").join("\n");
}
