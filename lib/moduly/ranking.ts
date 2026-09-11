/**
 * Regula nadawania numerow w zestawie czterech pozycji (A1 i A2).
 *
 * Poprzednio numer nadawal sie sam, w kolejnosci stukania, a czwarta pozycja
 * dopelniala sie bez udzialu uczestnika. Wygladalo to jak awaria: klikasz
 * trzeci raz i nagle wszystko jest ponumerowane, a ekran ucieka.
 *
 * Teraz numer wybiera sie wprost. Jedna zasada: **jeden numer nalezy do jednej
 * pozycji**. Nadanie zajetego numeru zabiera go poprzedniej pozycji, zamiast
 * blokowac przycisk, bo blokada konczy sie tym, ze uczestnik nie ma jak
 * poprawic pomylki inaczej niz kasujac wszystko.
 *
 * Czysta funkcja, bez Reacta: to jest regula, nie widok.
 */

export type Ranking = Record<string, number>;

export function nadajNumer(ranking: Ranking, kod: string, numer: number): Ranking {
  const nowy: Ranking = { ...ranking };

  // Ponowne stukniecie we wlasny numer zdejmuje go.
  if (nowy[kod] === numer) {
    delete nowy[kod];
    return nowy;
  }

  for (const [innyKod, n] of Object.entries(nowy)) {
    if (n === numer && innyKod !== kod) delete nowy[innyKod];
  }
  nowy[kod] = numer;
  return nowy;
}

/** Numer -> kod pozycji, ktora go trzyma. */
export function wlascicieleNumerow(ranking: Ranking): Map<number, string> {
  const mapa = new Map<number, string>();
  for (const [kod, n] of Object.entries(ranking)) mapa.set(n, kod);
  return mapa;
}
