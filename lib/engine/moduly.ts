/**
 * Liczenie wynikow siedmiu modulow z surowych odpowiedzi uczestnika.
 *
 * Czyste funkcje. Wejscie: odpowiedzi w postaci, w jakiej leza w bazie.
 * Wyjscie: WynikiModulow, czyli jedyne wejscie silnika dopasowania.
 *
 * Wzory pochodza wprost ze specyfikacji modulow i maja wlasne testy
 * poprawnosci, ktore specyfikacje same podaja: suma W_raw po 24 obszarach
 * musi wynosic dokladnie 0, suma wygranych w A4 dokladnie 36.
 */

import { OBSZARY_A1, KOMPETENCJE_A2, WARTOSCI_A4, WYMIARY_A3, WYMIARY_M1 } from "../domain/slowniki";
import { BLOKI_A1 } from "../content/a1";
import { BLOKI_A2 } from "../content/a2";
import { PARY_A3 } from "../content/a3";
import { PARY_A4 } from "../content/a4";
import { PARY_M1 } from "../content/m1";
import type { PunktStartu, WynikiModulow } from "./typy";

/** Wagi miejsc w bloku. Srodkowe waza trzy razy mniej niz skrajne, celowo. */
const WAGI_RANKINGU: Record<number, number> = { 1: 1.5, 2: 0.5, 3: -0.5, 4: -1.5 };

export type Ranking = Record<string, number>;

// =====================================================================
// A1 — ZAINTERESOWANIA
// =====================================================================

export interface OdpowiedziA1 {
  /** blok -> { idPozycji: miejsce 1-4 } */
  czescA: Record<number, Ranking>;
  /** obszar 1-24 -> kotwica 1-5 */
  czescB: Record<number, number>;
  /** obszar 1-24 -> czy probowal */
  czescC: Record<number, boolean>;
}

export interface WynikA1 {
  z: Record<number, number>;
  wn: Record<number, number>;
  ekspozycja: Record<number, boolean>;
  osie: { rzeczyLudzie: number; daneIdee: number };
  rodziny: Record<string, number>;
  zroznicowanie: number;
  podniesienie: number;
  pewnosc: "wyrazny" | "umiarkowany" | "jeszcze_nieuksztaltowany";
}

export function policzA1(o: OdpowiedziA1): WynikA1 {
  const pozycjaDoObszaru = new Map<string, number>();
  for (const blok of BLOKI_A1) for (const p of blok.pozycje) pozycjaDoObszaru.set(p.id, p.obszar);

  const wRaw: Record<number, number> = {};
  for (const a of OBSZARY_A1) wRaw[a.id] = 0;
  for (const ranking of Object.values(o.czescA)) {
    for (const [id, miejsce] of Object.entries(ranking)) {
      const obszar = pozycjaDoObszaru.get(id);
      if (obszar !== undefined) wRaw[obszar] += WAGI_RANKINGU[miejsce] ?? 0;
    }
  }

  const wn: Record<number, number> = {};
  for (const a of OBSZARY_A1) wn[a.id] = ((wRaw[a.id] / 6 + 1.5) / 3) * 100;

  const kotwice = Object.values(o.czescB);
  const podniesienie = kotwice.length > 0 ? kotwice.reduce((s, x) => s + x, 0) / kotwice.length : 3;
  // Podniesienie skrajne: kotwica nic nie wnosi, licz wynik z samego rankingu.
  const kotwicaWazy = podniesienie >= 2.0 && podniesienie <= 4.3 && kotwice.length > 0;

  const z: Record<number, number> = {};
  for (const a of OBSZARY_A1) {
    const pn = (((o.czescB[a.id] ?? 3) - 1) / 4) * 100;
    z[a.id] = kotwicaWazy ? 0.7 * wn[a.id] + 0.3 * pn : wn[a.id];
  }

  const rodziny: Record<string, number> = {};
  for (const [kod, def] of Object.entries(
    Object.fromEntries(["R", "I", "A", "S", "E", "C"].map((r) => [r, OBSZARY_A1.filter((a) => a.rodzina === r)])),
  )) {
    rodziny[kod] = def.reduce((s, a) => s + z[a.id], 0) / def.length;
  }
  const f = (kod: string) => rodziny[kod] - 50;
  const osie = {
    rzeczyLudzie: (2 * f("R") + f("I") + f("C") - (f("A") + 2 * f("S") + f("E"))) / 6,
    daneIdee: (f("E") + f("C") - (f("I") + f("A"))) / 2,
  };

  const wartosci = Object.values(z);
  const zroznicowanie = Math.max(...wartosci) - Math.min(...wartosci);

  return {
    z,
    wn,
    ekspozycja: o.czescC,
    osie,
    rodziny,
    zroznicowanie,
    podniesienie,
    pewnosc:
      zroznicowanie >= 30 ? "wyrazny" : zroznicowanie >= 18 ? "umiarkowany" : "jeszcze_nieuksztaltowany",
  };
}

// =====================================================================
// A2 — KOMPETENCJE
// =====================================================================

export interface OdpowiedziA2 {
  czescA: Record<number, Ranking>;
  /** kompetencja 1-30 -> trzy pola dowodow */
  czescB: Record<number, boolean[]>;
}

export interface WynikA2 {
  k: Record<number, number>;
  sn: Record<number, number>;
  dowody: Record<number, number>;
  grupy: Record<string, number>;
  zroznicowanie: number;
  wskaznikOkazji: number;
  pewnosc: "wyrazny" | "umiarkowany" | "jeszcze_nieuksztaltowany";
}

export function policzA2(o: OdpowiedziA2): WynikA2 {
  const pozycjaDoKompetencji = new Map<string, number>();
  for (const blok of BLOKI_A2) for (const p of blok.pozycje) pozycjaDoKompetencji.set(p.id, p.kompetencja);

  const sRaw: Record<number, number> = {};
  for (const k of KOMPETENCJE_A2) sRaw[k.id] = 0;
  for (const ranking of Object.values(o.czescA)) {
    for (const [id, miejsce] of Object.entries(ranking)) {
      const kompetencja = pozycjaDoKompetencji.get(id);
      if (kompetencja !== undefined) sRaw[kompetencja] += WAGI_RANKINGU[miejsce] ?? 0;
    }
  }

  const sn: Record<number, number> = {};
  for (const k of KOMPETENCJE_A2) sn[k.id] = ((sRaw[k.id] / 6 + 1.5) / 3) * 100;

  const dowody: Record<number, number> = {};
  for (const k of KOMPETENCJE_A2) dowody[k.id] = (o.czescB[k.id] ?? []).filter(Boolean).length;
  const wskaznikOkazji = Object.values(dowody).reduce((s, x) => s + x, 0);
  // Za malo okazji albo przeszacowanie: licz z samego rankingu.
  const dowodyWaza = wskaznikOkazji >= 8 && wskaznikOkazji <= 75;

  const k: Record<number, number> = {};
  for (const kom of KOMPETENCJE_A2) {
    const dn = (dowody[kom.id] / 3) * 100;
    k[kom.id] = dowodyWaza ? 0.7 * sn[kom.id] + 0.3 * dn : sn[kom.id];
  }

  const grupy: Record<string, number> = {};
  for (const g of ["AN", "UT", "SL", "LU", "WY", "CP"]) {
    const w = KOMPETENCJE_A2.filter((x) => x.grupa === g);
    grupy[g] = w.reduce((s, x) => s + k[x.id], 0) / w.length;
  }

  const wartosci = Object.values(k);
  const zroznicowanie = Math.max(...wartosci) - Math.min(...wartosci);

  return {
    k,
    sn,
    dowody,
    grupy,
    zroznicowanie,
    wskaznikOkazji,
    pewnosc:
      zroznicowanie >= 30 ? "wyrazny" : zroznicowanie >= 18 ? "umiarkowany" : "jeszcze_nieuksztaltowany",
  };
}

// =====================================================================
// A3 — STYL DZIALANIA
// =====================================================================

export interface OdpowiedziA3 {
  /** id pary -> wybrany biegun */
  czescA: Record<string, "A" | "B">;
  /** wymiar -> kotwica 1-5 */
  czescB: Record<string, number>;
}

export interface WynikA3 {
  pozycje: Record<string, number>;
  wyrazistosc: Record<string, number>;
  sila: Record<string, number>;
  /** Wymiary z sila >= 65. Wchodza do srodowiska pracy i do silnika. */
  warunkiKluczowe: Array<{ wymiar: string; biegun: "A" | "B"; sila: number; warunek: string }>;
  preferencje: Array<{ wymiar: string; biegun: "A" | "B"; sila: number; warunek: string }>;
  wyrazistoscOgolna: number;
}

export function policzA3(o: OdpowiedziA3): WynikA3 {
  const pozycje: Record<string, number> = {};
  const wyrazistosc: Record<string, number> = {};
  const sila: Record<string, number> = {};

  for (const wymiar of WYMIARY_A3) {
    const pary = PARY_A3.filter((p) => p.wymiar === wymiar.kod);
    const wybraneA = pary.filter((p) => o.czescA[p.id] === "A").length;
    const odpowiedziane = pary.filter((p) => o.czescA[p.id] !== undefined).length;
    pozycje[wymiar.kod] = odpowiedziane > 0 ? (wybraneA / odpowiedziane) * 100 : 50;
    wyrazistosc[wymiar.kod] = Math.abs(pozycje[wymiar.kod] - 50) * 2;
    const wag = o.czescB[wymiar.kod];
    const wagn = wag === undefined ? 0 : ((wag - 1) / 4) * 100;
    // Srednia geometryczna, nie arytmetyczna: warunek liczy sie dopiero wtedy,
    // gdy uczestnik jest jednoczesnie wyrazny i przywiazany.
    sila[wymiar.kod] = Math.sqrt(wyrazistosc[wymiar.kod] * wagn);
  }

  const opis = (kod: string) => {
    const w = WYMIARY_A3.find((x) => x.kod === kod)!;
    const biegun: "A" | "B" = pozycje[kod] > 50 ? "A" : "B";
    return { wymiar: kod, biegun, sila: sila[kod], warunek: biegun === "A" ? w.warunekA : w.warunekB };
  };

  const warunkiKluczowe = WYMIARY_A3.filter((w) => sila[w.kod] >= 65)
    .map((w) => opis(w.kod))
    .sort((a, b) => b.sila - a.sila);
  const preferencje = WYMIARY_A3.filter((w) => sila[w.kod] >= 40 && sila[w.kod] < 65)
    .map((w) => opis(w.kod))
    .sort((a, b) => b.sila - a.sila);

  return {
    pozycje,
    wyrazistosc,
    sila,
    warunkiKluczowe,
    preferencje,
    wyrazistoscOgolna:
      Object.values(wyrazistosc).reduce((s, x) => s + x, 0) / WYMIARY_A3.length,
  };
}

// =====================================================================
// A4 — WARTOSCI
// =====================================================================

export interface OdpowiedziA4 {
  /** numer pary -> kod wybranej wartosci */
  czescA: Record<number, string>;
  /** maksymalnie trzy wartosci nieodzowne */
  czescB: string[];
  /** cztery odpowiedzi testu kosztu */
  czescC: Array<"tak" | "nie" | "zalezy">;
}

export interface WynikA4 {
  rank: Record<string, number>;
  v: Record<string, number>;
  top5: string[];
  bottom3: string[];
  progowe: string[];
  koszt: number;
  /** Wartosc nieodzowna, ktora w rankingu wypadla nisko. Flaga na sesje 1:1. */
  rozbieznosci: string[];
  zroznicowanie: number;
}

export function policzA4(o: OdpowiedziA4): WynikA4 {
  const wygrane: Record<string, number> = {};
  for (const w of WARTOSCI_A4) wygrane[w.kod] = 0;
  for (const para of PARY_A4) {
    const wybor = o.czescA[para.nr];
    if (wybor && wygrane[wybor] !== undefined) wygrane[wybor] += 1;
  }

  const rank: Record<string, number> = {};
  const v: Record<string, number> = {};
  const progowe = o.czescB.slice(0, 3);
  for (const w of WARTOSCI_A4) {
    rank[w.kod] = (wygrane[w.kod] / 6) * 100;
    // Bonus progowy jest addytywny, nie mnozony.
    v[w.kod] = rank[w.kod] + (progowe.includes(w.kod) ? 25 : 0);
  }

  const posortowane = [...WARTOSCI_A4].sort(
    (a, b) =>
      v[b.kod] - v[a.kod] ||
      rank[b.kod] - rank[a.kod] ||
      (progowe.includes(b.kod) ? 1 : 0) - (progowe.includes(a.kod) ? 1 : 0) ||
      WARTOSCI_A4.indexOf(a) - WARTOSCI_A4.indexOf(b),
  );

  const wartosciRank = Object.values(rank);
  return {
    rank,
    v,
    top5: posortowane.slice(0, 5).map((w) => w.kod),
    bottom3: posortowane.slice(-3).map((w) => w.kod),
    progowe,
    koszt: o.czescC.filter((x) => x === "tak").length,
    rozbieznosci: progowe.filter((kod) => rank[kod] < 50),
    zroznicowanie: Math.max(...wartosciRank) - Math.min(...wartosciRank),
  };
}

// =====================================================================
// A5 — FILTRY RZECZYWISTOSCI
// =====================================================================

export interface OdpowiedziA5 {
  /** kod filtru -> odpowiedz */
  czescA: Record<string, "tak" | "moze" | "nie">;
  /** maksymalnie trzy weta */
  czescB: string[];
  /** trzy otwarte dokonczenia, nie wchodza do silnika */
  czescC: string[];
}

export interface WynikA5 {
  g: Record<string, number>;
  weta: string[];
  wskaznikZamkniecia: number;
  brakOdmow: boolean;
  sameMoze: boolean;
  zdania: string[];
}

export function policzA5(o: OdpowiedziA5): WynikA5 {
  const g: Record<string, number> = {};
  for (const [kod, odp] of Object.entries(o.czescA)) {
    g[kod] = odp === "tak" ? 1 : odp === "moze" ? 0.5 : 0;
  }
  const odpowiedzi = Object.values(o.czescA);
  const zamkniecie = odpowiedzi.filter((x) => x === "nie").length;
  return {
    g,
    // Weto mozna postawic wylacznie na pozycji z odpowiedzia NIE.
    weta: o.czescB.filter((kod) => o.czescA[kod] === "nie").slice(0, 3),
    wskaznikZamkniecia: zamkniecie,
    brakOdmow: zamkniecie === 0,
    sameMoze: odpowiedzi.filter((x) => x === "moze").length > 24,
    zdania: o.czescC,
  };
}

// =====================================================================
// M1 — KSZTALT ZYCIA
// =====================================================================

export interface OdpowiedziM1 {
  czescA: Record<string, "A" | "B">;
  /** numer obszaru -> tekst albo struktura */
  czescB: Record<number, unknown>;
}

export interface WynikM1 {
  shape: Record<string, number | null>;
  czescB: Record<number, unknown>;
}

export function policzM1(o: OdpowiedziM1): WynikM1 {
  const shape: Record<string, number | null> = {};
  for (const wymiar of WYMIARY_M1) {
    const pary = PARY_M1.filter((p) => p.wymiar === wymiar.kod);
    const odpowiedziane = pary.filter((p) => o.czescA[p.id] !== undefined);
    if (odpowiedziane.length === 0) {
      shape[wymiar.kod] = null;
      continue;
    }
    const wybraneA = odpowiedziane.filter((p) => o.czescA[p.id] === "A").length;
    shape[wymiar.kod] = (wybraneA / odpowiedziane.length) * 100;
  }
  return { shape, czescB: o.czescB };
}

// =====================================================================
// ZLOZENIE
// =====================================================================

export interface KompletOdpowiedzi {
  a0: PunktStartu | null;
  a1: OdpowiedziA1;
  a2: OdpowiedziA2;
  a3: OdpowiedziA3;
  a4: OdpowiedziA4;
  a5: OdpowiedziA5;
  m1: OdpowiedziM1;
}

/** Sklada wyniki siedmiu modulow w jedyne wejscie silnika dopasowania. */
export function zlozWynikiModulow(o: KompletOdpowiedzi): WynikiModulow {
  const a1 = policzA1(o.a1);
  const a2 = policzA2(o.a2);
  const a3 = policzA3(o.a3);
  const a4 = policzA4(o.a4);
  const a5 = policzA5(o.a5);
  const m1 = policzM1(o.m1);

  return {
    punktStartu: o.a0,
    z: a1.z,
    ekspozycja: a1.ekspozycja,
    k: a2.k,
    dowody: a2.dowody,
    a3Pozycje: a3.pozycje,
    a3Sila: a3.sila,
    a4Top5: a4.top5,
    a4Bottom3: a4.bottom3,
    a4Progowe: a4.progowe,
    g: a5.g,
    weta: a5.weta,
    shape: m1.shape,
  };
}
