/**
 * MODUL A5: FILTRY RZECZYWISTOSCI. Tresc pozycji jest w lib/domain/slowniki.ts
 * (32 pozycje F01-F32). Tutaj tylko obudowa: instrukcje, ekran wet i trzy zdania.
 *
 * To jest najniebezpieczniejszy modul w calym programie: jedyny, ktory usuwa
 * zawody bezwarunkowo. Trzy mechanizmy bezpieczenstwa: trzy odpowiedzi zamiast
 * dwoch, rozroznienie miekkiego NIE od twardego weta, limit trzech wet.
 */

export const ODPOWIEDZI_A5 = [
  { kod: "tak", etykieta: "Tak", wartosc: 1 },
  { kod: "moze", etykieta: "Może", wartosc: 0.5 },
  { kod: "nie", etykieta: "Nie", wartosc: 0 },
] as const;

export const MAKS_WET = 3;

/** Czesc C: trzy otwarte dokonczenia. Nie wchodza do silnika dopasowania. */
export const ZDANIA_A5 = [
  "Nie chciałbym pracy, w której…",
  "Nie chcę, żeby moja praca wymagała ode mnie…",
  "Nie zgodziłbym się na…",
] as const;

export const INSTRUKCJA_A5 = {
  naglowek: "Filtry rzeczywistości",
  wprowadzenie: [
    "Przed chwilą opisałeś, jak chcesz żyć. Teraz zaznacz warunki pracy, które są z tym nie do pogodzenia.",
    "Odpowiadasz TAK, MOŻE albo NIE. MOŻE jest pełnoprawną odpowiedzią. Jeśli nie wiesz, zaznacz MOŻE.",
    "Na koniec wybierzesz najwyżej trzy rzeczy, które są dla Ciebie absolutnie wykluczone. Tylko trzy, więc zastanów się, które naprawdę. Wykluczenie usuwa zawody całkowicie, nie przesuwa ich niżej.",
  ],
  polecenieBloku: "Czy jesteś gotów na…",
  wetaNaglowek: "Co jest nie do przejścia",
  wetaPolecenie:
    "Wybierz najwyżej trzy, które są dla Ciebie granicą nie do przekroczenia, czyli takie, że nawet praca idealna pod każdym innym względem odpadłaby przez to jedno. Reszta zostaje jako minus, nie jako koniec rozmowy.",
  wetaMoznaPominac: "Możesz nie zaznaczyć żadnego.",
  zdaniaNaglowek: "Trzy zdania własnymi słowami",
  zdaniaPodpis:
    "Lista wyżej jest zamknięta i nie obejmie wszystkiego. Te pola wyłapują granice, których nie przewidzieliśmy. Można je zostawić puste.",
} as const;
