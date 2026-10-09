"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { partyBySlug } from "@/data/parties";
import { rank, regions, topics, type Answers, type TopicId } from "@/data/quiz";

const label = (id: TopicId) => topics.find((t) => t.id === id)!.label.toLowerCase();
const list = (ids: TopicId[]) => {
  const l = ids.map(label);
  return l.length > 1 ? `${l.slice(0, -1).join(", ")} y ${l.at(-1)}` : l[0];
};

function Choice({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border-[3px] border-tinta bg-white px-4 py-3.5 text-left text-base font-bold shadow-[4px_4px_0_var(--color-tinta)] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--color-tinta)] sm:hover:-translate-y-0.5 sm:hover:bg-crema"
    >
      {children}
    </button>
  );
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState("resto");
  const [priority, setPriority] = useState<TopicId | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

  const total = topics.length + 2;
  const next = () => setStep((s) => s + 1);
  const restart = () => {
    setAnswers({});
    setPriority(null);
    setStep(0);
  };

  if (step >= total) {
    const results = rank(answers, region, priority).slice(0, 3);
    return (
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-3xl sm:text-4xl">Te pareces más a…</h1>
        <ol className="mt-5 space-y-4">
          {results.map((r, i) => {
            const p = partyBySlug[r.slug];
            const focus = priority ?? r.agree[0];
            const point = focus && p.points.find((pt) => pt.label.toLowerCase() === label(focus));
            return (
              <li key={r.slug} className="rounded-3xl border-[3px] border-tinta bg-white p-4 shadow-[5px_5px_0_var(--color-tinta)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-tinta bg-white p-1">
                    <Image src={p.logo} alt="" width={40} height={40} className="max-h-9 w-auto object-contain" />
                  </span>
                  <span className="flex-1 font-display text-xl">
                    {i + 1}. {p.short}
                  </span>
                  <span className="font-display text-2xl" style={{ color: p.color }}>
                    {r.score}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-tinta/10">
                  <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: p.color }} />
                </div>
                <ul className="mt-3 space-y-1 text-[15px] leading-snug">
                  {r.agree.length > 0 && <li>✅ Pensáis igual en {list(r.agree)}.</li>}
                  {r.clash.length > 0 && <li>❌ Chocáis en {list(r.clash)}.</li>}
                  {point && (
                    <li className="text-tinta/80">
                      💬 En {point.label.toLowerCase()} propone: {point.text}
                    </li>
                  )}
                </ul>
                <Link href={`/#p-${p.slug}`} className="mt-3 inline-block text-sm font-bold underline underline-offset-4">
                  Ver su ficha →
                </Link>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 text-xs text-tinta/60">
          Orientativo, según los programas de 2023. No es un consejo de voto: lee las fichas y decide tú.
        </p>
        <div className="mt-4 flex gap-3">
          <button onClick={restart} className="rounded-full border-[3px] border-tinta px-5 py-2.5 font-bold">
            Repetir
          </button>
          <Link href="/" className="rounded-full border-[3px] border-tinta bg-tinta px-5 py-2.5 font-bold text-gualda">
            Ver todos los partidos
          </Link>
        </div>
      </div>
    );
  }

  const topic = step >= 2 ? topics[step - 2] : null;
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          aria-label="Atrás"
          className="text-2xl font-black disabled:opacity-20"
        >
          ←
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-tinta bg-white">
          <div className="h-full bg-rojo transition-all" style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <span className="text-sm font-bold">
          {step + 1}/{total}
        </span>
      </div>

      {step === 0 && (
        <>
          <h1 className="mt-8 font-display text-3xl sm:text-4xl">¿Dónde votas?</h1>
          <p className="mt-1 text-sm font-semibold text-tinta/70">Así solo te salen partidos que puedes votar.</p>
          <div className="mt-6 grid gap-3">
            {regions.map((r) => (
              <Choice key={r.id} onClick={() => (setRegion(r.id), next())}>
                {r.label}
              </Choice>
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h1 className="mt-8 font-display text-3xl sm:text-4xl">¿Qué es lo que más te importa?</h1>
          <p className="mt-1 text-sm font-semibold text-tinta/70">Ese tema contará el doble.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {topics.map((t) => (
              <Choice key={t.id} onClick={() => (setPriority(t.id), next())}>
                <span className="mr-1">{t.emoji}</span> {t.label}
              </Choice>
            ))}
          </div>
        </>
      )}

      {topic && (
        <>
          <span className="mt-8 text-xs font-black uppercase tracking-widest text-rojo">
            {topic.emoji} {topic.label}
          </span>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">{topic.q}</h1>
          <div className="mt-6 grid gap-3">
            {topic.options.map((o, i) => (
              <Choice key={o} onClick={() => (setAnswers((a) => ({ ...a, [topic.id]: i })), next())}>
                {o}
              </Choice>
            ))}
          </div>
          <button
            onClick={() => {
              setAnswers((a) => ({ ...a, [topic.id]: undefined }));
              next();
            }}
            className="mt-4 self-center text-sm font-bold text-tinta/60 underline underline-offset-4"
          >
            No lo tengo claro, paso
          </button>
        </>
      )}
    </div>
  );
}
