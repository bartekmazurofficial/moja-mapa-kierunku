/**
 * WARSTWA 1: OBSZARY ZAWODOWE.
 *
 * Siedem etapow, zgodnie z 04_silniki/warstwa1_obszary.md.
 * Czysta funkcja: wyniki modulow plus baza obszarow, na wyjsciu ranking,
 * trzy drogi i wyjasnienia. Bez bazy danych i bez interfejsu.
 *
 * Zasada, ktora rzadzi cala warstwa: zainteresowania sa OSIA, nie najwieksza
 * waga. Reszta modulow modyfikuje te os, kazdy po swojemu.
 */

import {
  DEGRADACJA,
  DZIEDZICZONE,
  PASMA_OBSZAROW,
  PROG_BLISKOSCI,
  WARSTWA1,
} from "./config";
import { KOMPETENCJE_A2, OBSZARY_A1, WARTOSCI_A4, WYMIARY_A3, WYMIARY_M1 } from "../domain/slowniki";
import type { Obszar } from "../domain/typy";
import type {
  Antydopasowanie,
  Droga,
  UsunietyObszar,
  WskaznikiJakosci,
  WybranyPoziom,
  WynikiModulow,
  WynikObszaru,
  WynikWarstwy1,
} from "./typy";

const TWARDE_WYMIARY = new Set(WYMIARY_M1.filter((w) => w.twardy).map((w) => w.kod));
const A1_ETYKIETY = new Map(OBSZARY_A1.map((o) => [o.id, o.etykieta]));
const A2_NAZWY = new Map(KOMPETENCJE_A2.map((k) => [k.id, k.nazwa]));
const A4_NAZWY = new Map(WARTOSCI_A4.map((w) => [w.kod, w.nazwa]));
const A3_WYMIARY = new Map(WYMIARY_A3.map((w) => [w.kod, w]));

export function pasmoObszaru(wynik: number): string {
  return PASMA_OBSZAROW.find((p) => wynik >= p.od)!.kod;
}

// =====================================================================
// ETAP 5: POZIOM WEJSCIA
// =====================================================================

function poziomyDostepne(obszar: Obszar, w: WynikiModulow): Obszar["poziomy"] {
  return obszar.poziomy.filter((p) => {
    // Filtr dziala na POZIOMIE, nie na obszarze. Uczestnik niegotowy na
    // piecioletnie studia nie traci calego obszaru, tylko jego najdluzsze drzwi.
    if (p.wymagaStudiow && w.g["F02"] === 0) return false;
    if (p.lata >= 5 && w.g["F01"] === 0) return false;
    return true;
  });
}

function wybierzPoziom(dostepne: Obszar["poziomy"], inw: number | null): WybranyPoziom | null {
  if (dostepne.length === 0) return null;
  const posortowane = [...dostepne].sort((a, b) => a.lata - b.lata);
  let wybrany;
  if (inw !== null && inw >= 75) wybrany = posortowane[0];
  else if (inw !== null && inw <= 25) wybrany = posortowane[posortowane.length - 1];
  else wybrany = posortowane[Math.floor(posortowane.length / 2)];
  return {
    poziom: wybrany.poziom,
    etykieta: wybrany.etykieta,
    przyklad: wybrany.przyklad,
    czas: wybrany.czas,
    lata: wybrany.lata,
  };
}

// =====================================================================
// ETAP 7: WYJASNIENIA
// =====================================================================

function wyjasnienia(
  obszar: Obszar,
  w: WynikiModulow,
): { dlaczego: string[]; przeszkadza: string[]; nauczyc: number[] } {
  const dlaczego: string[] = [];

  const mocneZainteresowania = Object.entries(obszar.zainteresowania)
    .filter(([id, waga]) => waga >= 2 && (w.z[Number(id)] ?? 0) >= 60)
    .sort((a, b) => (w.z[Number(b[0])] ?? 0) - (w.z[Number(a[0])] ?? 0))
    .slice(0, 4)
    .map(([id]) => A1_ETYKIETY.get(Number(id)) ?? id);
  for (const nazwa of mocneZainteresowania) dlaczego.push(`ciągnie Cię: ${nazwa.toLowerCase()}`);

  const mocneKompetencje = Object.entries(obszar.kompetencje)
    .filter(([id, waga]) => waga === 3 && (w.k[Number(id)] ?? 0) >= 60)
    .map(([id]) => A2_NAZWY.get(Number(id)) ?? id);
  for (const nazwa of mocneKompetencje) dlaczego.push(`masz na to zaplecze: ${nazwa.toLowerCase()}`);

  for (const kod of obszar.wartosciPlus) {
    if (w.a4Top5.includes(kod)) dlaczego.push(`ta praca daje: ${(A4_NAZWY.get(kod) ?? kod).toLowerCase()}`);
  }

  for (const war of obszar.srodowisko) {
    if (!war.wymiar || !war.biegun) continue;
    const sila = w.a3Sila[war.wymiar] ?? 0;
    const poz = w.a3Pozycje[war.wymiar] ?? 50;
    const biegunUczestnika = poz > 50 ? "A" : "B";
    if (sila >= 65 && biegunUczestnika === war.biegun) {
      dlaczego.push(`środowisko, którego potrzebujesz: ${war.fraza}`);
    }
  }

  const przeszkadza: string[] = [...obszar.trudne];

  for (const [filtr, wymaganie] of Object.entries(obszar.filtry)) {
    if (wymaganie < 0.5) continue;
    const g = w.g[filtr];
    if (g === 0 || g === 0.5) {
      const tekst = FILTRY_TEKST.get(filtr) ?? filtr;
      przeszkadza.push(g === 0 ? `nie jesteś gotów na: ${tekst}` : `nie masz pewności co do: ${tekst}`);
    }
  }

  for (const kod of obszar.wartosciMinus) {
    if (w.a4Progowe.includes(kod)) {
      przeszkadza.push(
        `ta praca prawdopodobnie nie da Ci tego, bez czego nie wyobrażasz sobie pracy: ${(A4_NAZWY.get(kod) ?? kod).toLowerCase()}`,
      );
    } else if (w.a4Top5.includes(kod)) {
      przeszkadza.push(`ta praca słabo daje: ${(A4_NAZWY.get(kod) ?? kod).toLowerCase()}`);
    }
  }

  for (const [wymiar, biegun] of Object.entries(obszar.zycie)) {
    const poz = w.shape[wymiar];
    if (poz === null || poz === undefined) continue;
    const cel = biegun === "A" ? 100 : 0;
    if (Math.abs(poz - cel) / 100 === 1) {
      const opis = A3_OPIS_ZYCIA.get(`${wymiar}:${biegun}`);
      if (opis) przeszkadza.push(`ten obszar zwykle oznacza: ${opis}`);
    }
  }

  // Jedyne miejsce w calym silniku, gdzie niskie kompetencje w ogole sie
  // pojawiaja: jako lista do nauczenia sie, nigdy jako powod obnizenia wyniku.
  const nauczyc = Object.entries(obszar.kompetencje)
    .filter(([id, waga]) => waga === 3 && (w.k[Number(id)] ?? 50) < 50)
    .map(([id]) => Number(id));

  return { dlaczego, przeszkadza, nauczyc };
}

const FILTRY_TEKST = new Map<string, string>();
const A3_OPIS_ZYCIA = new Map<string, string>();
for (const w of WYMIARY_M1) {
  A3_OPIS_ZYCIA.set(`${w.kod}:A`, w.biegunA.toLowerCase());
  A3_OPIS_ZYCIA.set(`${w.kod}:B`, w.biegunB.toLowerCase());
}

/** Ustawiane raz przy starcie, zeby nie importowac calego slownika A5 w petli. */
export function ustawTekstyFiltrow(filtry: Array<{ kod: string; tekst: string }>): void {
  for (const f of filtry) FILTRY_TEKST.set(f.kod, f.tekst);
}

// =====================================================================
// ETAP 6: TRZY DROGI
// =====================================================================

function podobienstwo(obszary: Obszar[], a: number, b: number): number {
  const o = obszary.find((x) => x.id === a);
  return o?.sasiedztwo[String(b)] ?? 0;
}

function trzyDrogi(
  ranking: WynikObszaru[],
  obszary: Obszar[],
): { drogi: Droga[]; podobienstwa: WynikWarstwy1["podobienstwa"]; flagi: string[] } {
  const flagi: string[] = [];
  if (ranking.length === 0) return { drogi: [], podobienstwa: {}, flagi };

  const doDrogi = (r: WynikObszaru, etykieta: "A" | "B" | "C"): Droga => ({
    etykieta,
    obszar: r.id,
    nazwaObszaru: r.nazwa,
    poziom: r.poziomWejscia,
    zawody: [],
  });

  const A = ranking[0];
  const drogi: Droga[] = [doDrogi(A, "A")];
  const podobienstwa: WynikWarstwy1["podobienstwa"] = {};

  // Droga B odpowiada za JAKOSC: po prostu drugi w rankingu, o ile nie odstaje.
  let kandydaciB = ranking.slice(1).filter((r) => r.wynik >= WARSTWA1.PROG_DROGI_B * A.wynik);
  if (kandydaciB.length === 0) {
    kandydaciB = ranking.slice(1, 2);
    if (kandydaciB.length > 0) flagi.push("droga_b_slabsza_od_a");
  }
  if (kandydaciB.length === 0) return { drogi, podobienstwa, flagi };

  const B = kandydaciB[0];
  drogi.push(doDrogi(B, "B"));
  podobienstwa.AB = podobienstwo(obszary, A.id, B.id);
  if (podobienstwa.AB >= PROG_BLISKOSCI) flagi.push("ten_sam_swiat_a_b");

  // Droga C odpowiada za ODMIENNOSC: najdalsza sposrod sensownych.
  const kandydaciC = ranking
    .slice(1)
    .filter(
      (r) =>
        r.id !== B.id &&
        r.wynik >= WARSTWA1.PROG_DROGI_C * A.wynik &&
        r.wynik >= WARSTWA1.PROG_DROGI_C_ABSOLUTNY,
    );
  if (kandydaciC.length > 0) {
    const C = kandydaciC.reduce((najlepszy, r) => {
      const odlegloscR = Math.max(podobienstwo(obszary, A.id, r.id), podobienstwo(obszary, B.id, r.id));
      const odlegloscN = Math.max(
        podobienstwo(obszary, A.id, najlepszy.id),
        podobienstwo(obszary, B.id, najlepszy.id),
      );
      if (odlegloscR < odlegloscN) return r;
      if (odlegloscR > odlegloscN) return najlepszy;
      return r.wynik > najlepszy.wynik ? r : najlepszy;
    });
    drogi.push(doDrogi(C, "C"));
    podobienstwa.AC = podobienstwo(obszary, A.id, C.id);
    podobienstwa.BC = podobienstwo(obszary, B.id, C.id);
    if (Math.max(podobienstwa.AC, podobienstwa.BC) >= PROG_BLISKOSCI) {
      flagi.push("nawet_alternatywa_blisko");
    }
  } else {
    // U osoby o bardzo waskim profilu trzecia droga nie musi byc innym
    // obszarem. Moze byc tym samym swiatem, do ktorego wchodzi sie innymi
    // drzwiami. To uczciwsze niz doklejanie obszaru, ktory nie pasuje.
    flagi.push("droga_c_jako_inny_poziom");
    const zrodlo = ranking.find((r) => r.id === A.id)!;
    const obszarZrodla = obszary.find((o) => o.id === zrodlo.id);
    const inny = obszarZrodla?.poziomy
      .filter((p) => p.poziom !== zrodlo.poziomWejscia.poziom)
      .sort((a, b) => a.lata - b.lata)[0];
    if (inny) {
      drogi.push({
        etykieta: "C",
        obszar: zrodlo.id,
        nazwaObszaru: zrodlo.nazwa,
        poziom: {
          poziom: inny.poziom,
          etykieta: inny.etykieta,
          przyklad: inny.przyklad,
          czas: inny.czas,
          lata: inny.lata,
        },
        zawody: [],
      });
    }
  }

  if (B.wynik < 0.7 * A.wynik && !flagi.includes("droga_b_slabsza_od_a")) {
    flagi.push("droga_b_slabsza_od_a");
  }

  // Trzy drogi z jednej grupy obszarow. To jest informacja o uczestniku,
  // nie awaria systemu, i uczestnik ma ja dostac wprost, zamiast domyslac sie,
  // ze zabraklo alternatyw.
  const grupy = new Set(
    drogi.map((d) => obszary.find((o) => o.id === d.obszar)?.grupa).filter(Boolean),
  );
  if (drogi.length === 3 && grupy.size === 1) flagi.push("trzy_drogi_z_jednego_swiata");

  return { drogi, podobienstwa, flagi };
}

// =====================================================================
// ANTYDOPASOWANIA
// =====================================================================

function antydopasowania(
  ranking: WynikObszaru[],
  obszary: Obszar[],
  w: WynikiModulow,
  karyFiltrowe: Map<number, number>,
): Antydopasowanie[] {
  const lista: Antydopasowanie[] = [];
  for (const r of ranking) {
    const obszar = obszary.find((o) => o.id === r.id);
    if (!obszar) continue;

    const konfliktProgowy = obszar.wartosciMinus.find((v) => w.a4Progowe.includes(v));
    if (konfliktProgowy) {
      lista.push({
        id: r.id,
        nazwa: r.nazwa,
        powod: "konflikt_z_wartoscia_progowa",
        komunikat:
          "Ta praca prawdopodobnie nie da Ci tego, bez czego nie wyobrażasz sobie pracy.",
      });
      continue;
    }
    if ((karyFiltrowe.get(r.id) ?? 0) > 0.6) {
      lista.push({
        id: r.id,
        nazwa: r.nazwa,
        powod: "kara_filtrowa",
        komunikat: "Ta droga wymaga kilku rzeczy, na które nie jesteś gotów.",
      });
      continue;
    }
    if (r.ciagniecie < 30 && r.kompetencje > 70) {
      // Odwrotnosc cwiartki "ukryty atut" z modulu A2.
      lista.push({
        id: r.id,
        nazwa: r.nazwa,
        powod: "dasz_rade_ale_po_co",
        komunikat: "Prawdopodobnie poszłoby Ci to dobrze, ale nic Cię tam nie ciągnie.",
      });
      continue;
    }
    if (r.wynik < 42) {
      lista.push({
        id: r.id,
        nazwa: r.nazwa,
        powod: "wynik_ponizej_42",
        komunikat:
          "Ta droga zawiera dużo elementów przeciwnych Twoim aktualnym preferencjom.",
      });
    }
  }
  return lista.slice(-DEGRADACJA.MAKS_ANTYDOPASOWAN).reverse();
}

// =====================================================================
// SILNIK WARSTWY 1
// =====================================================================

export function warstwa1(
  w: WynikiModulow,
  obszary: Obszar[],
  wskazniki: WskaznikiJakosci,
): WynikWarstwy1 {
  const ranking: WynikObszaru[] = [];
  const usuniete: UsunietyObszar[] = [];
  const karyFiltrowe = new Map<number, number>();

  for (const obszar of obszary) {
    // --- ETAP 1: CIAGNIECIE. To jest cala os. ---
    // Liczone przed wetem, zeby panel prowadzacego mogl pokazac, do czego
    // uczestnika ciagnie mimo tego, ze obszar wypadl. Sam wynik sie nie zmienia:
    // ciagniecie nie zalezy od wykonalnosci.
    const sumaZaint = Object.values(obszar.zainteresowania).reduce((s, v) => s + v, 0);
    const ciagniecie =
      sumaZaint > 0
        ? Object.entries(obszar.zainteresowania).reduce(
            (s, [id, waga]) => s + waga * (w.z[Number(id)] ?? 45),
            0,
          ) / sumaZaint
        : 0;

    // --- ETAP 0: WYKONALNOSC ---
    let wykonalnosc = 1;
    if (!wskazniki.filtryWylaczone) {
      const weto = w.weta.find((f) => (obszar.filtry[f] ?? 0) >= DZIEDZICZONE.PROG_WETA);
      if (weto) {
        usuniete.push({
          id: obszar.id,
          nazwa: obszar.nazwa,
          powod: "weto",
          filtr: weto,
          wymaganie: obszar.filtry[weto],
          ciagniecie,
        });
        continue;
      }
      const sumaWag = Object.values(obszar.filtry).reduce((s, v) => s + v, 0);
      // Kara jest samonormalizujaca sie: obszar z dziesiecioma wymaganiami nie
      // jest karany surowiej niz obszar z czterema tylko dlatego, ze ma ich wiecej.
      const kara =
        sumaWag > 0
          ? Object.entries(obszar.filtry).reduce(
              (s, [f, waga]) => s + waga * (1 - (w.g[f] ?? 0.5)),
              0,
            ) / sumaWag
          : 0;
      karyFiltrowe.set(obszar.id, kara);
      wykonalnosc = 1 - DZIEDZICZONE.SUFIT_KARY_FILTROWEJ * kara;
    }

    // --- ETAP 2: WZMOCNIENIE, TYLKO W GORE ---
    const sumaKomp = Object.values(obszar.kompetencje).reduce((s, v) => s + v, 0);
    const kompetencje =
      sumaKomp > 0
        ? Object.entries(obszar.kompetencje).reduce(
            (s, [id, waga]) => s + waga * (w.k[Number(id)] ?? 45),
            0,
          ) / sumaKomp
        : 0;

    let bonus = 0;
    if (!wskazniki.bonusWylaczony) {
      bonus = (Math.max(0, kompetencje - 50) / 50) * (WARSTWA1.SUFIT_BONUSU - 3);
      const rdzen = Object.entries(obszar.kompetencje)
        .filter(([, waga]) => waga === 3)
        .map(([id]) => Number(id));
      // Dodatek za dowody jest osobny i maly: profil oparty na samym
      // wyobrazeniu ma wazyc mniej niz profil, za ktorym stoja sytuacje.
      const zDowodami = rdzen.filter((id) => (w.dowody[id] ?? 0) >= 2).length;
      if (rdzen.length > 0 && zDowodami >= Math.max(1, Math.floor(rdzen.length / 2))) bonus += 3;
      bonus = Math.min(bonus, WARSTWA1.SUFIT_BONUSU);
    }

    // --- ETAP 3: MNOZNIK ZGODNOSCI ---
    let d = 0;
    const maDaneA4 = w.a4Top5.length > 0 || w.a4Progowe.length > 0;
    if (maDaneA4) {
      for (const v of obszar.wartosciPlus) if (w.a4Top5.includes(v)) d += 0.04;
      for (const v of obszar.wartosciMinus) {
        if (w.a4Progowe.includes(v)) d -= 0.25;
        else if (w.a4Top5.includes(v)) d -= 0.1;
        else if (w.a4Bottom3.includes(v)) d += 0.02;
      }
    }
    const wspolne = Object.entries(obszar.zycie).filter(
      ([wymiar]) => w.shape[wymiar] !== null && w.shape[wymiar] !== undefined,
    );
    if (wspolne.length > 0) {
      let sumaDystansow = 0;
      for (const [wymiar, biegun] of wspolne) {
        const cel = biegun === "A" ? 100 : 0;
        const dystans = Math.abs((w.shape[wymiar] as number) - cel) / 100;
        sumaDystansow += dystans;
        if (TWARDE_WYMIARY.has(wymiar) && dystans === 1) d -= 0.08;
      }
      d -= 0.2 * (sumaDystansow / wspolne.length);
    }
    const mnoznik =
      maDaneA4 || wspolne.length > 0
        ? Math.max(WARSTWA1.MNOZNIK_MIN, Math.min(WARSTWA1.MNOZNIK_MAX, 1 + d))
        : 1;

    // --- ETAP 4: WYNIK. Bez obcinania na setce. ---
    const wynik = (ciagniecie + bonus) * mnoznik * wykonalnosc;

    // --- ETAP 5: POZIOM WEJSCIA ---
    const dostepne = poziomyDostepne(obszar, w);
    const poziomWejscia = wybierzPoziom(dostepne, w.shape["INW"] ?? null);
    if (poziomWejscia === null) {
      usuniete.push({ id: obszar.id, nazwa: obszar.nazwa, powod: "brak_poziomu", ciagniecie });
      continue;
    }

    // --- ETAP 7: WYJASNIENIA ---
    const { dlaczego, przeszkadza, nauczyc } = wyjasnienia(obszar, w);

    ranking.push({
      id: obszar.id,
      nazwa: obszar.nazwa,
      wynik,
      pasmo: pasmoObszaru(wynik),
      ciagniecie,
      kompetencje,
      bonus,
      mnoznik,
      wykonalnosc,
      poziomWejscia,
      dlaczegoPasuje: dlaczego,
      coPrzeszkadza: przeszkadza,
      czegoSieNauczyc: nauczyc,
    });
  }

  // Determinizm: ten sam komplet odpowiedzi daje identyczny ranking.
  ranking.sort((a, b) => b.wynik - a.wynik || b.ciagniecie - a.ciagniecie || a.id - b.id);

  // Obszar 27 nigdy nie pojawia sie samodzielnie. Zawsze jako para z branza.
  const przedsiebiorczosc = ranking.find((r) => r.id === 27);
  let przedsiebiorczoscWObszarze: number | null = null;
  if (przedsiebiorczosc) {
    const branza = ranking.find(
      (r) => r.id !== 27 && obszary.find((o) => o.id === r.id)?.wariantWlasny,
    );
    przedsiebiorczoscWObszarze = branza?.id ?? null;
  }

  // Profil nieostry: nie generujemy rankingu ani trzech drog. System nigdy nie
  // mowi, ze nic nie pasuje - mowi, ze profil jest jeszcze nieostry.
  //
  // Dwie reguly, alternatywne. Pierwsza patrzy na wejscie: uczestnik nie
  // rozroznil zainteresowan. Druga na wyjscie: rozroznil, ale wszystko wyszlo
  // rowno, wiec kolejnosc czolowki jest szumem podanym jako wynik.
  const naRankingu = Math.min(4, ranking.length - 1);
  const rozstepCzolowki =
    ranking.length >= 2 ? ranking[0].wynik - ranking[naRankingu].wynik : Infinity;
  const czolowkaPlaska = rozstepCzolowki < DEGRADACJA.PROFIL_ROZSTEP_CZOLOWKI;
  const profilNieostry = wskazniki.profilPlaskiA1 || czolowkaPlaska;

  const { drogi, podobienstwa, flagi } = profilNieostry
    ? { drogi: [] as Droga[], podobienstwa: {}, flagi: ["profil_nieostry"] }
    : trzyDrogi(
        ranking.filter((r) => r.id !== 27),
        obszary,
      );

  if (ranking.length > 0 && ranking.every((r) => r.wynik < 42)) {
    flagi.push("wszystkie_obszary_ponizej_progu");
  }
  if (usuniete.filter((u) => u.powod === "weto").length > obszary.length / 2) {
    // Ostrzezenie dla prowadzacego, nie dla uczestnika.
    flagi.push("weta_usunely_ponad_polowe");
  }

  // Umiejetnosci do rozwoju: najnizsze kompetencje wsrod wymaganych przez czolowke.
  const czolowka = ranking.slice(0, 5);
  const wymagane = new Set<number>();
  for (const r of czolowka) {
    const obszar = obszary.find((o) => o.id === r.id);
    if (!obszar) continue;
    for (const [id, waga] of Object.entries(obszar.kompetencje)) {
      if (waga >= 2) wymagane.add(Number(id));
    }
  }
  const umiejetnosciDoRozwoju = [...wymagane]
    .sort((a, b) => (w.k[a] ?? 50) - (w.k[b] ?? 50) || a - b)
    .slice(0, 5);

  return {
    obszary: ranking,
    usuniete,
    drogi,
    podobienstwa,
    flagi,
    antydopasowania: profilNieostry ? [] : antydopasowania(ranking, obszary, w, karyFiltrowe),
    przedsiebiorczoscWObszarze,
    umiejetnosciDoRozwoju,
    profilNieostry,
  };
}
