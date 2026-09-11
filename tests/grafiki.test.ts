/**
 * Ilustracje kategorii.
 *
 * `lib/ui/obrazy.ts` deklaruje, dla których kategorii jest plik. Deklaracja
 * i dysk muszą się zgadzać w obie strony: brakujący plik to pusty kafel,
 * a plik bez deklaracji to grafika, której nikt nie zobaczy.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { maObraz, obrazDuzy, obrazKafla } from "@/lib/ui/obrazy";
import { OBSZARY_A1 } from "@/lib/domain/slowniki";
import { GLIFY } from "@/lib/ui/glify";

const PUBLIC = path.resolve(__dirname, "..", "public");

function istnieje(adres: string | null): boolean {
  return adres !== null && fs.existsSync(path.join(PUBLIC, adres.replace(/^\//, "")));
}

describe("ilustracje kategorii", () => {
  it("każdy z 24 obszarów A1 ma kafel i wersję dużą", () => {
    for (const o of OBSZARY_A1) {
      const klucz = `a1-${o.id}`;
      expect(maObraz(klucz), klucz).toBe(true);
      expect(istnieje(obrazKafla(klucz)), `${klucz} kafel`).toBe(true);
      expect(istnieje(obrazDuzy(klucz)), `${klucz} duży`).toBe(true);
    }
  });

  it("kafle mieszczą się w budżecie wagi: cały moduł poniżej 1 MB", () => {
    const katalog = path.join(PUBLIC, "grafika", "a1");
    const waga = fs
      .readdirSync(katalog)
      .filter((f) => /^\d+\.jpg$/.test(f))
      .reduce((s, f) => s + fs.statSync(path.join(katalog, f)).size, 0);
    expect(waga).toBeLessThan(1024 * 1024);
  });

  it("kategoria bez ilustracji nadal ma rysowany glif", () => {
    for (const klucz of Object.keys(GLIFY)) {
      if (maObraz(klucz)) continue;
      expect(GLIFY[klucz].length, klucz).toBeGreaterThan(0);
    }
  });

  it("nie deklarujemy obrazów, których nie ma na dysku", () => {
    for (const klucz of Object.keys(GLIFY)) {
      if (!maObraz(klucz)) continue;
      expect(istnieje(obrazKafla(klucz)), klucz).toBe(true);
    }
  });
});
