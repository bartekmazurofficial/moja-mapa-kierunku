import Link from "next/link";
import { notFound } from "next/navigation";
import { Runner } from "@/components/Runner";
import { pobierzStanModulu, pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly, SPOTKANIE_MODULU } from "@/lib/moduly/otwarcie";
import { NAZWY_MODULOW, WSZYSTKIE_MODULY, programGrupy } from "@/lib/moduly/ekrany";
import { ZAMKNIECIE } from "@/lib/content/wspolne";
import { Ukonczenie } from "@/components/moduly/Ukonczenie";
import type { KodModulu } from "@/lib/moduly/typy";

/** Polska odmiana po liczbie: 1 odpowiedź, 2-4 odpowiedzi, 5 i więcej odpowiedzi. */
function odmiana(ile: number, jeden: string, kilka: string, wiele: string): string {
  const reszta = ile % 10;
  const setka = ile % 100;
  if (ile === 1) return `1 ${jeden}`;
  if (reszta >= 2 && reszta <= 4 && (setka < 12 || setka > 14)) return `${ile} ${kilka}`;
  return `${ile} ${wiele}`;
}

export const dynamic = "force-dynamic";

/**
 * Lista modulow pochodzi ze wspolnej stalej, a nie z wlasnej kopii.
 * Kopia przezyla dolozenie osmego modulu i strona odpowiadala 404 na adres,
 * ktory reszta aplikacji uznawala za poprawny. Dopuszczamy tu kody obu
 * programow: o tym, ktory obowiazuje te grupe, rozstrzyga i tak otwarcie.
 */
const MODULY = WSZYSTKIE_MODULY;

export default async function Strona({
  params,
}: {
  params: Promise<{ kod: string; modul: string }>;
}) {
  const { kod, modul } = await params;
  if (!MODULY.includes(modul as KodModulu)) notFound();

  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  // Modul nieotwarty nie renderuje sie nawet pod bezposrednim adresem.
  const otwarte = await otwarteModuly(uczestnik.grupaId);
  if (!otwarte.has(modul as KodModulu)) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-czytelna flex-col justify-center px-6 py-16">
        <h1 className="text-naglowek font-extrabold tracking-tight">Ta część jeszcze się nie otworzyła</h1>
        <p className="proza mt-4 text-atrament-sciszony">
          Otworzy ją prowadzący na {SPOTKANIE_MODULU[modul as KodModulu]}. spotkaniu. Kolejność ma
          znaczenie: gdybyś wypełnił to teraz, wynik następnej części byłby mniej Twój.
        </p>
        <Link
          href={`/u/${kod}`}
          className="przejscie mt-8 inline-flex min-h-11 w-fit items-center rounded-lg bg-akcent px-6 text-male font-medium text-na-akcencie hover:bg-akcent-ciemny"
        >
          Wróć do listy
        </Link>
      </main>
    );
  }

  // Numer „moduł 2 z 4" liczy sie w obrebie programu tej grupy.
  const program = programGrupy(otwarte);
  const stan = await pobierzStanModulu(uczestnik.id, modul as KodModulu);

  if (stan.czesc === null || stan.definicja === null) {
    /**
     * Ekran zamykajacy modul. Uczestnik konczy kilkadziesiat minut pracy i ma
     * dostac moment, a nie jeden akapit. Znaczniki mowia o wykonanej pracy,
     * nigdy o wyniku: ile zawodow sie dopasowalo, odslania prowadzacy na
     * spotkaniu i nic z tego nie ma prawa wyciec wczesniej.
     */
    const odpowiedzi = stan.liczbaOdpowiedzi;
    const znaczniki = [
      odpowiedzi > 0 ? odmiana(odpowiedzi, "odpowiedź", "odpowiedzi", "odpowiedzi") : null,
      stan.zakonczoneCzesci.length > 1
        ? odmiana(stan.zakonczoneCzesci.length, "część", "części", "części")
        : null,
      `moduł ${program.indexOf(modul as KodModulu) + 1} z ${program.length}`,
    ].filter((x): x is string => Boolean(x));

    return (
      <Ukonczenie
        kodUczestnika={kod}
        modul={modul}
        nazwaModulu={NAZWY_MODULOW[modul as KodModulu]}
        zamkniecie={ZAMKNIECIE[modul] ?? "Gotowe. Twoje odpowiedzi są zapisane."}
        znaczniki={znaczniki}
        zObszarami={modul !== "A0"}
      />
    );
  }

  return (
    <Runner
      /**
       * Klucz z części, nie z modułu. Po domknięciu części `router.refresh()`
       * podmienia definicję w locie, a stan komponentu (numer ekranu) zostaje
       * z poprzedniej części. Część A modułu A1 ma 38 ekranów, część B jeden,
       * więc numer 37 wskazywał w pustkę i ekran robił się pusty. Klucz wymusza
       * nowy komponent, czyli numer ekranu od zera.
       */
      key={`${modul}-${stan.czesc}`}
      kodUczestnika={kod}
      modul={modul as KodModulu}
      definicja={stan.definicja}
      zapisane={stan.zapisane}
      nazwaModulu={NAZWY_MODULOW[modul as KodModulu]}
      numerModulu={program.indexOf(modul as KodModulu) + 1}
      liczbaModulow={program.length}
    />
  );
}
