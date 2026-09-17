/**
 * Warstwa serwerowa modulow: wczytywanie odpowiedzi, zapis na biezaco,
 * utrwalenie losowego planu i budowanie kontekstu dla czesci zaleznych.
 */

import "server-only";
import { prisma } from "../db/klient";
import { zbudujPlan, type PlanModulu } from "./plan";
import { CZESCI_MODULOW, zbudujCzesc, type KontekstModulu } from "./ekrany";
import { MARKER_ZAKONCZENIA, type CzescModulu, type KodModulu } from "./typy";

export { MARKER_ZAKONCZENIA };

export type ZapisaneOdpowiedzi = Record<string, Record<string, unknown>>;

export async function pobierzUczestnika(kodDostepu: string) {
  return prisma.uczestnik.findUnique({
    where: { kodDostepu },
    include: { grupa: true, postepy: true },
  });
}

export async function pobierzOdpowiedzi(
  uczestnikId: string,
  modul: KodModulu,
): Promise<ZapisaneOdpowiedzi> {
  const wiersze = await prisma.odpowiedz.findMany({ where: { uczestnikId, modul } });
  const wynik: ZapisaneOdpowiedzi = {};
  for (const w of wiersze) {
    wynik[w.czesc] ??= {};
    wynik[w.czesc][w.pozycja] = JSON.parse(w.wartosc) as unknown;
  }
  return wynik;
}

/** Plan losowany raz i utrwalany. Przy powrocie do modulu kolejnosc jest ta sama. */
export async function pobierzPlan(uczestnikId: string, modul: KodModulu): Promise<PlanModulu> {
  const postep = await prisma.postepModulu.findUnique({
    where: { uczestnikId_kod: { uczestnikId, kod: modul } },
  });
  if (postep?.kolejnosc) return JSON.parse(postep.kolejnosc) as PlanModulu;

  const plan = zbudujPlan(modul);
  await prisma.postepModulu.upsert({
    where: { uczestnikId_kod: { uczestnikId, kod: modul } },
    create: {
      uczestnikId,
      kod: modul,
      rozpoczety: new Date(),
      kolejnosc: JSON.stringify(plan),
    },
    update: { kolejnosc: JSON.stringify(plan), rozpoczety: postep?.rozpoczety ?? new Date() },
  });
  return plan;
}

export function aktualnaCzesc(modul: KodModulu, zapisane: ZapisaneOdpowiedzi): string | null {
  for (const czesc of CZESCI_MODULOW[modul]) {
    if (!zapisane[czesc]?.[MARKER_ZAKONCZENIA]) return czesc;
  }
  return null;
}

/**
 * Kontekst dla czesci, ktorych tresc zalezy od wyniku czesci wczesniejszej.
 * To jedyne miejsce, gdzie modul patrzy na wlasny wczesniejszy wynik.
 */
export async function zbudujKontekst(
  uczestnikId: string,
  modul: KodModulu,
  czesc: string,
  zapisane: ZapisaneOdpowiedzi,
): Promise<KontekstModulu> {
  const kontekst: KontekstModulu = {};

  /**
   * Lej: kazdy etap dostaje to, co przeszlo poprzedni.
   *
   * Ziarno tasowania to identyfikator uczestnika, nie losowa liczba: ta sama
   * osoba przy powrocie widzi te sama kolejnosc banku. Bez tego lista
   * przestawialaby sie pod palcami przy kazdym wejsciu.
   */
  if (modul === "Z" || modul === "L" || modul === "U") {
    kontekst.ziarno = uczestnikId;
    const zEtapu = (czesc: string, pole: string): number[] => {
      const w = (zapisane[czesc] ?? {})[pole];
      return Array.isArray(w) ? (w as number[]) : [];
    };
    if (czesc === "B") kontekst.lejDostepne = zEtapu("A", "etap1");
    if (czesc === "C") kontekst.lejDostepne = zEtapu("B", "etap2");
    if (czesc === "D") kontekst.lejDostepne = zEtapu("C", "etap3");
  }

  /**
   * Panel poziomu zycia liczy sume w trakcie wypelniania, wiec musi znac
   * odpowiedzi wstepne z czesci A. Sa juz w bazie: czesc A jest domknieta,
   * zanim czesc B w ogole powstanie.
   */
  if (modul === "F" && czesc === "B") {
    const czescA = (zapisane["A"] ?? {}) as Record<string, unknown>;
    kontekst.budzetWejscie = Object.fromEntries(
      Object.entries(czescA)
        .filter(([kod, v]) => kod !== MARKER_ZAKONCZENIA && typeof v === "string")
        .map(([kod, v]) => [kod, v as string]),
    );
  }

  return kontekst;
}

export interface StanModulu {
  modul: KodModulu;
  czesc: string | null;
  definicja: CzescModulu | null;
  zapisane: Record<string, unknown>;
  wszystkieCzesci: string[];
  zakonczoneCzesci: string[];
  /** Ile odpowiedzi uczestnik zapisal w calym module, bez markerow zakonczenia. */
  liczbaOdpowiedzi: number;
}

export async function pobierzStanModulu(uczestnikId: string, modul: KodModulu): Promise<StanModulu> {
  const zapisane = await pobierzOdpowiedzi(uczestnikId, modul);
  const czesc = aktualnaCzesc(modul, zapisane);
  const zakonczone = CZESCI_MODULOW[modul].filter((c) => zapisane[c]?.[MARKER_ZAKONCZENIA]);
  const liczbaOdpowiedzi = Object.values(zapisane).reduce(
    (suma, wCzesci) => suma + Object.keys(wCzesci).filter((k) => k !== MARKER_ZAKONCZENIA).length,
    0,
  );

  if (czesc === null) {
    return {
      modul,
      czesc: null,
      definicja: null,
      zapisane: {},
      wszystkieCzesci: CZESCI_MODULOW[modul],
      zakonczoneCzesci: zakonczone,
      liczbaOdpowiedzi,
    };
  }

  const plan = await pobierzPlan(uczestnikId, modul);
  const kontekst = await zbudujKontekst(uczestnikId, modul, czesc, zapisane);
  const definicja = zbudujCzesc(modul, czesc, plan, kontekst);

  return {
    modul,
    czesc,
    definicja,
    zapisane: zapisane[czesc] ?? {},
    wszystkieCzesci: CZESCI_MODULOW[modul],
    zakonczoneCzesci: zakonczone,
    liczbaOdpowiedzi,
  };
}

/** Postep wszystkich modulow uczestnika, na ekran startowy i do panelu. */
export async function pobierzPostepModulow(uczestnikId: string) {
  const wiersze = await prisma.odpowiedz.groupBy({
    by: ["modul", "czesc"],
    where: { uczestnikId },
    _count: { _all: true },
  });
  const markery = await prisma.odpowiedz.findMany({
    where: { uczestnikId, pozycja: MARKER_ZAKONCZENIA },
    select: { modul: true, czesc: true },
  });
  const zakonczone = new Map<string, Set<string>>();
  for (const m of markery) {
    if (!zakonczone.has(m.modul)) zakonczone.set(m.modul, new Set());
    zakonczone.get(m.modul)!.add(m.czesc);
  }
  const odpowiedziWModule = new Map<string, number>();
  for (const w of wiersze) {
    odpowiedziWModule.set(w.modul, (odpowiedziWModule.get(w.modul) ?? 0) + w._count._all);
  }
  return { zakonczone, odpowiedziWModule };
}

