/**
 * Nadawanie numerów w zestawie czterech pozycji.
 * Jedna zasada: jeden numer należy do jednej pozycji.
 */

import { describe, expect, it } from "vitest";
import { nadajNumer, wlascicieleNumerow, type Ranking } from "@/lib/moduly/ranking";

const KODY = ["a", "b", "c", "d"];

describe("nadawanie numerów", () => {
  it("pusty zestaw przyjmuje dowolny numer", () => {
    expect(nadajNumer({}, "a", 3)).toEqual({ a: 3 });
  });

  it("stuknięcie we własny numer zdejmuje go", () => {
    expect(nadajNumer({ a: 2, b: 1 }, "a", 2)).toEqual({ b: 1 });
  });

  it("numer zajęty przez kogoś innego przechodzi tam, gdzie kliknięto", () => {
    expect(nadajNumer({ a: 1, b: 2 }, "b", 1)).toEqual({ b: 1 });
  });

  it("pozycja trzyma najwyżej jeden numer", () => {
    const r = nadajNumer({ a: 1 }, "a", 4);
    expect(r).toEqual({ a: 4 });
  });

  it("żaden numer nie występuje dwa razy, cokolwiek się kliknie", () => {
    let r: Ranking = {};
    // Sto losowych, ale powtarzalnych kliknięć.
    let ziarno = 7;
    const losowa = () => (ziarno = (ziarno * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 0; i < 100; i++) {
      const kod = KODY[Math.floor(losowa() * KODY.length)];
      const numer = Math.floor(losowa() * 4) + 1;
      r = nadajNumer(r, kod, numer);
      const numery = Object.values(r);
      expect(new Set(numery).size, JSON.stringify(r)).toBe(numery.length);
      expect(Object.keys(r).length).toBeLessThanOrEqual(4);
    }
  });

  it("komplet czterech numerów da się złożyć czterema kliknięciami", () => {
    let r: Ranking = {};
    KODY.forEach((kod, i) => (r = nadajNumer(r, kod, i + 1)));
    expect(r).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    expect(Object.keys(r)).toHaveLength(4);
  });

  it("mapa właścicieli wskazuje pozycję każdego zajętego numeru", () => {
    const mapa = wlascicieleNumerow({ a: 1, c: 3 });
    expect(mapa.get(1)).toBe("a");
    expect(mapa.get(3)).toBe("c");
    expect(mapa.get(2)).toBeUndefined();
  });
});
