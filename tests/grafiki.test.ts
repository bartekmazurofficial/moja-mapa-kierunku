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
import {
  maObraz,
  obrazDuzy,
  obrazKafla,
  zdjecieZawodu,
  zdjecieZawoduDuze,
} from "@/lib/ui/obrazy";
import { ZAWODY_ZE_ZDJECIEM } from "@/lib/ui/zdjecia-zawodow";
import { OBSZARY_A1, WYMIARY_A3 } from "@/lib/domain/slowniki";
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

  it("każda z 13 osi A3 ma kafel i wersję dużą", () => {
    for (const w of WYMIARY_A3) {
      const klucz = `a3-${w.kod}`;
      expect(maObraz(klucz), klucz).toBe(true);
      expect(istnieje(obrazKafla(klucz)), `${klucz} kafel`).toBe(true);
      expect(istnieje(obrazDuzy(klucz)), `${klucz} duży`).toBe(true);
    }
  });

  it("kafle mieszczą się w budżecie wagi: cały moduł poniżej 1 MB", () => {
    for (const modul of ["a1", "a3"]) {
      const katalog = path.join(PUBLIC, "grafika", modul);
      const waga = fs
        .readdirSync(katalog)
        .filter((f) => !f.includes("-duzy"))
        .reduce((s, f) => s + fs.statSync(path.join(katalog, f)).size, 0);
      expect(waga, modul).toBeLessThan(1024 * 1024);
    }
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

/**
 * Zdjęcia zawodów.
 *
 * Dochodzą partiami po kilkadziesiąt sztuk, więc zawód bez zdjęcia jest
 * normalnym stanem. Sprawdzalne jest co innego: że lista kodów i dysk
 * zgadzają się w obie strony, że kody z listy istnieją w bazie i że kafel
 * listy nie przekracza wagi, którą telefon w szkole zniesie.
 */
describe("zdjęcia zawodów", () => {
  const KATALOG = path.join(PUBLIC, "grafika", "zawody");

  it("każdy zadeklarowany kod ma oba pliki na dysku", () => {
    const bez: string[] = [];
    for (const kod of ZAWODY_ZE_ZDJECIEM) {
      if (!istnieje(zdjecieZawodu(kod))) bez.push(`${kod}.jpg`);
      if (!istnieje(zdjecieZawoduDuze(kod))) bez.push(`${kod}-duzy.jpg`);
    }
    expect(bez).toEqual([]);
  });

  it("w katalogu nie leży zdjęcie, którego nikt nie pokaże", () => {
    if (!fs.existsSync(KATALOG)) return;
    const osierocone = fs
      .readdirSync(KATALOG)
      .filter((p) => p.endsWith(".jpg"))
      .map((p) => p.replace(/-duzy\.jpg$|\.jpg$/, ""))
      .filter((kod) => !ZAWODY_ZE_ZDJECIEM.has(kod));
    expect([...new Set(osierocone)]).toEqual([]);
  });

  it("każdy kod z listy to zawód, który istnieje w bazie", async () => {
    const { prisma } = await import("@/lib/db/klient");
    const kody = new Set((await prisma.zawod.findMany({ select: { kod: true } })).map((z) => z.kod));
    expect([...ZAWODY_ZE_ZDJECIEM].filter((k) => !kody.has(k))).toEqual([]);
  });

  it("kafel listy waży poniżej 90 kB, a nagłówek poniżej 260 kB", () => {
    // Lista pokazuje kilkadziesiąt kafli naraz. Oryginały mają po 2 MB
    // i nie wolno ich tam podawać; skrypt skaluje je do 480 i 1000 px.
    const ciezkie: string[] = [];
    for (const kod of ZAWODY_ZE_ZDJECIEM) {
      const kafel = fs.statSync(path.join(KATALOG, `${kod}.jpg`)).size;
      const duzy = fs.statSync(path.join(KATALOG, `${kod}-duzy.jpg`)).size;
      if (kafel > 90_000) ciezkie.push(`${kod}.jpg: ${Math.round(kafel / 1024)} kB`);
      if (duzy > 260_000) ciezkie.push(`${kod}-duzy.jpg: ${Math.round(duzy / 1024)} kB`);
    }
    expect(ciezkie).toEqual([]);
  });
});
