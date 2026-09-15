/**
 * Liczenie wynikow siedmiu modulow z surowych odpowiedzi uczestnika.
 *
 * Czyste funkcje. Wejscie: odpowiedzi w postaci, w jakiej leza w bazie.
 * Wyjscie: WynikiModulow, czyli jedyne wejscie silnika dopasowania.
 *
 * Wzory pochodza wprost ze specyfikacji modulow i maja wlasne testy
 * poprawnosci, ktore specyfikacje same podaja: suma W_raw po 24 obszarach
 * musi wynosic dokladnie 0, suma wygranych w A4 dokladnie 36.
 */

import { OBSZARY_A1, KOMPETENCJE_A2, WARTOSCI_A4, WYMIARY_A3, WYMIARY_M1 } from "../domain/slowniki";
import { BLOKI_A1 } from "../content/a1";
import { BLOKI_A2 } from "../content/a2";
import { PARY_A3 } from "../content/a3";
import { FORMULY_A4, NAPIECIA_A4, PARY_A4 } from "../content/a4";
import { PARY_MIEKKIE_M1, PYTANIA_WPROST_M1 } from "../content/m1";
import { OSIE_A6, PARY_A6 } from "../content/a6";
import type { PunktStartu, WynikiModulow } from "./typy";

/** Wagi miejsc w bloku. Srodkowe waza trzy razy mniej niz skrajne, celowo. */
const WAGI_RANKINGU: Record<number, number> = { 1: 1.5, 2: 0.5, 3: -0.5, 4: -1.5 };

export type Ranking = Record<string, number>;

// =====================================================================
// A1 — ZAINTERESOWANIA
// =====================================================================

export interface OdpowiedziA1 {
  /** blok -> { idPozycji: miejsce 1-4 } */
  czescA: Record<number, Ranking>;
  /** obszar 1-24 -> kotwica 1-5 */
  czescB: Record<number, number>;
  /** obszar 1-24 -> czy probowal */
  czescC: Record<number, boolean>;
}

export interface WynikA1 {
  z: Record<number, number>;
  wn: Record<number, number>;
  ekspozycja: Record<number, boolean>;
  osie: { rzeczyLudzie: number; daneIdee: number };
  rodziny: Record<string, number>;
  zroznicowanie: number;
  podniesienie: number;
  pewnosc: "wyrazny" | "umiarkowany" | "jeszcze_nieuksztaltowany";
}

export function policzA1(o: OdpowiedziA1): WynikA1 {
  const pozycjaDoObszaru = new Map<string, number>();
  for (const blok of BLOKI_A1) for (const p of blok.pozycje) pozycjaDoObszaru.set(p.id, p.obszar);

  const wRaw: Record<number, number> = {};
  for (const a of OBSZARY_A1) wRaw[a.id] = 0;
  for (const ranking of Object.values(o.czescA)) {
    // Blok cofniety przez uczestnika nie ma wartosci. Pominiecie go daje ten
    // sam wynik co jego nieobecnosc: zadna waga sie nie zmienia.
    if (!ranking) continue;
    for (const [id, miejsce] of Object.entries(ranking)) {
      const obszar = pozycjaDoObszaru.get(id);
      if (obszar !== undefined) wRaw[obszar] += WAGI_RANKINGU[miejsce] ?? 0;
    }
  }

  const wn: Record<number, number> = {};
  for (const a of OBSZARY_A1) wn[a.id] = ((wRaw[a.id] / 6 + 1.5) / 3) * 100;

  const kotwice = Object.values(o.czescB);
  const podniesienie = kotwice.length > 0 ? kotwice.reduce((s, x) => s + x, 0) / kotwice.length : 3;
  // Podniesienie skrajne: kotwica nic nie wnosi, licz wynik z samego rankingu.
  const kotwicaWazy = podniesienie >= 2.0 && podniesienie <= 4.3 && kotwice.length > 0;

  const z: Record<number, number> = {};
  for (const a of OBSZARY_A1) {
    const pn = (((o.czescB[a.id] ?? 3) - 1) / 4) * 100;
    z[a.id] = kotwicaWazy ? 0.7 * wn[a.id] + 0.3 * pn : wn[a.id];
  }

  const rodziny: Record<string, number> = {};
  for (const [kod, def] of Object.entries(
    Object.fromEntries(["R", "I", "A", "S", "E", "C"].map((r) => [r, OBSZARY_A1.filter((a) => a.rodzina === r)])),
  )) {
    rodziny[kod] = def.reduce((s, a) => s + z[a.id], 0) / def.length;
  }
  const f = (kod: string) => rodziny[kod] - 50;
  const osie = {
    rzeczyLudzie: (2 * f("R") + f("I") + f("C") - (f("A") + 2 * f("S") + f("E"))) / 6,
    daneIdee: (f("E") + f("C") - (f("I") + f("A"))) / 2,
  };

  const wartosci = Object.values(z);
  const zroznicowanie = Math.max(...wartosci) - Math.min(...wartosci);

  return {
    z,
    wn,
    ekspozycja: o.czescC,
    osie,
    rodziny,
    zroznicowanie,
    podniesienie,
    pewnosc:
      zroznicowanie >= 30 ? "wyrazny" : zroznicowanie >= 18 ? "umiarkowany" : "jeszcze_nieuksztaltowany",
  };
}

// =====================================================================
// A2 — KOMPETENCJE
// =====================================================================

export interface OdpowiedziA2 {
  czescA: Record<number, Ranking>;
  /** kompetencja 1-30 -> trzy pola dowodow */
  czescB: Record<number, boolean[]>;
}

export interface WynikA2 {
  k: Record<number, number>;
  sn: Record<number, number>;
  dowody: Record<number, number>;
  grupy: Record<string, number>;
  zroznicowanie: number;
  wskaznikOkazji: number;
  pewnosc: "wyrazny" | "umiarkowany" | "jeszcze_nieuksztaltowany";
}

export function policzA2(o: OdpowiedziA2): WynikA2 {
  const pozycjaDoKompetencji = new Map<string, number>();
  for (const blok of BLOKI_A2) for (const p of blok.pozycje) pozycjaDoKompetencji.set(p.id, p.kompetencja);

  const sRaw: Record<number, number> = {};
  for (const k of KOMPETENCJE_A2) sRaw[k.id] = 0;
  for (const ranking of Object.values(o.czescA)) {
    // Blok cofniety przez uczestnika nie ma wartosci. Pominiecie go daje ten
    // sam wynik co jego nieobecnosc: zadna waga sie nie zmienia.
    if (!ranking) continue;
    for (const [id, miejsce] of Object.entries(ranking)) {
      const kompetencja = pozycjaDoKompetencji.get(id);
      if (kompetencja !== undefined) sRaw[kompetencja] += WAGI_RANKINGU[miejsce] ?? 0;
    }
  }

  const sn: Record<number, number> = {};
  for (const k of KOMPETENCJE_A2) sn[k.id] = ((sRaw[k.id] / 6 + 1.5) / 3) * 100;

  const dowody: Record<number, number> = {};
  for (const k of KOMPETENCJE_A2) dowody[k.id] = (o.czescB[k.id] ?? []).filter(Boolean).length;
  const wskaznikOkazji = Object.values(dowody).reduce((s, x) => s + x, 0);
  // Za malo okazji albo przeszacowanie: licz z samego rankingu.
  const dowodyWaza = wskaznikOkazji >= 8 && wskaznikOkazji <= 75;

  const k: Record<number, number> = {};
  for (const kom of KOMPETENCJE_A2) {
    const dn = (dowody[kom.id] / 3) * 100;
    k[kom.id] = dowodyWaza ? 0.7 * sn[kom.id] + 0.3 * dn : sn[kom.id];
  }

  const grupy: Record<string, number> = {};
  for (const g of ["AN", "UT", "SL", "LU", "WY", "CP"]) {
    const w = KOMPETENCJE_A2.filter((x) => x.grupa === g);
    grupy[g] = w.reduce((s, x) => s + k[x.id], 0) / w.length;
  }

  const wartosci = Object.values(k);
  const zroznicowanie = Math.max(...wartosci) - Math.min(...wartosci);

  return {
    k,
    sn,
    dowody,
    grupy,
    zroznicowanie,
    wskaznikOkazji,
    pewnosc:
      zroznicowanie >= 30 ? "wyrazny" : zroznicowanie >= 18 ? "umiarkowany" : "jeszcze_nieuksztaltowany",
  };
}

// =====================================================================
// A3 — STYL DZIALANIA
// =====================================================================

export interface OdpowiedziA3 {
  /** id pary -> wybrany biegun */
  czescA: Record<string, "A" | "B">;
  /** wymiar -> kotwica 1-5 */
  czescB: Record<string, number>;
}

export interface WynikA3 {
  pozycje: Record<string, number>;
  wyrazistosc: Record<string, number>;
  sila: Record<string, number>;
  /** Wymiary z sila >= 65. Wchodza do srodowiska pracy i do silnika. */
  warunkiKluczowe: Array<{ wymiar: string; biegun: "A" | "B"; sila: number; warunek: string }>;
  preferencje: Array<{ wymiar: string; biegun: "A" | "B"; sila: number; warunek: string }>;
  wyrazistoscOgolna: number;
}

export function policzA3(o: OdpowiedziA3): WynikA3 {
  const pozycje: Record<string, number> = {};
  const wyrazistosc: Record<string, number> = {};
  const sila: Record<string, number> = {};

  for (const wymiar of WYMIARY_A3) {
    const pary = PARY_A3.filter((p) => p.wymiar === wymiar.kod);
    const wybraneA = pary.filter((p) => o.czescA[p.id] === "A").length;
    const odpowiedziane = pary.filter((p) => o.czescA[p.id] !== undefined).length;
    pozycje[wymiar.kod] = odpowiedziane > 0 ? (wybraneA / odpowiedziane) * 100 : 50;
    wyrazistosc[wymiar.kod] = Math.abs(pozycje[wymiar.kod] - 50) * 2;
    const wag = o.czescB[wymiar.kod];
    const wagn = wag === undefined ? 0 : ((wag - 1) / 4) * 100;
    // Srednia geometryczna, nie arytmetyczna: warunek liczy sie dopiero wtedy,
    // gdy uczestnik jest jednoczesnie wyrazny i przywiazany.
    sila[wymiar.kod] = Math.sqrt(wyrazistosc[wymiar.kod] * wagn);
  }

  const opis = (kod: string) => {
    const w = WYMIARY_A3.find((x) => x.kod === kod)!;
    const biegun: "A" | "B" = pozycje[kod] > 50 ? "A" : "B";
    return { wymiar: kod, biegun, sila: sila[kod], warunek: biegun === "A" ? w.warunekA : w.warunekB };
  };

  const warunkiKluczowe = WYMIARY_A3.filter((w) => sila[w.kod] >= 65)
    .map((w) => opis(w.kod))
    .sort((a, b) => b.sila - a.sila);
  const preferencje = WYMIARY_A3.filter((w) => sila[w.kod] >= 40 && sila[w.kod] < 65)
    .map((w) => opis(w.kod))
    .sort((a, b) => b.sila - a.sila);

  return {
    pozycje,
    wyrazistosc,
    sila,
    warunkiKluczowe,
    preferencje,
    wyrazistoscOgolna:
      Object.values(wyrazistosc).reduce((s, x) => s + x, 0) / WYMIARY_A3.length,
  };
}

// =====================================================================
// A4 — WARTOSCI
// =====================================================================

export interface OdpowiedziA4 {
  /** numer pary -> kod wybranej wartosci */
  czescA: Record<number, string>;
  /** maksymalnie trzy wartosci nieodzowne */
  czescB: string[];
  /** cztery odpowiedzi testu kosztu */
  czescC: Array<"tak" | "nie" | "zalezy">;
}

export type TwardoscA4 = "warunek" | "silna_preferencja" | "preferencja";

export interface WynikA4 {
  rank: Record<string, number>;
  v: Record<string, number>;
  /** Wszystkie dwanascie w kolejnosci, od najwazniejszej. */
  kolejnosc: string[];
  top3: string[];
  top5: string[];
  bottom3: string[];
  progowe: string[];
  koszt: number;
  /**
   * Ile uczestnik jest gotow oddac za wartosc, ktora wyszla najwyzej.
   * Null, gdy test kosztu nie zostal wypelniony: brak odpowiedzi nie jest
   * odpowiedzia „preferencja".
   */
  twardosc: TwardoscA4 | null;
  /** Najwyzej dwa. Informacja, nie sprzecznosc. */
  napiecia: Array<{ a: string; b: string }>;
  /** Najwyzej jeden: wartosc wygrywana wprost, oddawana pod kosztem. */
  rozjazd: { kod: string; roznica: number } | null;
  /** Wartosc nieodzowna, ktora w rankingu wypadla nisko. Flaga na sesje 1:1. */
  rozbieznosci: string[];
  zroznicowanie: number;
}

/**
 * Twardosc z czterech odpowiedzi testu kosztu: tak 2, zalezy 1, nie 0.
 *
 * Prog szesciu punktow znaczy, ze uczestnik oddalby za te wartosc prawie
 * wszystko. Prog trzech, ze jest wazna, ale nie za kazda cene. Ponizej
 * deklaracja nie ma pokrycia w gotowosci do kosztu, co przy szesnastolatku
 * jest stanem normalnym i nigdzie nie nazywamy tego slabosria.
 */
function twardoscZKosztu(odpowiedzi: Array<"tak" | "nie" | "zalezy">): TwardoscA4 | null {
  if (odpowiedzi.length === 0) return null;
  const punkty = odpowiedzi.reduce((s, o) => s + (o === "tak" ? 2 : o === "zalezy" ? 1 : 0), 0);
  return punkty >= 6 ? "warunek" : punkty >= 3 ? "silna_preferencja" : "preferencja";
}

export function policzA4(o: OdpowiedziA4): WynikA4 {
  const wygrane: Record<string, number> = {};
  for (const w of WARTOSCI_A4) wygrane[w.kod] = 0;
  for (const para of PARY_A4) {
    const wybor = o.czescA[para.nr];
    if (wybor && wygrane[wybor] !== undefined) wygrane[wybor] += 1;
  }

  const rank: Record<string, number> = {};
  const v: Record<string, number> = {};
  const progowe = o.czescB.slice(0, 3);
  for (const w of WARTOSCI_A4) {
    rank[w.kod] = (wygrane[w.kod] / 6) * 100;
    // Bonus progowy jest addytywny, nie mnozony.
    v[w.kod] = rank[w.kod] + (progowe.includes(w.kod) ? 25 : 0);
  }

  const posortowane = [...WARTOSCI_A4].sort(
    (a, b) =>
      v[b.kod] - v[a.kod] ||
      rank[b.kod] - rank[a.kod] ||
      (progowe.includes(b.kod) ? 1 : 0) - (progowe.includes(a.kod) ? 1 : 0) ||
      WARTOSCI_A4.indexOf(a) - WARTOSCI_A4.indexOf(b),
  );

  const wartosciRank = Object.values(rank);
  const kolejnosc = posortowane.map((w) => w.kod);
  const top5 = kolejnosc.slice(0, 5);

  /**
   * Napiecia: dwie wartosci ciagnace w przeciwne strony, obie w czolowce.
   * Najwyzej dwa, bo trzecia uwaga tego samego rodzaju przestaje byc uwaga.
   * Przy remisie decyduje suma `v`, wiec wynik jest powtarzalny.
   */
  const napiecia = NAPIECIA_A4.filter((n) => top5.includes(n.a) && top5.includes(n.b))
    .map((n) => ({ a: n.a, b: n.b, waga: v[n.a] + v[n.b] }))
    .sort((x, y) => y.waga - x.waga || x.a.localeCompare(y.a))
    .slice(0, 2)
    .map(({ a, b }) => ({ a, b }));

  /**
   * Rozjazd: wartosc wygrywala, gdy pytalismy wprost, a byla oddawana, gdy
   * pytalismy o rezygnacje. Warunek dwoch par w bloku czwartym jest konieczny:
   * przy jednej roznica wynosi zawsze 0 albo 1 i nic nie znaczy.
   */
  let rozjazd: { kod: string; roznica: number } | null = null;
  for (const w of WARTOSCI_A4) {
    const wBloku = (odwrotny: boolean) =>
      PARY_A4.filter(
        (p) =>
          FORMULY_A4[p.formula].odwrotna === odwrotny && (p.lewa === w.kod || p.prawa === w.kod),
      );
    const klasyczne = wBloku(false);
    const rezygnacyjne = wBloku(true);
    if (rezygnacyjne.length < 2 || klasyczne.length === 0) continue;
    const wygral = (pary: typeof PARY_A4) =>
      pary.filter((p) => o.czescA[p.nr] === w.kod).length;
    const roznica = wygral(klasyczne) / klasyczne.length - wygral(rezygnacyjne) / rezygnacyjne.length;
    if (roznica >= 0.5 && top5.includes(w.kod) && (!rozjazd || roznica > rozjazd.roznica)) {
      rozjazd = { kod: w.kod, roznica };
    }
  }

  return {
    rank,
    v,
    kolejnosc,
    top3: kolejnosc.slice(0, 3),
    top5,
    bottom3: kolejnosc.slice(-3),
    progowe,
    koszt: o.czescC.filter((x) => x === "tak").length,
    twardosc: twardoscZKosztu(o.czescC),
    napiecia,
    rozjazd,
    rozbieznosci: progowe.filter((kod) => rank[kod] < 50),
    zroznicowanie: Math.max(...wartosciRank) - Math.min(...wartosciRank),
  };
}

// =====================================================================
// A5 — FILTRY RZECZYWISTOSCI
// =====================================================================

export interface OdpowiedziA5 {
  /** kod filtru -> odpowiedz */
  czescA: Record<string, "tak" | "moze" | "nie">;
  /** maksymalnie trzy weta */
  czescB: string[];
  /** trzy otwarte dokonczenia, nie wchodza do silnika */
  czescC: string[];
}

export interface WynikA5 {
  g: Record<string, number>;
  weta: string[];
  wskaznikZamkniecia: number;
  brakOdmow: boolean;
  sameMoze: boolean;
  zdania: string[];
}

export function policzA5(o: OdpowiedziA5): WynikA5 {
  const g: Record<string, number> = {};
  for (const [kod, odp] of Object.entries(o.czescA)) {
    g[kod] = odp === "tak" ? 1 : odp === "moze" ? 0.5 : 0;
  }
  const odpowiedzi = Object.values(o.czescA);
  const zamkniecie = odpowiedzi.filter((x) => x === "nie").length;
  return {
    g,
    // Weto mozna postawic wylacznie na pozycji z odpowiedzia NIE.
    weta: o.czescB.filter((kod) => o.czescA[kod] === "nie").slice(0, 3),
    wskaznikZamkniecia: zamkniecie,
    brakOdmow: zamkniecie === 0,
    sameMoze: odpowiedzi.filter((x) => x === "moze").length > 24,
    zdania: o.czescC,
  };
}

// =====================================================================
// M1 — KSZTALT ZYCIA
// =====================================================================

export interface OdpowiedziM1 {
  /**
   * Klucz pary daje „A" albo „B", klucz `wprost_GOD` i dwa pozostale daja
   * kod odpowiedzi z pytania wprost. Jeden rekord, bo to jedna czesc modulu.
   */
  czescA: Record<string, string>;
  /** numer obszaru -> tekst albo struktura */
  czescB: Record<number, unknown>;
}

export interface WynikM1 {
  shape: Record<string, number | null>;
  czescB: Record<number, unknown>;
}

/**
 * Trzy wymiary twarde czyta sie z jednej odpowiedzi wprost, nie z par.
 *
 * Mapa kod odpowiedzi na miejsce na osi stoi przy pytaniu, w tresci modulu,
 * zeby nie dalo sie zmienic jednego bez drugiego. `null` znaczy „nie wiem"
 * i jest jedyna wartoscia, ktora niczego nie przycina.
 */
const WPROST_M1 = new Map(
  PYTANIA_WPROST_M1.map((p) => [
    p.wymiar,
    new Map(p.opcje.map((o) => [o.kod, o.pozycja])),
  ]),
);

export function policzM1(o: OdpowiedziM1): WynikM1 {
  const shape: Record<string, number | null> = {};
  for (const wymiar of WYMIARY_M1) {
    const wprost = WPROST_M1.get(wymiar.kod);
    if (wprost) {
      const odpowiedz = o.czescA[`wprost_${wymiar.kod}`] as string | undefined;
      shape[wymiar.kod] = odpowiedz === undefined ? null : (wprost.get(odpowiedz) ?? null);
      continue;
    }
    const pary = PARY_MIEKKIE_M1.filter((p) => p.wymiar === wymiar.kod);
    const odpowiedziane = pary.filter((p) => o.czescA[p.id] !== undefined);
    if (odpowiedziane.length === 0) {
      shape[wymiar.kod] = null;
      continue;
    }
    const wybraneA = odpowiedziane.filter((p) => o.czescA[p.id] === "A").length;
    shape[wymiar.kod] = (wybraneA / odpowiedziane.length) * 100;
  }
  return { shape, czescB: o.czescB };
}

// =====================================================================
// A6 — JAK SIE UCZE
// =====================================================================

export interface OdpowiedziA6 {
  /** id pary -> wybrany biegun */
  czescA: Record<string, "A" | "B">;
  /** id pytania -> kod odpowiedzi. „nie_wiem" jest pelnoprawna odpowiedzia. */
  czescB: Record<string, string>;
}

/** Ile lat nauki uczestnik jest gotow oddac. `null` znaczy „nie wiem", nie zero. */
export type GotowoscNauki = 0 | 2 | 4 | 5 | null;

export interface WynikA6 {
  /** kod osi -> 0-100, gdzie 100 to piec razy biegun A. `null`, gdy nie odpowiedzial. */
  osie: Record<string, number | null>;
  /** Ile lat nauki jest gotow oddac zamiast pracy. */
  lata: GotowoscNauki;
  /** Nauka po godzinach, obok pracy. `null` przy „nie wiem". */
  wieczorami: boolean | null;
  /** Przeprowadzka dla nauki. `null` przy „nie wiem". */
  przeprowadzka: "gdziekolwiek" | "region" | "nie" | null;
  /**
   * Werdykt: czy droga przez dluga szkole ma dla tego czlowieka sens.
   *
   * Nigdy nie usuwa zawodow. Przesuwa cala grupe drog w gore albo w dol
   * i dopisuje zdanie do raportu. `null`, gdy modul jest pusty albo gdy
   * uczestnik na wszystkim postawil „nie wiem": brak odpowiedzi nie jest
   * odpowiedzia „nie na studia".
   */
  werdykt: "studia" | "obie_drogi" | "krotka_droga" | null;
  /** Zdania do raportu, po jednym na os wyrazna. */
  wnioski: string[];
}

const LATA_A6: Record<string, GotowoscNauki> = {
  zero: 0,
  do_dwoch: 2,
  trzy_cztery: 4,
  piec_wiecej: 5,
  nie_wiem: null,
};

/**
 * Prog wyrazistosci osi nauki: trzy pary na cztery to jeszcze nie strona,
 * cztery na cztery juz tak. Przy czterech parach mozliwe wartosci to
 * 0, 25, 50, 75 i 100, wiec prog 75 znaczy „co najmniej trzy z czterech".
 */
const WYRAZNA_A6 = 75;

export function policzA6(o: OdpowiedziA6): WynikA6 {
  const osie: Record<string, number | null> = {};
  const wnioski: string[] = [];

  for (const os of OSIE_A6) {
    const pary = PARY_A6.filter((p) => p.os === os.kod);
    const odpowiedziane = pary.filter((p) => o.czescA[p.id] !== undefined);
    if (odpowiedziane.length === 0) {
      osie[os.kod] = null;
      continue;
    }
    const a = odpowiedziane.filter((p) => o.czescA[p.id] === "A").length;
    const pozycja = (a / odpowiedziane.length) * 100;
    osie[os.kod] = pozycja;
    if (pozycja >= WYRAZNA_A6) wnioski.push(os.wniosekA);
    else if (pozycja <= 100 - WYRAZNA_A6) wnioski.push(os.wniosekB);
  }

  const lata = LATA_A6[o.czescB.lata] ?? null;
  const wieczorami =
    o.czescB.wieczorami === "tak" ? true : o.czescB.wieczorami === "nie" ? false : null;
  const przeprowadzka =
    o.czescB.przeprowadzka_nauka === "tak"
      ? "gdziekolwiek"
      : o.czescB.przeprowadzka_nauka === "region"
        ? "region"
        : o.czescB.przeprowadzka_nauka === "nie"
          ? "nie"
          : null;

  return {
    osie,
    lata,
    wieczorami,
    przeprowadzka,
    werdykt: werdyktNauki(osie, lata),
    wnioski,
  };
}

/**
 * Trzy sygnaly decyduja o werdykcie i kazdy z nich moze byc nieobecny.
 *
 * `lata` jest najmocniejsze, bo to deklaracja wprost, a nie wniosek z par.
 * Osie TEO i EGZ dokladaja sie tylko wtedy, gdy wyszly wyraznie: czlowiek,
 * ktory nie znosi teorii i uczy sie robiac, odbije sie od kierunku, na ktorym
 * pierwszy projekt jest na trzecim roku, nawet jesli deklaruje piec lat.
 *
 * Przy samych „nie wiem" werdyktu nie ma. Milczenie nie jest odmowa studiow.
 */
function werdyktNauki(
  osie: Record<string, number | null>,
  lata: GotowoscNauki,
): WynikA6["werdykt"] {
  const odpowiedziane = Object.values(osie).filter((x) => x !== null).length;
  if (odpowiedziane === 0 && lata === null) return null;

  let punkty = 0;
  if (lata === 5) punkty += 2;
  else if (lata === 4) punkty += 1;
  else if (lata === 2) punkty -= 1;
  else if (lata === 0) punkty -= 2;

  const teo = osie.TEO;
  const czy = osie.CZY;
  if (teo !== null && teo !== undefined) {
    if (teo >= WYRAZNA_A6) punkty += 1;
    else if (teo <= 100 - WYRAZNA_A6) punkty -= 1;
  }
  if (czy !== null && czy !== undefined) {
    if (czy >= WYRAZNA_A6) punkty += 1;
    else if (czy <= 100 - WYRAZNA_A6) punkty -= 1;
  }

  if (punkty >= 2) return "studia";
  if (punkty <= -2) return "krotka_droga";
  return "obie_drogi";
}

// =====================================================================
// ZLOZENIE
// =====================================================================

export interface KompletOdpowiedzi {
  a0: PunktStartu | null;
  a1: OdpowiedziA1;
  a2: OdpowiedziA2;
  a3: OdpowiedziA3;
  a4: OdpowiedziA4;
  a5: OdpowiedziA5;
  a6: OdpowiedziA6;
  m1: OdpowiedziM1;
}

/** Sklada wyniki siedmiu modulow w jedyne wejscie silnika dopasowania. */
export function zlozWynikiModulow(o: KompletOdpowiedzi): WynikiModulow {
  const a1 = policzA1(o.a1);
  const a2 = policzA2(o.a2);
  const a3 = policzA3(o.a3);
  const a4 = policzA4(o.a4);
  const a5 = policzA5(o.a5);
  const a6 = policzA6(o.a6);
  const m1 = policzM1(o.m1);

  return {
    punktStartu: o.a0,
    z: a1.z,
    ekspozycja: a1.ekspozycja,
    k: a2.k,
    dowody: a2.dowody,
    a3Pozycje: a3.pozycje,
    a3Sila: a3.sila,
    a4Top5: a4.top5,
    a4Bottom3: a4.bottom3,
    a4Progowe: a4.progowe,
    g: a5.g,
    weta: a5.weta,
    shape: m1.shape,
    nauka: a6,
  };
}
