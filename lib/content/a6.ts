/**
 * MODUL A6: JAK SIE UCZE.
 *
 * Osmy modul, dolozony po fazie szostej. Zadny z siedmiu poprzednich nie mierzy
 * niczego, co przewiduje, czy czlowiek **skonczy** szkole, ktora wybierze.
 * A to jest pytanie, po ktore przychodzi maturzysta: nie "co robic", tylko
 * "studia czy nie".
 *
 * Piec osi po cztery pary plus trzy pytania o gotowosc do inwestycji czasowej.
 * Format pary, nie skali, bo trzeci modul z rzedu w tej samej mechanice
 * oznaczalby klikanie bez czytania, a pary uczestnik zna juz z A3 i M1.
 *
 * **Kody osi sa nowe i nalezy tylko do tego modulu.** Trzecia os specyfikacja
 * nazywa `SAM`, ale ten kod jest juz zajety w A3 („Samodzielnie albo Z ludzmi")
 * i dwa rozne `SAM` w dwoch rekordach wyniku to pomylka czekajaca na swoja
 * regule raportu. Tutaj nazywa sie `PRO`, od prowadzenia.
 *
 * Wynik tego modulu rozstrzyga jedna rzecz: **studia czy technikum plus
 * uprawnienia.** Nigdy nie usuwa zawodow, tylko przesuwa cala grupe drog.
 */

export interface OsA6 {
  kod: string;
  biegunA: string;
  biegunB: string;
  /** Zdanie do raportu, gdy ta strona wychodzi wyraznie. */
  wniosekA: string;
  wniosekB: string;
}

export const OSIE_A6: OsA6[] = [
  {
    kod: "TEO",
    biegunA: "Teoria mnie nie odstrasza",
    biegunB: "Tylko to, co widzę, że działa",
    wniosekA: "Nie odbijesz się od pierwszego roku, na którym jest sama teoria.",
    wniosekB: "Kierunek, na którym pierwszy prawdziwy projekt robi się na trzecim roku, jest dla Ciebie ryzykiem.",
  },
  {
    kod: "EGZ",
    biegunA: "Egzamin",
    biegunB: "Projekt do oddania",
    wniosekA: "Sesja Ci nie przeszkadza. Termin raczej Cię zbiera, niż rozprasza.",
    wniosekB: "Szukaj szkoły, w której zalicza się pracą, a nie odpytywaniem.",
  },
  {
    kod: "PRO",
    biegunA: "Uczę się sam",
    biegunB: "Potrzebuję kogoś, kto prowadzi",
    wniosekA: "Kursy i nauka własna zadziałają u Ciebie tak samo dobrze jak szkoła.",
    wniosekB: "Kurs bez terminów i bez prowadzącego prawdopodobnie porzucisz. Potrzebujesz ram.",
  },
  {
    kod: "CZY",
    biegunA: "Czytanie",
    biegunB: "Robienie",
    wniosekA: "Uczysz się z tekstu, więc długa lista lektur Cię nie zatrzyma.",
    wniosekB: "Uczysz się rękami. Szkoła bez warsztatów będzie Cię kosztować podwójnie.",
  },
  {
    kod: "JED",
    biegunA: "Jedna dziedzina na lata",
    biegunB: "Różne rzeczy",
    wniosekA: "Wąski kierunek na pięć lat Cię nie znudzi.",
    wniosekB: "Wąski kierunek na pięć lat może Cię znudzić w połowie. Szukaj szerokiego albo takiego, który można zmienić po drodze.",
  },
];

export interface ParaA6 {
  id: string;
  os: string;
  biegunA: string;
  biegunB: string;
}

/**
 * Dwadziescia par, po cztery na os.
 *
 * Ta sama zasada co w banku A3: **obie strony nazywaja te sama sytuacje tymi
 * samymi slowami.** Porownywane jest samo zachowanie, a nie to, ktore zdanie
 * jest lepiej napisane.
 */
export const PARY_A6: ParaA6[] = [
  { id: "TEO_1", os: "TEO", biegunA: "Zanim coś zrobię, chcę zrozumieć zasadę, która za tym stoi", biegunB: "Zanim zrozumiem zasadę, muszę to najpierw zrobić" },
  { id: "TEO_2", os: "TEO", biegunA: "Wykład o tym, jak coś działa, potrafi mnie wciągnąć", biegunB: "Wykład o tym, jak coś działa, usypia mnie, dopóki tego nie zobaczę" },
  { id: "TEO_3", os: "TEO", biegunA: "Wzór albo schemat tłumaczy mi rzecz lepiej niż przykład", biegunB: "Przykład tłumaczy mi rzecz lepiej niż wzór albo schemat" },
  { id: "TEO_4", os: "TEO", biegunA: "Nie przeszkadza mi uczyć się czegoś, czego użyję dopiero za rok", biegunB: "Uczę się tego, co jest mi potrzebne teraz" },

  { id: "EGZ_1", os: "EGZ", biegunA: "Wolę jeden egzamin na koniec niż projekt rozłożony na miesiące", biegunB: "Wolę projekt rozłożony na miesiące niż jeden egzamin na koniec" },
  { id: "EGZ_2", os: "EGZ", biegunA: "Uczę się najlepiej, kiedy zbliża się termin egzaminu", biegunB: "Uczę się najlepiej, kiedy robię coś, co ktoś potem obejrzy" },
  { id: "EGZ_3", os: "EGZ", biegunA: "Świadomość, że mnie odpytają, pomaga mi się zebrać", biegunB: "Świadomość, że mnie odpytają, sprawia, że gorzej myślę" },
  { id: "EGZ_4", os: "EGZ", biegunA: "Wolę sprawdzian z materiału niż pracę do oddania", biegunB: "Wolę pracę do oddania niż sprawdzian z materiału" },

  { id: "PRO_1", os: "PRO", biegunA: "Nowej rzeczy uczę się z internetu, sam, po swojemu", biegunB: "Nowej rzeczy uczę się od kogoś, kto pokaże mi kolejność" },
  { id: "PRO_2", os: "PRO", biegunA: "Kiedy utknę, szukam odpowiedzi sam, choćby długo", biegunB: "Kiedy utknę, pytam kogoś, kto to już umie" },
  { id: "PRO_3", os: "PRO", biegunA: "Sam układam sobie, w jakiej kolejności to przerobić", biegunB: "Wolę gotowy program i kogoś, kto pilnuje tempa" },
  { id: "PRO_4", os: "PRO", biegunA: "Kurs bez terminów i bez zaliczeń dokończyłbym do końca", biegunB: "Kurs bez terminów i bez zaliczeń porzuciłbym w połowie" },

  { id: "CZY_1", os: "CZY", biegunA: "Instrukcję czytam do końca, zanim wezmę się do roboty", biegunB: "Biorę się do roboty i zaglądam do instrukcji, kiedy utknę" },
  { id: "CZY_2", os: "CZY", biegunA: "Z książki albo z artykułu zapamiętuję więcej niż z ćwiczenia", biegunB: "Z ćwiczenia zapamiętuję więcej niż z książki albo z artykułu" },
  { id: "CZY_3", os: "CZY", biegunA: "Notatki i podkreślenia naprawdę mi pomagają", biegunB: "Notatki i podkreślenia niewiele mi dają, muszę spróbować" },
  { id: "CZY_4", os: "CZY", biegunA: "Wolę najpierw o czymś przeczytać, a potem to zobaczyć", biegunB: "Wolę najpierw coś zobaczyć, a potem o tym przeczytać" },

  { id: "JED_1", os: "JED", biegunA: "Wolałbym uczyć się jednej rzeczy przez kilka lat", biegunB: "Wolałbym uczyć się kilku różnych rzeczy po kolei" },
  { id: "JED_2", os: "JED", biegunA: "Wracanie do tego samego tematu na wyższym poziomie mnie cieszy", biegunB: "Wracanie do tego samego tematu zaczyna mnie nudzić" },
  { id: "JED_3", os: "JED", biegunA: "Wolę być jedyną osobą, która zna się na wąskiej rzeczy", biegunB: "Wolę znać się po trochu na wielu rzeczach" },
  { id: "JED_4", os: "JED", biegunA: "Kierunek o jednym temacie na trzy lata brzmi dla mnie dobrze", biegunB: "Kierunek o jednym temacie na trzy lata brzmi dla mnie ciasno" },
];

/**
 * Trzy pytania o gotowosc do inwestycji.
 *
 * Nie o to, czy dalby rade, tylko na co sie godzi. Kazde ma „nie wiem"
 * i „nie wiem" nie jest odpowiedzia domyslna: przy nim wymiar nie przycina
 * niczego, dokladnie tak samo jak przy trzech pytaniach wprost w M1.
 */
export interface PytanieInwestycjiA6 {
  id: string;
  tresc: string;
  podpis?: string;
  opcje: Array<{ kod: string; etykieta: string; podpis?: string }>;
}

export const INWESTYCJA_A6: PytanieInwestycjiA6[] = [
  {
    id: "lata",
    tresc: "Ile lat nauki jesteś gotów poświęcić, zanim zaczniesz zarabiać?",
    podpis: "Chodzi o naukę zamiast pracy, nie obok pracy. O to drugie pytamy niżej.",
    opcje: [
      { kod: "zero", etykieta: "Chcę zarabiać od razu", podpis: "Po szkole idę do pracy." },
      { kod: "do_dwoch", etykieta: "Do dwóch lat", podpis: "Kurs, szkoła policealna, uprawnienia." },
      { kod: "trzy_cztery", etykieta: "Trzy albo cztery lata", podpis: "Licencjat albo inżynier." },
      { kod: "piec_wiecej", etykieta: "Pięć lat i więcej", podpis: "Studia w całości, także magisterskie." },
      { kod: "nie_wiem", etykieta: "Jeszcze nie wiem" },
    ],
  },
  {
    id: "wieczorami",
    tresc: "Czy uczyłbyś się wieczorami przez kilka lat, pracując w ciągu dnia?",
    opcje: [
      { kod: "tak", etykieta: "Tak", podpis: "Zaocznie albo po godzinach." },
      { kod: "zalezy", etykieta: "Zależy, co bym z tego miał" },
      { kod: "nie", etykieta: "Nie", podpis: "Po pracy chcę mieć wolne." },
      { kod: "nie_wiem", etykieta: "Jeszcze nie wiem" },
    ],
  },
  {
    id: "przeprowadzka_nauka",
    tresc: "A gdyby nauka wymagała przeprowadzki na kilka lat?",
    opcje: [
      { kod: "tak", etykieta: "Tak, gdziekolwiek" },
      { kod: "region", etykieta: "Tylko w moim regionie" },
      { kod: "nie", etykieta: "Nie, zostaję na miejscu" },
      { kod: "nie_wiem", etykieta: "Jeszcze nie wiem" },
    ],
  },
];

export const INSTRUKCJA_A6 = {
  naglowek: "Jak się uczę",
  wprowadzenie: [
    "Ostatnia rzecz, i zupełnie inna niż poprzednie: nie o tym, co chcesz robić, tylko o tym, jak się uczysz.",
    "Od tego zależy jedna decyzja: czy droga przez szkołę ma dla Ciebie sens, czy lepiej wejdziesz przez uprawnienia i pracę.",
  ],
  rozwiniecie: [
    "Nie ma tu lepszej strony. Człowiek, który uczy się rękami, nie jest gorszym uczniem od tego, który uczy się z książki. Jest innym i potrzebuje innej szkoły.",
  ],
  polecenieBloku: "Co jest bliżej prawdy o Tobie?",
  inwestycjaNaglowek: "Ile jesteś gotów w to włożyć",
  inwestycjaPodpis: "Trzy pytania o czas, nie o chęci. „Jeszcze nie wiem” jest pełnoprawną odpowiedzią i niczego nie przycina.",
} as const;

export const ZAMKNIECIE_A6 =
  "Gotowe. To była ostatnia część. Teraz prowadzący otwiera Twój raport.";
