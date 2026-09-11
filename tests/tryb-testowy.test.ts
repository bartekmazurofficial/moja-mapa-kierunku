/**
 * Tryb testowy. Lista uczestników na ekranie wejścia istnieje wyłącznie po to,
 * żeby dało się klikać po aplikacji bez kodu — i nie wolno jej włączyć tam,
 * gdzie są prawdziwi uczestnicy.
 */

import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { trybTestowy } from "@/lib/tryb";

const poprzedni = process.env.TRYB_TESTOWY;
afterEach(() => {
  if (poprzedni === undefined) delete process.env.TRYB_TESTOWY;
  else process.env.TRYB_TESTOWY = poprzedni;
});

describe("tryb testowy", () => {
  it("jest wyłączony, dopóki nie ustawi się go jawnie", () => {
    delete process.env.TRYB_TESTOWY;
    expect(trybTestowy()).toBe(false);
    for (const wartosc of ["", "0", "true", "tak", "TAK"]) {
      process.env.TRYB_TESTOWY = wartosc;
      expect(trybTestowy(), wartosc).toBe(false);
    }
  });

  it("włącza się tylko dokładną jedynką", () => {
    process.env.TRYB_TESTOWY = "1";
    expect(trybTestowy()).toBe(true);
  });

  it("komponent listy sam sprawdza tryb, nie ufa miejscu użycia", () => {
    const zrodlo = readFileSync("components/ListaTestowa.tsx", "utf8");
    expect(zrodlo).toContain("if (!trybTestowy()) return null;");
  });

  it("w przykładowym .env przełącznik jest zakomentowany", () => {
    const przyklad = readFileSync(".env.example", "utf8");
    expect(przyklad).toContain("# TRYB_TESTOWY=1");
    expect(przyklad).not.toMatch(/^TRYB_TESTOWY=1$/m);
  });
});
