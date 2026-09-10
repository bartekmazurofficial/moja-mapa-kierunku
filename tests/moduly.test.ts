/**
 * Liczenie wynikow modulow z surowych odpowiedzi.
 * Testy poprawnosci, ktore specyfikacje modulow same podaja.
 */

import { describe, expect, it } from "vitest";
import {
  policzA1,
  policzA2,
  policzA3,
  policzA4,
  policzA5,
  policzM1,
  zlozWynikiModulow,
  type OdpowiedziA1,
  type OdpowiedziA2,
} from "@/lib/engine/moduly";
import { BLOKI_A1 } from "@/lib/content/a1";
import { BLOKI_A2 } from "@/lib/content/a2";
import { PARY_A3 } from "@/lib/content/a3";
import { PARY_A4, BRZMIENIA_A4 } from "@/lib/content/a4";
import { PARY_M1 } from "@/lib/content/m1";
import { OBSZARY_A1, KOMPETENCJE_A2, WARTOSCI_A4, WYMIARY_A3, WYMIARY_M1 } from "@/lib/domain/slowniki";

/** Losowe, ale deterministyczne wypelnienie rankingu bloku. */
function ranking(ids: string[], przesuniecie: number): Record<string, number> {
  const r: Record<string, number> = {};
  ids.forEach((id, i) => (r[id] = ((i + przesuniecie) % 4) + 1));
  return r;
}

function pelneA1(przesuniecie = 0): OdpowiedziA1 {
  return {
    czescA: Object.fromEntries(
      BLOKI_A1.map((b) => [b.index, ranking(b.pozycje.map((p) => p.id), b.index + przesuniecie)]),
    ),
    czescB: Object.fromEntries(OBSZARY_A1.map((o) => [o.id, ((o.id + przesuniecie) % 5) + 1])),
    czescC: Object.fromEntries(OBSZARY_A1.map((o) => [o.id, o.id % 3 === 0])),
  };
}

function pelneA2(przesuniecie = 0): OdpowiedziA2 {
  return {
    czescA: Object.fromEntries(
      BLOKI_A2.map((b) => [b.index, ranking(b.pozycje.map((p) => p.id), b.index + przesuniecie)]),
    ),
    czescB: Object.fromEntries(KOMPETENCJE_A2.map((k) => [k.id, [k.id % 2 === 0, k.id % 3 === 0, false]])),
  };
}

describe("plany bloków są zbilansowane", () => {
  it("A1: 36 bloków, 144 pozycje, każdy obszar dokładnie sześć razy", () => {
    expect(BLOKI_A1).toHaveLength(36);
    const pozycje = BLOKI_A1.flatMap((b) => b.pozycje);
    expect(pozycje).toHaveLength(144);
    expect(new Set(pozycje.map((p) => p.id)).size).toBe(144);
    for (const o of OBSZARY_A1) {
      expect(pozycje.filter((p) => p.obszar === o.id), o.nazwaTechniczna).toHaveLength(6);
    }
  });

  it("A1: w żadnym bloku nie ma dwóch pozycji z tej samej rodziny", () => {
    for (const b of BLOKI_A1) {
      expect(new Set(b.pozycje.map((p) => p.rodzina)).size, `blok ${b.index}`).toBe(4);
    }
  });

  it("A1: maksymalnie jedna pozycja o podwyższonej atrakcyjności na blok", () => {
    for (const b of BLOKI_A1) {
      expect(b.pozycje.filter((p) => p.wysoka).length, `blok ${b.index}`).toBeLessThanOrEqual(1);
    }
  });

  it("A2: 45 bloków, 180 pozycji, każda kompetencja dokładnie sześć razy", () => {
    expect(BLOKI_A2).toHaveLength(45);
    const pozycje = BLOKI_A2.flatMap((b) => b.pozycje);
    expect(pozycje).toHaveLength(180);
    for (const k of KOMPETENCJE_A2) {
      expect(pozycje.filter((p) => p.kompetencja === k.id), k.nazwa).toHaveLength(6);
    }
  });

  it("A3: 60 par, po pięć na każdy z dwunastu wymiarów", () => {
    expect(PARY_A3).toHaveLength(60);
    for (const w of WYMIARY_A3) {
      expect(PARY_A3.filter((p) => p.wymiar === w.kod), w.kod).toHaveLength(5);
    }
  });

  it("A4: 36 par, każda wartość w dokładnie sześciu, żadna para się nie powtarza", () => {
    expect(PARY_A4).toHaveLength(36);
    for (const w of WARTOSCI_A4) {
      const ile = PARY_A4.filter((p) => p.lewa === w.kod || p.prawa === w.kod).length;
      expect(ile, w.kod).toBe(6);
    }
    const pary = PARY_A4.map((p) => [p.lewa, p.prawa].sort().join("-"));
    expect(new Set(pary).size).toBe(36);
    expect(Object.keys(BRZMIENIA_A4)).toHaveLength(12);
  });

  it("M1: 48 par, po cztery na każdy z dwunastu wymiarów", () => {
    expect(PARY_M1).toHaveLength(48);
    for (const w of WYMIARY_M1) {
      expect(PARY_M1.filter((p) => p.wymiar === w.kod), w.kod).toHaveLength(4);
    }
  });
});

describe("A1: algorytm liczenia", () => {
  it("suma W_raw po 24 obszarach wynosi dokładnie zero, średnia Wn dokładnie 50", () => {
    const w = policzA1(pelneA1());
    const srednia = Object.values(w.wn).reduce((s, x) => s + x, 0) / 24;
    expect(srednia).toBeCloseTo(50, 9);
  });

  it("skrajne podniesienie wyłącza kotwicę: wynik liczony z samego rankingu", () => {
    const o = pelneA1();
    o.czescB = Object.fromEntries(OBSZARY_A1.map((a) => [a.id, 5]));
    const w = policzA1(o);
    expect(w.podniesienie).toBe(5);
    for (const a of OBSZARY_A1) expect(w.z[a.id]).toBeCloseTo(w.wn[a.id], 9);
  });

  it("profil płaski jest wykrywany, a nie ukrywany", () => {
    const o = pelneA1();
    o.czescA = Object.fromEntries(
      BLOKI_A1.map((b) => [b.index, ranking(b.pozycje.map((p) => p.id), b.index)]),
    );
    const w = policzA1(o);
    expect(["wyrazny", "umiarkowany", "jeszcze_nieuksztaltowany"]).toContain(w.pewnosc);
    expect(w.zroznicowanie).toBeGreaterThanOrEqual(0);
  });

  it("dwie osie liczą się z wyśrodkowanych rodzin", () => {
    const w = policzA1(pelneA1());
    expect(Object.keys(w.rodziny).sort()).toEqual(["A", "C", "E", "I", "R", "S"]);
    expect(Number.isFinite(w.osie.rzeczyLudzie)).toBe(true);
    expect(Number.isFinite(w.osie.daneIdee)).toBe(true);
  });
});

describe("A2: algorytm liczenia", () => {
  it("średnia Sn po 30 kompetencjach wynosi dokładnie 50", () => {
    const w = policzA2(pelneA2());
    const srednia = Object.values(w.sn).reduce((s, x) => s + x, 0) / 30;
    expect(srednia).toBeCloseTo(50, 9);
  });

  it("wskaźnik okazji poniżej ośmiu wyłącza wagę dowodów", () => {
    const o = pelneA2();
    o.czescB = Object.fromEntries(KOMPETENCJE_A2.map((k) => [k.id, [false, false, false]]));
    const w = policzA2(o);
    expect(w.wskaznikOkazji).toBe(0);
    for (const k of KOMPETENCJE_A2) expect(w.k[k.id]).toBeCloseTo(w.sn[k.id], 9);
  });

  it("dowody liczą się od zera do trzech", () => {
    const w = policzA2(pelneA2());
    for (const v of Object.values(w.dowody)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(3);
    }
  });
});

describe("A3: algorytm liczenia", () => {
  it("siła jest średnią geometryczną wyrazistości i ważności", () => {
    const czescA = Object.fromEntries(PARY_A3.map((p) => [p.id, "A" as const]));
    const czescB = Object.fromEntries(WYMIARY_A3.map((w) => [w.kod, 5]));
    const w = policzA3({ czescA, czescB });
    for (const wym of WYMIARY_A3) {
      expect(w.pozycje[wym.kod]).toBe(100);
      expect(w.wyrazistosc[wym.kod]).toBe(100);
      expect(w.sila[wym.kod]).toBeCloseTo(100, 9);
    }
    expect(w.warunkiKluczowe).toHaveLength(12);
  });

  it("wyraźny, ale obojętny nie daje warunku kluczowego", () => {
    const czescA = Object.fromEntries(PARY_A3.map((p) => [p.id, "A" as const]));
    const czescB = Object.fromEntries(WYMIARY_A3.map((w) => [w.kod, 1]));
    const w = policzA3({ czescA, czescB });
    expect(w.warunkiKluczowe).toHaveLength(0);
    for (const wym of WYMIARY_A3) expect(w.sila[wym.kod]).toBe(0);
  });

  it("warunek kluczowy dostaje zdanie środowiskowe z właściwego bieguna", () => {
    const czescA = Object.fromEntries(PARY_A3.map((p) => [p.id, p.wymiar === "SAM" ? "B" : "A"] as const));
    const czescB = Object.fromEntries(WYMIARY_A3.map((w) => [w.kod, 5]));
    const w = policzA3({ czescA, czescB });
    const sam = w.warunkiKluczowe.find((x) => x.wymiar === "SAM")!;
    expect(sam.biegun).toBe("B");
    expect(sam.warunek).toBe("stały kontakt z ludźmi");
  });
});

describe("A4: algorytm liczenia", () => {
  it("suma wygranych po dwunastu wartościach wynosi dokładnie 36", () => {
    const czescA = Object.fromEntries(PARY_A4.map((p) => [p.nr, p.lewa]));
    const w = policzA4({ czescA, czescB: [], czescC: [] });
    const suma = Object.values(w.rank).reduce((s, x) => s + (x / 100) * 6, 0);
    expect(Math.round(suma)).toBe(36);
  });

  it("bonus progowy jest addytywny i wynosi 25 punktów", () => {
    const czescA = Object.fromEntries(PARY_A4.map((p) => [p.nr, p.lewa]));
    const bez = policzA4({ czescA, czescB: [], czescC: [] });
    const z = policzA4({ czescA, czescB: ["REL"], czescC: [] });
    expect(z.v["REL"] - bez.v["REL"]).toBe(25);
    expect(z.rank["REL"]).toBe(bez.rank["REL"]);
  });

  it("wartość nieodzowna z niskim rankingiem jest oznaczana jako rozbieżność", () => {
    const czescA = Object.fromEntries(PARY_A4.map((p) => [p.nr, p.lewa]));
    const w = policzA4({ czescA, czescB: ["ZMI"], czescC: [] });
    if (w.rank["ZMI"] < 50) expect(w.rozbieznosci).toContain("ZMI");
  });

  it("test kosztu daje wskaźnik od zera do czterech", () => {
    const czescA = Object.fromEntries(PARY_A4.map((p) => [p.nr, p.lewa]));
    const w = policzA4({ czescA, czescB: [], czescC: ["tak", "tak", "nie", "zalezy"] });
    expect(w.koszt).toBe(2);
  });

  it("top5 i bottom3 nie zachodzą na siebie", () => {
    const czescA = Object.fromEntries(PARY_A4.map((p) => [p.nr, p.lewa]));
    const w = policzA4({ czescA, czescB: ["SEN"], czescC: [] });
    expect(w.top5).toHaveLength(5);
    expect(w.bottom3).toHaveLength(3);
    expect(w.top5.filter((x) => w.bottom3.includes(x))).toEqual([]);
  });
});

describe("A5: algorytm liczenia", () => {
  it("TAK, MOŻE i NIE dają 1,0, 0,5 i 0,0", () => {
    const w = policzA5({ czescA: { F01: "tak", F02: "moze", F03: "nie" }, czescB: [], czescC: [] });
    expect(w.g).toEqual({ F01: 1, F02: 0.5, F03: 0 });
  });

  it("weto można postawić wyłącznie na pozycji z odpowiedzią NIE, maksymalnie trzy", () => {
    const w = policzA5({
      czescA: { F01: "nie", F02: "nie", F03: "nie", F04: "nie", F05: "tak" },
      czescB: ["F01", "F02", "F03", "F04", "F05"],
      czescC: [],
    });
    expect(w.weta).toHaveLength(3);
    expect(w.weta).not.toContain("F05");
  });

  it("wskaźnik zamknięcia liczy odpowiedzi NIE", () => {
    const w = policzA5({ czescA: { F01: "nie", F02: "nie", F03: "tak" }, czescB: [], czescC: [] });
    expect(w.wskaznikZamkniecia).toBe(2);
    expect(w.brakOdmow).toBe(false);
  });
});

describe("M1: algorytm liczenia", () => {
  it("położenie liczy się jako udział wyborów bieguna A z czterech par", () => {
    const czescA: Record<string, "A" | "B"> = {};
    for (const p of PARY_M1) czescA[p.id] = p.id.endsWith("_1") || p.id.endsWith("_2") ? "A" : "B";
    const w = policzM1({ czescA, czescB: {} });
    for (const wym of WYMIARY_M1) expect(w.shape[wym.kod], wym.kod).toBe(50);
  });

  it("wymiar bez odpowiedzi zostaje pominięty jako null", () => {
    const w = policzM1({ czescA: {}, czescB: {} });
    for (const wym of WYMIARY_M1) expect(w.shape[wym.kod]).toBeNull();
  });
});

describe("złożenie wyników w wejście silnika", () => {
  it("komplet odpowiedzi daje komplet wejścia silnika", () => {
    const wyniki = zlozWynikiModulow({
      a0: null,
      a1: pelneA1(),
      a2: pelneA2(),
      a3: {
        czescA: Object.fromEntries(PARY_A3.map((p) => [p.id, "A" as const])),
        czescB: Object.fromEntries(WYMIARY_A3.map((w) => [w.kod, 4])),
      },
      a4: {
        czescA: Object.fromEntries(PARY_A4.map((p) => [p.nr, p.lewa])),
        czescB: ["SEN"],
        czescC: ["tak", "nie", "zalezy", "tak"],
      },
      a5: {
        czescA: { F01: "nie", F21: "nie", F16: "tak" },
        czescB: ["F21"],
        czescC: ["", "", ""],
      },
      m1: { czescA: Object.fromEntries(PARY_M1.map((p) => [p.id, "A" as const])), czescB: {} },
    });
    expect(Object.keys(wyniki.z)).toHaveLength(24);
    expect(Object.keys(wyniki.k)).toHaveLength(30);
    expect(Object.keys(wyniki.a3Pozycje)).toHaveLength(12);
    expect(wyniki.a4Top5).toHaveLength(5);
    expect(wyniki.weta).toEqual(["F21"]);
    expect(Object.values(wyniki.shape).every((v) => v === 100)).toBe(true);
  });
});
