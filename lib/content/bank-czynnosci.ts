/**
 * BANK CZYNNOSCI: 60 pozycji, wspolny dla modulu „co lubie" i „w czym jestem
 * dobry".
 *
 * **Ta sama lista pytana dwa razy**: raz o chec, raz o umiejetnosc. To dwie
 * rozne rzeczy i najciekawsze informacje sa tam, gdzie sie rozjezdzaja. Ktos
 * moze umiec cos dobrze i nie chciec tego robic; ktos moze bardzo chciec
 * i jeszcze nie umiec, a to zupelnie inna sytuacja niz „nie umiem i nie chce".
 *
 * To musza byc dwa osobne moduly, nie jeden ekran z dwoma pytaniami przy
 * kazdej pozycji. Przy pytaniach obok siebie odpowiedzi sie zlepiaja: ludzie
 * odhaczaja oba albo zaden. Cala wartosc jest w rozjezdzie, a rozjazd powstaje
 * tylko wtedy, gdy tory sa rozdzielone.
 *
 * **Numery sa niezmienne.** Po nich zapisuja sie odpowiedzi i po nich mostek
 * (`lib/engine/mostek.ts`) liczy, ile ta czynnosc znaczy w konkretnym zawodzie.
 *
 * `kategoria` sluzy do ulozenia listy na ekranie i do wymuszania roznorodnosci
 * w rankingu. **Uczestnik jej nie widzi.**
 */

export type KategoriaCzynnosci =
  | "Analiza"
  | "Techniczne"
  | "Twórcze"
  | "Komunikacja"
  | "Relacje"
  | "Wpływ"
  | "Organizacja"
  | "Przywództwo";

export interface Czynnosc {
  id: number;
  kategoria: KategoriaCzynnosci;
  nazwa: string;
}

export const BANK_CZYNNOSCI: Czynnosc[] = [
  { id: 1, kategoria: "Analiza", nazwa: "Analizowanie informacji" },
  { id: 2, kategoria: "Analiza", nazwa: "Rozwiązywanie problemów" },
  { id: 3, kategoria: "Analiza", nazwa: "Dociekanie, jak coś działa" },
  { id: 4, kategoria: "Analiza", nazwa: "Szukanie i zbieranie informacji" },
  { id: 5, kategoria: "Analiza", nazwa: "Dostrzeganie wzorców i zależności" },
  { id: 6, kategoria: "Analiza", nazwa: "Wyciąganie wniosków" },
  { id: 7, kategoria: "Analiza", nazwa: "Porównywanie różnych możliwości" },
  { id: 8, kategoria: "Analiza", nazwa: "Praca z liczbami" },
  { id: 9, kategoria: "Analiza", nazwa: "Analizowanie danych" },
  { id: 10, kategoria: "Analiza", nazwa: "Sprawdzanie poprawności i wychwytywanie błędów" },
  { id: 11, kategoria: "Techniczne", nazwa: "Programowanie i tworzenie rozwiązań technologicznych" },
  { id: 12, kategoria: "Techniczne", nazwa: "Naprawianie i diagnozowanie usterek" },
  { id: 13, kategoria: "Techniczne", nazwa: "Budowanie i składanie rzeczy" },
  { id: 14, kategoria: "Techniczne", nazwa: "Obsługiwanie narzędzi, maszyn i sprzętu" },
  { id: 15, kategoria: "Techniczne", nazwa: "Precyzyjna praca manualna" },
  { id: 16, kategoria: "Techniczne", nazwa: "Praca ze zwierzętami" },
  { id: 17, kategoria: "Techniczne", nazwa: "Praca z roślinami" },
  { id: 18, kategoria: "Techniczne", nazwa: "Gotowanie i przygotowywanie jedzenia" },
  { id: 19, kategoria: "Twórcze", nazwa: "Wymyślanie nowych pomysłów" },
  { id: 20, kategoria: "Twórcze", nazwa: "Tworzenie czegoś od zera" },
  { id: 21, kategoria: "Twórcze", nazwa: "Ulepszanie istniejących rzeczy i rozwiązań" },
  { id: 22, kategoria: "Twórcze", nazwa: "Projektowanie rozwiązań" },
  { id: 23, kategoria: "Twórcze", nazwa: "Projektowanie wizualne i estetyczne" },
  { id: 24, kategoria: "Twórcze", nazwa: "Rysowanie i tworzenie grafiki" },
  { id: 25, kategoria: "Twórcze", nazwa: "Fotografowanie" },
  { id: 26, kategoria: "Twórcze", nazwa: "Nagrywanie i tworzenie materiałów wideo" },
  { id: 27, kategoria: "Twórcze", nazwa: "Pisanie" },
  { id: 28, kategoria: "Twórcze", nazwa: "Opowiadanie historii" },
  { id: 29, kategoria: "Twórcze", nazwa: "Tworzenie lub wykonywanie muzyki" },
  { id: 30, kategoria: "Twórcze", nazwa: "Redagowanie i poprawianie treści" },
  { id: 31, kategoria: "Komunikacja", nazwa: "Tłumaczenie trudnych rzeczy w prosty sposób" },
  { id: 32, kategoria: "Komunikacja", nazwa: "Uczenie innych" },
  { id: 33, kategoria: "Komunikacja", nazwa: "Prezentowanie pomysłów i informacji" },
  { id: 34, kategoria: "Komunikacja", nazwa: "Występowanie przed ludźmi" },
  { id: 35, kategoria: "Komunikacja", nazwa: "Prowadzenie rozmowy" },
  { id: 36, kategoria: "Komunikacja", nazwa: "Uważne słuchanie" },
  { id: 37, kategoria: "Relacje", nazwa: "Rozumienie potrzeb i emocji ludzi" },
  { id: 38, kategoria: "Relacje", nazwa: "Budowanie relacji" },
  { id: 39, kategoria: "Relacje", nazwa: "Nawiązywanie nowych kontaktów" },
  { id: 40, kategoria: "Relacje", nazwa: "Wspieranie ludzi w trudnościach" },
  { id: 41, kategoria: "Relacje", nazwa: "Doradzanie i proponowanie rozwiązań" },
  { id: 42, kategoria: "Relacje", nazwa: "Motywowanie i zachęcanie innych" },
  { id: 43, kategoria: "Relacje", nazwa: "Pomaganie komuś się rozwijać" },
  { id: 44, kategoria: "Relacje", nazwa: "Rozwiązywanie konfliktów między ludźmi" },
  { id: 45, kategoria: "Wpływ", nazwa: "Przekonywanie ludzi do pomysłów" },
  { id: 46, kategoria: "Wpływ", nazwa: "Argumentowanie i bronienie stanowiska" },
  { id: 47, kategoria: "Wpływ", nazwa: "Negocjowanie" },
  { id: 48, kategoria: "Wpływ", nazwa: "Sprzedawanie i promowanie" },
  { id: 49, kategoria: "Organizacja", nazwa: "Planowanie działań" },
  { id: 50, kategoria: "Organizacja", nazwa: "Organizowanie" },
  { id: 51, kategoria: "Organizacja", nazwa: "Koordynowanie ludzi i zadań" },
  { id: 52, kategoria: "Organizacja", nazwa: "Tworzenie systemów i procesów" },
  { id: 53, kategoria: "Organizacja", nazwa: "Porządkowanie informacji i rzeczy" },
  { id: 54, kategoria: "Organizacja", nazwa: "Domykanie zadań" },
  { id: 55, kategoria: "Organizacja", nazwa: "Dbałość o szczegóły" },
  { id: 56, kategoria: "Przywództwo", nazwa: "Podejmowanie decyzji" },
  {
    id: 57,
    kategoria: "Przywództwo",
    nazwa: "Myślenie strategiczne, patrzenie kilka kroków do przodu",
  },
  { id: 58, kategoria: "Przywództwo", nazwa: "Prowadzenie ludzi" },
  { id: 59, kategoria: "Przywództwo", nazwa: "Delegowanie i dzielenie pracy" },
  { id: 60, kategoria: "Przywództwo", nazwa: "Inicjowanie działania bez czekania na instrukcję" },
];

export const CZYNNOSC_PO_ID = new Map(BANK_CZYNNOSCI.map((c) => [c.id, c]));

export const KATEGORIE_CZYNNOSCI: KategoriaCzynnosci[] = [
  "Analiza",
  "Techniczne",
  "Twórcze",
  "Komunikacja",
  "Relacje",
  "Wpływ",
  "Organizacja",
  "Przywództwo",
];

export const INSTRUKCJA_LUBIE = {
  naglowek: "Co lubię robić",
  wprowadzenie: [
    "W tej części nie interesuje nas, czy jesteś w czymś dobry.",
    "Zastanów się tylko, czy naprawdę lubisz wykonywać daną czynność i czy chciałbyś robić jej więcej.",
  ],
  etapy: {
    e1: {
      naglowek: "Które z tych czynności naprawdę lubisz robić?",
      podpis:
        "Nie myśl jeszcze o zawodzie, pieniądzach ani o tym, czy jesteś w tym dobry. Wybierz to, co daje Ci satysfakcję albo do czego chętnie wracasz.",
      limit: 15,
    },
    e2: {
      naglowek:
        "Które z tych rzeczy wybierałbyś z własnej woli, nawet gdyby nikt Cię za nie nie oceniał, nie chwalił ani nie nagradzał?",
      podpis: "To pytanie odsiewa rzeczy, które lubi się za pochwały, a nie same z siebie.",
      limit: 8,
    },
    e3: {
      naglowek:
        "Gdybyś miał stać się naprawdę dobry tylko w kilku z tych rzeczy i wymagałoby to setek godzin praktyki, które chciałbyś rozwijać?",
      podpis: "To pytanie odsiewa rzeczy przyjemne, ale takie, których nikt nie chce ćwiczyć.",
      limit: 5,
    },
  },
  ukladanie: {
    naglowek: "Ustaw swoją piątkę w kolejności",
    podpis: "Od tego, co lubisz najbardziej, do tego, co lubisz najmniej z tej piątki.",
  },
} as const;

export const INSTRUKCJA_UMIEM = {
  naglowek: "W czym jestem dobry",
  wprowadzenie: [
    "Teraz zapomnij o tym, co wcześniej zaznaczałeś jako lubiane. Zastanów się wyłącznie nad tym, co rzeczywiście dobrze Ci wychodzi.",
    "Nie wybieraj tego, co chciałbyś umieć. Wybieraj to, na co masz już jakieś dowody.",
  ],
  etapy: {
    e1: {
      naglowek: "Które z tych rzeczy już dziś wychodzą Ci co najmniej dobrze?",
      podpis: "Lista jest ta sama co poprzednio, ale w innej kolejności. To celowe.",
      limit: 15,
    },
    e2: {
      naglowek: "Przy których z tych rzeczy masz realne sygnały, że jesteś dobry?",
      podpis:
        "Na przykład: inni proszą Cię o pomoc, chwalą efekt, powierzają Ci takie zadania albo potrafisz wykonać je samodzielnie bez dużej pomocy.",
      limit: 8,
    },
    e3: {
      naglowek:
        "Za które z tych rzeczy czułbyś się pewnie wziąć odpowiedzialność, gdyby wynik naprawdę miał znaczenie?",
      podpis: "To najostrzejszy filtr w całym programie. Umieć coś i wziąć za to odpowiedzialność to dwie różne rzeczy.",
      limit: 5,
    },
  },
  ukladanie: {
    naglowek: "Ustaw swoją piątkę w kolejności",
    podpis: "Od tego, co wychodzi Ci najlepiej, do tego, co wychodzi najsłabiej z tej piątki.",
  },
} as const;

/** Nazwy trzech list powstajacych z nalozenia obu torow. Sekcja raportu. */
export const NAZWY_LIST = {
  lubieIUmiem: {
    tytul: "To lubisz i dobrze Ci wychodzi",
    opis:
      "Czynności, które jednocześnie chcesz wykonywać i przy których masz już sygnały skuteczności. To dobry punkt startowy przy szukaniu pracy.",
  },
  doRozwoju: {
    tytul: "To bardzo lubisz i warto rozwijać",
    opis:
      "Te rzeczy Cię ciągną, ale nie muszą być jeszcze Twoimi najmocniejszymi umiejętnościami. Mogą być dobrym kierunkiem do świadomego rozwoju.",
  },
  umiemNieLubie: {
    tytul: "To potrafisz, ale niekoniecznie chcesz robić dużo",
    opis:
      "Potrafisz to robić, ale sama umiejętność nie oznacza jeszcze, że warto budować wokół niej swoją pracę.",
  },
} as const;
