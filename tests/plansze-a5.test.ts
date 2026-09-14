/**
 * Czterdzieści trzy plansze warunków A5.
 *
 * Panel filtrów pokazuje pas nad trzema odpowiedziami i bierze go po kluczu
 * `a5-FXX`. Klucz bez pliku daje pustą ramkę, a plik bez klucza nie pokazuje
 * się wcale, więc jedno i drugie trzeba trzymać w zgodzie. Test czyta katalog
 * z dysku, nie listę w kodzie: to jedyny sposób, żeby wyłapać literówkę
 * w nazwie pliku.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FILTRY_A5 } from "@/lib/domain/slowniki";
import { maObraz, obrazPlanszy } from "@/lib/ui/obrazy";

const KATALOG = path.join(process.cwd(), "public", "grafika", "plansze");

describe("plansze warunków A5", () => {
  it("każdy z czterdziestu trzech warunków ma planszę i plik na dysku", () => {
    const bez: string[] = [];
    for (const f of FILTRY_A5) {
      const klucz = `a5-${f.kod}`;
      const sciezka = obrazPlanszy(klucz);
      if (!sciezka || !fs.existsSync(path.join(process.cwd(), "public", sciezka))) {
        bez.push(`${klucz} (${f.tekst})`);
      }
    }
    expect(bez).toEqual([]);
  });

  it("ekran warunku w ogóle poprosi o obrazek", () => {
    // Runner rysuje pas tylko wtedy, gdy `maObraz` zwróci prawdę dla klucza
    // ekranu. Plansza bez kwadratowego kafla też się liczy.
    for (const f of FILTRY_A5) {
      expect(maObraz(`a5-${f.kod}`), f.kod).toBe(true);
    }
  });

  it("w katalogu plansz nie leży nic, czego nikt nie pokaże", () => {
    const kody = new Set(FILTRY_A5.map((f) => `a5-${f.kod}.jpg`));
    const osierocone = fs
      .readdirSync(KATALOG)
      .filter((plik) => plik.startsWith("a5-") && !kody.has(plik));
    expect(osierocone).toEqual([]);
  });
});
