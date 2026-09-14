/**
 * Trzy usterki parserów karty zawodu, które widać było na ekranie.
 *
 * Wszystkie trzy dawały treść zgodną z danymi, ale rozłożoną nie tam, gdzie
 * trzeba, więc żaden istniejący test ich nie łapał: karta się renderowała,
 * tylko wyglądała na zepsutą.
 */

import { describe, expect, it } from "vitest";
import { ulozKarte, czytajDroge, czytajPunkty, czytajTabeleDwukolumnowa } from "@/lib/karty/uklad";

describe("droga dojścia: czas etapu, nie ogon zdania", () => {
  it("czas po przecinku wchodzi do czasu, reszta zostaje etapem", () => {
    const c = czytajDroge("Recepcja albo rola administracyjna, 2 do 3 lata · office manager w mniejszej firmie");
    expect(c?.kroki[0]).toEqual({ etap: "Recepcja albo rola administracyjna", czas: "2 do 3 lata" });
    expect(c?.kroki[1]).toEqual({ etap: "office manager w mniejszej firmie" });
  });

  it("przecinek w środku etapu nie robi z połowy zdania czasu", () => {
    // Wzorzec łapał wszystko po OSTATNIM przecinku i z tego etapu robił czas
    // „kadr albo zakupów po 5 do 8 latach".
    const c = czytajDroge(
      "Recepcja, 2 do 3 lata · przejście do zarządzania operacyjnego, kadr albo zakupów po 5 do 8 latach.",
    );
    expect(c?.kroki[1].etap).toBe("przejście do zarządzania operacyjnego, kadr albo zakupów");
    expect(c?.kroki[1].czas).toBe("po 5 do 8 latach");
  });

  it("etap bez czasu zostaje bez czasu", () => {
    const c = czytajDroge("Nauka podstaw · Projekty własne · Pierwsza praca");
    expect(c?.kroki.every((k) => k.czas === undefined)).toBe(true);
  });
});

describe("punkty: etykieta wycięta ze zdania nie zostawia interpunkcji", () => {
  it("przecinek po pogrubieniu nie zaczyna opisu", () => {
    const c = czytajPunkty(
      "**Systemy zgłoszeń wewnętrznych**, przez które pracownicy zgłaszają potrzeby.\n\n**Excel** do budżetów.",
    );
    expect(c?.punkty[0].etykieta).toBe("Systemy zgłoszeń wewnętrznych");
    expect(c?.punkty[0].opis).toBe("przez które pracownicy zgłaszają potrzeby.");
  });

  it("dwukropek też nie zostaje", () => {
    const c = czytajPunkty("**Portale urzędowe**: e-Deklaracje i PUE.\n\n**Terminal** do poleceń.");
    expect(c?.punkty[0].opis).toBe("e-Deklaracje i PUE.");
  });
});

describe("profil zapisany prozą czyta się tak samo jak tabela", () => {
  const PROZA =
    "A1 wysoko: planowanie, porządkowanie · A2 rdzeń: organizowanie, uprzejmość pod presją · " +
    "A4 nie zaspokaja: mistrzostwo, uznanie · M1: osiadłość, duża organizacja";

  it("każdy kod modułu zaczyna nowy wiersz", () => {
    const c = czytajTabeleDwukolumnowa(PROZA);
    expect(c?.wiersze.map((w) => w.etykieta)).toEqual([
      "A1 wysoko",
      "A2 rdzeń",
      "A4 nie zaspokaja",
      "M1",
    ]);
    expect(c?.wiersze[0].wartosc).toBe("planowanie, porządkowanie");
  });

  it("fragment bez kodu modułu dokleja się do poprzedniego wiersza", () => {
    const c = czytajTabeleDwukolumnowa(
      "A1 wysoko: planowanie · porządkowanie · A3: cisza i porządek · M1: osiadłość",
    );
    expect(c?.wiersze).toHaveLength(3);
    expect(c?.wiersze[0].wartosc).toBe("planowanie · porządkowanie");
  });

  it("sekcja, która nie jest profilem, nie zamienia się w tabelę", () => {
    expect(czytajTabeleDwukolumnowa("Zwykła proza bez kodów modułów. Drugie zdanie.")).toBeNull();
  });
});

describe("cała karta po poprawkach", () => {
  it("profil prozą trafia do slotu profil jako tabela", () => {
    const bloki = ulozKarte([
      {
        tytul: "Profil",
        klucz: null,
        tresc: "A1 wysoko: planowanie · A2 rdzeń: organizowanie · A3: elastyczność · M1: osiadłość",
      },
    ]);
    expect(bloki[0].slot).toBe("profil");
    expect(bloki[0].rodzaj).toBe("tabela");
  });
});
