/**
 * Warstwa serwerowa modulow: wczytywanie odpowiedzi, zapis na biezaco,
 * utrwalenie losowego planu i budowanie kontekstu dla czesci zaleznych.
 */

import "server-only";
import { prisma } from "../db/klient";
import { zbudujPlan, type PlanModulu } from "./plan";
import { CZESCI_MODULOW, etykietaM1, zbudujCzesc, type KontekstModulu } from "./ekrany";
import { policzA3, policzA4 } from "../engine/moduly";
import { PARY_A3 } from "../content/a3";
import { WYMIARY_A3, WYMIARY_M1 } from "../domain/slowniki";
import { MARKER_ZAKONCZENIA, type CzescModulu, type KodModulu } from "./typy";

export { MARKER_ZAKONCZENIA };

export type ZapisaneOdpowiedzi = Record<string, Record<string, unknown>>;

export async function pobierzUczestnika(kodDostepu: string) {
  return prisma.uczestnik.findUnique({
    where: { kodDostepu },
    include: { grupa: true, postepy: true, punktStartu: true },
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

  if (modul === "A3" && czesc === "B") {
    const czescA = (zapisane["A"] ?? {}) as Record<string, "A" | "B">;
    const wynik = policzA3({ czescA, czescB: {} });
    kontekst.a3Bieguny = Object.fromEntries(
      WYMIARY_A3.map((w) => [w.kod, wynik.pozycje[w.kod] > 50 ? "A" : "B"] as const),
    );
  }

  if (modul === "A4" && czesc === "C") {
    const czescA = Object.fromEntries(
      Object.entries((zapisane["A"] ?? {}) as Record<string, string>).map(([k, v]) => [
        Number(k.replace("para_", "")),
        v,
      ]),
    );
    const czescB = ((zapisane["B"] ?? {})["nieodzowne"] as string[] | undefined) ?? [];
    const wynik = policzA4({ czescA, czescB, czescC: [] });
    kontekst.a4Najwyzsza = wynik.top5[0];
  }

  if (modul === "A5" && czesc === "B") {
    const czescA = (zapisane["A"] ?? {}) as Record<string, string>;
    kontekst.a5Odmowy = Object.entries(czescA)
      .filter(([kod, v]) => kod !== MARKER_ZAKONCZENIA && v === "nie")
      .map(([kod]) => kod);
  }

  if (modul === "M1" && czesc === "B") {
    const czescA = (zapisane["A"] ?? {}) as Record<string, "A" | "B">;
    const pozycje: Record<string, number | null> = {};
    for (const w of WYMIARY_M1) {
      const pary = Object.entries(czescA).filter(([id]) => id.startsWith(`${w.kod}_`));
      pozycje[w.kod] = pary.length
        ? (pary.filter(([, v]) => v === "A").length / pary.length) * 100
        : null;
    }
    const e = (kod: string) => etykietaM1(kod, pozycje[kod]);
    kontekst.m1Szkice = {
      1: `Wygląda na to, że chcesz: ${e("KOR")}.`,
      2: `Widzisz siebie tak: ${e("ORG")}, ${e("MIE")}. ${e("LUD")}.`,
      3: `Chcesz pracować tak: ${e("GOD")}. Granica między pracą a resztą: ${e("GRA")}.`,
      5: `Poziom życia: ${e("POZ")}. Wejście na rynek: ${e("INW")}.`,
      7: `Za kilka lat: ${e("TEMP")}. Praca ma być: ${e("CEN")}. ${e("ROD")}.`,
    };

    const a3 = await pobierzOdpowiedzi(uczestnikId, "A3");
    if (a3["A"]) {
      const wynik = policzA3({
        czescA: a3["A"] as Record<string, "A" | "B">,
        czescB: Object.fromEntries(
          Object.entries((a3["B"] ?? {}) as Record<string, number>).map(([k, v]) => [
            k.replace("kotwica_", ""),
            v,
          ]),
        ),
      });
      const warunki = (wynik.warunkiKluczowe.length > 0 ? wynik.warunkiKluczowe : wynik.preferencje)
        .slice(0, 3)
        .map((w) => w.warunek);
      if (warunki.length > 0) {
        kontekst.a3Warunki = warunki;
        kontekst.m1Szkice[2] += ` W poprzednim ćwiczeniu wyszło Ci, że najlepiej działasz przy: ${warunki.join(", ")}.`;
      }
    }
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
}

export async function pobierzStanModulu(uczestnikId: string, modul: KodModulu): Promise<StanModulu> {
  const zapisane = await pobierzOdpowiedzi(uczestnikId, modul);
  const czesc = aktualnaCzesc(modul, zapisane);
  const zakonczone = CZESCI_MODULOW[modul].filter((c) => zapisane[c]?.[MARKER_ZAKONCZENIA]);

  if (czesc === null) {
    return {
      modul,
      czesc: null,
      definicja: null,
      zapisane: {},
      wszystkieCzesci: CZESCI_MODULOW[modul],
      zakonczoneCzesci: zakonczone,
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

export { PARY_A3 };
