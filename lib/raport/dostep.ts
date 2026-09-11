/**
 * Odslanianie warstw raportu, egzekwowane po stronie serwera.
 *
 * Sekcja z wyzszej warstwy nie renderuje sie przed odblokowaniem, nawet przy
 * bezposrednim odwolaniu do adresu. Ukrywanie w interfejsie nie wystarcza.
 *
 * Bez "server-only", bo z tych samych funkcji korzysta skrypt odslaniania
 * uruchamiany z wiersza polecen, zanim powstanie panel prowadzacego.
 */

import { prisma } from "../db/klient";
import { SEKCJE, type KodWarstwy } from "./sekcje";
import { MARKER_ZAKONCZENIA } from "../moduly/typy";

export interface StanDostepu {
  /** Warstwa -> kiedy zostala odblokowana. Null, gdy jeszcze zamknieta. */
  warstwy: Map<KodWarstwy, Date | null>;
  dostepne: Set<string>;
  /**
   * Blokada z modulu A2: od rozpoczecia modulu do zakonczenia czesci B
   * sekcje oparte na A1 i A3 sa niedostepne na wszystkich urzadzeniach.
   */
  blokadaA2: boolean;
}

export async function stanDostepu(uczestnikId: string, grupaId: string): Promise<StanDostepu> {
  const [odslony, a2Rozpoczete, a2Zamkniete] = await Promise.all([
    prisma.odslona.findMany({ where: { grupaId } }),
    prisma.odpowiedz.count({ where: { uczestnikId, modul: "A2" } }),
    prisma.odpowiedz.count({
      where: { uczestnikId, modul: "A2", czesc: "B", pozycja: MARKER_ZAKONCZENIA },
    }),
  ]);

  const warstwy = new Map<KodWarstwy, Date | null>();
  warstwy.set("ZAWSZE", new Date(0));
  for (const kod of ["W1", "W2", "W4A", "W4B", "W5"] as KodWarstwy[]) {
    const wiersz = odslony.find((o) => o.warstwa === kod);
    warstwy.set(kod, wiersz?.odblokowana ?? null);
  }

  const blokadaA2 = a2Rozpoczete > 0 && a2Zamkniete === 0;

  const dostepne = new Set<string>();
  for (const s of SEKCJE) {
    if (warstwy.get(s.warstwa) === null) continue;
    if (blokadaA2 && s.blokowanaPrzezA2) continue;
    dostepne.add(s.id);
  }

  return { warstwy, dostepne, blokadaA2 };
}

/** Prowadzacy odblokowuje warstwe dla calej grupy jednym ruchem. */
export async function odblokujWarstwe(grupaId: string, warstwa: KodWarstwy): Promise<void> {
  await prisma.odslona.upsert({
    where: { grupaId_warstwa: { grupaId, warstwa } },
    create: { grupaId, warstwa, odblokowana: new Date() },
    update: { odblokowana: new Date() },
  });
}

/** Cofniecie odsloniecia. Uzywane wylacznie w testach i przy pomylce prowadzacego. */
export async function zamknijWarstwe(grupaId: string, warstwa: KodWarstwy): Promise<void> {
  await prisma.odslona.deleteMany({ where: { grupaId, warstwa } });
}
