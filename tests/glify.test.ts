/**
 * Znaki kategorii. Zasada: ilustrujemy kategorię, nie pozycję — inaczej
 * trzeba by ponad czterystu obrazków, a lista bloków i tak wyglądałaby
 * jak ściana identycznych kafli.
 */

import { describe, expect, it } from "vitest";
import { GLIFY, odcien } from "@/lib/ui/glify";
import { OBSZARY_A1, KOMPETENCJE_A2, WYMIARY_A3, WARTOSCI_A4, FILTRY_A5 } from "@/lib/domain/slowniki";
import { OBSZARY_M1 } from "@/lib/content/m1";
import { BLOKI_A1 } from "@/lib/content/a1";
import { BLOKI_A2 } from "@/lib/content/a2";

describe("znaki kategorii", () => {
  it("każda kategoria z każdego modułu ma swój znak", () => {
    const brakujace: string[] = [];
    const sprawdz = (klucz: string) => {
      if (!GLIFY[klucz]) brakujace.push(klucz);
    };
    for (const o of OBSZARY_A1) sprawdz(`a1-${o.id}`);
    for (const k of KOMPETENCJE_A2) sprawdz(`a2-${k.id}`);
    for (const w of WYMIARY_A3) sprawdz(`a3-${w.kod}`);
    for (const v of WARTOSCI_A4) sprawdz(`a4-${v.kod}`);
    for (const b of new Set(FILTRY_A5.map((f) => f.blok))) sprawdz(`a5-${b}`);
    for (const m of OBSZARY_M1) sprawdz(`m1-${m.nr}`);
    expect(brakujace).toEqual([]);
  });

  it("żadne dwie kategorie nie mają identycznego rysunku", () => {
    const rysunki = Object.entries(GLIFY).map(([k, d]) => [k, d.join("|")] as const);
    const wedlugRysunku = new Map<string, string[]>();
    for (const [klucz, d] of rysunki) {
      wedlugRysunku.set(d, [...(wedlugRysunku.get(d) ?? []), klucz]);
    }
    // Powtórzenia wolno mieć tylko między modułami, nigdy w jednym.
    const wJednymModule = [...wedlugRysunku.values()]
      .filter((klucze) => klucze.length > 1)
      .filter((klucze) => new Set(klucze.map((k) => k.split("-")[0])).size === 1);
    expect(wJednymModule).toEqual([]);
  });

  it("w jednym zestawie A1 cztery pozycje to cztery różne obszary", () => {
    for (const blok of BLOKI_A1) {
      const obszary = blok.pozycje.map((p) => p.obszar);
      expect(new Set(obszary).size, `blok ${blok.index}`).toBe(obszary.length);
    }
  });

  it("w jednym zestawie A2 cztery pozycje to cztery różne kompetencje", () => {
    for (const blok of BLOKI_A2) {
      const kompetencje = blok.pozycje.map((p) => p.kompetencja);
      expect(new Set(kompetencje).size, `blok ${blok.index}`).toBe(kompetencje.length);
    }
  });

  it("odcień jest stały dla klucza i mieści się w palecie", () => {
    for (const klucz of Object.keys(GLIFY)) {
      const h = odcien(klucz);
      expect(h, klucz).toBeGreaterThanOrEqual(250);
      expect(h, klucz).toBeLessThanOrEqual(320);
      expect(odcien(klucz)).toBe(h);
    }
  });

  it("sąsiednie kategorie w zestawie różnią się odcieniem", () => {
    // Nie chodzi o wielką różnicę, tylko o to, żeby kafle nie były bliźniacze.
    for (const blok of BLOKI_A1) {
      const odcienie = blok.pozycje.map((p) => odcien(`a1-${p.obszar}`));
      expect(new Set(odcienie).size, `blok ${blok.index}`).toBeGreaterThan(1);
    }
  });
});
