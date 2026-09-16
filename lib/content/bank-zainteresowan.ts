/**
 * BANK ZAINTERESOWAN: 60 tematow.
 *
 * Modul pierwszy nie pyta „w jakim zawodzie chcesz pracowac", tylko „jakie
 * swiaty i tematy przyciagaja Twoja uwage". Wynik nie zmienia dopasowania
 * zadnego zawodu i to jest decyzja, nie niedorobka: sprzedaz jest sprzedaza
 * i w motoryzacji, i w medycynie. Zainteresowanie mowi, w ktorym swiecie
 * ktos chcialby ja wykonywac, a nie czy sprzedaz do niego pasuje.
 *
 * Kolejnosc pozycji jest kolejnoscia z listy zrodlowej i **numery sa
 * niezmienne**: po nich zapisuje sie odpowiedzi uczestnika i po nich
 * podlacza sie warianty branzowe zawodow.
 *
 * `grupa` sluzy wylacznie do ulozenia listy na ekranie. Uczestnik nie widzi
 * nazwy grupy: szescdziesiat pozycji w jednej kolumnie jest nie do przejscia,
 * ale nagłowek „Ludzie i zdrowie" nad piatka tematow juz tak.
 */

export interface TematZainteresowan {
  id: number;
  nazwa: string;
  grupa: string;
}

export const BANK_ZAINTERESOWAN: TematZainteresowan[] = [
  { id: 1, nazwa: "Psychologia i zachowanie człowieka", grupa: "Człowiek" },
  { id: 2, nazwa: "Rozwój osobisty i poznawanie siebie", grupa: "Człowiek" },
  { id: 3, nazwa: "Relacje i komunikacja między ludźmi", grupa: "Człowiek" },
  { id: 4, nazwa: "Rodzina i wychowanie", grupa: "Człowiek" },
  { id: 5, nazwa: "Zdrowie psychiczne", grupa: "Człowiek" },
  { id: 6, nazwa: "Medycyna i zdrowie", grupa: "Zdrowie i ciało" },
  { id: 7, nazwa: "Ludzkie ciało i biologia", grupa: "Zdrowie i ciało" },
  { id: 8, nazwa: "Dieta, fitness i zdrowy styl życia", grupa: "Zdrowie i ciało" },
  { id: 9, nazwa: "Sport", grupa: "Zdrowie i ciało" },
  { id: 10, nazwa: "Biznes i przedsiębiorczość", grupa: "Biznes i pieniądze" },
  { id: 11, nazwa: "Marketing i reklama", grupa: "Biznes i pieniądze" },
  { id: 12, nazwa: "Social media i internet", grupa: "Biznes i pieniądze" },
  { id: 13, nazwa: "Sprzedaż i handel", grupa: "Biznes i pieniądze" },
  { id: 14, nazwa: "Zarządzanie i przywództwo", grupa: "Biznes i pieniądze" },
  { id: 15, nazwa: "Finanse osobiste", grupa: "Biznes i pieniądze" },
  { id: 16, nazwa: "Inwestowanie", grupa: "Biznes i pieniądze" },
  { id: 17, nazwa: "Ekonomia i gospodarka", grupa: "Biznes i pieniądze" },
  { id: 18, nazwa: "Nieruchomości", grupa: "Biznes i pieniądze" },
  { id: 19, nazwa: "Technologia", grupa: "Technologia i nauka" },
  { id: 20, nazwa: "Sztuczna inteligencja i automatyzacja", grupa: "Technologia i nauka" },
  { id: 21, nazwa: "Programowanie i aplikacje", grupa: "Technologia i nauka" },
  { id: 22, nazwa: "Komputery, sprzęt i cyberbezpieczeństwo", grupa: "Technologia i nauka" },
  { id: 23, nazwa: "Nauka i odkrywanie świata", grupa: "Technologia i nauka" },
  { id: 24, nazwa: "Matematyka i statystyka", grupa: "Technologia i nauka" },
  { id: 25, nazwa: "Fizyka", grupa: "Technologia i nauka" },
  { id: 26, nazwa: "Chemia", grupa: "Technologia i nauka" },
  { id: 27, nazwa: "Przyroda i środowisko", grupa: "Przyroda i technika" },
  { id: 28, nazwa: "Zwierzęta", grupa: "Przyroda i technika" },
  { id: 29, nazwa: "Rolnictwo, rośliny i ogrodnictwo", grupa: "Przyroda i technika" },
  { id: 30, nazwa: "Inżynieria i technika", grupa: "Przyroda i technika" },
  { id: 31, nazwa: "Budownictwo i architektura", grupa: "Przyroda i technika" },
  { id: 32, nazwa: "Samochody i motoryzacja", grupa: "Przyroda i technika" },
  { id: 33, nazwa: "Lotnictwo i transport", grupa: "Przyroda i technika" },
  { id: 34, nazwa: "Film i produkcja filmowa", grupa: "Twórczość" },
  { id: 35, nazwa: "Fotografia", grupa: "Twórczość" },
  { id: 36, nazwa: "Grafika i design", grupa: "Twórczość" },
  { id: 37, nazwa: "Sztuka i twórczość", grupa: "Twórczość" },
  { id: 38, nazwa: "Muzyka", grupa: "Twórczość" },
  { id: 39, nazwa: "Teatr, scena i występowanie", grupa: "Twórczość" },
  { id: 40, nazwa: "Pisanie i literatura", grupa: "Twórczość" },
  { id: 41, nazwa: "Języki i komunikacja", grupa: "Wiedza o świecie" },
  { id: 42, nazwa: "Edukacja i uczenie", grupa: "Wiedza o świecie" },
  { id: 43, nazwa: "Historia", grupa: "Wiedza o świecie" },
  { id: 44, nazwa: "Geografia, kraje i kultury", grupa: "Wiedza o świecie" },
  { id: 45, nazwa: "Podróże i poznawanie świata", grupa: "Wiedza o świecie" },
  { id: 46, nazwa: "Prawo", grupa: "Państwo i społeczeństwo" },
  { id: 47, nazwa: "Kryminalistyka i bezpieczeństwo", grupa: "Państwo i społeczeństwo" },
  { id: 48, nazwa: "Polityka, państwo i stosunki międzynarodowe", grupa: "Państwo i społeczeństwo" },
  { id: 49, nazwa: "Problemy społeczne", grupa: "Państwo i społeczeństwo" },
  { id: 50, nazwa: "Socjologia i społeczeństwo", grupa: "Państwo i społeczeństwo" },
  { id: 51, nazwa: "Filozofia", grupa: "Sens i wspólnota" },
  { id: 52, nazwa: "Religia i duchowość", grupa: "Sens i wspólnota" },
  { id: 53, nazwa: "Chrześcijaństwo i teologia", grupa: "Sens i wspólnota" },
  { id: 54, nazwa: "Pomaganie ludziom i działalność społeczna", grupa: "Sens i wspólnota" },
  { id: 55, nazwa: "Organizacje społeczne i non-profit", grupa: "Sens i wspólnota" },
  { id: 56, nazwa: "Gotowanie i gastronomia", grupa: "Codzienność i rzemiosło" },
  { id: 57, nazwa: "Moda, uroda i styl", grupa: "Codzienność i rzemiosło" },
  { id: 58, nazwa: "Wnętrza i przestrzeń", grupa: "Codzienność i rzemiosło" },
  { id: 59, nazwa: "Rzemiosło i tworzenie przedmiotów", grupa: "Codzienność i rzemiosło" },
  { id: 60, nazwa: "Gry i gaming", grupa: "Codzienność i rzemiosło" },
];

export const ZAINTERESOWANIE_PO_ID = new Map(BANK_ZAINTERESOWAN.map((t) => [t.id, t]));

export const INSTRUKCJA_ZAINTERESOWAN = {
  naglowek: "Co mnie ciekawi",
  wprowadzenie: [
    "Nie pytamy, w jakim zawodzie chcesz pracować. Pytamy, jakie tematy naprawdę przyciągają Twoją uwagę.",
    "To najłatwiejsza część programu. Zaznaczasz to, o czym chciałbyś wiedzieć więcej.",
  ],
  etapy: {
    z1: {
      naglowek: "Które z tych tematów naprawdę Cię ciekawią?",
      podpis: "Nie myśl jeszcze o pracy ani studiach. Wybierz tematy, o których chciałbyś wiedzieć więcej.",
      limit: 15,
    },
    z2: {
      naglowek: "Do których z tych tematów wracasz z własnej woli?",
      podpis:
        "Oglądasz o nich materiały, czytasz, rozmawiasz, śledzisz ludzi albo sam szukasz informacji.",
      limit: 8,
    },
    z3: {
      naglowek:
        "Gdybyś przez kilka kolejnych lat miał regularnie poznawać tylko kilka z tych obszarów, które nadal chciałbyś zgłębiać?",
      podpis: "Zostaw pięć. Potem ustawisz je w kolejności.",
      limit: 5,
    },
  },
  ukladanie: {
    naglowek: "Ustaw swoją piątkę w kolejności",
    podpis: "Od tematu, który ciekawi Cię najbardziej, do tego, który ciekawi Cię najmniej z tej piątki.",
  },
} as const;

/**
 * Ekran miedzy modulem pierwszym a drugim. Obowiazkowy.
 *
 * Bez niego uczestnik przenosi wybory tematyczne na czynnosci: zaznaczyl
 * medycyne, wiec zaznacza tez „pomaganie ludziom", choc wcale nie chce nikogo
 * leczyc. To jest najtansza bariera w calym programie i jedyna, ktora tego
 * pilnuje.
 */
export const EKRAN_PRZEJSCIA = {
  naglowek: "Teraz zmieniamy temat",
  akapity: [
    "Do tej pory pytaliśmy, co Cię ciekawi. Teraz zapytamy, co lubisz robić, a to zupełnie coś innego.",
    "Można interesować się medycyną i wcale nie chcieć nikogo leczyć. Można kochać samochody i nie mieć ochoty ich naprawiać.",
    "Więc zapomnij na chwilę o tematach, które wybrałeś. Teraz chodzi o same czynności.",
  ],
  przycisk: "Rozumiem, dalej",
} as const;
