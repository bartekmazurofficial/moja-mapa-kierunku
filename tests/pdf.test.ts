/**
 * Eksport PDF.
 *
 * Regresja: sekcje mialy `wrap={false}` i caly dokument przestawal sie
 * renderowac, gdy jedna sekcja urosla ponad wysokosc strony.
 *
 * Dokument ma sie renderowac takze wtedy, gdy czesc modulow jest pusta, bo
 * uczestnik moze pobrac plik po pierwszym spotkaniu. I ta sama zasada, ktora
 * dotyczy ekranu: **zawody nie wchodza do pliku przed odsloniecem warstwy**.
 * Plik zyje latami, wiec wyciek jest tam trwalszy niz na stronie.
 */

import { describe, expect, it } from "vitest";

describe("eksport PDF", () => {
  const PODSTAWA = {
    imie: "Ania",
    dataWygenerowania: "16 września 2026",
    stopka: "Fundacja Służąc Życiu",
    tematy: ["Medycyna i zdrowie", "Sport", "Psychologia"],
    lubie: ["Naprawianie", "Budowanie", "Rozwiązywanie problemów"],
    umiem: ["Naprawianie", "Precyzyjna praca manualna"],
    listy: [
      { tytul: "To lubisz i dobrze Ci wychodzi", opis: "opis listy", pozycje: ["Naprawianie"] },
    ],
    poziom: { minimum: "4 500 zł", komfort: "9 200 zł", cel: "11 000 zł", rocznie: "110 400 zł" },
    koszty: [{ nazwa: "Mieszkanie", kwota: "3 500 zł", udzial: 30 }],
  };

  it("renderuje się z pełną treścią", async () => {
    const { zbudujPdfNowy } = await import("@/lib/raport/pdf");
    const buf = await zbudujPdfNowy({
      ...PODSTAWA,
      zawody: Array.from({ length: 10 }, (_, i) => ({
        nazwa: `Zawód ${i + 1}`,
        bezStudiow: i % 2 === 0,
        uzasadnienie: "Z Twoich zaznaczeń: naprawianie, budowanie.",
        widelki: "Widełki: od 3 000 zł na start, typowo 5 000 zł, do 9 000 zł na szczycie.",
        finanse: "Ten zawód dochodzi do poziomu, który sobie założyłeś.",
      })),
    });
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(buf.length).toBeGreaterThan(20_000);
  }, 60_000);

  it("renderuje się, gdy nie ma jeszcze zawodów ani poziomu życia", async () => {
    const { zbudujPdfNowy } = await import("@/lib/raport/pdf");
    const buf = await zbudujPdfNowy({ ...PODSTAWA, poziom: null, koszty: [], zawody: [] });
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  }, 60_000);
});
