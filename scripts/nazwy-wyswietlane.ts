/**
 * Odtworzenie polskich znakow w nazwach zawodow.
 *
 * Baza 157 zawodow ma nazwy bez znakow diakrytycznych ("Technik serwisu
 * urzadzen"), bo powstawala jako dane. Karty maja te same nazwy z pelnymi
 * znakami, tylko wersalikami. Skladamy jedno z drugim: wielkosc liter bierzemy
 * z bazy, znaki diakrytyczne z karty.
 *
 * Tam, gdzie nazwy sie roznia dlugoscia (inne brzmienie w karcie), zostaje
 * nazwa z bazy i zawod trafia na liste do recznego sprawdzenia.
 */

const BEZ_ZNAKOW: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
};

function uprosc(znak: string): string {
  return BEZ_ZNAKOW[znak.toLowerCase()] ?? znak.toLowerCase();
}

export function nazwaZeZnakami(zBazy: string, zKarty: string): string | null {
  if (zBazy.length !== zKarty.length) return null;
  let wynik = "";
  for (let i = 0; i < zBazy.length; i++) {
    const b = zBazy[i];
    const k = zKarty[i];
    if (uprosc(b) !== uprosc(k)) return null;
    // Wielkosc litery z bazy, ksztalt znaku z karty.
    wynik += b === b.toUpperCase() && b !== b.toLowerCase() ? k.toUpperCase() : k.toLowerCase();
  }
  return wynik;
}
