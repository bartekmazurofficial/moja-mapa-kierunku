/**
 * Warstwa 2: przebieg na sucho z rozdzialu 4 warstwa2_zawody.md
 * oraz testy akceptacyjne T1-T6 z rozdzialu 10.
 *
 * Chodzi na prototypowym podzbiorze 24 zawodow, bo to jedyny zestaw danych,
 * wobec ktorego opublikowane liczby maja sens. Testy na pelnej bazie 157
 * zawodow sa w silnik-pelna-baza.test.ts.
 */

import { describe, expect, it } from "vitest";
import { warstwa2 } from "@/lib/engine/layer2-professions";
import {
  ANALITYCZNY_22,
  PROFILE_PROTOTYPU,
  RZEMIESLNIK_17,
  SPOLECZNY_19,
  ZAWODY_PROTOTYPU,
  type ProfilPrototypu,
} from "./fixtures/prototyp-warstwy2";

function policz(p: ProfilPrototypu) {
  return warstwa2(p.profil, p.obszary, ZAWODY_PROTOTYPU, [], {
    poziomDocelowy: p.poziomDocelowy,
    zasoby: p.zasoby,
    punktStartu: null,
  });
}

function wynik(p: ProfilPrototypu, kod: string): number {
  return policz(p).wszystkie.find((z) => z.kod === kod)!.wynik;
}

function mnoznik(p: ProfilPrototypu, kod: string): number {
  return Number(policz(p).wszystkie.find((z) => z.kod === kod)!.mnoznikKartowy.toFixed(2));
}

describe("przebieg na sucho, rozdział 4", () => {
  it("profil rzemieślniczy: elektryk, hydraulik i mechanik po 100, fryzjer 72,4", () => {
    expect(wynik(RZEMIESLNIK_17, "elektryk")).toBe(100);
    expect(wynik(RZEMIESLNIK_17, "hydraulik")).toBe(100);
    expect(wynik(RZEMIESLNIK_17, "mechanik")).toBe(100);
    expect(wynik(RZEMIESLNIK_17, "spawacz")).toBe(97.1);
    expect(wynik(RZEMIESLNIK_17, "fryzjer")).toBe(72.4);
    expect(wynik(RZEMIESLNIK_17, "kucharz")).toBe(46.6);
  });

  it("profil rzemieślniczy: mnożniki kartowe zgodne z tabelą", () => {
    expect(mnoznik(RZEMIESLNIK_17, "elektryk")).toBe(1.15);
    expect(mnoznik(RZEMIESLNIK_17, "spawacz")).toBe(1.12);
    expect(mnoznik(RZEMIESLNIK_17, "fryzjer")).toBe(0.83);
    expect(mnoznik(RZEMIESLNIK_17, "kucharz")).toBe(0.86);
  });

  it("fryzjer spada o dwadzieścia osiem punktów mimo tego samego obszaru co elektryk", () => {
    const r = policz(RZEMIESLNIK_17);
    const elektryk = r.wszystkie.find((z) => z.kod === "elektryk")!;
    const fryzjer = r.wszystkie.find((z) => z.kod === "fryzjer")!;
    expect(elektryk.wynikObszaru).toBe(fryzjer.wynikObszaru);
    expect(elektryk.wynik - fryzjer.wynik).toBeCloseTo(27.6, 1);
  });

  it("profil społeczny: pedagog specjalny 100, opiekun medyczny 73,5", () => {
    expect(wynik(SPOLECZNY_19, "pedagog_spec")).toBe(100);
    expect(wynik(SPOLECZNY_19, "nauczyciel")).toBe(93.9);
    expect(wynik(SPOLECZNY_19, "lektor")).toBe(93.2);
    expect(wynik(SPOLECZNY_19, "opiekun_starszej")).toBe(92.2);
    expect(wynik(SPOLECZNY_19, "pracownik_socjalny")).toBe(92.2);
    expect(wynik(SPOLECZNY_19, "opiekun_med")).toBe(73.5);
  });

  it("profil społeczny: pracownik socjalny dostaje dwa ostrzeżenia antyprofilowe naraz", () => {
    const r = policz(SPOLECZNY_19);
    const socjalny = r.wszystkie.find((z) => z.kod === "pracownik_socjalny")!;
    expect(socjalny.ostrzezenia.map((o) => o.kod).sort()).toEqual([
      "konfrontacja_nie",
      "zabieranie_do_domu",
    ]);
    // Ostrzezenie nie obniza pozycji.
    expect(socjalny.wynik).toBe(92.2);
  });

  it("profil analityczny: programista 100, wsparcie techniczne 59,5", () => {
    expect(wynik(ANALITYCZNY_22, "programista")).toBe(100);
    expect(wynik(ANALITYCZNY_22, "tester")).toBe(90.6);
    expect(wynik(ANALITYCZNY_22, "devops")).toBe(88.8);
    expect(wynik(ANALITYCZNY_22, "wsparcie_tech")).toBe(59.5);
  });

  it("devops wyprzedza testera mimo niższego wyniku, bo tester jest zagrożony", () => {
    const kolejnosc = policz(ANALITYCZNY_22)
      .wszystkie.map((z) => z.kod)
      .filter((k) => k === "devops" || k === "tester");
    expect(kolejnosc).toEqual(["devops", "tester"]);
  });

  it("spawacz dostaje ostrzeżenie o samotności zawodu", () => {
    const spawacz = policz(RZEMIESLNIK_17).wszystkie.find((z) => z.kod === "spawacz")!;
    expect(spawacz.ostrzezenia.map((o) => o.kod)).toContain("potrzeba_ludzi");
  });
});

describe("testy akceptacyjne T1–T6, rozdział 10", () => {
  it("T1: weto na widok krwi usuwa pielęgniarkę i ratownika", () => {
    const r = policz(SPOLECZNY_19);
    const usuniete = r.usunieteWetem.map((z) => z.kod);
    expect(usuniete).toContain("pielegniarka");
    expect(usuniete).toContain("ratownik_med");
    expect(r.wszystkie.map((z) => z.kod)).not.toContain("pielegniarka");
  });

  it("T2: weto na studia usuwa wszystkie zawody wymagające studiów", () => {
    const r = policz(RZEMIESLNIK_17);
    expect(r.wszystkie.filter((z) => z.studia === "tak")).toHaveLength(0);
    expect(r.usunieteWetem.length).toBeGreaterThanOrEqual(6);
  });

  it("T3: karta różnicuje zawody w jednym obszarze o co najmniej 20 punktów", () => {
    const r = policz(ANALITYCZNY_22);
    const wObszarze9 = r.wszystkie.filter((z) => z.obszar === 9);
    const rozstep = Math.max(...wObszarze9.map((z) => z.wynik)) - Math.min(...wObszarze9.map((z) => z.wynik));
    expect(rozstep).toBeGreaterThanOrEqual(20);
  });

  it("T4: każdy profil dostaje co najmniej trzy zawody bez studiów", () => {
    for (const p of Object.values(PROFILE_PROTOTYPU)) {
      expect(policz(p).gwarancje.bezStudiow, JSON.stringify(p.obszary.size)).toBeGreaterThanOrEqual(3);
    }
  });

  it("T5: zawody trampolinowe są oznaczone w wyniku", () => {
    const r = policz(ANALITYCZNY_22);
    const trampoliny = r.wszystkie.filter((z) => z.flagi.trampolina).map((z) => z.kod);
    expect(trampoliny).toContain("tester");
    expect(trampoliny).toContain("wsparcie_tech");
  });

  it("T6: bariera kosztowa aktywuje się przy braku zasobów", () => {
    const zZasobami = { ...RZEMIESLNIK_17, zasoby: "dobre" as const };
    const drogi = ZAWODY_PROTOTYPU.filter((z) => z.koszt === "wysoki" || z.koszt === "bardzo_wysoki");
    // Prototyp nie zawiera zawodu o wysokim koszcie w obszarach rzemieslnika,
    // wiec sprawdzamy mechanizm na zawodzie sztucznie oznaczonym.
    const zDrogim = ZAWODY_PROTOTYPU.map((z) =>
      z.kod === "elektryk" ? { ...z, koszt: "bardzo_wysoki" } : z,
    );
    const bez = warstwa2(RZEMIESLNIK_17.profil, RZEMIESLNIK_17.obszary, zDrogim, [], {
      poziomDocelowy: "szybki",
      zasoby: "brak",
      punktStartu: null,
    });
    const z = warstwa2(zZasobami.profil, zZasobami.obszary, zDrogim, [], {
      poziomDocelowy: "szybki",
      zasoby: "dobre",
      punktStartu: null,
    });
    expect(bez.wszystkie.find((x) => x.kod === "elektryk")!.karaKosztu).toBe(0.1);
    expect(z.wszystkie.find((x) => x.kod === "elektryk")!.karaKosztu).toBe(0);
    expect(drogi.length).toBeGreaterThanOrEqual(0);
  });
});

describe("zasady, których nie wolno złamać", () => {
  it("antyprofil nigdy nie obniża wyniku", () => {
    const bezAnty: ProfilPrototypu = {
      ...SPOLECZNY_19,
      profil: { ...SPOLECZNY_19.profil, anty: new Set<string>() },
    };
    const zAnty = policz(SPOLECZNY_19).wszystkie;
    const bez = policz(bezAnty).wszystkie;
    for (const z of zAnty) {
      expect(bez.find((x) => x.kod === z.kod)!.wynik, z.kod).toBe(z.wynik);
    }
  });

  it("zawód krótszy niż gotowość uczestnika nie jest karany", () => {
    const r = policz(SPOLECZNY_19);
    for (const z of r.wszystkie) {
      if (z.poziom === "szybki") expect(z.karaPoziomu, z.kod).toBe(0);
    }
  });

  it("lista usuniętych przez weto istnieje, ale osobno od wyniku uczestnika", () => {
    const r = policz(RZEMIESLNIK_17);
    expect(r.usunieteWetem.length).toBeGreaterThan(0);
    const kodyWWyniku = new Set(r.wszystkie.map((z) => z.kod));
    for (const u of r.usunieteWetem) expect(kodyWWyniku.has(u.kod)).toBe(false);
  });
});
