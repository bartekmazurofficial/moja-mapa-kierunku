/**
 * Warstwa serwerowa kart zawodow.
 *
 * Karty otwieraja sie razem z sekcja zawodow w raporcie i nigdy wczesniej.
 * Sprawdzenie stoi tutaj, w warstwie danych, a nie w stronach: strona moze
 * zapomniec sprawdzic, zapytanie nie.
 */

import "server-only";
import { prisma } from "../db/klient";
import { stanDostepu } from "./dostep";
import { znakObszaru } from "@/lib/karty/obszary";

export interface KartaZawodu {
  kod: string;
  tytul: string;
  pelna: boolean;
  sekcje: Array<{ tytul: string; klucz: string | null; tresc: string }>;
  poziom: string;
  studia: string;
  koszt: string;
  zagrozenie: string;
  /** `trampolina` albo `docelowy`. Trampolina to dobre pierwsze miejsce pracy. */
  flaga: string;
  zdanieKierunkowe: string | null;
  klasterKod: string | null;
  /** Numer obszaru silnika. Uwaga: to nie jest numer obszaru A1. */
  obszarId: number;
  /** Nazwa obszaru, do znacznika w nagłówku karty. */
  obszar: string;
  /** Klucz znaku A1 obszaru (`a1-7`): stad ilustracja w naglowku karty. */
  znakObszaru: string | null;
}

/** Karta zawodu. Pelna dla Drogi A i B, skrocona dla pozostalych. */
export async function pobierzKarte(
  kodDostepu: string,
  kodZawodu: string,
): Promise<KartaZawodu | null> {
  const karty = await pobierzKarty(kodDostepu, [kodZawodu]);
  return karty?.[0] ?? null;
}

/**
 * Kilka kart naraz, przy jednym sprawdzeniu dostepu.
 *
 * Widok porownania potrzebuje dwoch kart. Dwa wywolania pobierzKarte to
 * czterokrotne odpytanie bazy o tego samego uczestnika i ten sam stan dostepu.
 * Kolejnosc wyniku jest kolejnoscia kodow: widok porownania stawia karty obok
 * siebie i nie moze ich zamienic miejscami.
 */
export async function pobierzKarty(
  kodDostepu: string,
  kodyZawodow: string[],
): Promise<KartaZawodu[] | null> {
  const uczestnik = await prisma.uczestnik.findUnique({
    where: { kodDostepu },
    select: { id: true, grupaId: true },
  });
  if (!uczestnik) return null;

  // Karty otwieraja sie razem z sekcja zawodow, nie wczesniej.
  const dostep = await stanDostepu(uczestnik.id, uczestnik.grupaId);
  if (!dostep.dostepne.has("zawody")) return null;

  const [karty, zawody] = await Promise.all([
    prisma.karta.findMany({ where: { kod: { in: kodyZawodow } } }),
    prisma.zawod.findMany({
      where: { kod: { in: kodyZawodow } },
      include: { obszar: { select: { nazwa: true, zainteresowania: true } } },
    }),
  ]);
  const poKodzie = new Map(karty.map((k) => [k.kod, k]));
  const zawodPoKodzie = new Map(zawody.map((z) => [z.kod, z]));

  const wynik: KartaZawodu[] = [];
  for (const kod of kodyZawodow) {
    const karta = poKodzie.get(kod);
    const zawod = zawodPoKodzie.get(kod);
    if (!karta || !zawod) continue;
    wynik.push({
      kod,
      // Tytul z karty jest wersalikami; uczestnikowi pokazujemy nazwe zawodu.
      tytul: zawod.nazwaWyswietlana,
      pelna: karta.pelna,
      sekcje: JSON.parse(karta.sekcje) as Array<{ tytul: string; klucz: string | null; tresc: string }>,
      poziom: zawod.poziom,
      studia: zawod.studia,
      koszt: zawod.koszt,
      zagrozenie: zawod.zagr,
      flaga: zawod.flaga,
      zdanieKierunkowe: zawod.kier,
      klasterKod: zawod.klasterKod,
      obszarId: zawod.obszarId,
      obszar: zawod.obszar.nazwa,
      znakObszaru: znakObszaru(
        JSON.parse(zawod.obszar.zainteresowania) as Record<string, number>,
      ),
    });
  }
  return wynik;
}
