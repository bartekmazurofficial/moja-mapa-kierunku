/**
 * Obszar silnika a obszar zainteresowań A1: dwa słowniki o tych samych numerach.
 *
 * Silnik ma dwadzieścia siedem obszarów zawodowych, A1 dwadzieścia cztery
 * obszary zainteresowań, a numery są niezależne: obszar 4 w bazie to finanse,
 * obszar 4 w A1 to ciało, ruch i teren. Wzięcie jednego numeru za drugi daje
 * zawodowi cudzą ilustrację i cudzy kolor, i nie rzuca się w oczy.
 *
 * Ten test pilnuje, żeby most między słownikami istniał i był policzalny dla
 * każdego obszaru.
 */

import { describe, expect, it, beforeAll } from "vitest";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import { znakObszaru } from "@/lib/karty/obszary";
import { OBSZARY_A1 } from "@/lib/domain/slowniki";
import type { BazaReferencyjna } from "@/lib/domain/typy";

let baza: BazaReferencyjna;

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
});

describe("most między obszarami silnika a obszarami A1", () => {
  it("to naprawdę są dwa różne słowniki", () => {
    expect(baza.obszary).toHaveLength(27);
    expect(OBSZARY_A1).toHaveLength(24);
    const finanse = baza.obszary.find((o) => o.id === 4);
    expect(finanse?.nazwa).toContain("Finanse");
    expect(OBSZARY_A1.find((o) => o.id === 4)?.nazwaTechniczna).not.toContain("Finanse");
  });

  it("każdy obszar silnika ma znak A1", () => {
    for (const o of baza.obszary) {
      expect(znakObszaru(o.zainteresowania), o.nazwa).toMatch(/^a1-\d{1,2}$/);
    }
  });

  it("znak wskazuje istniejący obszar A1", () => {
    const numery = new Set(OBSZARY_A1.map((o) => o.id));
    for (const o of baza.obszary) {
      const numer = Number(znakObszaru(o.zainteresowania)!.slice(3));
      expect(numery.has(numer), `${o.nazwa} -> ${numer}`).toBe(true);
    }
  });

  it("znak jest ten sam przy każdym wywołaniu, także przy remisie wag", () => {
    const remis = { "9": 3, "3": 3, "17": 1 };
    expect(znakObszaru(remis)).toBe("a1-3");
    expect(znakObszaru({ "3": 3, "9": 3, "17": 1 })).toBe("a1-3");
  });

  it("pusta mapa nie daje znaku zamiast zgadywać", () => {
    expect(znakObszaru({})).toBeNull();
  });
});
