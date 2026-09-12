import Link from "next/link";
import { notFound } from "next/navigation";
import { Runner } from "@/components/Runner";
import { pobierzStanModulu, pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly, SPOTKANIE_MODULU } from "@/lib/moduly/otwarcie";
import { KOLEJNOSC_MODULOW, NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import { ZAMKNIECIE } from "@/lib/content/wspolne";
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

  const stan = await pobierzStanModulu(uczestnik.id, modul as KodModulu);

  if (stan.czesc === null || stan.definicja === null) {
    return (
      /**
       * Ekran zamykajacy modul. Uczestnik konczy kilkadziesiat minut pracy i ma
       * sie dowiedziec, co z tych odpowiedzi wynika - bez pokazywania wyniku,
       * bo regula odslaniania warstwami jest wazniejsza. „Dziekujemy, dalej"
       * to za malo po takiej ilosci pracy.
       */
      <main className="mx-auto flex min-h-dvh max-w-czytelna flex-col justify-center px-6 py-16">
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">
          {NAZWY_MODULOW[modul as KodModulu]}
        </p>
        <h1 className="mt-3 text-naglowek font-extrabold tracking-tight">
          Ta część jest za Tobą
        </h1>
        <p className="szklo mt-6 p-6 text-tresc-duza leading-relaxed text-atrament">
          {ZAMKNIECIE[modul] ?? "Gotowe. Twoje odpowiedzi są zapisane."}
        </p>
        <p className="proza mt-5 text-atrament-sciszony">
          Możesz zobaczyć swoje odpowiedzi albo wypełnić tę część jeszcze raz. Wtedy poprzednie
          odpowiedzi znikają i zaczynasz od pierwszego ekranu.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {modul !== "A0" ? (
            <Link
              href={`/u/${kod}/wyniki/${modul}`}
              className="przejscie inline-flex min-h-11 items-center rounded-lg bg-akcent px-6 text-male font-medium text-na-akcencie hover:bg-akcent-ciemny"
            >
              Zobacz swoje odpowiedzi
            </Link>
          ) : null}
          <Link
            href={`/u/${kod}/modul/${modul}/od-nowa`}
            className="przejscie inline-flex min-h-11 items-center rounded-lg border border-linia-mocna px-6 text-male font-semibold text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
          >
            Wypełnij od nowa
          </Link>
          <Link
            href={`/u/${kod}/moduly`}
            className="przejscie inline-flex min-h-11 items-center px-2 text-male text-atrament-slaby hover:text-atrament"
          >
            Wróć do listy
          </Link>
        </div>
      </main>
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
      modul={modul}
      definicja={stan.definicja}
      zapisane={stan.zapisane}
      nazwaModulu={NAZWY_MODULOW[modul as KodModulu]}
      numerModulu={KOLEJNOSC_MODULOW.indexOf(modul as KodModulu) + 1}
      liczbaModulow={KOLEJNOSC_MODULOW.length}
    />
  );
}
