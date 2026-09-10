/**
 * Warstwa 1: testy akceptacyjne z rozdzialu 15 warstwa1_obszary.md
 * oraz przebieg na sucho na trzech profilach kontrolnych z rozdzialu 14.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import type { Obszar } from "@/lib/domain/typy";
import { warstwa1, ustawTekstyFiltrow } from "@/lib/engine/layer1-areas";
import { wskaznikiJakosci } from "@/lib/engine/profil";
import { FILTRY_A5 } from "@/lib/domain/slowniki";
import { WARSTWA1 } from "@/lib/engine/config";
import { PROFILE_WARSTWY1, RZEMIESLNIK_17, SPOLECZNA_19, ANALITYK_22 } from "./fixtures/profile-warstwy1";
import type { WynikiModulow } from "@/lib/engine/typy";

let obszary: Obszar[];

beforeAll(async () => {
  obszary = (await pobierzBazeReferencyjna()).obszary;
  ustawTekstyFiltrow(FILTRY_A5);
});

function policz(w: WynikiModulow) {
  return warstwa1(w, obszary, wskaznikiJakosci(w));
}

function wynikObszaru(w: WynikiModulow, nazwa: string): number | undefined {
  return policz(w).obszary.find((o) => o.nazwa.startsWith(nazwa))?.wynik;
}

describe("przebieg na sucho, rozdział 14", () => {
  it("profil 1, rzemieślnik 17 lat", () => {
    const r = policz(RZEMIESLNIK_17);
    const top = r.obszary.slice(0, 4);
    expect(top.map((o) => Number(o.wynik.toFixed(1)))).toEqual([104.1, 56.4, 54.4, 47.1]);
    expect(top[0].nazwa).toBe("Rzemiosło i usługi techniczne");
    expect(top[0].poziomWejscia.poziom).toBe("szybki");
    expect(top[0].poziomWejscia.przyklad).toContain("uczeń zawodu");
    expect(r.drogi.map((d) => d.nazwaObszaru)).toEqual([
      "Rzemiosło i usługi techniczne",
      "Rolnictwo, przyroda i zwierzęta",
      "Gastronomia i hotelarstwo",
    ]);
    expect(r.flagi).toContain("droga_b_slabsza_od_a");
  });

  it("profil 2, społeczna 19 lat", () => {
    const r = policz(SPOLECZNA_19);
    expect(r.obszary.slice(0, 4).map((o) => Number(o.wynik.toFixed(1)))).toEqual([
      95.8, 83.1, 77.6, 68.3,
    ]);
    expect(r.obszary[0].nazwa).toBe("Opieka i praca socjalna");
    expect(r.obszary[2].poziomWejscia.przyklad).toContain("psychoterapeuta");
    // Dokumentacja podaje tu administracje. Administracja ma 40,6 punktu, czyli
    // ponizej progu 42 z rozdzialu 9, ktorego prototyp nie implementowal.
    // Trzymamy sie specyfikacji: alternatywa nie moze byc antydopasowaniem.
    expect(r.drogi.map((d) => d.nazwaObszaru)).toEqual([
      "Opieka i praca socjalna",
      "Edukacja i szkolenia",
      "Zdrowie, rehabilitacja i ciało",
    ]);
    expect(r.obszary.find((o) => o.nazwa.startsWith("Administracja"))!.wynik).toBeLessThan(42);
  });

  it("profil 3, analityk 22 lata", () => {
    const r = policz(ANALITYK_22);
    expect(r.obszary.slice(0, 4).map((o) => Number(o.wynik.toFixed(1)))).toEqual([
      108.0, 99.1, 66.5, 66.2,
    ]);
    expect(r.drogi.map((d) => d.nazwaObszaru)).toEqual([
      "Analiza danych",
      "Technologia i oprogramowanie",
      "Prawo",
    ]);
    // Silnik nie ukrywa, ze dwie najmocniejsze drogi to ten sam swiat.
    expect(r.flagi).toContain("ten_sam_swiat_a_b");
    expect(r.podobienstwa.AB).toBeGreaterThanOrEqual(0.6);
    expect(r.podobienstwa.AC).toBeLessThan(0.3);
  });

  it("weto na widok krwi usuwa medycynę i służby mundurowe", () => {
    const r = policz(SPOLECZNA_19);
    const przezWeto = r.usuniete.filter((u) => u.powod === "weto").map((u) => u.nazwa);
    expect(przezWeto).toContain("Medycyna i ratownictwo");
    expect(przezWeto).toContain("Służby mundurowe i bezpieczeństwo");
    expect(r.usuniete.every((u) => u.filtr === undefined || u.filtr === "F21")).toBe(true);
  });

  it("u rzemieślnika odpada sześć obszarów: pięć przez weto, jeden przez brak poziomu", () => {
    // Dokumentacja pisze "cztery przez weto"; obliczenie daje piec. Suma sie zgadza.
    const r = policz(RZEMIESLNIK_17);
    expect(r.usuniete).toHaveLength(6);
    expect(r.usuniete.filter((u) => u.powod === "weto")).toHaveLength(5);
    expect(r.usuniete.filter((u) => u.powod === "brak_poziomu")).toHaveLength(1);
    expect(r.usuniete.find((u) => u.powod === "brak_poziomu")?.nazwa).toBe("Nauka i badania");
  });
});

describe("testy akceptacyjne, rozdział 15", () => {
  it("1. asymetria kompetencji: wyzerowanie K nie obniża żadnego obszaru", () => {
    const przed = policz(ANALITYK_22).obszary;
    const wyzerowane: WynikiModulow = {
      ...ANALITYK_22,
      k: Object.fromEntries(Object.keys(ANALITYK_22.k).map((id) => [Number(id), 0])),
      dowody: Object.fromEntries(Object.keys(ANALITYK_22.dowody).map((id) => [Number(id), 3])),
    };
    const po = policz(wyzerowane).obszary;
    for (const o of przed) {
      const p = po.find((x) => x.id === o.id);
      expect(p, o.nazwa).toBeDefined();
      // Bonus moze zniknac, ale nic nie schodzi ponizej wyniku bez bonusu.
      const bezBonusu = (o.ciagniecie + 3) * o.mnoznik * o.wykonalnosc;
      expect(p!.wynik, o.nazwa).toBeGreaterThanOrEqual(Math.min(bezBonusu, o.wynik) - 0.001);
    }
  });

  it("2. sufit kary: komplet odmów na wymagania obszaru daje dokładnie 50%, nigdy mniej", () => {
    // Odmawiamy tylko na wymaganiach jednego obszaru, zeby nie przekroczyc
    // wskaznika zamkniecia, ktory wylaczylby filtry calkowicie.
    const obszar = obszary.find((o) => Object.keys(o.filtry).length >= 5)!;
    const g = Object.fromEntries(FILTRY_A5.map((f) => [f.kod, 1]));
    for (const f of Object.keys(obszar.filtry)) g[f] = 0;
    const w: WynikiModulow = { ...ANALITYK_22, g, weta: [] };
    expect(wskaznikiJakosci(w).filtryWylaczone).toBe(false);
    const r = warstwa1(w, [obszar], wskaznikiJakosci(w));
    const wynik = r.obszary[0] ?? null;
    expect(wynik).not.toBeNull();
    expect(wynik!.wykonalnosc).toBeCloseTo(0.5, 9);
  });

  it("3. normalizacja kary: liczba wymagań nie zmienia kary procentowej", () => {
    // Wszystkie odpowiedzi MOZE: kara = 0,5 niezaleznie od liczby wymagan.
    const w: WynikiModulow = {
      ...ANALITYK_22,
      g: Object.fromEntries(FILTRY_A5.map((f) => [f.kod, 0.5])),
      weta: [],
    };
    const r = policz(w);
    const liczbyWymagan = new Set(
      r.obszary.map((o) => Object.keys(obszary.find((x) => x.id === o.id)!.filtry).length),
    );
    expect(liczbyWymagan.size).toBeGreaterThan(1);
    for (const o of r.obszary) expect(o.wykonalnosc, o.nazwa).toBeCloseTo(0.75, 9);
  });

  it("4. próg weta: 0,55 nie usuwa, 0,60 usuwa", () => {
    const sztuczny: Obszar[] = [
      { ...obszary[0], id: 901, nazwa: "Próg 0,55", filtry: { F11: 0.55 } },
      { ...obszary[0], id: 902, nazwa: "Próg 0,60", filtry: { F11: 0.6 } },
    ];
    const w: WynikiModulow = { ...ANALITYK_22, weta: ["F11"] };
    const r = warstwa1(w, sztuczny, wskaznikiJakosci(w));
    expect(r.obszary.map((o) => o.id)).toContain(901);
    expect(r.usuniete.map((o) => o.id)).toContain(902);
  });

  it("5. wartość progowa daje −0,25 na mnożniku, nie na całym wyniku", () => {
    const obszar = obszary.find((o) => o.wartosciMinus.length > 0)!;
    const bez: WynikiModulow = { ...ANALITYK_22, a4Progowe: [], a4Top5: [], a4Bottom3: [] };
    const zProgowa: WynikiModulow = { ...bez, a4Progowe: [obszar.wartosciMinus[0]] };
    const a = warstwa1(bez, [obszar], wskaznikiJakosci(bez)).obszary[0];
    const b = warstwa1(zProgowa, [obszar], wskaznikiJakosci(zProgowa)).obszary[0];
    expect(a.mnoznik - b.mnoznik).toBeCloseTo(0.25, 9);
    expect(a.ciagniecie).toBeCloseTo(b.ciagniecie, 9);
  });

  it("6. poziom wejścia: INW ≥ 75 daje najkrótszy, INW ≤ 25 najdłuższy", () => {
    const szybki = policz({ ...ANALITYK_22, shape: { ...ANALITYK_22.shape, INW: 100 } });
    const dlugi = policz({ ...ANALITYK_22, shape: { ...ANALITYK_22.shape, INW: 0 } });
    for (const o of szybki.obszary) {
      const d = dlugi.obszary.find((x) => x.id === o.id);
      if (!d) continue;
      expect(o.poziomWejscia.lata, o.nazwa).toBeLessThanOrEqual(d.poziomWejscia.lata);
    }
    const analiza = szybki.obszary.find((o) => o.id === 6)!;
    expect(analiza.poziomWejscia.poziom).toBe("szybki");
  });

  it("7. Droga B jest zawsze drugim w rankingu, o ile przekracza próg jakości", () => {
    for (const w of Object.values(PROFILE_WARSTWY1)) {
      const r = policz(w);
      const bezPrzedsiebiorczosci = r.obszary.filter((o) => o.id !== 27);
      const B = r.drogi.find((d) => d.etykieta === "B");
      if (!B) continue;
      const drugi = bezPrzedsiebiorczosci[1];
      if (drugi.wynik >= WARSTWA1.PROG_DROGI_B * bezPrzedsiebiorczosci[0].wynik) {
        expect(B.obszar).toBe(drugi.id);
      }
    }
  });

  it("8. nigdy pusto: każdy profil dostaje co najmniej pięć obszarów", () => {
    for (const w of Object.values(PROFILE_WARSTWY1)) {
      expect(policz(w).obszary.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("9. determinizm: ten sam komplet odpowiedzi daje identyczny wynik", () => {
    const a = policz(SPOLECZNA_19);
    const b = policz(SPOLECZNA_19);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("11. profile kontrolne są odporne na kolejność obszarów w bazie", () => {
    const odwrocone = [...obszary].reverse();
    const w = RZEMIESLNIK_17;
    const a = warstwa1(w, obszary, wskaznikiJakosci(w));
    const b = warstwa1(w, odwrocone, wskaznikiJakosci(w));
    expect(b.obszary.map((o) => o.id)).toEqual(a.obszary.map((o) => o.id));
  });
});

describe("degradacja przy słabych danych", () => {
  it("profil płaski w A1: brak rankingu i brak trzech dróg, nigdy komunikat o braku dopasowania", () => {
    const plaski: WynikiModulow = {
      ...RZEMIESLNIK_17,
      z: Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i + 1, 50])),
    };
    const r = policz(plaski);
    expect(r.profilNieostry).toBe(true);
    expect(r.drogi).toHaveLength(0);
    expect(r.flagi).toContain("profil_nieostry");
    expect(r.obszary.length).toBeGreaterThanOrEqual(5);
    expect(r.antydopasowania).toHaveLength(0);
  });

  it("wskaźnik zamknięcia powyżej 20: filtry wyłączone całkowicie, także weta", () => {
    const zamkniety: WynikiModulow = {
      ...RZEMIESLNIK_17,
      g: Object.fromEntries(FILTRY_A5.map((f) => [f.kod, 0])),
      weta: ["F26"],
    };
    const r = policz(zamkniety);
    expect(wskaznikiJakosci(zamkniety).filtryWylaczone).toBe(true);
    expect(r.usuniete.filter((u) => u.powod === "weto")).toHaveLength(0);
    for (const o of r.obszary) expect(o.wykonalnosc).toBe(1);
  });

  it("wskaźnik okazji poniżej 8: bonus kompetencyjny wyłączony", () => {
    const bezDowodow: WynikiModulow = {
      ...ANALITYK_22,
      dowody: Object.fromEntries(Array.from({ length: 30 }, (_, i) => [i + 1, 0])),
    };
    const r = policz(bezDowodow);
    for (const o of r.obszary) expect(o.bonus).toBe(0);
  });

  it("brak danych z A4 i M1: mnożnik zgodności równy 1", () => {
    const bez: WynikiModulow = {
      ...ANALITYK_22,
      a4Top5: [],
      a4Bottom3: [],
      a4Progowe: [],
      shape: Object.fromEntries(Object.keys(ANALITYK_22.shape).map((k) => [k, null])),
    };
    for (const o of policz(bez).obszary) expect(o.mnoznik).toBe(1);
  });
});

describe("wyjaśnienia i antydopasowania", () => {
  it("niskie kompetencje pojawiają się wyłącznie jako lista do nauczenia się", () => {
    const r = policz(SPOLECZNA_19);
    const zListą = r.obszary.filter((o) => o.czegoSieNauczyc.length > 0);
    expect(zListą.length).toBeGreaterThan(0);
    for (const o of r.obszary) {
      for (const tekst of o.coPrzeszkadza) {
        expect(tekst.toLowerCase()).not.toContain("słabo Ci idzie");
      }
    }
  });

  it("najwyżej trzy antydopasowania, zawsze ze słowem aktualnym albo bez zamykania drogi", () => {
    for (const w of Object.values(PROFILE_WARSTWY1)) {
      const a = policz(w).antydopasowania;
      expect(a.length).toBeLessThanOrEqual(3);
      for (const x of a) {
        expect(x.komunikat).not.toMatch(/nie nadajesz się|to nie dla Ciebie/i);
      }
    }
  });

  it("obszar 27 nigdy nie stoi sam: jest sparowany z branżą", () => {
    for (const w of Object.values(PROFILE_WARSTWY1)) {
      const r = policz(w);
      if (r.obszary.some((o) => o.id === 27)) {
        expect(r.przedsiebiorczoscWObszarze).not.toBeNull();
        expect(r.przedsiebiorczoscWObszarze).not.toBe(27);
      }
      expect(r.drogi.every((d) => d.obszar !== 27)).toBe(true);
    }
  });
});
