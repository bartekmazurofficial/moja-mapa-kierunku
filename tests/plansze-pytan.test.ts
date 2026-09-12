/**
 * Plansza i znak przy każdym pytaniu.
 *
 * Zgłoszenie z przeglądu: każde pytanie ma mieć nad blokami odpowiedzi pas
 * na całej ich szerokości, a każdy blok odpowiedzi ma mieć znak.
 */

import { describe, expect, it } from "vitest";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, zbudujCzesc } from "@/lib/moduly/ekrany";
import { zbudujPlan } from "@/lib/moduly/plan";
import { GLIFY } from "@/lib/ui/glify";
import { kolorKategorii } from "@/lib/ui/kolory";
import type { Ekran } from "@/lib/moduly/typy";

/** Pytania z jedną decyzją: to one dostają planszę na całą szerokość. */
const JEDNA_DECYZJA = ["para", "trzystopniowa"];

function ekranyModulow(): Array<{ modul: string; ekran: Ekran }> {
  const wynik: Array<{ modul: string; ekran: Ekran }> = [];
  for (const m of KOLEJNOSC_MODULOW) {
    const plan = zbudujPlan(m);
    for (const c of CZESCI_MODULOW[m]) {
      for (const ekran of zbudujCzesc(m, c, plan, {}).ekrany) wynik.push({ modul: m, ekran });
    }
  }
  return wynik;
}

describe("plansza pytania", () => {
  const wszystkie = ekranyModulow();

  it("każde pytanie z jedną decyzją ma klucz planszy", () => {
    const pytania = wszystkie.filter(
      ({ ekran }) =>
        ekran.typ === "pozycje" &&
        (ekran.pozycje ?? []).length === 1 &&
        JEDNA_DECYZJA.includes(ekran.pozycje![0].typ),
    );
    expect(pytania.length).toBeGreaterThan(150);
    for (const { modul, ekran } of pytania) {
      expect(ekran.ikona ?? ekran.kolor, `${modul} ${ekran.klucz}`).toBeTruthy();
    }
  });

  it("klucz planszy ma narysowany znak, więc pas nigdy nie jest pusty", () => {
    for (const { modul, ekran } of wszystkie) {
      const klucz = ekran.ikona ?? ekran.kolor;
      if (!klucz) continue;
      expect(GLIFY[klucz], `${modul} ${ekran.klucz}: ${klucz}`).toBeTruthy();
    }
  });
});

describe("znak w bloku odpowiedzi", () => {
  it("obie strony każdej pary mają znak", () => {
    for (const { modul, ekran } of ekranyModulow()) {
      for (const p of ekran.pozycje ?? []) {
        if (p.typ !== "para") continue;
        expect(p.stronaA?.ikona, `${modul} ${p.id} lewa`).toBeTruthy();
        expect(p.stronaB?.ikona, `${modul} ${p.id} prawa`).toBeTruthy();
        expect(GLIFY[p.stronaA!.ikona!], `${modul} ${p.id} lewa`).toBeTruthy();
        expect(GLIFY[p.stronaB!.ikona!], `${modul} ${p.id} prawa`).toBeTruthy();
      }
    }
  });

  it("każda pozycja w siatce ma znak swojej kategorii", () => {
    for (const { modul, ekran } of ekranyModulow()) {
      const pozycje = ekran.pozycje ?? [];
      if (pozycje.length < 6) continue;
      if (!pozycje.every((p) => ["skala5", "kotwica", "dowody"].includes(p.typ))) continue;
      for (const p of pozycje) {
        expect(p.ikona, `${modul} ${p.id}`).toBeTruthy();
        expect(GLIFY[p.ikona!], `${modul} ${p.id}: ${p.ikona}`).toBeTruthy();
      }
    }
  });
});

describe("kolory pary", () => {
  it("strony pary nigdy nie dostają tego samego koloru", async () => {
    const { paraKolorow } = await import("@/lib/ui/kolory");
    for (const { ekran } of ekranyModulow()) {
      for (const p of ekran.pozycje ?? []) {
        if (p.typ !== "para") continue;
        const a = kolorKategorii(p.stronaA!.ikona!);
        const b = kolorKategorii(p.stronaB!.ikona!);
        const [x, y] = a.kod !== b.kod ? [a, b] : paraKolorow((ekran.ikona ?? ekran.kolor)!);
        expect(x.kod, `${ekran.klucz}`).not.toBe(y.kod);
      }
    }
  });
});
