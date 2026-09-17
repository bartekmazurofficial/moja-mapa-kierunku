import { notFound, redirect } from "next/navigation";
import { pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly } from "@/lib/moduly/otwarcie";
import { coZniknie } from "@/lib/moduly/odnowa";
import { PotwierdzenieResetu } from "@/components/moduly/PotwierdzenieResetu";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import type { KodModulu } from "@/lib/moduly/typy";

export const dynamic = "force-dynamic";

/**
 * Potwierdzenie przed skasowaniem odpowiedzi.
 *
 * Osobny adres, nie przycisk na liscie. Kasowanie jest nieodwracalne, a M1
 * zawiera tekst pisany wlasnymi slowami, wiec jedno przypadkowe klikniecie
 * nie moze tego zabrac. Strona tylko liczy, co zniknie; samo okno rysuje
 * `PotwierdzenieResetu`, bo zgoda jest klikana po stronie przegladarki.
 */
export default async function Strona({
  params,
}: {
  params: Promise<{ kod: string; modul: string }>;
}) {
  const { kod, modul } = await params;
  if (!KOLEJNOSC_MODULOW.includes(modul as KodModulu)) notFound();

  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const otwarte = await otwarteModuly(uczestnik.grupaId);
  if (!otwarte.has(modul as KodModulu)) notFound();

  const stan = await coZniknie(uczestnik.id, modul as KodModulu);
  // Nie ma czego kasowac: wchodzimy wprost w modul, zamiast pytac o zgode
  // na usuniecie zera odpowiedzi.
  if (!stan.cokolwiek) redirect(`/u/${kod}/modul/${modul}`);

  const wszystkich = CZESCI_MODULOW[modul as KodModulu].length;
  const czesci =
    stan.zakonczoneCzesci.length > 0
      ? ` (${stan.zakonczoneCzesci.length} z ${wszystkich} ${wszystkich === 1 ? "części domknięta" : "części domkniętych"})`
      : "";

  /**
   * Lista „stracisz" jest liczona, nie napisana. Kolejnosc blokow stoi na niej
   * osobno, bo to jedyna rzecz, ktorej uczestnik nie widzi na ekranie: nowy
   * przebieg pojdzie w innej kolejnosci i to jest celowe, a nie usterka.
   */
  const stracisz = [
    `${stan.odpowiedzi} ${slowoOdpowiedzi(stan.odpowiedzi)} zapisanych w tym module${czesci}`,
    "kolejność bloków wylosowaną dla Ciebie, więc nowy przebieg pójdzie inaczej",
    ...(modul === "M1" ? ["tekst, który napisałeś własnymi słowami"] : []),
  ];

  return (
    <PotwierdzenieResetu
      kod={kod}
      modul={modul}
      nazwaModulu={NAZWY_MODULOW[modul as KodModulu]}
      gotowy={stan.gotowy}
      data={
        stan.ostatniZapis
          ? stan.ostatniZapis.toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "Europe/Warsaw",
            })
          : null
      }
      stracisz={stracisz}
    />
  );
}

/** „1 odpowiedź", ale „2 odpowiedzi" i „7 odpowiedzi" — dwie formy wystarczą. */
function slowoOdpowiedzi(n: number): string {
  return n === 1 ? "odpowiedź" : "odpowiedzi";
}
