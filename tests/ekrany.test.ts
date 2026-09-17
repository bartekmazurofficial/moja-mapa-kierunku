/**
 * Struktura ekranow: czy kazdy modul da sie zlozyc i czy identyfikatory
 * pozycji sa unikalne. Regresja: numer ekranu poza zakresem wygaszal ekran
 * i uczestnik zostawal na pustej stronie, z ktorej nie da sie wyjsc.
 */

import { describe, expect, it } from "vitest";
import { zbudujPlan } from "@/lib/moduly/plan";
import {
  CZESCI_MODULOW,
  zbudujCzesc,
  NAZWY_MODULOW,
  KOLEJNOSC_MODULOW,
  liczbaPozycjiModulu,
  minutyModulu,
  zakresPozycjiModulu,
} from "@/lib/moduly/ekrany";
import { pozycjaKompletna } from "@/lib/moduly/walidacja";
import type { KodModulu } from "@/lib/moduly/typy";

const MODULY = Object.keys(CZESCI_MODULOW) as KodModulu[];

describe("wszystkie moduły dają się złożyć", () => {
  it("cztery moduły, każdy z co najmniej jedną częścią", () => {
    expect(MODULY).toHaveLength(4);
    expect(KOLEJNOSC_MODULOW).toHaveLength(4);
    expect(new Set(KOLEJNOSC_MODULOW).size).toBe(4);
    for (const m of MODULY) {
      expect(CZESCI_MODULOW[m].length).toBeGreaterThan(0);
      expect(NAZWY_MODULOW[m].length).toBeGreaterThan(3);
    }
  });

  it("każda część każdego modułu buduje się bez błędu i ma ekrany", () => {
    for (const modul of MODULY) {
      const plan = zbudujPlan(modul);
      for (const czesc of CZESCI_MODULOW[modul]) {
        const definicja = zbudujCzesc(modul, czesc, plan, {});
        expect(definicja.ekrany.length, `${modul}${czesc}`).toBeGreaterThan(0);
        for (const e of definicja.ekrany) {
          expect(e.klucz, `${modul}${czesc}`).toBeTruthy();
          if (e.typ === "pozycje") expect((e.pozycje ?? []).length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("identyfikatory pozycji są unikalne w obrębie części", () => {
    for (const modul of MODULY) {
      const plan = zbudujPlan(modul);
      const widziane = new Set<string>();
      for (const czesc of CZESCI_MODULOW[modul]) {
        for (const e of zbudujCzesc(modul, czesc, plan, {}).ekrany) {
          for (const p of e.pozycje ?? []) {
            expect(widziane.has(`${czesc}/${p.id}`), `${modul} ${czesc} ${p.id}`).toBe(false);
            widziane.add(`${czesc}/${p.id}`);
          }
        }
      }
    }
  });

  it("nieznana część rzuca błędem, a nie oddaje pustego ekranu", () => {
    expect(() => zbudujCzesc("Z", "X", zbudujPlan("Z"), {})).toThrow();
  });

  it("miary modułu są dodatnie i spójne", () => {
    for (const m of MODULY) {
      expect(liczbaPozycjiModulu(m), m).toBeGreaterThan(0);
      expect(minutyModulu(m), m).toBeGreaterThanOrEqual(2);
      const zakres = zakresPozycjiModulu(m);
      expect(zakres.min).toBeLessThanOrEqual(zakres.max);
    }
  });

  it("pozycja bez odpowiedzi nie przepuszcza dalej", () => {
    expect(pozycjaKompletna({ id: "x", typ: "pojedynczy" }, undefined)).toBe(false);
    expect(pozycjaKompletna({ id: "x", typ: "pojedynczy" }, "tak")).toBe(true);
    expect(pozycjaKompletna({ id: "x", typ: "pojedynczy", opcjonalna: true }, undefined)).toBe(true);
  });
});
