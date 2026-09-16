/**
 * Czy pozycja ma juz odpowiedz wystarczajaca, zeby przejsc dalej.
 *
 * Osobno od komponentu, bo to jest regula, nie widok: "brak mozliwosci
 * przewijania do przodu przed odpowiedzia" jest wymaganiem programu.
 */

import type { Pozycja } from "./typy";

export function pozycjaKompletna(pozycja: Pozycja, wartosc: unknown): boolean {
  if (pozycja.opcjonalna) return true;
  switch (pozycja.typ) {
    case "ranking4":
      return Object.keys((wartosc as Record<string, number>) ?? {}).length === 4;
    case "kotwica": {
      const w = wartosc as { skala?: number } | undefined;
      return typeof w?.skala === "number";
    }
    case "wielokrotny": {
      const w = (wartosc as string[]) ?? [];
      if (pozycja.dokladnie) return w.length === pozycja.dokladnie;
      if (pozycja.minWyborow) return w.length >= pozycja.minWyborow;
      return w.length > 0;
    }
    case "dowody":
      return Array.isArray(wartosc);
    case "lej": {
      // Limit gorny pilnuje komponent; tu sprawdzamy tylko, czy cokolwiek
      // zostalo zaznaczone. Etap z zerem zaznaczen nie niesie informacji,
      // a lej bez wejscia nie ma z czego sie zwezac.
      const w = wartosc as number[] | undefined;
      return Array.isArray(w) && w.length > 0;
    }
    case "kolejnosc": {
      // Kolejnosc musi byc pelna: piatka z trzema ustawionymi miejscami
      // dawalaby dwie pozycje o sile nierozroznialnej od siebie.
      const w = wartosc as number[] | undefined;
      return Array.isArray(w) && w.length === (pozycja.ile ?? 5);
    }
    case "progi":
      // Panel poziomu zycia wolno przejsc bez jednej zmiany: wszystkie progi
      // maja wartosc domyslna i to jest odpowiedz jak kazda inna.
      return true;
    case "tekst":
      return typeof wartosc === "string" && wartosc.trim().length > 0;
    case "kilka_tekstow":
      return Array.isArray(wartosc);
    default:
      return wartosc !== undefined && wartosc !== null && wartosc !== "";
  }
}
