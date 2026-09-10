/** Typy domenowe. Postac, w jakiej dane opuszczaja warstwe bazy i wchodza do silnika. */

import type { PoziomWejscia, WarunekSrodowiska } from "../../scripts/parse-obszary";

export type { PoziomWejscia, WarunekSrodowiska };

export interface Obszar {
  id: number;
  nazwa: string;
  grupa: string;
  /** Obszar 27 nigdy nie pojawia sie samodzielnie, zawsze w parze z branza. */
  szczegolny: boolean;
  wariantWlasny: boolean;
  /** id obszaru zainteresowan A1 -> waga 1|2|3 */
  zainteresowania: Record<string, number>;
  /** id kompetencji A2 -> waga 1|2|3 */
  kompetencje: Record<string, number>;
  wartosciPlus: string[];
  wartosciMinus: string[];
  /** kod filtru A5 -> wymaganie 0.00-1.00 */
  filtry: Record<string, number>;
  /** wymiar M1 -> biegun "A" | "B" */
  zycie: Record<string, string>;
  srodowisko: WarunekSrodowiska[];
  trudne: string[];
  poziomy: PoziomWejscia[];
  /** id obszaru -> podobienstwo 0.00-1.00 */
  sasiedztwo: Record<string, number>;
  przykladoweZawody: string;
  kierunkiStudiow: string;
  drogaBezStudiow: string;
}

/** 24 pola karty zawodu. */
export interface Zawod {
  kod: string;
  nazwa: string;
  obszar: number;
  poziom: string;
  studia: string;
  a1: string[];
  a2r: string[];
  a2w: string[];
  a3: string[];
  a4p: string[];
  a4m: string[];
  a5: string[];
  m1: string[];
  anty: string[];
  koszt: string;
  flaga: string;
  zagr: string;
  kier: string | null;
  klaster: string | null;
  duzeMiasto: boolean;
  teren: boolean;
  przeciw: string[];
  przedm: string[];
  dosw: string[];
}

export interface Kierunek {
  kod: string;
  nazwa: string;
  typ: string;
  poziom: string;
  lata: number;
  wymagane: string[];
  punktowane: string[];
  trudnosc: string;
  bezposrednie: string[];
  posrednie: string[];
  odsetek: number | null;
  gdzie: string;
  robi: string;
  nieDaje: string | null;
  alternatywaBezStudiow: boolean;
}

export interface DrogaBezStudiow {
  kod: string;
  nazwa: string;
  typ: string;
  czas: string;
  koszt: string;
  zawody: string[];
  wymagania: string;
}

export interface Klaster {
  kod: string;
  nazwa: string;
  sklad: string[];
  pytanie: string;
  roznica: string;
  uwaga: string | null;
}

/** Komplet danych referencyjnych. Silnik dostaje to jako czysty argument. */
export interface BazaReferencyjna {
  obszary: Obszar[];
  zawody: Zawod[];
  kierunki: Kierunek[];
  drogiBezStudiow: DrogaBezStudiow[];
  klastry: Klaster[];
}
