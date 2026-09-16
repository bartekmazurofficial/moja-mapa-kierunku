/**
 * Otwieranie modulow przez prowadzacego.
 *
 * Luka wykryta przy skladaniu fazy trzeciej: reguly odslaniania dotyczyly
 * wylacznie raportu, wiec uczestnik mogl pierwszego dnia wypelnic wszystkie
 * siedem modulow. Specyfikacja A2 wymaga wprost, zeby nie widzial wyniku A1
 * przed jej wypelnieniem — inaczej oceni wlasne kompetencje pod to, co przed
 * chwila przeczytal, i zanieczysci najwazniejszy pomiar w programie.
 *
 * Dwie reguly: otwarte zostaje otwarte, a modul nieotwarty jest niedostepny
 * takze pod bezposrednim adresem. Egzekwowane po stronie serwera, tak samo
 * jak warstwy raportu.
 *
 * Bez "server-only": z tych funkcji korzysta takze skrypt z wiersza polecen.
 */

import { prisma } from "../db/klient";
import type { KodModulu } from "./typy";

/** Ktore moduly otwiera ktore spotkanie. Zgodnie z ustaleniem po fazie 3. */
export const MODULY_SPOTKANIA: Record<number, KodModulu[]> = {
  1: ["A0", "A1", "A3"],
  2: ["A2"],
  3: ["A4", "M1"],
  // Spotkanie czwarte otwiera dwa ostatnie moduly i konczy sie raportem.
  // A6 stoi po A5 celowo: filtry mowia, na co czlowiek sie godzi w pracy,
  // a dopiero potem pytamy, ile nauki jest gotow w to wlozyc.
  4: ["A5", "A6"],
};

/**
 * Nowy program: cztery moduly zamiast osmiu.
 *
 * Trzymane osobno od `MODULY_SPOTKANIA`, dopoki obie wersje wspolistnieja.
 * Grupa pilotazowa ma wypelnione osiem starych modulow i skasowanie tego
 * byloby skasowaniem jej wynikow.
 */
export const MODULY_SPOTKANIA_NOWE: Record<number, KodModulu[]> = {
  1: ["Z", "L", "U"],
  2: ["F"],
};

export const SPOTKANIE_MODULU: Record<KodModulu, number> = {
  A0: 1, A1: 1, A3: 1, A2: 2, M1: 3, A4: 3, A5: 4, A6: 4,
  // Nowy program: ciekawosc i oba tory czynnosci na pierwszym spotkaniu,
  // poziom zycia na drugim. Zawody padaja dopiero po poziomie zycia, bo bez
  // niego nie ma z czym porownac widelek.
  Z: 1, L: 1, U: 1, F: 2,
};

export async function otwarteModuly(grupaId: string): Promise<Set<KodModulu>> {
  const wiersze = await prisma.otwarcieModulu.findMany({ where: { grupaId } });
  return new Set(wiersze.map((w) => w.modul as KodModulu));
}

/** Otwarte zostaje otwarte: ponowne otwarcie nie przesuwa daty. */
export async function otworzModul(grupaId: string, modul: KodModulu): Promise<void> {
  await prisma.otwarcieModulu.upsert({
    where: { grupaId_modul: { grupaId, modul } },
    create: { grupaId, modul },
    update: {},
  });
}

export async function otworzSpotkanie(grupaId: string, nr: number): Promise<void> {
  for (const modul of MODULY_SPOTKANIA[nr] ?? []) await otworzModul(grupaId, modul);
}

/** To samo dla nowego programu. Osobna funkcja, bo numery spotkan sie pokrywaja. */
export async function otworzSpotkanieNowe(grupaId: string, nr: number): Promise<void> {
  for (const modul of MODULY_SPOTKANIA_NOWE[nr] ?? []) await otworzModul(grupaId, modul);
}

/**
 * Zamkniecie istnieje wylacznie na wypadek pomylki prowadzacego i do testow.
 * W trakcie programu nie zamykamy niczego wstecz.
 */
export async function zamknijModul(grupaId: string, modul: KodModulu): Promise<void> {
  await prisma.otwarcieModulu.deleteMany({ where: { grupaId, modul } });
}
