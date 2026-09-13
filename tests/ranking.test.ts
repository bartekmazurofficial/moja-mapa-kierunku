/**
 * Układanie kolejności w zestawie A1 i A2.
 *
 * Uczestnik przestawia wiersze, a miejsce na liście jest odpowiedzią. Zapis
 * do bazy musi zostać dokładnie taki jak przy dawnym nadawaniu numerów,
 * `{ identyfikator: miejsce 1-4 }`, bo od tego zależy silnik: cztery
 * niezerowe wagi, suma zero na zestaw.
 */

import { describe, expect, it } from "vitest";
import { kolejnoscDoPokazania, naMiejsca, przenies } from "@/lib/moduly/ranking";

const KODY = ["a", "b", "c", "d"];

describe("miejsca z kolejności", () => {
  it("pierwszy wiersz dostaje jedynkę, ostatni czwórkę", () => {
    expect(naMiejsca(KODY)).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("przestawiona lista daje przestawione miejsca", () => {
    expect(naMiejsca(["c", "a", "d", "b"])).toEqual({ c: 1, a: 2, d: 3, b: 4 });
  });

  it("każdy zestaw ma cztery różne miejsca, więc suma wag wychodzi zero", () => {
    const miejsca = Object.values(naMiejsca(KODY));
    expect(new Set(miejsca).size).toBe(4);
    expect(miejsca.sort()).toEqual([1, 2, 3, 4]);
  });
});

describe("kolejność do pokazania", () => {
  it("bez zapisu zostaje kolejność wyjściowa, czyli ta wylosowana w planie", () => {
    expect(kolejnoscDoPokazania(KODY, undefined)).toEqual(KODY);
  });

  it("zapis wraca jako kolejność wierszy", () => {
    expect(kolejnoscDoPokazania(KODY, { a: 3, b: 1, c: 4, d: 2 })).toEqual(["b", "d", "a", "c"]);
  });

  it("zapis niepełny traktujemy jak jego brak, nie zgadujemy reszty", () => {
    expect(kolejnoscDoPokazania(KODY, { a: 1, b: 2 })).toEqual(KODY);
  });

  it("zapis z cudzymi identyfikatorami nie wywraca listy", () => {
    expect(kolejnoscDoPokazania(KODY, { x: 1, y: 2, z: 3, w: 4 })).toEqual(KODY);
  });

  it("kolejność i miejsca są swoimi odwrotnościami", () => {
    const ustawiona = ["d", "b", "a", "c"];
    expect(kolejnoscDoPokazania(KODY, naMiejsca(ustawiona))).toEqual(ustawiona);
  });
});

describe("przenoszenie wiersza", () => {
  it("w górę: reszta zsuwa się w dół", () => {
    expect(przenies(KODY, "c", 0)).toEqual(["c", "a", "b", "d"]);
  });

  it("w dół: reszta zsuwa się w górę", () => {
    expect(przenies(KODY, "a", 3)).toEqual(["b", "c", "d", "a"]);
  });

  it("o jedno miejsce to zamiana sąsiadów", () => {
    expect(przenies(KODY, "b", 2)).toEqual(["a", "c", "b", "d"]);
  });

  it("poza zakres nie rusza listy, więc strzałka na końcu nic nie psuje", () => {
    expect(przenies(KODY, "a", -1)).toEqual(KODY);
    expect(przenies(KODY, "d", 4)).toEqual(KODY);
  });

  it("nieznany wiersz nie rusza listy", () => {
    expect(przenies(KODY, "x", 1)).toEqual(KODY);
  });

  it("lista zawsze zostaje kompletna i bez powtórzeń", () => {
    const po = przenies(przenies(KODY, "d", 0), "b", 3);
    expect([...po].sort()).toEqual(KODY);
  });
});
