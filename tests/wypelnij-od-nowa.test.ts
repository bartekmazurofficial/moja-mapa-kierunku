/**
 * Wypełnienie części od nowa.
 *
 * Reguła: kasujemy wyłącznie odpowiedzi i postęp jednego modułu jednego
 * uczestnika. Sąsiednie moduły, inni uczestnicy i praca prowadzącego zostają.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";
import { coZniknie, wyczyscModul } from "@/lib/moduly/odnowa";
import { wypelnijUczestnika } from "@/lib/testy/wypelnianie";
import { pobierzPlan, pobierzStanModulu } from "@/lib/moduly/serwer";
import { MARKER_ZAKONCZENIA } from "@/lib/moduly/typy";
import { uczestnikTestowy } from "./pomocnicze/fixtury";

const KOD = "TEST000099";
let uczestnikId: string;

beforeAll(async () => {
  // Własny uczestnik: test kasuje mu odpowiedzi, więc nie może dzielić go
  // z testami, które na wypełnionej bazie polegają.
  const wzorzec = await uczestnikTestowy();
  const istniejacy = await prisma.uczestnik.findUnique({ where: { kodDostepu: KOD } });
  const uczestnik =
    istniejacy ??
    (await prisma.uczestnik.create({
      data: { grupaId: wzorzec.grupaId, imie: "Test od nowa", kodDostepu: KOD },
    }));
  uczestnikId = uczestnik.id;
  await wypelnijUczestnika(uczestnikId, "rzemieslniczy");
});

afterAll(async () => {
  await prisma.uczestnik.delete({ where: { id: uczestnikId } }).catch(() => undefined);
});

describe("co zniknie", () => {
  it("liczy odpowiedzi bez znaczników zakończenia części", async () => {
    const stan = await coZniknie(uczestnikId, "A1");
    const wszystkie = await prisma.odpowiedz.count({ where: { uczestnikId, modul: "A1" } });
    const markery = await prisma.odpowiedz.count({
      where: { uczestnikId, modul: "A1", pozycja: MARKER_ZAKONCZENIA },
    });
    expect(stan.odpowiedzi).toBe(wszystkie - markery);
    expect(stan.gotowy).toBe(true);
    expect(stan.zakonczoneCzesci).toEqual(["A", "B"]);
  });

  it("nic nie kasuje", async () => {
    const przed = await prisma.odpowiedz.count({ where: { uczestnikId, modul: "A1" } });
    await coZniknie(uczestnikId, "A1");
    expect(await prisma.odpowiedz.count({ where: { uczestnikId, modul: "A1" } })).toBe(przed);
  });
});

describe("wyczyszczenie modułu", () => {
  it("kasuje odpowiedzi i postęp tylko tego modułu", async () => {
    const innyPrzed = await prisma.odpowiedz.count({ where: { uczestnikId, modul: "A2" } });
    expect(innyPrzed).toBeGreaterThan(0);

    await pobierzPlan(uczestnikId, "A1");
    const { odpowiedzi } = await wyczyscModul(uczestnikId, "A1");

    expect(odpowiedzi).toBeGreaterThan(0);
    expect(await prisma.odpowiedz.count({ where: { uczestnikId, modul: "A1" } })).toBe(0);
    expect(
      await prisma.postepModulu.count({ where: { uczestnikId, kod: "A1" } }),
    ).toBe(0);
    expect(await prisma.odpowiedz.count({ where: { uczestnikId, modul: "A2" } })).toBe(innyPrzed);
  });

  it("moduł wraca na pierwszą część i daje się wypełnić jeszcze raz", async () => {
    const stan = await pobierzStanModulu(uczestnikId, "A1");
    expect(stan.czesc).toBe("A");
    expect(stan.definicja).not.toBeNull();
    expect(stan.zakonczoneCzesci).toEqual([]);

    await wypelnijUczestnika(uczestnikId, "spoleczny");
    const poNowym = await coZniknie(uczestnikId, "A1");
    expect(poNowym.gotowy).toBe(true);
  });

  it("nowy przebieg dostaje własną kolejność bloków", async () => {
    const przed = await pobierzPlan(uczestnikId, "A1");
    await wyczyscModul(uczestnikId, "A1");
    const po = await pobierzPlan(uczestnikId, "A1");
    // Ta sama liczba bloków, wylosowana od nowa: postęp z kolejnością zniknął.
    expect(po.kolejnosc.length).toBe(przed.kolejnosc.length);
    expect(JSON.stringify(po)).not.toBe(JSON.stringify(przed));
  });

  it("nie rusza korekt prowadzącego", async () => {
    const korekta = await prisma.korekta.create({
      data: { uczestnikId, typ: "do_przeliczenia", uzasadnienie: "test" },
    });
    await wyczyscModul(uczestnikId, "A3");
    expect(await prisma.korekta.count({ where: { id: korekta.id } })).toBe(1);
    await prisma.korekta.delete({ where: { id: korekta.id } });
  });

  it("nie rusza odpowiedzi innych uczestników", async () => {
    const inny = await uczestnikTestowy("analityczny");
    const przed = await prisma.odpowiedz.count({ where: { uczestnikId: inny.id, modul: "A4" } });
    expect(przed).toBeGreaterThan(0);
    await wyczyscModul(uczestnikId, "A4");
    expect(await prisma.odpowiedz.count({ where: { uczestnikId: inny.id, modul: "A4" } })).toBe(
      przed,
    );
  });
});
