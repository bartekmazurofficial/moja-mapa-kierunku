/**
 * Raport koncowy: dziewiec sekcji, ktore uczestnik dostaje na koniec programu.
 *
 * Testy pilnuja dwoch rzeczy naraz. Pierwsza: sekcje maja sie zbudowac
 * z prawdziwych odpowiedzi, a nie z pustych list. Druga i wazniejsza:
 * **raport koncowy nie jest obejsciem regul odslaniania**. Ten sam uklad
 * w innej formie graficznej nie ma prawa pokazac zawodow przed czwartym
 * spotkaniem tylko dlatego, ze sekcje sa teraz ponumerowane inaczej.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import { zbierzOdpowiedzi } from "@/lib/moduly/zbieranie";
import { zbudujRaport } from "@/lib/raport/budowa";
import { SEKCJE } from "@/lib/raport/sekcje";
import { ILE_SCIEZEK } from "@/lib/raport/sciezki";
import { uczestnikTestowy } from "./pomocnicze/fixtury";
import type { BazaReferencyjna } from "@/lib/domain/typy";
import type { KompletOdpowiedzi } from "@/lib/engine/moduly";

let baza: BazaReferencyjna;
let odpowiedzi: KompletOdpowiedzi;
let karty: Map<string, { pelna: boolean }>;

const WSZYSTKIE = new Set(SEKCJE.map((s) => s.id));

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
  const uczestnik = await uczestnikTestowy("rzemieslniczy");
  odpowiedzi = await zbierzOdpowiedzi(uczestnik.id);
  const wiersze = await prisma.karta.findMany({ select: { kod: true, pelna: true } });
  karty = new Map(wiersze.map((k) => [k.kod, { pelna: k.pelna }]));
});

function koncowy(dostepne: Set<string> = WSZYSTKIE) {
  return zbudujRaport({ imie: "Ania", odpowiedzi, baza, karty, dostepne }).koncowy!;
}

describe("raport końcowy: sekcje powstają z odpowiedzi", () => {
  it("sekcja pierwsza ma sześć kafli z różnych modułów", () => {
    const k = koncowy();
    expect(k.kafle).toHaveLength(6);
    // Kazdy kafel z innego pytania: co najmniej trzy rozne zrodla na szesc.
    expect(new Set(k.kafle.map((x) => x.zrodlo)).size).toBeGreaterThanOrEqual(3);
    for (const kafel of k.kafle) expect(kafel.tekst.length).toBeGreaterThan(0);
  });

  it("każdy warunek z sekcji czwartej ma drugą stronę", () => {
    const k = koncowy();
    expect(k.warunki.length).toBeGreaterThan(0);
    for (const w of k.warunki) {
      expect(w.potrzebujesz.length).toBeGreaterThan(0);
      expect(w.nieDlaCiebie.length).toBeGreaterThan(0);
      expect(w.nieDlaCiebie).not.toBe(w.potrzebujesz);
    }
  });

  it("sekcja ósma ma dokładnie osiem ścieżek i grupy progów", () => {
    const k = koncowy();
    expect(k.sciezki).not.toBeNull();
    expect(k.sciezki!.sciezki).toHaveLength(ILE_SCIEZEK);
    expect(k.sciezki!.grupy.length).toBeGreaterThan(0);
    // Kazda litera trafia do dokladnie jednej grupy progu.
    const wGrupach = k.sciezki!.grupy.flatMap((g) => g.litery).sort();
    expect(wGrupach).toEqual(k.sciezki!.sciezki.map((s) => s.litera).sort());
  });

  it("karta ścieżki ma ścieżkę rozwoju i zdanie z biblioteki treści", () => {
    const k = koncowy();
    for (const s of k.sciezki!.sciezki) {
      expect(s.sciezkaRozwoju.length).toBeGreaterThan(0);
      expect(s.coWartoWiedziec.length).toBeGreaterThan(0);
      expect(s.bezStudiow).toBe(true);
    }
  });

  it("punkt dopasowania na karcie ścieżki jest krótki, bez przedrostka silnika", () => {
    const k = koncowy();
    for (const s of k.sciezki!.sciezki) {
      for (const punkt of s.dlaczegoPasuje) expect(punkt).not.toContain(": ");
    }
  });

  it("ukryte atuty to kompetencje, a nie obszary zainteresowań", () => {
    const k = koncowy();
    // Dwa najwyzej, i kazdy z wyjasnieniem, po co to komu.
    expect(k.ukryteAtuty.length).toBeLessThanOrEqual(2);
    for (const a of k.ukryteAtuty) expect(a.dlaczego.length).toBeGreaterThan(20);
  });
});

describe("raport końcowy: reguły odsłaniania obowiązują tak samo", () => {
  it("bez warstwy zawodów nie ma ani jednej nazwy zawodu", () => {
    const bezZawodow = new Set([...WSZYSTKIE].filter((id) => id !== "zawody"));
    expect(koncowy(bezZawodow).sciezki).toBeNull();
  });

  it("bez warstwy obszarów nie ma ścieżek", () => {
    const bezObszarow = new Set([...WSZYSTKIE].filter((id) => id !== "obszary"));
    expect(koncowy(bezObszarow).sciezki).toBeNull();
  });

  it("przed czwartym spotkaniem nie ma kafli, warunków ani napięcia", () => {
    // Stan po drugim spotkaniu: otwarte sa tylko warstwy pierwsza i druga.
    const poDrugim = new Set(
      SEKCJE.filter((s) => ["ZAWSZE", "W1", "W2"].includes(s.warstwa)).map((s) => s.id),
    );
    const k = koncowy(poDrugim);
    expect(k.kafle).toEqual([]);
    expect(k.warunki).toEqual([]);
    expect(k.napiecie).toBeNull();
    expect(k.przewaga).toBeNull();
    expect(k.powtorzone).toBeNull();
    expect(k.doSprawdzenia).toBeNull();
    expect(k.sciezki).toBeNull();
  });

  it("z pustym zestawem sekcji raport końcowy jest w całości pusty", () => {
    const k = koncowy(new Set());
    expect(k.kafle).toEqual([]);
    expect(k.ukryteAtuty).toEqual([]);
    expect(k.sciezki).toBeNull();
  });
});
