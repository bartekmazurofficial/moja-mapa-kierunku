/**
 * Ile dotknięć i ile czasu kosztuje wypełnienie każdego modułu.
 *
 * Recenzent oszacował A1 na „około 50 minut" i na tej podstawie zaproponował
 * zmianę mechaniki. Szacunek to za mało, żeby ruszać pomiar, więc liczymy:
 * ile ekranów, ile decyzji, ile dotknięć. Czas wychodzi z dotknięć razy
 * ostrożny czas na decyzję, osobno dla decyzji odruchowej i porównawczej.
 *
 * Uzycie: npx tsx scripts/koszt-wypelnienia.ts
 */

import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, NAZWY_MODULOW, zbudujCzesc } from "../lib/moduly/ekrany";
import { zbudujPlan } from "../lib/moduly/plan";
import type { KodModulu, Pozycja } from "../lib/moduly/typy";

/**
 * Ile dotknięć wymaga pozycja, żeby ekran uznał ją za kompletną.
 * Liczymy minimum: uczestnik, który wie, czego chce, i nie poprawia.
 */
function dotkniecia(p: Pozycja): number {
  switch (p.typ) {
    case "ranking4":
      return p.opcje?.length ?? 4;
    case "para":
      return 1;
    case "trzystopniowa":
      return 1;
    case "skala5":
      return 1;
    case "kotwica":
      return 1;
    case "pojedynczy":
      return 1;
    case "wielokrotny":
      return p.dokladnie ?? p.minWyborow ?? 1;
    case "dowody":
      return 0;
    case "tekst":
    case "kilka_tekstow":
      return 0;
    default:
      return 1;
  }
}

/** Sekundy na jedno dotknięcie. Ranking wymaga porównywania, para nie. */
const SEKUND: Record<string, number> = {
  ranking4: 4.5,
  maxdiff: 4.0,
  para: 3.5,
  trzystopniowa: 3.0,
  skala5: 2.5,
  kotwica: 2.5,
  pojedynczy: 3.5,
  wielokrotny: 3.0,
  dowody: 6.0,
  tekst: 90,
  kilka_tekstow: 120,
};

function main() {
  console.log("moduł                        ekranów  decyzji  dotknięć   minut");
  console.log("-".repeat(68));
  let sumaMinut = 0;

  for (const m of KOLEJNOSC_MODULOW) {
    const plan = zbudujPlan(m as KodModulu);
    let ekranow = 0;
    let decyzji = 0;
    let dotkniec = 0;
    let sekund = 0;

    for (const c of CZESCI_MODULOW[m as KodModulu]) {
      for (const e of zbudujCzesc(m as KodModulu, c, plan, {}).ekrany) {
        ekranow += 1;
        // Przejście dalej to też dotknięcie, na każdym ekranie.
        dotkniec += 1;
        sekund += 1.5;
        for (const p of e.pozycje ?? []) {
          const d = dotkniecia(p);
          decyzji += p.typ === "ranking4" ? 3 : d > 0 ? 1 : 0;
          dotkniec += d;
          sekund += d * (SEKUND[p.typ] ?? 3) || SEKUND[p.typ] || 0;
          if (p.typ === "tekst" || p.typ === "kilka_tekstow") sekund += SEKUND[p.typ];
        }
      }
    }

    const minut = sekund / 60;
    sumaMinut += minut;
    console.log(
      `${NAZWY_MODULOW[m as KodModulu].padEnd(28)} ${String(ekranow).padStart(6)} ${String(decyzji).padStart(8)} ${String(dotkniec).padStart(9)} ${minut.toFixed(1).padStart(7)}`,
    );
  }

  console.log("-".repeat(68));
  console.log(`${"RAZEM".padEnd(28)} ${"".padStart(6)} ${"".padStart(8)} ${"".padStart(9)} ${sumaMinut.toFixed(1).padStart(7)}`);
  console.log("\nCzas jest szacunkiem z liczby dotknięć, nie pomiarem na ludziach.");
  console.log("Służy do porównania wariantów mechaniki, nie do obiecywania minut uczestnikowi.");
}

main();
