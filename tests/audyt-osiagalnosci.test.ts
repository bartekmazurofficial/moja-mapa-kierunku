/**
 * Audyt osiagalnosci na pelnej bazie 157 zawodow.
 * Przepisany z 08_kod_referencyjny/audyt_osiagalnosci.py.
 *
 * Testy T11-T16 z rozdzialu 13 audytu rozdzielczosci. Progi, nie rownosci:
 * generator liczb losowych w TypeScripcie nie odtworzy sekwencji Pythona,
 * wiec sprawdzamy warunki, ktore maja byc spelnione, a nie konkretne cyfry.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import type { BazaReferencyjna, Zawod } from "@/lib/domain/typy";

let baza: BazaReferencyjna;
let zawody: Zawod[];

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
  zawody = baza.zawody;
});

/** Deterministyczny generator: ten sam wynik audytu przy kazdym uruchomieniu. */
function losowy(ziarno: number): () => number {
  let a = ziarno >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function probka<T>(pula: T[], ile: number, rnd: () => number): Set<T> {
  const kopia = [...pula];
  const wynik = new Set<T>();
  for (let i = 0; i < ile && kopia.length > 0; i++) {
    wynik.add(kopia.splice(Math.floor(rnd() * kopia.length), 1)[0]);
  }
  return wynik;
}

/** Uproszczone dopasowanie z audytu: 0,6 na zainteresowania, 0,4 na kompetencje. */
function dopasowanie(pa1: Set<string>, pa2: Set<string>, z: Zawod): number {
  const p1 = z.a1.filter((k) => pa1.has(k)).length / z.a1.length;
  const p2 = z.a2r.filter((k) => pa2.has(k)).length / z.a2r.length;
  return 0.6 * p1 + 0.4 * p2;
}

function topN(pa1: Set<string>, pa2: Set<string>, n: number): string[] {
  return [...zawody]
    .map((z) => ({ kod: z.kod, w: dopasowanie(pa1, pa2, z) }))
    .sort((a, b) => b.w - a.w || a.kod.localeCompare(b.kod))
    .slice(0, n)
    .map((x) => x.kod);
}

const N = 6000;

describe("audyt osiągalności, T11–T14", () => {
  it("T11: każdy ze 157 zawodów jest osiągalny przy jakimś profilu", () => {
    const wszystkieA1 = [...new Set(zawody.flatMap((z) => z.a1))];
    const wszystkieA2 = [...new Set(zawody.flatMap((z) => z.a2r))];
    const rnd = losowy(7);
    const osiagalne = new Set<string>();
    for (let i = 0; i < N; i++) {
      const pa1 = probka(wszystkieA1, 5, rnd);
      const pa2 = probka(wszystkieA2, 6, rnd);
      for (const kod of topN(pa1, pa2, 10)) osiagalne.add(kod);
    }
    const sieroty = zawody.filter((z) => !osiagalne.has(z.kod)).map((z) => z.kod);
    expect(sieroty).toEqual([]);
    expect(osiagalne.size).toBe(157);
  });

  it("T12: każdy zawód wygrywa własny profil idealny albo jest w klastrze ze zwycięzcą", () => {
    const przegrywajace: string[] = [];
    for (const z of zawody) {
      const zwyciezca = topN(new Set(z.a1), new Set(z.a2r), 1)[0];
      if (zwyciezca === z.kod) continue;
      const inny = zawody.find((x) => x.kod === zwyciezca)!;
      if (z.klaster && z.klaster === inny.klaster) continue;
      przegrywajace.push(`${z.kod} przegrywa z ${zwyciezca}`);
    }
    expect(przegrywajace).toEqual([]);
  });

  it("T13: żaden zawód nie wychodzi w więcej niż 15% profili", () => {
    const wszystkieA1 = [...new Set(zawody.flatMap((z) => z.a1))];
    const wszystkieA2 = [...new Set(zawody.flatMap((z) => z.a2r))];
    const rnd = losowy(11);
    const licznik = new Map<string, number>();
    for (let i = 0; i < N; i++) {
      const pa1 = probka(wszystkieA1, 5, rnd);
      const pa2 = probka(wszystkieA2, 6, rnd);
      for (const kod of topN(pa1, pa2, 10)) licznik.set(kod, (licznik.get(kod) ?? 0) + 1);
    }
    const najczestszy = [...licznik.entries()].sort((a, b) => b[1] - a[1])[0];
    expect(najczestszy[1] / N, najczestszy[0]).toBeLessThan(0.15);
  });

  it("T14: różnorodność TOP3 powyżej 0,7", () => {
    const wszystkieA1 = [...new Set(zawody.flatMap((z) => z.a1))];
    const wszystkieA2 = [...new Set(zawody.flatMap((z) => z.a2r))];
    const rnd = losowy(11);
    const trojki = new Set<string>();
    for (let i = 0; i < N; i++) {
      const pa1 = probka(wszystkieA1, 5, rnd);
      const pa2 = probka(wszystkieA2, 6, rnd);
      trojki.add(topN(pa1, pa2, 3).join("|"));
    }
    expect(trojki.size / N).toBeGreaterThan(0.7);
  });

  it("T15: każdy klaster ma pytanie rozstrzygające", () => {
    for (const k of baza.klastry) {
      expect(k.pytanie.trim().length, k.kod).toBeGreaterThan(10);
    }
    const wKlastrach = baza.klastry.reduce((s, k) => s + k.sklad.length, 0);
    expect(wKlastrach).toBe(54);
  });

  it("sześć par o identycznej sygnaturze i wszystkie są w klastrach", () => {
    const sygnatury = new Map<string, string[]>();
    for (const z of zawody) {
      const s = `${z.obszar}|${[...z.a1].sort().join(",")}|${[...z.a2r].sort().join(",")}`;
      sygnatury.set(s, [...(sygnatury.get(s) ?? []), z.kod]);
    }
    const klony = [...sygnatury.values()].filter((v) => v.length > 1);
    expect(klony).toHaveLength(6);
    for (const grupa of klony) {
      const klastry = new Set(grupa.map((k) => zawody.find((z) => z.kod === k)!.klaster));
      expect(klastry.size, grupa.join("+")).toBe(1);
      expect([...klastry][0]).not.toBeNull();
    }
  });
});
