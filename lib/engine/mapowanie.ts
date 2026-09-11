/**
 * Odwzorowanie kodow kart zawodow na wyniki modulow diagnostycznych.
 *
 * Karty maja wlasny, bogatszy slownik niz moduly: 24 kody A1 wobec 24 obszarow,
 * 33 kody A2 wobec 30 kompetencji, 24 bieguny A3 wobec 12 wymiarow, 41 kodow A5
 * wobec 32 pozycji. Ten plik jest jedynym miejscem, w ktorym te dwa swiaty sie
 * spotykaja.
 *
 * `null` oznacza kod karty, ktory nie ma odpowiednika po stronie modulu.
 * Taki kod nigdy nie trafia - nie da sie go potwierdzic ani zaprzeczyc
 * odpowiedziami uczestnika. Lista takich kodow jest w raporcie z fazy 2
 * i w DECYZJE.md, bo to sa miejsca, w ktorych karty wiedza wiecej niz
 * assessment potrafi zapytac.
 */

/** Kod A1 z karty -> numer obszaru zainteresowan (1-24). */
export const A1_KARTA_NA_MODUL: Record<string, number> = {
  naprawianie: 1,
  rece: 2,
  przyroda: 3,
  ruch: 4,
  tech: 5,
  dociekanie: 6,
  zdrowie: 7,
  liczby: 8,
  obraz: 9,
  pisanie: 10,
  dzwiek: 11,
  scena: 12,
  opieka: 13,
  uczenie: 14,
  rozmowa: 15,
  wspolnota: 16,
  przekonywanie: 17,
  prowadzenie: 18,
  przedsiebiorczosc: 19,
  prawo: 20,
  porzadek: 21,
  precyzja: 22,
  pieniadze: 23,
  planowanie: 24,
};

/**
 * Kod A2 z karty -> numer kompetencji (1-30).
 *
 * `opiekunczosc` i `cierpliwosc` wskazuja te sama kompetencje nr 17
 * ("Cierpliwosc i opiekunczosc"), ktora karty rozbily na dwa kody.
 * `konfrontacja` i `zespol` nie sa kompetencjami A2 - to bieguny stylu.
 * Wystepuja wylacznie w polu wspierajacym, ktore nie wchodzi do mnoznika.
 */
export const A2_KARTA_NA_MODUL: Record<string, number | null> = {
  problemy: 1,
  analiza: 2,
  rachunki: 3,
  system: 4,
  reguly: 5,
  uczenie_sie: 6,
  zapamietywanie: 7,
  tworzenie: 8,
  estetyka: 9,
  przestrzenna: 10,
  slowo: 11,
  wyjasnianie: 12,
  wystapienia: 13,
  przekonywanie: 14,
  negocjowanie: 15,
  wyczuwanie: 16,
  opiekunczosc: 17,
  cierpliwosc: 17,
  rozbrajanie: 18,
  uprzejmosc: 19,
  prowadzenie_grupy: 20,
  organizowanie: 21,
  dokladnosc: 22,
  wytrwalosc: 23,
  wielozadaniowosc: 24,
  samodzielnosc: 25,
  manualne: 26,
  sprzet: 27,
  wytrzymalosc: 28,
  opanowanie: 29,
  odpornosc: 30,
  konfrontacja: null,
  zespol: null,
};

/**
 * Biegun stylu z karty -> wymiar A3 i biegun.
 *
 * Dwa wymiary modulu A3 nie maja odpowiednika w kartach: NAP (naped wlasny
 * kontra zewnetrzny) i RYT (rowne tempo kontra zrywy). Trzy kody kart nie maja
 * odpowiednika w module: `rzecz`, `efekt_widoczny`, `efekt_odroczony` - to nie
 * sa wymiary stylu, tylko cechy pracy.
 */
export const A3_KARTA_NA_MODUL: Record<string, string | null> = {
  struktura: "STR:A",
  elastycznosc: "STR:B",
  cisza: "OTO:A",
  bodzce: "OTO:B",
  glebia: "GLE:A",
  szerokosc: "GLE:B",
  samodzielnie: "SAM:A",
  ludzie: "SAM:B",
  zespol: "SAM:B",
  tempo: "TEM:A",
  dokladnosc: "TEM:B",
  inicjatywa: "INI:A",
  reagowanie: "INI:B",
  konfrontacja: "KON:A",
  zgoda: "KON:B",
  ryzyko: "RYZ:A",
  bezpieczenstwo: "RYZ:B",
  wlasne_pomysly: "DEC:A",
  gotowe: "DEC:B",
  zmiennosc: "NOW:A",
  powtarzalnosc: "NOW:B",
  efekt_widoczny: "EFE:A",
  efekt_odroczony: "EFE:B",
  // `rzeczy` nie jest stylem dzialania, tylko przedmiotem pracy. Osi dla niego
  // nie ma i nie powinno byc: to nalezy do zainteresowan A1, nie do A3.
  rzeczy: null,
};

/**
 * Kod wartosci z karty -> kod wartosci A4.
 *
 * Karty maja 16 kodow, modul 12 wartosci. `bezposrednio` odwzorowuja sie 12,
 * `bezpieczenstwo` wskazuje te sama wartosc co `stabilnosc` ("Stabilnosc
 * i bezpieczenstwo"). `wspolnota`, `cisza` i `efekt_widoczny` nie sa
 * wartosciami w rozumieniu A4.
 *
 * Pola A4 kart nie wchodza do mnoznika kartowego - sluza wylacznie
 * wyjasnieniom w raporcie.
 */
export const A4_KARTA_NA_MODUL: Record<string, string | null> = {
  pieniadze: "PIE",
  stabilnosc: "STA",
  bezpieczenstwo: "STA",
  wolnosc: "WOL",
  rozwoj: "ROZ",
  wplyw: "WPL",
  sens: "SEN",
  uznanie: "UZN",
  relacje: "REL",
  czas_dla_siebie: "CZA",
  mistrzostwo: "MIS",
  zmiennosc: "ZMI",
  zasady: "ZAS",
  wspolnota: null,
  cisza: null,
  efekt_widoczny: null,
};

/**
 * Wymog gotowosci z karty -> pozycja modulu A5.
 *
 * Dwanascie kodow kart nie ma pozycji w module: uczestnik nigdy nie jest o nie
 * pytany, wiec nie moga ani zawetowac zawodu, ani go obnizyc. To jest realna
 * dziura w rozdzielczosci systemu, opisana w raporcie z fazy 2.
 */
export const A5_KARTA_NA_MODUL: Record<string, string | null> = {
  dlugie_studia: "F01",
  studia: "F02",
  egzaminy: "F03",
  doksztalcanie: "F04",
  przeprowadzka: "F06",
  zagranica: "F07",
  wyjazdy: "F09",
  weekendy: "F11",
  zmiany: "F12",
  noce: "F12",
  dyzury: "F13",
  nadgodziny: "F14",
  nieregularne: "F15",
  fizyczna: "F16",
  dzwiganie: "F16",
  kazda_pogoda: "F17",
  stanie: "F18",
  komputer: "F19",
  brud: "F20",
  krew: "F21",
  ludzie_ciagle: "F22",
  dzieci: "F23",
  chorzy: "F24",
  roszczeniowi: "F25",
  wystapienia: "F26",
  samotnosc: "F27",
  niepewny_dochod: "F28",
  wlasna_dzialalnosc: "F29",
  ryzyko_finansowe: "F30",
  odpowiedzialnosc: "F31",
  presja: "F32",
  // Dolozone po fazie 5 razem z jedenastoma nowymi pozycjami modulu.
  halas: "F33",
  umieranie: "F34",
  agresja: "F35",
  ciasnota: "F36",
  wysokosc: "F37",
  chemikalia: "F38",
  wieczory: "F39",
  // Bez pozycji w module A5. `zimno` nie wystepuje w zadnej karcie, wiec
  // zostawiamy wpis tylko po to, zeby import nie milczal, gdy sie pojawi.
  goraco: null,
  powtarzalnosc: null,
  zimno: null,
};

/** Parametr ksztaltu zycia z karty -> wymiar M1 i biegun. */
export const M1_KARTA_NA_MODUL: Record<string, string> = {
  osiadlosc: "KOR:A",
  mobilnosc: "KOR:B",
  duza_organizacja: "ORG:A",
  maly_zespol: "ORG:B",
  wlasne: "ORG:B",
  stacjonarna: "MIE:A",
  zdalna: "MIE:B",
  duzo_godzin: "GOD:A",
  mniej_godzin: "GOD:B",
  przenika: "GRA:A",
  granica_ostra: "GRA:B",
  szybkie_wejscie: "INW:A",
  dluga_inwestycja: "INW:B",
  wysoki_poziom_zycia: "POZ:A",
  prowadzenie: "LUD:A",
};

/** Kolejnosc poziomow wejscia. Uzywana do kary za rozjazd w etapie C. */
export const RANGA_POZIOMU: Record<string, number> = {
  szybki: 0,
  sredni: 1,
  dlugi: 2,
  bardzo_dlugi: 3,
};

/** Kolejnosc zagrozenia przyszlosciowego. Pierwszy tie-breaker warstwy drugiej. */
export const RANGA_ZAGROZENIA: Record<string, number> = {
  bardzo_niskie: 0,
  niskie: 1,
  umiarkowane: 2,
  wysokie: 3,
  bardzo_wysokie: 4,
};

/** Kolejnosc kosztu wejscia. Drugi tie-breaker warstwy drugiej. */
export const RANGA_KOSZTU: Record<string, number> = {
  zerowy: 0,
  bardzo_niski: 1,
  niski: 2,
  sredni: 3,
  wysoki: 4,
  bardzo_wysoki: 5,
};
