/**
 * Zachowanie przy zerwanym połączeniu. Uczestnik wypełnia moduł na telefonie
 * w szkole: utrata sieci nie może oznaczać cichej utraty odpowiedzi.
 */

import { describe, expect, it } from "vitest";
import { KolejkaZapisu } from "@/lib/moduly/kolejka-zapisu";

/** Wysyłka, którą da się włączać i wyłączać jak sieć. */
function siec() {
  const zapisane: Array<{ pozycja: string; tresc: unknown }> = [];
  let dziala = true;
  let prob = 0;
  return {
    zapisane,
    prob: () => prob,
    wlacz: () => (dziala = true),
    wylacz: () => (dziala = false),
    wyslij: async (z: { pozycja: string; tresc: unknown }) => {
      prob++;
      if (!dziala) throw new Error("brak połączenia");
      zapisane.push({ ...z });
    },
  };
}

/** Bez prawdziwego czekania: testy mają być natychmiastowe. */
const bezCzekania = async () => {};

describe("kolejka zapisu", () => {
  it("przy działającej sieci zapisuje od pierwszego razu", async () => {
    const s = siec();
    const k = new KolejkaZapisu({ wyslij: s.wyslij, poczekaj: bezCzekania });
    k.zapisz("blok_1", { a: 1 });
    expect(await k.oproznij()).toBe(true);
    expect(s.zapisane).toEqual([{ pozycja: "blok_1", tresc: { a: 1 } }]);
    expect(s.prob()).toBe(1);
    expect(k.nieZapisane).toBe(0);
  });

  it("ponawia przy błędzie i kończy powodzeniem, gdy sieć wraca", async () => {
    const s = siec();
    const k = new KolejkaZapisu({ wyslij: s.wyslij, poczekaj: bezCzekania, odstepy: [1, 1, 1] });
    s.wylacz();
    k.zapisz("blok_1", { a: 1 });
    // Sieć wraca w trakcie ponowień.
    setTimeout(() => s.wlacz(), 0);
    await new Promise((r) => setTimeout(r, 5));
    expect(await k.oproznij()).toBe(true);
    expect(s.zapisane).toHaveLength(1);
  });

  it("po wyczerpaniu ponowień pozycja zostaje w zaległych, nie znika", async () => {
    const s = siec();
    s.wylacz();
    const k = new KolejkaZapisu({ wyslij: s.wyslij, poczekaj: bezCzekania, odstepy: [1, 1] });
    k.zapisz("blok_1", { a: 1 });
    expect(await k.oproznij()).toBe(false);
    expect(k.nieZapisane).toBe(1);
    expect(k.zaleglePozycje).toEqual(["blok_1"]);
    expect(s.zapisane).toEqual([]);
  });

  it("po powrocie sieci zaległe odpowiedzi dochodzą", async () => {
    const s = siec();
    s.wylacz();
    const k = new KolejkaZapisu({ wyslij: s.wyslij, poczekaj: bezCzekania, odstepy: [1] });
    k.zapisz("blok_1", { a: 1 });
    k.zapisz("blok_2", { a: 2 });
    expect(await k.oproznij()).toBe(false);
    expect(k.nieZapisane).toBe(2);

    s.wlacz();
    await k.ponow();
    expect(k.nieZapisane).toBe(0);
    expect(s.zapisane.map((z) => z.pozycja).sort()).toEqual(["blok_1", "blok_2"]);
  });

  it("nowsza odpowiedź na tę samą pozycję zastępuje starszą", async () => {
    const s = siec();
    s.wylacz();
    const k = new KolejkaZapisu({ wyslij: s.wyslij, poczekaj: bezCzekania, odstepy: [1] });
    k.zapisz("blok_1", { a: 1 });
    k.zapisz("blok_1", { a: 2 });
    await k.oproznij();
    s.wlacz();
    await k.ponow();
    expect(s.zapisane).toEqual([{ pozycja: "blok_1", tresc: { a: 2 } }]);
    expect(k.nieZapisane).toBe(0);
  });

  it("melduje o zmianie liczby niezapisanych pozycji", async () => {
    const s = siec();
    s.wylacz();
    const zmiany: number[] = [];
    const k = new KolejkaZapisu({
      wyslij: s.wyslij,
      poczekaj: bezCzekania,
      odstepy: [1],
      naZmiane: (n) => zmiany.push(n),
    });
    k.zapisz("blok_1", { a: 1 });
    await k.oproznij();
    expect(zmiany[0]).toBe(1);
    s.wlacz();
    await k.ponow();
    expect(zmiany.at(-1)).toBe(0);
  });
});
