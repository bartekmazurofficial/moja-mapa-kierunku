/**
 * Model ekranu assessmentu.
 *
 * Jeden uniwersalny komponent obsluguje wszystkie typy pozycji, ktore
 * wystepuja w siedmiu modulach. Ekran to jedna rzecz do zrobienia: jeden blok
 * rankingowy, jedna para, jeden zestaw pozycji na skali.
 */

export type KodModulu = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "M1";

/**
 * Marker zamkniecia czesci modulu. Czesci zlozone z samych pol
 * nieobowiazkowych inaczej nie daloby sie odroznic od nierozpocztych.
 */
export const MARKER_ZAKONCZENIA = "__zakonczono";

export type TypPozycji =
  | "ranking4"
  | "kotwica"
  | "para"
  | "skala5"
  | "trzystopniowa"
  | "tak_nie"
  | "pojedynczy"
  | "wielokrotny"
  | "dowody"
  | "tekst"
  | "kilka_tekstow";

export interface OpcjaWyboru {
  kod: string;
  etykieta: string;
  /** Druga linia pod etykieta. Zdanie wyjasniajace, nie druga nazwa. */
  podpis?: string;
  /** Klucz znaku kategorii, np. "a1-7". Ilustrujemy kategorie, nie pozycje. */
  ikona?: string;
  /** Opcja wykluczajaca sie z pozostalymi, np. "nic z tego". */
  wylaczna?: boolean;
}

export interface Pozycja {
  /** Klucz zapisu w tabeli odpowiedzi. */
  id: string;
  /** Klucz kategorii pozycji: stad bierze sie jej znak i kolor bloku. */
  ikona?: string;
  typ: TypPozycji;
  /** Tresc pytania albo pozycji. */
  tresc?: string;
  podpis?: string;
  /** ranking4: cztery opcje do ustawienia w kolejnosci. */
  opcje?: OpcjaWyboru[];
  /** para: dwie strony wyboru, juz po losowaniu strony. */
  stronaA?: { kod: string; tekst: string; ikona?: string };
  stronaB?: { kod: string; tekst: string; ikona?: string };
  /** skala5: etykiety krancow. */
  krance?: [string, string];
  /** dowody: trzy pola do zaznaczenia. */
  pola?: string[];
  /** kilka_tekstow: kilka pol w jednej pozycji. */
  zdania?: string[];
  /** wielokrotny: ograniczenia liczby wyborow. */
  minWyborow?: number;
  maksWyborow?: number;
  /** dokladnie_trzy z modulu A0. */
  dokladnie?: number;
  opcjonalna?: boolean;
  /** tekst: wieksze pole. */
  duze?: boolean;
  /** Pozycja pokazywana tylko przy okreslonej odpowiedzi na inna pozycje. */
  warunek?: { pozycja: string; wartosci: string[] };
  /** kotwica: pytanie o ekspozycje obok skali. */
  pytanieEkspozycja?: string;
}

export interface Ekran {
  klucz: string;
  /** Znak kategorii dla całego ekranu, np. osi A3 albo obszaru wizji życia. */
  ikona?: string;
  /** To samo pytanie od drugiej strony. Zachęta, nie kolejne pole. */
  odwrotnie?: string;
  /** Klucz kategorii tylko dla koloru, bez ilustracji. */
  kolor?: string;
  /**
   * Klucz ilustracji na pas nad odpowiedziami, gdy ma byc inna niz znak
   * kategorii. A5 pyta o czterdziesci trzy rozne warunki w siedmiu blokach,
   * wiec obrazek warunku mowi wiecej niz obrazek bloku. Gdy pliku nie ma,
   * pas cofa sie do znaku kategorii, a gdy i tego nie ma, nie rysuje sie wcale.
   */
  obraz?: string;
  typ: "wstep" | "pozycje" | "przerwa" | "koniec";
  naglowek?: string;
  akapity?: string[];
  /** Polecenie nad pozycjami. */
  polecenie?: string;
  podpis?: string;
  /**
   * Szkic wygenerowany z wczesniejszej czesci modulu. Jedyne miejsce w calym
   * programie, gdzie celowo pokazujemy uczestnikowi wczesniejszy wynik przed
   * odpowiedzia: tu nie ma pomiaru, jest swiadomy wybor.
   */
  notatka?: string;
  /**
   * Pozycja, z ktorej bierzemy tresc w miejsce znacznika {…} w notatce.
   * Sluzy tam, gdzie szkic jest odbiciem tego, co uczestnik wlasnie napisal.
   */
  notatkaZPola?: string;
  pozycje?: Pozycja[];
  /** Dalsza czesc instrukcji, schowana pod "rozwin". */
  rozwiniecie?: string[];
  /**
   * Co ile pozycji zostawic wieksza przerwe. Dwadziescia cztery pozycje w
   * jednej liscie czytaja sie jak sciana, te same w pieciu skupiskach czytaja
   * sie jak piec rzeczy. Grupy sa wylacznie przestrzenne i nienazwane:
   * etykieta sugerowalaby strukture i wplynelaby na odpowiedzi.
   */
  skupiskaCo?: number;
  /** "blok 12 z 36". Nigdy procent: procent wywoluje pospiech. */
  postep?: { nr: number; z: number; slowo: string };
  przyciskDalej?: string;
  /** Ekran pokazywany tylko przy okreslonej odpowiedzi na wczesniejsza pozycje. */
  warunek?: { pozycja: string; wartosci: string[] };
}

export interface CzescModulu {
  kod: string;
  nazwa: string;
  ekrany: Ekran[];
}
