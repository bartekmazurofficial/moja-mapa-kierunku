/**
 * Nadawanie numerów w zestawie czterech pozycji.
 * Jedna zasada: jeden numer należy do jednej pozycji.
 */

import { describe, expect, it } from "vitest";
import { dopelnijOstatni, nadajNumer, wlascicieleNumerow, type Ranking } from "@/lib/moduly/ranking";

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

/**
 * Dopełnienie czwartego miejsca.
 *
 * Czwarte stuknięcie nie niesie informacji: przy trzech nadanych numerach
 * czwarty jest wymuszony. Zapis wychodzi identyczny jak przy ręcznym nadaniu,
 * więc silnik liczy dokładnie to samo, a uczestnik ma o osiemdziesiąt jeden
 * stuknięć mniej w całym programie.
 */
describe("czwarte miejsce dopełnia się samo", () => {
  const kody = ["a", "b", "c", "d"];

  it("trzy nadane numery domykają zestaw", () => {
    const po = dopelnijOstatni({ a: 1, b: 2, c: 3 }, kody);
    expect(po).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("dopełnia niezależnie od tego, którego numeru brakuje", () => {
    expect(dopelnijOstatni({ a: 1, b: 4, c: 3 }, kody)).toEqual({ a: 1, b: 4, c: 3, d: 2 });
  });

  it("przy dwóch nadanych nie zgaduje", () => {
    expect(dopelnijOstatni({ a: 1, b: 2 }, kody)).toEqual({ a: 1, b: 2 });
  });

  it("pełny zestaw zostaje bez zmian", () => {
    const pelny = { a: 1, b: 2, c: 3, d: 4 };
    expect(dopelnijOstatni(pelny, kody)).toEqual(pelny);
  });

  it("dopełnienie daje ten sam wynik co ręczne nadanie czwartego numeru", () => {
    const recznie = nadajNumer({ a: 1, b: 2, c: 3 }, "d", 4);
    expect(dopelnijOstatni({ a: 1, b: 2, c: 3 }, kody)).toEqual(recznie);
  });
});
