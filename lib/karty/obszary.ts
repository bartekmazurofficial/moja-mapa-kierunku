/**
 * Obszar silnika a obszar zainteresowań: dwa różne słowniki.
 *
 * Silnik ma dwadzieścia siedem obszarów zawodowych („Finanse i księgowość"),
 * moduł A1 ma dwadzieścia cztery obszary zainteresowań („Liczby i porządek").
 * **Numery nie są wspólne.** Obszar 4 w bazie to finanse, a obszar 4 w A1 to
 * ciało, ruch i teren. Pomylenie ich daje zawodowi cudzą ilustrację i cudzy
 * kolor, a wygląda jak drobiazg.
 *
 * Most między nimi jest w danych: `Obszar.zainteresowania` to mapa
 * „id obszaru A1 -> waga 1|2|3". Obszar A1 o najwyższej wadze najlepiej opisuje,
 * czym ten zawód jest, więc stamtąd bierzemy znak i kolor.
 */

/** Klucz znaku A1 (`a1-7`) dla obszaru silnika albo nic, gdy mapa jest pusta. */
export function znakObszaru(zainteresowania: Record<string, number>): string | null {
  let najlepszy: number | null = null;
  let waga = -1;
  for (const [id, w] of Object.entries(zainteresowania)) {
    const numer = Number(id);
    if (!Number.isFinite(numer)) continue;
    // Przy remisie wygrywa niższy numer: wynik ma być ten sam przy każdym
    // wywołaniu, a kolejność kluczy w JSON-ie nie jest gwarantowana.
    if (w > waga || (w === waga && najlepszy !== null && numer < najlepszy)) {
      waga = w;
      najlepszy = numer;
    }
  }
  return najlepszy === null ? null : `a1-${najlepszy}`;
}
