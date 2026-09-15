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
  /** Nadpis grupy nad etykieta, gdy opcje dziela sie na dwie rodziny. */
  nadpis?: string;
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

/**
 * Cztery scieczki przez modul.
 *
 * Po wyborze etapu uczestnik widzi wylacznie pytania, ktore go dotycza.
 * Dotad przedmioty szkolne nie mialy zadnego warunku, wiec dwudziestoczterolatek
 * po studiach dostawal pytanie "z czym radzisz sobie w szkole najlepiej" i liste
 * z wychowaniem fizycznym. Odpowiedz byla bezuzyteczna, a samo pytanie mowilo mu
 * przy pierwszym module, ze ten program jest nie dla niego.
 */
/** Sciezka 1: przed wyborem szkoly albo rozszerzen. Rozszerzenia sa planem. */
const ETAPY_PRZED_ROZSZERZENIAMI = ["podstawowka", "liceum_1_2"];
/** Sciezka 2: przed matura. Rozszerzenia sa juz faktem. */
const ETAPY_PRZED_MATURA = ["liceum_maturalna"];
/** Sciezki 1 i 2 razem: tylko tu przedmioty szkolne cokolwiek znacza. */
const ETAPY_SZKOLNE = ["podstawowka", "liceum_1_2", "liceum_maturalna", "branzowa"];
/** Sciezka 3: matura za soba, kierunek wybrany albo wybierany. */
const ETAPY_PO_MATURZE = ["po_maturze", "studiuje"];
/** Sciezka 4: po studiach, pracujacy, przerwa. Zero pytan o szkole. */
const ETAPY_ZMIANY = ["po_studiach", "pracuje_zmiana", "nie_uczy_nie_pracuje"];

/** Obszary zawodowe do pytania o dotychczasowa prace. Szerokie, nie branze PKD. */
export const OBSZARY_PRACY_A0: OpcjaA0[] = [
  { kod: "handel", etykieta: "Handel i sprzedaż" },
  { kod: "biuro", etykieta: "Biuro i administracja" },
  { kod: "produkcja", etykieta: "Produkcja i magazyn" },
  { kod: "budowlanka", etykieta: "Budownictwo i instalacje" },
  { kod: "transport", etykieta: "Transport i logistyka" },
  { kod: "gastronomia", etykieta: "Gastronomia i hotelarstwo" },
  { kod: "opieka", etykieta: "Opieka, zdrowie, praca z ludźmi" },
  { kod: "edukacja", etykieta: "Edukacja i szkolenia" },
  { kod: "it", etykieta: "Informatyka i technologie" },
  { kod: "kreatywne", etykieta: "Media, projektowanie, twórczość" },
  { kod: "uslugi", etykieta: "Usługi osobiste i rzemiosło" },
  { kod: "sluzby", etykieta: "Służby mundurowe i ochrona" },
  { kod: "rolnictwo", etykieta: "Rolnictwo, przyroda, zwierzęta" },
  { kod: "inne", etykieta: "Coś innego" },
  { kod: "nie_pracowalem", etykieta: "Nie pracowałem zawodowo" },
];

export const PYTANIA_A0: PytanieA0[] = [
  {
    id: "etap",
    blok: 1,
    nazwaBloku: "Gdzie jesteś",
    typ: "pojedynczy",
    tresc: "Na jakim etapie nauki jesteś?",
    opcje: [
      { kod: "podstawowka", etykieta: "Ostatnia klasa szkoły podstawowej", nadpis: "Uczę się" },
      { kod: "liceum_1_2", etykieta: "Liceum lub technikum, klasa pierwsza lub druga", nadpis: "Uczę się" },
      { kod: "liceum_maturalna", etykieta: "Liceum lub technikum, klasa przedmaturalna lub maturalna", nadpis: "Uczę się" },
      { kod: "branzowa", etykieta: "Szkoła branżowa", nadpis: "Uczę się" },
      { kod: "po_maturze", etykieta: "Po maturze, przerwa albo szukam kierunku", nadpis: "Uczę się" },
      { kod: "studiuje", etykieta: "Studiuję", nadpis: "Uczę się" },
      { kod: "po_studiach", etykieta: "Po studiach", nadpis: "Po szkole" },
      { kod: "pracuje_zmiana", etykieta: "Pracuję, rozważam zmianę", nadpis: "Po szkole" },
      { kod: "nie_uczy_nie_pracuje", etykieta: "Nie uczę się i nie pracuję", nadpis: "Po szkole" },
    ],
  },
  {
    id: "rozszerzenia",
    blok: 1,
    nazwaBloku: "Gdzie jesteś",
    typ: "wielokrotny",
    tresc: "Jakie rozszerzenia planujesz?",
    tylkoEtapy: ETAPY_PRZED_ROZSZERZENIAMI,
    opcje: [
      ...PRZEDMIOTY_A0.filter((p) => p.kod !== "warsztat"),
      { kod: "nie_wiem", etykieta: "Jeszcze nie wiem, dlatego tu jestem" },
    ],
  },
  {
    id: "rozszerzenia_mam",
    blok: 1,
    nazwaBloku: "Gdzie jesteś",
    typ: "wielokrotny",
    tresc: "Jakie masz rozszerzenia?",
    podpis: "To już jest fakt, nie plan. Od tego zależy, które kierunki są dla Ciebie otwarte.",
    tylkoEtapy: ETAPY_PRZED_MATURA,
    opcje: PRZEDMIOTY_A0.filter((p) => p.kod !== "warsztat"),
  },
  {
    id: "matura_plan",
    blok: 1,
    nazwaBloku: "Gdzie jesteś",
    typ: "wielokrotny",
    tresc: "Z czego planujesz zdawać maturę rozszerzoną?",
    podpis:
      "Rozszerzenie w szkole i matura rozszerzona to nie zawsze to samo. Przy rekrutacji liczy się to drugie.",
    tylkoEtapy: ETAPY_PRZED_MATURA,
    opcje: [
      ...PRZEDMIOTY_A0.filter((p) => p.kod !== "warsztat" && p.kod !== "zawodowe"),
      { kod: "nie_wiem", etykieta: "Jeszcze nie zdecydowałem" },
    ],
  },
  {
    id: "matura_zdana",
    blok: 1,
    nazwaBloku: "Gdzie jesteś",
    typ: "wielokrotny",
    tresc: "Z czego zdawałeś maturę rozszerzoną?",
    podpis: "To decyduje o tym, które kierunki są dla Ciebie realnie dostępne.",
    tylkoEtapy: ETAPY_PO_MATURZE,
    opcje: [
      ...PRZEDMIOTY_A0.filter((p) => p.kod !== "warsztat" && p.kod !== "zawodowe"),
      { kod: "brak", etykieta: "Nie zdawałem żadnego rozszerzenia" },
    ],
  },
  {
    id: "przedmioty_mocne",
    blok: 2,
    nazwaBloku: "Co Ci idzie",
    typ: "dokladnie_trzy",
    // Polecenie schodzi pod pytanie. Sklejone z nim łamało nagłówek na trzy
    // linie i „Wskaż trzy" czytało się jak część pytania, a nie jak zasada.
    tresc: "Z czym radzisz sobie najlepiej?",
    podpis: "Wskaż trzy. Chodzi o to, co idzie Ci łatwo, nie o same oceny.",
    tylkoEtapy: ETAPY_SZKOLNE,
    opcje: PRZEDMIOTY_A0,
  },
  {
    id: "przedmioty_trudne",
    blok: 2,
    nazwaBloku: "Co Ci idzie",
    typ: "dokladnie_trzy",
    tresc: "Co sprawia Ci największą trudność?",
    podpis: "Wskaż trzy. To nie jest ocena, tylko informacja, czego lepiej nie zakładać.",
    tylkoEtapy: ETAPY_SZKOLNE,
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
  // --- SCIEZKA 3: po maturze albo w trakcie studiow ---
  {
    id: "kierunek",
    blok: 2,
    nazwaBloku: "Twoja droga",
    typ: "tekst",
    tresc: "Co studiujesz albo na co się wybierałeś?",
    podpis: "Nazwa kierunku wystarczy. Jeśli jeszcze nie wiesz, zostaw puste.",
    tylkoEtapy: ETAPY_PO_MATURZE,
    opcjonalne: true,
  },
  {
    id: "kierunek_ocena",
    blok: 2,
    nazwaBloku: "Twoja droga",
    typ: "pojedynczy",
    tresc: "Na ile ten kierunek okazał się tym, czego oczekiwałeś?",
    tylkoEtapy: ETAPY_PO_MATURZE,
    opcje: [
      { kod: "dokladnie", etykieta: "To jest dokładnie to, czego chciałem" },
      { kod: "w_porzadku", etykieta: "Jest w porządku, ale nie porywa" },
      { kod: "zupelnie_nie", etykieta: "Zupełnie nie to, czego się spodziewałem" },
      { kod: "nie_wiem", etykieta: "Jeszcze nie wiem" },
    ],
  },

  // --- SCIEZKA 4: po studiach, pracujacy, przerwa ---
  {
    id: "wyksztalcenie",
    blok: 2,
    nazwaBloku: "Twoja droga",
    typ: "pojedynczy",
    tresc: "Co skończyłeś?",
    tylkoEtapy: ETAPY_ZMIANY,
    opcje: [
      { kod: "podstawowe", etykieta: "Szkołę podstawową" },
      { kod: "branzowe", etykieta: "Szkołę branżową albo zawodową" },
      { kod: "srednie", etykieta: "Liceum albo technikum" },
      { kod: "technikum_matura", etykieta: "Technikum z maturą" },
      { kod: "licencjat", etykieta: "Studia licencjackie albo inżynierskie" },
      { kod: "magister", etykieta: "Studia magisterskie" },
      { kod: "podyplomowe", etykieta: "Studia podyplomowe albo doktorat" },
    ],
  },
  {
    id: "wyksztalcenie_kierunek",
    blok: 2,
    nazwaBloku: "Twoja droga",
    typ: "tekst",
    tresc: "Jaki kierunek albo zawód?",
    podpis: "Nazwa wystarczy. To pole jest nieobowiązkowe.",
    tylkoEtapy: ETAPY_ZMIANY,
    opcjonalne: true,
  },
  {
    id: "branza",
    blok: 2,
    nazwaBloku: "Twoja droga",
    typ: "wielokrotny",
    tresc: "Czym się zajmujesz albo zajmowałeś zawodowo?",
    tylkoEtapy: ETAPY_ZMIANY,
    opcje: OBSZARY_PRACY_A0,
  },
  {
    id: "staz_pracy",
    blok: 2,
    nazwaBloku: "Twoja droga",
    typ: "pojedynczy",
    tresc: "Jak długo?",
    tylkoEtapy: ETAPY_ZMIANY,
    opcje: [
      { kod: "do_roku", etykieta: "Do roku" },
      { kod: "rok_trzy", etykieta: "Od roku do trzech lat" },
      { kod: "powyzej_trzech", etykieta: "Powyżej trzech lat" },
      { kod: "nie_pracowalem", etykieta: "Nie pracowałem zawodowo" },
    ],
  },
  {
    id: "powod_zmiany",
    blok: 2,
    nazwaBloku: "Twoja droga",
    typ: "wielokrotny",
    tresc: "Dlaczego szukasz zmiany?",
    podpis: "Możesz zaznaczyć kilka. To zmienia zakończenie Twojego raportu.",
    tylkoEtapy: ETAPY_ZMIANY,
    opcje: [
      { kod: "brak_pracy_w_zawodzie", etykieta: "Nie znalazłem pracy w swoim zawodzie" },
      { kod: "nie_to_czego_chcialem", etykieta: "Znalazłem, ale to nie jest to, czego chciałem" },
      { kod: "wypalenie", etykieta: "Wypaliłem się" },
      { kod: "zdrowie", etykieta: "Zdrowie nie pozwala mi robić tego dalej" },
      { kod: "zarobki", etykieta: "Zarabiam za mało" },
      { kod: "na_swoim", etykieta: "Chcę pracować na swoim" },
      { kod: "sytuacja_zyciowa", etykieta: "Zmieniła się moja sytuacja życiowa" },
      { kod: "zawsze_co_innego", etykieta: "Zawsze chciałem robić coś innego" },
    ],
  },
  {
    id: "blokada",
    blok: 2,
    nazwaBloku: "Twoja droga",
    typ: "wielokrotny",
    tresc: "Co dziś najbardziej Cię blokuje?",
    tylkoEtapy: ETAPY_ZMIANY,
    opcje: [
      { kod: "nie_wiem_co", etykieta: "Nie wiem, co chciałbym robić" },
      { kod: "nie_mam_jak", etykieta: "Wiem, ale nie mam jak zacząć" },
      { kod: "uprawnienia", etykieta: "Brakuje mi uprawnień albo wykształcenia" },
      { kod: "koszt", etykieta: "Nie stać mnie na przekwalifikowanie" },
      { kod: "przerwa_w_zarobkach", etykieta: "Nie mogę sobie pozwolić na przerwę w zarobkach" },
      { kod: "rodzina", etykieta: "Zobowiązania rodzinne" },
      { kod: "od_czego_zaczac", etykieta: "Nic konkretnego, po prostu nie wiem, od czego zacząć" },
    ],
  },

  {
    id: "doswiadczenie",
    blok: 3,
    nazwaBloku: "Co już robiłeś",
    typ: "wielokrotny",
    tresc: "Co z tego już robiłeś?",
    podpis: "Zaznacz wszystko, co pasuje. Liczy się także to, co robiłeś poza szkołą.",
    opcje: [
      { kod: "praca_doryw", etykieta: "Praca dorywcza albo wakacyjna" },
      { kod: "praca_stala", etykieta: "Praca stała" },
      { kod: "wolontariat", etykieta: "Wolontariat" },
      { kod: "firma_rodzinna", etykieta: "Pomoc w rodzinnej firmie albo gospodarstwie" },
      { kod: "projekty", etykieta: "Własne projekty, które ktoś zobaczył" },
      { kod: "hobby", etykieta: "Hobby uprawiane od kilku lat" },
      { kod: "prowadzenie", etykieta: "Prowadzenie czegoś w szkole albo w grupie" },
      { kod: "praktyki", etykieta: "Praktyki, staż albo praca studencka" },
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
    // Pytanie w nagłówku, wyjaśnienie pod nim. Sto osiemdziesiąt znaków
    // w nagłówku łamało się na pięć linii i nie dawało się przeczytać
    // jako pytanie.
    tresc: "Na co Cię dziś realnie stać?",
    podpis:
      "Część dróg wymaga opłacenia kursów, uprawnień albo sprzętu, od kilku tysięcy do kilkudziesięciu. Pytamy, żeby nie pokazywać Ci dróg, których nie da się dziś opłacić. Zawsze pokażemy też wariant za zero złotych.",
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

/**
 * Piec sciezek przez A0.
 *
 * Etap nauki rozstrzyga, o co pytamy dalej, wiec uczestnik ma od razu
 * zobaczyc, w ktora sciezke wszedl i ile pytan przed nim. „Nie zapytamy Cie
 * o" jest liczone z `PYTANIA_A0`, a nie wpisane recznie: recznie rozjechaloby
 * sie przy pierwszej zmianie pytan i nikt by tego nie zauwazyl.
 */
export const SCIEZKI_A0: Array<{ nr: number; nazwa: string; etapy: string[]; opis: string }> = [
  {
    nr: 1,
    nazwa: "przed rozszerzeniami",
    etapy: ETAPY_PRZED_ROZSZERZENIAMI,
    opis: "Pytamy o to, co dopiero wybierzesz, i o to, co idzie Ci łatwo.",
  },
  {
    nr: 2,
    nazwa: "przed maturą",
    etapy: ETAPY_PRZED_MATURA,
    opis: "Pytamy o rozszerzenia, które już masz, i o plan na maturę.",
  },
  {
    nr: 3,
    nazwa: "studia",
    etapy: ETAPY_PO_MATURZE,
    opis: "Pytamy o maturę, kierunek i o to, czy się sprawdził.",
  },
  {
    nr: 4,
    nazwa: "nowy start",
    etapy: ETAPY_ZMIANY,
    opis: "Pytamy o to, co masz za sobą, co Cię blokuje i od czego chcesz zacząć.",
  },
  {
    nr: 5,
    nazwa: "szkoła branżowa",
    etapy: ["branzowa"],
    opis: "Pytamy o przedmioty, w których jesteś mocny, i o zaplecze na start.",
  },
];

/** Ścieżka dla etapu. Null, dopóki uczestnik nie odpowie na pierwsze pytanie. */
export function sciezkaA0(etap: string | null | undefined) {
  if (!etap) return null;
  return SCIEZKI_A0.find((s) => s.etapy.includes(etap)) ?? null;
}

/**
 * Tematy, o które na tej ścieżce nie zapytamy.
 *
 * Liczone z pytań, nie z listy w treści: pytanie schowane za `tylkoEtapy`,
 * którego ten etap nie obejmuje, jest dokładnie tym, czego uczestnik nie
 * zobaczy. Nazwa tematu pochodzi z pytania, więc nie trzeba jej powtarzać.
 */
export const TEMATY_A0: Record<string, string> = {
  rozszerzenia: "rozszerzenia",
  rozszerzenia_mam: "rozszerzenia",
  matura_plan: "maturę rozszerzoną",
  matura_zdana: "zdaną maturę",
  przedmioty_mocne: "przedmioty szkolne",
  przedmioty_trudne: "przedmioty szkolne",
  matematyka: "matematykę",
  kierunek: "kierunek studiów",
  kierunek_ocena: "kierunek studiów",
  wyksztalcenie: "ukończoną szkołę",
  wyksztalcenie_kierunek: "ukończoną szkołę",
  branza: "branżę, w której pracujesz",
  staz_pracy: "staż pracy",
  powod_zmiany: "powód zmiany",
  blokada: "to, co Cię blokuje",
};

export function czegoNieZapytamyA0(etap: string | null | undefined): string[] {
  if (!etap) return [];
  const pominiete = PYTANIA_A0.filter(
    (p) => p.tylkoEtapy && !p.tylkoEtapy.includes(etap),
  ).map((p) => TEMATY_A0[p.id]);
  return [...new Set(pominiete.filter(Boolean))];
}

export const INSTRUKCJA_A0 = {
  naglowek: "Punkt startu",
  wprowadzenie: [
    "Zaczniemy od kilku konkretów o Twojej sytuacji. To nie jest test i nie ma tu dobrych odpowiedzi.",
    "Chodzi o to, żeby system nie proponował Ci dróg, które są dla Ciebie zamknięte, i żeby na koniec dostać radę pasującą do miejsca, w którym jesteś, a nie ogólną.",
    "Jedno pytanie jest o zdrowiu i jest w całości dobrowolne.",
  ],
} as const;
