/**
 * Cztery ścieżki przez moduł A0.
 *
 * Test pilnuje rzeczy, która była w kodzie błędem, a nie brakiem ulepszenia:
 * pytania o przedmioty szkolne nie miały żadnego warunku, więc
 * dwudziestoczterolatek po studiach dostawał listę z wychowaniem fizycznym
 * i pytanie „z czym radzisz sobie w szkole najlepiej". Odpowiedź była
 * bezużyteczna, a samo pytanie mówiło mu przy pierwszym module, że ten
 * program jest nie dla niego.
 */

import { describe, expect, it } from "vitest";
import { PYTANIA_A0 } from "@/lib/content/a0";
import { zakonczenieWedlugEtapu, korektaMiekkaA0 } from "@/lib/engine/layer0-start";
import type { PunktStartu } from "@/lib/engine/typy";
import type { Zawod } from "@/lib/domain/typy";

const ETAPY_SZKOLNE = ["podstawowka", "liceum_1_2", "liceum_maturalna", "branzowa"];
const ETAPY_POZASZKOLNE = [
  "po_maturze",
  "studiuje",
  "po_studiach",
  "pracuje_zmiana",
  "nie_uczy_nie_pracuje",
];

/** Pytania widoczne na danym etapie, czyli dokładnie to, co zobaczy uczestnik. */
function widoczne(etap: string): string[] {
  return PYTANIA_A0.filter((p) => !p.tylkoEtapy || p.tylkoEtapy.includes(etap)).map((p) => p.id);
}

const PUSTY: PunktStartu = {
  etap: "pracuje_zmiana",
  rozszerzenia: [],
  przedmiotyMocne: [],
  przedmiotyTrudne: [],
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

describe("A0: pytania szkolne tylko dla uczniów", () => {
  it("etapy szkolne dostają przedmioty mocne, trudne i matematykę", () => {
    for (const etap of ETAPY_SZKOLNE) {
      const w = widoczne(etap);
      expect(w, etap).toContain("przedmioty_mocne");
      expect(w, etap).toContain("przedmioty_trudne");
      expect(w, etap).toContain("matematyka");
    }
  });

  it("etapy pozaszkolne nie dostają ani jednego pytania o szkołę", () => {
    for (const etap of ETAPY_POZASZKOLNE) {
      const w = widoczne(etap);
      expect(w, etap).not.toContain("przedmioty_mocne");
      expect(w, etap).not.toContain("przedmioty_trudne");
      expect(w, etap).not.toContain("matematyka");
      expect(w, etap).not.toContain("rozszerzenia");
    }
  });
});

describe("A0: cztery ścieżki", () => {
  it("ścieżka 1 planuje rozszerzenia, ścieżka 2 już je ma", () => {
    expect(widoczne("liceum_1_2")).toContain("rozszerzenia");
    expect(widoczne("liceum_1_2")).not.toContain("rozszerzenia_mam");
    expect(widoczne("liceum_maturalna")).toContain("rozszerzenia_mam");
    expect(widoczne("liceum_maturalna")).not.toContain("rozszerzenia");
  });

  it("tylko klasa maturalna dostaje pytanie o planowaną maturę rozszerzoną", () => {
    expect(widoczne("liceum_maturalna")).toContain("matura_plan");
    for (const etap of ["podstawowka", "liceum_1_2", "branzowa", "po_maturze", "po_studiach"]) {
      expect(widoczne(etap), etap).not.toContain("matura_plan");
    }
  });

  it("ścieżka 3 pyta o zdaną maturę i o kierunek, ścieżka 4 nie", () => {
    for (const etap of ["po_maturze", "studiuje"]) {
      const w = widoczne(etap);
      expect(w, etap).toContain("matura_zdana");
      expect(w, etap).toContain("kierunek");
      expect(w, etap).toContain("kierunek_ocena");
      expect(w, etap).not.toContain("powod_zmiany");
    }
  });

  it("ścieżka 4 pyta o wykształcenie, pracę, powód zmiany i blokadę", () => {
    for (const etap of ["po_studiach", "pracuje_zmiana", "nie_uczy_nie_pracuje"]) {
      const w = widoczne(etap);
      expect(w, etap).toContain("wyksztalcenie");
      expect(w, etap).toContain("branza");
      expect(w, etap).toContain("staz_pracy");
      expect(w, etap).toContain("powod_zmiany");
      expect(w, etap).toContain("blokada");
      expect(w, etap).not.toContain("matura_zdana");
      expect(w, etap).not.toContain("kierunek_ocena");
    }
  });

  it("każdy etap widzi pięć bloków uniwersalnych", () => {
    const UNIWERSALNE = ["etap", "doswiadczenie", "miejsce", "mobilnosc", "dojazd", "zasoby", "ograniczenia"];
    for (const etap of [...ETAPY_SZKOLNE, ...ETAPY_POZASZKOLNE]) {
      const w = widoczne(etap);
      for (const id of UNIWERSALNE) expect(w, `${etap}/${id}`).toContain(id);
    }
  });

  it("żadna ścieżka nie przekracza czternastu pytań", () => {
    for (const etap of [...ETAPY_SZKOLNE, ...ETAPY_POZASZKOLNE]) {
      expect(widoczne(etap).length, etap).toBeLessThanOrEqual(14);
    }
  });
});

describe("A0: powód zmiany steruje treścią, nie doborem zawodów", () => {
  it("dopisuje zdanie do zakończenia", () => {
    const z = zakonczenieWedlugEtapu({ ...PUSTY, powodZmiany: ["wypalenie"] });
    expect(z?.zPowodu).toHaveLength(1);
    expect(z?.zPowodu[0]).toContain("obciążenia psychicznego");
  });

  it("przy pięciu powodach pokazuje najwyżej dwa", () => {
    const z = zakonczenieWedlugEtapu({
      ...PUSTY,
      powodZmiany: ["wypalenie", "zdrowie", "zarobki", "na_swoim", "zawsze_co_innego"],
    });
    expect(z?.zPowodu).toHaveLength(2);
  });

  it("ścieżki szkolne nie dostają żadnego dopisku", () => {
    const z = zakonczenieWedlugEtapu({ ...PUSTY, etap: "liceum_1_2" });
    expect(z?.zPowodu).toEqual([]);
  });

  it("blokada zmienia pierwszy krok, a nie zawody", () => {
    const bez = zakonczenieWedlugEtapu(PUSTY);
    const z = zakonczenieWedlugEtapu({ ...PUSTY, blokada: ["koszt"] });
    expect(z?.pierwszyKrok).not.toEqual(bez?.pierwszyKrok);
    expect(z?.pierwszyKrok).toContain("koszcie wejścia");
  });
});

describe("A0: staż zawodowy wzmacnia mocniej niż hobby, ale tylko w górę", () => {
  const zawod = { dosw: ["praca_stala"], obszar: 13 } as unknown as Zawod;

  it("powyżej trzech lat daje dwadzieścia procent zamiast dziesięciu", () => {
    const krotki = korektaMiekkaA0(zawod, {
      ...PUSTY,
      doswiadczenie: ["praca_stala"],
      stazPracy: "do_roku",
    });
    const dlugi = korektaMiekkaA0(zawod, {
      ...PUSTY,
      doswiadczenie: ["praca_stala"],
      stazPracy: "powyzej_trzech",
    });
    expect(krotki.mnoznik).toBeCloseTo(1.1, 5);
    expect(dlugi.mnoznik).toBeCloseTo(1.2, 5);
  });

  it("brak stażu niczego nie odejmuje", () => {
    const bez = korektaMiekkaA0(zawod, { ...PUSTY, doswiadczenie: [], stazPracy: "nie_pracowalem" });
    expect(bez.mnoznik).toBe(1);
  });
});
