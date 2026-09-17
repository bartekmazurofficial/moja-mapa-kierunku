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
    const stan = await coZniknie(uczestnikId, "Z");
    const wszystkie = await prisma.odpowiedz.count({ where: { uczestnikId, modul: "Z" } });
    const markery = await prisma.odpowiedz.count({
      where: { uczestnikId, modul: "Z", pozycja: MARKER_ZAKONCZENIA },
    });
    expect(stan.odpowiedzi).toBe(wszystkie - markery);
    expect(stan.gotowy).toBe(true);
    expect(stan.zakonczoneCzesci).toEqual(["A", "B", "C", "D"]);
  });

  it("podaje datę ostatniego zapisu, bo okno potwierdzenia nią mówi", async () => {
    const stan = await coZniknie(uczestnikId, "Z");
    const ostatnia = await prisma.odpowiedz.findFirst({
      where: { uczestnikId, modul: "Z", zakonczona: { not: null } },
      orderBy: { zakonczona: "desc" },
      select: { zakonczona: true },
    });
    expect(stan.ostatniZapis?.getTime() ?? null).toBe(ostatnia?.zakonczona?.getTime() ?? null);
  });

  it("nic nie kasuje", async () => {
    const przed = await prisma.odpowiedz.count({ where: { uczestnikId, modul: "Z" } });
    await coZniknie(uczestnikId, "Z");
    expect(await prisma.odpowiedz.count({ where: { uczestnikId, modul: "Z" } })).toBe(przed);
  });
});

describe("wyczyszczenie modułu", () => {
  it("kasuje odpowiedzi i postęp tylko tego modułu", async () => {
    const innyPrzed = await prisma.odpowiedz.count({ where: { uczestnikId, modul: "L" } });
    expect(innyPrzed).toBeGreaterThan(0);

    await pobierzPlan(uczestnikId, "Z");
    const { odpowiedzi } = await wyczyscModul(uczestnikId, "Z");

    expect(odpowiedzi).toBeGreaterThan(0);
    expect(await prisma.odpowiedz.count({ where: { uczestnikId, modul: "Z" } })).toBe(0);
    expect(
      await prisma.postepModulu.count({ where: { uczestnikId, kod: "Z" } }),
    ).toBe(0);
    expect(await prisma.odpowiedz.count({ where: { uczestnikId, modul: "L" } })).toBe(innyPrzed);

    // Po wyczyszczeniu nie ma czego pokazac w oknie potwierdzenia, wiec
    // strona `od-nowa` wpuszcza wprost w modul zamiast pytac o zgode na nic.
    const pusty = await coZniknie(uczestnikId, "Z");
    expect(pusty.cokolwiek).toBe(false);
    expect(pusty.ostatniZapis).toBeNull();
  });

  it("moduł wraca na pierwszą część i daje się wypełnić jeszcze raz", async () => {
    const stan = await pobierzStanModulu(uczestnikId, "Z");
    expect(stan.czesc).toBe("A");
    expect(stan.definicja).not.toBeNull();
    expect(stan.zakonczoneCzesci).toEqual([]);

    await wypelnijUczestnika(uczestnikId, "spoleczny");
    const poNowym = await coZniknie(uczestnikId, "Z");
    expect(poNowym.gotowy).toBe(true);
  });

  it("kasuje postęp modułu, nie tylko odpowiedzi", async () => {
    // Postęp trzyma plan i znacznik rozpoczęcia. Bez jego skasowania moduł
    // wyglądałby w panelu prowadzącego na rozpoczęty, choć jest pusty.
    await pobierzPlan(uczestnikId, "Z");
    expect(
      await prisma.postepModulu.count({ where: { uczestnikId, kod: "Z" } }),
    ).toBe(1);
    await wyczyscModul(uczestnikId, "Z");
    expect(
      await prisma.postepModulu.count({ where: { uczestnikId, kod: "Z" } }),
    ).toBe(0);
  });

  it("nie rusza korekt prowadzącego", async () => {
    const korekta = await prisma.korekta.create({
      data: { uczestnikId, typ: "do_przeliczenia", uzasadnienie: "test" },
    });
    await wyczyscModul(uczestnikId, "U");
    expect(await prisma.korekta.count({ where: { id: korekta.id } })).toBe(1);
    await prisma.korekta.delete({ where: { id: korekta.id } });
  });

  it("nie rusza odpowiedzi innych uczestników", async () => {
    const inny = await uczestnikTestowy("analityczny");
    const przed = await prisma.odpowiedz.count({ where: { uczestnikId: inny.id, modul: "F" } });
    expect(przed).toBeGreaterThan(0);
    await wyczyscModul(uczestnikId, "F");
    expect(await prisma.odpowiedz.count({ where: { uczestnikId: inny.id, modul: "F" } })).toBe(
      przed,
    );
  });
});
