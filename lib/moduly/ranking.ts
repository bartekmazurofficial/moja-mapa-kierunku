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

/**
 * Domyka ranking, gdy do przypisania zostala jedna pozycja i jeden numer.
 *
 * Czwarte stukniecie nie niesie zadnej informacji: przy trzech nadanych
 * numerach czwarty jest wymuszony i uczestnik nie ma tam nic do wyboru.
 * Na trzydziesci szesc zestawow A1 i czterdziesci piec A2 to osiemdziesiat
 * jeden stuknieć w rzecz juz rozstrzygnieta.
 *
 * Zapis w bazie jest identyczny jak przy recznym nadaniu: wszystkie cztery
 * miejsca, wiec silnik liczy dokladnie to samo.
 *
 * Uwaga: wolno to wolac tylko po nadaniu numeru, nigdy po jego zdjeciu.
 * Po zdjeciu dopelnienie natychmiast wstawialoby numer z powrotem i nie dalo
 * sie niczego cofnac.
 */
export function dopelnijOstatni(ranking: Ranking, kody: string[]): Ranking {
  const wolneKody = kody.filter((k) => ranking[k] === undefined);
  if (wolneKody.length !== 1) return ranking;

  const zajete = new Set(Object.values(ranking));
  const wolneNumery = kody.map((_, i) => i + 1).filter((n) => !zajete.has(n));
  if (wolneNumery.length !== 1) return ranking;

  return { ...ranking, [wolneKody[0]]: wolneNumery[0] };
}
