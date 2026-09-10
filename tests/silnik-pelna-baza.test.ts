/**
 * Silnik w calosci, na pelnej bazie 157 zawodow, 75 kierunkow i 26 klastrow.
 * Testy T7-T10 i T16 z warstwa2_zawody.md, K1-K8 z warstwa3_kierunki.md,
 * A0-1 do A0-7 z A0_punkt_startu.md.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import { uruchomSilnik } from "@/lib/engine";
import { profilKartowy } from "@/lib/engine/profil";
import { KIERUNEK_TO_NIE_ZAWOD } from "@/lib/engine/layer3-fields";
import { sekcjaPunktStartu, zakonczenieWedlugEtapu } from "@/lib/engine/layer0-start";
import { PROGI_PROFILU } from "@/lib/engine/config";
import type { BazaReferencyjna } from "@/lib/domain/typy";
import type { EtapEdukacji, PunktStartu, WynikiModulow } from "@/lib/engine/typy";
import { ANALITYK_22, PROFILE_WARSTWY1, RZEMIESLNIK_17, SPOLECZNA_19 } from "./fixtures/profile-warstwy1";

let baza: BazaReferencyjna;

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
});

const A0_BAZOWY: PunktStartu = {
  etap: "liceum_maturalna",
  rozszerzenia: [],
  przedmiotyMocne: ["matematyka", "informatyka", "fizyka"],
  przedmiotyTrudne: ["polski", "historia", "jezyki"],
  matematyka: "dobrze",
  doswiadczenie: [],
  doswiadczenieOpis: null,
  miejsce: "srednie_miasto",
  mobilnosc: "tak_region",
  dojazdDoMiasta: "godzina",
  zasoby: "raty",
  ograniczenia: [],
  ograniczeniaPominiete: false,
};

/** Dokladamy dane A3, ktorych profile z silnik.py nie zawieraly. */
function zA3(w: WynikiModulow, pozycje: Record<string, number>): WynikiModulow {
  const sila: Record<string, number> = {};
  for (const k of Object.keys(pozycje)) sila[k] = 80;
  return { ...w, a3Pozycje: pozycje, a3Sila: sila };
}

const RZEMIESLNIK = zA3(RZEMIESLNIK_17, { SAM: 90, OTO: 85, DEC: 80 });
const SPOLECZNA = zA3(SPOLECZNA_19, { SAM: 10, KON: 15, TEM: 20 });
const ANALITYK = zA3(ANALITYK_22, { GLE: 90, OTO: 85, SAM: 80 });

function silnik(w: WynikiModulow) {
  return uruchomSilnik(w, baza);
}

describe("wyprowadzanie profilu z wyników modułów", () => {
  it("zbiór A1 ma od 3 do 6 elementów przy każdym profilu kontrolnym", () => {
    for (const [nazwa, w] of Object.entries(PROFILE_WARSTWY1)) {
      const p = profilKartowy(w);
      expect(p.a1.size, nazwa).toBeGreaterThanOrEqual(3);
      expect(p.a1.size, nazwa).toBeLessThanOrEqual(PROGI_PROFILU.A1_MAKS);
    }
  });

  it("zbiór A2 nie przekracza limitu górnego", () => {
    for (const [nazwa, w] of Object.entries(PROFILE_WARSTWY1)) {
      const p = profilKartowy(w);
      expect(p.a2.size, nazwa).toBeLessThanOrEqual(PROGI_PROFILU.A2_MAKS + 1);
      expect(p.a2.size, nazwa).toBeGreaterThan(0);
    }
  });

  it("weta i odrzucenia są rozłączne", () => {
    const p = profilKartowy(RZEMIESLNIK);
    for (const kod of p.a5Weta) expect(p.a5Odrzucone.has(kod)).toBe(false);
  });
});

describe("silnik na pełnej bazie", () => {
  it("rzemieślnik dostaje czołówkę rzemieślniczą", () => {
    const r = silnik(RZEMIESLNIK);
    const czolowka = r.warstwa2.pozycje.slice(0, 5).map((p) => p.nazwa.toLowerCase());
    expect(czolowka.join(" ")).toMatch(/elektryk|hydraulik|mechanik|spawacz|stolarz|serwis/);
  });

  it("odmowa studiów obniża zawody studyjne, ale ich nie usuwa; weto usuwa", () => {
    // Profil kontrolny warstwy pierwszej ma NIE na studia, ale weta na
    // wystapieniach. To jest wlasnie roznica miedzy "wolalbym nie"
    // a "nie ma mowy" i system musi ja utrzymac.
    const bezWeta = silnik(RZEMIESLNIK);
    expect(bezWeta.warstwa2.wszystkie.filter((z) => z.studia === "tak").length).toBeGreaterThan(0);

    const zWetem = silnik({ ...RZEMIESLNIK, weta: ["F02"] });
    expect(zWetem.warstwa2.wszystkie.filter((z) => z.studia === "tak")).toHaveLength(0);
    expect(zWetem.warstwa2.usunieteWetem.length).toBeGreaterThan(20);
  });

  it("społeczna nie dostaje pielęgniarki ani ratownika: weto na widok krwi", () => {
    const r = silnik(SPOLECZNA);
    const kody = r.warstwa2.wszystkie.map((z) => z.kod);
    expect(kody).not.toContain("pielegniarka");
    expect(kody).not.toContain("ratownik_med");
    // Zawod z zawetowanego obszaru tez musi trafic na liste prowadzacego,
    // inaczej znika po cichu i nie da sie o nim porozmawiac na sesji.
    expect(r.warstwa2.usunieteWetem.map((u) => u.kod)).toContain("pielegniarka");
    expect(r.warstwa2.usunieteWetem.map((u) => u.kod)).toContain("ratownik_med");
  });

  it("analityk dostaje czołówkę technologiczno-analityczną", () => {
    const r = silnik(ANALITYK);
    const czolowka = r.warstwa2.pozycje.slice(0, 5).flatMap((p) => p.zawody.map((z) => z.kod));
    expect(czolowka.join(" ")).toMatch(/programista|analityk_danych|data_scientist|spec_bi|inzynier_danych/);
  });

  it("klastry składają się w jedną pozycję z pytaniem rozstrzygającym", () => {
    const r = silnik(ANALITYK);
    const klastry = r.warstwa2.pozycje.filter((p) => p.typ === "klaster");
    expect(klastry.length).toBeGreaterThan(0);
    for (const k of klastry) {
      expect(k.zawody.length).toBeGreaterThanOrEqual(2);
      expect(k.pytanieRozstrzygajace?.length ?? 0).toBeGreaterThan(10);
      expect(k.wynik).toBe(Math.max(...k.zawody.map((z) => z.wynik)));
    }
  });

  it("pojedynczy zawód z klastra nie dostaje nazwy zbiorczej", () => {
    const r = silnik(RZEMIESLNIK);
    for (const p of r.warstwa2.pozycje) {
      if (p.typ === "zawod" && p.zawody[0].klaster) {
        const wszyscyZKlastra = r.warstwa2.pozycje
          .flatMap((x) => x.zawody)
          .filter((z) => z.klaster === p.zawody[0].klaster);
        expect(wszyscyZKlastra).toHaveLength(1);
      }
    }
  });
});

describe("testy T7–T10 i T16", () => {
  it("T7: profil płaski nie wywala systemu i produkuje sensowny wynik", () => {
    const plaski: WynikiModulow = {
      ...RZEMIESLNIK,
      z: Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i + 1, 50])),
      k: Object.fromEntries(Array.from({ length: 30 }, (_, i) => [i + 1, 50])),
    };
    const r = silnik(plaski);
    expect(r.warstwa1.profilNieostry).toBe(true);
    expect(r.warstwa1.obszary.length).toBeGreaterThanOrEqual(5);
    expect(r.warstwa2.pozycje.length).toBeGreaterThan(0);
    expect(r.warstwa3.drogiBezStudiow.length).toBeGreaterThan(0);
    expect(r.pytaniaNaSesje.join(" ")).toContain("nieostry");
  });

  it("T8: uczestnik z trzema wetami dostaje co najmniej pięć zawodów", () => {
    const trzyWeta: WynikiModulow = {
      ...SPOLECZNA,
      weta: ["F21", "F12", "F16"],
      g: { ...SPOLECZNA.g, F21: 0, F12: 0, F16: 0 },
    };
    const r = silnik(trzyWeta);
    expect(r.warstwa2.pozycje.length).toBeGreaterThanOrEqual(5);
  });

  it("T9: zawód z flagą trampoliny nie jest jedyną pozycją Drogi A", () => {
    for (const w of [RZEMIESLNIK, SPOLECZNA, ANALITYK]) {
      const r = silnik(w);
      const drogaA = r.warstwa1.drogi.find((d) => d.etykieta === "A");
      if (!drogaA || drogaA.zawody.length === 0) continue;
      const zawodyA = drogaA.zawody.map((kod) => r.warstwa2.wszystkie.find((z) => z.kod === kod)!);
      const wszystkieTrampoliny = zawodyA.every((z) => z.flagi.trampolina);
      expect(wszystkieTrampoliny, drogaA.nazwaObszaru).toBe(false);
    }
  });

  it("T10 i T16: dwa różne profile nie dostają identycznej listy", () => {
    const listy = [RZEMIESLNIK, SPOLECZNA, ANALITYK].map((w) =>
      silnik(w)
        .warstwa2.pozycje.slice(0, 10)
        .map((p) => p.kod)
        .join("|"),
    );
    expect(new Set(listy).size).toBe(3);
  });

  it("gwarancje: co najmniej trzy zawody bez studiów i dwa o szybkim wejściu", () => {
    for (const w of [RZEMIESLNIK, SPOLECZNA, ANALITYK]) {
      const r = silnik(w);
      expect(r.warstwa2.gwarancje.bezStudiow).toBeGreaterThanOrEqual(3);
      expect(r.warstwa2.gwarancje.szybkieWejscie).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("warstwa 3: testy K1–K8", () => {
  it("K1: kierunek nigdy nie wychodzi wyżej niż najlepszy zawód, do którego prowadzi", () => {
    const r = silnik(ANALITYK);
    const wynikiZawodow = new Map(r.warstwa2.wszystkie.map((z) => [z.kod, z.wynik]));
    const kierunkiZBazy = new Map(baza.kierunki.map((k) => [k.kod, k]));
    for (const k of r.warstwa3.kierunki) {
      const zrodlo = kierunkiZBazy.get(k.kod)!;
      const najlepszy = Math.max(
        0,
        ...[...zrodlo.bezposrednie, ...zrodlo.posrednie].map((z) => wynikiZawodow.get(z) ?? 0),
      );
      expect(k.wynik, k.nazwa).toBeLessThanOrEqual(najlepszy + 0.05);
    }
  });

  it("K2: brak wymaganego przedmiotu po maturze usuwa, przed maturą tylko ostrzega", () => {
    const przedMatura: WynikiModulow = {
      ...ANALITYK,
      punktStartu: { ...A0_BAZOWY, etap: "liceum_1_2", rozszerzenia: ["informatyka"] },
    };
    const poMaturze: WynikiModulow = {
      ...ANALITYK,
      punktStartu: { ...A0_BAZOWY, etap: "po_maturze", rozszerzenia: ["informatyka"] },
    };
    const a = silnik(przedMatura).warstwa3;
    const b = silnik(poMaturze).warstwa3;
    expect(a.usuniete.length).toBe(0);
    expect(b.usuniete.length).toBeGreaterThan(0);
    const zOstrzezeniem = a.kierunki.filter((k) =>
      k.ostrzezenia.some((o) => o.includes("Jeszcze można to zmienić")),
    );
    expect(zOstrzezeniem.length).toBeGreaterThan(0);
  });

  it("K3: profil rzemieślniczy dostaje komunikat, że studia nie są konieczne", () => {
    const r = silnik(RZEMIESLNIK);
    expect(r.warstwa3.sensStudiow).toBe("niepotrzebne");
    expect(r.warstwa3.komunikatOSensie).toContain("nie jest gorsza wiadomość");
    expect(r.warstwa3.drogiBezStudiowPierwsze).toBe(true);
  });

  it("K4: profil medyczny dostaje komunikat, że studia są warunkiem", () => {
    const medyczny: WynikiModulow = {
      ...SPOLECZNA,
      weta: [],
      g: { ...SPOLECZNA.g, F21: 1, F01: 1, F02: 1, F12: 1, F16: 1 },
      z: { ...SPOLECZNA.z, 7: 95, 13: 88, 6: 80, 15: 70 },
      shape: { ...SPOLECZNA.shape, INW: 0 },
    };
    const r = silnik(medyczny);
    expect(["warunek", "czesc_drog"]).toContain(r.warstwa3.sensStudiow);
    expect(r.warstwa3.udzialZawodowZeStudiami).toBeGreaterThan(0.4);
  });

  it("K5: lista dróg bez studiów jest w każdym raporcie, niezależnie od profilu", () => {
    for (const w of [RZEMIESLNIK, SPOLECZNA, ANALITYK]) {
      const r = silnik(w);
      expect(r.warstwa3.drogiBezStudiow.length, "profil").toBeGreaterThan(0);
    }
  });

  it("K6: kierunek o odsetku poniżej 40% zawsze ma ostrzeżenie", () => {
    const r = silnik(ANALITYK);
    const niskiOdsetek = r.warstwa3.kierunki.filter((k) => k.odsetek !== null && k.odsetek < 40);
    expect(niskiOdsetek.length).toBeGreaterThan(0);
    for (const k of niskiOdsetek) {
      expect(k.ostrzezenia.join(" "), k.nazwa).toContain("pracuje w zawodzie");
    }
  });

  it("K7: blok „kierunek to nie zawód” istnieje jako stała treść", () => {
    expect(KIERUNEK_TO_NIE_ZAWOD).toContain("Wybierasz zestaw drzwi");
  });

  it("K8: kierunek szeroki nie wygrywa z wąskim, gdy profil jest wyraźny", () => {
    const r = silnik(ANALITYK);
    const poKodzie = new Map(r.warstwa3.kierunki.map((k) => [k.kod, k]));
    const zarzadzanie = poKodzie.get("zarzadzanie");
    const informatyka = poKodzie.get("informatyka");
    if (zarzadzanie && informatyka) {
      expect(informatyka.wynik).toBeGreaterThan(zarzadzanie.wynik);
    }
  });

  it("pole „czego nie daje” trafia do wyniku dosłownie", () => {
    const r = silnik(ANALITYK);
    const zPolem = r.warstwa3.kierunki.filter((k) => k.czegoNieDaje !== null);
    expect(zPolem.length).toBeGreaterThan(10);
  });
});

describe("warstwa 0: testy A0-1 – A0-7", () => {
  it("A0-1: odmowa odpowiedzi o zdrowiu daje pełny wynik bez ostrzeżeń o pominięciu", () => {
    const zOdmowa: WynikiModulow = {
      ...ANALITYK,
      punktStartu: { ...A0_BAZOWY, ograniczenia: [], ograniczeniaPominiete: true },
    };
    const bez: WynikiModulow = { ...ANALITYK, punktStartu: { ...A0_BAZOWY } };
    const a = silnik(zOdmowa);
    const b = silnik(bez);
    expect(a.warstwa2.pozycje.length).toBe(b.warstwa2.pozycje.length);
    const sekcja = sekcjaPunktStartu(zOdmowa.punktStartu, [])!;
    expect(JSON.stringify(sekcja)).not.toMatch(/pomin|nie odpowiedział|brak odpowiedzi/i);
  });

  it("A0-2: przedmiot trudny obniża kierunek, ale nie obniża zawodu", () => {
    const bez: WynikiModulow = {
      ...ANALITYK,
      punktStartu: { ...A0_BAZOWY, przedmiotyTrudne: ["historia", "jezyki", "wos"] },
    };
    const zTrudna: WynikiModulow = {
      ...ANALITYK,
      punktStartu: { ...A0_BAZOWY, przedmiotyTrudne: ["matematyka", "historia", "jezyki"], przedmiotyMocne: ["informatyka", "fizyka", "polski"] },
    };
    const a = silnik(bez);
    const b = silnik(zTrudna);
    // Zawody bez zmian.
    for (const z of a.warstwa2.wszystkie) {
      expect(b.warstwa2.wszystkie.find((x) => x.kod === z.kod)!.wynik, z.kod).toBe(z.wynik);
    }
    // Kierunki wymagajace matematyki nizej.
    const zMatematyka = baza.kierunki.filter((k) => k.wymagane.includes("matematyka"));
    expect(zMatematyka.length).toBeGreaterThan(0);
    const przed = a.warstwa3.kierunki.find((k) => k.kod === zMatematyka[0].kod);
    const po = b.warstwa3.kierunki.find((k) => k.kod === zMatematyka[0].kod);
    if (przed && po) expect(po.wynik).toBeLessThan(przed.wynik);
  });

  it("A0-3: mobilność „nie” plus brak dojazdu usuwa zawody wielkomiejskie", () => {
    const zamkniety: WynikiModulow = {
      ...ANALITYK,
      punktStartu: { ...A0_BAZOWY, mobilnosc: "nie", dojazdDoMiasta: "nie" },
    };
    const r = silnik(zamkniety);
    expect(r.warstwa2.usunieteA0.length).toBeGreaterThan(0);
    const kody = new Set(r.warstwa2.wszystkie.map((z) => z.kod));
    for (const z of baza.zawody.filter((x) => x.duzeMiasto)) {
      expect(kody.has(z.kod), z.kod).toBe(false);
    }
  });

  it("A0-4: doświadczenie wzmacnia, ale nigdy nie obniża", () => {
    const bez: WynikiModulow = { ...RZEMIESLNIK, punktStartu: { ...A0_BAZOWY, doswiadczenie: [] } };
    const zDosw: WynikiModulow = {
      ...RZEMIESLNIK,
      punktStartu: { ...A0_BAZOWY, doswiadczenie: ["hobby", "praca_doryw", "konkursy", "projekty"] },
    };
    const a = silnik(bez).warstwa2.wszystkie;
    const b = silnik(zDosw).warstwa2.wszystkie;
    // Po normalizacji porownujemy surowe mnozniki korekty.
    for (const z of a) {
      const p = b.find((x) => x.kod === z.kod)!;
      expect(p.korektaA0, z.kod).toBeGreaterThanOrEqual(z.korektaA0 - 1e-9);
    }
  });

  it("A0-5: sekcja punktu startu zaczyna się od tego, co otwarte, przy każdym profilu", () => {
    const etapy: EtapEdukacji[] = [
      "podstawowka",
      "liceum_1_2",
      "liceum_maturalna",
      "branzowa",
      "po_maturze",
      "studiuje",
      "po_studiach",
      "pracuje_zmiana",
      "nie_uczy_nie_pracuje",
    ];
    for (const etap of etapy) {
      const s = sekcjaPunktStartu({ ...A0_BAZOWY, etap, matematyka: "najwiekszy_problem" }, ["Rzemiosło"])!;
      expect(s.coToOtwiera.length, etap).toBeGreaterThan(0);
      // Sekcja o ograniczeniach nie moze byc pierwsza.
      expect(s.coToOtwiera[0], etap).not.toMatch(/problem|zawęża|nie masz/i);
    }
  });

  it("A0-6: dziewięć etapów edukacji daje dziewięć różnych zakończeń raportu", () => {
    const etapy: EtapEdukacji[] = [
      "podstawowka",
      "liceum_1_2",
      "liceum_maturalna",
      "branzowa",
      "po_maturze",
      "studiuje",
      "po_studiach",
      "pracuje_zmiana",
      "nie_uczy_nie_pracuje",
    ];
    const zakonczenia = etapy.map((etap) => zakonczenieWedlugEtapu({ ...A0_BAZOWY, etap })!.pierwszyKrok);
    expect(new Set(zakonczenia).size).toBe(9);
  });

  it("A0-7: uczestnik z matematyką jako największym problemem nadal dostaje pięć zawodów w paśmie mocnym", () => {
    const zMatematyka: WynikiModulow = {
      ...RZEMIESLNIK,
      punktStartu: {
        ...A0_BAZOWY,
        etap: "liceum_1_2",
        matematyka: "najwiekszy_problem",
        przedmiotyTrudne: ["matematyka", "fizyka", "chemia"],
        przedmiotyMocne: ["zawodowe", "wf", "informatyka"],
      },
    };
    const r = silnik(zMatematyka);
    const mocne = r.warstwa2.wszystkie.filter((z) => z.wynik >= 70);
    expect(mocne.length).toBeGreaterThanOrEqual(5);
  });
});

describe("zasady, których nie wolno złamać, na pełnym wyniku", () => {
  it("uczestnik nie widzi listy zawodów usuniętych przez weto w swoich pozycjach", () => {
    const r = silnik(SPOLECZNA);
    const wPozycjach = new Set(r.warstwa2.pozycje.flatMap((p) => p.zawody.map((z) => z.kod)));
    for (const u of r.warstwa2.usunieteWetem) expect(wPozycjach.has(u.kod)).toBe(false);
  });

  it("nigdy nie pada komunikat, że nic nie pasuje", () => {
    const beznadziejny: WynikiModulow = {
      ...RZEMIESLNIK,
      z: Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i + 1, 5])),
      k: Object.fromEntries(Array.from({ length: 30 }, (_, i) => [i + 1, 5])),
    };
    const r = silnik(beznadziejny);
    expect(r.warstwa1.obszary.length).toBeGreaterThanOrEqual(5);
    expect(r.warstwa2.pozycje.length).toBeGreaterThan(0);
    const tekst = JSON.stringify(r);
    expect(tekst).not.toMatch(/nic nie pasuje|nie nadajesz się|brak dopasowania/i);
  });

  it("silnik produkuje pytania na sesję, nie tylko ranking", () => {
    for (const w of [RZEMIESLNIK, SPOLECZNA, ANALITYK]) {
      expect(silnik(w).pytaniaNaSesje.length).toBeGreaterThan(0);
    }
  });

  it("determinizm: dwa uruchomienia dają identyczny wynik", () => {
    const a = JSON.stringify(silnik(SPOLECZNA));
    const b = JSON.stringify(silnik(SPOLECZNA));
    expect(a).toBe(b);
  });
});
