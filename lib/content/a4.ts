/**
 * MODUL A4: CO JEST DLA MNIE WAZNE. Tresc przepisana z
 * program-doradztwa/02_assessmenty/A4_wartosci.md, bez zmian.
 *
 * Plan zrownowazony: kazda z 12 wartosci wystepuje w dokladnie 6 parach,
 * zadna para sie nie powtarza. Suma wygranych po 12 wartosciach zawsze 36.
 */

/** Stale brzmienie wartosci, uzywane we wszystkich jej parach. */
export const BRZMIENIA_A4: Record<string, string> = {"PIE": "Zarabiać naprawdę dobrze", "STA": "Mieć pewność, że praca nie zniknie", "WOL": "Móc decydować, jak i kiedy pracuję", "ROZ": "Ciągle uczyć się nowych rzeczy", "WPL": "Mieć realny wpływ na to, co się dzieje", "SEN": "Wiedzieć, że pomagam konkretnym ludziom", "UZN": "Być docenianym za to, co robię", "REL": "Pracować z ludźmi, których lubię", "CZA": "Mieć dużo czasu poza pracą", "MIS": "Być w czymś naprawdę dobry", "ZMI": "Mieć ciągle nowe wyzwania", "ZAS": "Nie robić rzeczy, w które nie wierzę"};

export interface ParaA4 {
  nr: number;
  lewa: string;
  prawa: string;
}

/** Etykiety lewa/prawa sluza wylacznie zapisowi planu. Strona jest losowana. */
export const PARY_A4: ParaA4[] = [{"nr": 1, "lewa": "PIE", "prawa": "ROZ"}, {"nr": 2, "lewa": "STA", "prawa": "MIS"}, {"nr": 3, "lewa": "ROZ", "prawa": "WPL"}, {"nr": 4, "lewa": "PIE", "prawa": "SEN"}, {"nr": 5, "lewa": "SEN", "prawa": "UZN"}, {"nr": 6, "lewa": "ROZ", "prawa": "MIS"}, {"nr": 7, "lewa": "WPL", "prawa": "CZA"}, {"nr": 8, "lewa": "WOL", "prawa": "ZAS"}, {"nr": 9, "lewa": "PIE", "prawa": "WPL"}, {"nr": 10, "lewa": "STA", "prawa": "ZAS"}, {"nr": 11, "lewa": "CZA", "prawa": "ZAS"}, {"nr": 12, "lewa": "PIE", "prawa": "STA"}, {"nr": 13, "lewa": "STA", "prawa": "WPL"}, {"nr": 14, "lewa": "WOL", "prawa": "ZMI"}, {"nr": 15, "lewa": "STA", "prawa": "UZN"}, {"nr": 16, "lewa": "WOL", "prawa": "ROZ"}, {"nr": 17, "lewa": "WPL", "prawa": "SEN"}, {"nr": 18, "lewa": "WPL", "prawa": "ZAS"}, {"nr": 19, "lewa": "UZN", "prawa": "CZA"}, {"nr": 20, "lewa": "PIE", "prawa": "ZAS"}, {"nr": 21, "lewa": "WOL", "prawa": "MIS"}, {"nr": 22, "lewa": "UZN", "prawa": "MIS"}, {"nr": 23, "lewa": "SEN", "prawa": "CZA"}, {"nr": 24, "lewa": "REL", "prawa": "CZA"}, {"nr": 25, "lewa": "REL", "prawa": "MIS"}, {"nr": 26, "lewa": "STA", "prawa": "ZMI"}, {"nr": 27, "lewa": "SEN", "prawa": "ZMI"}, {"nr": 28, "lewa": "PIE", "prawa": "REL"}, {"nr": 29, "lewa": "WOL", "prawa": "CZA"}, {"nr": 30, "lewa": "UZN", "prawa": "ZAS"}, {"nr": 31, "lewa": "ROZ", "prawa": "SEN"}, {"nr": 32, "lewa": "UZN", "prawa": "ZMI"}, {"nr": 33, "lewa": "MIS", "prawa": "ZMI"}, {"nr": 34, "lewa": "ROZ", "prawa": "REL"}, {"nr": 35, "lewa": "WOL", "prawa": "REL"}, {"nr": 36, "lewa": "REL", "prawa": "ZMI"}];

/** Czesc C: test kosztu. Cztery pytania, tresc generowana z wyniku czesci A. */
export const TEST_KOSZTU = {
  wstep: "Sprawdźmy, ile jest dla Ciebie warta.",
  pytania: [
    { kod: "PIE", tekst: "wyraźnie wyższych zarobków" },
    { kod: "STA", tekst: "poczucia bezpieczeństwa" },
    { kod: "CZA", tekst: "wolnego czasu" },
    { kod: "UZN", tekst: "uznania innych" },
  ],
  /** Zamienniki, gdy pytanie dotyczy wartosci, ktora sama jest najwyzsza. */
  zamienniki: [
    { kod: "WPL", tekst: "realnego wpływu na to, co się dzieje" },
    { kod: "REL", tekst: "ludzi, z którymi chce się pracować" },
    { kod: "MIS", tekst: "bycia w czymś naprawdę dobrym" },
    { kod: "WOL", tekst: "decydowania o sobie" },
  ],
  odpowiedzi: [
    { wartosc: "tak", etykieta: "Tak" },
    { wartosc: "zalezy", etykieta: "Zależy" },
    { wartosc: "nie", etykieta: "Nie" },
  ],
} as const;

export const INSTRUKCJA_A4 = {
  naglowek: "Co jest dla mnie ważne",
  wprowadzenie: [
    "Zobaczysz pary. Wybierasz to, co jest dla Ciebie ważniejsze.",
    "Obie rzeczy zwykle będą ważne, dlatego to trudne. Nie ma tu dobrych odpowiedzi.",
  ],
  polecenieBloku: "Co jest dla Ciebie ważniejsze?",
  nieodzowneNaglowek: "Bez czego praca nie miałaby sensu",
  nieodzownePolecenie:
    "Wybierz najwyżej trzy rzeczy, bez których praca nie miałaby dla Ciebie sensu. Nie te, które byłyby miłe. Te, których brak sprawiłby, że chciałbyś odejść.",
  kosztNaglowek: "Ile jest warta",
} as const;
