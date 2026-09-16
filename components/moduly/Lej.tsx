"use client";

/**
 * LEJ I UKLADANIE PIATKI.
 *
 * Dwa widoki jednej mechaniki, ktora obsluguje trzy pierwsze moduly nowego
 * programu. Sredni uczestnik przejdzie przez nie dziewiec razy, wiec liczy sie
 * tu jedna rzecz: zeby dalo sie to zrobic kciukiem, szybko i bez czytania
 * instrukcji drugi raz.
 *
 * Dwie decyzje, ktore nie sa oczywiste:
 *
 *   1. **Po osiagnieciu limitu nie blokujemy pozostalych kafli.** Wygaszony
 *      kafel, ktorego nie da sie kliknac, wyglada jak blad aplikacji. Zamiast
 *      tego klikniecie ponad limit odrzuca sie z krotkim komunikatem, ktory
 *      mowi, co zrobic: odznacz cos najpierw.
 *   2. **Kolejnosc ustawia sie klikaniem, nie przeciaganiem.** Przeciaganie
 *      na telefonie walczy z przewijaniem strony i przy pieciu pozycjach nie
 *      daje nic w zamian. Numer pojawia sie na kaflu w chwili klikniecia.
 */

import { useState } from "react";
import type { WlasciwosciPozycji } from "@/components/Pozycja";

/** Co ile kafli zostawiamy wieksza przerwe. */
const SKUPISKO = 10;

function lista(wartosc: unknown): number[] {
  return Array.isArray(wartosc) ? (wartosc as number[]).filter((x) => typeof x === "number") : [];
}

/**
 * Polska odmiana po liczbie. Komunikat „zostalo 1 wyborow" czyta sie jak
 * bledny string, a nie jak zdanie napisane do czlowieka.
 */
function odmianaWyborow(ile: number): string {
  const reszta = ile % 10;
  const setka = ile % 100;
  if (ile === 1) return "jeszcze jeden wybór";
  if (reszta >= 2 && reszta <= 4 && (setka < 12 || setka > 14)) return `jeszcze ${ile} wybory`;
  return `jeszcze ${ile} wyborów`;
}

export function LejWyboru({ pozycja, wartosc, naZmiane }: WlasciwosciPozycji) {
  const wybrane = lista(wartosc);
  const limit = pozycja.limit ?? 15;
  const opcje = pozycja.opcje ?? [];
  const [odbicie, ustawOdbicie] = useState<string | null>(null);

  const przelacz = (id: number) => {
    if (wybrane.includes(id)) {
      naZmiane(wybrane.filter((x) => x !== id));
      ustawOdbicie(null);
      return;
    }
    if (wybrane.length >= limit) {
      ustawOdbicie(
        `Masz już ${limit} zaznaczonych. Odznacz coś, jeśli chcesz zmienić wybór.`,
      );
      return;
    }
    naZmiane([...wybrane, id]);
    ustawOdbicie(null);
  };

  const zostalo = limit - wybrane.length;

  return (
    <div>
      {/*
        Licznik przykleja sie do gory ekranu. Przy szescdziesieciu kaflach
        uczestnik przewija daleko i bez tego traci z oczu jedyna liczbe,
        ktora ma tu znaczenie.
      */}
      <div className="sticky top-0 z-10 -mx-1 mb-5 rounded-xl bg-tlo/95 px-4 py-3 backdrop-blur">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-male font-semibold text-atrament">
            Zaznaczono {wybrane.length} z {limit}
          </p>
          <p className="text-drobne text-atrament-sciszony">
            {zostalo > 0 ? `Możesz zrobić ${odmianaWyborow(zostalo)}` : "Komplet"}
          </p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-linia">
          <div
            className="h-full rounded-full bg-akcent przejscie"
            style={{ width: `${Math.min(100, (wybrane.length / limit) * 100)}%` }}
          />
        </div>
        {odbicie ? (
          <p role="status" className="mt-2 text-drobne font-medium text-uwaga">
            {odbicie}
          </p>
        ) : null}
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {opcje.map((o, i) => {
          const id = Number(o.kod);
          const zaznaczony = wybrane.includes(id);
          // Przerwa co dziesiec kafli. Grupy sa wylacznie przestrzenne
          // i nienazwane: nazwa sugerowalaby strukture i wplywalaby na wybor.
          //
          // Margines dostaja oba kafle wiersza, w ktorym zaczyna sie nowe
          // skupisko, bo przy dwoch kolumnach margines na jednym rozjezdza
          // wiersz zamiast go odsunac.
          const przerwa = i >= SKUPISKO && i % SKUPISKO < 2;
          return (
            <li key={o.kod} className={przerwa ? "mt-5" : undefined}>
              <button
                type="button"
                aria-pressed={zaznaczony}
                onClick={() => przelacz(id)}
                className={`przejscie flex min-h-14 w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-male ${
                  zaznaczony
                    ? "border-akcent bg-akcent-tlo font-semibold text-atrament"
                    : "border-linia-mocna bg-panel text-atrament hover:border-atrament-sciszony"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex size-6 shrink-0 items-center justify-center rounded-md border-2 ${
                    zaznaczony ? "border-akcent bg-akcent text-na-akcencie" : "border-linia-mocna"
                  }`}
                >
                  {zaznaczony ? (
                    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </span>
                <span>{o.etykieta}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ================================================================== */

/**
 * Ukladanie piatki w kolejnosci.
 *
 * Kliknij pierwszy, potem drugi i tak dalej. Ponowne klikniecie zdejmuje
 * pozycje i przenumerowuje reszte, wiec pomylka kosztuje jedno dotkniecie,
 * a nie zaczynanie od nowa.
 */
export function Kolejnosc({ pozycja, wartosc, naZmiane }: WlasciwosciPozycji) {
  const ulozone = lista(wartosc);
  const opcje = pozycja.opcje ?? [];
  const ile = pozycja.ile ?? opcje.length;

  const przelacz = (id: number) => {
    if (ulozone.includes(id)) naZmiane(ulozone.filter((x) => x !== id));
    else if (ulozone.length < ile) naZmiane([...ulozone, id]);
  };

  const nastepny = ulozone.length + 1;

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-1 mb-5 rounded-xl bg-tlo/95 px-4 py-3 backdrop-blur">
        <p className="text-male font-semibold text-atrament">
          {ulozone.length === ile
            ? "Kolejność ustawiona"
            : `Wskaż pozycję numer ${nastepny}`}
        </p>
        <p className="mt-1 text-drobne text-atrament-sciszony">
          {ulozone.length === ile
            ? "Możesz kliknąć dowolną pozycję, żeby ją zdjąć i ustawić inaczej."
            : `Ustawiono ${ulozone.length} z ${ile}. Klikaj po kolei, od najważniejszego.`}
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {opcje.map((o) => {
          const id = Number(o.kod);
          const miejsce = ulozone.indexOf(id);
          const ustawiony = miejsce !== -1;
          return (
            <li key={o.kod}>
              <button
                type="button"
                onClick={() => przelacz(id)}
                aria-pressed={ustawiony}
                className={`przejscie flex min-h-16 w-full items-center gap-4 rounded-xl border-2 px-4 py-3 text-left ${
                  ustawiony
                    ? "border-akcent bg-akcent-tlo text-atrament"
                    : "border-linia-mocna bg-panel text-atrament hover:border-atrament-sciszony"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-male font-bold ${
                    ustawiony
                      ? "bg-akcent text-na-akcencie"
                      : "border-2 border-dashed border-linia-mocna text-atrament-sciszony"
                  }`}
                >
                  {ustawiony ? miejsce + 1 : ""}
                </span>
                <span className={`text-male ${ustawiony ? "font-semibold" : ""}`}>{o.etykieta}</span>
                {ustawiony ? <span className="sr-only">miejsce {miejsce + 1}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
