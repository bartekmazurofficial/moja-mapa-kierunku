/**
 * MODUL CZWARTY: POZIOM ZYCIA I DOCHODU.
 *
 * Nie pytamy „ile chcesz zarabiac", bo na to pytanie prawie kazdy odpowiada
 * „duzo" albo „nie wiem". Uczestnik **projektuje zycie, ktore chce miec**,
 * a kwota wychodzi z tego sama.
 *
 * Trzy zasady, ktore trzymaja ten modul:
 *
 *   1. **Nikt nie wpisuje budzetu od zera.** Kazda pozycja ma sensowna
 *      wartosc domyslna, oznaczona jako polecana. Da sie przejsc caly panel,
 *      nie zmieniajac nic, i dostac uczciwy wynik.
 *   2. **Prog opisuje styl zycia, nie poziom.** Nie „podstawowy, komfortowy,
 *      premium", tylko „okolo raz w tygodniu na miescie". Czlowiek nie wie,
 *      czy jest „komfortowy"; wie, jak czesto wychodzi.
 *   3. **Dziesiec decyzji, reszta liczy sie sama.** Dwadziescia piec pozycji
 *      idzie automatem i uczestnik widzi je jako jedna karte z suma.
 *
 * Kwoty sa w zlotowkach miesiecznie i sa **danymi, nie kodem**: maja sie
 * zmieniac razem z cenami, bez ruszania logiki.
 */

export type TypPozycji = "aktywna" | "auto" | "opcjonalna";

export interface ProgWyboru {
  kod: string;
  /** Nazwa progu, krotka. */
  nazwa: string;
  /** Co to znaczy w praktyce. To jest wazniejsze niz nazwa. */
  opis: string;
  kwota: number;
  /** Prog polecany, zaznaczony na wejsciu. Dokladnie jeden na kategorie. */
  domyslny?: boolean;
}

export interface KategoriaKosztu {
  kod: string;
  nazwa: string;
  /** Zdanie nad progami. Mowi, o co pytamy. */
  podpis: string;
  progi: ProgWyboru[];
  /** Koszt liczony na osobe, nie na gospodarstwo. */
  naOsobe?: boolean;
  /** Mnoznik miasta dziala na te kategorie. */
  zalezyOdMiasta?: boolean;
}

/* ================================================================== */
/* PYTANIA WEJSCIOWE                                                   */
/* ================================================================== */

export interface PytanieWejsciowe {
  kod: string;
  /** Krotka etykieta, do panelu i raportu. */
  nazwa: string;
  /**
   * Pelne pytanie na ekranie.
   *
   * Osobno od `nazwa`, bo „Forma mieszkania" jest dobra etykieta i zla
   * nagloweczkiem: uczestnik czyta naglowek jako pytanie i ma odpowiedziec,
   * a nie odgadnac, o co chodzi. Wszystkie w czasie przyszlym: pytamy o
   * zycie, ktore chce miec, a nie o to, jak mieszka dzis z rodzicami.
   */
  pytanie: string;
  opcje: Array<{ kod: string; nazwa: string; domyslna?: boolean }>;
}

export const PYTANIA_WEJSCIOWE: PytanieWejsciowe[] = [
  {
    kod: "z_kim",
    pytanie: "Z kim chcesz mieszkać?",
    nazwa: "Z kim mieszkasz",
    opcje: [
      { kod: "sam", nazwa: "Sam albo sama", domyslna: true },
      { kod: "partner", nazwa: "Z partnerem" },
      { kod: "malzenstwo", nazwa: "W małżeństwie" },
      { kod: "wspollokatorzy", nazwa: "Ze współlokatorami" },
    ],
  },
  {
    kod: "dzieci",
    pytanie: "Ile chcesz mieć dzieci?",
    nazwa: "Liczba dzieci",
    opcje: [
      { kod: "0", nazwa: "Bez dzieci", domyslna: true },
      { kod: "1", nazwa: "Jedno" },
      { kod: "2", nazwa: "Dwoje" },
      { kod: "3", nazwa: "Troje" },
      { kod: "4", nazwa: "Czworo albo więcej" },
    ],
  },
  {
    kod: "miasto",
    pytanie: "Gdzie chcesz mieszkać?",
    nazwa: "Typ miejscowości",
    opcje: [
      { kod: "mala", nazwa: "Mała miejscowość" },
      { kod: "srednie", nazwa: "Średnie miasto" },
      { kod: "duze", nazwa: "Duże miasto", domyslna: true },
      { kod: "warszawa", nazwa: "Warszawa" },
      { kod: "zagranica", nazwa: "Za granicą" },
    ],
  },
  {
    kod: "mieszkanie_forma",
    pytanie: "W czym chcesz mieszkać?",
    nazwa: "Forma mieszkania",
    opcje: [
      { kod: "pokoj", nazwa: "Pokój" },
      { kod: "wynajem", nazwa: "Wynajem", domyslna: true },
      { kod: "kredyt", nazwa: "Własne na kredyt" },
      { kod: "wlasne", nazwa: "Własne bez kredytu" },
      { kod: "dom", nazwa: "Dom" },
    ],
  },
  {
    kod: "zwierze",
    pytanie: "Czy chcesz mieć zwierzę?",
    nazwa: "Zwierzę",
    opcje: [
      { kod: "brak", nazwa: "Brak", domyslna: true },
      { kod: "kot", nazwa: "Kot" },
      { kod: "pies", nazwa: "Pies" },
      { kod: "inne", nazwa: "Inne" },
    ],
  },
];

/** Mnoznik miasta dla mieszkania, uslug i czesci jedzenia. */
export const MNOZNIK_MIASTA: Record<string, number> = {
  mala: 0.7,
  srednie: 0.85,
  duze: 1.0,
  warszawa: 1.25,
  zagranica: 1.4,
};

/* ================================================================== */
/* DZIESIEC AKTYWNYCH DECYZJI                                          */
/* ================================================================== */

export const KATEGORIE_AKTYWNE: KategoriaKosztu[] = [
  {
    kod: "mieszkanie",
    nazwa: "Mieszkanie",
    podpis: "Gdzie i jak chcesz mieszkać.",
    zalezyOdMiasta: true,
    progi: [
      { kod: "pokoj", nazwa: "Pokój albo współdzielenie", opis: "wynajmowany pokój lub współdzielone mieszkanie", kwota: 1500 },
      { kod: "male", nazwa: "Małe mieszkanie", opis: "kawalerka albo małe dwa pokoje poza centrum", kwota: 2500 },
      { kod: "dobre", nazwa: "Dobre mieszkanie", opis: "dwa pokoje, dobry standard, dobra lokalizacja", kwota: 3500, domyslny: true },
      { kod: "duze", nazwa: "Duże albo nowoczesne", opis: "60 do 80 metrów, nowy budynek, dobra dzielnica", kwota: 5000 },
      { kod: "premium", nazwa: "Bardzo dobre", opis: "duże mieszkanie albo bardzo dobra lokalizacja", kwota: 7000 },
    ],
  },
  {
    kod: "jedzenie",
    nazwa: "Zakupy spożywcze",
    podpis: "Jak robisz zakupy na co dzień.",
    naOsobe: true,
    zalezyOdMiasta: true,
    progi: [
      { kod: "bardzo_oszczednie", nazwa: "Bardzo oszczędnie", opis: "promocje, podstawowe produkty", kwota: 650 },
      { kod: "oszczednie", nazwa: "Oszczędnie", opis: "większość posiłków w domu", kwota: 850 },
      { kod: "normalnie", nazwa: "Normalnie", opis: "dobre produkty, warzywa, mięso, swoboda przy koszyku", kwota: 1200, domyslny: true },
      { kod: "bardzo_dobrze", nazwa: "Bardzo dobrze", opis: "produkty wyższej jakości, bio", kwota: 1700 },
      { kod: "bez_patrzenia", nazwa: "Bez patrzenia na ceny", opis: "produkty premium", kwota: 2500 },
    ],
  },
  {
    kod: "restauracje",
    nazwa: "Restauracje i dowóz",
    podpis: "Jak często jesz poza domem.",
    zalezyOdMiasta: true,
    progi: [
      { kod: "wcale", nazwa: "Wcale", opis: "praktycznie zawsze w domu", kwota: 0 },
      { kod: "sporadycznie", nazwa: "Sporadycznie", opis: "raz albo dwa razy w miesiącu", kwota: 150 },
      { kod: "regularnie", nazwa: "Regularnie", opis: "około raz w tygodniu", kwota: 450, domyslny: true },
      { kod: "czesto", nazwa: "Często", opis: "dwa albo trzy razy w tygodniu", kwota: 900 },
      { kod: "bardzo_czesto", nazwa: "Bardzo często", opis: "kilka razy w tygodniu", kwota: 1800 },
    ],
  },
  {
    kod: "transport",
    nazwa: "Transport",
    podpis: "Jak się poruszasz. Przy samochodzie wszystko jest w jednej pozycji: paliwo, ubezpieczenie, serwis, opony.",
    progi: [
      { kod: "pieszo", nazwa: "Pieszo albo rowerem", opis: "praktycznie bez kosztów", kwota: 80 },
      { kod: "komunikacja", nazwa: "Komunikacja miejska", opis: "bilet miesięczny", kwota: 180 },
      { kod: "komunikacja_uber", nazwa: "Komunikacja i przejazdy", opis: "bilet plus kilka kursów w miesiącu", kwota: 350, domyslny: true },
      { kod: "auto_eko", nazwa: "Auto ekonomiczne", opis: "paliwo, ubezpieczenie, serwis, opony, utrata wartości", kwota: 1100 },
      { kod: "auto_dobre", nazwa: "Dobre auto", opis: "klasa średnia", kwota: 1800 },
      { kod: "auto_premium", nazwa: "Auto z wyższej półki", opis: "droższe auto albo leasing", kwota: 3500 },
    ],
  },
  {
    kod: "po_godzinach",
    nazwa: "Życie po godzinach",
    podpis: "Hobby, rozrywka, wyjścia.",
    naOsobe: true,
    zalezyOdMiasta: true,
    progi: [
      { kod: "spokojnie", nazwa: "Spokojnie", opis: "głównie dom, darmowe formy", kwota: 150 },
      { kod: "niedrogo", nazwa: "Niedrogo", opis: "hobby plus wyjście raz w miesiącu", kwota: 400 },
      { kod: "regularnie", nazwa: "Regularnie", opis: "hobby plus mniej więcej raz w tygodniu na mieście", kwota: 900, domyslny: true },
      { kod: "aktywnie", nazwa: "Aktywnie", opis: "kilka wyjść tygodniowo, koncerty, wydarzenia", kwota: 1800 },
      { kod: "bardzo_aktywnie", nazwa: "Bardzo aktywnie", opis: "to duża część stylu życia", kwota: 3500 },
    ],
  },
  {
    kod: "podroze",
    nazwa: "Podróże",
    podpis: "Ile i jak podróżujesz w ciągu roku.",
    naOsobe: true,
    progi: [
      { kod: "prawie_wcale", nazwa: "Prawie wcale", opis: "zero albo jeden tani wyjazd rocznie", kwota: 250 },
      { kod: "wakacje", nazwa: "Wakacje i krótki wypad", opis: "jeden większy wyjazd plus jeden albo dwa krótsze", kwota: 650, domyslny: true },
      { kod: "kilka", nazwa: "Kilka podróży rocznie", opis: "dwa do czterech wyjazdów zagranicznych", kwota: 1500 },
      { kod: "duzo", nazwa: "Dużo i wygodnie", opis: "częste podróże, lepsze hotele", kwota: 3500 },
    ],
  },
  {
    kod: "ubrania",
    nazwa: "Ubrania i wygląd",
    podpis: "Zakupy, fryzjer, kosmetyka.",
    naOsobe: true,
    progi: [
      { kod: "bardzo_malo", nazwa: "Bardzo mało", opis: "kupuję tylko wtedy, gdy potrzebuję", kwota: 200 },
      { kod: "oszczednie", nazwa: "Oszczędnie", opis: "kilka rzeczy na sezon, fryzjer rzadko", kwota: 350 },
      { kod: "normalnie", nazwa: "Normalnie", opis: "regularne zakupy, fryzjer co cztery do ośmiu tygodni", kwota: 650, domyslny: true },
      { kod: "duzo", nazwa: "Dużo", opis: "częste zakupy, droższe marki, salon", kwota: 1300 },
      { kod: "premium", nazwa: "Bardzo dużo", opis: "drogie marki, zabiegi", kwota: 2500 },
    ],
  },
  {
    kod: "rozwoj",
    nazwa: "Rozwój",
    podpis: "Kursy, książki, szkolenia.",
    naOsobe: true,
    progi: [
      { kod: "darmowe", nazwa: "Darmowe materiały", opis: "internet, biblioteka", kwota: 50 },
      { kod: "sporadycznie", nazwa: "Sporadycznie", opis: "książki, kurs raz na jakiś czas", kwota: 100 },
      { kod: "regularnie", nazwa: "Regularnie", opis: "kursy, książki, szkolenia", kwota: 300, domyslny: true },
      { kod: "intensywnie", nazwa: "Intensywnie", opis: "kilka kursów, konferencje", kwota: 800 },
      { kod: "premium", nazwa: "Bardzo intensywnie", opis: "mentoring, drogie programy", kwota: 2000 },
    ],
  },
  {
    kod: "przyszlosc",
    nazwa: "Przyszłość",
    podpis: "Oszczędności i inwestowanie.",
    progi: [
      { kod: "nic", nazwa: "Nic", opis: "na razie nie odkładam", kwota: 0 },
      { kod: "symbolicznie", nazwa: "Symbolicznie", opis: "tyle, ile się uda", kwota: 300 },
      { kod: "regularnie", nazwa: "Regularnie", opis: "poduszka bezpieczeństwa plus inwestowanie", kwota: 1000, domyslny: true },
      { kod: "ambitnie", nazwa: "Ambitnie", opis: "szybkie budowanie kapitału", kwota: 2500 },
      { kod: "bardzo_ambitnie", nazwa: "Bardzo ambitnie", opis: "duża część dochodu", kwota: 5000 },
    ],
  },
  {
    kod: "dawanie",
    nazwa: "Dawanie",
    podpis: "Wsparcie dla innych, darowizny, zbiórki.",
    progi: [
      { kod: "brak", nazwa: "Brak", opis: "na razie nie", kwota: 0 },
      { kod: "symbolicznie", nazwa: "Symbolicznie", opis: "drobne kwoty", kwota: 50 },
      { kod: "regularnie", nazwa: "Regularnie", opis: "stała kwota co miesiąc", kwota: 200, domyslny: true },
      { kod: "hojnie", nazwa: "Hojnie", opis: "zauważalna część budżetu", kwota: 500 },
      { kod: "bardzo_hojnie", nazwa: "Bardzo hojnie", opis: "to jedna z ważniejszych pozycji", kwota: 1000 },
    ],
  },
];

/* ================================================================== */
/* POZYCJE AUTOMATYCZNE                                                */
/* ================================================================== */

/**
 * Dwadziescia piec pozycji, o ktore nie pytamy.
 *
 * Uczestnik widzi jedna karte z suma i moze ja rozwinac. Domyslnie nie musi.
 * Gdyby te pozycje staly osobno, panel mialby trzydziesci piec pytan zamiast
 * dziesieciu i nikt by go nie skonczyl.
 */
export const POZYCJE_AUTO: Array<{ kod: string; nazwa: string; kwota: number; naOsobe?: boolean }> = [
  { kod: "media", nazwa: "Media", kwota: 550 },
  { kod: "internet", nazwa: "Internet", kwota: 70 },
  { kod: "wyposazenie", nazwa: "Wyposażenie i naprawy", kwota: 150 },
  { kod: "telefon", nazwa: "Telefon", kwota: 50, naOsobe: true },
  { kod: "elektronika", nazwa: "Elektronika", kwota: 180 },
  { kod: "kosmetyki", nazwa: "Kosmetyki", kwota: 150, naOsobe: true },
  { kod: "dentysta", nazwa: "Dentysta", kwota: 80, naOsobe: true },
  { kod: "apteka", nazwa: "Apteka i leki", kwota: 70, naOsobe: true },
  { kod: "opieka_medyczna", nazwa: "Prywatna opieka medyczna", kwota: 100, naOsobe: true },
  { kod: "sport", nazwa: "Sport", kwota: 150, naOsobe: true },
  { kod: "prezenty", nazwa: "Prezenty", kwota: 100 },
  { kod: "weekendy", nazwa: "Weekendowe wyjazdy", kwota: 350 },
];

/* ================================================================== */
/* POZYCJE OPCJONALNE                                                  */
/* ================================================================== */

/** Domyslnie zero. Wlaczane tylko wtedy, gdy kogos dotycza. */
export const POZYCJE_OPCJONALNE: Array<{ kod: string; nazwa: string; sugestia: number }> = [
  { kod: "pomoc_domowa", nazwa: "Pomoc domowa", sugestia: 400 },
  { kod: "psycholog", nazwa: "Psycholog i terapia", sugestia: 600 },
  { kod: "zwierzeta", nazwa: "Zwierzęta", sugestia: 250 },
  { kod: "wsparcie_rodziny", nazwa: "Wsparcie rodziny", sugestia: 500 },
  { kod: "wspolnota", nazwa: "Wspólnota i organizacje", sugestia: 150 },
  { kod: "slub", nazwa: "Odkładanie na ślub", sugestia: 800 },
  { kod: "biznes", nazwa: "Własny biznes", sugestia: 1000 },
  { kod: "na_mieszkanie", nazwa: "Odkładanie na mieszkanie", sugestia: 1500 },
  { kod: "na_samochod", nazwa: "Odkładanie na samochód", sugestia: 600 },
  { kod: "inne_cele", nazwa: "Inne duże cele", sugestia: 500 },
  { kod: "ubezpieczenia", nazwa: "Ubezpieczenia dodatkowe", sugestia: 200 },
  { kod: "emerytura", nazwa: "Emerytura", sugestia: 400 },
];

/** Koszt dziecka, liczony osobno na kazde. */
export const KOSZT_DZIECKA = {
  codzienne: 900,
  zajecia: 300,
  edukacja: 200,
} as const;

export const INSTRUKCJA_POZIOMU_ZYCIA = {
  naglowek: "Poziom życia i dochodu",
  wprowadzenie: [
    "Nie pytamy, ile chcesz zarabiać. Na to pytanie prawie każdy odpowiada „dużo” albo „nie wiem”.",
    "Zamiast tego zaprojektujesz życie, które chcesz mieć. Kwota wyjdzie z tego sama.",
    "Wszystko jest już ustawione na sensownych wartościach. Możesz przejść cały panel i nic nie zmieniać.",
  ],
  naglowekPanelu: "Projektujesz swoje przyszłe życie",
  kartaAuto: {
    nazwa: "Pozostałe koszty",
    podpis: "Ustawiliśmy je za Ciebie",
    opis:
      "Media, internet, telefon, kosmetyki, dentysta, sport, prezenty i kilka innych drobnych pozycji. Możesz to rozwinąć i zmienić, ale nie musisz.",
  },
  wynik: {
    minimum: {
      nazwa: "Minimum",
      opis: "Poziom, poniżej którego trudno utrzymać akceptowalny styl życia.",
    },
    komfort: {
      nazwa: "Komfort",
      opis: "Poziom pozwalający żyć tak, jak realnie chcesz na co dzień. To suma Twoich wyborów.",
    },
    cel: {
      nazwa: "Cel",
      opis: "Poziom aspiracyjny, do którego chcesz dojść w dłuższej perspektywie.",
    },
  },
  rankingWstep:
    "Tu widać, gdzie naprawdę leżą Twoje pieniądze. Zwykle jedna decyzja o mieszkaniu waży więcej niż wszystkie subskrypcje, hobby i kawy razem.",
} as const;
