/** Zawartosc raportu, sekcja po sekcji. Tylko to, co wolno pokazac. */

import type { SensStudiow } from "../engine/typy";

export interface PozycjaOpisowa {
  tytul: string;
  opis?: string;
  dopisek?: string;
}

export interface OsStylu {
  kod: string;
  biegunA: string;
  biegunB: string;
  polozenie: number;
  wyrazista: boolean;
  opis: string;
}

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
  poziom: string;
  studia: string;
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

export interface PozycjaZawodowa {
  typ: "zawod" | "klaster";
  kod: string;
  nazwa: string;
  pasmo: string;
  pasmoOpis: string;
  zawody: ZawodWRaporcie[];
  pytanieRozstrzygajace?: string;
  roznica?: string;
  uwaga?: string | null;
}

export interface DrogaWRaporcie {
  etykieta: "A" | "B" | "C";
  obszar: string;
  poziom: string;
  przyklad: string;
  czas: string;
  zawody: Array<{ kod: string; nazwa: string }>;
  kierunki: string[];
  /** Kompetencje wymagane przez ten obszar, w ktorych uczestnik ma najnizej. */
  umiejetnosci: string[];
  /**
   * Droga C zbudowana jako inny poziom wejscia w obszarze A albo B.
   * Wtedy „cos zupelnie innego" byloby nieprawda.
   */
  tenSamObszar?: boolean;
}

export interface Raport {
  imie: string;
  dataWygenerowania: string;
  stopka: string;
  pewnosc: string;

  punkt_startu?: {
    gdzieJestes: string;
    coCiIdzie: string[];
    coJuzRobiles: string[];
    skadStartujesz: string;
    coToOtwiera: string[];
    oCzymWartoWiedziec: string[];
  };

  co_mnie_interesuje?: {
    zdanie: string;
    gora: Array<PozycjaOpisowa & { coZmienia: string; nieProbowal: boolean }>;
    dol: PozycjaOpisowa[];
    osie: string;
  };

  czego_nie_sprawdzilem?: { podpis: string; pozycje: string[] };

  jak_dzialam?: { osie: OsStylu[]; zdanie: string };

  srodowisko?: { warunki: string[]; komunikatGdyPusto: string | null };

  w_czym_dobry?: {
    zdanie: string;
    mocne: Array<PozycjaOpisowa & { dowody: number }>;
    slabsze: PozycjaOpisowa[];
    ramka: string;
  };

  lubie_a_wychodzi?: {
    mocneDrogi: PozycjaOpisowa[];
    ukryteAtuty: PozycjaOpisowa[];
    doZbudowania: PozycjaOpisowa[];
    komunikaty: Record<string, string>;
  };

  wartosci?: {
    gora: PozycjaOpisowa[];
    dol: PozycjaOpisowa[];
    progowe: string[];
    testKosztu: string;
  };

  ksztalt_zycia?: { parametry: Array<{ wymiar: string; opis: string }>; zdanie: string };

  wizja_zycia?: { obszary: Array<{ tytul: string; tresc: string[] }> };

  czego_nie_chce?: { zdania: string[]; weta: string[] };

  na_co_gotow?: { tak: string[]; moze: string[]; nie: string[]; podpisMoze: string };

  obszary?: {
    pozycje: Array<{
      nazwa: string;
      pasmo: string;
      pasmoOpis: string;
      poziom: string;
      przyklad: string;
      czas: string;
      dlaczego: string[];
      przeszkadza: string[];
    }>;
    profilNieostry: boolean;
    komunikatNieostry: string | null;
  };

  profil_w_jednym_ekranie?: { zdania: string[] };

  zawody?: {
    pozycje: PozycjaZawodowa[];
    wynikiWstepne: boolean;
    /**
     * Zawody dopisane przez prowadzacego podczas sesji. Osobna lista, zeby
     * uczestnik wiedzial, co powiedzial mu algorytm, a co czlowiek.
     */
    odProwadzacego: Array<{ kod: string; nazwa: string; uzasadnienie: string | null }>;
  };

  kierunki?: {
    sensStudiow: SensStudiow;
    komunikat: string;
    drogiBezStudiowPierwsze: boolean;
    kierunki: Array<{
      kod: string;
      nazwa: string;
      pasmo: string;
      prowadziDo: string[];
      rekrutacja: string;
      twojaSytuacja: string;
      coSieRobi: string;
      czegoNieDaje: string | null;
      ostrzezenia: string[];
    }>;
    drogiBezStudiow: Array<{
      nazwa: string;
      typ: string;
      czas: string;
      koszt: string;
      prowadziDo: string[];
      wymagania: string;
    }>;
    kierunekToNieZawod: string;
  };

  umiejetnosci?: { pozycje: PozycjaOpisowa[] };

  /** `pierwszyKrok` wynika z etapu edukacji, nie z drogi - stad raz na sekcje. */
  trzy_drogi?: {
    drogi: DrogaWRaporcie[];
    flagi: string[];
    pierwszyKrok: string;
    /** Prowadzacy zmienil kolejnosc drog po rozmowie. */
    kolejnoscOdProwadzacego: boolean;
  };

  czego_unikac?: { pozycje: Array<{ nazwa: string; komunikat: string }> };

  moja_decyzja?: { tresc: string | null };
  pierwsze_kroki?: { kroki: string[] };
  notatka?: { tresc: string | null };
}
