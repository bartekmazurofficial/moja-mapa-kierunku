/**
 * Otwieranie modulow przez prowadzacego.
 *
 * Kolejnosc modulow jest czescia metody, nie porzadkiem na liscie: kto
 * najpierw powie, w czym jest dobry, ten potem „lubi" dokladnie to samo.
 * Dlatego prowadzacy otwiera moduly spotkaniami, a nie wszystkie naraz.
 *
 * Dwie reguly: otwarte zostaje otwarte, a modul nieotwarty jest niedostepny
 * takze pod bezposrednim adresem. Egzekwowane po stronie serwera, tak samo
 * jak warstwy raportu.
 *
 * Bez "server-only": z tych funkcji korzysta takze skrypt z wiersza polecen.
 */

import { prisma } from "../db/klient";
import type { KodModulu } from "./typy";

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

/**
 * Ktore moduly otwiera ktore spotkanie.
 *
 * Trzy moduly czynnosci na pierwszym, poziom zycia na drugim. Zawody padaja
 * dopiero po poziomie zycia, bo bez niego nie ma z czym porownac widelek.
 */
export const MODULY_SPOTKANIA: Record<number, KodModulu[]> = {
  1: ["Z", "L", "U"],
  2: ["F"],
};

/** Ktore spotkanie otwiera dany modul. Do komunikatu przy module zamknietym. */
export const SPOTKANIE_MODULU: Record<KodModulu, number> = { Z: 1, L: 1, U: 1, F: 2 };

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
