"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { parties } from "@/data/parties";

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function PartySearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-find-party]")) return;
      e.preventDefault();
      setQ("");
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const results = useMemo(() => {
    const n = normalize(q.trim());
    if (!n) return parties;
    return parties.filter((p) =>
      [p.short, p.name, p.scope, ...p.aliases].some((s) => normalize(s).includes(n)),
    );
  }, [q]);

  const pick = (slug: string) => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("quevoto:party", { detail: slug }));
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-tinta/60 sm:items-center" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-label="Busca tu partido"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85svh] w-full flex-col overflow-hidden rounded-t-[2rem] border-[3px] border-tinta bg-crema sm:max-w-md sm:rounded-[2rem] sm:shadow-[8px_8px_0_var(--color-tinta)]"
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="font-display text-xl">Busca tu partido</span>
          <button onClick={() => setOpen(false)} aria-label="Cerrar" className="text-2xl leading-none">
            ✕
          </button>
        </div>
        <form
          className="px-5 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (results[0]) pick(results[0].slug);
          }}
        >
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="PSOE, Vox, Bildu, socialistas…"
            className="w-full rounded-full border-[3px] border-tinta bg-white px-5 py-3 text-base outline-none focus:border-rojo"
          />
        </form>
        <ul className="flex-1 overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {results.map((p) => (
            <li key={p.slug}>
              <button onClick={() => pick(p.slug)} className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left hover:bg-white">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-tinta bg-white p-1">
                  <Image src={p.logo} alt="" width={36} height={36} className="max-h-8 w-auto object-contain" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{p.short}</span>
                  <span className="block truncate text-xs text-tinta/60">{p.name} · {p.scope}</span>
                </span>
              </button>
            </li>
          ))}
          {!results.length && <li className="px-3 py-6 text-center text-sm text-tinta/60">No lo encuentro. Prueba con las siglas.</li>}
        </ul>
      </div>
    </div>
  );
}
