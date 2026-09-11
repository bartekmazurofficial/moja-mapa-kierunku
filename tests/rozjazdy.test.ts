/**
 * Pięć typów rozjazdu z rozdziału 2 sesja_indywidualna_i_panel.md.
 * Każdy typ sprawdzany na profilu kontrolnym, nie na atrapie wyniku silnika.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import { uruchomSilnik } from "@/lib/engine";
import { ustawTekstyFiltrow } from "@/lib/engine/layer1-areas";
import { FILTRY_A5 } from "@/lib/domain/slowniki";
import { policzRozjazdy, type TypRozjazdu } from "@/lib/panel/rozjazdy";
import { RZEMIESLNIK_17, SPOLECZNA_19 } from "./fixtures/profile-warstwy1";
import type { BazaReferencyjna } from "@/lib/domain/typy";
import type { PunktStartu, WynikiModulow } from "@/lib/engine/typy";

let baza: BazaReferencyjna;

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
  ustawTekstyFiltrow(FILTRY_A5);
});

function rozjazdy(moduly: WynikiModulow, oceny: Record<string, string> = {}) {
  const silnik = uruchomSilnik(moduly, baza);
  return { silnik, lista: policzRozjazdy({ silnik, moduly, baza, oceny }) };
}

function typy(lista: Array<{ typ: TypRozjazdu }>): TypRozjazdu[] {
  return [...new Set(lista.map((r) => r.typ))];
}

describe("rozjazdy", () => {
  it("odrzucony faworyt: zawód z górnych pasm oznaczony jako nie dla mnie", () => {
    const { silnik } = rozjazdy(RZEMIESLNIK_17);
    const mocny = silnik.warstwa2.pozycje
      .flatMap((p) => p.zawody)
      .find((z) => z.pasmo === "bardzo_mocne" || z.pasmo === "mocne");
    expect(mocny).toBeDefined();

    const { lista } = rozjazdy(RZEMIESLNIK_17, { [mocny!.kod]: "nie_dla_mnie" });
    const trafienie = lista.find((r) => r.typ === "odrzucony_faworyt");
    expect(trafienie?.tytul).toBe(mocny!.nazwa);
    expect(trafienie?.pytanie).toBe("Co konkretnie Cię tu odrzuca?");
  });

  it("ten sam zawód oznaczony jako interesuje nie jest rozjazdem", () => {
    const { silnik } = rozjazdy(RZEMIESLNIK_17);
    const mocny = silnik.warstwa2.pozycje
      .flatMap((p) => p.zawody)
      .find((z) => z.pasmo === "bardzo_mocne" || z.pasmo === "mocne")!;
    const { lista } = rozjazdy(RZEMIESLNIK_17, { [mocny.kod]: "interesuje" });
    expect(typy(lista)).not.toContain("odrzucony_faworyt");
    expect(typy(lista)).not.toContain("wybrany_outsider");
  });

  it("wybrany outsider: zawód dosypany gwarancją oznaczony jako interesuje", () => {
    const { silnik } = rozjazdy(RZEMIESLNIK_17);
    const slaby = silnik.warstwa2.pozycje
      .flatMap((p) => p.zawody)
      .find((z) => z.zGwarancji !== null || z.pasmo === "warte_rozwazenia");
    expect(slaby, "profil kontrolny musi mieć zawód z najsłabszego pasma").toBeDefined();

    const { lista } = rozjazdy(RZEMIESLNIK_17, { [slaby!.kod]: "interesuje" });
    const trafienie = lista.find((r) => r.typ === "wybrany_outsider");
    expect(trafienie?.tytul).toBe(slaby!.nazwa);
  });

  it("sprzeczność A1 z A5: weto na warunku nieuchronnym w silnie ciągnącym obszarze", () => {
    // F18 jest wymagany przez rzemiosło z wagą 0,85, a rzemiosło jest u tego
    // profilu obszarem numer jeden. Weto usuwa obszar, do którego ciągnie.
    const zWetem: WynikiModulow = { ...RZEMIESLNIK_17, weta: [...RZEMIESLNIK_17.weta, "F18"] };
    const { lista } = rozjazdy(zWetem);
    const trafienie = lista.find((r) => r.typ === "sprzecznosc_a1_a5");
    expect(trafienie?.tytul).toBe("Rzemiosło i usługi techniczne");
    expect(trafienie?.pytanie).toContain("Które z tych dwóch jest twardsze?");
  });

  it("weto na obszarze, do którego nie ciągnie, nie jest sprzecznością", () => {
    // F24 jest wymagany przez opiekę, która u tego profilu jest daleko w tyle.
    const zWetem: WynikiModulow = { ...RZEMIESLNIK_17, weta: [...RZEMIESLNIK_17.weta, "F24"] };
    const { lista } = rozjazdy(zWetem);
    const opieka = lista.find((r) => r.typ === "sprzecznosc_a1_a5" && r.tytul.startsWith("Opieka"));
    expect(opieka).toBeUndefined();
  });

  it("bariera kosztowa tylko wtedy, gdy A0 mówi o braku środków", () => {
    const zZasobami = (zasoby: PunktStartu["zasoby"]): WynikiModulow => ({
      ...RZEMIESLNIK_17,
      punktStartu: {
        etap: "liceum_maturalna",
        rozszerzenia: [],
        przedmiotyMocne: ["warsztat", "matematyka", "wf"],
        przedmiotyTrudne: ["polski", "historia", "biologia"],
        matematyka: "radze_sobie",
        doswiadczenie: [],
        doswiadczenieOpis: null,
        miejsce: "male_miasto",
        mobilnosc: "tak_region",
        dojazdDoMiasta: "godzina",
        zasoby,
        ograniczenia: [],
        ograniczeniaPominiete: false,
      },
    });

    expect(typy(rozjazdy(zZasobami("realne")).lista)).not.toContain("bariera_kosztowa");

    const trafienie = rozjazdy(zZasobami("nierealne")).lista.find(
      (r) => r.typ === "bariera_kosztowa",
    );
    expect(trafienie, "brak środków plus zawód kosztowny na drodze A").toBeDefined();
    expect(trafienie!.obserwacja).toContain("nierealne");
  });

  it("sprzeczność z wizją: droga A wygrywa mimo wizji ciągnącej w drugą stronę", () => {
    // Rzemiosło oczekuje INW=A (szybko zarabiać), ORG=B (mały zespół),
    // MIE=A (stacjonarnie). Odwracamy całą trójkę: obszar nadal wygrywa
    // ciągnieniem, ale mnożnik zgodności spada poniżej jedności.
    const przeciwWizji: WynikiModulow = {
      ...RZEMIESLNIK_17,
      shape: { ...RZEMIESLNIK_17.shape, INW: 0, ORG: 100, MIE: 0 },
    };
    const { silnik, lista } = rozjazdy(przeciwWizji);
    expect(silnik.warstwa1.drogi[0]?.nazwaObszaru).toBe("Rzemiosło i usługi techniczne");
    const trafienie = lista.find((r) => r.typ === "sprzecznosc_z_wizja");
    expect(trafienie, "mnożnik poniżej jedności musi dać rozjazd").toBeDefined();
    expect(trafienie!.pytanie).toContain("Co wybierasz?");
  });

  it("zgodna wizja nie produkuje rozjazdu z wizją", () => {
    expect(typy(rozjazdy(RZEMIESLNIK_17).lista)).not.toContain("sprzecznosc_z_wizja");
  });

  it("każdy rozjazd ma pytanie do zadania", () => {
    const { silnik } = rozjazdy(SPOLECZNA_19);
    const oceny: Record<string, string> = {};
    for (const z of silnik.warstwa2.pozycje.flatMap((p) => p.zawody)) {
      oceny[z.kod] = z.pasmo === "warte_rozwazenia" ? "interesuje" : "nie_dla_mnie";
    }
    const { lista } = rozjazdy(SPOLECZNA_19, oceny);
    expect(lista.length).toBeGreaterThan(0);
    for (const r of lista) {
      expect(r.pytanie.length, r.typ).toBeGreaterThan(10);
      expect(r.obserwacja.length, r.typ).toBeGreaterThan(10);
    }
  });
});
