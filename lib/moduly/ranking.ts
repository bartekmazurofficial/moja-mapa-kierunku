/**
 * Regula ukladania kolejnosci w zestawie (A1 i A2).
 *
 * Uczestnik nie nadaje numerow, tylko przestawia wiersze: **miejsce na liscie
 * jest odpowiedzia**. Zapis do bazy zostaje ten sam co zawsze,
 * `{ identyfikator: miejsce 1-4 }`, wiec silnik liczy dokladnie to samo
 * i cztery niezerowe wagi zostaja nietkniete.
 *
 * Czyste funkcje, bez Reacta: to jest regula, nie widok.
 */

export type Ranking = Record<string, number>;

/** Miejsca z kolejnosci: pierwszy wiersz dostaje 1, ostatni tyle, ile jest wierszy. */
export function naMiejsca(kody: string[]): Ranking {
  const mapa: Ranking = {};
  kody.forEach((kod, i) => {
    mapa[kod] = i + 1;
  });
  return mapa;
}

/**
 * Kolejnosc do pokazania.
 *
 * Gdy uczestnik juz ustawil zestaw, wraca jego kolejnosc. Gdy jeszcze nie,
 * wraca kolejnosc wyjsciowa, czyli ta wylosowana i utrwalona w planie modulu.
 * Zapis niepelny (np. po cofnieciu odpowiedzi) traktujemy jak jego brak.
 */
export function kolejnoscDoPokazania(kody: string[], zapisane: Ranking | undefined): string[] {
  if (!zapisane || Object.keys(zapisane).length !== kody.length) return kody;
  if (kody.some((k) => typeof zapisane[k] !== "number")) return kody;
  return [...kody].sort((a, b) => zapisane[a] - zapisane[b]);
}

/**
 * Przenosi jeden wiersz na wskazane miejsce, reszta zsuwa sie sama.
 * Miejsce poza zakresem albo brak wiersza zostawiaja liste bez zmian.
 */
export function przenies(kody: string[], kod: string, doIndeksu: number): string[] {
  const z = kody.indexOf(kod);
  if (z < 0 || doIndeksu < 0 || doIndeksu >= kody.length || z === doIndeksu) return kody;
  const lista = kody.slice();
  lista.splice(doIndeksu, 0, ...lista.splice(z, 1));
  return lista;
}
