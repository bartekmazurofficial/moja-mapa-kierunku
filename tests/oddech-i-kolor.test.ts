/**
 * Dwie decyzje z przeglądu, które łatwo cofnąć przypadkiem.
 *
 * Oddech: w A1 i A2 uczestnik ma co dwanaście zestawów jedno zdanie i przycisk.
 * Bez tego to najdłuższy odcinek programu bez kontaktu i tam ludzie odpadają.
 *
 * Kolor: na ekranach wyboru nie ma koloru kategorii. Kolor jest przypisany
 * kategorii na stałe, więc w zestawie czterech pozycji podpowiadałby, z której
 * rodziny jest która, a przy trzydziestu sześciu zestawach da się tego nauczyć.
 */

import { describe, expect, it } from "vitest";
import { zbudujPlan } from "@/lib/moduly/plan";
import { zbudujCzesc } from "@/lib/moduly/ekrany";
import { ODDECHY } from "@/lib/content/wspolne";
import { TRYB_KOLORU_WYBORU, kolorKategorii, kolorWyboru } from "@/lib/ui/kolory";

/** Numery zestawów, po których w tej części stoi ekran oddechu. */
function poKtorychBlokach(modul: "A1" | "A2"): number[] {
  const plan = zbudujPlan(modul);
  const ekrany = zbudujCzesc(modul, "A", plan, {}).ekrany;
  const numery: number[] = [];
  let zestawow = 0;
  for (const e of ekrany) {
    if (e.typ === "pozycje" && e.pozycje?.[0]?.typ === "ranking4") zestawow += 1;
    if (e.typ === "przerwa" && e.klucz?.includes("oddech")) numery.push(zestawow);
  }
  return numery;
}

describe("oddech co dwanaście zestawów", () => {
  it("A1: po dwunastym i po dwudziestym czwartym z trzydziestu sześciu", () => {
    expect(poKtorychBlokach("A1")).toEqual([12, 24]);
  });

  it("A2: po dwunastym, dwudziestym czwartym i trzydziestym szóstym z czterdziestu pięciu", () => {
    expect(poKtorychBlokach("A2")).toEqual([12, 24, 36]);
  });

  it("oddech nie wypada na końcu części: po ostatnim zestawie idzie już zamknięcie", () => {
    for (const modul of ["A1", "A2"] as const) {
      const plan = zbudujPlan(modul);
      const ekrany = zbudujCzesc(modul, "A", plan, {}).ekrany;
      const zestawow = ekrany.filter((e) => e.pozycje?.[0]?.typ === "ranking4").length;
      for (const po of Object.keys(ODDECHY[modul]).map(Number)) {
        expect(po, `${modul}: oddech po ostatnim zestawie`).toBeLessThan(zestawow);
      }
    }
  });

  it("każdy ekran oddechu ma własny klucz i jedno zdanie", () => {
    const klucze = new Set<string>();
    for (const modul of ["A1", "A2"] as const) {
      const plan = zbudujPlan(modul);
      for (const e of zbudujCzesc(modul, "A", plan, {}).ekrany) {
        if (e.typ !== "przerwa") continue;
        expect(klucze.has(e.klucz)).toBe(false);
        klucze.add(e.klucz);
        expect(e.naglowek?.length ?? 0).toBeGreaterThan(10);
        // Stwierdzenie faktu, nigdy pochwała: w tych modułach nie da się iść dobrze.
        expect(e.naglowek?.toLowerCase()).not.toMatch(/świetnie|brawo|super|gratul/);
      }
    }
  });
});

describe("ekran wyboru nie niesie koloru kategorii", () => {
  it("kolor bierze się z miejsca na ekranie, nie z kategorii", () => {
    expect(TRYB_KOLORU_WYBORU).toBe("pozycja");
  });

  it("to samo miejsce ma ten sam kolor niezależnie od kategorii", () => {
    for (const klucz of ["a1-7", "a2-13", "a3-INI", "a4-PIE", undefined]) {
      expect(kolorWyboru(klucz, 0)?.kod).toBe(kolorWyboru("a1-1", 0)?.kod);
      expect(kolorWyboru(klucz, 3)?.kod).toBe(kolorWyboru("a1-1", 3)?.kod);
    }
  });

  it("cztery miejsca w zestawie mają cztery różne kolory", () => {
    const kody = [0, 1, 2, 3].map((i) => kolorWyboru(undefined, i)?.kod);
    expect(new Set(kody).size).toBe(4);
  });

  it("kolor kategorii dalej istnieje, bo raport i lista zawodów go używają", () => {
    expect(kolorKategorii("a1-7").kod).toBeTruthy();
  });

  it("bez podanego miejsca nie ma koloru: ekran wyboru nie zgaduje z kategorii", () => {
    expect(kolorWyboru("a1-7")).toBeNull();
  });
});
