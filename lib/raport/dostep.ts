/**
 * Odslanianie zamknietej czesci raportu, egzekwowane po stronie serwera.
 *
 * Sekcja z zamknietej warstwy nie renderuje sie przed odblokowaniem, nawet
 * przy bezposrednim odwolaniu do adresu, i nie wchodzi do pliku PDF.
 * Ukrywanie w interfejsie nie wystarcza.
 *
 * Bez "server-only", bo z tych samych funkcji korzysta skrypt odslaniania
 * uruchamiany z wiersza polecen.
 */

import { prisma } from "../db/klient";
import { SEKCJE, type KodWarstwy } from "./sekcje";

export interface StanDostepu {
  /** Warstwa -> kiedy zostala odblokowana. Null, gdy jeszcze zamknieta. */
  warstwy: Map<KodWarstwy, Date | null>;
  dostepne: Set<string>;
}

export async function stanDostepu(_uczestnikId: string, grupaId: string): Promise<StanDostepu> {
  const odslony = await prisma.odslona.findMany({ where: { grupaId } });

  const warstwy = new Map<KodWarstwy, Date | null>();
  warstwy.set("ZAWSZE", new Date(0));
  warstwy.set("W4B", odslony.find((o) => o.warstwa === "W4B")?.odblokowana ?? null);

  const dostepne = new Set<string>();
  for (const s of SEKCJE) {
    if (warstwy.get(s.warstwa) === null) continue;
    dostepne.add(s.id);
  }

  return { warstwy, dostepne };
}

/** Prowadzacy odblokowuje warstwe dla calej grupy jednym ruchem. */
export async function odblokujWarstwe(grupaId: string, warstwa: KodWarstwy): Promise<void> {
  await prisma.odslona.upsert({
    where: { grupaId_warstwa: { grupaId, warstwa } },
    create: { grupaId, warstwa, odblokowana: new Date() },
    update: { odblokowana: new Date() },
  });
}

/**
 * Cofniecie odsloniecia. Uzywane wylacznie na wypadek pomylki prowadzacego
 * i w testach. W trakcie programu nie zamykamy niczego wstecz.
 */
export async function zamknijWarstwe(grupaId: string, warstwa: KodWarstwy): Promise<void> {
  await prisma.odslona.deleteMany({ where: { grupaId, warstwa } });
}
