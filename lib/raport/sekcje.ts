/**
 * Dwadziescia sekcji raportu w pieciu warstwach odslaniania.
 *
 * Raport istnieje od pierwszego dnia, ale prawie caly jest zamkniety.
 * Uczestnik widzi szkielet z wygaszonymi sekcjami i podpisem, kiedy kazda
 * sie otworzy. Pusty raport przez trzy tygodnie to trzy tygodnie bez dowodu,
 * ze program dziala.
 *
 * Reguly odslaniania sa egzekwowane po stronie serwera, nie ukrywaniem
 * w interfejsie: sekcja z wyzszej warstwy nie renderuje sie przed
 * odblokowaniem, nawet przy bezposrednim odwolaniu do adresu.
 */

export type KodWarstwy = "ZAWSZE" | "W1" | "W2" | "W4A" | "W4B" | "W5";

export interface Warstwa {
  kod: KodWarstwy;
  nazwa: string;
  kiedy: string;
}

export const WARSTWY: Warstwa[] = [
  { kod: "ZAWSZE", nazwa: "Twoje słowa", kiedy: "dostępne od razu" },
  { kod: "W1", nazwa: "Kim jestem i co mnie ciągnie", kiedy: "po pierwszym spotkaniu" },
  { kod: "W2", nazwa: "W czym mogę być dobry", kiedy: "po drugim spotkaniu" },
  { kod: "W4A", nazwa: "Jak chcę żyć i moje obszary", kiedy: "na czwartym spotkaniu" },
  { kod: "W4B", nazwa: "Zawody, kierunki i trzy drogi", kiedy: "na czwartym spotkaniu, po przerwie" },
  { kod: "W5", nazwa: "Moja decyzja", kiedy: "po rozmowie indywidualnej" },
];

export interface DefinicjaSekcji {
  id: string;
  /** Numer z raport_struktura.md. Null dla sekcji A0, ktora numeru nie ma. */
  numer: number | null;
  tytul: string;
  warstwa: KodWarstwy;
  zrodlo: string;
  /** Sekcje 1-4 sa blokowane w trakcie modulu A2, patrz dostep.ts. */
  blokowanaPrzezA2?: boolean;
}

export const SEKCJE: DefinicjaSekcji[] = [
  { id: "punkt_startu", numer: null, tytul: "Twój punkt startu", warstwa: "W1", zrodlo: "moduł A0" },
  { id: "co_mnie_interesuje", numer: 1, tytul: "Co mnie interesuje", warstwa: "W1", zrodlo: "moduł A1", blokowanaPrzezA2: true },
  { id: "czego_nie_sprawdzilem", numer: 2, tytul: "Czego jeszcze nie sprawdziłem", warstwa: "W1", zrodlo: "moduł A1", blokowanaPrzezA2: true },
  { id: "jak_dzialam", numer: 3, tytul: "Jak naturalnie działam", warstwa: "W1", zrodlo: "moduł A3", blokowanaPrzezA2: true },
  { id: "w_czym_dobry", numer: 5, tytul: "W czym mogę być dobry", warstwa: "W2", zrodlo: "moduł A2" },
  { id: "lubie_a_wychodzi", numer: 6, tytul: "Co lubię, a w czym mogę być dobry", warstwa: "W2", zrodlo: "A1 skrzyżowane z A2" },
  { id: "wizja_zycia", numer: 9, tytul: "Moja wizja życia", warstwa: "ZAWSZE", zrodlo: "moduł M1, Twoje słowa" },
  { id: "srodowisko", numer: 4, tytul: "Środowisko, w którym będę działał najlepiej", warstwa: "W4A", zrodlo: "moduł A3" },
  { id: "wartosci", numer: 7, tytul: "Czego potrzebuję od pracy", warstwa: "W4A", zrodlo: "moduł A4" },
  { id: "ksztalt_zycia", numer: 8, tytul: "Jakiego życia chcę", warstwa: "W4A", zrodlo: "moduł M1" },
  { id: "czego_nie_chce", numer: 10, tytul: "Czego nie chcę", warstwa: "W4A", zrodlo: "M1 i A5" },
  { id: "na_co_gotow", numer: 11, tytul: "Na co jestem gotów", warstwa: "W4A", zrodlo: "moduł A5" },
  { id: "obszary", numer: 12, tytul: "Moje najmocniejsze obszary", warstwa: "W4A", zrodlo: "silnik, warstwa pierwsza" },
  { id: "profil_w_jednym_ekranie", numer: 0, tytul: "Mój profil w jednym ekranie", warstwa: "W4B", zrodlo: "całość" },
  { id: "zawody", numer: 13, tytul: "Konkretne zawody", warstwa: "W4B", zrodlo: "silnik, warstwa druga" },
  { id: "kierunki", numer: 14, tytul: "Kierunki i drogi bez studiów", warstwa: "W4B", zrodlo: "silnik, warstwa trzecia" },
  { id: "umiejetnosci", numer: 15, tytul: "Umiejętności do rozwoju", warstwa: "W4B", zrodlo: "A2 i obszary" },
  { id: "trzy_drogi", numer: 16, tytul: "Trzy drogi", warstwa: "W4B", zrodlo: "silnik" },
  { id: "czego_unikac", numer: 17, tytul: "Czego raczej unikać", warstwa: "W4B", zrodlo: "silnik" },
  { id: "moja_decyzja", numer: 18, tytul: "Moja decyzja", warstwa: "W5", zrodlo: "rozmowa indywidualna" },
  { id: "pierwsze_kroki", numer: 19, tytul: "Pierwsze kroki", warstwa: "W5", zrodlo: "rozmowa indywidualna" },
  { id: "notatka", numer: 20, tytul: "Notatka prowadzącego", warstwa: "W5", zrodlo: "rozmowa indywidualna" },
];

/** Kolejnosc wyswietlania: profil w jednym ekranie zawsze na samej gorze. */
export const KOLEJNOSC_WYSWIETLANIA = [
  "profil_w_jednym_ekranie",
  "punkt_startu",
  "co_mnie_interesuje",
  "czego_nie_sprawdzilem",
  "jak_dzialam",
  "srodowisko",
  "w_czym_dobry",
  "lubie_a_wychodzi",
  "wartosci",
  "ksztalt_zycia",
  "wizja_zycia",
  "czego_nie_chce",
  "na_co_gotow",
  "obszary",
  "zawody",
  "kierunki",
  "umiejetnosci",
  "trzy_drogi",
  "czego_unikac",
  "moja_decyzja",
  "pierwsze_kroki",
  "notatka",
];

export const SEKCJE_PO_ID = new Map(SEKCJE.map((s) => [s.id, s]));

/**
 * Komunikat blokady z modulu A2. Uczestnik, ktory przed chwila widzial swoj
 * profil zainteresowan, zacznie dopasowywac do niego odpowiedzi, a roznica
 * miedzy "lubie" a "wychodzi mi" jest glownym produktem modulu A2.
 */
export const BLOKADA_A2 =
  "Wróć tu po dzisiejszym ćwiczeniu. Chcemy, żeby Twoje odpowiedzi były niezależne od tego, co wyszło poprzednio.";

/** Stopka na kazdym ekranie i kazdej stronie eksportu. */
export function stopkaRaportu(data: Date): string {
  const miesiace = [
    "styczniu", "lutym", "marcu", "kwietniu", "maju", "czerwcu",
    "lipcu", "sierpniu", "wrześniu", "październiku", "listopadzie", "grudniu",
  ];
  return (
    `Ten raport powstał na podstawie tego, co o sobie wiedziałeś w ${miesiace[data.getMonth()]} ` +
    `${data.getFullYear()}. Ludzie się zmieniają. Za dwa lata część z tego będzie już nieaktualna ` +
    `i to jest normalne.`
  );
}

/** Slowa zakazane w calym raporcie. Sprawdzane testem na wygenerowanym tekscie. */
export const SLOWA_ZAKAZANE = [
  "diagnoza",
  "wynik testu",
  "profil psychologiczny",
  "iloraz",
  "percentyl",
  "powołanie",
  "przeznaczenie",
];
