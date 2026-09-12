/**
 * Słownikowe wartości zawodu w brzmieniu dla uczestnika.
 *
 * Same wartości („bardzo_niskie", „czesciowo") są kluczami w bazie i wiążą
 * silnik z danymi. Tutaj są tylko ich nazwy na ekranie, w jednym miejscu,
 * żeby karta, lista i porównanie mówiły tak samo.
 */

export const POZIOM: Record<string, string> = {
  szybki: "szybkie wejście",
  sredni: "średnia droga",
  dlugi: "długa droga",
  bardzo_dlugi: "bardzo długa droga",
};

export const STUDIA: Record<string, string> = {
  tak: "wymaga studiów",
  nie: "bez studiów",
  czesciowo: "studia częściowo",
};

export const KOSZT: Record<string, string> = {
  zerowy: "wejście bez kosztów",
  bardzo_niski: "koszt wejścia bardzo niski",
  niski: "koszt wejścia niski",
  sredni: "koszt wejścia średni",
  wysoki: "koszt wejścia wysoki",
  bardzo_wysoki: "koszt wejścia bardzo wysoki",
};

export const ZAGROZENIE: Record<string, string> = {
  bardzo_niskie: "zagrożenie bardzo niskie",
  niskie: "zagrożenie niskie",
  umiarkowane: "zagrożenie umiarkowane",
  wysokie: "zagrożenie wysokie",
  bardzo_wysokie: "zagrożenie bardzo wysokie",
};
