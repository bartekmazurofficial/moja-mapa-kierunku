import Link from "next/link";
import { notFound } from "next/navigation";
import { Runner } from "@/components/Runner";
import { pobierzStanModulu, pobierzUczestnika } from "@/lib/moduly/serwer";
import { NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import type { KodModulu } from "@/lib/moduly/typy";

export const dynamic = "force-dynamic";

const MODULY: KodModulu[] = ["A0", "A1", "A2", "A3", "A4", "A5", "M1"];

export default async function Strona({
  params,
}: {
  params: Promise<{ kod: string; modul: string }>;
}) {
  const { kod, modul } = await params;
  if (!MODULY.includes(modul as KodModulu)) notFound();

  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const stan = await pobierzStanModulu(uczestnik.id, modul as KodModulu);

  if (stan.czesc === null || stan.definicja === null) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-czytelna flex-col justify-center px-6 py-16">
        <h1 className="font-serif text-naglowek">To już masz za sobą</h1>
        <p className="proza mt-4 text-atrament-sciszony">
          Ta część jest wypełniona. Wynik zobaczysz, kiedy prowadzący ją otworzy.
        </p>
        <Link
          href={`/u/${kod}`}
          className="przejscie mt-8 inline-flex min-h-11 w-fit items-center rounded-lg bg-akcent px-6 text-male font-medium text-white hover:bg-akcent-ciemny"
        >
          Wróć do listy
        </Link>
      </main>
    );
  }

  return (
    <Runner
      kodUczestnika={kod}
      modul={modul}
      definicja={stan.definicja}
      zapisane={stan.zapisane}
      nazwaModulu={NAZWY_MODULOW[modul as KodModulu]}
      czescNumer={stan.wszystkieCzesci.indexOf(stan.czesc) + 1}
      czescLacznie={stan.wszystkieCzesci.length}
    />
  );
}
