/**
 * Budowanie ekranow modulu.
 *
 * Program ma cztery moduly. Trzy pierwsze (`Z` ciekawosc, `L` co lubie robic,
 * `U` w czym jestem dobry) chodza na tej samej mechanice leja i roznia sie
 * wylacznie bankiem pozycji oraz trescia trzech pytan; czwarty (`F`) to panel
 * poziomu zycia. Cala tresc ekranow stoi w `ekrany-nowe.ts`, tutaj zostaje
 * tylko to, czego potrzebuje reszta aplikacji: nazwy, kolejnosc, czesci
 * i miary.
 *
 * Czesci zalezne od wyniku czesci wczesniejszej (kazdy kolejny etap leja,
 * panel budzetu) sa budowane na serwerze, kiedy uczestnik do nich dojdzie.
 * Inaczej nie da sie ich ulozyc: etap drugi pokazuje wylacznie to, co
 * przeszlo pierwszy.
 */

import {
  bankModulu,
  czescEtapu,
  czescPoziomuA,
  czescPoziomuB,
  czescUkladania,
  CZESCI_NOWE,
  type ModulLeja,
} from "./ekrany-nowe";
import { zbudujPlan, type PlanModulu } from "./plan";
import { minutyZPozycji, zakresPozycji } from "./miara";
import type { CzescModulu, KodModulu } from "./typy";

/** Wynik czesci wczesniejszych, potrzebny do zbudowania czesci zaleznych. */
export interface KontekstModulu {
  /**
   * Lej: pozycje, ktore przeszly poprzedni etap. Na etapie pierwszym pusta.
   * Bez tego etap drugi pokazywalby caly bank i lej przestalby byc lejem.
   */
  lejDostepne?: number[];
  /**
   * Ziarno tasowania banku: identyfikator uczestnika.
   *
   * Ta sama osoba przy powrocie do modulu widzi te sama kolejnosc, a dwie
   * rozne osoby widza inna. W module `U` to jedyna rzecz, ktora nie pozwala
   * mechanicznie powtorzyc wyborow z modulu `L`.
   */
  ziarno?: string;
  /** F: odpowiedzi wstepne, potrzebne panelowi do liczenia sumy. */
  budzetWejscie?: Record<string, string>;
}

export const NAZWY_MODULOW: Record<KodModulu, string> = {
  Z: "Co mnie ciekawi",
  L: "Co lubię robić",
  U: "W czym jestem dobry",
  F: "Poziom życia i dochodu",
};

/**
 * Kolejnosc modulow.
 *
 * Ciekawosc, potem oba tory czynnosci, na koncu poziom zycia. Poziom zycia
 * musi isc ostatni: propozycja zawodow porownuje widelki z kwota, ktora z
 * niego wychodzi, a zapytanie o pieniadze na poczatku przestawia wszystkie
 * wczesniejsze odpowiedzi pod zarobki.
 *
 * Modul `U` po `L`, nigdy odwrotnie: kto najpierw powie, w czym jest dobry,
 * ten potem „lubi" dokladnie to samo.
 */
export const KOLEJNOSC_MODULOW: KodModulu[] = ["Z", "L", "U", "F"];

/**
 * Ile pozycji ma caly modul. Do paska postepu na liscie modulow.
 *
 * Liczba nie zalezy od wylosowanego planu, wiec budujemy czesci raz, z planem
 * domyslnym. Sygnalem „skonczone" jest i tak marker domkniecia czesci, a nie
 * ten ulamek.
 */
const POZYCJI_W_MODULE = new Map<KodModulu, number>();

export function liczbaPozycjiModulu(modul: KodModulu): number {
  const zapamietane = POZYCJI_W_MODULE.get(modul);
  if (zapamietane !== undefined) return zapamietane;
  const plan = zbudujPlan(modul);
  let ile = 0;
  for (const czesc of CZESCI_MODULOW[modul]) {
    for (const ekran of zbudujCzesc(modul, czesc, plan, {}).ekrany) {
      ile += (ekran.pozycje ?? []).length;
    }
  }
  POZYCJI_W_MODULE.set(modul, ile);
  return ile;
}

/** Ile mniej wiecej zajmie caly modul, w minutach. Do listy modulow. */
export function minutyModulu(modul: KodModulu): number {
  return minutyZPozycji(zakresPozycjiModulu(modul).max, modul);
}

/**
 * Ile pytan zobaczy jeden uczestnik: od najkrotszej sciezki do najdluzszej.
 *
 * `liczbaPozycjiModulu` sumuje wszystko, co stoi w definicji, i do paska
 * postepu to wystarcza. Liczbe obiecana uczestnikowi trzeba wziac z jego
 * sciezki, a to liczy `zakresPozycji` z lib/moduly/miara.ts.
 */
export function zakresPozycjiModulu(modul: KodModulu): { min: number; max: number } {
  const zapamietane = ZAKRES_W_MODULE.get(modul);
  if (zapamietane) return zapamietane;
  const plan = zbudujPlan(modul);
  const zakres = zakresPozycji(
    CZESCI_MODULOW[modul].flatMap((czesc) => zbudujCzesc(modul, czesc, plan, {}).ekrany),
  );
  ZAKRES_W_MODULE.set(modul, zakres);
  return zakres;
}

const ZAKRES_W_MODULE = new Map<KodModulu, { min: number; max: number }>();

/** Wszystkie czesci modulu, w kolejnosci. */
export const CZESCI_MODULOW: Record<KodModulu, string[]> = {
  Z: CZESCI_NOWE.Z,
  L: CZESCI_NOWE.L,
  U: CZESCI_NOWE.U,
  F: CZESCI_NOWE.F,
};

export function zbudujCzesc(
  modul: KodModulu,
  czesc: string,
  _plan: PlanModulu,
  kontekst: KontekstModulu,
): CzescModulu {
  if (modul === "Z" || modul === "L" || modul === "U") {
    const m = modul as ModulLeja;
    // Bez kontekstu (liczenie miar przy starcie) bierzemy caly bank: chodzi
    // wtedy o liczbe pozycji, a nie o to, co uczestnik zaznaczyl.
    const dostepne = kontekst.lejDostepne ?? bankModulu(m);
    if (czesc === "A") return czescEtapu(m, 1, bankModulu(m), kontekst.ziarno ?? m);
    if (czesc === "B") return czescEtapu(m, 2, dostepne, kontekst.ziarno ?? m);
    if (czesc === "C") return czescEtapu(m, 3, dostepne, kontekst.ziarno ?? m);
    if (czesc === "D") return czescUkladania(m, dostepne);
  }
  if (modul === "F") {
    if (czesc === "A") return czescPoziomuA();
    if (czesc === "B") return czescPoziomuB(kontekst.budzetWejscie ?? {});
  }
  throw new Error(`nieznana część modułu: ${modul}${czesc}`);
}
