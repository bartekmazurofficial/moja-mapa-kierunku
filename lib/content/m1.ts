/**
 * MODUL M1: JAKIEGO ZYCIA CHCESZ. Tresc przepisana z
 * program-doradztwa/02_assessmenty/M1_moja_wizja_zycia.md, bez zmian.
 *
 * Czesc A: 48 par, po cztery na kazdy z 12 wymiarow ksztaltu zycia.
 * Czesc B: siedem obszarow pisanych wlasnymi slowami. Jedyny modul,
 * w ktorym uczestnik pisze, i jedyne miejsce w calym programie, gdzie
 * celowo pokazujemy wczesniejszy wynik przed odpowiedzia.
 */

export interface ParaM1 {
  id: string;
  wymiar: string;
  biegunA: string;
  biegunB: string;
}

export const PARY_M1: ParaM1[] = [{"id": "CEN_1", "wymiar": "CEN", "biegunA": "Chcę, żeby praca była jedną z najważniejszych rzeczy w życiu", "biegunB": "Chcę, żeby praca była tylko częścią życia"}, {"id": "CEN_2", "wymiar": "CEN", "biegunA": "Wolałbym pracę, o której myślę też po godzinach", "biegunB": "Wolałbym pracę, którą zostawiam w drzwiach"}, {"id": "CEN_3", "wymiar": "CEN", "biegunA": "Chcę, żeby to, co robię zawodowo, mnie określało", "biegunB": "Chcę, żeby określało mnie coś innego niż praca"}, {"id": "CEN_4", "wymiar": "CEN", "biegunA": "Jestem gotów dużo poświęcić dla tego, co robię", "biegunB": "Żadna praca nie jest tego warta"}, {"id": "GRA_1", "wymiar": "GRA", "biegunA": "Nie przeszkadza mi, gdy praca wchodzi w wieczory", "biegunB": "Chcę mieć wyraźną granicę"}, {"id": "GRA_2", "wymiar": "GRA", "biegunA": "Wolę pracować wtedy, kiedy mam energię, o różnych porach", "biegunB": "Wolę pracować w stałych godzinach i mieć wolny wieczór"}, {"id": "GRA_3", "wymiar": "GRA", "biegunA": "Ludzie z pracy mogą być moimi przyjaciółmi", "biegunB": "Wolę oddzielić pracę od życia prywatnego"}, {"id": "GRA_4", "wymiar": "GRA", "biegunA": "Mogę odebrać służbowy telefon w niedzielę", "biegunB": "W niedzielę jestem niedostępny"}, {"id": "GOD_1", "wymiar": "GOD", "biegunA": "Wolę pracować dużo i dużo osiągać", "biegunB": "Wolę pracować mniej i mieć więcej czasu"}, {"id": "GOD_2", "wymiar": "GOD", "biegunA": "Dziesięć godzin dziennie mi nie przeszkadza, jeśli robię coś swojego", "biegunB": "Nawet ciekawa praca nie jest warta dziesięciu godzin"}, {"id": "GOD_3", "wymiar": "GOD", "biegunA": "Chcę mieć poczucie, że dużo robię", "biegunB": "Chcę mieć poczucie, że dużo przeżywam"}, {"id": "GOD_4", "wymiar": "GOD", "biegunA": "Wolę pracować na pełny etat", "biegunB": "Wolę pracować krócej, jeśli to możliwe"}, {"id": "TEMP_1", "wymiar": "TEMP", "biegunA": "Chcę szybko awansować", "biegunB": "Nie spieszy mi się, byle w dobrą stronę"}, {"id": "TEMP_2", "wymiar": "TEMP", "biegunA": "Wolę wcześnie wziąć dużą odpowiedzialność", "biegunB": "Wolę spokojnie się przygotować"}, {"id": "TEMP_3", "wymiar": "TEMP", "biegunA": "Zależy mi, żeby coś osiągnąć przed trzydziestką", "biegunB": "Nie mam takiego terminu"}, {"id": "TEMP_4", "wymiar": "TEMP", "biegunA": "Wolę intensywny start", "biegunB": "Wolę równe tempo przez lata"}, {"id": "MIE_1", "wymiar": "MIE", "biegunA": "Chcę codziennie wychodzić do pracy", "biegunB": "Chcę móc pracować z domu"}, {"id": "MIE_2", "wymiar": "MIE", "biegunA": "Potrzebuję miejsca, do którego się jedzie", "biegunB": "Wolę nie tracić czasu na dojazdy"}, {"id": "MIE_3", "wymiar": "MIE", "biegunA": "Wolę mieć ludzi przy sąsiednich biurkach", "biegunB": "Wolę pracować tam, gdzie akurat jestem"}, {"id": "MIE_4", "wymiar": "MIE", "biegunA": "Dom to dom, praca to praca", "biegunB": "Nie widzę problemu w pracy z domu"}, {"id": "ORG_1", "wymiar": "ORG", "biegunA": "Wolę dużą firmę z jasną strukturą", "biegunB": "Wolę małe miejsce, gdzie ludzie się znają"}, {"id": "ORG_2", "wymiar": "ORG", "biegunA": "Chcę mieć ścieżkę awansu wyznaczoną z góry", "biegunB": "Chcę mieć wpływ na to, jak wygląda moja rola"}, {"id": "ORG_3", "wymiar": "ORG", "biegunA": "Wolę być częścią czegoś dużego", "biegunB": "Wolę być kimś ważnym w czymś małym"}, {"id": "ORG_4", "wymiar": "ORG", "biegunA": "Pociąga mnie zaplecze, jakie daje duża firma", "biegunB": "Wolałbym pracować na swoim albo we dwie osoby"}, {"id": "KOR_1", "wymiar": "KOR", "biegunA": "Chcę mieć jedno miejsce, do którego wracam", "biegunB": "Chcę móc się przenieść, kiedy zechcę"}, {"id": "KOR_2", "wymiar": "KOR", "biegunA": "Wolę zapuścić korzenie", "biegunB": "Wolę nie wiązać się z jednym miejscem"}, {"id": "KOR_3", "wymiar": "KOR", "biegunA": "Zależy mi na własnym domu", "biegunB": "Wolę wynajmować, żeby móc się w każdej chwili przenieść"}, {"id": "KOR_4", "wymiar": "KOR", "biegunA": "Chcę żyć blisko tych samych ludzi przez lata", "biegunB": "Nie przeszkadza mi, że ludzie wokół się zmieniają"}, {"id": "INW_1", "wymiar": "INW", "biegunA": "Chcę zacząć zarabiać jak najszybciej", "biegunB": "Mogę poczekać kilka lat, jeśli to się opłaci"}, {"id": "INW_2", "wymiar": "INW", "biegunA": "Wolę uczyć się w trakcie pracy", "biegunB": "Wolę najpierw solidnie się wykształcić"}, {"id": "INW_3", "wymiar": "INW", "biegunA": "Wolę być samodzielny finansowo wcześnie", "biegunB": "Wolę przygotować się porządnie, nawet kosztem lat"}, {"id": "INW_4", "wymiar": "INW", "biegunA": "Praktyka uczy szybciej niż szkoła", "biegunB": "Solidne podstawy procentują później"}, {"id": "POZ_1", "wymiar": "POZ", "biegunA": "Chcę móc sobie pozwolić na dużo", "biegunB": "Wystarczy mi, żeby niczego nie brakowało"}, {"id": "POZ_2", "wymiar": "POZ", "biegunA": "Zależy mi na dobrym mieszkaniu, aucie, podróżach", "biegunB": "Zależy mi na spokoju bardziej niż na rzeczach"}, {"id": "POZ_3", "wymiar": "POZ", "biegunA": "Chcę zarabiać wyraźnie powyżej średniej", "biegunB": "Średnia mi wystarczy, jeśli reszta gra"}, {"id": "POZ_4", "wymiar": "POZ", "biegunA": "Dobrze zarabiać to dla mnie ważny cel", "biegunB": "Pieniądze to środek, nie cel"}, {"id": "LUD_1", "wymiar": "LUD", "biegunA": "Chcę kiedyś kierować zespołem", "biegunB": "Wolę odpowiadać tylko za swoją pracę"}, {"id": "LUD_2", "wymiar": "LUD", "biegunA": "Odpowiedzialność za innych mnie pociąga", "biegunB": "Odpowiedzialność za innych mnie obciąża"}, {"id": "LUD_3", "wymiar": "LUD", "biegunA": "Widzę siebie kiedyś jako szefa", "biegunB": "Nie widzę siebie w tej roli"}, {"id": "LUD_4", "wymiar": "LUD", "biegunA": "Chcę, żeby moje decyzje dotyczyły też innych", "biegunB": "Wolę, żeby każdy robił swoje"}, {"id": "WID_1", "wymiar": "WID", "biegunA": "Nie przeszkadza mi, że ludzie mnie kojarzą", "biegunB": "Wolę pozostać nierozpoznawalny"}, {"id": "WID_2", "wymiar": "WID", "biegunA": "Chętnie pokazuję to, co robię", "biegunB": "Wolę, żeby moja praca mówiła sama za siebie"}, {"id": "WID_3", "wymiar": "WID", "biegunA": "Chcę być kojarzony z tym, co robię", "biegunB": "Wolę pracować w cieniu"}, {"id": "WID_4", "wymiar": "WID", "biegunA": "Widoczność to naturalna część mojego planu", "biegunB": "Wolałbym jej uniknąć"}, {"id": "ROD_1", "wymiar": "ROD", "biegunA": "Chciałbym mieć rodzinę stosunkowo wcześnie", "biegunB": "Chciałbym najpierw pożyć inaczej"}, {"id": "ROD_2", "wymiar": "ROD", "biegunA": "Rodzina jest w moich planach na pewno", "biegunB": "Nie jestem jeszcze pewien, czy tego chcę"}, {"id": "ROD_3", "wymiar": "ROD", "biegunA": "Chcę tak ułożyć pracę, żeby zostawiała miejsce na dzieci", "biegunB": "Na razie się tym nie kieruję"}, {"id": "ROD_4", "wymiar": "ROD", "biegunA": "Wolałbym stabilizować się wcześniej", "biegunB": "Wolałbym mieć długi czas dla siebie"}];

/**
 * Trzy wymiary twarde pytane WPROST, a nie z par.
 *
 * GOD, MIE i KOR realnie usuwaja zawody z listy: liczba godzin, praca
 * stacjonarna kontra zdalna, osiadanie kontra przenoszenie sie. Dotad
 * wyliczalismy je z czterech par kazdy, a przy czterech parach jedna
 * zmieniona odpowiedz przesuwa wynik o dwadziescia piec punktow i wycina
 * cala grupe zawodow. To zbyt mocna konsekwencja ze zbyt slabej podstawy.
 *
 * Pary zostaja dla dziewieciu wymiarow miekkich, gdzie pomylka o cwiartke
 * niczego nie zamyka.
 *
 * `nie_wiem` nie jest odpowiedzia domyslna. Przy niej wymiar ma wartosc
 * `null` i nie przycina NICZEGO. Brak zdania nie jest zdaniem.
 */
export const WYMIARY_WPROST_M1 = ["GOD", "MIE", "KOR"] as const;

export interface PytanieWprostM1 {
  wymiar: string;
  tresc: string;
  podpis?: string;
  /** `pozycja` to miejsce na osi 0-100, gdzie 100 to biegun A. */
  opcje: Array<{ kod: string; etykieta: string; podpis?: string; pozycja: number | null }>;
}

export const PYTANIA_WPROST_M1: PytanieWprostM1[] = [
  {
    wymiar: "GOD",
    tresc: "Ile godzin chcesz pracować?",
    podpis: "Nie chodzi o to, ile wytrzymasz, tylko ile chcesz.",
    opcje: [
      { kod: "duzo", etykieta: "Dużo, jeśli dobrze płacą", pozycja: 100 },
      { kod: "osiem", etykieta: "Osiem i koniec", podpis: "Etat i wolny wieczór.", pozycja: 50 },
      { kod: "malo", etykieta: "Jak najmniej", podpis: "Praca ma zostawiać miejsce na resztę.", pozycja: 0 },
      { kod: "nie_wiem", etykieta: "Jeszcze nie wiem", pozycja: null },
    ],
  },
  {
    wymiar: "MIE",
    tresc: "Gdzie chcesz pracować?",
    opcje: [
      { kod: "na_miejscu", etykieta: "Wychodzę z domu do konkretnego miejsca", pozycja: 100 },
      { kod: "z_domu", etykieta: "Z domu", pozycja: 0 },
      { kod: "mieszanie", etykieta: "Raz tak, raz tak", pozycja: 50 },
      { kod: "nie_wiem", etykieta: "Jeszcze nie wiem", pozycja: null },
    ],
  },
  {
    wymiar: "KOR",
    tresc: "Chcesz zostać tam, gdzie jesteś?",
    opcje: [
      { kod: "osiasc", etykieta: "Tak, chcę osiąść", pozycja: 100 },
      { kod: "region", etykieta: "Mogę się przenieść w regionie", pozycja: 50 },
      { kod: "gdziekolwiek", etykieta: "Mogę się przenieść gdziekolwiek", pozycja: 0 },
      { kod: "nie_wiem", etykieta: "Jeszcze nie wiem", pozycja: null },
    ],
  },
];

/** Pary M1 bez trzech wymiarow twardych: te sa pytane wprost. */
export const PARY_MIEKKIE_M1 = PARY_M1.filter(
  (p) => !(WYMIARY_WPROST_M1 as readonly string[]).includes(p.wymiar),
);

export type TypObszaruM1 = "tekst" | "tekst_duzy" | "lista_i_tekst" | "piec_zdan";

export interface ObszarM1 {
  nr: number;
  tytul: string;
  /** Wymiary czesci A, z ktorych powstaje szkic. Puste, gdy obszar jest bez szkicu. */
  szkicZ: string[];
  typ: TypObszaruM1;
  polecenie: string;
  /** Tylko dla obszaru 4. */
  lista?: string[];
  /** Tylko dla obszaru 6. */
  zdania?: string[];
  /** Punkty zaczepienia: o czym w ogóle mowa. Nie lista do wyboru. */
  punkty?: string;
  /** To samo pytanie od drugiej strony. Łatwiej powiedzieć, czego się nie chce. */
  odwrotnie?: string;
}

export const OBSZARY_M1: ObszarM1[] = [
  {
    nr: 1,
    tytul: "Gdzie chcę żyć",
    szkicZ: ["KOR"],
    typ: "tekst",
    polecenie: "Gdzie chciałbyś mieszkać za kilka lat?",
    punkty: "Pomyśl o: wielkości miejscowości, odległości od rodziny, tym, czy chcesz zostać tam, gdzie jesteś.",
    odwrotnie: "Albo od drugiej strony: gdzie na pewno nie chciałbyś mieszkać?",
  },
  {
    nr: 2,
    tytul: "Jak chcę pracować",
    szkicZ: ["MIE", "ORG", "LUD"],
    typ: "tekst",
    polecenie: "Jak miałaby wyglądać Twoja praca od strony organizacji?",
    punkty: "Pomyśl o: pracy z domu albo na miejscu, stałych godzinach albo zmiennych, pracy samemu albo w zespole, etacie albo na swoim.",
    odwrotnie: "Albo: czego w pracy na pewno nie chcesz?",
  },
  {
    nr: 3,
    tytul: "Jak ma wyglądać mój dzień",
    szkicZ: ["GOD", "GRA", "MIE"],
    typ: "tekst_duzy",
    polecenie: "Opisz swój zwykły dzień za kilka lat, od rana do wieczora.",
    punkty: "Pomyśl o: godzinie pobudki, drodze do pracy, liczbie godzin pracy, tym, co robisz po pracy.",
    odwrotnie: "Albo: jaki dzień byłby dla Ciebie nie do zniesienia?",
  },
  {
    nr: 4,
    tytul: "Co chcę mieć poza pracą",
    szkicZ: [],
    typ: "lista_i_tekst",
    polecenie: "Co poza pracą ma się w Twoim życiu mieścić?",
    lista: [
      "rodzina",
      "stały partner",
      "bliscy przyjaciele",
      "podróże",
      "sport",
      "wiara i życie duchowe",
      "wolontariat i pomaganie",
      "własne projekty",
      "hobby, na które mam czas",
      "spokój i cisza",
      "życie towarzyskie",
      "nauka dla siebie",
    ],
    punkty: "Pomyśl o: rodzinie, przyjaciołach, sporcie, wierze, podróżach, własnych projektach, czasie dla siebie.",
    odwrotnie: "Albo: z czego na pewno nie chcesz rezygnować dla pracy?",
  },
  {
    nr: 5,
    tytul: "Jak ważne są dla mnie pieniądze",
    szkicZ: ["POZ", "INW"],
    typ: "tekst",
    polecenie: "Ile pieniędzy potrzebujesz i po co?",
    punkty: "Pomyśl o: tym, na co chcesz sobie pozwalać, czy chcesz mieć własne mieszkanie, czy wolisz pewność, czy wyższy zarobek przy większym ryzyku.",
    odwrotnie: "Albo: czego nie chciałbyś robić nawet za bardzo dobre pieniądze?",
  },
  {
    nr: 6,
    tytul: "Czego nie chcę",
    szkicZ: [],
    typ: "piec_zdan",
    polecenie: "Dokończ zdania. Możesz dokończyć tylko niektóre.",
    zdania: [
      "Nie chciałbym pracy, w której…",
      "Nie chciałbym życia, w którym…",
      "Nie chcę poświęcić…",
      "Nie chcę, żeby moja praca wymagała…",
    ],
  },
  {
    nr: 7,
    tytul: "Jak chcę żyć za pięć do dziesięciu lat",
    szkicZ: ["TEMP", "CEN", "ROD", "KOR"],
    typ: "tekst",
    polecenie: "Nie chodzi o plan, tylko o obraz. Gdzie jesteś, czym się mniej więcej zajmujesz, jak wygląda Twój zwykły tydzień?",
    odwrotnie: "Jeśli nie umiesz sobie tego wyobrazić, napisz o tym. To też jest odpowiedź.",
  },
];

export const INSTRUKCJA_M1 = {
  naglowek: "Jakiego życia chcesz",
  wprowadzenie: [
    "Teraz coś innego: nie o pracy, tylko o życiu.",
    "Zobaczysz pary zdań. W obu przypadkach ktoś mógłby powiedzieć, że tak właśnie chce żyć, i miałby rację. Nie ma tu lepszej odpowiedzi.",
    "Nie zastanawiaj się, co byłoby rozsądne. Pytamy o to, czego chcesz.",
  ],
  rozwiniecie: [
    "Wybierz to, co jest bliżej Ciebie. Jeśli oba są blisko, wybierz to odrobinę bliższe. Jeśli żadne nie pasuje, wybierz to mniej odległe.",
  ],
  polecenieBloku: "Co jest bliżej Ciebie?",
  czescBWstep: [
    "Nie ma tu dobrych odpowiedzi i nikt tego nie oceni.",
    "Piszcie krótko, hasłami, nie zdaniami. Jeśli utkniecie na którymś obszarze, przejdźcie dalej i wróćcie.",
  ],
} as const;
