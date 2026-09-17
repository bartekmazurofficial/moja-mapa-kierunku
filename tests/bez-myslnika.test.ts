/**
 * Myślnik pauzowy w tekstach na ekranie.
 *
 * Decyzja redakcyjna: zdania mają być poukładane tak, żeby myślnik nie był
 * potrzebny. Test przegląda pliki z treścią i widokami, pomija komentarze
 * (te nie trafiają na ekran) i pada, gdy „—” wróci przy kolejnej edycji.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";

const KORZEN = path.resolve(__dirname, "..");

/** Katalogi z kodem, który coś wyświetla. Skrypty i testy nas nie dotyczą. */
const KATALOGI = ["app", "components", "lib"];
const POMIJANE = new Set(["node_modules", ".next", ".git", "generated"]);

function pliki(katalog: string): string[] {
  const wynik: string[] = [];
  for (const wpis of fs.readdirSync(katalog, { withFileTypes: true })) {
    if (POMIJANE.has(wpis.name)) continue;
    const pelna = path.join(katalog, wpis.name);
    if (wpis.isDirectory()) wynik.push(...pliki(pelna));
    else if (/\.tsx?$/.test(wpis.name)) wynik.push(pelna);
  }
  return wynik;
}

/** Usuwa komentarze blokowe i liniowe. Reszta to kandydat na ekran. */
function bezKomentarzy(tekst: string): string {
  return tekst.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

describe("myślnik pauzowy nie wraca", () => {
  it("żaden plik widoku ani treści nie zawiera „—” poza komentarzem", () => {
    const winne: string[] = [];
    for (const katalog of KATALOGI) {
      for (const plik of pliki(path.join(KORZEN, katalog))) {
        const tresc = bezKomentarzy(fs.readFileSync(plik, "utf8"));
        if (!tresc.includes("—")) continue;
        for (const linia of tresc.split("\n")) {
          if (linia.includes("—")) {
            winne.push(`${path.relative(KORZEN, plik)}: ${linia.trim().slice(0, 90)}`);
          }
        }
      }
    }
    expect(winne, winne.join("\n")).toEqual([]);
  });

  it("pola wyświetlane w bazie też go nie mają", async () => {
    const winne: string[] = [];
    const sprawdz = (gdzie: string, tekst: string | null | undefined) => {
      if (tekst?.includes("—")) winne.push(`${gdzie}: ${tekst.slice(0, 80)}`);
    };
    for (const o of await prisma.obszar.findMany()) {
      sprawdz(`obszar.${o.id}.nazwa`, o.nazwa);
      sprawdz(`obszar.${o.id}.poziomy`, o.poziomy);
      sprawdz(`obszar.${o.id}.trudne`, o.trudne);
    }
    for (const z of await prisma.zawod.findMany()) {
      sprawdz(`zawod.${z.kod}.nazwa`, z.nazwaWyswietlana);
      sprawdz(`zawod.${z.kod}.kier`, z.kier);
    }
    for (const k of await prisma.karta.findMany()) sprawdz(`karta.${k.kod}`, k.sekcje);
    expect(winne, winne.join("\n")).toEqual([]);
  });
});

describe("czas wypełniania nie wraca na ekran uczestnika", () => {
  it("instrukcje modułów nie podają, ile to zajmie", async () => {
    const { INSTRUKCJA_ZAINTERESOWAN } = await import("@/lib/content/bank-zainteresowan");
    const { INSTRUKCJA_LUBIE, INSTRUKCJA_UMIEM } = await import("@/lib/content/bank-czynnosci");
    const { INSTRUKCJA_POZIOMU_ZYCIA } = await import("@/lib/content/poziom-zycia");
    const teksty = [
      ...INSTRUKCJA_ZAINTERESOWAN.wprowadzenie,
      ...INSTRUKCJA_LUBIE.wprowadzenie,
      ...INSTRUKCJA_UMIEM.wprowadzenie,
      ...INSTRUKCJA_POZIOMU_ZYCIA.wprowadzenie,
    ];
    for (const t of teksty) {
      expect(t, t).not.toMatch(/\b\d+\s*(minut|godzin)/i);
    }
  });

  it("nie ma już tabeli czasów modułów", async () => {
    const ekrany = (await import("@/lib/moduly/ekrany")) as Record<string, unknown>;
    expect(ekrany.CZASY_MODULOW).toBeUndefined();
  });
});
