import Chat from "@/components/Chat";
import PartyCarousel from "@/components/PartyCarousel";
import PartySearch from "@/components/PartySearch";
import { Flag, Skyline } from "@/components/Skyline";

const bubbles = [
  { label: "¿Qué pasa con la inmigración?", q: "¿Qué propone cada partido sobre inmigración?", tilt: "-rotate-3" },
  { label: "¿Y con la vivienda?", q: "¿Qué propone cada partido para la vivienda y el alquiler?", tilt: "rotate-2" },
  { label: "¿Y con los derechos?", q: "¿Qué propone cada partido sobre derechos y libertades?", tilt: "-rotate-1" },
  { label: "¿Y mi pensión?", q: "¿Qué propone cada partido sobre las pensiones?", tilt: "rotate-3" },
  { label: "¿Quién baja impuestos?", q: "¿Qué partidos quieren bajar los impuestos?", tilt: "-rotate-2" },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-gualda">
        <div className="absolute inset-x-0 top-0 h-[12%] bg-rojo sm:h-[16%]" />
        <div className="absolute inset-x-0 bottom-0 h-[12%] bg-rojo sm:h-[16%]" />
        <Skyline className="pointer-events-none absolute inset-x-0 bottom-[12%] h-[30%] w-full text-rojo/25 sm:bottom-[16%] sm:h-[38%]" />
        <Flag className="wave absolute left-[5%] top-[22%] hidden w-24 drop-shadow-md sm:block" />
        <Flag className="wave absolute right-[7%] top-[24%] hidden w-20 drop-shadow-md [animation-delay:1s] sm:block" />

        <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 text-crema">
          <span className="font-display text-xl">quevoto?</span>
          <button data-find-party className="rounded-full border-2 border-crema/70 px-3 py-1.5 text-sm font-bold hover:bg-crema hover:text-rojo">Busca tu partido</button>
        </nav>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 text-center">
          <h1 className="font-display text-[clamp(3.6rem,17vw,11rem)] leading-[0.85] tracking-tight text-rojo [text-shadow:4px_4px_0_var(--color-tinta)] sm:[text-shadow:6px_6px_0_var(--color-tinta)]">
            quevoto?
          </h1>
          <p className="mt-5 text-lg font-bold sm:text-2xl">Los programas, en cristiano.</p>
          <p className="mt-2 rounded-full bg-tinta/10 px-3 py-1 text-[11px] font-semibold text-tinta/70 sm:text-xs">
            Programas de 2023 · esperando a que los partidos publiquen los de 2026
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-3 gap-y-4">
            {bubbles.map((b, i) => (
              <button
                key={b.label}
                data-ask-q={b.q}
                style={{ animationDelay: `${i * 0.4}s` }}
                className={`pop relative ${b.tilt} ${i > 2 ? "hidden sm:block" : ""} rounded-3xl border-[3px] border-tinta bg-white px-4 py-2.5 text-base font-bold shadow-[4px_4px_0_var(--color-tinta)] transition hover:-translate-y-1 hover:rotate-0 hover:bg-crema sm:text-lg`}
              >
                {b.label}
                <span className="absolute -bottom-[11px] left-6 h-4 w-4 rotate-45 border-b-[3px] border-r-[3px] border-tinta bg-inherit" />
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold text-tinta/70">Toca una pregunta y te lo cuento</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              data-find-party
              className="rounded-full border-[3px] border-tinta bg-tinta px-6 py-3 font-display text-lg text-gualda shadow-[4px_4px_0_var(--color-rojo)] transition hover:-translate-y-0.5"
            >
              Busca tu partido
            </button>
            <a href="#partidos" className="text-sm font-bold underline underline-offset-4">
              o míralos todos ↓
            </a>
          </div>
        </div>
        <a href="#partidos" className="relative z-10 pb-5 text-center text-sm font-bold text-crema">Desliza ↓</a>
      </section>

      <section id="partidos">
        <PartyCarousel />
      </section>

      <footer className="bg-tinta px-5 pb-24 pt-8 text-center text-xs text-crema/70 sm:pb-8">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Flag className="w-6" />
          <span className="font-display text-base text-crema">quevoto?</span>
        </div>
        Resúmenes orientativos de los programas de 2023. La IA puede fallar: mira siempre la página original.
      </footer>

      <PartySearch />
      <Chat />
    </main>
  );
}
