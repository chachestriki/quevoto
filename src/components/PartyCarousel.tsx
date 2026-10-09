"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { parties } from "@/data/parties";

export default function PartyCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(parties.length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative h-[100svh] bg-tinta">
      <div
        ref={track}
        onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {parties.map((p) => {
          const prog = p.programmes[2023];
          return (
            <article
              key={p.slug}
              className="relative flex h-full w-full shrink-0 snap-center flex-col justify-center overflow-hidden px-4 pb-28 pt-14 sm:px-10 sm:pb-24"
              style={{ background: `linear-gradient(160deg, ${p.color} 0%, ${p.color} 38%, var(--color-crema) 38%)` }}
            >
              <div className="mx-auto flex w-full max-w-3xl flex-col">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-tinta bg-white p-1.5 shadow-[3px_3px_0_var(--color-tinta)] sm:h-24 sm:w-24 sm:rounded-3xl sm:p-2.5">
                    <Image src={p.logo} alt={`Logo de ${p.short}`} width={72} height={72} className="max-h-10 w-auto object-contain sm:max-h-16" />
                  </div>
                  <div>
                    <h3 className="font-display text-3xl leading-none text-white [text-shadow:3px_3px_0_var(--color-tinta)] sm:text-6xl">{p.short}</h3>
                    <p className="mt-1 text-xs font-bold text-white/90 sm:text-sm">{p.scope}</p>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl border-[3px] border-tinta bg-white px-4 py-2.5 text-base font-bold sm:mt-6 sm:py-3 leading-snug shadow-[4px_4px_0_var(--color-tinta)] sm:text-2xl">
                  {p.tagline}
                </p>
                {prog ? (
                  <ul className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                    {p.points.map((pt) => (
                      <li key={pt.label} className="rounded-xl border-2 border-tinta/15 bg-white/95 px-3.5 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                        <span className="text-[11px] font-black uppercase tracking-widest sm:text-xs" style={{ color: p.color }}>
                          {pt.label}
                        </span>
                        <p className="text-[15px] font-semibold leading-snug sm:text-base">{pt.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 rounded-2xl border-2 border-dashed border-tinta/30 bg-white/70 p-5 text-center font-semibold">
                    Próximamente: no hay programa para las generales de 2023.
                  </p>
                )}
                {prog && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5">
                    <button
                      data-ask-prefill={`¿Qué propone ${p.short} sobre `}
                      className="rounded-full bg-tinta px-4 py-2 text-sm font-bold text-crema hover:bg-rojo sm:px-5 sm:py-2.5 sm:text-base"
                    >
                      Pregúntale a {p.short}
                    </button>
                    <a href={prog.url} target="_blank" rel="noreferrer" className="text-sm font-bold underline underline-offset-4">
                      Programa en PDF
                    </a>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-3 flex items-center justify-center gap-3 px-4 sm:bottom-5 sm:top-auto">
        <button
          onClick={() => go(active - 1)}
          disabled={active === 0}
          aria-label="Anterior"
          className="pointer-events-auto hidden h-11 w-11 items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-black disabled:opacity-30 sm:flex"
        >
          ←
        </button>
        <div className="pointer-events-auto flex justify-center gap-1 rounded-full bg-tinta/80 px-2.5 py-2 sm:gap-1.5 sm:px-3">
          {parties.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => go(i)}
              aria-label={p.short}
              className="h-2 rounded-full transition-all sm:h-2.5"
              style={{ width: i === active ? 18 : 8, background: i === active ? p.color : "rgba(255,244,220,.5)" }}
            />
          ))}
        </div>
        <button
          onClick={() => go(active + 1)}
          disabled={active === parties.length - 1}
          aria-label="Siguiente"
          className={`pointer-events-auto hidden h-11 w-11 items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-black disabled:opacity-30 sm:flex ${active === 0 ? "nudge" : ""}`}
        >
          →
        </button>
      </div>
      {active === 0 && (
        <p className="nudge pointer-events-none absolute bottom-7 left-4 rounded-full bg-tinta px-3 py-1.5 text-sm font-bold text-crema shadow-lg sm:hidden">
          desliza →
        </p>
      )}
    </div>
  );
}
