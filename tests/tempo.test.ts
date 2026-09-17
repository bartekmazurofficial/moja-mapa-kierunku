/**
 * Ostrzeżenie o tempie wypełniania, liczone względem mediany grupy.
 *
 * Próg bezwzględny ze scenariusza świecił się u każdego, kto wypełniał
 * szybciej niż przewidziano — czyli u całej grupy naraz.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";
import { pobierzGrupe } from "@/lib/prowadzacy/dane";
import { TEMPO } from "@/lib/engine/config";
import { MARKER_ZAKONCZENIA } from "@/lib/moduly/typy";
import { grupaZKompletem } from "./pomocnicze/fixtury";

let grupaKod: string;
let grupaId: string;
/** Kopia czasów sprzed testu: baza jest wspólna dla wszystkich plików. */
const kopia = new Map<string, number | null>();

async function ustawCzas(uczestnikId: string, modul: string, ms: number) {
  const wiersze = await prisma.odpowiedz.findMany({
    where: { uczestnikId, modul, NOT: { pozycja: MARKER_ZAKONCZENIA } },
    select: { id: true, msSpent: true },
  });
  for (const w of wiersze) {
    if (!kopia.has(w.id)) kopia.set(w.id, w.msSpent);
    await prisma.odpowiedz.update({ where: { id: w.id }, data: { msSpent: ms } });
  }
  return wiersze.length;
}

beforeAll(async () => {
  const grupa = await grupaZKompletem();
  grupaKod = grupa.kod;
  grupaId = grupa.id;
});

afterAll(async () => {
  for (const [id, msSpent] of kopia) {
    await prisma.odpowiedz.update({ where: { id }, data: { msSpent } });
  }
});

/** Uczestnicy bez zmierzonego czasu w etapie pierwszym. */
async function zGotowymA1() {
  const widok = await pobierzGrupe(grupaKod);
  return (widok?.uczestnicy ?? []).filter(
    (u) => u.moduly.find((m) => m.kod === "Z")?.stan === "gotowy",
  );
}

describe("ostrzeżenie o tempie", () => {
  it("przy równym tempie nikt nie jest oflagowany", async () => {
    const gotowi = await zGotowymA1();
    expect(gotowi.length).toBeGreaterThanOrEqual(TEMPO.MIN_UKONCZEN);
    for (const u of gotowi) {
      const id = (await prisma.uczestnik.findUniqueOrThrow({ where: { kodDostepu: u.kodDostepu } })).id;
      await ustawCzas(id, "Z", 10_000);
    }
    const po = await zGotowymA1();
    expect(po.filter((u) => u.moduly.find((m) => m.kod === "Z")!.pobiezny)).toEqual([]);
  });

  it("osoba odstająca od swojej grupy dostaje ostrzeżenie", async () => {
    const gotowi = await zGotowymA1();
    const pierwszy = await prisma.uczestnik.findUniqueOrThrow({
      where: { kodDostepu: gotowi[0].kodDostepu },
    });
    await ustawCzas(pierwszy.id, "Z", 1_000);

    const po = await zGotowymA1();
    const oflagowani = po.filter((u) => u.moduly.find((m) => m.kod === "Z")!.pobiezny);
    expect(oflagowani.map((u) => u.kodDostepu)).toEqual([gotowi[0].kodDostepu]);
  });

  it("nigdy więcej niż dwie osoby na moduł", async () => {
    const gotowi = await zGotowymA1();
    // Trzy osoby klikają na oślep, reszta pracuje normalnie. Odstają wszystkie
    // trzy, ale ostrzeżenie dostają dwie najbardziej odstające.
    for (const [i, u] of gotowi.entries()) {
      const id = (await prisma.uczestnik.findUniqueOrThrow({ where: { kodDostepu: u.kodDostepu } })).id;
      await ustawCzas(id, "Z", i < 3 ? 500 + i * 100 : 10_000);
    }
    const po = await zGotowymA1();
    const oflagowani = po.filter((u) => u.moduly.find((m) => m.kod === "Z")!.pobiezny);
    expect(oflagowani.length).toBe(TEMPO.MAKS_OFLAGOWANYCH);
    expect(oflagowani.map((u) => u.kodDostepu).sort()).toEqual(
      gotowi.slice(0, 2).map((u) => u.kodDostepu).sort(),
    );
  });

  it("gdy szybko wypełnia większość, mediana się przesuwa i nikt nie odstaje", async () => {
    // To jest cała różnica wobec progu bezwzględnego: grupa, która pracuje
    // szybko, nie generuje ostrzeżeń u wszystkich naraz.
    const gotowi = await zGotowymA1();
    // Jedna osoba pracuje wolno, cała reszta szybko. Mediana idzie za większością.
    for (const [i, u] of gotowi.entries()) {
      const id = (await prisma.uczestnik.findUniqueOrThrow({ where: { kodDostepu: u.kodDostepu } })).id;
      await ustawCzas(id, "Z", i === 0 ? 10_000 : 3_000);
    }
    const po = await zGotowymA1();
    const oflagowani = po.filter((u) => u.moduly.find((m) => m.kod === "Z")!.pobiezny);
    expect(oflagowani.map((u) => u.imie)).toEqual([]);
  });

  it("przy zbyt małej liczbie ukończeń mediana nie jest liczona", async () => {
    // Moduł, którego nikt nie zamknął, nie może produkować ostrzeżeń.
    const widok = await pobierzGrupe(grupaKod);
    const niedokonczony = widok!.uczestnicy.flatMap((u) =>
      u.moduly.filter((m) => m.stan !== "gotowy" && m.pobiezny),
    );
    expect(niedokonczony).toEqual([]);
  });
});
