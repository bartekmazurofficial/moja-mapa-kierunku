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
  A0: "Kilka podstawowych informacji o Twojej sytuacji: gdzie jesteś, co Ci idzie, na co masz przestrzeń.",
  A1: "Co Cię realnie ciągnie. Nie deklaracje, tylko wybory między konkretnymi zajęciami.",
  A3: "Jak naturalnie działasz: sam czy z ludźmi, z planem czy w biegu, cisza czy ruch.",
  A2: "W czym możesz być dobry. Osobno od tego, co lubisz, bo to nie zawsze to samo.",
  A4: "Czego potrzebujesz od pracy, żeby miała dla Ciebie sens.",
  M1: "Jakiego życia chcesz. Jedyna część, w której piszesz własnymi słowami.",
  A5: "Warunki pracy, które są nie do pogodzenia z tym, jak chcesz żyć.",
  A6: "Jak się uczysz. Od tego zależy, czy droga przez szkołę ma dla Ciebie sens.",
  Z: "Jakie tematy Cię ciekawią. Nie zawód, nie kierunek, tylko to, o czym chciałbyś wiedzieć więcej.",
  L: "Co lubisz robić. Same czynności, bez pytania, czy Ci to wychodzi.",
  U: "W czym już dziś jesteś dobry. Nie co chciałbyś umieć, tylko na co masz dowody.",
  F: "Jakiego życia chcesz i ile ono kosztuje. Kwota wychodzi z Twoich wyborów, nie z deklaracji.",
};

/** Hasło na kafelek: trzy, cztery słowa, bez kropki. */
export const KROTKO: Record<KodModulu, string> = {
  A0: "Twoja sytuacja i możliwości",
  A1: "Co Cię ciekawi w praktyce",
  A3: "Twój styl działania",
  A2: "Twoje naturalne predyspozycje",
  A4: "Twoje wartości w praktyce",
  M1: "Jakiego życia naprawdę chcesz",
  A5: "Warunki, które akceptujesz",
  A6: "Twój sposób uczenia się",
  Z: "Tematy, które Cię ciągną",
  L: "Czynności, które lubisz",
  U: "To, co Ci wychodzi",
  F: "Życie, które chcesz mieć",
};

/** Końcówka zdania „Dziś odkrywasz…" na stronie głównej. */
export const DZIS_ODKRYWASZ: Record<KodModulu, string> = {
  A0: "od czego zaczynasz.",
  A1: "co naprawdę Cię ciągnie.",
  A3: "jak naturalnie działasz.",
  A2: "w czym możesz być dobry.",
  A4: "co jest dla Ciebie ważne.",
  M1: "jakiego życia chcesz.",
  A5: "na co się zgadzasz, a na co nie.",
  A6: "jak się uczysz najlepiej.",
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
  A0: "Od tego zaczynamy.",
  A1: "Pierwszy odruch\nzwykle ma rację.",
  A3: "Twój styl\nma moc.",
  A2: "Bez oceniania.\nTylko szczerze.",
  A4: "Wybierz,\nnie oceniaj.",
  M1: "To Twoje życie.",
  A5: "Szczerość\nsię opłaca.",
  A6: "Każdy uczy się\ninaczej.",
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
  A0: "Kilka informacji o Twojej sytuacji. Bez oceniania.",
  A1: "Nie pytamy, czy Ci to wyjdzie. Pytamy, czy chciałbyś to robić.",
  A3: "Nie ma dobrych ani złych odpowiedzi. Liczy się to, co jest najbliżej Ciebie.",
  A2: "Nie pytamy, czy to lubisz. Pytamy, co poszłoby Ci najlepiej.",
  A4: "Obie odpowiedzi są dobre. Wybierz tę, która bardziej do Ciebie pasuje.",
  M1: "Nie o pracy, tylko o życiu. Pytamy o to, czego chcesz.",
  A5: "Nie pytamy, czy to wytrzymasz. Pytamy, jak byś to zniósł.",
  A6: "Nie ma lepszej strony. Jest ta, która jest bliżej Ciebie.",
  Z: "Nie pytamy o zawód. Pytamy, o czym chciałbyś wiedzieć więcej.",
  L: "Nie pytamy, czy Ci to wychodzi. Pytamy, czy lubisz to robić.",
  U: "Nie wybieraj tego, co chciałbyś umieć. Wybieraj to, na co masz dowody.",
  F: "Wszystko jest już ustawione. Zmieniasz tylko to, co chcesz mieć inaczej.",
};
