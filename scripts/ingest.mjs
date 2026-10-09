// Usage: node scripts/ingest.mjs [year]
// Reads data/pdfs/<year>/<slug>.pdf and writes data/index/<year>.json (chunks with page numbers).
import fs from "node:fs";
import path from "node:path";
import { extractText, getDocumentProxy } from "unpdf";

const CHUNK = 1400;
const OVERLAP = 200;
const root = path.resolve(import.meta.dirname, "..");
const years = process.argv[2]
  ? [process.argv[2]]
  : fs.readdirSync(path.join(root, "data/pdfs")).filter((d) => /^\d{4}$/.test(d));

const clean = (s) =>
  s
    .replace(/\u00ad/g, "")
    .replace(/(\w)-\s*\n\s*(\w)/g, "$1$2")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();

function chunkPages(pages) {
  const chunks = [];
  for (let p = 0; p < pages.length; p++) {
    const text = clean(pages[p]);
    if (text.length < 80) continue;
    let start = 0;
    while (start < text.length) {
      let end = Math.min(text.length, start + CHUNK);
      if (end < text.length) {
        const cut = text.lastIndexOf(". ", end);
        if (cut > start + CHUNK * 0.6) end = cut + 1;
      }
      const piece = text.slice(start, end).trim();
      if (piece.length >= 80) chunks.push({ page: p + 1, text: piece });
      if (end >= text.length) break;
      start = end - OVERLAP;
    }
  }
  return chunks;
}

for (const year of years) {
  const dir = path.join(root, "data/pdfs", year);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".pdf")).sort();
  const out = { year: Number(year), chunks: [] };
  for (const file of files) {
    const party = path.basename(file, ".pdf");
    const pdf = await getDocumentProxy(new Uint8Array(fs.readFileSync(path.join(dir, file))));
    const { text } = await extractText(pdf, { mergePages: false });
    const chunks = chunkPages(text);
    chunks.forEach((c, i) => out.chunks.push({ id: `${year}-${party}-${i}`, party, ...c }));
    console.log(`${year} ${party}: ${text.length} páginas, ${chunks.length} trozos`);
  }
  fs.mkdirSync(path.join(root, "data/index"), { recursive: true });
  fs.writeFileSync(path.join(root, "data/index", `${year}.json`), JSON.stringify(out));
  console.log(`→ data/index/${year}.json (${out.chunks.length} trozos)`);
}
