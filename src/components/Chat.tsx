"use client";

import { useEffect, useRef, useState } from "react";

type Source = { n: number; short: string; page: number; url: string | null };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[] };

const SUGGESTIONS = [
  "¿Quién quiere bajar el alquiler?",
  "¿Quién baja impuestos?",
  "Compara PSOE y PP en pensiones",
  "¿Qué hay para los jóvenes?",
];

function renderText(text: string, sources?: Source[]) {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/);
    const s = m && sources?.find((x) => x.n === Number(m[1]));
    if (!s) return <span key={i}>{part}</span>;
    return (
      <a
        key={i}
        href={s.url ?? "#"}
        target="_blank"
        rel="noreferrer"
        title={`${s.short}, pág. ${s.page}`}
        className="mx-0.5 inline-block rounded-md bg-gualda px-1.5 text-xs font-bold text-tinta no-underline hover:bg-rojo hover:text-white"
      >
        {s.short} p.{s.page}
      </a>
    );
  });
}

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-ask-q],[data-ask-prefill]");
      if (!el) return;
      e.preventDefault();
      setOpen(true);
      if (el.dataset.askQ) sendRef.current(el.dataset.askQ);
      else {
        setInput(el.dataset.askPrefill ?? "");
        setTimeout(() => inputRef.current?.focus(), 250);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const sendRef = useRef<(t: string) => void>(() => {});
  useEffect(() => {
    sendRef.current = send;
  });

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const raw = res.headers.get("X-Sources");
      const sources: Source[] = raw ? JSON.parse(decodeURIComponent(raw)) : [];
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc, sources }]);
      }
      if (!acc) setMessages([...next, { role: "assistant", content: "No me ha llegado respuesta. Prueba otra vez.", sources }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Uy, algo ha fallado. Prueba otra vez." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border-[3px] border-tinta bg-rojo px-4 py-3 font-display text-base text-white sm:px-5 sm:py-3.5 sm:text-lg shadow-[4px_4px_0_var(--color-tinta)] transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6 ${open ? "max-sm:hidden" : ""}`}
      >
        {open ? "✕" : "Haz tu pregunta"}
      </button>
      <div
        className={`fixed z-40 flex flex-col overflow-hidden bg-white transition duration-200 max-sm:inset-0 sm:bottom-24 sm:right-6 sm:h-[min(640px,calc(100svh-8rem))] sm:w-[400px] sm:rounded-[2rem] sm:border-[3px] sm:border-tinta sm:shadow-[8px_8px_0_var(--color-tinta)] ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
      >
        <div className="flex items-center justify-between bg-tinta px-5 py-3 text-crema">
          <span className="font-display text-lg">quevoto? chat</span>
          <button onClick={() => setOpen(false)} aria-label="Cerrar" className="text-2xl leading-none">
            ✕
          </button>
        </div>
      <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="font-display text-3xl">¿Qué te ralla?</p>
            <p className="mt-2 text-tinta/70">Te digo lo que pone y en qué página.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border-2 border-tinta bg-crema px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-gualda"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-3xl rounded-br-md bg-rojo px-4 py-3 text-white"
                  : "max-w-[90%] whitespace-pre-wrap rounded-3xl rounded-bl-md bg-crema px-4 py-3 leading-relaxed"
              }
            >
              {m.role === "assistant" && !m.content ? (
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-tinta/50" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-tinta/50 [animation-delay:.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-tinta/50 [animation-delay:.3s]" />
                </span>
              ) : m.role === "assistant" ? (
                renderText(m.content, m.sources)
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t-[3px] border-tinta bg-crema p-3 pb-[max(.75rem,env(safe-area-inset-bottom))]"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta lo que quieras…"
          className="min-w-0 flex-1 rounded-full border-2 border-tinta bg-white px-5 py-3 text-base outline-none focus:ring-4 focus:ring-gualda"
          maxLength={400}
        />
        <button
          disabled={loading || !input.trim()}
          className="rounded-full bg-tinta px-5 py-3 font-bold text-crema transition hover:bg-rojo disabled:opacity-40"
        >
          Dale
        </button>
      </form>
      </div>
    </>
  );
}
