import fs from "node:fs";
import path from "node:path";
import { parties } from "@/data/parties";

export type Chunk = { id: string; party: string; page: number; text: string };

type Doc = Chunk & { len: number; tf: Map<string, number> };
type YearIndex = { docs: Doc[]; df: Map<string, number>; avg: number };

const K1 = 1.2;
const B = 0.75;

const STOP = new Set(
  "que los las del por para con una uno unos unas como mas pero sus este esta estos estas son ser han hay les nos todo todos todas sobre entre desde hasta cuando donde quien partido partidos programa propone proponen dice pasa cada piensa piensan opina hacer hara haran quiere quieren the and amb per els les dels una son com".split(" "),
);

const SYNONYMS: Record<string, string[]> = {
  vivien: ["habitatge", "vivenda", "etxebizitza"],
  alquil: ["lloguer", "aluguer", "arrendament"],
  piso: ["vivienda", "habitatge", "vivenda"],
  derech: ["drets", "dereitos", "libertades", "igualdad", "lgtbi", "aborto", "eutanasia"],
  okupa: ["ocupacion", "ocupacio"],
  trabaj: ["treball", "traballo", "laboral"],
  curro: ["trabajo", "empleo", "treball", "traballo"],
  empleo: ["ocupacio", "emprego", "treball"],
  salari: ["salari", "salario", "soldo", "smi"],
  sueldo: ["salario", "salari", "smi"],
  impues: ["impostos", "impost", "fiscal", "tributacion"],
  pasta: ["impuestos", "fiscal", "dinero"],
  sanida: ["sanitat", "saude", "salut", "sanitaria"],
  salud: ["salut", "saude", "sanidad"],
  medico: ["sanidad", "salut", "saude", "atencion primaria"],
  educac: ["educacio", "ensenyament", "ensino", "escola"],
  colegi: ["escola", "educacion", "educacio"],
  inmigr: ["immigracio", "migrant", "migrantes", "estranxeiria", "fronteras"],
  pensio: ["pensions", "pensions", "jubilacion", "jubilacio"],
  jubila: ["pension", "pensio", "jubilacio"],
  joven: ["joves", "xuventude", "mocidade", "juventud", "jovenes"],
  mujer: ["dona", "dones", "muller", "mulleres", "igualdad", "feminismo"],
  igual: ["igualtat", "igualdade"],
  energi: ["energia", "enerxia", "electricidad", "luz"],
  luz: ["electricidad", "energia", "factura"],
  clima: ["climatic", "climatica", "climatico", "emisiones"],
  indepe: ["independencia", "autodeterminacio", "autodeterminacion", "referendum"],
  catalu: ["catalunya", "catalans"],
  galici: ["galiza", "galegos"],
  lengua: ["llengua", "lingua", "idioma", "catala", "euskera", "galego"],
  agua: ["aigua", "auga", "hidrico"],
  animal: ["animals", "animais", "maltrato"],
  toros: ["tauromaquia", "corridas", "taurinos"],
  transp: ["transport", "tren", "ferrocarril", "rodalies"],
  tren: ["ferrocarril", "rodalies", "transport"],
  famili: ["families", "familias", "natalidad", "hijos", "fills"],
  segurid: ["seguretat", "seguridade", "policia"],
  europa: ["europea", "europeu"],
  autono: ["autonomos", "autonoms", "autonomos"],
  empres: ["empreses", "empresas", "pyme", "pymes"],
};

export const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function tokenize(s: string): string[] {
  const words = normalize(s).match(/[a-z0-9ñç]{3,}/g) ?? [];
  return words.filter((w) => !STOP.has(w)).map((w) => w.slice(0, 6));
}

function expandQuery(q: string): string[] {
  const base = tokenize(q);
  const extra = base.flatMap((t) => (SYNONYMS[t] ?? []).flatMap(tokenize));
  return [...new Set([...base, ...extra])];
}

const cache = new Map<number, YearIndex>();

export function availableYears(): number[] {
  const dir = path.join(process.cwd(), "data/index");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}\.json$/.test(f))
    .map((f) => Number(f.slice(0, 4)))
    .sort();
}

function load(year: number): YearIndex | null {
  if (cache.has(year)) return cache.get(year)!;
  const file = path.join(process.cwd(), "data/index", `${year}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as { chunks: Chunk[] };
  const df = new Map<string, number>();
  let total = 0;
  const docs = raw.chunks.map((c) => {
    const toks = tokenize(c.text);
    const tf = new Map<string, number>();
    for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    total += toks.length;
    return { ...c, len: toks.length, tf };
  });
  const idx = { docs, df, avg: total / Math.max(1, docs.length) };
  cache.set(year, idx);
  return idx;
}

export function detectParties(q: string): string[] {
  const text = ` ${normalize(q).replace(/[^a-z0-9ñç' ]/g, " ")} `;
  return parties
    .filter((p) => p.aliases.some((a) => text.includes(` ${normalize(a)} `)))
    .map((p) => p.slug);
}

export function search(
  query: string,
  { year, party, limit = 10, perParty = 2 }: { year: number; party?: string[]; limit?: number; perParty?: number },
): (Chunk & { score: number })[] {
  const idx = load(year);
  if (!idx) return [];
  const q = expandQuery(query);
  if (!q.length) return [];
  const N = idx.docs.length;
  const scored: (Chunk & { score: number })[] = [];
  for (const d of idx.docs) {
    if (party?.length && !party.includes(d.party)) continue;
    let s = 0;
    for (const t of q) {
      const f = d.tf.get(t);
      if (!f) continue;
      const n = idx.df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      s += (idf * f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / idx.avg));
    }
    if (s > 0) scored.push({ id: d.id, party: d.party, page: d.page, text: d.text, score: s });
  }
  scored.sort((a, b) => b.score - a.score);
  const counts = new Map<string, number>();
  const out: (Chunk & { score: number })[] = [];
  for (const c of scored) {
    const n = counts.get(c.party) ?? 0;
    if (n >= perParty) continue;
    counts.set(c.party, n + 1);
    out.push(c);
    if (out.length >= limit) break;
  }
  return out;
}
