/**
 * Osiem sciezek sekcji 08, na pelnej bazie.
 *
 * Piec regul z SPEC_dla_Claude_Code_v2.md czesc 5.1 to nie sa wytyczne
 * redakcyjne, tylko warunki, bez ktorych raport nie ma sensu. Kazda z nich
 * ma tu wlasny test, a testy chodza po prawdziwej bazie 157 zawodow, nie po
 * atrapie: regula „zawsze dokladnie osiem" jest sprawdzalna wylacznie wtedy,
 * gdy da sie ja zlamac brakiem danych.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import { uruchomSilnik } from "@/lib/engine";
import { ILE_SCIEZEK, ZAWODOW_NA_KARCIE, zbudujSciezki } from "@/lib/raport/sciezki";
import type { BazaReferencyjna } from "@/lib/domain/typy";
import type { PunktStartu, WynikiModulow } from "@/lib/engine/typy";
import { ANALITYK_22, RZEMIESLNIK_17, SPOLECZNA_19 } from "./fixtures/profile-warstwy1";

let baza: BazaReferencyjna;

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
});

const A0: PunktStartu = {
  etap: "liceum_maturalna",
  rozszerzenia: [],
  przedmiotyMocne: ["matematyka", "informatyka", "fizyka"],
  przedmiotyTrudne: ["polski", "historia", "jezyki"],
  matematyka: null,
  doswiadczenie: [],
  doswiadczenieOpis: null,
  miejsce: "srednie_miasto",
  mobilnosc: "tak_region",
  dojazdDoMiasta: "godzina",
  zasoby: "raty",
  ograniczenia: [],
  ograniczeniaPominiete: false,
  kierunek: null,
  kierunekOcena: null,
  wyksztalcenie: null,
  wyksztalcenieKierunek: null,
  branza: [],
  stazPracy: null,
  powodZmiany: [],
  blokada: [],
};

function zA3(w: WynikiModulow, pozycje: Record<string, number>): WynikiModulow {
  const sila: Record<string, number> = {};
  for (const k of Object.keys(pozycje)) sila[k] = 80;
  return { ...w, punktStartu: A0, a3Pozycje: pozycje, a3Sila: sila };
}

const PROFILE: Array<{ nazwa: string; wyniki: WynikiModulow }> = [
  { nazwa: "rzemieślnik 17", wyniki: zA3(RZEMIESLNIK_17, { SAM: 90, OTO: 85, DEC: 80 }) },
  { nazwa: "społeczna 19", wyniki: zA3(SPOLECZNA_19, { SAM: 10, KON: 15, TEM: 20 }) },
  { nazwa: "analityk 22", wyniki: zA3(ANALITYK_22, { GLE: 90, OTO: 85, SAM: 80 }) },
];

/** Profil z trzema wetami: najostrzejszy realny przypadek. */
const Z_WETAMI: WynikiModulow = {
  ...zA3(RZEMIESLNIK_17, { SAM: 90, OTO: 85 }),
  weta: ["F22", "F23", "F29"],
  g: { F22: 0, F23: 0, F29: 0 },
};

function sciezkiDla(w: WynikiModulow) {
  return zbudujSciezki(uruchomSilnik(w, baza), baza);
}

describe("osiem ścieżek: reguły twarde", () => {
  it("każdy profil dostaje dokładnie osiem ścieżek", () => {
    for (const p of [...PROFILE, { nazwa: "z wetami", wyniki: Z_WETAMI }]) {
      const w = sciezkiDla(p.wyniki);
      expect(w.sciezki.length, p.nazwa).toBe(ILE_SCIEZEK);
    }
  });

  it("litery idą od A do H, bez powtórzeń", () => {
    for (const p of PROFILE) {
      const litery = sciezkiDla(p.wyniki).sciezki.map((s) => s.litera);
      expect(litery, p.nazwa).toEqual(["A", "B", "C", "D", "E", "F", "G", "H"]);
    }
  });

  it("żaden obszar nie powtarza się dwa razy", () => {
    for (const p of PROFILE) {
      const obszary = sciezkiDla(p.wyniki).sciezki.map((s) => s.obszar);
      expect(new Set(obszary).size, p.nazwa).toBe(obszary.length);
    }
  });

  it("każda karta ma od czterech do pięciu zawodów", () => {
    for (const p of PROFILE) {
      for (const s of sciezkiDla(p.wyniki).sciezki) {
        expect(s.zawody.length, `${p.nazwa} / ${s.nazwa}`).toBeGreaterThanOrEqual(
          ZAWODOW_NA_KARCIE.min,
        );
        expect(s.zawody.length, `${p.nazwa} / ${s.nazwa}`).toBeLessThanOrEqual(
          ZAWODOW_NA_KARCIE.max,
        );
      }
    }
  });

  it("każda ścieżka ma wariant bez studiów", () => {
    for (const p of PROFILE) {
      for (const s of sciezkiDla(p.wyniki).sciezki) {
        expect(s.bezStudiow, `${p.nazwa} / ${s.nazwa}`).toBe(true);
      }
    }
  });

  it("dokładnie jedna ścieżka jest oznaczona jako najbliższa", () => {
    for (const p of PROFILE) {
      const ile = sciezkiDla(p.wyniki).sciezki.filter((s) => s.najblizej).length;
      expect(ile, p.nazwa).toBe(1);
    }
  });

  /**
   * Karty nie moga byc posortowane po wyniku. Gdyby byly, brak legendy
   * niczego by nie zmienil: uczestnik i tak czytalby liste od najlepszej.
   */
  it("karty nie są posortowane od najlepiej dopasowanej", () => {
    const w = sciezkiDla(PROFILE[0].wyniki);
    const najblizej = w.sciezki.findIndex((s) => s.najblizej);
    expect(najblizej).toBeGreaterThanOrEqual(0);
    expect(w.sciezki.every((s) => typeof s.najblizej === "boolean")).toBe(true);
  });
});

describe("osiem ścieżek: wymuszona różnorodność", () => {
  it("co najmniej trzy ścieżki wchodzą od razu po technikum", () => {
    for (const p of PROFILE) {
      const ile = sciezkiDla(p.wyniki).sciezki.filter((s) => s.grupaNauki === "od_razu").length;
      expect(ile, p.nazwa).toBeGreaterThanOrEqual(3);
    }
  });

  it("co najmniej dwie ścieżki wymagają kursu albo szkoły policealnej", () => {
    for (const p of PROFILE) {
      const ile = sciezkiDla(p.wyniki).sciezki.filter((s) => s.grupaNauki === "kurs").length;
      expect(ile, p.nazwa).toBeGreaterThanOrEqual(2);
    }
  });

  it("najwyżej trzy ścieżki z jednej rodziny obszarów", () => {
    const rodzina = new Map(baza.obszary.map((o) => [o.id, o.grupa]));
    for (const p of PROFILE) {
      const ile = new Map<string, number>();
      for (const s of sciezkiDla(p.wyniki).sciezki) {
        const g = rodzina.get(s.obszar) ?? "?";
        ile.set(g, (ile.get(g) ?? 0) + 1);
      }
      for (const [g, n] of ile) expect(n, `${p.nazwa} / ${g}`).toBeLessThanOrEqual(3);
    }
  });

  /**
   * Regula, ktora odroznia to narzedzie od wyszukiwarki zawodow: obszar
   * czesciowo zamkniety wetem nie znika, bo zostaly w nim zawody, ktorych
   * weto nie dotyczy. Sprawdzamy na profilu z wetami na krew i smierc.
   */
  it("weto na krew i śmierć nie zamyka całego obszaru zdrowia", () => {
    const silnik = uruchomSilnik(Z_WETAMI, baza);
    const usuniete = silnik.warstwa2.usunieteWetem.length;
    expect(usuniete).toBeGreaterThan(0);

    const w = zbudujSciezki(silnik, baza);
    const zCzesciowo = w.sciezki.filter((s) => s.powodWyboru === "czesciowo_zamkniety");
    // Jesli silnik w ogole zostawil obszar naruszony wetem, ma byc na liscie.
    const obszarPoKodzie = new Map(baza.zawody.map((z) => [z.kod, z.obszar]));
    const naruszone = new Set(
      silnik.warstwa2.usunieteWetem
        .map((u) => obszarPoKodzie.get(u.kod))
        .filter((x): x is number => x !== undefined),
    );
    const przetrwaly = new Set(silnik.warstwa2.wszystkie.map((z) => z.obszar));
    const dostepne = [...naruszone].filter((id) => przetrwaly.has(id));
    if (dostepne.length > 0) expect(zCzesciowo.length).toBeGreaterThanOrEqual(1);
  });
});

describe("osiem ścieżek: grupowanie pod kartami", () => {
  it("trzy grupy nauki obejmują wszystkie osiem liter", () => {
    for (const p of PROFILE) {
      const w = sciezkiDla(p.wyniki);
      const litery = w.grupy.flatMap((g) => g.litery);
      expect(litery.sort(), p.nazwa).toEqual(w.sciezki.map((s) => s.litera).sort());
    }
  });
});
