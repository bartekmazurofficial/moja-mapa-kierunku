/**
 * Trzy profile kontrolne warstwy pierwszej.
 * Przepisane z 08_kod_referencyjny/silnik.py bez zmian. Sluza jako test
 * regresyjny: kazda zmiana w silniku albo w bazie obszarow ma byc na nich
 * sprawdzona, tak jak wymaga tego rozdzial 14 warstwa1_obszary.md.
 */

import type { WynikiModulow } from "@/lib/engine/typy";

/** Dowod na kompetencje: prototyp trzymal zbior, tutaj liczba 0-3 jak w module A2. */
function dowody(mocne: number[]): Record<number, number> {
  const d: Record<number, number> = {};
  for (let i = 1; i <= 30; i++) d[i] = 0;
  for (const id of mocne) d[id] = 3;
  return d;
}

function pusta(n: number, domyslna: number): Record<number, number> {
  const m: Record<number, number> = {};
  for (let i = 1; i <= n; i++) m[i] = domyslna;
  return m;
}

/** A5: brak odpowiedzi traktujemy jak MOZE, tak jak prototyp. */
function filtry(odp: Record<string, number>): Record<string, number> {
  const g: Record<string, number> = {};
  for (let i = 1; i <= 32; i++) g[`F${String(i).padStart(2, "0")}`] = 0.5;
  return { ...g, ...odp };
}

export const RZEMIESLNIK_17: WynikiModulow = {
  punktStartu: null,
  z: { ...pusta(24, 45), ...{ 1: 92, 2: 88, 4: 66, 5: 58, 10: 20, 13: 30, 14: 28, 15: 22, 16: 25, 17: 30, 22: 74 } },
  ekspozycja: {},
  k: { ...pusta(30, 45), ...{ 1: 78, 11: 25, 13: 22, 16: 35, 22: 72, 23: 66, 25: 70, 26: 88, 27: 85 } },
  dowody: dowody([1, 26, 27]),
  a3Pozycje: {},
  a3Sila: {},
  a4Top5: ["WOL", "MIS", "STA", "PIE", "CZA"],
  a4Bottom3: ["UZN", "WPL", "ZMI"],
  a4Progowe: ["WOL"],
  g: filtry({ F01: 0.0, F02: 0.0, F16: 1.0, F17: 1.0, F18: 1.0, F19: 0.0, F20: 1.0, F26: 0.0, F29: 1.0 }),
  weta: ["F26"],
  shape: { MIE: 100, ORG: 0, INW: 100, KOR: 100, CEN: 25, GOD: 75, POZ: 50, LUD: 25, WID: 0, GRA: 50, TEMP: 50, ROD: null },
};

export const SPOLECZNA_19: WynikiModulow = {
  punktStartu: null,
  z: { ...pusta(24, 45), ...{ 1: 18, 5: 20, 7: 62, 8: 22, 13: 90, 14: 80, 15: 88, 16: 76, 21: 32, 23: 25 } },
  ekspozycja: {},
  k: { ...pusta(30, 45), ...{ 3: 28, 10: 30, 12: 78, 16: 82, 17: 84, 18: 74, 19: 70, 27: 25, 28: 35 } },
  dowody: dowody([12, 16, 17]),
  a3Pozycje: {},
  a3Sila: {},
  a4Top5: ["SEN", "REL", "ZAS", "CZA", "STA"],
  a4Bottom3: ["PIE", "UZN", "ZMI"],
  a4Progowe: ["SEN"],
  g: filtry({ F02: 1.0, F21: 0.0, F22: 1.0, F23: 1.0, F24: 1.0, F28: 0.0 }),
  weta: ["F21"],
  shape: { GOD: 0, CEN: 0, ORG: 25, MIE: 75, INW: 25, KOR: 75, POZ: 25, LUD: 25, WID: 25, GRA: 0, TEMP: 25, ROD: 75 },
};

export const ANALITYK_22: WynikiModulow = {
  punktStartu: null,
  z: { ...pusta(24, 45), ...{ 4: 22, 5: 84, 6: 80, 8: 92, 11: 25, 12: 20, 13: 20, 15: 18, 21: 64, 22: 70 } },
  ekspozycja: {},
  k: { ...pusta(30, 45), ...{ 1: 80, 2: 88, 3: 82, 4: 86, 6: 76, 13: 25, 19: 30, 22: 70, 28: 22 } },
  dowody: dowody([2, 3, 4]),
  a3Pozycje: {},
  a3Sila: {},
  a4Top5: ["ROZ", "MIS", "PIE", "WOL", "STA"],
  a4Bottom3: ["UZN", "REL", "SEN"],
  a4Progowe: ["ROZ"],
  g: filtry({ F01: 1.0, F02: 1.0, F04: 1.0, F11: 0.0, F12: 0.0, F16: 0.0, F17: 0.0, F19: 1.0, F21: 0.0, F27: 1.0 }),
  weta: [],
  shape: { MIE: 0, GRA: 100, INW: 0, ORG: 50, CEN: 75, GOD: 75, KOR: 25, POZ: 75, LUD: 25, WID: 25, TEMP: 75, ROD: null },
};

export const PROFILE_WARSTWY1 = {
  rzemieslnik_17: RZEMIESLNIK_17,
  spoleczna_19: SPOLECZNA_19,
  analityk_22: ANALITYK_22,
} as const;
