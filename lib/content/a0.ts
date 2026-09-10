/**
 * MODUL A0: PUNKT STARTU. Tresc przepisana z
 * program-doradztwa/02_assessmenty/A0_punkt_startu.md, bez zmian.
 *
 * Osiem minut na kilka konkretow. To nie jest assessment, tylko metryczka:
 * zbiera fakty, nie opinie o sobie. Zadne pytanie nie moze brzmiec jak ocena.
 */

export type TypPytaniaA0 =
  | "pojedynczy"
  | "wielokrotny"
  | "dokladnie_trzy"
  | "tekst";

export interface OpcjaA0 {
  kod: string;
  etykieta: string;
  /** Opcja odmowy odpowiedzi. Nie ma zadnych konsekwencji dla wyniku. */
  odmowa?: boolean;
}

export interface PytanieA0 {
  id: string;
  blok: number;
  nazwaBloku: string;
  typ: TypPytaniaA0;
  tresc: string;
  /** Dodatkowe zdanie pod pytaniem, zdejmujace presje. */
  podpis?: string;
  opcje?: OpcjaA0[];
  /** Pytanie zadawane tylko na wskazanych etapach edukacji. */
  tylkoEtapy?: string[];
  opcjonalne?: boolean;
}

export const PRZEDMIOTY_A0: OpcjaA0[] = [
  { kod: "matematyka", etykieta: "matematyka" },
  { kod: "fizyka", etykieta: "fizyka" },
  { kod: "chemia", etykieta: "chemia" },
  { kod: "biologia", etykieta: "biologia" },
  { kod: "geografia", etykieta: "geografia" },
  { kod: "informatyka", etykieta: "informatyka" },
  { kod: "polski", etykieta: "język polski" },
  { kod: "jezyki", etykieta: "języki obce" },
  { kod: "historia", etykieta: "historia" },
  { kod: "wos", etykieta: "wiedza o społeczeństwie" },
  { kod: "artystyczne", etykieta: "przedmioty artystyczne" },
  { kod: "wf", etykieta: "wychowanie fizyczne" },
  { kod: "zawodowe", etykieta: "przedmioty zawodowe" },
  { kod: "warsztat", etykieta: "praca w warsztacie lub pracowni" },
];

const ETAPY_Z_ROZSZERZENIAMI = ["liceum_1_2", "liceum_maturalna", "podstawowka"];
const ETAPY_SZKOLNE = ["podstawowka", "liceum_1_2", "liceum_maturalna", "branzowa"];

export const PYTANIA_A0: PytanieA0[] = [
  {
    id: "etap",
    blok: 1,
    nazwaBloku: "Gdzie jesteś",
    typ: "pojedynczy",
    tresc: "Na jakim etapie nauki jesteś?",
    opcje: [
      { kod: "podstawowka", etykieta: "Ostatnia klasa szkoły podstawowej" },
      { kod: "liceum_1_2", etykieta: "Liceum lub technikum, klasa pierwsza lub druga" },
      { kod: "liceum_maturalna", etykieta: "Liceum lub technikum, klasa przedmaturalna lub maturalna" },
      { kod: "branzowa", etykieta: "Szkoła branżowa" },
      { kod: "po_maturze", etykieta: "Po maturze, przerwa albo szukam kierunku" },
      { kod: "studiuje", etykieta: "Studiuję" },
      { kod: "po_studiach", etykieta: "Po studiach" },
      { kod: "pracuje_zmiana", etykieta: "Pracuję, rozważam zmianę" },
      { kod: "nie_uczy_nie_pracuje", etykieta: "Nie uczę się i nie pracuję" },
    ],
  },
  {
    id: "rozszerzenia",
    blok: 1,
    nazwaBloku: "Gdzie jesteś",
    typ: "wielokrotny",
    tresc: "Jakie masz albo planujesz rozszerzenia?",
    tylkoEtapy: ETAPY_Z_ROZSZERZENIAMI,
    opcje: [
      ...PRZEDMIOTY_A0.filter((p) => p.kod !== "warsztat"),
      { kod: "nie_wiem", etykieta: "Jeszcze nie wiem, dlatego tu jestem" },
    ],
  },
  {
    id: "przedmioty_mocne",
    blok: 2,
    nazwaBloku: "Co Ci idzie",
    typ: "dokladnie_trzy",
    tresc: "Z czym radzisz sobie w szkole najlepiej? Wskaż trzy.",
    opcje: PRZEDMIOTY_A0,
  },
  {
    id: "przedmioty_trudne",
    blok: 2,
    nazwaBloku: "Co Ci idzie",
    typ: "dokladnie_trzy",
    tresc: "Co sprawia Ci największą trudność? Wskaż trzy.",
    opcje: PRZEDMIOTY_A0,
  },
  {
    id: "matematyka",
    blok: 2,
    nazwaBloku: "Co Ci idzie",
    typ: "pojedynczy",
    tresc: "Jak wygląda u Ciebie matematyka?",
    tylkoEtapy: ETAPY_SZKOLNE,
    opcje: [
      { kod: "dobrze", etykieta: "Idzie dobrze, myślę o rozszerzeniu" },
      { kod: "radze_sobie", etykieta: "Radzę sobie, ale bez entuzjazmu" },
      { kod: "trudna", etykieta: "Jest trudna, ale daję radę" },
      { kod: "najwiekszy_problem", etykieta: "To mój największy problem" },
    ],
  },
  {
    id: "doswiadczenie",
    blok: 3,
    nazwaBloku: "Co już robiłeś",
    typ: "wielokrotny",
    tresc: "Co z tego już robiłeś? Zaznacz wszystko, co pasuje.",
    opcje: [
      { kod: "praca_doryw", etykieta: "Praca dorywcza albo wakacyjna" },
      { kod: "praca_stala", etykieta: "Praca stała" },
      { kod: "wolontariat", etykieta: "Wolontariat" },
      { kod: "firma_rodzinna", etykieta: "Pomoc w rodzinnej firmie albo gospodarstwie" },
      { kod: "projekty", etykieta: "Własne projekty, które ktoś zobaczył" },
      { kod: "hobby", etykieta: "Hobby uprawiane od kilku lat" },
      { kod: "prowadzenie", etykieta: "Prowadzenie czegoś w szkole albo w grupie" },
      { kod: "kursy", etykieta: "Kursy albo szkolenia poza szkołą" },
      { kod: "konkursy", etykieta: "Konkursy, olimpiady, zawody" },
      { kod: "nic", etykieta: "Nic z tego" },
    ],
  },
  {
    id: "doswiadczenie_opis",
    blok: 3,
    nazwaBloku: "Co już robiłeś",
    typ: "tekst",
    tresc: "Jeśli coś z powyższych zaznaczyłeś, napisz krótko co to było.",
    podpis: "Dwa zdania wystarczą. To pole jest nieobowiązkowe.",
    opcjonalne: true,
  },
  {
    id: "miejsce",
    blok: 4,
    nazwaBloku: "Skąd startujesz",
    typ: "pojedynczy",
    tresc: "Gdzie mieszkasz?",
    opcje: [
      { kod: "wies", etykieta: "Wieś" },
      { kod: "male_miasto", etykieta: "Miasto do 20 tysięcy" },
      { kod: "srednie_miasto", etykieta: "Miasto 20 do 100 tysięcy" },
      { kod: "duze_miasto", etykieta: "Miasto 100 do 500 tysięcy" },
      { kod: "wielkie_miasto", etykieta: "Duże miasto powyżej 500 tysięcy" },
    ],
  },
  {
    id: "mobilnosc",
    blok: 4,
    nazwaBloku: "Skąd startujesz",
    typ: "pojedynczy",
    tresc: "Czy jesteś gotów przeprowadzić się dla nauki albo pracy?",
    opcje: [
      { kod: "tak_daleko", etykieta: "Tak, także daleko" },
      { kod: "tak_region", etykieta: "Tak, ale w granicach mojego regionu" },
      { kod: "wolalbym_nie", etykieta: "Wolałbym nie" },
      { kod: "nie", etykieta: "Nie, to nie wchodzi w grę" },
    ],
  },
  {
    id: "dojazd",
    blok: 4,
    nazwaBloku: "Skąd startujesz",
    typ: "pojedynczy",
    tresc: "Czy dojazd do dużego miasta jest dla Ciebie realny na co dzień?",
    opcje: [
      { kod: "blisko", etykieta: "Tak, mieszkam blisko" },
      { kod: "godzina", etykieta: "Tak, ale to godzina w jedną stronę" },
      { kod: "nie", etykieta: "Nie" },
    ],
  },
  {
    id: "zasoby",
    blok: 5,
    nazwaBloku: "Pieniądze na drogę",
    typ: "pojedynczy",
    tresc:
      "Część dróg zawodowych wymaga opłacenia kursów, uprawnień albo sprzętu. Bywa to od kilku tysięcy do kilkudziesięciu. Na ile realne jest to w Twojej sytuacji w ciągu najbliższych lat?",
    opcje: [
      { kod: "realne", etykieta: "Realne, gdyby to była dobra droga" },
      { kod: "raty", etykieta: "Trudne, ale przy rozłożeniu na raty albo dofinansowaniu możliwe" },
      { kod: "bardzo_trudne", etykieta: "Bardzo trudne, musiałbym zarobić na to sam" },
      { kod: "nierealne", etykieta: "Nierealne" },
    ],
  },
  {
    id: "ograniczenia",
    blok: 6,
    nazwaBloku: "Zdrowie, dobrowolnie",
    typ: "wielokrotny",
    tresc: "Czy jest coś, o czym warto wiedzieć przy dobieraniu ścieżek?",
    podpis:
      "To nie jest badanie, nikt tego nie sprawdzi i możesz to pominąć. Chodzi wyłącznie o to, żeby nie proponować Ci drogi, która jest dla Ciebie zamknięta.",
    opcjonalne: true,
    opcje: [
      { kod: "alergie_wziewne", etykieta: "Alergie wziewne, na przykład na mąkę, pył, sierść" },
      { kod: "alergie_skorne", etykieta: "Alergie skórne, na przykład na chemikalia i preparaty" },
      { kod: "kregoslup", etykieta: "Ograniczenia ruchowe albo problemy z kręgosłupem" },
      { kod: "wzrok", etykieta: "Wada wzroku, której nie da się w pełni skorygować" },
      { kod: "sluch", etykieta: "Ubytek słuchu" },
      { kod: "wysokosc", etykieta: "Lęk wysokości" },
      { kod: "inne", etykieta: "Coś innego, o czym chcę powiedzieć prowadzącemu" },
      { kod: "nie_chce", etykieta: "Nie chcę odpowiadać na to pytanie", odmowa: true },
      { kod: "brak", etykieta: "Nic z powyższych" },
    ],
  },
];

export const INSTRUKCJA_A0 = {
  naglowek: "Punkt startu",
  wprowadzenie: [
    "Zaczniemy od kilku konkretów o Twojej sytuacji. To nie jest test i nie ma tu dobrych odpowiedzi.",
    "Chodzi o to, żeby system nie proponował Ci dróg, które są dla Ciebie zamknięte, i żeby na koniec dostać radę pasującą do miejsca, w którym jesteś, a nie ogólną.",
    "Jedno pytanie jest o zdrowiu i jest w całości dobrowolne.",
  ],
} as const;
