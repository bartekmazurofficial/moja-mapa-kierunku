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

/** Te same wartości bez przedrostka, do małych pól, gdzie nagłówek mówi, o co chodzi. */
export const KOSZT_KROTKO: Record<string, string> = {
  zerowy: "zerowy",
  bardzo_niski: "bardzo niski",
  niski: "niski",
  sredni: "średni",
  wysoki: "wysoki",
  bardzo_wysoki: "bardzo wysoki",
};

export const ZAGROZENIE_KROTKO: Record<string, string> = {
  bardzo_niskie: "bardzo niskie",
  niskie: "niskie",
  umiarkowane: "umiarkowane",
  wysokie: "wysokie",
  bardzo_wysokie: "bardzo wysokie",
};

export const POZIOM_KROTKO: Record<string, string> = {
  szybki: "szybkie",
  sredni: "średnie",
  dlugi: "długie",
  bardzo_dlugi: "bardzo długie",
};

export const STUDIA_KROTKO: Record<string, string> = {
  tak: "wymagane",
  nie: "niepotrzebne",
  czesciowo: "częściowo",
};
