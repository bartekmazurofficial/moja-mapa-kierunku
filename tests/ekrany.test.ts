/**
 * Struktura ekranow assessmentu: czy kazdy modul da sie zlozyc, czy nie ma
 * duplikatow identyfikatorow i czy plan losowy jest utrwalalny.
 */

import { describe, expect, it } from "vitest";
import { zbudujPlan } from "@/lib/moduly/plan";
import { CZESCI_MODULOW, zbudujCzesc, NAZWY_MODULOW, KOLEJNOSC_MODULOW } from "@/lib/moduly/ekrany";
import { pozycjaKompletna } from "@/lib/moduly/walidacja";
import type { KodModulu } from "@/lib/moduly/typy";

const MODULY = Object.keys(CZESCI_MODULOW) as KodModulu[];

const KONTEKST = {
  a3Bieguny: { INI: "A", STR: "B" } as Record<string, "A" | "B">,
  a4Najwyzsza: "WOL",
  a5Odmowy: ["F01", "F11"],
  m1Szkice: { 1: "szkic", 2: "szkic", 3: "szkic", 5: "szkic", 7: "szkic" },
};

describe("wszystkie moduły dają się złożyć", () => {
  it("siedem modułów, każdy z co najmniej jedną częścią", () => {
    expect(MODULY).toHaveLength(7);
    expect(KOLEJNOSC_MODULOW).toHaveLength(7);
    expect(new Set(KOLEJNOSC_MODULOW).size).toBe(7);
    for (const m of MODULY) expect(NAZWY_MODULOW[m].length).toBeGreaterThan(3);
  });

  it("każda część każdego modułu buduje się bez błędu i ma ekrany", () => {
    for (const modul of MODULY) {
      const plan = zbudujPlan(modul);
      for (const czesc of CZESCI_MODULOW[modul]) {
        const definicja = zbudujCzesc(modul, czesc, plan, KONTEKST);
        expect(definicja.ekrany.length, `${modul}${czesc}`).toBeGreaterThan(0);
        for (const e of definicja.ekrany) {
          expect(e.klucz, `${modul}${czesc}`).toBeTruthy();
          if (e.typ === "pozycje") expect((e.pozycje ?? []).length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("identyfikatory pozycji są unikalne w obrębie modułu", () => {
    for (const modul of MODULY) {
      const plan = zbudujPlan(modul);
      const widziane = new Set<string>();
      for (const czesc of CZESCI_MODULOW[modul]) {
        const definicja = zbudujCzesc(modul, czesc, plan, KONTEKST);
        for (const e of definicja.ekrany) {
          for (const p of e.pozycje ?? []) {
            expect(widziane.has(`${czesc}/${p.id}`), `${modul} ${czesc} ${p.id}`).toBe(false);
            widziane.add(`${czesc}/${p.id}`);
          }
        }
      }
    }
  });

  it("A1 i A2 mają po jednym ekranie na blok, z czterema opcjami", () => {
    for (const [modul, ile] of [["A1", 36], ["A2", 45]] as const) {
      const plan = zbudujPlan(modul);
      const definicja = zbudujCzesc(modul, "A", plan, KONTEKST);
      const bloki = definicja.ekrany.filter((e) => e.pozycje?.[0]?.typ === "ranking4");
      expect(bloki, modul).toHaveLength(ile);
      for (const b of bloki) expect(b.pozycje![0].opcje).toHaveLength(4);
    }
  });

  it("postęp jest podawany w sztukach, nigdy w procentach", () => {
    for (const modul of MODULY) {
      const plan = zbudujPlan(modul);
      for (const czesc of CZESCI_MODULOW[modul]) {
        for (const e of zbudujCzesc(modul, czesc, plan, KONTEKST).ekrany) {
          if (!e.postep) continue;
          expect(e.postep.z).toBeGreaterThan(0);
          expect(e.postep.slowo).not.toContain("%");
        }
      }
    }
  });

  it("ekran wet pokazuje wyłącznie pozycje, na które padło NIE", () => {
    const definicja = zbudujCzesc("A5", "B", zbudujPlan("A5"), KONTEKST);
    const opcje = definicja.ekrany[0].pozycje![0].opcje ?? [];
    expect(opcje.map((o) => o.kod)).toEqual(["F01", "F11"]);
    expect(definicja.ekrany[0].pozycje![0].maksWyborow).toBe(3);
  });

  it("test kosztu nie pyta o wartość, która sama jest najwyższa", () => {
    const definicja = zbudujCzesc("A4", "C", zbudujPlan("A4"), { ...KONTEKST, a4Najwyzsza: "PIE" });
    const tresci = definicja.ekrany[0].pozycje!.map((p) => p.tresc ?? "");
    expect(tresci).toHaveLength(4);
    expect(tresci.join(" ")).not.toContain("wyraźnie wyższych zarobków");
  });
});

describe("plan losowy", () => {
  it("A1 miesza kolejność bloków, ale nie gubi ani jednego", () => {
    const plan = zbudujPlan("A1");
    expect(plan.kolejnosc).toHaveLength(36);
    expect(new Set(plan.kolejnosc).size).toBe(36);
    expect(Object.keys(plan.wewnatrz)).toHaveLength(36);
    for (const opcje of Object.values(plan.wewnatrz)) expect(opcje).toHaveLength(4);
  });

  it("A3, A4 i M1 losują stronę wyświetlania każdej pary", () => {
    for (const [modul, ile] of [["A3", 60], ["A4", 36], ["M1", 48]] as const) {
      const plan = zbudujPlan(modul);
      expect(plan.kolejnosc, modul).toHaveLength(ile);
      expect(Object.keys(plan.odwrocone), modul).toHaveLength(ile);
    }
  });

  it("A0 i A5 mają kolejność stałą: są pogrupowane tematycznie", () => {
    expect(zbudujPlan("A0").kolejnosc).toHaveLength(0);
    expect(zbudujPlan("A5").kolejnosc).toHaveLength(0);
  });
});

describe("blokada przewijania do przodu", () => {
  it("ranking jest kompletny dopiero przy czterech pozycjach", () => {
    const pozycja = { id: "x", typ: "ranking4" as const };
    expect(pozycjaKompletna(pozycja, { a: 1, b: 2 })).toBe(false);
    expect(pozycjaKompletna(pozycja, { a: 1, b: 2, c: 3, d: 4 })).toBe(true);
  });

  it("wybór dokładnie trzech nie przepuszcza dwóch ani czterech", () => {
    const pozycja = { id: "x", typ: "wielokrotny" as const, dokladnie: 3 };
    expect(pozycjaKompletna(pozycja, ["a", "b"])).toBe(false);
    expect(pozycjaKompletna(pozycja, ["a", "b", "c"])).toBe(true);
  });

  it("pozycja nieobowiązkowa nigdy nie blokuje przejścia", () => {
    expect(pozycjaKompletna({ id: "x", typ: "tekst", opcjonalna: true }, undefined)).toBe(true);
  });

  it("pozycja obowiązkowa bez odpowiedzi blokuje", () => {
    expect(pozycjaKompletna({ id: "x", typ: "pojedynczy" }, undefined)).toBe(false);
    expect(pozycjaKompletna({ id: "x", typ: "trzystopniowa" }, "moze")).toBe(true);
  });
});
