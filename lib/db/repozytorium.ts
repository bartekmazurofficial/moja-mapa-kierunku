/**
 * Odczyt danych referencyjnych. Jedyne miejsce, w ktorym rozpakowujemy
 * pola JSON-owe SQLite do typow domenowych.
 */

import { prisma } from "./klient";
import { czytajListe, czytajMape, czytajObiekt } from "./json";
import type {
  BazaReferencyjna,
  DrogaBezStudiow,
  Kierunek,
  Klaster,
  Obszar,
  PoziomWejscia,
  WarunekSrodowiska,
  Zawod,
} from "../domain/typy";

type WierszObszaru = Awaited<ReturnType<typeof prisma.obszar.findFirstOrThrow>>;
type WierszZawodu = Awaited<ReturnType<typeof prisma.zawod.findFirstOrThrow>>;
type WierszKierunku = Awaited<ReturnType<typeof prisma.kierunek.findFirstOrThrow>>;
type WierszDrogi = Awaited<ReturnType<typeof prisma.drogaBezStudiow.findFirstOrThrow>>;
type WierszKlastra = Awaited<ReturnType<typeof prisma.klaster.findFirstOrThrow>>;

export function naObszar(w: WierszObszaru): Obszar {
  return {
    id: w.id,
    nazwa: w.nazwa,
    grupa: w.grupa,
    szczegolny: w.szczegolny,
    wariantWlasny: w.wariantWlasny,
    zainteresowania: czytajMape<number>(w.zainteresowania),
    kompetencje: czytajMape<number>(w.kompetencje),
    wartosciPlus: czytajListe(w.wartosciPlus),
    wartosciMinus: czytajListe(w.wartosciMinus),
    filtry: czytajMape<number>(w.filtry),
    zycie: czytajMape<string>(w.zycie),
    srodowisko: czytajObiekt<WarunekSrodowiska[]>(w.srodowisko),
    trudne: czytajListe(w.trudne),
    poziomy: czytajObiekt<PoziomWejscia[]>(w.poziomy),
    sasiedztwo: czytajMape<number>(w.sasiedztwo),
    przykladoweZawody: w.przykladoweZawody,
    kierunkiStudiow: w.kierunkiStudiow,
    drogaBezStudiow: w.drogaBezStudiow,
  };
}

export function naZawod(w: WierszZawodu): Zawod {
  return {
    kod: w.kod,
    nazwa: w.nazwa,
    nazwaWyswietlana: w.nazwaWyswietlana,
    obszar: w.obszarId,
    poziom: w.poziom,
    studia: w.studia,
    a1: czytajListe(w.a1),
    a2r: czytajListe(w.a2r),
    a2w: czytajListe(w.a2w),
    a3: czytajListe(w.a3),
    a4p: czytajListe(w.a4p),
    a4m: czytajListe(w.a4m),
    a5: czytajListe(w.a5),
    m1: czytajListe(w.m1),
    anty: czytajListe(w.anty),
    koszt: w.koszt,
    flaga: w.flaga,
    zagr: w.zagr,
    kier: w.kier,
    klaster: w.klasterKod,
    duzeMiasto: w.duzeMiasto,
    teren: w.teren,
    przeciw: czytajListe(w.przeciw),
    przedm: czytajListe(w.przedm),
    dosw: czytajListe(w.dosw),
  };
}

export function naKierunek(w: WierszKierunku): Kierunek {
  return {
    kod: w.kod,
    nazwa: w.nazwa,
    typ: w.typ,
    poziom: w.poziom,
    lata: w.lata,
    wymagane: czytajListe(w.wymagane),
    punktowane: czytajListe(w.punktowane),
    trudnosc: w.trudnosc,
    bezposrednie: czytajListe(w.bezposrednie),
    posrednie: czytajListe(w.posrednie),
    odsetek: w.odsetek,
    gdzie: w.gdzie,
    robi: w.robi,
    nieDaje: w.nieDaje,
    alternatywaBezStudiow: w.alternatywaBezStudiow,
  };
}

export function naDroge(w: WierszDrogi): DrogaBezStudiow {
  return {
    kod: w.kod,
    nazwa: w.nazwa,
    typ: w.typ,
    czas: w.czas,
    koszt: w.koszt,
    zawody: czytajListe(w.zawody),
    wymagania: w.wymagania,
  };
}

export function naKlaster(w: WierszKlastra): Klaster {
  return {
    kod: w.kod,
    nazwa: w.nazwa,
    sklad: czytajListe(w.sklad),
    pytanie: w.pytanie,
    roznica: w.roznica,
    uwaga: w.uwaga,
  };
}

export async function pobierzZawod(kod: string): Promise<Zawod | null> {
  const w = await prisma.zawod.findUnique({ where: { kod } });
  return w ? naZawod(w) : null;
}

export async function pobierzObszar(id: number): Promise<Obszar | null> {
  const w = await prisma.obszar.findUnique({ where: { id } });
  return w ? naObszar(w) : null;
}

/** Cala baza referencyjna. Silnik jest czysta funkcja i dostaje ja jako argument. */
export async function pobierzBazeReferencyjna(): Promise<BazaReferencyjna> {
  const [obszary, zawody, kierunki, drogi, klastry] = await Promise.all([
    prisma.obszar.findMany({ orderBy: { id: "asc" } }),
    prisma.zawod.findMany({ orderBy: { kod: "asc" } }),
    prisma.kierunek.findMany({ orderBy: { kod: "asc" } }),
    prisma.drogaBezStudiow.findMany({ orderBy: { kod: "asc" } }),
    prisma.klaster.findMany({ orderBy: { kod: "asc" } }),
  ]);
  return {
    obszary: obszary.map(naObszar),
    zawody: zawody.map(naZawod),
    kierunki: kierunki.map(naKierunek),
    drogiBezStudiow: drogi.map(naDroge),
    klastry: klastry.map(naKlaster),
  };
}
