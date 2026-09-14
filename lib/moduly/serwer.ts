/**
 * Warstwa serwerowa modulow: wczytywanie odpowiedzi, zapis na biezaco,
 * utrwalenie losowego planu i budowanie kontekstu dla czesci zaleznych.
 */

import "server-only";
import { prisma } from "../db/klient";
import { zbudujPlan, type PlanModulu } from "./plan";
import { CZESCI_MODULOW, zbudujCzesc, type KontekstModulu } from "./ekrany";
import { policzA3, policzA4 } from "../engine/moduly";
import { PARY_A3 } from "../content/a3";
import { WYMIARY_A3, WYMIARY_M1 } from "../domain/slowniki";
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
    /** Biegun A czy B, z progiem 50. Null, gdy wymiar nie zostal wypelniony. */
    const biegun = (kod: string, a: string, b: string): string => {
      const p = pozycje[kod];
      if (p === null || p === undefined) return a;
      return p > 50 ? a : b;
    };

    const a3 = await pobierzOdpowiedzi(uczestnikId, "A3");
    const wynikA3 = a3["A"]
      ? policzA3({
          czescA: a3["A"] as Record<string, "A" | "B">,
          czescB: Object.fromEntries(
            Object.entries((a3["B"] ?? {}) as Record<string, number>).map(([k, v]) => [
              k.replace("kotwica_", ""),
              v,
            ]),
          ),
        })
      : null;
    const a3Biegun = (kod: string, a: string, b: string): string => {
      const poz = wynikA3?.pozycje[kod];
      if (poz === undefined) return a;
      return poz > 50 ? a : b;
    };

    const a5 = await pobierzOdpowiedzi(uczestnikId, "A5");
    const przeprowadzka = ((a5["A"] ?? {})["F06"] as string | undefined) ?? "moze";
    const gotowoscNaPrzeprowadzke =
      przeprowadzka === "tak"
        ? "jesteś gotów"
        : przeprowadzka === "nie"
          ? "raczej nie"
          : "nie masz jeszcze zdania";

    kontekst.m1Szkice = {
      1:
        `Chcesz ${biegun("KOR", "zapuścić korzenie w jednym miejscu", "mieć możliwość ruszenia się, kiedy będzie trzeba")}. ` +
        `Na przeprowadzkę ${gotowoscNaPrzeprowadzke}.`,
      2:
        `Najbardziej odpowiada Ci praca ${biegun("ORG", "w dużej organizacji", "na swoim albo w małym zespole")}, ` +
        `${biegun("MIE", "w jednym miejscu", "zdalnie")}, i raczej ` +
        `${a3Biegun("SAM", "samodzielnie", "z zespołem")}.`,
      3:
        `Twój dzień trwa ${biegun("GOD", "tyle, ile trzeba", "około ośmiu godzin")} i ` +
        `${biegun("GRA", "przechodzi płynnie w wieczór", "kończy się o stałej porze")}.`,
      4: "Poza pracą chcesz mieć miejsce na {…}. To jest lista, która później zawęzi drogi bardziej, niż się teraz wydaje.",
      5:
        `Pieniądze ${biegun("POZ", "są dla Ciebie ważne", "nie są najważniejsze")}, ale bardziej niż o wysokie zarobki ` +
        `chodzi Ci o ${a3Biegun("RYZ", "możliwość ryzyka i wyższy sufit", "spokój i przewidywalność")}.`,
      6: "Nie chcesz {…}. To jest granica, do której wrócimy przy każdej z trzech dróg.",
      7:
        `Za kilka lat chcesz ${biegun("TEMP", "mieć już coś za sobą", "spokojnie budować")}. ` +
        "Nie musi się sprawdzić. Ma służyć jako punkt, do którego porównasz to, co wybierzesz.",
    };

    if (wynikA3) {
      const warunki = (wynikA3.warunkiKluczowe.length > 0 ? wynikA3.warunkiKluczowe : wynikA3.preferencje)
        .slice(0, 3)
        .map((w) => w.warunek);
      if (warunki.length > 0) kontekst.a3Warunki = warunki;
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

export { PARY_A3 };
