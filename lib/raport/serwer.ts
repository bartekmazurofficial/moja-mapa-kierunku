/** Zlozenie raportu dla uczestnika: dane z bazy plus reguly odslaniania. */

import { prisma } from "../db/klient";
import { pobierzBazeReferencyjna } from "../db/repozytorium";
import { zbierzOdpowiedzi } from "../moduly/zbieranie";
import { stanDostepu } from "./dostep";
import { zbudujRaport } from "./budowa";
import { SEKCJE, WARSTWY, type KodWarstwy } from "./sekcje";
import type { Raport } from "./typy";

export interface WidokRaportu {
  raport: Raport;
  /** Sekcje, ktore uczestnik widzi teraz. */
  dostepne: string[];
  /** Warstwy zamkniete, z informacja kiedy sie otworza. */
  zamkniete: Array<{ kod: KodWarstwy; nazwa: string; kiedy: string; sekcje: string[] }>;
  blokadaA2: boolean;
  oceny: Record<string, string>;
  pytanie: string | null;
}

export async function pobierzRaport(kodDostepu: string): Promise<WidokRaportu | null> {
  const uczestnik = await prisma.uczestnik.findUnique({
    where: { kodDostepu },
    include: { grupa: true, oceny: true, pytanie: true },
  });
  if (!uczestnik) return null;

  const [dostep, odpowiedzi, baza, karty] = await Promise.all([
    stanDostepu(uczestnik.id, uczestnik.grupaId),
    zbierzOdpowiedzi(uczestnik.id),
    pobierzBazeReferencyjna(),
    prisma.karta.findMany({ select: { kod: true, pelna: true } }),
  ]);

  const raport = zbudujRaport({
    imie: uczestnik.imie,
    odpowiedzi,
    baza,
    karty: new Map(karty.map((k) => [k.kod, { pelna: k.pelna }])),
    dostepne: dostep.dostepne,
  });

  const zamkniete = WARSTWY.filter((w) => w.kod !== "ZAWSZE" && dostep.warstwy.get(w.kod) === null).map(
    (w) => ({
      kod: w.kod,
      nazwa: w.nazwa,
      kiedy: w.kiedy,
      sekcje: SEKCJE.filter((s) => s.warstwa === w.kod).map((s) => s.tytul),
    }),
  );

  return {
    raport,
    dostepne: [...dostep.dostepne],
    zamkniete,
    blokadaA2: dostep.blokadaA2,
    oceny: Object.fromEntries(uczestnik.oceny.map((o) => [o.zawodKod, o.ocena])),
    pytanie: uczestnik.pytanie?.tresc ?? null,
  };
}

/** Karta zawodu. Pelna dla Drogi A i B, skrocona dla pozostalych. */
export async function pobierzKarte(kodDostepu: string, kodZawodu: string) {
  const uczestnik = await prisma.uczestnik.findUnique({
    where: { kodDostepu },
    select: { id: true, grupaId: true },
  });
  if (!uczestnik) return null;

  // Karty otwieraja sie razem z sekcja zawodow, nie wczesniej.
  const dostep = await stanDostepu(uczestnik.id, uczestnik.grupaId);
  if (!dostep.dostepne.has("zawody")) return null;

  const [karta, zawod] = await Promise.all([
    prisma.karta.findUnique({ where: { kod: kodZawodu } }),
    prisma.zawod.findUnique({ where: { kod: kodZawodu } }),
  ]);
  if (!karta || !zawod) return null;

  return {
    // Tytul z karty jest wersalikami; uczestnikowi pokazujemy nazwe zawodu.
    tytul: zawod.nazwaWyswietlana,
    pelna: karta.pelna,
    sekcje: JSON.parse(karta.sekcje) as Array<{ tytul: string; klucz: string | null; tresc: string }>,
    poziom: zawod.poziom,
    studia: zawod.studia,
    zdanieKierunkowe: zawod.kier,
  };
}
