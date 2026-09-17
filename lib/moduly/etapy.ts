/**
 * JEDEN ASSESSMENT, CZTERY ETAPY.
 *
 * Uczestnik nie wybiera modulu z listy: wchodzi w jedna rzecz i idzie przez
 * nia do konca. Cztery etapy sa w srodku, jeden po drugim, a miedzy nimi nie
 * ma powrotu do spisu tresci.
 *
 * W bazie kazdy etap zostaje osobnym `modul`em i to nie jest niekonsekwencja,
 * tylko granica miedzy tym, co widzi czlowiek, a tym, jak lezy zapis.
 * Etapy zapisuja sie niezaleznie, dzieki czemu przerwany assessment wraca
 * dokladnie tam, gdzie zostal przerwany, a wypelnienie jednego etapu od nowa
 * nie kasuje pozostalych trzech.
 *
 * Kolejnosc etapow jest czescia metody, nie porzadkiem na liscie:
 *
 *   1. ciekawosc — najlatwiejszy wstep, nic nie kosztuje,
 *   2. co lubie robic — czynnosci, bez pytania o umiejetnosc,
 *   3. w czym jestem dobry — te same czynnosci, inne pytanie i inna kolejnosc,
 *   4. poziom zycia — dopiero na koncu, bo pytanie o pieniadze zadane
 *      wczesniej przestawia wszystkie poprzednie odpowiedzi pod zarobki.
 *
 * Etap trzeci po drugim, nigdy odwrotnie: kto najpierw powie, w czym jest
 * dobry, ten potem „lubi" dokladnie to samo.
 */

import { CZESCI_MODULOW, KOLEJNOSC_MODULOW } from "./ekrany";
import { MARKER_ZAKONCZENIA, type KodModulu } from "./typy";

/** Ile etapow ma assessment. */
export const LICZBA_ETAPOW = KOLEJNOSC_MODULOW.length;

/** Numer etapu, liczony od jedynki. Do paska „etap 2 z 4". */
export function numerEtapu(modul: KodModulu): number {
  return KOLEJNOSC_MODULOW.indexOf(modul) + 1;
}

/** Etap nastepny po tym, albo null, gdy to byl ostatni. */
export function nastepnyEtap(modul: KodModulu): KodModulu | null {
  return KOLEJNOSC_MODULOW[numerEtapu(modul)] ?? null;
}

export interface StanEtapu {
  kod: KodModulu;
  nazwa: string;
  numer: number;
  /** Ile czesci etapu uczestnik domknal. */
  domkniete: number;
  wszystkich: number;
  stan: "gotowy" | "wtrakcie" | "przed";
}

export interface StanAssessmentu {
  etapy: StanEtapu[];
  /** Etap, w ktorym uczestnik jest albo od ktorego zacznie. Null, gdy koniec. */
  biezacy: KodModulu | null;
  ukonczonych: number;
  /** Czy caly assessment jest za nim. */
  gotowy: boolean;
  /** Czy zaczal cokolwiek. Rozroznia „zacznij" od „wroc do assessmentu". */
  rozpoczety: boolean;
}

/**
 * Stan calego assessmentu z jednego zapytania o markery domkniecia.
 *
 * `zakonczoneCzesci` to mapa `kod etapu -> zbior domknietych czesci`, czyli
 * dokladnie to, co oddaje `pobierzPostepModulow`.
 */
export function stanAssessmentu(
  zakonczoneCzesci: Map<string, Set<string>>,
  odpowiedziWEtapie: Map<string, number> = new Map(),
): StanAssessmentu {
  const etapy: StanEtapu[] = KOLEJNOSC_MODULOW.map((kod) => {
    const domkniete = zakonczoneCzesci.get(kod)?.size ?? 0;
    const wszystkich = CZESCI_MODULOW[kod].length;
    // Zaczety to takze etap przerwany w polowie pierwszej czesci: liczy sie
    // pierwsza zapisana odpowiedz, nie domkniecie calej czesci.
    const cokolwiek = domkniete > 0 || (odpowiedziWEtapie.get(kod) ?? 0) > 0;
    return {
      kod,
      nazwa: NAZWY[kod],
      numer: numerEtapu(kod),
      domkniete,
      wszystkich,
      stan: domkniete >= wszystkich ? "gotowy" : cokolwiek ? "wtrakcie" : "przed",
    };
  });

  const biezacy = etapy.find((e) => e.stan !== "gotowy")?.kod ?? null;
  const ukonczonych = etapy.filter((e) => e.stan === "gotowy").length;

  return {
    etapy,
    biezacy,
    ukonczonych,
    gotowy: biezacy === null,
    rozpoczety: etapy.some((e) => e.stan !== "przed"),
  };
}

/** Nazwy etapow. Trzymane tu, bo `NAZWY_MODULOW` mowi o zapisie, nie o ekranie. */
const NAZWY: Record<KodModulu, string> = {
  Z: "Co mnie ciekawi",
  L: "Co lubię robić",
  U: "W czym jestem dobry",
  F: "Poziom życia i dochodu",
};

export { NAZWY as NAZWY_ETAPOW };

/** Marker domkniecia czesci. Reeksport, zeby nie ciagnac dwoch importow. */
export { MARKER_ZAKONCZENIA };
