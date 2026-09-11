/**
 * Rozszerzenie modułów po fazie 5: A5 z 32 do 43 pozycji, A3 z 12 do 13 osi.
 * Testy pilnują tego, co przy takiej zmianie łatwo rozjechać: kompletności
 * odwzorowań między kartami a modułami i tego, że żadna reguła antyprofilu
 * nie wskazuje na nieistniejące źródło.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { FILTRY_A5, WYMIARY_A3 } from "@/lib/domain/slowniki";
import { PARY_A3, KOTWICE_A3 } from "@/lib/content/a3";
import { A3_KARTA_NA_MODUL, A5_KARTA_NA_MODUL } from "@/lib/engine/mapowanie";
import { ANTYPROFIL, kodyNieaktywne } from "@/lib/engine/antyprofil";

interface Karta {
  a3?: string[];
  a5?: string[];
  anty?: string[];
}
let zawody: Record<string, Karta>;

beforeAll(() => {
  zawody = JSON.parse(readFileSync("program-doradztwa/03_dane/zawody_baza.json", "utf8"));
});

describe("moduł A5 po rozszerzeniu", () => {
  it("ma 43 pozycje o unikalnych kodach", () => {
    expect(FILTRY_A5).toHaveLength(43);
    expect(new Set(FILTRY_A5.map((f) => f.kod)).size).toBe(43);
  });

  it("nowe pozycje siedzą w istniejących blokach, żaden blok nie powstał", () => {
    const bloki = new Set(FILTRY_A5.map((f) => f.blok));
    expect([...bloki].sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    // Nazwa bloku jest jedna na numer, nie dwie.
    const nazwy = new Map<number, Set<string>>();
    for (const f of FILTRY_A5) {
      if (!nazwy.has(f.blok)) nazwy.set(f.blok, new Set());
      nazwy.get(f.blok)!.add(f.nazwaBloku);
    }
    for (const [blok, zbior] of nazwy) expect(zbior.size, `blok ${blok}`).toBe(1);
  });

  it("siedem kodów z kart dostało pozycję w module", () => {
    for (const kod of ["halas", "umieranie", "agresja", "ciasnota", "wysokosc", "chemikalia", "wieczory"]) {
      expect(A5_KARTA_NA_MODUL[kod], kod).toMatch(/^F\d\d$/);
    }
  });

  it("każdy kod A5 używany w kartach jest w tabeli odwzorowania", () => {
    const uzyte = new Set(Object.values(zawody).flatMap((z) => z.a5 ?? []));
    const brakujace = [...uzyte].filter((k) => !(k in A5_KARTA_NA_MODUL));
    expect(brakujace).toEqual([]);
  });

  it("bez źródła zostały tylko gorąco i powtarzalność", () => {
    const uzyte = new Set(Object.values(zawody).flatMap((z) => z.a5 ?? []));
    const bezZrodla = [...uzyte].filter((k) => A5_KARTA_NA_MODUL[k] === null).sort();
    expect(bezZrodla).toEqual(["goraco", "powtarzalnosc"]);
  });

  it("każde odwzorowanie wskazuje na istniejącą pozycję modułu", () => {
    const kody = new Set(FILTRY_A5.map((f) => f.kod));
    for (const [karta, filtr] of Object.entries(A5_KARTA_NA_MODUL)) {
      if (filtr === null) continue;
      expect(kody.has(filtr), `${karta} -> ${filtr}`).toBe(true);
    }
  });
});

describe("oś EFE w module A3", () => {
  it("moduł ma 13 osi, 65 par i 13 kotwic", () => {
    expect(WYMIARY_A3).toHaveLength(13);
    expect(PARY_A3).toHaveLength(65);
    expect(KOTWICE_A3).toHaveLength(13);
    expect(WYMIARY_A3.map((w) => w.kod)).toContain("EFE");
    expect(PARY_A3.filter((p) => p.wymiar === "EFE")).toHaveLength(5);
    expect(KOTWICE_A3.find((k) => k.wymiar === "EFE")).toBeDefined();
  });

  it("każda para należy do istniejącej osi, każda oś ma kotwicę", () => {
    const osie = new Set(WYMIARY_A3.map((w) => w.kod));
    for (const p of PARY_A3) expect(osie.has(p.wymiar), p.id).toBe(true);
    for (const w of WYMIARY_A3) {
      expect(KOTWICE_A3.some((k) => k.wymiar === w.kod), w.kod).toBe(true);
    }
  });

  it("kod efekt_widoczny z kart ma teraz oś", () => {
    expect(A3_KARTA_NA_MODUL.efekt_widoczny).toBe("EFE:A");
    expect(A3_KARTA_NA_MODUL.efekt_odroczony).toBe("EFE:B");
  });

  it("każde odwzorowanie A3 wskazuje na istniejącą oś i biegun", () => {
    const osie = new Set(WYMIARY_A3.map((w) => w.kod));
    for (const [karta, cel] of Object.entries(A3_KARTA_NA_MODUL)) {
      if (cel === null) continue;
      const [os, biegun] = cel.split(":");
      expect(osie.has(os), `${karta} -> ${cel}`).toBe(true);
      expect(["A", "B"]).toContain(biegun);
    }
  });
});

describe("antyprofil po rozszerzeniu", () => {
  it("czterdzieści osiem reguł aktywnych, dwanaście nieaktywnych", () => {
    const aktywne = Object.values(ANTYPROFIL).filter((r) => r.aktywna).length;
    expect(aktywne).toBe(48);
    expect(kodyNieaktywne()).toHaveLength(12);
  });

  it("żadna aktywna reguła nie odwołuje się do nieistniejącej pozycji A5", () => {
    const kody = new Set(FILTRY_A5.map((f) => f.kod));
    const zrodlo = readFileSync("lib/engine/antyprofil.ts", "utf8");
    for (const m of zrodlo.matchAll(/odmowa\(w, "(F\d\d)"\)/g)) {
      expect(kody.has(m[1]), m[1]).toBe(true);
    }
  });

  it("żadna aktywna reguła nie odwołuje się do nieistniejącej osi A3", () => {
    const osie = new Set(WYMIARY_A3.map((w) => w.kod));
    const zrodlo = readFileSync("lib/engine/antyprofil.ts", "utf8");
    for (const m of zrodlo.matchAll(/warunekKluczowy\(w, "([A-Z]{3})"/g)) {
      expect(osie.has(m[1]), m[1]).toBe(true);
    }
  });

  it("każdy kod antyprofilu z kart ma regułę, aktywną albo nie", () => {
    const uzyte = new Set(Object.values(zawody).flatMap((z) => z.anty ?? []));
    const brakujace = [...uzyte].filter((k) => !(k in ANTYPROFIL));
    expect(brakujace).toEqual([]);
  });

  it("nieaktywne kody to dokładnie te bez możliwego źródła", () => {
    expect(kodyNieaktywne().map((k) => k.kod)).toEqual([
      "bez_uzasadnienia", "bez_zawodu", "dotyk", "goraco_nie", "krytyka_osobista",
      "potrzeba_doradzania", "potrzeba_gotowania", "potrzeba_tworzenia", "rece_slabe",
      "tworczosc_od_razu", "wczesne_wstawanie", "wizualizacje_tylko",
    ]);
  });
});
