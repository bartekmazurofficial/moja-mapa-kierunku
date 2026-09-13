/**
 * Typy wejscia i wyjscia silnika.
 *
 * Silnik jest zbiorem czystych funkcji: dostaje wyniki modulow i baze
 * referencyjna, zwraca wynik. Nie dotyka bazy danych ani interfejsu.
 */

import type { BazaReferencyjna } from "../domain/typy";

export type { BazaReferencyjna };

// =====================================================================
// WEJSCIE
// =====================================================================

/** Modul A0. Fakty o sytuacji startowej, nie opinie o sobie. */
export interface PunktStartu {
  etap: EtapEdukacji;
  rozszerzenia: string[];
  /** Dokladnie 3 przedmioty. */
  przedmiotyMocne: string[];
  /** Dokladnie 3 przedmioty. */
  przedmiotyTrudne: string[];
  matematyka: "dobrze" | "radze_sobie" | "trudna" | "najwiekszy_problem" | null;
  doswiadczenie: string[];
  doswiadczenieOpis: string | null;
  miejsce: "wies" | "male_miasto" | "srednie_miasto" | "duze_miasto" | "wielkie_miasto";
  mobilnosc: "tak_daleko" | "tak_region" | "wolalbym_nie" | "nie";
  dojazdDoMiasta: "blisko" | "godzina" | "nie";
  zasoby: "realne" | "raty" | "bardzo_trudne" | "nierealne";
  /** Moze byc pominiete bez zadnych konsekwencji dla wyniku. */
  ograniczenia: string[];
  ograniczeniaPominiete: boolean;

  // --- Sciezka 3: po maturze albo w trakcie studiow ---
  /** Kierunek studiow, wlasnymi slowami. Null, gdy etap go nie dotyczy. */
  kierunek: string | null;
  /** Czy kierunek okazal sie tym, czego uczestnik oczekiwal. */
  kierunekOcena: "dokladnie" | "w_porzadku" | "zupelnie_nie" | "nie_wiem" | null;

  // --- Sciezka 4: po studiach, pracujacy, przerwa ---
  /** Ukonczony poziom wyksztalcenia. Otwiera drogi, nigdy zadnej nie zamyka. */
  wyksztalcenie:
    | "podstawowe"
    | "branzowe"
    | "srednie"
    | "technikum_matura"
    | "licencjat"
    | "magister"
    | "podyplomowe"
    | null;
  /** Kierunek albo zawod ukonczonej szkoly, wlasnymi slowami. */
  wyksztalcenieKierunek: string | null;
  /** Obszary, w ktorych uczestnik pracowal. */
  branza: string[];
  /** Dlugosc stazu zawodowego. Steruje sila wzmocnienia za doswiadczenie. */
  stazPracy: "do_roku" | "rok_trzy" | "powyzej_trzech" | "nie_pracowalem" | null;
  /**
   * Dlaczego szuka zmiany. **Steruje trescia rekomendacji, nie doborem
   * zawodow**: zaden powod nie usuwa ani nie dodaje zawodu do puli.
   */
  powodZmiany: string[];
  /** Co go dzis blokuje. Wchodzi do pierwszego kroku w raporcie. */
  blokada: string[];
}

export type EtapEdukacji =
  | "podstawowka"
  | "liceum_1_2"
  | "liceum_maturalna"
  | "branzowa"
  | "po_maturze"
  | "studiuje"
  | "po_studiach"
  | "pracuje_zmiana"
  | "nie_uczy_nie_pracuje";

/** Komplet wynikow siedmiu modulow. To jest jedyne wejscie silnika. */
export interface WynikiModulow {
  /** A0. Null, gdy uczestnik nie wypelnil metryczki. */
  punktStartu: PunktStartu | null;

  /** A1: wynik zlozony 24 obszarow zainteresowan, 0-100. */
  z: Record<number, number>;
  /** A1 czesc C: czy uczestnik probowal juz czegos takiego. */
  ekspozycja: Record<number, boolean>;

  /** A2: wynik zlozony 30 kompetencji, 0-100. */
  k: Record<number, number>;
  /** A2 czesc B: liczba dowodow na kompetencje, 0-3. */
  dowody: Record<number, number>;

  /** A3: polozenie na 12 osiach, 0-100. 100 to czysty biegun A. */
  a3Pozycje: Record<string, number>;
  /** A3: sila warunku srodowiskowego, 0-100. Od 65 to warunek kluczowy. */
  a3Sila: Record<string, number>;

  /** A4: piec wartosci z gory. */
  a4Top5: string[];
  /** A4: trzy wartosci z dolu. */
  a4Bottom3: string[];
  /** A4 czesc B: wartosci nieodzowne, maksymalnie trzy. Dzialaja inaczej. */
  a4Progowe: string[];

  /** A5: gotowosc na 32 warunki. TAK = 1,0, MOZE = 0,5, NIE = 0,0. */
  g: Record<string, number>;
  /** A5 czesc B: twarde weta, maksymalnie trzy. Jedyny mechanizm usuwajacy. */
  weta: string[];

  /** M1 czesc A: polozenie na 12 osiach ksztaltu zycia. Null = pominiete. */
  shape: Record<string, number | null>;
}

// =====================================================================
// WSKAZNIKI JAKOSCI I DEGRADACJA
// =====================================================================

export interface WskaznikiJakosci {
  /** A1: max(Z) - min(Z). Ponizej 18 profil plaski. */
  zroznicowanieA1: number;
  /** A2: max(K) - min(K). */
  zroznicowanieA2: number;
  /** A5: liczba odpowiedzi NIE. Powyzej 20 wylaczamy filtry. */
  wskaznikZamkniecia: number;
  /** A2: suma dowodow, 0-90. Ponizej 8 wylaczamy bonus kompetencyjny. */
  wskaznikOkazji: number;
  profilPlaskiA1: boolean;
  profilPlaskiA2: boolean;
  filtryWylaczone: boolean;
  bonusWylaczony: boolean;
  /** wyrazny | umiarkowany | jeszcze_nieuksztaltowany */
  pewnosc: "wyrazny" | "umiarkowany" | "jeszcze_nieuksztaltowany";
}

// =====================================================================
// WARSTWA 1
// =====================================================================

export interface WybranyPoziom {
  poziom: string;
  etykieta: string;
  przyklad: string;
  czas: string;
  lata: number;
}

export interface WynikObszaru {
  id: number;
  nazwa: string;
  wynik: number;
  pasmo: string;
  ciagniecie: number;
  kompetencje: number;
  bonus: number;
  mnoznik: number;
  wykonalnosc: number;
  poziomWejscia: WybranyPoziom;
  /** Wyjasnienia z etapu 7. */
  dlaczegoPasuje: string[];
  coPrzeszkadza: string[];
  czegoSieNauczyc: number[];
}

export interface UsunietyObszar {
  id: number;
  nazwa: string;
  powod: "weto" | "brak_poziomu" | "brak_zawodow";
  filtr?: string;
  wymaganie?: number;
  /** Samo ciagniecie z A1, bez wykonalnosci. Do sekcji rozjazdow w panelu. */
  ciagniecie: number;
}

export interface Droga {
  etykieta: "A" | "B" | "C";
  obszar: number;
  nazwaObszaru: string;
  poziom: WybranyPoziom;
  /** Ustawiane w warstwie drugiej. */
  zawody: string[];
}

export interface Antydopasowanie {
  id: number;
  nazwa: string;
  powod: string;
  komunikat: string;
}

export interface WynikWarstwy1 {
  obszary: WynikObszaru[];
  usuniete: UsunietyObszar[];
  drogi: Droga[];
  podobienstwa: { AB?: number; AC?: number; BC?: number };
  flagi: string[];
  antydopasowania: Antydopasowanie[];
  /** Tryb przedsiebiorczy: obszar 27 sparowany z branza. */
  przedsiebiorczoscWObszarze: number | null;
  /** Kompetencje do rozwoju: najnizsze wsrod wymaganych przez czolowke. */
  umiejetnosciDoRozwoju: number[];
  /** Profil plaski: brak rankingu, tylko osie i grupy obszarow. */
  profilNieostry: boolean;
}

// =====================================================================
// WARSTWA 2
// =====================================================================

export interface FlagiZawodu {
  trampolina: boolean;
  zagrozony: boolean;
  zdanieKierunkowe: string | null;
  barieraKosztowa: boolean;
}

export interface WynikZawodu {
  kod: string;
  nazwa: string;
  obszar: number;
  wynik: number;
  pasmo: string;
  wynikObszaru: number;
  mnoznikKartowy: number;
  pokrycie: { a1: number; a2: number; a3: number; odrzucone: number };
  karaPoziomu: number;
  karaKosztu: number;
  /** Korekty z warstwy zerowej, wylacznie wzmocnienia i kary miekkie. */
  korektaA0: number;
  /** Trafienia antyprofilowe: zdania do raportu, nigdy obnizenie pozycji. */
  ostrzezenia: OstrzezenieAntyprofilowe[];
  flagi: FlagiZawodu;
  poziom: string;
  studia: string;
  klaster: string | null;
  /** Dosypany przez gwarancje reprezentacji, ponizej progu pokazania. */
  zGwarancji: string | null;
}

export interface OstrzezenieAntyprofilowe {
  kod: string;
  zdanie: string;
  zrodlo: string;
}

/** Pozycja wyniku: pojedynczy zawod albo klaster jako jedna pozycja. */
export interface PozycjaWyniku {
  typ: "zawod" | "klaster";
  /** Kod zawodu albo kod klastra. */
  kod: string;
  nazwa: string;
  wynik: number;
  pasmo: string;
  /** Zawody wchodzace w sklad. Dla pojedynczego zawodu jeden element. */
  zawody: WynikZawodu[];
  /** Tylko dla klastra. */
  pytanieRozstrzygajace?: string;
  roznica?: string;
  uwaga?: string | null;
}

export interface WynikWarstwy2 {
  pozycje: PozycjaWyniku[];
  /** Pelen ranking do uzytku wewnetrznego, nigdy do ekranu uczestnika. */
  wszystkie: WynikZawodu[];
  /** Widoczne wylacznie dla prowadzacego. Uczestnik nie widzi listy strat. */
  usunieteWetem: Array<{ kod: string; nazwa: string; filtry: string[] }>;
  usunieteA0: Array<{ kod: string; nazwa: string; powod: string }>;
  /** Zawody z obszarow, ktore odpadly przez brak dostepnego poziomu edukacyjnego. */
  usunieteBezPoziomu: Array<{ kod: string; nazwa: string; obszar: string }>;
  gwarancje: { bezStudiow: number; szybkieWejscie: number; dosypane: string[] };
  progPokazania: number;
  wynikiWstepne: boolean;
}

// =====================================================================
// WARSTWA 3
// =====================================================================

export type SensStudiow = "warunek" | "czesc_drog" | "jedna_z_opcji" | "niepotrzebne";

export interface WynikKierunku {
  kod: string;
  nazwa: string;
  wynik: number;
  pasmo: string;
  prowadziDo: string[];
  trudnosc: string;
  wymagane: string[];
  punktowane: string[];
  /** Twoja sytuacja: masz albo nie masz wymaganych przedmiotow. */
  sytuacjaRekrutacyjna: string;
  coSieRobi: string;
  czegoNieDaje: string | null;
  ostrzezenia: string[];
  odsetek: number | null;
  lata: number;
}

export interface WynikWarstwy3 {
  sensStudiow: SensStudiow;
  komunikatOSensie: string;
  udzialZawodowZeStudiami: number;
  kierunki: WynikKierunku[];
  drogiBezStudiow: Array<{
    kod: string;
    nazwa: string;
    typ: string;
    czas: string;
    koszt: string;
    prowadziDo: string[];
    wymagania: string;
  }>;
  /** Przy udziale ponizej 0,4 lista drog bez studiow idzie pierwsza. */
  drogiBezStudiowPierwsze: boolean;
  usuniete: Array<{ kod: string; nazwa: string; powod: string }>;
}

// =====================================================================
// WYJSCIE CALOSCI
// =====================================================================

export interface WynikSilnika {
  wersjaSilnika: string;
  wskazniki: WskaznikiJakosci;
  warstwa1: WynikWarstwy1;
  warstwa2: WynikWarstwy2;
  warstwa3: WynikWarstwy3;
  /** Sterowanie trescia rekomendacji wedlug etapu edukacji. */
  zakonczenie: {
    etap: EtapEdukacji | null;
    rekomendacja: string;
    pierwszyKrok: string;
    /** Zdania dopisane przez powod zmiany. Puste dla scieczek szkolnych. */
    zPowodu: string[];
  } | null;
  /** Silnik nie konczy pracy na rankingu, produkuje material do rozmowy. */
  pytaniaNaSesje: string[];
}
