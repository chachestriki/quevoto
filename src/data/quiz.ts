// Posturas orientativas (0–3) a partir de los programas de 2023. null = el programa no se moja.
export type TopicId = "inmigracion" | "vivienda" | "impuestos" | "trabajo" | "derechos" | "territorio" | "sanidad";

export type Topic = { id: TopicId; label: string; emoji: string; q: string; options: [string, string, string, string] };

export const topics: Topic[] = [
  {
    id: "inmigracion",
    label: "Inmigración",
    emoji: "🌍",
    q: "¿Qué hacemos con la inmigración?",
    options: [
      "Expulsar a quien entre sin papeles y cerrar más la frontera",
      "Que solo entren con un contrato de trabajo",
      "Regularizar con orden a quien ya vive y trabaja aquí",
      "Regularizar a todos los que ya están aquí",
    ],
  },
  {
    id: "vivienda",
    label: "Vivienda",
    emoji: "🏠",
    q: "¿Cómo bajamos el precio de la vivienda?",
    options: [
      "Bajar impuestos y quitar trabas para que se construya más",
      "Ayudas para comprar y mano dura con la okupación",
      "Poner topes al alquiler donde está muy caro",
      "Topes fuertes al alquiler y mucha vivienda pública",
    ],
  },
  {
    id: "impuestos",
    label: "Impuestos",
    emoji: "💶",
    q: "¿Y los impuestos?",
    options: [
      "Bajarlos a todo el mundo",
      "Bajarlos sobre todo a familias y autónomos",
      "Que paguen más la banca y las grandes fortunas",
      "Subirlos bastante a los que más tienen y a las grandes empresas",
    ],
  },
  {
    id: "trabajo",
    label: "Trabajo",
    emoji: "💼",
    q: "¿Qué hacemos con el trabajo y los sueldos?",
    options: [
      "Menos reglas para contratar y despedir",
      "Bajar lo que pagan las empresas para que contraten más",
      "Seguir subiendo el salario mínimo",
      "Subir sueldos y trabajar menos horas",
    ],
  },
  {
    id: "derechos",
    label: "Derechos",
    emoji: "⚖️",
    q: "¿Qué hacemos con el aborto y la eutanasia?",
    options: [
      "Quitar esas leyes",
      "Dejarlo como está, sin ampliar nada",
      "Mantenerlos y garantizarlos en la sanidad pública",
      "Blindarlos y ampliarlos",
    ],
  },
  {
    id: "territorio",
    label: "Territorio",
    emoji: "🗺️",
    q: "¿Cómo organizamos España?",
    options: [
      "Que el Estado recupere poder de las autonomías",
      "Dejar las autonomías como están",
      "Más autogobierno para las comunidades",
      "Que cada nación pueda votar si se independiza",
    ],
  },
  {
    id: "sanidad",
    label: "Sanidad",
    emoji: "🏥",
    q: "¿Cómo arreglamos la sanidad?",
    options: [
      "Tirar más de la privada para quitar listas de espera",
      "Pública, con ayuda de la privada cuando haga falta",
      "Más dinero y más médicos para la pública",
      "Solo pública, nada de privatizar",
    ],
  },
];

type Pos = 0 | 1 | 2 | 3 | null;

export const positions: Record<string, Record<TopicId, Pos>> = {
  psoe: { inmigracion: 2, vivienda: 2, impuestos: 2, trabajo: 2, derechos: 3, territorio: 1, sanidad: 2 },
  pp: { inmigracion: 1, vivienda: 1, impuestos: 1, trabajo: 1, derechos: 1, territorio: 1, sanidad: 1 },
  vox: { inmigracion: 0, vivienda: 0, impuestos: 0, trabajo: 1, derechos: 0, territorio: 0, sanidad: 1 },
  sumar: { inmigracion: 3, vivienda: 3, impuestos: 3, trabajo: 3, derechos: 3, territorio: 2, sanidad: 3 },
  erc: { inmigracion: 3, vivienda: 3, impuestos: 3, trabajo: 3, derechos: 3, territorio: 3, sanidad: 3 },
  junts: { inmigracion: 1, vivienda: 1, impuestos: 1, trabajo: 1, derechos: 2, territorio: 3, sanidad: 2 },
  pnv: { inmigracion: 2, vivienda: 2, impuestos: 1, trabajo: 2, derechos: 2, territorio: 2, sanidad: 2 },
  bildu: { inmigracion: 3, vivienda: 3, impuestos: 3, trabajo: 3, derechos: 3, territorio: 3, sanidad: 3 },
  bng: { inmigracion: 3, vivienda: 3, impuestos: 3, trabajo: 3, derechos: 3, territorio: 3, sanidad: 3 },
  upn: { inmigracion: 1, vivienda: 1, impuestos: 1, trabajo: 1, derechos: 1, territorio: 1, sanidad: 1 },
  pacma: { inmigracion: null, vivienda: 2, impuestos: 2, trabajo: 2, derechos: 3, territorio: null, sanidad: 3 },
  cup: { inmigracion: 3, vivienda: 3, impuestos: 3, trabajo: 3, derechos: 3, territorio: 3, sanidad: 3 },
};

const NATIONAL = ["psoe", "pp", "vox", "sumar", "pacma"];

export const regions: { id: string; label: string; parties: string[] }[] = [
  { id: "cat", label: "Cataluña", parties: [...NATIONAL, "erc", "junts", "cup"] },
  { id: "eus", label: "Euskadi", parties: [...NATIONAL, "pnv", "bildu"] },
  { id: "nav", label: "Navarra", parties: [...NATIONAL, "bildu", "upn"] },
  { id: "gal", label: "Galicia", parties: [...NATIONAL, "bng"] },
  { id: "resto", label: "Otra comunidad", parties: NATIONAL },
];

export type Answers = Partial<Record<TopicId, number>>;

export function rank(answers: Answers, region: string, priority: TopicId | null) {
  const allowed = regions.find((r) => r.id === region)?.parties ?? NATIONAL;
  return allowed
    .map((slug) => {
      let sum = 0;
      let total = 0;
      const agree: TopicId[] = [];
      const clash: TopicId[] = [];
      for (const t of topics) {
        const u = answers[t.id];
        const p = positions[slug]?.[t.id];
        if (u === undefined || p === null || p === undefined) continue;
        const w = t.id === priority ? 2 : 1;
        const d = Math.abs(u - p);
        sum += w * (1 - d / 3);
        total += w;
        if (d === 0) agree.push(t.id);
        if (d >= 2) clash.push(t.id);
      }
      return { slug, score: total ? Math.round((sum / total) * 100) : 0, agree, clash, answered: total };
    })
    .filter((r) => r.answered > 0)
    .sort((a, b) => b.score - a.score);
}
