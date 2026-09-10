/**
 * Dostepnosc: program jest dla wszystkich, wiec kontrast i etykiety tekstowe
 * nie sa kwestia gustu.
 */

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { kontrast, PARY_KOLOROW } from "@/lib/ui/kontrast";
import { KOMUNIKATY_FLAG } from "@/lib/engine/komunikaty";

describe("kontrast", () => {
  it("każda para kolorów interfejsu spełnia 4,5:1", () => {
    for (const p of PARY_KOLOROW) {
      expect(kontrast(p.tekst, p.tlo), p.nazwa).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("kolory z arkusza stylów zgadzają się z tymi, które sprawdzamy", () => {
    const css = readFileSync("app/globals.css", "utf8");
    for (const kolor of ["#faf8f5", "#1c1917", "#57534e", "#6f675e", "#2f5d50", "#8a6a1f"]) {
      expect(css, kolor).toContain(kolor);
    }
  });
});

describe("kolor nigdy nie jest jedynym nośnikiem informacji", () => {
  it("każda flaga silnika ma treść tekstową, nie tylko kod", () => {
    for (const [flaga, tekst] of Object.entries(KOMUNIKATY_FLAG)) {
      expect(tekst.length, flaga).toBeGreaterThan(30);
    }
  });
});

describe("język raportu", () => {
  it("komunikaty flag nie zawierają słów zakazanych", () => {
    const zakazane = [
      "diagnoza",
      "wynik testu",
      "profil psychologiczny",
      "iloraz",
      "percentyl",
      "powołanie",
      "przeznaczenie",
    ];
    const caly = Object.values(KOMUNIKATY_FLAG).join(" ").toLowerCase();
    for (const slowo of zakazane) expect(caly, slowo).not.toContain(slowo);
  });

  it("żaden komunikat nie zamyka drogi", () => {
    const caly = Object.values(KOMUNIKATY_FLAG).join(" ").toLowerCase();
    expect(caly).not.toContain("nie nadajesz się");
    expect(caly).not.toContain("nic nie pasuje");
  });
});
