/**
 * MODUL A4: CO JEST DLA MNIE WAZNE.
 *
 * Plan zrownowazony: kazda z 12 wartosci wystepuje w dokladnie 6 parach,
 * zadna para sie nie powtarza. Suma wygranych po 12 wartosciach zawsze 36.
 *
 * **Piec formul zamiast jednej.** Te same 36 porownan, ale pytanie stawiane
 * na piec sposobow. Powod nie jest ozdobny: pytanie zadane raz w jednej
 * formie mierzy po czesci sama forme. Zestawienie pomagania ludziom
 * z zarobkami przy pytaniu „co wazniejsze" prawie zawsze wygrywa pomaganie,
 * bo tak wypada odpowiedziec. To samo porownanie w formie „z czego predzej
 * bys zrezygnowal" daje inny wynik, bo obie strony cos kosztuja. Drugi powod
 * jest prostszy: trzydziesci szesc identycznych pytan pod rzad usypia.
 *
 * **Blok czwarty dziala odwrotnie**: wybrana odpowiedz oznacza wartosc mniej
 * wazna. Odwrocenie robi `lib/moduly/zbieranie.ts` w jednym miejscu, przed
 * podaniem odpowiedzi silnikowi. W bazie zostaje to, co uczestnik naprawde
 * kliknal, zeby panel prowadzacego nie pokazywal czegos innego niz ekran.
 */

export type FormulaA4 = "klasyczna" | "oferty" | "za_10_lat" | "rezygnacja" | "rada";

export interface ParaA4 {
  nr: number;
  /** Miejsce w przebiegu. Bloki musza isc ciagiem, bo zmiana formuly w srodku
   *  bloku znaczylaby dla uczestnika, ze zmienily sie zasady. */
  kolejnosc: number;
  lewa: string;
  prawa: string;
  formula: FormulaA4;
  tekstLewej: string;
  tekstPrawej: string;
}

/**
 * Piec formul. `odwrotna` jest prawdziwa wylacznie dla rezygnacji i od niej
 * zalezy, ktora strone zapisujemy jako wygrana.
 */
export const FORMULY_A4: Record<
  FormulaA4,
  {
    blok: number;
    etykieta: string;
    naglowek: string;
    podtytul?: string;
    /** Zdanie odreczne pod naglowkiem, gdy formula go ma. */
    dopisek?: string;
    /** Nadpis nad tekstem odpowiedzi. Pusty tam, gdzie nazwa wartosci stoi pod spodem. */
    nadpisOdpowiedzi?: string;
    odwrotna: boolean;
  }
> = {
  klasyczna: {
    blok: 1,
    etykieta: "Formuła klasyczna",
    naglowek: "Co jest dla Ciebie ważniejsze?",
    podtytul: "Nie ma dobrych ani złych odpowiedzi. Wybieraj intuicyjnie, pierwsze wrażenie jest najtrafniejsze.",
    odwrotna: false,
  },
  oferty: {
    blok: 2,
    etykieta: "Dwie oferty",
    naglowek: "Dostajesz dwie oferty pracy. Wszystko inne jest takie samo. Którą bierzesz?",
    dopisek: "Ta sama pensja, to samo miasto.",
    nadpisOdpowiedzi: "Oferta",
    odwrotna: false,
  },
  za_10_lat: {
    blok: 3,
    etykieta: "Za dziesięć lat",
    naglowek: "Wyobraź sobie siebie za dziesięć lat. Która sytuacja byłaby lepsza?",
    dopisek: "Małe wybory. Wielkie możliwości.",
    odwrotna: false,
  },
  rezygnacja: {
    blok: 4,
    etykieta: "Rezygnacja",
    naglowek: "Z czego prędzej byś zrezygnował?",
    podtytul: "Wybrana odpowiedź oznacza wartość mniej ważną",
    nadpisOdpowiedzi: "Odpuszczam",
    odwrotna: true,
  },
  rada: {
    blok: 5,
    etykieta: "Rada",
    naglowek: "Znajomy waha się między dwiema pracami. Co byś mu powiedział?",
    dopisek: "Radzimy innym to, co sami cenimy.",
    odwrotna: false,
  },
};

export const LICZBA_BLOKOW_A4 = 5;

/**
 * Ekran przed blokiem czwartym.
 *
 * Bez niego uczestnik odpowiada przez szesc pytan odwrotnie, niz mysli, i tego
 * nie da sie potem odkrecic: wynik wyglada sensownie i jest falszywy.
 */
export const OSTRZEZENIE_A4 = {
  etykieta: "Zmiana zasady",
  naglowek: "Teraz pytamy odwrotnie",
  akapity: [
    "W następnych sześciu pytaniach wybierasz to, z czego prędzej byś zrezygnował. Zaznaczona odpowiedź oznacza wartość mniej ważną dla Ciebie.",
  ],
  zestawienie: [
    { etykieta: "Bloki 1 do 3", tresc: "Wybierasz to, co dla Ciebie ważniejsze" },
    { etykieta: "Blok 4", tresc: "Wybierasz to, czego prędzej byś odpuścił" },
  ],
  dopisek: "Obie strony coś kosztują, dlatego pytamy tak.",
  przycisk: "Rozumiem, dalej",
} as const;

/** Krotkie nazwy wartosci: nadpis nad odpowiedzia i podpis pod nia. */
export const NAZWY_KROTKIE_A4: Record<string, string> = {
  PIE: "Pieniądze",
  STA: "Stabilność",
  WOL: "Wolność",
  ROZ: "Rozwój",
  WPL: "Wpływ",
  SEN: "Sens",
  UZN: "Uznanie",
  REL: "Relacje",
  CZA: "Czas",
  MIS: "Mistrzostwo",
  ZMI: "Zmienność",
  ZAS: "Zasady",
};

/** Stale brzmienie wartosci, uzywane w czesci B i w tescie kosztu. */
export const BRZMIENIA_A4: Record<string, string> = {"PIE": "Zarabiać naprawdę dobrze", "STA": "Mieć pewność, że praca nie zniknie", "WOL": "Móc decydować, jak i kiedy pracuję", "ROZ": "Ciągle uczyć się nowych rzeczy", "WPL": "Mieć realny wpływ na to, co się dzieje", "SEN": "Wiedzieć, że pomagam konkretnym ludziom", "UZN": "Być docenianym za to, co robię", "REL": "Pracować z ludźmi, których lubię", "CZA": "Mieć dużo czasu poza pracą", "MIS": "Być w czymś naprawdę dobry", "ZMI": "Mieć ciągle nowe wyzwania", "ZAS": "Nie robić rzeczy, w które nie wierzę"};

export const PARY_A4: ParaA4[] = [
  { nr: 1, kolejnosc: 1, lewa: "PIE", prawa: "ROZ", formula: "klasyczna", tekstLewej: "Zarabiać naprawdę dobrze", tekstPrawej: "Ciągle uczyć się nowych rzeczy" },
  { nr: 2, kolejnosc: 2, lewa: "STA", prawa: "MIS", formula: "klasyczna", tekstLewej: "Mieć pewność, że praca nie zniknie", tekstPrawej: "Być w czymś naprawdę dobry" },
  { nr: 3, kolejnosc: 3, lewa: "ROZ", prawa: "WPL", formula: "klasyczna", tekstLewej: "Ciągle uczyć się nowych rzeczy", tekstPrawej: "Mieć realny wpływ na to, co się dzieje" },
  { nr: 4, kolejnosc: 4, lewa: "PIE", prawa: "SEN", formula: "klasyczna", tekstLewej: "Zarabiać naprawdę dobrze", tekstPrawej: "Wiedzieć, że pomagam konkretnym ludziom" },
  { nr: 5, kolejnosc: 5, lewa: "SEN", prawa: "UZN", formula: "klasyczna", tekstLewej: "Wiedzieć, że pomagam konkretnym ludziom", tekstPrawej: "Być docenianym za to, co robię" },
  { nr: 6, kolejnosc: 6, lewa: "ROZ", prawa: "MIS", formula: "klasyczna", tekstLewej: "Ciągle uczyć się nowych rzeczy", tekstPrawej: "Być w czymś naprawdę dobry" },
  { nr: 7, kolejnosc: 7, lewa: "WPL", prawa: "CZA", formula: "klasyczna", tekstLewej: "Mieć realny wpływ na to, co się dzieje", tekstPrawej: "Mieć dużo czasu poza pracą" },
  { nr: 8, kolejnosc: 8, lewa: "WOL", prawa: "ZAS", formula: "klasyczna", tekstLewej: "Móc decydować, jak i kiedy pracuję", tekstPrawej: "Nie robić rzeczy, w które nie wierzę" },
  { nr: 9, kolejnosc: 9, lewa: "PIE", prawa: "WPL", formula: "klasyczna", tekstLewej: "Zarabiać naprawdę dobrze", tekstPrawej: "Mieć realny wpływ na to, co się dzieje" },
  { nr: 10, kolejnosc: 10, lewa: "STA", prawa: "ZAS", formula: "klasyczna", tekstLewej: "Mieć pewność, że praca nie zniknie", tekstPrawej: "Nie robić rzeczy, w które nie wierzę" },
  { nr: 11, kolejnosc: 11, lewa: "CZA", prawa: "ZAS", formula: "klasyczna", tekstLewej: "Mieć dużo czasu poza pracą", tekstPrawej: "Nie robić rzeczy, w które nie wierzę" },
  { nr: 12, kolejnosc: 12, lewa: "PIE", prawa: "STA", formula: "klasyczna", tekstLewej: "Zarabiać naprawdę dobrze", tekstPrawej: "Mieć pewność, że praca nie zniknie" },
  { nr: 13, kolejnosc: 13, lewa: "STA", prawa: "WPL", formula: "oferty", tekstLewej: "Ta jest na stałe, w firmie, która istnieje od trzydziestu lat", tekstPrawej: "W tej Twoje decyzje realnie zmieniają sposób działania firmy" },
  { nr: 14, kolejnosc: 14, lewa: "WOL", prawa: "ZMI", formula: "oferty", tekstLewej: "W tej sam ustalasz godziny i sposób pracy", tekstPrawej: "W tej każdy miesiąc wygląda inaczej" },
  { nr: 15, kolejnosc: 15, lewa: "STA", prawa: "UZN", formula: "oferty", tekstLewej: "Ta jest na stałe, w firmie, która istnieje od trzydziestu lat", tekstPrawej: "W tej Twoja praca jest widoczna i doceniana" },
  { nr: 16, kolejnosc: 16, lewa: "WOL", prawa: "ROZ", formula: "oferty", tekstLewej: "W tej sam ustalasz godziny i sposób pracy", tekstPrawej: "W tej co pół roku uczysz się czegoś nowego" },
  { nr: 17, kolejnosc: 17, lewa: "WPL", prawa: "SEN", formula: "oferty", tekstLewej: "W tej Twoje decyzje realnie zmieniają sposób działania firmy", tekstPrawej: "W tej codziennie pomagasz konkretnym ludziom" },
  { nr: 34, kolejnosc: 18, lewa: "ROZ", prawa: "REL", formula: "oferty", tekstLewej: "W tej co pół roku uczysz się czegoś nowego", tekstPrawej: "W tej pracujesz z zespołem, który od razu polubiłeś" },
  { nr: 19, kolejnosc: 19, lewa: "UZN", prawa: "CZA", formula: "za_10_lat", tekstLewej: "Ludzie w Twojej branży wiedzą, kim jesteś", tekstPrawej: "Masz wolne popołudnia i weekendy, zawsze" },
  { nr: 20, kolejnosc: 20, lewa: "PIE", prawa: "ZAS", formula: "za_10_lat", tekstLewej: "Stać Cię na wszystko, czego potrzebujesz, i na trochę więcej", tekstPrawej: "Nie robisz niczego, czego musiałbyś się wstydzić" },
  { nr: 21, kolejnosc: 21, lewa: "WOL", prawa: "MIS", formula: "za_10_lat", tekstLewej: "Sam układasz sobie tydzień, nikt nie mówi Ci, kiedy masz być", tekstPrawej: "Jesteś osobą, do której przychodzi się z trudną sprawą" },
  { nr: 22, kolejnosc: 22, lewa: "UZN", prawa: "MIS", formula: "za_10_lat", tekstLewej: "Ludzie w Twojej branży wiedzą, kim jesteś", tekstPrawej: "Jesteś osobą, do której przychodzi się z trudną sprawą" },
  { nr: 23, kolejnosc: 23, lewa: "SEN", prawa: "CZA", formula: "za_10_lat", tekstLewej: "Wiesz, komu konkretnie pomogłeś w tym tygodniu", tekstPrawej: "Masz wolne popołudnia i weekendy, zawsze" },
  { nr: 24, kolejnosc: 24, lewa: "REL", prawa: "CZA", formula: "za_10_lat", tekstLewej: "Idziesz do pracy, bo lubisz ludzi, z którymi pracujesz", tekstPrawej: "Masz wolne popołudnia i weekendy, zawsze" },
  { nr: 25, kolejnosc: 25, lewa: "REL", prawa: "MIS", formula: "rezygnacja", tekstLewej: "Z dobrych relacji w zespole", tekstPrawej: "Z bycia bardzo dobrym w swojej dziedzinie" },
  { nr: 26, kolejnosc: 26, lewa: "STA", prawa: "ZMI", formula: "rezygnacja", tekstLewej: "Z pewności, że praca będzie za pięć lat", tekstPrawej: "Z nowych wyzwań" },
  { nr: 27, kolejnosc: 27, lewa: "SEN", prawa: "ZMI", formula: "rezygnacja", tekstLewej: "Z poczucia, że komuś pomagasz", tekstPrawej: "Z nowych wyzwań" },
  { nr: 28, kolejnosc: 28, lewa: "PIE", prawa: "REL", formula: "rezygnacja", tekstLewej: "Z części zarobków", tekstPrawej: "Z dobrych relacji w zespole" },
  { nr: 29, kolejnosc: 29, lewa: "WOL", prawa: "CZA", formula: "rezygnacja", tekstLewej: "Ze swobody w ustalaniu godzin", tekstPrawej: "Z części wolnego czasu" },
  { nr: 30, kolejnosc: 30, lewa: "UZN", prawa: "ZAS", formula: "rezygnacja", tekstLewej: "Z tego, że ktoś docenia Twoją pracę", tekstPrawej: "Ze zgodności pracy z tym, w co wierzysz" },
  { nr: 31, kolejnosc: 31, lewa: "ROZ", prawa: "SEN", formula: "rada", tekstLewej: "Weź tę, w której więcej się nauczysz", tekstPrawej: "Weź tę, w której komuś realnie pomożesz" },
  { nr: 32, kolejnosc: 32, lewa: "UZN", prawa: "ZMI", formula: "rada", tekstLewej: "Weź tę, w której Twoja praca będzie widoczna", tekstPrawej: "Weź tę, w której będzie się działo" },
  { nr: 33, kolejnosc: 33, lewa: "MIS", prawa: "ZMI", formula: "rada", tekstLewej: "Weź tę, w której dojdziesz do wprawy", tekstPrawej: "Weź tę, w której będzie się działo" },
  { nr: 18, kolejnosc: 34, lewa: "WPL", prawa: "ZAS", formula: "rada", tekstLewej: "Weź tę, w której będziesz miał coś do powiedzenia", tekstPrawej: "Weź tę, w której nie musisz iść na kompromis ze sobą" },
  { nr: 35, kolejnosc: 35, lewa: "WOL", prawa: "REL", formula: "rada", tekstLewej: "Weź tę, w której masz więcej swobody", tekstPrawej: "Weź tę, w której ludzie są w porządku" },
  { nr: 36, kolejnosc: 36, lewa: "REL", prawa: "ZMI", formula: "rada", tekstLewej: "Weź tę, w której ludzie są w porządku", tekstPrawej: "Weź tę, w której będzie się działo" },
];

/** Czesc C: test kosztu. Cztery pytania, tresc generowana z wyniku czesci A. */
export const TEST_KOSZTU = {
  // Zdanie musi zniesc wszystkie dwanascie nazw, a te maja trzy rodzaje
  // gramatyczne („Wolnosc wyszla", „Pieniadze wyszly", „Sens wyszedl").
  // Dwukropek zdejmuje uzgodnienie i nie brzmi urzedowo.
  wstep: "Sprawdźmy, ile to jest dla Ciebie warte.",
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
  /**
   * Trzy odpowiedzi z podpisem. Podpis nazywa, co dana odpowiedz znaczy,
   * zeby „zalezy" nie bylo ucieczka, tylko trzecia trescia.
   */
  odpowiedzi: [
    { wartosc: "tak", etykieta: "Tak", podpis: "Ta wartość jest ważniejsza." },
    { wartosc: "zalezy", etykieta: "Zależy", podpis: "Zależy od tego, ile bym oddał." },
    { wartosc: "nie", etykieta: "Nie", podpis: "To drugie wygrywa." },
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
  kosztNaglowek: "Ile to jest warte",
} as const;

// =====================================================================
// TEKSTY WYNIKOWE
// =====================================================================

/** Opis wartosci w raporcie. Jedno zdanie na kazda z dwunastu. */
export const OPISY_A4: Record<string, string> = {
  PIE: "Chcesz, żeby praca dawała Ci realne pieniądze, a nie tylko satysfakcję",
  STA: "Chcesz wiedzieć, że praca będzie za pięć lat i że nie zależy od cudzej decyzji",
  WOL: "Chcesz decydować, jak i kiedy pracujesz, a nie tylko co robisz",
  ROZ: "Chcesz, żeby praca uczyła Cię czegoś nowego, a nie tylko powtarzała to samo",
  WPL: "Chcesz, żeby Twoje decyzje coś zmieniały, a nie tylko wykonywały cudze",
  SEN: "Chcesz widzieć, komu konkretnie Twoja praca pomaga",
  UZN: "Chcesz, żeby Twoja praca była widoczna i żeby ktoś ją zauważył",
  REL: "Chcesz pracować z ludźmi, z którymi dobrze Ci się rozmawia",
  CZA: "Chcesz mieć życie poza pracą i nie oddawać jej wieczorów",
  MIS: "Chcesz być w czymś naprawdę dobry, a nie przyzwoity w wielu rzeczach",
  ZMI: "Chcesz, żeby się działo, a nie żeby każdy tydzień wyglądał tak samo",
  ZAS: "Chcesz móc pracować bez robienia rzeczy wbrew sobie",
};

/**
 * Zdanie do bloku „co sie nie zgadza" w karcie zawodu: wartosc z czolowki
 * uczestnika, ktorej ten zawod nie zaspokaja.
 */
export const KONFLIKTY_A4: Record<string, string> = {
  PIE: "w tym zawodzie zarobki rosną wolno i sufit jest niski",
  STA: "ten zawód nie daje pewności zatrudnienia",
  WOL: "tu o Twoim dniu decyduje grafik albo przełożony",
  ROZ: "ten zawód po kilku latach przestaje uczyć nowych rzeczy",
  WPL: "tu wykonujesz cudze decyzje, nie podejmujesz własnych",
  SEN: "tu nie zobaczysz, komu konkretnie pomogłeś",
  UZN: "w tym zawodzie dobrze wykonana praca jest niewidoczna",
  REL: "tu pracuje się głównie samemu",
  CZA: "tu wieczory i weekendy są podstawowym czasem pracy",
  MIS: "ten zawód wymaga szerokości, nie głębi",
  ZMI: "tu każdy dzień wygląda bardzo podobnie",
  ZAS: "tu bywają sytuacje, w których trzeba zrobić coś wbrew sobie",
};

/**
 * Napiecia miedzy wartosciami.
 *
 * Gdy dwie wartosci ciagnace w przeciwne strony wypadna obie wysoko, raport
 * to nazywa. **To jest informacja, nie sprzecznosc**: nie ma tu bledu do
 * poprawienia i uczestnik nie ma sie z tego tlumaczyc.
 */
export const NAPIECIA_A4: Array<{ a: string; b: string; tekst: string }> = [
  { a: "WOL", b: "STA", tekst: "Wolność i stabilność ciągną w przeciwne strony. Własna działalność daje wolność, ale odbiera pewność dochodu. Etat daje pewność, ale ktoś inny decyduje o Twoim dniu. Częstym rozwiązaniem jest kilka lat na etacie, a potem własna działalność." },
  { a: "PIE", b: "CZA", tekst: "Pieniądze i czas ciągną w przeciwne strony. Najwyższe zarobki wymagają zwykle najwięcej godzin. Warto sprawdzić, ile realnie pracują ludzie, którzy zarabiają tyle, ile chciałbyś zarabiać." },
  { a: "MIS", b: "ZMI", tekst: "Mistrzostwo i zmienność ciągną w przeciwne strony. Do mistrzostwa dochodzi się latami w jednej rzeczy, a zmienność tych lat nie daje. Jednym z wyjść jest zawód, w którym rdzeń jest stały, a sytuacje różne." },
  { a: "WPL", b: "CZA", tekst: "Wpływ i czas ciągną w przeciwne strony. Wpływ oznacza odpowiedzialność, a ta nie kończy się o szesnastej." },
  { a: "SEN", b: "PIE", tekst: "Sens i pieniądze ciągną w przeciwne strony. Zawody o najwyższym poczuciu sensu należą w Polsce do gorzej płatnych. To nie znaczy, że nie da się ich pogodzić, ale zwykle wymaga to własnej praktyki albo specjalizacji." },
  { a: "REL", b: "WOL", tekst: "Relacje i wolność ciągną w przeciwne strony. Praca na swoim daje swobodę i odbiera codzienny zespół." },
];

/**
 * Twardosc najwyzszej wartosci, z testu kosztu.
 *
 * Zdanie mowi o gotowosci do kosztu, nie o charakterze. „Preferencja" nie
 * jest gorsza od „warunku": znaczy tylko tyle, ze uczestnik nie oddalby za
 * nia wiele, a przy szesnastolatku to jest stan normalny.
 */
export const TWARDOSC_A4: Record<string, { naglowek: string; tresc: string }> = {
  warunek: {
    naglowek: "{NAZWA} jest dla Ciebie warunkiem, nie preferencją.",
    tresc: "Byłbyś gotów oddać za nią niemal wszystko inne. To zawęża pole bardziej, niż się wydaje, i warto o tym pamiętać przy każdej z trzech dróg.",
  },
  silna_preferencja: {
    naglowek: "{NAZWA} jest dla Ciebie bardzo ważna, ale nie za każdą cenę.",
    tresc: "To jest dobra pozycja: masz jasny priorytet i jednocześnie przestrzeń na kompromis.",
  },
  preferencja: {
    naglowek: "{NAZWA} wyszła u Ciebie najwyżej, ale nie jesteś gotów wiele za nią oddać.",
    tresc: "To bardzo częste i nic nie znaczy źle. Może oznaczać, że dopiero sprawdzasz, co jest dla Ciebie ważne, albo że żadna z tych rzeczy nie jest jeszcze dla Ciebie sprawą życia.",
  },
};

/**
 * Rozjazd miedzy formulami: wartosc wygrywala, gdy pytalismy wprost,
 * a byla oddawana, gdy pytalismy o rezygnacje.
 */
export const ROZJAZD_A4 = {
  naglowek: "Twoje odpowiedzi o {NAZWA} różniły się zależnie od pytania.",
  akapity: [
    "Kiedy pytaliśmy wprost, co ważniejsze, wybierałeś tę wartość. Kiedy pytaliśmy, z czego prędzej byś zrezygnował, wybierałeś ją do oddania.",
    "To bardzo częste i nic nie znaczy o Tobie źle. Znaczy tylko, że jest dla Ciebie ważna jako wartość, ale niekoniecznie jako codzienna treść pracy.",
    "Warto o tym porozmawiać na rozmowie indywidualnej.",
  ],
} as const;
