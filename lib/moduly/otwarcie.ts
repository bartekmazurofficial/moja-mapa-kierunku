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
  3: ["A4", "M1", "A5"],
};

export const SPOTKANIE_MODULU: Record<KodModulu, number> = {
  A0: 1, A1: 1, A3: 1, A2: 2, M1: 3, A4: 3, A5: 3,
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

/**
 * Zamkniecie istnieje wylacznie na wypadek pomylki prowadzacego i do testow.
 * W trakcie programu nie zamykamy niczego wstecz.
 */
export async function zamknijModul(grupaId: string, modul: KodModulu): Promise<void> {
  await prisma.otwarcieModulu.deleteMany({ where: { grupaId, modul } });
}
