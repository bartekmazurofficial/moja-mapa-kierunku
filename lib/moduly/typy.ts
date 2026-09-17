/**
 * Model ekranu assessmentu.
 *
 * Jeden uniwersalny komponent obsluguje wszystkie cztery typy pozycji. Ekran
 * to jedna rzecz do zrobienia: jeden etap leja, jedno ukladanie piatki, jedno
 * pytanie wstepne albo caly panel kosztow.
 */

/**
 * Kody modulow.
 *
 * `Z` ciekawosc, `L` co lubie robic, `U` w czym jestem dobry, `F` poziom
 * zycia i dochodu. Trzy pierwsze chodza na mechanice leja, czwarty jest
 * panelem kosztow.
 */
export type KodModulu = "Z" | "L" | "U" | "F";

/**
 * Marker zamkniecia czesci modulu. Czesci zlozone z samych pol
 * nieobowiazkowych inaczej nie daloby sie odroznic od nierozpocztych.
 */
export const MARKER_ZAKONCZENIA = "__zakonczono";

export type TypPozycji = "pojedynczy" | "lej" | "kolejnosc" | "progi";

export interface OpcjaWyboru {
  kod: string;
  etykieta: string;
  /** Druga linia pod etykieta. Zdanie wyjasniajace, nie druga nazwa. */
  podpis?: string;
  /** Klucz znaku kategorii, np. "a1-7". Ilustrujemy kategorie, nie pozycje. */
  ikona?: string;
  /**
   * Kafel na dwie kolumny siatki.
   *
   * Dla wyjscia z pytania, ktore stoi na koncu dlugiej listy przedmiotow.
   * Bez kadru i w jednej kolumnie czyta sie tam jak karta, ktorej zabraklo
   * zdjecia; na dwoch kolumnach widac, ze to inny rodzaj odpowiedzi.
   */
  szeroka?: boolean;
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
  /**
   * Odpowiedzi jako karty z kadrem 16:9 nad tekstem, w siatce.
   *
   * Domyslnie opcje sa wierszami. Kadr wlacza sie tam, gdzie obraz niesie
   * tresc, a nie ozdobe. Pusty kadr jest poprawnym stanem, dopoki nie ma
   * pliku ilustracji.
   */
  uklad?: "karty";
  opcjonalna?: boolean;
  /** tekst: wieksze pole. */
  duze?: boolean;
  /** Pozycja pokazywana tylko przy okreslonej odpowiedzi na inna pozycje. */
  warunek?: { pozycja: string; wartosci: string[] };
  /**
   * lej: ile najwyzej mozna zaznaczyc na tym etapie.
   *
   * Limit jest twardy, a nie podpowiedzia. Cala wartosc leja bierze sie stad,
   * ze na kazdym etapie trzeba cos odpuscic: uczestnik, ktory zaznacza
   * czterdziesci tematow, nie powiedzial nic.
   */
  limit?: number;
  /**
   * kolejnosc: ile pozycji uczestnik ustawia. Dzis zawsze piec.
   *
   * Osobne pole od limitu leja: limit mowi, ile najwyzej wolno zaznaczyc,
   * a to ile pozycji trzeba ustawic w kolejnosci.
   */
  ile?: number;
  /**
   * progi: odpowiedzi wstepne modulu `F`, wbudowane na serwerze.
   *
   * Panel musi znac miasto i liczbe osob, zeby liczyc sume w trakcie
   * wypelniania. Odpowiedzi wstepne padaja w czesci A, panel stoi w czesci B,
   * wiec przy budowaniu czesci B sa juz w bazie.
   */
  wejscieBudzetu?: Record<string, string>;
}

export interface Ekran {
  klucz: string;
  /** Znak kategorii dla całego ekranu. */
  ikona?: string;
  /** To samo pytanie od drugiej strony. Zachęta, nie kolejne pole. */
  odwrotnie?: string;
  /** Klucz kategorii tylko dla koloru, bez ilustracji. */
  kolor?: string;
  /**
   * Klucz ilustracji na pas nad odpowiedziami, gdy ma byc inna niz znak
   * kategorii. Gdy pliku nie ma, pas cofa sie do znaku kategorii, a gdy i tego
   * nie ma, nie rysuje sie wcale.
   */
  obraz?: string;
  typ: "wstep" | "pozycje" | "przerwa" | "koniec";
  /** Nadpis nad tytulem ekranu. Bez niego stoi tam nazwa modulu. */
  etykieta?: string;
  /** Zdanie odreczne pod ekranem, gdy ma byc inne niz staly dopisek modulu. */
  dopisek?: string;
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
