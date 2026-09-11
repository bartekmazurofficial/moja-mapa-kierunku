/**
 * Ile treści mieści się na jednym ekranie.
 *
 * Dwie reguły z pilotażowego przeglądu: warunek A5 dostaje własny ekran,
 * a wynik wymiaru dwubiegunowego opisuje się nazwą, nie kodem.
 */

import { describe, expect, it } from "vitest";
import { CZESCI_MODULOW, NAZWY_M1, etykietaM1, zbudujCzesc } from "@/lib/moduly/ekrany";
import { zbudujPlan } from "@/lib/moduly/plan";
import { FILTRY_A5, WYMIARY_M1 } from "@/lib/domain/slowniki";

describe("filtry rzeczywistości", () => {
  const czesc = zbudujCzesc("A5", "A", zbudujPlan("A5"), {});

  it("każdy warunek ma własny ekran", () => {
    const ekranyZPozycjami = czesc.ekrany.filter((e) => e.typ === "pozycje");
    expect(ekranyZPozycjami).toHaveLength(FILTRY_A5.length);
    for (const e of ekranyZPozycjami) {
      expect(e.pozycje, e.klucz).toHaveLength(1);
    }
  });

  it("postęp liczy warunki, nie bloki", () => {
    const zPostepem = czesc.ekrany.filter((e) => e.postep);
    expect(zPostepem).toHaveLength(FILTRY_A5.length);
    expect(zPostepem[0].postep!.z).toBe(FILTRY_A5.length);
    expect(zPostepem[0].postep!.slowo).toBe("warunków");
  });

  it("na ekranie warunku jest jedna decyzja i nic poza nią", () => {
    for (const e of czesc.ekrany.filter((x) => x.typ === "pozycje")) {
      expect(e.pozycje, e.klucz).toHaveLength(1);
      expect(e.pozycje![0].typ, e.klucz).toBe("trzystopniowa");
    }
  });

  it("nagłówek nadal mówi, z jakiej grupy jest warunek", () => {
    const nazwy = new Set(FILTRY_A5.map((f) => f.nazwaBloku));
    for (const e of czesc.ekrany.filter((x) => x.typ === "pozycje")) {
      expect(nazwy.has(e.naglowek ?? ""), e.klucz).toBe(true);
    }
  });
});

describe("wymiary kształtu życia", () => {
  it("każdy ma nazwę dla uczestnika, nie sam kod", () => {
    for (const w of WYMIARY_M1) {
      const nazwa = NAZWY_M1[w.kod];
      expect(nazwa, w.kod).toBeTruthy();
      expect(nazwa, w.kod).not.toBe(w.kod);
      expect(nazwa.length, w.kod).toBeGreaterThan(3);
    }
  });

  it("etykieta opisuje stronę, a nie poziom", () => {
    for (const w of WYMIARY_M1) {
      for (const pozycja of [0, 50, 100]) {
        const e = etykietaM1(w.kod, pozycja);
        expect(e, `${w.kod} ${pozycja}`).toBeTruthy();
        expect(e, `${w.kod} ${pozycja}`).not.toMatch(/wysoko|nisko|pośrodku/);
      }
    }
  });
});

describe("ranking w zestawie", () => {
  it("zestaw ma cztery pozycje, więc mieści się w dwóch rzędach po dwa", () => {
    for (const modul of ["A1", "A2"] as const) {
      const czesc = zbudujCzesc(modul, "A", zbudujPlan(modul), {});
      const rankingi = czesc.ekrany.flatMap((e) => (e.pozycje ?? []).filter((p) => p.typ === "ranking4"));
      expect(rankingi.length, modul).toBeGreaterThan(0);
      for (const r of rankingi) expect(r.opcje, `${modul} ${r.id}`).toHaveLength(4);
    }
  });
});
