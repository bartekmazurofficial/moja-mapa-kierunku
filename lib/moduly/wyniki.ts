/**
 * Plansza wyników modułu: co uczestnik odpowiedział, w podziale na kategorie.
 *
 * To nie jest raport. Raport mówi, co z tego wynika dla zawodów, i otwiera się
 * warstwami. Tu chodzi o coś prostszego i dostępnego od razu: uczestnik widzi
 * własne odpowiedzi uporządkowane w kategorie, po kilka w rzędzie, i może
 * wrócić do modułu, żeby coś zmienić.
 *
 * Żadnych liczb dopasowania: tylko to, co sam wybrał.
 */

import "server-only";
import { prisma } from "../db/klient";
import { MARKER_ZAKONCZENIA, type KodModulu } from "./typy";
import { bankModulu, nazwaPozycji, type ModulLeja } from "./ekrany-nowe";
import { policzLej, type OdpowiedziLeja } from "./lej";
import { policzBudzet } from "../engine/budzet";
import { zl } from "../ui/kwota";
import { INSTRUKCJA_POZIOMU_ZYCIA } from "../content/poziom-zycia";

export interface KafelWyniku {
  klucz: string;
  ikona?: string;
  tytul: string;
  /** Krótka odpowiedź: biegun, poziom, wybór. Nigdy liczba dopasowania. */
  odpowiedz: string;
  /** Dopisek, gdy sama odpowiedź nie wystarcza. */
  podpis?: string;
  /** Wyróżnienie: to, co u uczestnika wyszło najmocniej. */
  mocne?: boolean;
}

export interface SekcjaWynikow {
  tytul: string;
  wstep?: string;
  kafle: KafelWyniku[];
}

export interface PlanszaWynikow {
  modul: KodModulu;
  gotowy: boolean;
  sekcje: SekcjaWynikow[];
}

/**
 * Plansza modulu leja: piatka w kolejnosci i to, co odpadlo po drodze.
 *
 * Odpadniete pokazujemy celowo. Uczestnik, ktory widzi wylacznie piatke, nie
 * ma jak sprawdzic, czy odsial to, co chcial: caly modul polega na tym, ze
 * z dwunastu rzeczy zostawil piec, wiec te siedem tez jest jego odpowiedzia.
 */
async function planszaLeja(uczestnikId: string, modul: ModulLeja): Promise<PlanszaWynikow> {
  const wiersze = await prisma.odpowiedz.findMany({ where: { uczestnikId, modul } });
  const pole = (czesc: string, pozycja: string): number[] => {
    const w = wiersze.find((x) => x.czesc === czesc && x.pozycja === pozycja);
    if (!w) return [];
    const v = JSON.parse(w.wartosc) as unknown;
    return Array.isArray(v) ? (v as unknown[]).filter((x): x is number => typeof x === "number") : [];
  };
  const odpowiedzi: OdpowiedziLeja = {
    etap1: pole("A", "etap1"),
    etap2: pole("B", "etap2"),
    etap3: pole("C", "etap3"),
    kolejnosc: pole("D", "kolejnosc"),
  };
  const w = policzLej(odpowiedzi, bankModulu(modul));
  const odpadle = odpowiedzi.etap1.filter((id) => !odpowiedzi.etap3.includes(id));

  return {
    modul,
    gotowy: w.top5.length > 0,
    sekcje: [
      {
        tytul: "Twoja piątka, w Twojej kolejności",
        wstep:
          "To zostało po trzech pytaniach, z których każde było trudniejsze od poprzedniego. Kolejność ustawiłeś sam.",
        kafle: w.top5.map((p) => ({
          klucz: `${modul}-${p.id}`,
          tytul: `${p.miejsce}. ${nazwaPozycji(modul, p.id)}`,
          odpowiedz: p.miejsce === 1 ? "najwyżej" : "w piątce",
          mocne: true,
        })),
      },
      {
        tytul: "To odpadło po drodze",
        wstep:
          "Zaznaczyłeś je na początku i sam je odsiałeś. To też jest odpowiedź: pokazuje, co przy wyborze okazało się mniej ważne.",
        kafle: odpadle.map((id) => ({
          klucz: `${modul}-out-${id}`,
          tytul: nazwaPozycji(modul, id),
          odpowiedz: odpowiedzi.etap2.includes(id) ? "doszło do drugiego kroku" : "odpadło w pierwszym kroku",
        })),
      },
    ].filter((sekcja) => sekcja.kafle.length > 0),
  };
}

/** Plansza modulu poziomu zycia: trzy kwoty i co je podnosi. */
async function planszaPoziomu(uczestnikId: string): Promise<PlanszaWynikow> {
  const wiersze = await prisma.odpowiedz.findMany({ where: { uczestnikId, modul: "F" } });
  const wejscie = Object.fromEntries(
    wiersze
      .filter((x) => x.czesc === "A" && x.pozycja !== MARKER_ZAKONCZENIA)
      .map((x) => [x.pozycja, JSON.parse(x.wartosc) as string])
      .filter((para): para is [string, string] => typeof para[1] === "string"),
  );
  const panelWiersz = wiersze.find((x) => x.czesc === "B" && x.pozycja === "panel");
  const panel = panelWiersz
    ? (JSON.parse(panelWiersz.wartosc) as { decyzje?: Record<string, string>; opcjonalne?: Record<string, number> })
    : {};
  const b = policzBudzet({
    wejscie,
    decyzje: panel.decyzje ?? {},
    opcjonalne: panel.opcjonalne ?? {},
  });
  const t = INSTRUKCJA_POZIOMU_ZYCIA.wynik;

  return {
    modul: "F",
    gotowy: wiersze.length > 0,
    sekcje: [
      {
        tytul: "Trzy poziomy, nie jedna kwota",
        wstep: "Jedna liczba kłamie w obie strony. Te trzy mówią, między czym a czym się poruszasz.",
        kafle: [
          { klucz: "min", tytul: t.minimum.nazwa, odpowiedz: zl(b.minimum), podpis: t.minimum.opis },
          { klucz: "kom", tytul: t.komfort.nazwa, odpowiedz: zl(b.komfort), podpis: t.komfort.opis, mocne: true },
          { klucz: "cel", tytul: t.cel.nazwa, odpowiedz: zl(b.cel), podpis: t.cel.opis },
        ],
      },
      {
        tytul: "Co najbardziej podnosi Twój koszt życia",
        wstep: INSTRUKCJA_POZIOMU_ZYCIA.rankingWstep,
        kafle: b.skladniki.slice(0, 8).map((s, i) => ({
          klucz: `koszt-${s.kod}`,
          tytul: s.nazwa,
          odpowiedz: zl(s.kwota),
          podpis: `${s.udzial}% Twojego kosztu`,
          mocne: i === 0,
        })),
      },
    ],
  };
}

export async function planszaWynikow(
  uczestnikId: string,
  modul: KodModulu,
): Promise<PlanszaWynikow> {
  if (modul === "F") return planszaPoziomu(uczestnikId);
  return planszaLeja(uczestnikId, modul);
}
