import type { Metadata } from "next";
import Link from "next/link";
import Quiz from "@/components/Quiz";

export const metadata: Metadata = {
  title: "¿A quién te pareces? · quevoto?",
  description: "Test de 1 minuto para ver qué partidos piensan más como tú, según sus programas.",
};

export default function TestPage() {
  return (
    <main className="flex min-h-[100svh] flex-col bg-gualda">
      <nav className="flex items-center justify-between bg-rojo px-5 py-4 text-crema">
        <Link href="/" className="font-display text-xl">
          quevoto?
        </Link>
        <span className="text-sm font-bold">Test · 1 min</span>
      </nav>
      <div className="flex flex-1 flex-col px-5 pb-10 pt-6">
        <Quiz />
      </div>
    </main>
  );
}
