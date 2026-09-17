import type { KodModulu } from "./typy";

/**
 * Jednym zdaniem o każdej części, językiem uczestnika.
 *
 * Trzy długości, bo trzy różne miejsca: pełne zdanie na liście modułów, hasło
 * na kafelku podróży i końcówka zdania „Dziś odkrywasz…" na stronie głównej.
 * Wszystkie w jednym pliku, żeby nie rozjechały się przy pierwszej redakcji.
 */

/** Po co jest ta część. Pełne zdanie, na listę modułów. */
export const PO_CO: Record<KodModulu, string> = {
  Z: "Jakie tematy Cię ciekawią. Nie zawód, nie kierunek, tylko to, o czym chciałbyś wiedzieć więcej.",
  L: "Co lubisz robić. Same czynności, bez pytania, czy Ci to wychodzi.",
  U: "W czym już dziś jesteś dobry. Nie co chciałbyś umieć, tylko na co masz dowody.",
  F: "Jakiego życia chcesz i ile ono kosztuje. Kwota wychodzi z Twoich wyborów, nie z deklaracji.",
};

/** Hasło na kafelek: trzy, cztery słowa, bez kropki. */
export const KROTKO: Record<KodModulu, string> = {
  Z: "Tematy, które Cię ciągną",
  L: "Czynności, które lubisz",
  U: "To, co Ci wychodzi",
  F: "Życie, które chcesz mieć",
};

/** Końcówka zdania „Dziś odkrywasz…" na stronie głównej. */
export const DZIS_ODKRYWASZ: Record<KodModulu, string> = {
  Z: "co Cię naprawdę ciekawi.",
  L: "co lubisz robić.",
  U: "w czym już jesteś dobry.",
  F: "ile kosztuje życie, którego chcesz.",
};

/**
 * Dopisek na marginesie ekranu pytania. Ozdoba, nigdy nośnik treści: obok
 * zawsze stoi pełne pytanie. Bez ocen i bez „świetnie Ci idzie".
 */
export const DOPISEK: Record<KodModulu, string> = {
  Z: "Ciekawość\nto nie zawód.",
  L: "Nieważne,\nczy Ci wychodzi.",
  U: "Tylko to,\nco masz na to dowody.",
  F: "Nic nie musisz\nzmieniać.",
};

/**
 * Jedno zdanie pod pytaniem: przypomnienie zasady tego typu ekranu.
 * Stwierdzenie, nie zachęta.
 */
/**
 * Wskazowki pod odpowiedziami: juz ich nie ma.
 *
 * Kazdy ekran mial pod blokiem odpowiedzi ramke z jednym zdaniem instrukcji
 * („Wybierz jedna odpowiedz, te najblizsza prawdy o Tobie dzisiaj"). Przy
 * kilkudziesieciu ekranach z rzedu to samo zdanie przestaje cokolwiek
 * znaczyc, a zabiera wysokosc, przez ktora ekran nie miesci sie w oknie.
 * Zasada modulu stoi we wstepie i w podpisie pod pytaniem, czyli tam, gdzie
 * uczestnik ja czyta.
 *
 * Stala zostaje pusta, a nie usunieta: Runner pyta o nia po typie pozycji
 * i pusty slownik jest tu jasniejszy niz usuwanie odwolan w kilku miejscach.
 */
export const WSKAZOWKA: Record<string, string> = {};

/**
 * Zdanie pod pytaniem na ekranie wyboru. Powtarza zasadę modułu z instrukcji,
 * bo instrukcję czyta się raz, a pytań jest trzydzieści sześć.
 */
export const PODTYTUL: Record<KodModulu, string> = {
  Z: "Nie pytamy o zawód. Pytamy, o czym chciałbyś wiedzieć więcej.",
  L: "Nie pytamy, czy Ci to wychodzi. Pytamy, czy lubisz to robić.",
  U: "Nie wybieraj tego, co chciałbyś umieć. Wybieraj to, na co masz dowody.",
  F: "Wszystko jest już ustawione. Zmieniasz tylko to, co chcesz mieć inaczej.",
};
