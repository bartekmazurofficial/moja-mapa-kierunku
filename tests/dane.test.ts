/**
 * Faza 1: testy danych referencyjnych po imporcie.
 * Odpowiednik waliduj.py z 08_kod_referencyjny, uruchamiany na bazie.
 */

import { describe, expect, it, beforeAll } from "vitest";
import { pobierzBazeReferencyjna, pobierzZawod } from "@/lib/db/repozytorium";
import type { BazaReferencyjna } from "@/lib/domain/typy";
import { OBSZARY_A1, KOMPETENCJE_A2, WARTOSCI_A4, FILTRY_A5 } from "@/lib/domain/slowniki";
import {
  KODY_A1,
  KODY_A2,
  KODY_A3,
  KODY_A4,
  KODY_A5,
  KODY_M1,
  KODY_ANTY,
} from "@/lib/domain/kody-kart";

let baza: BazaReferencyjna;

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
});

describe("liczby w bazie", () => {
  it("27 obszarów, 157 zawodów, 75 kierunków, 56 dróg bez studiów, 26 klastrów", () => {
    expect(baza.obszary).toHaveLength(27);
    expect(baza.zawody).toHaveLength(157);
    expect(baza.kierunki).toHaveLength(75);
    expect(baza.drogiBezStudiow).toHaveLength(56);
    expect(baza.klastry).toHaveLength(26);
  });

  it("54 zawody w klastrach, czyli 129 pozycji rozróżnialnych", () => {
    const wKlastrach = baza.klastry.reduce((s, k) => s + k.sklad.length, 0);
    expect(wKlastrach).toBe(54);
    expect(baza.zawody.length - wKlastrach + baza.klastry.length).toBe(129);
  });

  it("każdy z 27 obszarów ma co najmniej jeden zawód", () => {
    const zObszarami = new Set(baza.zawody.map((z) => z.obszar));
    expect(zObszarami.size).toBe(27);
  });
});

describe("zapytanie o zawód zwraca komplet 24 pól", () => {
  const POLA = [
    "kod", "nazwa", "obszar", "poziom", "studia",
    "a1", "a2r", "a2w", "a3", "a4p", "a4m", "a5", "m1", "anty",
    "koszt", "flaga", "zagr", "kier", "klaster",
    "duzeMiasto", "teren", "przeciw", "przedm", "dosw",
  ] as const;

  it("elektryk ma wszystkie 24 pola, listy są listami", async () => {
    const z = await pobierzZawod("elektryk");
    expect(z).not.toBeNull();
    // 24 pola z bazy plus nazwaWyswietlana, wyliczana z karty przy imporcie.
    expect(Object.keys(z!).sort()).toEqual([...POLA, "nazwaWyswietlana"].sort());
    expect(POLA).toHaveLength(24);
    expect(z!.nazwaWyswietlana).toBe("Elektryk");
    expect(Array.isArray(z!.a1)).toBe(true);
    expect(z!.a1.length).toBeGreaterThan(0);
    expect(z!.obszar).toBe(13);
    expect(z!.studia).toBe("nie");
  });

  it("wszystkie 157 zawodów ma komplet 24 pól i niepusty profil obowiązkowy", () => {
    for (const z of baza.zawody) {
      expect(Object.keys(z), z.kod).toHaveLength(25);
      expect(z.a1.length, z.kod).toBeGreaterThan(0);
      expect(z.a2r.length, z.kod).toBeGreaterThan(0);
      expect(z.a5.length, z.kod).toBeGreaterThan(0);
      expect(z.anty.length, z.kod).toBeGreaterThan(0);
    }
  });

  it("nazwy pokazywane uczestnikowi mają polskie znaki", () => {
    // Baza trzyma nazwy bez znakow diakrytycznych; odtwarzamy je z kart.
    const poKodzie = new Map(baza.zawody.map((z) => [z.kod, z.nazwaWyswietlana]));
    expect(poKodzie.get("lesnik")).toBe("Leśnik");
    expect(poKodzie.get("technik_serwisu")).toBe("Technik serwisu urządzeń");
    expect(poKodzie.get("pielegniarka")).toBe("Pielęgniarka");
    expect(poKodzie.get("koordynator_ngo")).toBe("Koordynator projektów w NGO");
    for (const z of baza.zawody) {
      expect(z.nazwaWyswietlana.length, z.kod).toBeGreaterThan(2);
    }
  });

  it("zawód z pustym zdaniem kierunkowym ma null, nie pusty napis", () => {
    for (const z of baza.zawody) {
      if (z.kier !== null) expect(z.kier.trim().length, z.kod).toBeGreaterThan(0);
    }
  });
});

describe("zgodność ze słownikami kart", () => {
  it("żaden zawód nie używa kodu spoza słownika", () => {
    const poza: string[] = [];
    for (const z of baza.zawody) {
      const pary: Array<[string[], readonly string[], string]> = [
        [z.a1, KODY_A1, "A1"],
        [[...z.a2r, ...z.a2w], KODY_A2, "A2"],
        [z.a3, KODY_A3, "A3"],
        [[...z.a4p, ...z.a4m], KODY_A4, "A4"],
        [z.a5, KODY_A5, "A5"],
        [z.m1, KODY_M1, "M1"],
        [z.anty, KODY_ANTY, "ANTY"],
      ];
      for (const [kody, slownik, nazwa] of pary) {
        for (const k of kody) if (!slownik.includes(k)) poza.push(`${z.kod}/${nazwa}: ${k}`);
      }
    }
    expect(poza).toEqual([]);
  });

  it("słownik A1 kart pokrywa wszystkie 24 obszary zainteresowań", () => {
    // Kod dzwieku dodany po audycie: bez niego profil muzyczny nie mial domu.
    expect(KODY_A1).toHaveLength(24);
    expect(KODY_A1).toContain("dzwiek");
    const uzywane = new Set(baza.zawody.flatMap((z) => z.a1));
    expect(uzywane.size).toBe(24);
  });
});

describe("klastry", () => {
  it("skład klastra zgadza się z polem klaster w zawodach", () => {
    const poZawodzie = new Map(baza.zawody.map((z) => [z.kod, z.klaster]));
    for (const k of baza.klastry) {
      for (const kod of k.sklad) {
        expect(poZawodzie.get(kod), `${k.kod}/${kod}`).toBe(k.kod);
      }
    }
    const oznaczone = baza.zawody.filter((z) => z.klaster !== null).length;
    expect(oznaczone).toBe(54);
  });

  it("każdy klaster ma pytanie rozstrzygające i wyjaśnienie różnicy", () => {
    for (const k of baza.klastry) {
      expect(k.pytanie.trim().length, k.kod).toBeGreaterThan(10);
      expect(k.roznica.trim().length, k.kod).toBeGreaterThan(10);
      expect(k.sklad.length, k.kod).toBeGreaterThanOrEqual(2);
    }
  });

  it("sześć par o identycznej sygnaturze jest w klastrach", () => {
    const sygnatury = new Map<string, string[]>();
    for (const z of baza.zawody) {
      const s = `${z.obszar}|${[...z.a1].sort().join(",")}|${[...z.a2r].sort().join(",")}`;
      sygnatury.set(s, [...(sygnatury.get(s) ?? []), z.kod]);
    }
    const klony = [...sygnatury.values()].filter((v) => v.length > 1);
    expect(klony).toHaveLength(6);
    const poZawodzie = new Map(baza.zawody.map((z) => [z.kod, z.klaster]));
    for (const grupa of klony) {
      const klastryGrupy = new Set(grupa.map((k) => poZawodzie.get(k)));
      expect(klastryGrupy.size, grupa.join("+")).toBe(1);
      expect([...klastryGrupy][0], grupa.join("+")).not.toBeNull();
    }
  });
});

describe("drogi edukacyjne", () => {
  it("każdy zawód ma co najmniej jedną drogę dojścia", () => {
    const pokryte = new Set<string>();
    for (const k of baza.kierunki) [...k.bezposrednie, ...k.posrednie].forEach((z) => pokryte.add(z));
    for (const d of baza.drogiBezStudiow) d.zawody.forEach((z) => pokryte.add(z));
    const bez = baza.zawody.filter((z) => !pokryte.has(z.kod)).map((z) => z.kod);
    expect(bez).toEqual([]);
  });

  it("każdy zawód niewymagający studiów ma drogę krótką", () => {
    const krotkie = new Set(baza.drogiBezStudiow.flatMap((d) => d.zawody));
    const bez = baza.zawody.filter((z) => z.studia === "nie" && !krotkie.has(z.kod)).map((z) => z.kod);
    expect(bez).toEqual([]);
  });

  it("kierunki i drogi wskazują wyłącznie istniejące zawody", () => {
    const kody = new Set(baza.zawody.map((z) => z.kod));
    const obce = [
      ...baza.kierunki.flatMap((k) => [...k.bezposrednie, ...k.posrednie]),
      ...baza.drogiBezStudiow.flatMap((d) => d.zawody),
    ].filter((z) => !kody.has(z));
    expect(obce).toEqual([]);
  });
});

describe("baza 27 obszarów sparsowana z dokumentu", () => {
  it("każdy obszar ma komplet profili i 2–4 poziomy wejścia", () => {
    for (const o of baza.obszary) {
      expect(Object.keys(o.zainteresowania).length, o.nazwa).toBeGreaterThan(0);
      expect(Object.keys(o.kompetencje).length, o.nazwa).toBeGreaterThan(0);
      expect(o.wartosciPlus.length, o.nazwa).toBeGreaterThan(0);
      expect(Object.keys(o.filtry).length, o.nazwa).toBeGreaterThan(0);
      expect(o.poziomy.length, o.nazwa).toBeGreaterThanOrEqual(2);
      expect(o.poziomy.length, o.nazwa).toBeLessThanOrEqual(4);
      expect(o.grupa.length, o.nazwa).toBeGreaterThan(0);
    }
  });

  it("profile obszarów używają wyłącznie kodów z modułów", () => {
    const idA1 = new Set(OBSZARY_A1.map((o) => String(o.id)));
    const idA2 = new Set(KOMPETENCJE_A2.map((k) => String(k.id)));
    const kodyA4 = new Set(WARTOSCI_A4.map((w) => w.kod));
    const kodyA5 = new Set(FILTRY_A5.map((f) => f.kod));
    for (const o of baza.obszary) {
      Object.keys(o.zainteresowania).forEach((k) => expect(idA1.has(k), `${o.nazwa}/A1/${k}`).toBe(true));
      Object.keys(o.kompetencje).forEach((k) => expect(idA2.has(k), `${o.nazwa}/A2/${k}`).toBe(true));
      [...o.wartosciPlus, ...o.wartosciMinus].forEach((k) => expect(kodyA4.has(k), `${o.nazwa}/A4/${k}`).toBe(true));
      Object.keys(o.filtry).forEach((k) => expect(kodyA5.has(k), `${o.nazwa}/A5/${k}`).toBe(true));
    }
  });

  it("wagi zainteresowań i kompetencji są z zakresu 1–3", () => {
    for (const o of baza.obszary) {
      for (const w of [...Object.values(o.zainteresowania), ...Object.values(o.kompetencje)]) {
        expect(w, o.nazwa).toBeGreaterThanOrEqual(1);
        expect(w, o.nazwa).toBeLessThanOrEqual(3);
      }
    }
  });

  it("wymagania filtrowe są z zakresu 0–1", () => {
    for (const o of baza.obszary) {
      for (const v of Object.values(o.filtry)) {
        expect(v, o.nazwa).toBeGreaterThanOrEqual(0);
        expect(v, o.nazwa).toBeLessThanOrEqual(1);
      }
    }
  });

  it("wszystkie 24 zainteresowania, 30 kompetencji, 12 wartości i 32 filtry mają pokrycie", () => {
    const a1 = new Set<string>();
    const a2 = new Set<string>();
    const a4 = new Set<string>();
    const a5 = new Set<string>();
    for (const o of baza.obszary) {
      Object.keys(o.zainteresowania).forEach((k) => a1.add(k));
      Object.keys(o.kompetencje).forEach((k) => a2.add(k));
      [...o.wartosciPlus, ...o.wartosciMinus].forEach((k) => a4.add(k));
      Object.keys(o.filtry).forEach((k) => a5.add(k));
    }
    expect(a1.size).toBe(24);
    expect(a2.size).toBe(30);
    expect(a4.size).toBe(12);
    expect(a5.size).toBe(32);
  });

  it("obszar 27 jest oznaczony jako szczególny, nigdy samodzielny", () => {
    const przedsiebiorczosc = baza.obszary.find((o) => o.id === 27);
    expect(przedsiebiorczosc?.szczegolny).toBe(true);
  });

  it("czas dojścia parsuje się także dla zapisów typu 6+ lat", () => {
    // Blad wykryty w przebiegu na sucho warstwy pierwszej: "6+ lat" wracalo jako 0,
    // przez co uczestnik chcacy szybkiego wejscia dostawal najdluzszy poziom.
    const zPlusem = baza.obszary.flatMap((o) => o.poziomy).filter((p) => p.czas.includes("+"));
    expect(zPlusem.length).toBeGreaterThan(0);
    for (const p of zPlusem) expect(p.lata, p.czas).toBeGreaterThan(0);
    for (const o of baza.obszary) {
      for (const p of o.poziomy) expect(p.lata, `${o.nazwa}: ${p.czas}`).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("macierz sąsiedztwa", () => {
  it("jest symetryczna i pełna", () => {
    for (const a of baza.obszary) {
      expect(Object.keys(a.sasiedztwo)).toHaveLength(26);
      for (const b of baza.obszary) {
        if (a.id === b.id) continue;
        expect(a.sasiedztwo[String(b.id)], `${a.id}-${b.id}`).toBeCloseTo(b.sasiedztwo[String(a.id)], 4);
      }
    }
  });

  it("odtwarza rozkład opisany w dokumencie: średnia ~0,17, maksimum ~0,79", () => {
    const pary: number[] = [];
    for (const a of baza.obszary) {
      for (const b of baza.obszary) if (b.id > a.id) pary.push(a.sasiedztwo[String(b.id)]);
    }
    const srednia = pary.reduce((s, x) => s + x, 0) / pary.length;
    expect(srednia).toBeCloseTo(0.17, 2);
    expect(Math.max(...pary)).toBeGreaterThan(0.75);
  });

  it("najbliższa para to analiza danych i technologia", () => {
    const analiza = baza.obszary.find((o) => o.id === 6)!;
    expect(analiza.sasiedztwo["9"]).toBeGreaterThan(0.75);
    const najblizszy = Object.entries(analiza.sasiedztwo).sort((a, b) => b[1] - a[1])[0][0];
    expect(najblizszy).toBe("9");
  });
});
