/**
 * Otwieranie modułów przez prowadzącego (luka L1 z fazy trzeciej).
 * Reguły: otwarte zostaje otwarte, nieotwarte jest niedostępne.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";
import {
  MODULY_SPOTKANIA,
  SPOTKANIE_MODULU,
  otwarteModuly,
  otworzModul,
  otworzSpotkanie,
  zamknijModul,
} from "@/lib/moduly/otwarcie";
import { KOLEJNOSC_MODULOW } from "@/lib/moduly/ekrany";
import { grupaZKompletem } from "./pomocnicze/fixtury";
import type { KodModulu } from "@/lib/moduly/typy";

let grupaId: string;
let stanPoczatkowy: KodModulu[];

beforeAll(async () => {
  const grupa = await grupaZKompletem();
  grupaId = grupa.id;
  stanPoczatkowy = [...(await otwarteModuly(grupaId))];
});

afterAll(async () => {
  // Przywracamy stan sprzed testu: baza jest wspolna dla wszystkich plikow.
  for (const m of KOLEJNOSC_MODULOW) await zamknijModul(grupaId, m);
  for (const m of stanPoczatkowy) await otworzModul(grupaId, m);
});

describe("otwieranie modułów", () => {
  it("każdy moduł należy do dokładnie jednego spotkania", () => {
    const zeSpotkan = Object.values(MODULY_SPOTKANIA).flat();
    expect(new Set(zeSpotkan).size).toBe(zeSpotkan.length);
    expect(new Set(zeSpotkan)).toEqual(new Set(KOLEJNOSC_MODULOW));
    for (const [nr, moduly] of Object.entries(MODULY_SPOTKANIA)) {
      for (const m of moduly) expect(SPOTKANIE_MODULU[m]).toBe(Number(nr));
    }
  });

  it("spotkanie pierwsze otwiera trzy moduły czynności i nic więcej", async () => {
    // Kasujemy wszystko, nie tylko cztery obecne kody: w bazie zostaly
    // wiersze otwarc modulow z poprzedniej wersji programu.
    await prisma.otwarcieModulu.deleteMany({ where: { grupaId } });
    await otworzSpotkanie(grupaId, 1);
    expect([...(await otwarteModuly(grupaId))].sort()).toEqual(["L", "U", "Z"]);
  });

  it("poziom życia pozostaje zamknięty do drugiego spotkania", async () => {
    // Zawody porównują widełki z kwotą z tego modułu, więc idzie ostatni.
    expect((await otwarteModuly(grupaId)).has("F")).toBe(false);
    await otworzSpotkanie(grupaId, 2);
    expect((await otwarteModuly(grupaId)).has("F")).toBe(true);
  });

  it("otwarte zostaje otwarte: ponowne otwarcie nie przesuwa daty", async () => {
    const pierwsze = await prisma.otwarcieModulu.findUniqueOrThrow({
      where: { grupaId_modul: { grupaId, modul: "Z" } },
    });
    await otworzModul(grupaId, "Z");
    const drugie = await prisma.otwarcieModulu.findUniqueOrThrow({
      where: { grupaId_modul: { grupaId, modul: "Z" } },
    });
    expect(drugie.otwarty.getTime()).toBe(pierwsze.otwarty.getTime());
  });

  it("otwarcie dotyczy grupy, nie pojedynczego uczestnika", async () => {
    const uczestnicy = await prisma.uczestnik.findMany({ where: { grupaId }, take: 2 });
    expect(uczestnicy.length).toBeGreaterThan(1);
    // Nie ma osobnego stanu na uczestnika: ta sama grupa to ten sam zbior.
    const a = await otwarteModuly(uczestnicy[0].grupaId);
    const b = await otwarteModuly(uczestnicy[1].grupaId);
    expect([...a].sort()).toEqual([...b].sort());
  });
});
