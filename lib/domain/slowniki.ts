/**
 * Slowniki kontrolowane szesciu modulow diagnostycznych.
 *
 * Tresci pochodza doslownie z dokumentow w program-doradztwa/02_assessmenty/.
 * Nie zmieniamy ich. Ten plik jest jedynym zrodlem prawdy o kodach modulow
 * i sluzy zarowno parserowi bazy obszarow, jak i silnikowi.
 */

// =====================================================================
// A1 - ZAINTERESOWANIA: 24 obszary w 6 rodzinach (RIASEC)
// Rodzina nie jest nigdy pokazywana uczestnikowi.
// =====================================================================

export type RodzinaA1 = "R" | "I" | "A" | "S" | "E" | "C";

export interface ObszarZainteresowan {
  id: number;
  rodzina: RodzinaA1;
  nazwaTechniczna: string;
  etykieta: string;
  kotwica: string;
}

export const RODZINY_A1: Record<RodzinaA1, { nazwa: string; obszary: number[] }> = {
  R: { nazwa: "Rzeczy, ręce, teren", obszary: [1, 2, 3, 4] },
  I: { nazwa: "Dociekanie", obszary: [5, 6, 7, 8] },
  A: { nazwa: "Tworzenie", obszary: [9, 10, 11, 12] },
  S: { nazwa: "Ludzie", obszary: [13, 14, 15, 16] },
  E: { nazwa: "Wpływ", obszary: [17, 18, 19, 20] },
  C: { nazwa: "Porządek", obszary: [21, 22, 23, 24] },
};

export const OBSZARY_A1: ObszarZainteresowan[] = [
  { id: 1, rodzina: "R", nazwaTechniczna: "Naprawa i mechanika", etykieta: "Naprawianie i rozgryzanie, jak coś działa", kotwica: "naprawiać rzeczy i szukać przyczyny awarii" },
  { id: 2, rodzina: "R", nazwaTechniczna: "Budowanie i wytwarzanie", etykieta: "Robienie rzeczy własnymi rękami", kotwica: "robić rzeczy własnymi rękami" },
  { id: 3, rodzina: "R", nazwaTechniczna: "Przyroda, zwierzęta, rośliny", etykieta: "Zwierzęta, rośliny, przyroda", kotwica: "zajmować się zwierzętami i roślinami" },
  { id: 4, rodzina: "R", nazwaTechniczna: "Ciało, ruch, teren", etykieta: "Ruch, teren, praca ciałem", kotwica: "pracować w ruchu, w terenie, ciałem" },
  { id: 5, rodzina: "I", nazwaTechniczna: "Technologia i programowanie", etykieta: "Technologia i programowanie", kotwica: "programować i pracować z technologią" },
  { id: 6, rodzina: "I", nazwaTechniczna: "Nauka i eksperyment", etykieta: "Dociekanie, jak działa świat", kotwica: "badać i sprawdzać, jak działa świat" },
  { id: 7, rodzina: "I", nazwaTechniczna: "Zdrowie i ciało człowieka", etykieta: "Zdrowie i ludzkie ciało", kotwica: "zajmować się zdrowiem i ludzkim ciałem" },
  { id: 8, rodzina: "I", nazwaTechniczna: "Liczby, dane, wzorce", etykieta: "Liczby i wyciąganie wniosków z danych", kotwica: "pracować z liczbami i danymi" },
  { id: 9, rodzina: "A", nazwaTechniczna: "Obraz i design", etykieta: "Obraz, wygląd, projektowanie", kotwica: "projektować to, jak rzeczy wyglądają" },
  { id: 10, rodzina: "A", nazwaTechniczna: "Słowo i pisanie", etykieta: "Pisanie i praca ze słowem", kotwica: "pisać i pracować z tekstem" },
  { id: 11, rodzina: "A", nazwaTechniczna: "Dźwięk i muzyka", etykieta: "Dźwięk i muzyka", kotwica: "pracować z dźwiękiem i muzyką" },
  { id: 12, rodzina: "A", nazwaTechniczna: "Scena, film, występ", etykieta: "Scena, film, występowanie", kotwica: "występować, grać, tworzyć filmy" },
  { id: 13, rodzina: "S", nazwaTechniczna: "Opieka i troska", etykieta: "Opiekowanie się drugim człowiekiem", kotwica: "opiekować się osobą, która potrzebuje pomocy" },
  { id: 14, rodzina: "S", nazwaTechniczna: "Nauczanie i tłumaczenie", etykieta: "Uczenie i tłumaczenie innym", kotwica: "uczyć innych i tłumaczyć im rzeczy" },
  { id: 15, rodzina: "S", nazwaTechniczna: "Rozmowa i wsparcie", etykieta: "Rozmowa i wspieranie w trudnościach", kotwica: "rozmawiać z ludźmi o tym, co przeżywają" },
  { id: 16, rodzina: "S", nazwaTechniczna: "Wspólnota i służba", etykieta: "Wspólnota i robienie czegoś dla innych", kotwica: "robić coś wspólnie dla innych ludzi" },
  { id: 17, rodzina: "E", nazwaTechniczna: "Sprzedaż i przekonywanie", etykieta: "Przekonywanie ludzi", kotwica: "przekonywać ludzi i sprzedawać" },
  { id: 18, rodzina: "E", nazwaTechniczna: "Prowadzenie ludzi", etykieta: "Prowadzenie ludzi i decydowanie", kotwica: "prowadzić ludzi i podejmować decyzje za grupę" },
  { id: 19, rodzina: "E", nazwaTechniczna: "Przedsiębiorczość i ryzyko", etykieta: "Własne przedsięwzięcia i ryzyko", kotwica: "prowadzić coś własnego, na własne ryzyko" },
  { id: 20, rodzina: "E", nazwaTechniczna: "Spór, prawo, negocjacje", etykieta: "Argumentowanie, spór, negocjacje", kotwica: "spierać się, argumentować, negocjować" },
  { id: 21, rodzina: "C", nazwaTechniczna: "Porządkowanie i systematyzowanie", etykieta: "Porządkowanie i układanie w system", kotwica: "porządkować i układać w system" },
  { id: 22, rodzina: "C", nazwaTechniczna: "Precyzja i kontrola", etykieta: "Precyzja i wyłapywanie błędów", kotwica: "pracować dokładnie i wyłapywać błędy" },
  { id: 23, rodzina: "C", nazwaTechniczna: "Pieniądze i rozliczenia", etykieta: "Pieniądze i rozliczenia", kotwica: "zajmować się pieniędzmi i rozliczeniami" },
  { id: 24, rodzina: "C", nazwaTechniczna: "Planowanie i logistyka", etykieta: "Planowanie i ogarnianie logistyki", kotwica: "planować i ogarniać logistykę" },
];

// =====================================================================
// A2 - KOMPETENCJE: 30 w 6 grupach
// =====================================================================

export type GrupaA2 = "AN" | "UT" | "SL" | "LU" | "WY" | "CP";

export interface Kompetencja {
  id: number;
  grupa: GrupaA2;
  nazwa: string;
  opis: string;
}

export const GRUPY_A2: Record<GrupaA2, string> = {
  AN: "Analiza i myślenie",
  UT: "Uczenie się i tworzenie",
  SL: "Słowo i przekaz",
  LU: "Ludzie i relacje",
  WY: "Wykonanie i porządek",
  CP: "Ciało, technika, presja",
};

export const KOMPETENCJE_A2: Kompetencja[] = [
  { id: 1, grupa: "AN", nazwa: "Rozwiązywanie problemów", opis: "Dochodzisz do przyczyny, kiedy coś przestaje działać" },
  { id: 2, grupa: "AN", nazwa: "Analiza informacji", opis: "Z dużej ilości informacji wybierasz to, co istotne" },
  { id: 3, grupa: "AN", nazwa: "Rachunki i szacowanie", opis: "Liczysz w pamięci i sprawdzasz, czy się zgadza" },
  { id: 4, grupa: "AN", nazwa: "Myślenie systemowe", opis: "Widzisz, na co wpłynie zmiana jednego elementu" },
  { id: 5, grupa: "AN", nazwa: "Praca z regułami i przepisami", opis: "Czytasz zasady i sprawdzasz, czy są dotrzymane" },
  { id: 6, grupa: "UT", nazwa: "Szybkie uczenie się nowego", opis: "Wchodzisz w nowy temat i zaczynasz w nim działać" },
  { id: 7, grupa: "UT", nazwa: "Zapamiętywanie i przywoływanie", opis: "Trzymasz w pamięci szczegóły i wracasz do nich" },
  { id: 8, grupa: "UT", nazwa: "Wymyślanie nowych rozwiązań", opis: "Znajdujesz sposób inny niż oczywisty" },
  { id: 9, grupa: "UT", nazwa: "Wyczucie formy i estetyki", opis: "Widzisz, co w wyglądzie nie gra, i wiesz, co zmienić" },
  { id: 10, grupa: "UT", nazwa: "Wyobraźnia przestrzenna", opis: "Wyobrażasz sobie rzecz w przestrzeni przed jej powstaniem" },
  { id: 11, grupa: "SL", nazwa: "Wyrażanie się słowem", opis: "Ujmujesz rzecz w zdanie, które jest jasne" },
  { id: 12, grupa: "SL", nazwa: "Wyjaśnianie i uczenie innych", opis: "Tłumaczysz w sposób, po którym ktoś rozumie" },
  { id: 13, grupa: "SL", nazwa: "Wystąpienia przed grupą", opis: "Mówisz do wielu osób i trzymasz wątek" },
  { id: 14, grupa: "SL", nazwa: "Przekonywanie", opis: "Przedstawiasz argumenty, które zmieniają czyjeś stanowisko" },
  { id: 15, grupa: "SL", nazwa: "Negocjowanie", opis: "Ustalasz warunki możliwe do przyjęcia przez obie strony" },
  { id: 16, grupa: "LU", nazwa: "Wyczuwanie ludzi", opis: "Odczytujesz stan drugiej osoby, zanim go nazwie" },
  { id: 17, grupa: "LU", nazwa: "Cierpliwość i opiekuńczość", opis: "Zostajesz przy kimś, kto potrzebuje czasu" },
  { id: 18, grupa: "LU", nazwa: "Rozbrajanie napięć", opis: "Obniżasz napięcie w sytuacji konfliktowej" },
  { id: 19, grupa: "LU", nazwa: "Uprzejmość pod presją", opis: "Zachowujesz uprzejmość, gdy druga strona jej nie zachowuje" },
  { id: 20, grupa: "LU", nazwa: "Prowadzenie grupy", opis: "Ustawiasz grupę wokół celu i podejmujesz decyzję" },
  { id: 21, grupa: "WY", nazwa: "Organizowanie i planowanie", opis: "Rozpisujesz działanie na etapy i pilnujesz terminów" },
  { id: 22, grupa: "WY", nazwa: "Dokładność", opis: "Wyłapujesz błędy w tekście, liczbach albo wykonaniu" },
  { id: 23, grupa: "WY", nazwa: "Wytrwałość w powtarzalnym", opis: "Wykonujesz tę samą czynność długo, bez spadku jakości" },
  { id: 24, grupa: "WY", nazwa: "Prowadzenie wielu spraw naraz", opis: "Prowadzisz kilka spraw równolegle, nie gubiąc żadnej" },
  { id: 25, grupa: "WY", nazwa: "Samodzielność bez nadzoru", opis: "Pracujesz bez poleceń i bez kontroli" },
  { id: 26, grupa: "CP", nazwa: "Sprawność manualna", opis: "Wykonujesz rękami precyzyjne i równe ruchy" },
  { id: 27, grupa: "CP", nazwa: "Obsługa sprzętu i techniki", opis: "Szybko opanowujesz obsługę nowego urządzenia" },
  { id: 28, grupa: "CP", nazwa: "Wytrzymałość fizyczna", opis: "Wytrzymujesz wysiłek i niewygodę przez długi czas" },
  { id: 29, grupa: "CP", nazwa: "Opanowanie pod presją", opis: "Zachowujesz jasność myślenia w sytuacji napiętej" },
  { id: 30, grupa: "CP", nazwa: "Odporność na odmowę i porażkę", opis: "Wracasz do działania po odmowie albo niepowodzeniu" },
];

// =====================================================================
// A3 - STYL DZIALANIA: 12 wymiarow dwubiegunowych
// warunekA/warunekB to zdania srodowiskowe z rozdzialu 7 modulu A3.
// =====================================================================

export type Biegun = "A" | "B";

export interface WymiarA3 {
  kod: string;
  biegunA: string;
  biegunB: string;
  warunekA: string;
  warunekB: string;
}

export const WYMIARY_A3: WymiarA3[] = [
  { kod: "INI", biegunA: "Inicjatywa", biegunB: "Reagowanie", warunekA: "przestrzeń na własne inicjatywy", warunekB: "jasne oczekiwania i polecenia" },
  { kod: "STR", biegunA: "Potrzeba struktury", biegunB: "Elastyczność", warunekA: "przewidywalny plan i harmonogram", warunekB: "swoboda w układaniu pracy" },
  { kod: "TEM", biegunA: "Tempo i przybliżenie", biegunB: "Wolniej i dokładnie", warunekA: "tempo ważniejsze niż wykończenie", warunekB: "czas na porządne dopracowanie" },
  { kod: "SAM", biegunA: "Samodzielnie", biegunB: "Z ludźmi", warunekA: "możliwość pracy w pojedynkę", warunekB: "stały kontakt z ludźmi" },
  { kod: "GLE", biegunA: "Głębia, jedno do końca", biegunB: "Szerokość, wiele naraz", warunekA: "skupienie na jednym obszarze", warunekB: "różnorodne zadania" },
  { kod: "RYZ", biegunA: "Gotowość na ryzyko", biegunB: "Potrzeba pewności", warunekA: "dopuszczalne ryzyko i niepewność", warunekB: "stabilne, przewidywalne warunki" },
  { kod: "DEC", biegunA: "Chcę decydować", biegunB: "Chcę jasne zadanie", warunekA: "realny wpływ na decyzje", warunekB: "jasno określony zakres zadań" },
  { kod: "KON", biegunA: "Konfrontacja", biegunB: "Utrzymanie zgody", warunekA: "kultura mówienia wprost", warunekB: "atmosfera bez napięć" },
  { kod: "NOW", biegunA: "Nowe i nieznane", biegunB: "Sprawdzone", warunekA: "ciągła zmiana i nowe rzeczy", warunekB: "możliwość opanowania rutyny" },
  { kod: "NAP", biegunA: "Napęd własny", biegunB: "Napęd z zewnątrz", warunekA: "brak kontroli nad głową", warunekB: "zewnętrzne terminy i przypomnienia" },
  { kod: "RYT", biegunA: "Równe tempo", biegunB: "Praca zrywami", warunekA: "równomierne obciążenie", warunekB: "praca projektowa, zrywami" },
  { kod: "OTO", biegunA: "Cisza i porządek", biegunB: "Ruch i bodźce", warunekA: "ciche, uporządkowane miejsce", warunekB: "żywe, ruchliwe otoczenie" },
  // Os trzynasta, dolozona po fazie 5. Mierzy, jak szybko czlowiek potrzebuje
  // widziec wynik swojej pracy. Elektryk widzi efekt tego samego dnia,
  // architekt po kilku latach, nauczyciel nigdy w sposob policzalny.
  { kod: "EFE", biegunA: "Efekt szybki", biegunB: "Efekt odroczony", warunekA: "szybko widoczny wynik pracy", warunekB: "wynik widoczny dopiero po czasie" },
];

// =====================================================================
// A4 - WARTOSCI: 12
// =====================================================================

export interface WartoscA4 {
  kod: string;
  nazwa: string;
  znaczenie: string;
}

export const WARTOSCI_A4: WartoscA4[] = [
  { kod: "PIE", nazwa: "Pieniądze i poziom życia", znaczenie: "Móc sobie pozwolić na to, czego chcę" },
  { kod: "STA", nazwa: "Stabilność i bezpieczeństwo", znaczenie: "Pewność jutra, przewidywalny dochód" },
  { kod: "WOL", nazwa: "Wolność i decydowanie o sobie", znaczenie: "Nikt mi nie mówi, jak mam żyć i pracować" },
  { kod: "ROZ", nazwa: "Rozwój i uczenie się", znaczenie: "Ciągle robię się w czymś lepszy" },
  { kod: "WPL", nazwa: "Wpływ", znaczenie: "Moje decyzje coś zmieniają" },
  { kod: "SEN", nazwa: "Sens i pomaganie ludziom", znaczenie: "Moja praca komuś realnie służy" },
  { kod: "UZN", nazwa: "Uznanie", znaczenie: "Ludzie widzą i doceniają, co robię" },
  { kod: "REL", nazwa: "Bliskie relacje w pracy", znaczenie: "Ludzie, z którymi chce się być" },
  { kod: "CZA", nazwa: "Czas dla siebie i bliskich", znaczenie: "Praca nie zjada mi życia" },
  { kod: "MIS", nazwa: "Mistrzostwo", znaczenie: "Być naprawdę dobrym w swojej rzeczy" },
  { kod: "ZMI", nazwa: "Zmienność i wyzwania", znaczenie: "Ciągle dzieje się coś nowego" },
  { kod: "ZAS", nazwa: "Zgodność z własnymi zasadami", znaczenie: "Nie muszę robić rzeczy, w które nie wierzę" },
];

// =====================================================================
// A5 - FILTRY RZECZYWISTOSCI: 32 pozycje w 7 blokach
// =====================================================================

export interface FiltrA5 {
  kod: string;
  blok: number;
  nazwaBloku: string;
  tekst: string;
}

export const FILTRY_A5: FiltrA5[] = [
  { kod: "F01", blok: 1, nazwaBloku: "Nauka i zdobywanie uprawnień", tekst: "Studia trwające pięć lat albo dłużej" },
  { kod: "F02", blok: 1, nazwaBloku: "Nauka i zdobywanie uprawnień", tekst: "Studia, w jakiejkolwiek formie" },
  { kod: "F03", blok: 1, nazwaBloku: "Nauka i zdobywanie uprawnień", tekst: "Trudne egzaminy zawodowe po studiach" },
  { kod: "F04", blok: 1, nazwaBloku: "Nauka i zdobywanie uprawnień", tekst: "Dokształcanie się przez cały czas pracy" },
  { kod: "F05", blok: 1, nazwaBloku: "Nauka i zdobywanie uprawnień", tekst: "Nauka po godzinach, obok pracy" },
  { kod: "F06", blok: 2, nazwaBloku: "Miejsce", tekst: "Przeprowadzka do innego miasta" },
  { kod: "F07", blok: 2, nazwaBloku: "Miejsce", tekst: "Praca albo studia za granicą" },
  { kod: "F08", blok: 2, nazwaBloku: "Miejsce", tekst: "Życie daleko od rodziny" },
  { kod: "F09", blok: 2, nazwaBloku: "Miejsce", tekst: "Częste wyjazdy służbowe" },
  { kod: "F10", blok: 2, nazwaBloku: "Miejsce", tekst: "Praca w jednym miejscu przez wiele lat" },
  { kod: "F11", blok: 3, nazwaBloku: "Czas", tekst: "Praca w weekendy" },
  { kod: "F12", blok: 3, nazwaBloku: "Czas", tekst: "Praca na zmiany, także nocne" },
  { kod: "F13", blok: 3, nazwaBloku: "Czas", tekst: "Dyżury i bycie pod telefonem" },
  { kod: "F14", blok: 3, nazwaBloku: "Czas", tekst: "Nadgodziny w gorących okresach" },
  { kod: "F15", blok: 3, nazwaBloku: "Czas", tekst: "Nieregularne, zmienne godziny" },
  { kod: "F39", blok: 3, nazwaBloku: "Czas", tekst: "Samodzielne zdobywanie klientów" },
  { kod: "F16", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Praca wieczorami, gdy dzień się kończy" },
  { kod: "F17", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Praca fizyczna, wymagająca siły" },
  { kod: "F18", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Praca na dworze w każdą pogodę" },
  { kod: "F19", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Stanie albo chodzenie przez większość dnia" },
  { kod: "F20", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Siedzenie przy komputerze przez większość dnia" },
  { kod: "F21", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Brud, zapachy i nieprzyjemne warunki" },
  { kod: "F34", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Agresja słowna albo fizyczna w pracy" },
  { kod: "F33", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Praca w pojedynkę, bez zespołu" },
  { kod: "F36", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Niepewny, zmienny dochód" },
  { kod: "F37", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Prowadzenie własnej działalności" },
  { kod: "F38", blok: 4, nazwaBloku: "Warunki fizyczne", tekst: "Niskie zarobki przez pierwsze lata" },
  { kod: "F22", blok: 5, nazwaBloku: "Ludzie", tekst: "Codzienny kontakt z krwią i ranami" },
  { kod: "F23", blok: 5, nazwaBloku: "Ludzie", tekst: "Kontakt ze śmiercią i z umieraniem" },
  { kod: "F24", blok: 5, nazwaBloku: "Ludzie", tekst: "Hałas taki, że trzeba nosić ochronniki" },
  { kod: "F25", blok: 5, nazwaBloku: "Ludzie", tekst: "Ciasne przestrzenie, na przykład szachty" },
  { kod: "F26", blok: 5, nazwaBloku: "Ludzie", tekst: "Praca na wysokości, na dachu albo rusztowaniu" },
  { kod: "F27", blok: 5, nazwaBloku: "Ludzie", tekst: "Codzienny kontakt z chemikaliami" },
  { kod: "F35", blok: 5, nazwaBloku: "Ludzie", tekst: "Słyszenie odmowy kilkadziesiąt razy w miesiącu" },
  { kod: "F42", blok: 5, nazwaBloku: "Ludzie", tekst: "Dużo papierów i sprawozdań" },
  { kod: "F28", blok: 6, nazwaBloku: "Pieniądze i ryzyko", tekst: "Kontakt z ludźmi przez cały dzień" },
  { kod: "F29", blok: 6, nazwaBloku: "Pieniądze i ryzyko", tekst: "Praca z małymi dziećmi" },
  { kod: "F30", blok: 6, nazwaBloku: "Pieniądze i ryzyko", tekst: "Praca z osobami chorymi albo starszymi" },
  { kod: "F40", blok: 6, nazwaBloku: "Pieniądze i ryzyko", tekst: "Odpowiedzialność za czyjeś zdrowie" },
  { kod: "F31", blok: 7, nazwaBloku: "Odpowiedzialność", tekst: "Obsługa niezadowolonych klientów" },
  { kod: "F32", blok: 7, nazwaBloku: "Odpowiedzialność", tekst: "Częste wystąpienia przed grupą" },
  { kod: "F41", blok: 7, nazwaBloku: "Odpowiedzialność", tekst: "Stała presja czasu i wyniku" },
  { kod: "F43", blok: 7, nazwaBloku: "Odpowiedzialność", tekst: "Poprawianie swojej pracy po raz czwarty" },
];

// =====================================================================
// M1 - KSZTALT ZYCIA: 12 wymiarow dwubiegunowych
// =====================================================================

export interface WymiarM1 {
  kod: string;
  biegunA: string;
  biegunB: string;
  twardy: boolean;
}

/** Wymiary twarde: pelna niezgodnosc oznacza realny konflikt z codziennoscia. */
export const WYMIARY_M1: WymiarM1[] = [
  { kod: "CEN", biegunA: "Praca jako centrum", biegunB: "Praca jako środek", twardy: false },
  { kod: "GRA", biegunA: "Praca przemieszana z życiem", biegunB: "Ostro rozdzielona", twardy: false },
  { kod: "GOD", biegunA: "Dużo godzin", biegunB: "Mniej godzin", twardy: true },
  { kod: "TEMP", biegunA: "Kariera szybka", biegunB: "Budowana powoli", twardy: false },
  { kod: "MIE", biegunA: "Stacjonarnie", biegunB: "Zdalnie", twardy: true },
  { kod: "ORG", biegunA: "Duża organizacja", biegunB: "Mały zespół", twardy: false },
  { kod: "KOR", biegunA: "Osiąść na stałe", biegunB: "Mobilność", twardy: true },
  { kod: "INW", biegunA: "Szybko zarabiać", biegunB: "Długo inwestować w naukę", twardy: false },
  { kod: "POZ", biegunA: "Wysoki poziom życia", biegunB: "Wystarczy wygodnie", twardy: false },
  { kod: "LUD", biegunA: "Prowadzić ludzi", biegunB: "Odpowiadać za siebie", twardy: false },
  { kod: "WID", biegunA: "Życie widoczne", biegunB: "Prywatne", twardy: false },
  { kod: "ROD", biegunA: "Rodzina wcześnie", biegunB: "Później albo niekoniecznie", twardy: false },
];

// =====================================================================
// INDEKSY POMOCNICZE
// =====================================================================

export const A1_PO_NAZWIE = new Map(OBSZARY_A1.map((o) => [o.nazwaTechniczna, o.id]));
export const A2_PO_NAZWIE = new Map(KOMPETENCJE_A2.map((k) => [k.nazwa, k.id]));
export const A3_PO_KODZIE = new Map(WYMIARY_A3.map((w) => [w.kod, w]));
export const A4_PO_KODZIE = new Map(WARTOSCI_A4.map((w) => [w.kod, w]));
export const A5_PO_KODZIE = new Map(FILTRY_A5.map((f) => [f.kod, f]));
export const M1_PO_KODZIE = new Map(WYMIARY_M1.map((w) => [w.kod, w]));
