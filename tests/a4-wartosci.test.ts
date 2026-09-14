/**
 * Moduł wartości A4 po wprowadzeniu pięciu formuł.
 *
 * Dziesięć sprawdzeń z rozdziału „testy obowiązkowe" specyfikacji. Test
 * trzeci jest najważniejszy: błąd w odwracaniu bloku czwartego daje wynik,
 * który wygląda sensownie i jest fałszywy, więc nikt by go nie zauważył.
 */

import { describe, expect, it } from "vitest";
import {
  FORMULY_A4,
  LICZBA_BLOKOW_A4,
  NAPIECIA_A4,
  NAZWY_KROTKIE_A4,
  OPISY_A4,
  KONFLIKTY_A4,
  PARY_A4,
  TEST_KOSZTU,
  TWARDOSC_A4,
} from "@/lib/content/a4";
import { WARTOSCI_A4 } from "@/lib/domain/slowniki";
import { policzA4, type OdpowiedziA4 } from "@/lib/engine/moduly";
import { wygraneA4 } from "@/lib/moduly/zbieranie";

const KODY = WARTOSCI_A4.map((w) => w.kod);

/** Odpowiedzi, w których uczestnik w każdej parze klika stronę lewą. */
function zawszeLewa(): Record<string, string> {
  return Object.fromEntries(PARY_A4.map((p) => [`para_${p.nr}`, p.lewa]));
}

function pusty(): OdpowiedziA4 {
  return { czescA: {}, czescB: [], czescC: [] };
}

describe("1 · bilans planu", () => {
  it("każda wartość jest w dokładnie sześciu parach", () => {
    const ile: Record<string, number> = Object.fromEntries(KODY.map((k) => [k, 0]));
    for (const p of PARY_A4) {
      ile[p.lewa] += 1;
      ile[p.prawa] += 1;
    }
    expect(Object.entries(ile).filter(([, n]) => n !== 6)).toEqual([]);
  });

  it("suma wygranych zawsze wynosi 36", () => {
    const wynik = policzA4({ ...pusty(), czescA: wygraneA4(zawszeLewa()) });
    const suma = KODY.reduce((s, k) => s + (wynik.rank[k] / 100) * 6, 0);
    expect(Math.round(suma)).toBe(36);
  });

  it("żadna para nie powtarza się ani nie zestawia wartości z samą sobą", () => {
    const klucze = PARY_A4.map((p) => [p.lewa, p.prawa].sort().join("-"));
    expect(new Set(klucze).size).toBe(PARY_A4.length);
    expect(PARY_A4.filter((p) => p.lewa === p.prawa)).toEqual([]);
  });
});

describe("2 · pokrycie formuł", () => {
  it("każda wartość występuje w co najmniej trzech formułach", () => {
    const slabe: string[] = [];
    for (const k of KODY) {
      const formuly = new Set(
        PARY_A4.filter((p) => p.lewa === k || p.prawa === k).map((p) => p.formula),
      );
      if (formuly.size < 3) slabe.push(`${k}: ${formuly.size}`);
    }
    expect(slabe).toEqual([]);
  });

  it("pięć formuł, bloki po kolei, tylko rezygnacja jest odwrotna", () => {
    const bloki = [...new Set(PARY_A4.map((p) => FORMULY_A4[p.formula].blok))].sort();
    expect(bloki).toEqual([1, 2, 3, 4, 5]);
    expect(bloki).toHaveLength(LICZBA_BLOKOW_A4);
    const odwrotne = Object.entries(FORMULY_A4).filter(([, f]) => f.odwrotna).map(([k]) => k);
    expect(odwrotne).toEqual(["rezygnacja"]);
  });

  it("każda para ma własny tekst po obu stronach", () => {
    const bez = PARY_A4.filter((p) => !p.tekstLewej.trim() || !p.tekstPrawej.trim());
    expect(bez.map((p) => p.nr)).toEqual([]);
    expect(PARY_A4.filter((p) => p.tekstLewej === p.tekstPrawej)).toEqual([]);
  });
});

describe("3 · odwrócenie bloku czwartego", () => {
  const REZYGNACJA = PARY_A4.filter((p) => FORMULY_A4[p.formula].odwrotna);

  it("w bloku czwartym wygrywa strona, której uczestnik NIE kliknął", () => {
    for (const p of REZYGNACJA) {
      expect(wygraneA4({ [`para_${p.nr}`]: p.lewa })[p.nr], `${p.nr} lewa`).toBe(p.prawa);
      expect(wygraneA4({ [`para_${p.nr}`]: p.prawa })[p.nr], `${p.nr} prawa`).toBe(p.lewa);
    }
  });

  it("w pozostałych blokach wygrywa strona kliknięta", () => {
    for (const p of PARY_A4.filter((x) => !FORMULY_A4[x.formula].odwrotna)) {
      expect(wygraneA4({ [`para_${p.nr}`]: p.lewa })[p.nr], String(p.nr)).toBe(p.lewa);
    }
  });

  it("uczestnik broniący jednej wartości wszędzie ma ją na szczycie", () => {
    // „Bronić" znaczy: w blokach zwykłych wybrać ją, w bloku rezygnacji
    // wybrać tę drugą. Bez odwrócenia ta sama osoba wypadłaby niżej.
    const BRONIONA = "WOL";
    const klikniecia: Record<string, string> = {};
    for (const p of PARY_A4) {
      const maWolnosc = p.lewa === BRONIONA || p.prawa === BRONIONA;
      const druga = p.lewa === BRONIONA ? p.prawa : p.lewa;
      if (!maWolnosc) klikniecia[`para_${p.nr}`] = p.lewa;
      else klikniecia[`para_${p.nr}`] = FORMULY_A4[p.formula].odwrotna ? druga : BRONIONA;
    }
    const wynik = policzA4({ ...pusty(), czescA: wygraneA4(klikniecia) });
    expect(wynik.rank[BRONIONA]).toBe(100);
    expect(wynik.kolejnosc[0]).toBe(BRONIONA);
  });

  it("ta sama osoba bez odwrócenia wypadłaby niżej, więc odwrócenie robi różnicę", () => {
    const BRONIONA = "WOL";
    const klikniecia: Record<string, string> = {};
    for (const p of PARY_A4) {
      const maWolnosc = p.lewa === BRONIONA || p.prawa === BRONIONA;
      const druga = p.lewa === BRONIONA ? p.prawa : p.lewa;
      if (!maWolnosc) klikniecia[`para_${p.nr}`] = p.lewa;
      else klikniecia[`para_${p.nr}`] = FORMULY_A4[p.formula].odwrotna ? druga : BRONIONA;
    }
    const bezOdwrocenia: Record<number, string> = {};
    for (const [k, v] of Object.entries(klikniecia)) bezOdwrocenia[Number(k.replace("para_", ""))] = v;
    const zly = policzA4({ ...pusty(), czescA: bezOdwrocenia });
    expect(zly.rank[BRONIONA]).toBeLessThan(100);
  });
});

describe("4 · determinizm sortowania", () => {
  it("dwa przeliczenia tych samych odpowiedzi dają identyczną kolejność", () => {
    const o: OdpowiedziA4 = {
      czescA: wygraneA4(zawszeLewa()),
      czescB: ["WOL", "STA"],
      czescC: ["tak", "zalezy", "tak", "nie"],
    };
    expect(policzA4(o).kolejnosc).toEqual(policzA4(o).kolejnosc);
  });

  it("wynik pusty też jest uporządkowany, po indeksie w słowniku", () => {
    expect(policzA4(pusty()).kolejnosc).toEqual(KODY);
  });
});

describe("5 i 6 · zakres v oraz bonus addytywny", () => {
  it("v mieści się między 0 a 125", () => {
    const o: OdpowiedziA4 = {
      czescA: wygraneA4(zawszeLewa()),
      czescB: ["WOL", "STA", "PIE"],
      czescC: [],
    };
    for (const k of KODY) {
      expect(policzA4(o).v[k], k).toBeGreaterThanOrEqual(0);
      expect(policzA4(o).v[k], k).toBeLessThanOrEqual(125);
    }
  });

  it("trzy wygrane z oznaczeniem wyprzedzają cztery bez niego", () => {
    // 3/6 = 50 plus bonus 25 daje 75, czyli więcej niż 4/6 = 66,7.
    const trzy = PARY_A4.filter((p) => p.lewa === "WOL" || p.prawa === "WOL").slice(0, 3);
    const cztery = PARY_A4.filter((p) => p.lewa === "MIS" || p.prawa === "MIS").slice(0, 4);
    const czescA: Record<number, string> = {};
    for (const p of trzy) czescA[p.nr] = "WOL";
    for (const p of cztery) czescA[p.nr] = "MIS";
    const wynik = policzA4({ czescA, czescB: ["WOL"], czescC: [] });
    expect(wynik.rank.WOL).toBeLessThan(wynik.rank.MIS);
    expect(wynik.v.WOL).toBeGreaterThan(wynik.v.MIS);
    expect(wynik.kolejnosc.indexOf("WOL")).toBeLessThan(wynik.kolejnosc.indexOf("MIS"));
  });
});

describe("7 · dobór kosztów", () => {
  it("pula podstawowa i zamienna dają zawsze cztery pytania bez wartości testowanej", () => {
    for (const testowana of KODY) {
      const uzyte = new Set([testowana]);
      const pytania: string[] = [];
      for (const p of [...TEST_KOSZTU.pytania, ...TEST_KOSZTU.zamienniki]) {
        if (pytania.length >= 4 || uzyte.has(p.kod)) continue;
        uzyte.add(p.kod);
        pytania.push(p.kod);
      }
      expect(pytania, testowana).toHaveLength(4);
      expect(pytania, testowana).not.toContain(testowana);
    }
  });
});

describe("8 · twardość", () => {
  const zKosztem = (c: Array<"tak" | "nie" | "zalezy">) =>
    policzA4({ ...pusty(), czescC: c }).twardosc;

  it("cztery razy tak daje warunek, cztery razy nie daje preferencję", () => {
    expect(zKosztem(["tak", "tak", "tak", "tak"])).toBe("warunek");
    expect(zKosztem(["nie", "nie", "nie", "nie"])).toBe("preferencja");
  });

  it("progi sześciu i trzech punktów", () => {
    expect(zKosztem(["tak", "tak", "tak", "nie"])).toBe("warunek");
    expect(zKosztem(["tak", "tak", "nie", "nie"])).toBe("silna_preferencja");
    expect(zKosztem(["zalezy", "zalezy", "zalezy", "nie"])).toBe("silna_preferencja");
    expect(zKosztem(["zalezy", "zalezy", "nie", "nie"])).toBe("preferencja");
  });

  it("niewypełniony test kosztu nie udaje preferencji", () => {
    expect(policzA4(pusty()).twardosc).toBeNull();
  });

  it("każda z trzech twardości ma tekst do raportu", () => {
    for (const k of ["warunek", "silna_preferencja", "preferencja"]) {
      expect(TWARDOSC_A4[k].naglowek).toContain("{NAZWA}");
      expect(TWARDOSC_A4[k].tresc.length).toBeGreaterThan(40);
    }
  });
});

describe("9 · napięcia", () => {
  it("w wyniku są najwyżej dwa", () => {
    const czescA: Record<number, string> = {};
    for (const p of PARY_A4) czescA[p.nr] = p.lewa;
    const wynik = policzA4({ czescA, czescB: [], czescC: [] });
    expect(wynik.napiecia.length).toBeLessThanOrEqual(2);
  });

  it("napięcie pojawia się tylko wtedy, gdy obie wartości są w czołówce", () => {
    const wynik = policzA4({ ...pusty(), czescB: ["WOL", "STA"], czescC: [] });
    for (const n of wynik.napiecia) {
      expect(wynik.top5, `${n.a}+${n.b}`).toContain(n.a);
      expect(wynik.top5, `${n.a}+${n.b}`).toContain(n.b);
    }
  });

  it("każda zdefiniowana para napięcia ma tekst i istniejące kody", () => {
    for (const n of NAPIECIA_A4) {
      expect(KODY, n.a).toContain(n.a);
      expect(KODY, n.b).toContain(n.b);
      expect(n.tekst.length).toBeGreaterThan(60);
    }
  });
});

describe("10 · rozjazd", () => {
  it("nigdy nie powstaje przy mniej niż dwóch parach w bloku czwartym", () => {
    const maloPar = KODY.filter(
      (k) =>
        PARY_A4.filter(
          (p) => FORMULY_A4[p.formula].odwrotna && (p.lewa === k || p.prawa === k),
        ).length < 2,
    );
    const czescA: Record<number, string> = {};
    for (const p of PARY_A4) czescA[p.nr] = p.lewa;
    const wynik = policzA4({ czescA, czescB: [], czescC: [] });
    if (wynik.rozjazd) expect(maloPar).not.toContain(wynik.rozjazd.kod);
  });

  it("wartość wygrywana wprost i oddawana pod kosztem daje rozjazd", () => {
    // REL, bo tylko relacje i zmienność mają w bloku czwartym dwie pary,
    // a przy jednej parze reguła z definicji nie może się odpalić. Patrz
    // test niżej: to jest własność planu, nie tego przypadku.
    const KOD = "REL";
    const czescA: Record<number, string> = {};
    for (const p of PARY_A4) {
      const ma = p.lewa === KOD || p.prawa === KOD;
      const druga = p.lewa === KOD ? p.prawa : p.lewa;
      // Wygrywa wszędzie poza blokiem czwartym, gdzie zostaje oddana.
      czescA[p.nr] = ma ? (FORMULY_A4[p.formula].odwrotna ? druga : KOD) : p.lewa;
    }
    const wynik = policzA4({ czescA, czescB: [KOD], czescC: [] });
    expect(wynik.rozjazd?.kod).toBe(KOD);
    expect(wynik.rozjazd?.roznica).toBeGreaterThanOrEqual(0.5);
  });

  it("rozjazd może dziś dotyczyć wyłącznie relacji i zmienności", () => {
    /**
     * Reguła wymaga co najmniej dwóch par wartości w bloku czwartym, a plan
     * daje dwie tylko relacjom i zmienności; pozostałe dziesięć ma po jednej.
     * Mechanizm jest więc sprawny, ale prawie nigdy nie ma czego zgłosić.
     * Test pilnuje, żeby ta własność planu była widoczna, a nie odkrywana
     * przez przypadek przy czytaniu raportu.
     */
    const zDwiema = KODY.filter(
      (k) =>
        PARY_A4.filter(
          (p) => FORMULY_A4[p.formula].odwrotna && (p.lewa === k || p.prawa === k),
        ).length >= 2,
    );
    expect(zDwiema).toEqual(["REL", "ZMI"]);
  });

  it("bez różnicy między formułami nie ma rozjazdu", () => {
    const czescA: Record<number, string> = {};
    for (const p of PARY_A4) czescA[p.nr] = p.lewa;
    expect(policzA4({ czescA, czescB: [], czescC: [] }).rozjazd).toBeNull();
  });
});

describe("teksty wynikowe są kompletne", () => {
  it("każda z dwunastu wartości ma krótką nazwę, opis i tekst konfliktu", () => {
    for (const k of KODY) {
      expect(NAZWY_KROTKIE_A4[k], k).toBeTruthy();
      expect(OPISY_A4[k]?.length ?? 0, k).toBeGreaterThan(30);
      expect(KONFLIKTY_A4[k]?.length ?? 0, k).toBeGreaterThan(20);
    }
  });

  it("żaden tekst wynikowy nie porównuje uczestnika z innymi", () => {
    const caly = [...Object.values(OPISY_A4), ...NAPIECIA_A4.map((n) => n.tekst)]
      .join(" ")
      .toLowerCase();
    for (const s of ["niż inni", "od innych", "większość ludzi", "percentyl", "wynik testu"]) {
      expect(caly, s).not.toContain(s);
    }
  });
});
