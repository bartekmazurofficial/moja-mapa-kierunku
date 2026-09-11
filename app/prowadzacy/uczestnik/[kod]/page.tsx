import Link from "next/link";
import { notFound } from "next/navigation";
import { zalogowany } from "@/lib/prowadzacy/sesja";
import { pobierzKarteUczestnika } from "@/lib/prowadzacy/dane";
import { Logowanie } from "@/components/prowadzacy/Logowanie";
import {
  KtoToJest,
  Ostrzezenia,
  PytanieUczestnika,
  Rozjazdy,
  TrzyDrogiPanel,
  UsunieteWetem,
  Wizja,
} from "@/components/prowadzacy/Karta";
import { Korekty } from "@/components/prowadzacy/Korekty";

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
    <main className="mx-auto max-w-artykul px-5 py-10 sm:px-8">
      <Link
        href={`/prowadzacy/grupa/${karta.grupa.kod}`}
        className="przejscie text-male text-atrament-slaby hover:text-atrament"
      >
        ← {karta.grupa.nazwa}
      </Link>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-naglowek-duzy font-extrabold tracking-tight leading-tight">{karta.imie}</h1>
        <Link
          href={`/prowadzacy/sesja/${karta.kodDostepu}`}
          className="przejscie min-h-11 rounded-lg bg-akcent px-5 py-2.5 text-male font-medium text-na-akcencie hover:bg-akcent-ciemny"
        >
          Ekran sesji
        </Link>
      </div>
      {karta.etap ? <p className="mt-1 text-male text-atrament-slaby">{karta.etap}</p> : null}

      <div className="mt-8 flex flex-col gap-4">
        <KtoToJest karta={karta} />
        <TrzyDrogiPanel karta={karta} />
        <Rozjazdy rozjazdy={karta.rozjazdy} />
        <Ostrzezenia karta={karta} />
        <PytanieUczestnika karta={karta} />
        <Wizja karta={karta} />
        <UsunieteWetem karta={karta} />
        <Korekty karta={karta} />
      </div>
    </main>
  );
}
