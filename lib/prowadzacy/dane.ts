/**
 * Dane dla panelu prowadzacego.
 *
 * Regula z rozdzialu 6 specyfikacji sesji: prowadzacy ma pietnascie minut na
 * przygotowanie i nie moze ich stracic na klikanie. Ekran uczestnika powstaje
 * jednym zapytaniem i zawiera wszystko, co potrzebne do rozmowy.
 */

import "server-only";
import { prisma } from "../db/klient";
import { pobierzBazeReferencyjna } from "../db/repozytorium";
import { stanDostepu } from "../raport/dostep";
import { KOD_GRUPY_POKAZ } from "../pokaz";
import { rolaSesji } from "./sesja";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, NAZWY_MODULOW } from "../moduly/ekrany";
import { kartaNowego, type KartaNowegoProgramu } from "../raport/nowy";
import { MARKER_ZAKONCZENIA, type KodModulu } from "../moduly/typy";
import { TEMPO } from "../engine/config";
import type { KodWarstwy } from "../raport/sekcje";

/**
 * Ostrzezenie o pobieznym wypelnieniu, liczone wzglednie.
 *
 * Prog bezwzgledny ze scenariusza nie dzialal: tempo zalezy od modulu,
 * urzadzenia i szybkosci czytania, wiec albo swiecil sie u calej grupy, albo
 * u nikogo. Porownujemy czas na blok z mediana tej samej grupy na tym samym
 * module. To sie samo kalibruje: grupa wypelniajaca szybko nie generuje
 * dwunastu ostrzezen, a osoba klikajaca na oslep odstaje od swoich niezaleznie
 * od tego, jak szybka jest reszta.
 *
 * Liczby w `TEMPO` w lib/engine/config.ts.
 */
function mediana(liczby: number[]): number {
  const posortowane = [...liczby].sort((a, b) => a - b);
  const srodek = Math.floor(posortowane.length / 2);
  return posortowane.length % 2 === 1
    ? posortowane[srodek]
    : (posortowane[srodek - 1] + posortowane[srodek]) / 2;
}

export type StanModulu = "pusty" | "wtrakcie" | "gotowy";

export interface WierszGrupy {
  kodDostepu: string;
  imie: string;
  moduly: Array<{ kod: KodModulu; stan: StanModulu; pobiezny: boolean }>;
  brakiDanych: string[];
  liczbaWet: number;
  sesja: "przed" | "po";
}

export interface WidokGrupy {
  id: string;
  kod: string;
  nazwa: string;
  uczestnicy: WierszGrupy[];
  otwarteWarstwy: KodWarstwy[];
}

/**
 * Czy biezaca sesja moze zobaczyc te grupe.
 *
 * Filtr stoi tutaj, w warstwie danych, a nie w stronach. Strona moze zapomniec
 * sprawdzic i nikt tego nie zauwazy, dopoki ktos nie wklei adresu cudzej grupy;
 * zapytanie nie zapomni, bo kazda droga do danych prowadzacego przechodzi
 * przez jedna z trzech funkcji nizej.
 */
async function wolnoZobaczyc(kodGrupy: string): Promise<boolean> {
  return (await rolaSesji()) === "pokaz" ? kodGrupy === KOD_GRUPY_POKAZ : true;
}

export async function pobierzGrupe(kodGrupy: string): Promise<WidokGrupy | null> {
  if (!(await wolnoZobaczyc(kodGrupy))) return null;
  const grupa = await prisma.grupa.findUnique({
    where: { kod: kodGrupy },
    include: {
      uczestnicy: { orderBy: { imie: "asc" }, include: { postepy: true, sesja: true } },
      odslony: true,
    },
  });
  if (!grupa) return null;

  const MODULY_GRUPY = KOLEJNOSC_MODULOW;
  const idUczestnikow = grupa.uczestnicy.map((u) => u.id);

  // Czas i liczba odpowiedzi na modul, jednym zapytaniem dla calej grupy.
  const czasy = await prisma.odpowiedz.groupBy({
    by: ["uczestnikId", "modul"],
    where: { uczestnikId: { in: idUczestnikow } },
    _sum: { msSpent: true },
    _count: { _all: true },
  });
  const czasPo = new Map(czasy.map((c) => [`${c.uczestnikId}|${c.modul}`, c._sum.msSpent ?? 0]));

  const zakonczenia = await prisma.odpowiedz.findMany({
    where: { uczestnikId: { in: idUczestnikow }, pozycja: MARKER_ZAKONCZENIA },
    select: { uczestnikId: true, modul: true, czesc: true },
  });
  const zamkniete = new Map<string, Set<string>>();
  for (const z of zakonczenia) {
    const klucz = `${z.uczestnikId}|${z.modul}`;
    if (!zamkniete.has(klucz)) zamkniete.set(klucz, new Set());
    zamkniete.get(klucz)!.add(z.czesc);
  }

  const blokiPo = new Map(czasy.map((c) => [`${c.uczestnikId}|${c.modul}`, c._count._all]));

  const stanModulu = (uczestnikId: string, m: KodModulu): StanModulu => {
    const klucz = `${uczestnikId}|${m}`;
    const gotowe = zamkniete.get(klucz)?.size ?? 0;
    const wszystkie = CZESCI_MODULOW[m].length;
    const postep = grupa.uczestnicy.find((u) => u.id === uczestnikId)?.postepy.find((p) => p.kod === m);
    if (gotowe >= wszystkie) return "gotowy";
    return postep?.rozpoczety ? "wtrakcie" : "pusty";
  };

  /** Czas na blok, tylko dla ukonczonych modulow ze zmierzonym czasem. */
  const naBlok = (uczestnikId: string, m: KodModulu): number | null => {
    const klucz = `${uczestnikId}|${m}`;
    const ms = czasPo.get(klucz) ?? 0;
    const bloki = blokiPo.get(klucz) ?? 0;
    if (ms <= 0 || bloki === 0) return null;
    return ms / bloki;
  };

  // Ostrzezenia liczymy per modul, bo mediana jest wlasnoscia modulu,
  // nie uczestnika. Najpierw mediana, potem najwyzej dwie najbardziej odstajace
  // osoby: ostrzezenie u polowy grupy przestaje byc ostrzezeniem.
  const oflagowani = new Set<string>();
  for (const m of MODULY_GRUPY) {
    const czasyModulu = grupa.uczestnicy
      .filter((u) => stanModulu(u.id, m) === "gotowy")
      .map((u) => ({ id: u.id, naBlok: naBlok(u.id, m) }))
      .filter((x): x is { id: string; naBlok: number } => x.naBlok !== null);
    if (czasyModulu.length < TEMPO.MIN_UKONCZEN) continue;
    const prog = mediana(czasyModulu.map((x) => x.naBlok)) * TEMPO.UDZIAL_MEDIANY;
    for (const x of czasyModulu
      .filter((x) => x.naBlok < prog)
      .sort((a, b) => a.naBlok - b.naBlok)
      .slice(0, TEMPO.MAKS_OFLAGOWANYCH)) {
      oflagowani.add(`${x.id}|${m}`);
    }
  }

  const uczestnicy: WierszGrupy[] = grupa.uczestnicy.map((u) => {
    const moduly = MODULY_GRUPY.map((m) => ({
      kod: m,
      stan: stanModulu(u.id, m),
      pobiezny: oflagowani.has(`${u.id}|${m}`),
    }));

    const brakiDanych: string[] = [];
    for (const m of moduly) {
      if (m.stan === "wtrakcie") brakiDanych.push(`${m.kod} przerwany`);
    }
    const bezCzasu = moduly.filter(
      (m) => m.stan === "gotowy" && (czasPo.get(`${u.id}|${m.kod}`) ?? 0) === 0,
    );
    if (bezCzasu.length > 0) brakiDanych.push(`bez pomiaru czasu: ${bezCzasu.map((m) => m.kod).join(", ")}`);

    return {
      kodDostepu: u.kodDostepu,
      imie: u.imie,
      moduly,
      brakiDanych,
      liczbaWet: 0,
      sesja: u.sesja?.odbyta ? "po" : "przed",
    };
  });

  // Weto to pozycja wskazana w czesci B modulu A5, nie kazda odpowiedz NIE.
  // Uczestnik odpowiada NIE wielokrotnie, a weta stawia najwyzej trzy.
  const wetaWierszy = await prisma.odpowiedz.findMany({
    where: { uczestnikId: { in: idUczestnikow }, modul: "A5", czesc: "B" },
    select: { uczestnikId: true, wartosc: true },
  });
  const weta = new Map<string, number>();
  for (const w of wetaWierszy) {
    const wartosc = JSON.parse(w.wartosc) as unknown;
    const ile = Array.isArray(wartosc) ? wartosc.length : wartosc ? 1 : 0;
    weta.set(w.uczestnikId, (weta.get(w.uczestnikId) ?? 0) + ile);
  }
  for (const [i, u] of grupa.uczestnicy.entries()) {
    uczestnicy[i].liczbaWet = weta.get(u.id) ?? 0;
  }

  return {
    id: grupa.id,
    kod: grupa.kod,
    nazwa: grupa.nazwa,
    uczestnicy,
    otwarteWarstwy: grupa.odslony.filter((o) => o.odblokowana).map((o) => o.warstwa as KodWarstwy),
  };
}

export interface KartaUczestnika {
  kodDostepu: string;
  imie: string;
  grupa: { kod: string; nazwa: string };
  pytanie: string | null;
  korekty: Array<{ id: string; typ: string; wartosc: string | null; uzasadnienie: string | null }>;
  sesja: {
    decyzja: string | null;
    coPrzekonalo: string | null;
    coSprawdzic: string | null;
    kroki: string[];
    wrocicZa: string | null;
    notatka: string | null;
    odbyta: Date | null;
  } | null;
  /** Zawody do dopisania recznie: cala baza, posortowana. */
  wszystkieZawody: Array<{ kod: string; nazwa: string }>;
  /** Piatki, rozjazdy, poziom zycia i zawody. Serce karty. */
  nowy: KartaNowegoProgramu;
}

export async function pobierzKarteUczestnika(kodDostepu: string): Promise<KartaUczestnika | null> {
  const uczestnik = await prisma.uczestnik.findUnique({
    where: { kodDostepu },
    include: { grupa: true, pytanie: true, korekty: true, sesja: true },
  });
  if (!uczestnik) return null;
  if (!(await wolnoZobaczyc(uczestnik.grupa.kod))) return null;

  const [nowy, wszystkieZawody] = await Promise.all([
    kartaNowego(uczestnik.id),
    pobierzBazeReferencyjna().then((b) =>
      b.zawody
        .map((z) => ({ kod: z.kod, nazwa: z.nazwaWyswietlana }))
        .sort((a, b2) => a.nazwa.localeCompare(b2.nazwa, "pl")),
    ),
  ]);

  return {
    kodDostepu: uczestnik.kodDostepu,
    imie: uczestnik.imie,
    grupa: { kod: uczestnik.grupa.kod, nazwa: uczestnik.grupa.nazwa },
    pytanie: uczestnik.pytanie?.tresc ?? null,
    korekty: uczestnik.korekty.map((k) => ({
      id: k.id,
      typ: k.typ,
      wartosc: k.wartosc,
      uzasadnienie: k.uzasadnienie,
    })),
    sesja: uczestnik.sesja
      ? {
          decyzja: uczestnik.sesja.decyzja,
          coPrzekonalo: uczestnik.sesja.coPrzekonalo,
          coSprawdzic: uczestnik.sesja.coSprawdzic,
          kroki: uczestnik.sesja.kroki ? (JSON.parse(uczestnik.sesja.kroki) as string[]) : [],
          wrocicZa: uczestnik.sesja.wrocicZa,
          notatka: uczestnik.sesja.notatka,
          odbyta: uczestnik.sesja.odbyta,
        }
      : null,
    wszystkieZawody,
    nowy,
  };
}

export async function listaGrup() {
  const tylkoPokaz = (await rolaSesji()) === "pokaz";
  const grupy = await prisma.grupa.findMany({
    where: tylkoPokaz ? { kod: KOD_GRUPY_POKAZ } : undefined,
    orderBy: { utworzona: "desc" },
    include: { _count: { select: { uczestnicy: true } } },
  });
  return grupy.map((g) => ({ kod: g.kod, nazwa: g.nazwa, uczestnikow: g._count.uczestnicy }));
}

export { NAZWY_MODULOW, KOLEJNOSC_MODULOW, stanDostepu };
