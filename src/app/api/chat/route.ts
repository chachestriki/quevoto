import OpenAI from "openai";
import { partyBySlug } from "@/data/parties";
import { cacheGet, cacheSet, checkUser, clientIp, takeGlobalAi } from "@/lib/ratelimit";
import { availableYears, detectParties, normalize, search } from "@/lib/search";

export const maxDuration = 60;

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM = `Eres "quevoto?", un colega que explica los programas electorales de los partidos españoles.
Reglas:
- Responde SIEMPRE en castellano, con palabras sencillas y de la calle, para que lo entienda tanto un chaval de 16 como su abuela. Frases cortas. Nada de tecnicismos sin explicar.
- Usa SOLO la información de los fragmentos que te paso. Si no está ahí, dilo claro: "eso no lo he encontrado en los programas".
- Algunos fragmentos están en catalán o gallego: tradúcelos tú.
- Sé neutral: no recomiendes votar a nadie ni opines. Si te piden a quién votar, explica qué propone cada uno sobre lo que le importa a la persona.
- Nunca valores ni compares a los partidos con juicios ("el que más recorta", "el mejor", "el más radical"). Cuenta lo que propone cada uno y deja que la persona saque sus conclusiones. No cierres con una conclusión propia.
- Si un partido no sale en los fragmentos, no digas que "no lo menciona" en su programa: di "en lo que he encontrado no sale".
- Cita cada dato con su número entre corchetes, por ejemplo [2].
- Formato markdown: el nombre de cada partido en **negrita** en su propia línea y debajo una lista con "- ". Nada de títulos con #, tablas ni HTML.
- Máximo unas 200 palabras salvo que pidan más detalle.`;

function encodeSources(sources: object[]) {
  return encodeURIComponent(JSON.stringify(sources));
}

const MAX_Q = 400;
const plain = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return new Response("Origen no permitido.", { status: 403, headers: plain });
  }
  if (Number(req.headers.get("content-length") ?? 0) > 30_000) {
    return new Response("Mensaje demasiado largo.", { status: 413, headers: plain });
  }
  const body = (await req.json().catch(() => null)) as { messages?: Msg[]; year?: number } | null;
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8);
  const question = [...messages].reverse().find((m) => m.role === "user")?.content?.trim().slice(0, MAX_Q);
  if (!question) return new Response("Falta la pregunta.", { status: 400, headers: plain });

  if (!(await checkUser(clientIp(req)))) {
    return new Response("Has hecho muchas preguntas seguidas. Vuelve en un rato y seguimos.", {
      status: 429,
      headers: { ...plain, "Retry-After": "3600" },
    });
  }

  const years = availableYears();
  const year = years.includes(Number(body?.year)) ? Number(body!.year) : years.at(-1)!;

  const prevUser = messages.filter((m) => m.role === "user").slice(-2, -1)[0]?.content ?? "";
  let mentioned = detectParties(question);
  if (!mentioned.length) mentioned = detectParties(prevUser);
  const retrievalQuery = `${question} ${prevUser}`;
  const hits = mentioned.length
    ? search(retrievalQuery, { year, party: mentioned, limit: Math.max(6, mentioned.length * 3), perParty: 4 })
    : search(retrievalQuery, { year, limit: 12, perParty: 2 });

  const sources = hits.map((h, i) => {
    const p = partyBySlug[h.party];
    const url = p?.programmes[year as 2023]?.url;
    return { n: i + 1, party: h.party, short: p?.short ?? h.party, page: h.page, url: url ? `${url}#page=${h.page}` : null };
  });

  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Sources": encodeSources(sources),
  };

  if (!hits.length) {
    return new Response("No he encontrado nada sobre eso en los programas. Prueba a preguntarlo con otras palabras (por ejemplo: alquiler, pensiones, impuestos…).", { headers });
  }

  const context = hits
    .map((h, i) => `[${i + 1}] ${partyBySlug[h.party]?.short ?? h.party} · programa ${year} · pág. ${h.page}\n${h.text}`)
    .join("\n\n---\n\n");

  const rawAnswer = (intro: string) =>
    new Response(
      intro +
      hits
        .slice(0, 5)
        .map((h, i) => `[${i + 1}] ${h.text.replace(/\s+/g, " ").slice(0, 280)}…`)
        .join("\n\n"),
      { headers },
    );

  if (!process.env.OPENAI_API_KEY) return rawAnswer("El chat aún no tiene la IA conectada, pero esto es lo que dicen los programas:\n\n");

  const firstTurn = messages.filter((m) => m.role === "user").length === 1;
  const cacheKey = firstTurn ? `${year}:${normalize(question).replace(/[^a-z0-9]+/g, " ").trim()}` : null;
  if (cacheKey) {
    const cached = await cacheGet(cacheKey);
    if (cached) return new Response(cached, { headers });
  }

  if (!(await takeGlobalAi())) return rawAnswer("Hoy la IA ha currado mucho y está descansando. Te dejo lo que dicen los programas tal cual:\n\n");


  const client = new OpenAI();
  const history = messages.slice(0, -1).slice(-6);
  try {
    const stream = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 600,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM },
        ...history.map((m) => ({ role: m.role, content: m.content.slice(0, 2000) })),
        { role: "user", content: `Fragmentos de los programas de ${year}:\n\n${context}\n\nPregunta: ${question}` },
      ],
    });
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let full = "";
        try {
          for await (const part of stream) {
            const delta = part.choices[0]?.delta?.content;
            if (delta) {
              full += delta;
              controller.enqueue(encoder.encode(delta));
            }
          }
          if (cacheKey && full) await cacheSet(cacheKey, full);
        } catch {
          controller.enqueue(encoder.encode("\n\n(Se ha cortado la respuesta, vuelve a intentarlo.)"));
        }
        controller.close();
      },
    });
    return new Response(readable, { headers });
  } catch (err) {
    console.error("openai error", err instanceof Error ? err.message : err);
    return new Response("Uy, la IA no responde ahora mismo. Inténtalo en un rato.", { status: 502, headers });
  }
}
