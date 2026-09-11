/**
 * Logowanie prowadzącego: jedno konto, hasło ze zmiennej środowiskowej,
 * sesja w podpisanym ciasteczku. Bez tabeli użytkowników.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { ciasteczkoWazne, hasloPoprawne, zbudujCiasteczko } from "@/lib/prowadzacy/sesja";

beforeAll(() => {
  process.env.SESJA_SEKRET = "sekret-testowy-o-dlugosci-ponad-32-znakow";
  process.env.PROWADZACY_HASLO = "haslo-testowe";
});

describe("sesja prowadzącego", () => {
  it("przyjmuje poprawne hasło i odrzuca błędne", () => {
    expect(hasloPoprawne("haslo-testowe")).toBe(true);
    expect(hasloPoprawne("haslo-testow")).toBe(false);
    expect(hasloPoprawne("")).toBe(false);
  });

  it("świeże ciasteczko jest ważne", () => {
    expect(ciasteczkoWazne(zbudujCiasteczko().wartosc)).toBe(true);
  });

  it("ciasteczko po terminie nie jest ważne", () => {
    const dawno = Date.now() - 9 * 60 * 60 * 1000;
    expect(ciasteczkoWazne(zbudujCiasteczko(dawno).wartosc)).toBe(false);
  });

  it("nie da się przedłużyć ważności bez sekretu", () => {
    const { wartosc } = zbudujCiasteczko();
    const [, podpis] = wartosc.split(".");
    const przedluzone = `${Date.now() + 400 * 24 * 60 * 60 * 1000}.${podpis}`;
    expect(ciasteczkoWazne(przedluzone)).toBe(false);
  });

  it("śmieci i brak ciasteczka są odrzucane", () => {
    expect(ciasteczkoWazne(undefined)).toBe(false);
    expect(ciasteczkoWazne("")).toBe(false);
    expect(ciasteczkoWazne("abc")).toBe(false);
    expect(ciasteczkoWazne("999999999999.deadbeef")).toBe(false);
  });

  it("krótki sekret to błąd konfiguracji, nie cicha akceptacja", () => {
    const poprzedni = process.env.SESJA_SEKRET;
    process.env.SESJA_SEKRET = "za-krotki";
    expect(() => zbudujCiasteczko()).toThrow(/SESJA_SEKRET/);
    process.env.SESJA_SEKRET = poprzedni;
  });
});
