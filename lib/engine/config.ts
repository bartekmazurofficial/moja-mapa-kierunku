/**
 * WSZYSTKIE LICZBY DECYZYJNE SILNIKA W JEDNYM MIEJSCU.
 *
 * Zasada: jesli jakas liczba wplywa na wynik, stoi tutaj, a nie w kodzie
 * silnika. Prowadzacy, ktory po pilotazu chce cos poprawic, zmienia liczbe,
 * nie logike.
 *
 * Rekomendacja z warstwy pierwszej: nie dostrajac niczego przed pilotazem.
 * Po pilotazu zmieniac po jednej liczbie naraz i sprawdzac, co sie dzieje
 * z trzema profilami kontrolnymi (tests/silnik-profile.test.ts).
 */

// =====================================================================
// WARSTWA 1: CZTERY LICZBY DECYZYJNE
// =====================================================================

export const WARSTWA1 = {
  /**
   * 1. Sufit bonusu kompetencyjnego.
   * Ile maksymalnie kompetencje moga podniesc obszar.
   * W GORE, jesli program ma kłasc wiekszy nacisk na to, w czym ktos juz
   * jest dobry. Ta liczba wyraza stosunek programu do pytania: czy liczy sie
   * bardziej to, co mnie ciagnie, czy to, w czym jestem dobry.
   */
  SUFIT_BONUSU: 15,

  /**
   * 2. Rozpietosc mnoznika zgodnosci (wartosci A4 + ksztalt zycia M1).
   * Jak mocno wartosci i wizja zycia przestawiaja ranking.
   * POSZERZYC, jesli uczestnicy skarza sie, ze rekomendacje nie pasuja do
   * ich zycia.
   */
  MNOZNIK_MIN: 0.65,
  MNOZNIK_MAX: 1.15,

  /**
   * 3. Prog jakosci Drogi B, jako ulamek wyniku Drogi A.
   * Jak slaba moze byc druga droga. W GORE, jesli Droga B bywa nieprzekonujaca.
   */
  PROG_DROGI_B: 0.55,

  /**
   * 4. Prog jakosci Drogi C, jako ulamek wyniku Drogi A.
   * Jak slaba moze byc alternatywa. W GORE, jesli Droga C bywa nierealna.
   */
  PROG_DROGI_C: 0.4,

  /**
   * Prog absolutny Drogi C, w punktach.
   * Specyfikacja mowi "wynik >= 0,40 x wynik(A) ORAZ >= 42 punktow".
   * Prototyp silnik.py tego drugiego warunku nie implementuje i dlatego
   * przebieg na sucho profilu spolecznego daje jako Droge C administracje
   * z wynikiem 40,6, czyli pozycje z pasma antydopasowania.
   * Trzymamy sie specyfikacji: alternatywa nie moze byc antydopasowaniem.
   * Ustawienie 0 przywraca zachowanie prototypu.
   */
  PROG_DROGI_C_ABSOLUTNY: 42,
} as const;

/**
 * Liczby dziedziczone z modulow, NIEPODLEGAJACE dostrajaniu tutaj.
 * Zmiana ktorejkolwiek jest zmiana w module, nie w silniku.
 */
export const DZIEDZICZONE = {
  /** Prog wymagania, od ktorego weto usuwa obszar albo zawod. Z bazy obszarow. */
  PROG_WETA: 0.6,
  /** Sufit kary filtrowej. Z modulu A5. Nawet komplet niezgodnosci nie zeruje. */
  SUFIT_KARY_FILTROWEJ: 0.5,
  /** Maksymalna liczba wet. Z modulu A5, egzekwowana takze w interfejsie. */
  MAKS_WET: 3,
} as const;

/** Powyzej tego podobienstwa dwie drogi to "ten sam swiat, inne drzwi". */
export const PROG_BLISKOSCI = 0.6;

/** Pasma opisowe warstwy pierwszej. Uczestnik nigdy nie widzi liczby. */
export const PASMA_OBSZAROW = [
  { od: 85, kod: "bardzo_mocne", opis: "bardzo mocne dopasowanie" },
  { od: 70, kod: "mocne", opis: "mocne dopasowanie" },
  { od: 55, kod: "dobre", opis: "dobre dopasowanie" },
  { od: 42, kod: "umiarkowane", opis: "umiarkowane dopasowanie" },
  { od: -Infinity, kod: "antydopasowanie", opis: "antydopasowanie" },
] as const;

// =====================================================================
// WARSTWA 2: CZTERY LICZBY DECYZYJNE
// =====================================================================

export const WARSTWA2 = {
  /**
   * 1. Dolna granica mnoznika kartowego.
   * Jak mocno karta moze obnizyc zawod z dobrego obszaru.
   * ZMIENIC, gdy zawody w jednym obszarze nie odrozniaja sie w wynikach.
   * Historia: pierwszy przebieg mial 0,80 i fryzjer dostawal 81,7 punktu
   * u profilu czysto technicznego, bo dziedziczyl wynik obszaru.
   */
  MNOZNIK_MIN: 0.55,

  /**
   * 2. Gorna granica mnoznika kartowego.
   * Jak mocno karta moze wyniesc zawod z gorszego obszaru.
   * ZMIENIC, gdy ranking obszarowy przestaje miec znaczenie.
   */
  MNOZNIK_MAX: 1.15,

  /**
   * 3. Prog remisu, w punktach po normalizacji.
   * Ponizej tej roznicy rozstrzyga bezpieczenstwo, nie punkty.
   * ZMIENIC, gdy tie-breaker dziala zbyt czesto albo zbyt rzadko.
   */
  PROG_REMISU: 3,

  /**
   * 4. Prog pokazania zawodu w raporcie.
   * ZMIENIC, gdy uczestnicy dostaja za malo albo za duzo pozycji.
   */
  PROG_POKAZANIA: 55,
} as const;

/** Wagi skladowych mnoznika kartowego. Z rozdzialu 3 warstwy drugiej. */
export const WAGI_KARTOWE = { a1: 0.45, a2: 0.35, a3: 0.2 } as const;

/** Kara za odrzucenie wymogu gotowosci, ktorego uczestnik nie zawetowal. */
export const KARA_ODRZUCENIA = { za_sztuke: 0.05, sufit: 0.15 } as const;

/** Kara za rozjazd poziomu wejscia: 5% za kazdy stopien w gore. */
export const KARA_ZA_POZIOM = 0.05;

/** Bariera kosztowa. Lagodna celowo: sa stypendia i dofinansowania. */
export const BARIERA_KOSZTOWA = {
  brak_zasobow_koszt_wysoki: 0.1,
  ograniczone_zasoby_koszt_bardzo_wysoki: 0.05,
} as const;

/** Gwarancje reprezentacji z etapu H. */
export const GWARANCJE = {
  MIN_BEZ_STUDIOW: 3,
  MIN_SZYBKIE_WEJSCIE: 2,
} as const;

/** Pasma opisowe warstwy drugiej, po normalizacji do 100. */
export const PASMA_ZAWODOW = [
  { od: 85, kod: "bardzo_mocne", opis: "To bardzo mocno do Ciebie pasuje" },
  { od: 70, kod: "mocne", opis: "To dobrze do Ciebie pasuje" },
  { od: 55, kod: "warte_rozwazenia", opis: "To warto rozważyć" },
  { od: -Infinity, kod: "ponizej_progu", opis: "" },
] as const;

// =====================================================================
// WARSTWA 3: KIERUNKI
// =====================================================================

export const WARSTWA3 = {
  /**
   * Waga zawodow posrednich przy liczeniu wyniku kierunku.
   * Celowo niska: szerokosc nie jest zaleta, gdy uczestnik ma wyrazny profil.
   */
  WAGA_POSREDNICH: 0.4,

  /** Ilu zawodow z czolowki uzywamy do pytania "czy studia sa potrzebne". */
  TOP_DO_PYTANIA_O_STUDIA: 15,

  /** Progi udzialu zawodow wymagajacych studiow, etap K5. */
  PROGI_SENSU_STUDIOW: { warunek: 0.7, czesc_drog: 0.4, jedna_z_opcji: 0.15 },

  /** Ponizej tego udzialu lista drog bez studiow idzie PRZED kierunkami. */
  PROG_ODWROCENIA_KOLEJNOSCI: 0.4,

  /** Etap K2: przedmiot wymagany wskazany jako trudny. */
  KARA_PRZEDMIOT_TRUDNY: 0.25,
  /** Etap K2: matematyka jako najwiekszy problem, kierunek scisly. */
  KARA_MATEMATYKA: 0.35,
  /** Etap K2: przedmiot wymagany wskazany jako mocny. Wzmocnienie, tylko w gore. */
  WZMOCNIENIE_PRZEDMIOT_MOCNY: 0.15,

  /** Etap K4: kierunek tylko w duzych miastach, mobilnosc "wolalbym nie". */
  KARA_GEOGRAFICZNA: 0.15,

  /** Etap K6: ponizej tego odsetka absolwentow w zawodzie dopinamy ostrzezenie. */
  PROG_OSTRZEZENIA_O_ODSETKU: 40,

  /**
   * Sufit lacznej kary rekrutacyjnej z etapow K2 i K3.
   * K2 mowi "ten przedmiot jest dla Ciebie trudny", K3 mowi "na ten kierunek
   * jest ciezko sie dostac". Zlozenie jest uzasadnione, ale bez sufitu daje
   * 55% w dol z jednego powodu i grzebie kierunek.
   * Kierunek wymagajacy ma zjechac w rankingu, ale ZOSTAC WIDOCZNY:
   * siedemnastolatek, ktoremu matematyka idzie zle, ma zobaczyc, ze
   * informatyka jest trudna droga, a nie ze informatyki nie ma na liscie.
   * Do strojenia po pilotazu.
   */
  MAX_KARA_REKRUTACYJNA: 0.4,
} as const;

/** Etap K3: mnoznik dostepu. Karzemy tylko wtedy, gdy przedmiot wymagany jest trudny. */
export const MNOZNIK_DOSTEPU: Record<string, { mocne: number; trudne: number }> = {
  bardzo_wysoka: { mocne: 1.0, trudne: 0.6 },
  wysoka: { mocne: 1.0, trudne: 0.75 },
  srednia: { mocne: 1.0, trudne: 0.9 },
  niska: { mocne: 1.0, trudne: 1.0 },
  wszyscy: { mocne: 1.0, trudne: 1.0 },
};

// =====================================================================
// WARSTWA 0: PUNKT STARTU
// =====================================================================

export const WARSTWA0 = {
  /** Filtr miekki: brak zasobow i wysoki koszt wejscia. */
  KARA_BRAK_ZASOBOW: 0.1,
  /** Filtr miekki: mobilnosc "wolalbym nie" i zawod wymagajacy duzego miasta. */
  KARA_MOBILNOSC: 0.15,
  /** Wzmocnienie, wylacznie w gore: doswiadczenie pokrywajace sie z zawodem. */
  WZMOCNIENIE_DOSWIADCZENIE: 0.1,
  /** Wzmocnienie, wylacznie w gore: konkursy i olimpiady w dziedzinie zawodu. */
  WZMOCNIENIE_KONKURSY: 0.1,
  /**
   * Wzmocnienie za prace w warsztacie albo pracowni wskazana jako mocna strona.
   * Uczestnik mowi wtedy rzecz konkretna: ma sprawnosc manualna potwierdzona
   * doswiadczeniem, a nie deklaracja. W przedmiotach trudnych nie robi nic -
   * nie karzemy nikogo za to, ze nie mial warsztatu w szkole.
   */
  WZMOCNIENIE_WARSZTAT: 0.1,
} as const;

/** Obszary, dla ktorych praca w warsztacie jest realnym sygnalem. */
export const OBSZARY_WARSZTATOWE = new Set([10, 12, 13]);

// =====================================================================
// WYPROWADZANIE PROFILU UCZESTNIKA Z WYNIKOW MODULOW
//
// PIATA GRUPA LICZB, SPOZA ORYGINALNEJ SPECYFIKACJI.
//
// Warstwa druga porownuje ZBIORY kodow: "zainteresowania uczestnika przeciete
// z A1 wysoko w karcie". Karta ma zbior, uczestnik ma 24 liczby 0-100.
// Specyfikacja nie mowi, gdzie przebiega granica "wysoko". Te progi ja
// ustawiaja i realnie decyduja o wynikach, wiec stoja tutaj, nie w kodzie.
//
// Limit gorny jest rownie wazny jak prog: karty maja 2-4 kody A1 i 3 kody A2.
// Uczestnik, ktory przekroczy prog w dwunastu obszarach, mialby sztucznie
// wysokie pokrycie u wszystkich zawodow naraz i mnoznik przestalby roznicowac.
// =====================================================================

export const PROGI_PROFILU = {
  /** Zainteresowanie liczy sie jako "wysokie" powyzej tego wyniku. */
  A1_PROG: 60,
  A1_MAKS: 6,
  /** Kompetencja liczy sie jako mocna powyzej tego wyniku. */
  A2_PROG: 60,
  A2_MAKS: 8,
  /** Biegun stylu liczy sie, gdy jest warunkiem kluczowym (sila z modulu A3). */
  A3_PROG_SILY: 65,
  A3_MAKS: 5,
} as const;

// =====================================================================
// DEGRADACJA PRZY SLABYCH DANYCH
//
// Silnik musi wiedziec, kiedy nie wie. Zasada nadrzedna: system nigdy nie
// mowi mlodemu czlowiekowi, ze nic do niego nie pasuje.
// =====================================================================

export const DEGRADACJA = {
  /** A1: max(Z) - min(Z) ponizej tego progu to profil plaski. Bez rankingu obszarow. */
  A1_PROFIL_PLASKI: 18,
  /**
   * Druga regula profilu nieostrego, dopisana po fazie piatej.
   * Pierwsza mierzy rozstep na WEJSCIU i lapie osoby, ktore odpowiadaly bez
   * roznicowania. Ta mierzy rozstep na WYJSCIU: roznice miedzy pierwszym
   * a piatym obszarem. Lapie osoby, ktore odpowiadaly normalnie, ale ich
   * profil rozklada sie rownomiernie na wszystko.
   *
   * Piaty, nie ostatni, bo do raportu trafia czolowka. Dwanascie punktow, bo
   * pasma opisowe maja okolo pietnastu: jesli piec pierwszych obszarow miesci
   * sie w mniej niz jednym pasmie, nie ma podstaw mowic o pierwszym miejscu.
   *
   * Do strojenia po pilotazu.
   */
  PROFIL_ROZSTEP_CZOLOWKI: 12,
  /** A2: max(K) - min(K) ponizej tego progu to profil plaski. */
  A2_PROFIL_PLASKI: 18,
  /** A5: liczba odpowiedzi NIE, powyzej ktorej wylaczamy filtry calkowicie. */
  A5_WSKAZNIK_ZAMKNIECIA: 20,
  /** A2: suma dowodow, ponizej ktorej wylaczamy bonus kompetencyjny. */
  A2_WSKAZNIK_OKAZJI: 8,
  /** Warstwa 2: gdy mniej niz tyle zawodow przekracza prog, obnizamy prog. */
  MIN_ZAWODOW: 5,
  /** Obnizony prog pokazania. Wyniki oznaczone jako wstepne. */
  PROG_POKAZANIA_OBNIZONY: 45,
  /** Ile antydopasowan pokazac. Dluzsza lista brzmi jak wyrok. */
  MAKS_ANTYDOPASOWAN: 3,
  /** Ile obszarow pokazac zawsze, takze przy profilu plaskim. */
  MIN_OBSZAROW_W_RAPORCIE: 5,
} as const;

// =====================================================================
// PANEL: OSTRZEZENIE O TEMPIE WYPELNIANIA
// =====================================================================

/**
 * Prog bezwzgledny (polowa czasu ze scenariusza) nigdy nie bedzie dobry:
 * tempo zalezy od modulu, urzadzenia i szybkosci czytania. Porownujemy wiec
 * uczestnika z jego wlasna grupa na tym samym module.
 *
 * Do strojenia po pilotazu.
 */
export const TEMPO = {
  /** Ponizej tylu procent mediany grupy zapala sie ostrzezenie. */
  UDZIAL_MEDIANY: 0.4,
  /** Ponizej tylu ukonczen mediana nie ma sensu i ostrzezenia nie liczymy. */
  MIN_UKONCZEN: 5,
  /** Ostrzezenie u polowy grupy przestaje byc ostrzezeniem. */
  MAKS_OFLAGOWANYCH: 2,
} as const;

/** Wersja silnika. Zmieniac przy kazdej zmianie logiki albo liczb powyzej. */
export const WERSJA_SILNIKA = "1.0";
