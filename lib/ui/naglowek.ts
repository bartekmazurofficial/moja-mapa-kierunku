/**
 * Podzial naglowka pytania na dwie linie.
 *
 * Kazdy naglowek ma stac na srodku i miec dokladnie dwa wiersze: pierwszy
 * ciemny, drugi w gradiencie. Podzial po liczbie slow tego nie dawal. Przy
 * „Czy jestes gotow przeprowadzic sie dla nauki albo pracy?" ciemna czesc
 * dostawala 33 znaki, a gradientowa 21; dluzsza linia sama sie lamala i
 * naglowek miał trzy wiersze zamiast dwoch.
 *
 * Tutaj podzial pada tam, gdzie obie linie wychodza najbardziej rowne, a przy
 * remisie wygrywa podzial pozniejszy, czyli ten z dluzsza linia ciemna.
 *
 * Znak zapytania idzie osobno, bo w interfejsie jest trzecim akcentem
 * (pomaranczowym), a nie czescia gradientu.
 */
export interface PodzialNaglowka {
  /** Pierwsza linia, ciemna. Pusta, gdy naglowek jest jednowyrazowy. */
  poczatek: string;
  /** Druga linia, gradientowa. */
  koniec: string;
  /** Znak zapytania albo wykrzyknik z konca naglowka. */
  znak: string;
  /** Dlugosc dluzszej z dwoch linii: po niej dobieramy stopien pisma. */
  najdluzsza: number;
}

export function podzielNaglowek(tekst: string): PodzialNaglowka {
  const pelny = tekst.trim();
  const dopasowanie = /([?!]+)$/.exec(pelny);
  const znak = dopasowanie ? dopasowanie[1] : "";
  const bezZnaku = znak ? pelny.slice(0, -znak.length).trimEnd() : pelny;
  const slowa = bezZnaku.split(/\s+/).filter(Boolean);

  if (slowa.length < 2) {
    return { poczatek: "", koniec: bezZnaku, znak, najdluzsza: bezZnaku.length + znak.length };
  }

  let najlepszy = 1;
  let najlepszaRoznica = Number.POSITIVE_INFINITY;
  for (let k = 1; k < slowa.length; k += 1) {
    const lewa = slowa.slice(0, k).join(" ").length;
    const prawa = slowa.slice(k).join(" ").length + znak.length;
    const roznica = Math.abs(lewa - prawa);
    if (roznica <= najlepszaRoznica) {
      najlepszaRoznica = roznica;
      najlepszy = k;
    }
  }

  const poczatek = slowa.slice(0, najlepszy).join(" ");
  const koniec = slowa.slice(najlepszy).join(" ");
  return {
    poczatek,
    koniec,
    znak,
    najdluzsza: Math.max(poczatek.length, koniec.length + znak.length),
  };
}
