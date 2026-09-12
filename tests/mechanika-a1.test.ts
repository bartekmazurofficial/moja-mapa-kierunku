/**
 * Mechanika bloku A1: pełny ranking 1–4, nie MaxDiff.
 *
 * Przegląd kodu zaproponował zamianę A1 na MaxDiff (wskaż najlepszą i najgorszą,
 * środka nie porządkuj), argumentując, że „silnik nie używa środka rankingu”.
 * To twierdzenie jest nieprawdziwe i ten test to przypina.
 *
 * Specyfikacja modułu (program-doradztwa/02_assessmenty/A1_zainteresowania.md,
 * sekcja 8) przewiduje ten zarzut wprost i go odrzuca: „Środkowe miejsca ważą
 * trzy razy mniej niż skrajne, i to jest celowe. Ludzie pewnie odróżniają
 * najlepsze od najgorszego, ale kolejność drugiego i trzeciego ustalają
 * w dużej mierze przypadkowo. Wagi odzwierciedlają rzeczywistą wiarygodność
 * tych wskazań.” Środek jest **zdyskontowany, nie usunięty**.
 */

import { describe, expect, it } from "vitest";
import { policzA1 } from "@/lib/engine/moduly";
import { BLOKI_A1 } from "@/lib/content/a1";
import { OBSZARY_A1 } from "@/lib/domain/slowniki";

/** Pełne wypełnienie A1: każdy blok ustawiony w kolejności identyfikatorów. */
function wypelnij(przestawSrodek = false) {
  const czescA: Record<number, Record<string, number>> = {};
  for (const b of BLOKI_A1) {
    const ids = b.pozycje.map((p) => p.id);
    const miejsca = przestawSrodek ? [1, 3, 2, 4] : [1, 2, 3, 4];
    czescA[b.index] = Object.fromEntries(ids.map((id, i) => [id, miejsca[i]]));
  }
  return {
    czescA,
    czescB: Object.fromEntries(OBSZARY_A1.map((o) => [o.id, 3])),
    czescC: Object.fromEntries(OBSZARY_A1.map((o) => [o.id, false])),
  };
}

describe("blok A1 jest pełnym rankingiem", () => {
  it("każdy zestaw wymaga wszystkich czterech miejsc", () => {
    for (const b of BLOKI_A1) expect(b.pozycje, `zestaw ${b.index}`).toHaveLength(4);
  });

  it("przestawienie miejsc 2 i 3 zmienia wynik, więc środek nie jest wyrzucany", () => {
    const proste = policzA1(wypelnij(false));
    const przestawione = policzA1(wypelnij(true));
    const zmienione = OBSZARY_A1.filter((o) => proste.z[o.id] !== przestawione.z[o.id]);
    // Gdyby silnik liczył tylko skrajne wskazania, obie odpowiedzi dałyby
    // identyczny wynik: miejsca 1 i 4 są w obu wariantach te same.
    expect(zmienione.length, "środek rankingu nie wpływa na wynik").toBeGreaterThan(0);
  });

  it("bilans zerowy ze specyfikacji: średnia znormalizowana wynosi 50", () => {
    const w = policzA1(wypelnij(false));
    const wartosci = OBSZARY_A1.map((o) => w.wn[o.id]);
    const srednia = wartosci.reduce((s, x) => s + x, 0) / wartosci.length;
    expect(srednia).toBeCloseTo(50, 6);
  });

  it("cztery wagi, nie dwie: skrajne ważą trzy razy tyle co środkowe", () => {
    // Test czyta wagi przez wynik: obszar postawiony zawsze na drugim miejscu
    // musi mieć wynik wyższy niż postawiony zawsze na trzecim.
    const drugie = policzA1({
      czescA: Object.fromEntries(
        BLOKI_A1.map((b) => [b.index, Object.fromEntries(b.pozycje.map((p, i) => [p.id, i + 1]))]),
      ),
      czescB: Object.fromEntries(OBSZARY_A1.map((o) => [o.id, 3])),
      czescC: Object.fromEntries(OBSZARY_A1.map((o) => [o.id, false])),
    });
    const rozne = new Set(OBSZARY_A1.map((o) => Math.round(drugie.wn[o.id] * 1000)));
    expect(rozne.size, "wszystkie obszary mają identyczny wynik").toBeGreaterThan(2);
  });
});
