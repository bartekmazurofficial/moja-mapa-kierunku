/**
 * Ksztalt zawodu na liscie kart.
 *
 * Wspolny dla raportu i strony „Zawody", bo to ta sama karta w dwoch
 * miejscach. Pola slownikowe (`poziom`, `studia`, `koszt`, `zagrozenie`)
 * pochodza wprost z bazy zawodow i sa tam nietkniete.
 */

export interface ZawodWRaporcie {
  kod: string;
  nazwa: string;
  pasmo: string;
  pasmoOpis: string;
  obszar: string;
  /** Numer obszaru: po nim grupuje sie lista kart, nazwa nie jest kluczem. */
  obszarId: number;
  /** Jedna z osmiu rodzin obszarow, do naglowka grupy. */
  grupaObszaru: string;
  /** Klucz znaku A1 obszaru (`a1-7`): stad kolor naglowka grupy i ilustracja. */
  znakObszaru: string | null;
  poziom: string;
  studia: string;
  /** Slownikowe wartosci z bazy zawodow: koszt wejscia i zagrozenie w przyszlosci. */
  koszt: string;
  zagrozenie: string;
  /** Litera drogi z warstwy pierwszej, przypisana przez obszar zawodu. */
  droga: "A" | "B" | "C" | null;
  /** Czy uczestnik ma juz karte tego zawodu w klastrze z innym zawodem. */
  klasterKod: string | null;
  /** Trzy zdania: co Cie ciagnie, co masz, co moze przeszkadzac. */
  uzasadnienie: string[];
  flagi: { trampolina: boolean; zagrozony: boolean; barieraKosztowa: boolean; zdanieKierunkowe: string | null };
  ostrzezenia: string[];
  zGwarancji: string | null;
  maPelnaKarte: boolean;
}