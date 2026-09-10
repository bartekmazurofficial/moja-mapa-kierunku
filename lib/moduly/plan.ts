/**
 * Losowy plan modulu, utrwalany raz na uczestnika.
 *
 * Kolejnosc blokow i stron par jest losowana, ale ZAPISYWANA. Gdyby losowala
 * sie przy kazdym wejsciu, uczestnik ktory przerwie modul i wroci dostalby
 * inna kolejnosc, a plany blokow sa skonstruowane tak, zeby pokrycie par
 * bylo rownomierne. Rozsypanie kolejnosci rozsypuje pokrycie i psuje dane
 * wejsciowe silnika. To jest warunek poprawnosci pomiaru, nie wygoda.
 */

import { BLOKI_A1 } from "../content/a1";
import { BLOKI_A2 } from "../content/a2";
import { PARY_A3 } from "../content/a3";
import { PARY_A4 } from "../content/a4";
import { PARY_M1 } from "../content/m1";
import type { KodModulu } from "./typy";

export interface PlanModulu {
  /** Kolejnosc blokow albo par, po numerach albo identyfikatorach. */
  kolejnosc: string[];
  /** Kolejnosc opcji wewnatrz bloku: id pozycji w kolejnosci wyswietlania. */
  wewnatrz: Record<string, string[]>;
  /** Czy dla danej pary zamieniamy strony. */
  odwrocone: Record<string, boolean>;
}

function mieszaj<T>(tablica: T[], losowa: () => number): T[] {
  const kopia = [...tablica];
  for (let i = kopia.length - 1; i > 0; i--) {
    const j = Math.floor(losowa() * (i + 1));
    [kopia[i], kopia[j]] = [kopia[j], kopia[i]];
  }
  return kopia;
}

export function zbudujPlan(modul: KodModulu, losowa: () => number = Math.random): PlanModulu {
  const plan: PlanModulu = { kolejnosc: [], wewnatrz: {}, odwrocone: {} };

  switch (modul) {
    case "A1": {
      plan.kolejnosc = mieszaj(BLOKI_A1.map((b) => String(b.index)), losowa);
      for (const b of BLOKI_A1) {
        plan.wewnatrz[String(b.index)] = mieszaj(b.pozycje.map((p) => p.id), losowa);
      }
      break;
    }
    case "A2": {
      plan.kolejnosc = mieszaj(BLOKI_A2.map((b) => String(b.index)), losowa);
      for (const b of BLOKI_A2) {
        plan.wewnatrz[String(b.index)] = mieszaj(b.pozycje.map((p) => p.id), losowa);
      }
      break;
    }
    case "A3": {
      plan.kolejnosc = mieszaj(PARY_A3.map((p) => p.id), losowa);
      for (const p of PARY_A3) plan.odwrocone[p.id] = losowa() < 0.5;
      break;
    }
    case "A4": {
      plan.kolejnosc = mieszaj(PARY_A4.map((p) => String(p.nr)), losowa);
      for (const p of PARY_A4) plan.odwrocone[String(p.nr)] = losowa() < 0.5;
      break;
    }
    case "M1": {
      plan.kolejnosc = mieszaj(PARY_M1.map((p) => p.id), losowa);
      for (const p of PARY_M1) plan.odwrocone[p.id] = losowa() < 0.5;
      break;
    }
    default:
      // A0 i A5 maja stala kolejnosc: A0 to metryczka, A5 jest pogrupowany
      // tematycznie i mieszanie utrudnialoby odpowiadanie.
      break;
  }

  return plan;
}
