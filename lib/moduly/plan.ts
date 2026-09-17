/**
 * Plan modulu, utrwalany raz na uczestnika.
 *
 * W poprzedniej wersji programu losowala sie tu kolejnosc blokow i stron par.
 * Cztery obecne moduly nie maja czego losowac na tym poziomie: kolejnosc
 * banku w module leja zalezy od uczestnika i liczy ja `przetasuj` z ziarnem
 * jego identyfikatora, a panel poziomu zycia ma kolejnosc stala.
 *
 * Struktura zostaje, bo zostaje tez jej rola: `PostepModulu.kolejnosc` trzyma
 * plan i po nim rozpoznajemy, ze modul zostal rozpoczety. Pusty plan jest
 * poprawnym planem.
 */

import type { KodModulu } from "./typy";

export interface PlanModulu {
  /** Kolejnosc blokow albo par, po numerach albo identyfikatorach. */
  kolejnosc: string[];
  /** Kolejnosc opcji wewnatrz bloku: id pozycji w kolejnosci wyswietlania. */
  wewnatrz: Record<string, string[]>;
  /** Czy dla danej pary zamieniamy strony. */
  odwrocone: Record<string, boolean>;
}

export function zbudujPlan(_modul: KodModulu): PlanModulu {
  return { kolejnosc: [], wewnatrz: {}, odwrocone: {} };
}
