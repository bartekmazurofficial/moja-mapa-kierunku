/**
 * Jakość pozycji w zestawach A1 i A2.
 *
 * Zgłoszenie z przeglądu: „w zestawie jedna pozycja jest dobra, trzy słabe”.
 * Słaba znaczy: abstrakcyjna, urzędowa albo taka, której nie da się zobaczyć
 * oczami. Test nie oceni stylu, ale pilnuje tego, co da się sprawdzić:
 * czterech rzeczy, które w tej redakcji się zepsuły.
 */

import { describe, expect, it } from "vitest";
import { BLOKI_A1 } from "@/lib/content/a1";
import { BLOKI_A2 } from "@/lib/content/a2";

const POZYCJE = [
  ...BLOKI_A1.flatMap((b) => b.pozycje).map((p) => ({ id: p.id, tekst: p.tekst, modul: "A1" })),
  ...BLOKI_A2.flatMap((b) => b.pozycje).map((p) => ({ id: p.id, tekst: p.tekst, modul: "A2" })),
];

/**
 * Słowa, których nastolatek nie używa, a które wróciły przy poprzedniej redakcji.
 * „Przedsięwzięcie” wypadło z listy: redakcja treści używa go świadomie
 * w „Uruchomić własne przedsięwzięcie”, gdzie nic go nie zastąpi.
 */
const URZEDOWE = [
  "zjawisko",
  "podmiot",
  "realizować",
  "implementować",
  "optymalizować",
  "wdrożyć",
  "kompetencja",
  "aspekt",
  "kwestia",
  "dokonać",
  "celem ",
];

describe("pozycje zestawów", () => {
  it("żadna nie powtarza się w całym programie", () => {
    const teksty = POZYCJE.map((p) => p.tekst);
    const powtorki = teksty.filter((t, i) => teksty.indexOf(t) !== i);
    expect(powtorki, powtorki.join(" | ")).toEqual([]);
  });

  it("każda mieści się w kaflu: nie więcej niż 70 znaków", () => {
    // Dolnej granicy nie ma. Redakcja treści ustawiła limit na dziesięć słów
    // i krótkie pozycje („Zaplanować budżet") są w niej w porządku;
    // liczbę słów pilnuje tests/bank-pozycji.test.ts.
    for (const p of POZYCJE) {
      expect(p.tekst.length, `${p.modul} ${p.id}: ${p.tekst}`).toBeLessThanOrEqual(70);
    }
  });

  it("każda zaczyna się od czasownika w bezokoliczniku i nie kończy kropką", () => {
    for (const p of POZYCJE) {
      // Pozycja jest czynnością, nie opisem: bezokolicznik stoi na początku.
      // Dopuszczamy przeczenie („Nie okazać zniecierpliwienia”), więc szukamy
      // go w pierwszych dwóch słowach. Bezokolicznik kończy się na „ć”
      // albo, rzadziej, na „c” (biec, móc).
      const poczatek = p.tekst.split(/[\s,]+/).slice(0, 2);
      expect(poczatek.some((w) => /[ćc]$/.test(w)), `${p.id}: ${p.tekst}`).toBe(true);
      expect(p.tekst.endsWith("."), `${p.id}: ${p.tekst}`).toBe(false);
    }
  });

  it("żadna nie używa słów z urzędu", () => {
    const winne: string[] = [];
    for (const p of POZYCJE) {
      for (const slowo of URZEDOWE) {
        if (p.tekst.toLowerCase().includes(slowo)) winne.push(`${p.id}: ${p.tekst} (${slowo})`);
      }
    }
    expect(winne, winne.join("\n")).toEqual([]);
  });
});

describe("przechodzenie dalej", () => {
  it("żaden ekran nie przechodzi sam po odpowiedzi", async () => {
    const { CZESCI_MODULOW, KOLEJNOSC_MODULOW, zbudujCzesc } = await import("@/lib/moduly/ekrany");
    const { zbudujPlan } = await import("@/lib/moduly/plan");
    for (const m of KOLEJNOSC_MODULOW) {
      const plan = zbudujPlan(m);
      for (const c of CZESCI_MODULOW[m]) {
        for (const e of zbudujCzesc(m, c, plan, {}).ekrany) {
          expect(Object.keys(e), `${m}${c} ${e.klucz}`).not.toContain("autoDalej");
        }
      }
    }
  });
});
