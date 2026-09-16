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
import { zbierzOdpowiedzi } from "../moduly/zbieranie";
import { zlozWynikiModulow } from "../engine/moduly";
import { uruchomSilnik } from "../engine";
import { policzRozjazdy, type Rozjazd } from "../panel/rozjazdy";
import { otwarteModuly } from "../moduly/otwarcie";
import { stanDostepu } from "../raport/dostep";
import { OPIS_ETAPU } from "../engine/layer0-start";
import { KOD_GRUPY_POKAZ } from "../pokaz";
import { rolaSesji } from "./sesja";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, NAZWY_MODULOW, programGrupy } from "../moduly/ekrany";
import { OBSZARY_A1, KOMPETENCJE_A2, WARTOSCI_A4, WYMIARY_A3, FILTRY_A5 } from "../domain/slowniki";
import { OBSZARY_M1 } from "../content/m1";
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

export type StanModulu = "zamkniety" | "pusty" | "wtrakcie" | "gotowy";

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
  otwarteModuly: KodModulu[];
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

  const otwarte = await otwarteModuly(grupa.id);
  // Kolumny tabeli zaleza od wersji programu tej grupy. Bez tego grupa nowego
  // programu pokazuje osiem pustych kolumn starych modulow i wyglada, jakby
  // nikt niczego nie wypelnil.
  const MODULY_GRUPY = programGrupy(otwarte);
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
    if (!otwarte.has(m)) return "zamkniety";
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
    otwarteModuly: MODULY_GRUPY.filter((m) => otwarte.has(m)),
    otwarteWarstwy: grupa.odslony.filter((o) => o.odblokowana).map((o) => o.warstwa as KodWarstwy),
  };
}

export interface KartaUczestnika {
  kodDostepu: string;
  imie: string;
  grupa: { kod: string; nazwa: string };
  etap: string | null;
  wiek: string | null;
  coGoCiagnie: string[];
  wCzymMozeBycDobry: string[];
  jakDziala: string[];
  coJestWazne: string[];
  czegoNieChce: string[];
  drogi: Array<{ etykieta: string; obszar: string; poziom: string; zawody: string[] }>;
  rozjazdy: Rozjazd[];
  ostrzezenia: Array<{ zawod: string; droga: string; zdania: string[] }>;
  pytanie: string | null;
  wizja: Array<{ tytul: string; tresc: string }>;
  usunieteWetem: Array<{ nazwa: string; filtry: string[] }>;
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
}

export async function pobierzKarteUczestnika(kodDostepu: string): Promise<KartaUczestnika | null> {
  const uczestnik = await prisma.uczestnik.findUnique({
    where: { kodDostepu },
    include: { grupa: true, oceny: true, pytanie: true, korekty: true, sesja: true },
  });
  if (!uczestnik) return null;
  if (!(await wolnoZobaczyc(uczestnik.grupa.kod))) return null;

  const [odpowiedzi, baza] = await Promise.all([
    zbierzOdpowiedzi(uczestnik.id),
    pobierzBazeReferencyjna(),
  ]);

  const moduly = zlozWynikiModulow(odpowiedzi);
  const silnik = uruchomSilnik(moduly, baza);
  const oceny = Object.fromEntries(uczestnik.oceny.map((o) => [o.zawodKod, o.ocena]));
  const rozjazdy = policzRozjazdy({ silnik, moduly, baza, oceny });

  const nazwaZawodu = new Map(baza.zawody.map((z) => [z.kod, z.nazwaWyswietlana]));
  const najA1 = [...OBSZARY_A1]
    .sort((a, b) => (moduly.z[b.id] ?? 0) - (moduly.z[a.id] ?? 0))
    .slice(0, 5)
    .map((o) => o.etykieta);
  const najA2 = [...KOMPETENCJE_A2]
    .sort((a, b) => (moduly.k[b.id] ?? 0) - (moduly.k[a.id] ?? 0))
    .slice(0, 5)
    .map((k) => k.nazwa);
  const jakDziala = WYMIARY_A3.filter((w) => (moduly.a3Sila[w.kod] ?? 0) >= 65)
    .slice(0, 3)
    .map((w) => ((moduly.a3Pozycje[w.kod] ?? 50) >= 50 ? w.biegunA : w.biegunB));
  const nazwaWartosci = new Map(WARTOSCI_A4.map((w) => [w.kod, w.nazwa]));
  const nazwaFiltru = new Map(FILTRY_A5.map((f) => [f.kod, f.tekst]));

  const ostrzezenia = silnik.warstwa2.pozycje
    .flatMap((p) => p.zawody)
    .filter((z) => z.ostrzezenia.length > 0)
    .map((z) => ({
      zawod: z.nazwa,
      droga: silnik.warstwa1.drogi.find((d) => d.obszar === z.obszar)?.etykieta ?? "brak",
      zdania: z.ostrzezenia.map((o) => o.zdanie),
    }));

  const wizja: Array<{ tytul: string; tresc: string }> = [];
  for (const obszar of OBSZARY_M1) {
    const tresc = odpowiedzi.m1.czescB?.[obszar.nr];
    if (typeof tresc === "string" && tresc.trim().length > 0) {
      wizja.push({ tytul: obszar.tytul, tresc: tresc.trim() });
    } else if (Array.isArray(tresc) && tresc.length > 0) {
      wizja.push({ tytul: obszar.tytul, tresc: tresc.filter(Boolean).join(" · ") });
    }
  }

  return {
    kodDostepu: uczestnik.kodDostepu,
    imie: uczestnik.imie,
    grupa: { kod: uczestnik.grupa.kod, nazwa: uczestnik.grupa.nazwa },
    // A0 zyje w tabeli odpowiedzi, nie w tabeli PunktStartu: ta jest pusta.
    etap: moduly.punktStartu ? OPIS_ETAPU[moduly.punktStartu.etap] : null,
    wiek: null,
    coGoCiagnie: najA1,
    wCzymMozeBycDobry: najA2,
    jakDziala,
    coJestWazne: moduly.a4Top5.map((k) => nazwaWartosci.get(k) ?? k),
    czegoNieChce: moduly.weta.map((k) => nazwaFiltru.get(k) ?? k),
    drogi: silnik.warstwa1.drogi.map((d) => ({
      etykieta: d.etykieta,
      obszar: d.nazwaObszaru,
      poziom: `${d.poziom.przyklad} · ${d.poziom.czas}`,
      zawody: d.zawody.map((k) => nazwaZawodu.get(k) ?? k),
    })),
    rozjazdy,
    ostrzezenia,
    pytanie: uczestnik.pytanie?.tresc ?? null,
    wizja,
    usunieteWetem: silnik.warstwa2.usunieteWetem.map((z) => ({
      nazwa: z.nazwa,
      filtry: z.filtry.map((f) => nazwaFiltru.get(f) ?? f),
    })),
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
    wszystkieZawody: baza.zawody
      .map((z) => ({ kod: z.kod, nazwa: z.nazwaWyswietlana }))
      .sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl")),
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
