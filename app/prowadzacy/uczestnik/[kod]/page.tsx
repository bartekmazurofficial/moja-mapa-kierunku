import Link from "next/link";
import { notFound } from "next/navigation";
import { zalogowany } from "@/lib/prowadzacy/sesja";
import { pobierzKarteUczestnika } from "@/lib/prowadzacy/dane";
import { Logowanie } from "@/components/prowadzacy/Logowanie";
import { PytanieUczestnika } from "@/components/prowadzacy/Karta";
import { Korekty } from "@/components/prowadzacy/Korekty";
import { KartaNowa } from "@/components/prowadzacy/KartaNowa";

export const dynamic = "force-dynamic";

/**
 * Wszystko na jednym przewijalnym ekranie, bez zakladek.
 * Prowadzacy ma pietnascie minut na przygotowanie i nie moze ich stracic
 * na klikanie po zakladkach.
 */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  if (!(await zalogowany())) return <Logowanie />;
  const { kod } = await params;
  const karta = await pobierzKarteUczestnika(kod);
  if (!karta) notFound();

  return (
    <main className="mx-auto flex max-w-[52rem] flex-col gap-5 px-5 py-8 sm:px-8">
      <header className="szklo relative overflow-hidden p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-akcent/20 blur-3xl"
        />
        <Link
          href={`/prowadzacy/grupa/${karta.grupa.kod}`}
          className="przejscie inline-flex items-center gap-2 text-male text-atrament-slaby hover:text-atrament"
        >
          <span aria-hidden>←</span> {karta.grupa.nazwa}
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-naglowek-duzy font-extrabold leading-tight tracking-tight">
              <span className="gradient-tytul">{karta.imie}</span>
            </h1>
          </div>
          <Link
            href={`/prowadzacy/sesja/${karta.kodDostepu}`}
            className="przejscie poswiata min-h-12 rounded-xl bg-gradient-to-r from-akcent-ciemny to-akcent px-6 py-3 text-male font-bold text-na-akcencie hover:brightness-110"
          >
            Ekran sesji <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <KartaNowa karta={karta.nowy} />
        <PytanieUczestnika karta={karta} />
        <Korekty karta={karta} />
      </div>
    </main>
  );
}
