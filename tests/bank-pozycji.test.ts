/**
 * Bank pozycji: sześć zasad redakcyjnych, sprawdzanych automatycznie.
 *
 * Zasady pochodzą z dokumentu zmiany treści i obowiązują we wszystkich
 * modułach. Test istnieje po to, żeby nie wyłapywać tego okiem przy każdej
 * kolejnej edycji treści.
 *
 * **Dwa moduły czekają na przepisanie** (pozycje rankingowe A2 i brzmienia
 * wartości A4). Do czasu podmiany są wyłączone z części sprawdzeń: lista
 * `CZEKA_NA_PRZEPISANIE` znika razem z nimi i wtedy reguły obowiązują wszędzie.
 *
 * A3 zeszło z tej listy po podmianie na drugą wersję banku, ale nie wchodzi
 * pod regułę dziesięciu słów i pod dwa wzorce pisane dla zadań: pary A3 to
 * całe zdania, nie nazwy czynności, i mierzy się je inaczej. Powody stoją
 * przy `LIMIT_SLOW` i `POZA_WZORCAMI`.
 */

import { describe, expect, it } from "vitest";
import { BLOKI_A1 } from "@/lib/content/a1";
import { BLOKI_A2 } from "@/lib/content/a2";
import { PARY_A3 } from "@/lib/content/a3";
import { PARY_A4, BRZMIENIA_A4 } from "@/lib/content/a4";
import { PARY_M1 } from "@/lib/content/m1";
import { FILTRY_A5 } from "@/lib/domain/slowniki";

const CZEKA_NA_PRZEPISANIE = new Set(["A2", "A4"]);

/**
 * Ile słów wolno pozycji.
 *
 * Dziesięć dla zadań („Ocenić, czy badanie jest wiarygodne"), bo dłuższe nie
 * mieszczą się w kaflu rankingu. A3 i M1 to zdania dwubiegunowe i druga wersja
 * banku A3 celowo nazywa sytuację w obu biegunach („Kiedy w ostatniej chwili
 * zmienia się plan, …"), co kosztuje słowa i jest w tym miejscu zaletą:
 * uczestnik nie musi jej sobie dopowiadać. Najdłuższy biegun ma dwanaście słów
 * i to jest sufit, a nie zaproszenie do rozwlekania.
 */
const LIMIT_SLOW: Record<string, number> = { A3: 12, M1: 12 };
const limit = (modul: string) => LIMIT_SLOW[modul] ?? 10;

/**
 * Moduły poza dwoma wzorcami pisanymi dla zadań.
 *
 * `POROWNANIE` łapie w A3 dwa bieguny („nawet gdy nikt tego nie sprawdza",
 * „żeby wszyscy ich przestrzegali"), a `REZULTAT` dwa kolejne („żeby ktoś inny
 * wyznaczył kierunek", „żeby ktoś zauważył, co zrobiłem"). Żaden z nich nie
 * porównuje uczestnika z ludźmi ani nie uzależnia zadania od cudzej decyzji:
 * to jest treść osi DEC i EFE, czyli dokładnie to, o co ten moduł pyta.
 * Wzorce zostają ostre dla zadań, zamiast rozmiękczać je dla całego programu.
 */
const POZA_WZORCAMI = new Set(["A3"]);

interface Pozycja {
  modul: string;
  klucz: string;
  tekst: string;
}

const POZYCJE: Pozycja[] = [
  ...BLOKI_A1.flatMap((b) => b.pozycje).map((p) => ({ modul: "A1", klucz: p.id, tekst: p.tekst })),
  ...BLOKI_A2.flatMap((b) => b.pozycje).map((p) => ({ modul: "A2", klucz: p.id, tekst: p.tekst })),
  ...PARY_A3.flatMap((p) => [
    { modul: "A3", klucz: `${p.id}A`, tekst: p.biegunA },
    { modul: "A3", klucz: `${p.id}B`, tekst: p.biegunB },
  ]),
  ...Object.entries(BRZMIENIA_A4).map(([k, t]) => ({ modul: "A4", klucz: k, tekst: t })),
  ...PARY_M1.flatMap((p) => [
    { modul: "M1", klucz: `${p.id}A`, tekst: p.biegunA },
    { modul: "M1", klucz: `${p.id}B`, tekst: p.biegunB },
  ]),
  ...FILTRY_A5.map((f) => ({ modul: "A5", klucz: f.kod, tekst: f.tekst })),
];

const czynne = POZYCJE.filter((p) => !CZEKA_NA_PRZEPISANIE.has(p.modul));

function slowa(tekst: string): number {
  return tekst.trim().split(/\s+/).length;
}

/** Porównanie z ludźmi albo z normą. Sam rzeczownik „inni" nim nie jest. */
const POROWNANIE =
  /(\bwiększość\b|\bnikt\b|\bwszyscy\b|mało kto|niż inni|od innych|co inni|kiedy inni|gdy inni|niż przeciętnie|niż większość)/i;

/** Rezultat, o którym decyduje ktoś inny niż uczestnik. */
const REZULTAT = /(po którym|tak,? że ktoś|żeby ktoś|który sprawi)/i;

/** Skala lat przy zadaniu na godziny albo dni. */
const SKALA = /(przez lata|latami|przez wiele lat|całe życie)/i;

describe("zasady redakcyjne banku pozycji", () => {
  it("żadna pozycja nie przekracza limitu słów swojego modułu", () => {
    const winne = czynne.filter((p) => slowa(p.tekst) > limit(p.modul));
    expect(winne.map((p) => `${p.modul} ${p.klucz} (${slowa(p.tekst)}): ${p.tekst}`)).toEqual([]);
  });

  it("żadna pozycja nie porównuje uczestnika z ludźmi ani z normą", () => {
    const winne = czynne.filter((p) => !POZA_WZORCAMI.has(p.modul) && POROWNANIE.test(p.tekst));
    expect(winne.map((p) => `${p.modul} ${p.klucz}: ${p.tekst}`)).toEqual([]);
  });

  it("żadna pozycja nie opisuje rezultatu zależnego od innych", () => {
    const winne = czynne.filter((p) => !POZA_WZORCAMI.has(p.modul) && REZULTAT.test(p.tekst));
    expect(winne.map((p) => `${p.modul} ${p.klucz}: ${p.tekst}`)).toEqual([]);
  });

  it("żadne zadanie nie miesza się ze skalą lat", () => {
    // Reguła dotyczy modułów zadaniowych. M1 pyta wprost o kształt życia
    // na lata, a A5 o warunki pracy, więc „przez lata” jest tam treścią,
    // nie pomyłką skali.
    const zadaniowe = czynne.filter((p) => p.modul === "A1" || p.modul === "A2");
    const winne = zadaniowe.filter((p) => SKALA.test(p.tekst));
    expect(winne.map((p) => `${p.modul} ${p.klucz}: ${p.tekst}`)).toEqual([]);
  });
});

describe("symetria par", () => {
  const roznica = (a: string, b: string) => Math.abs(slowa(a) - slowa(b));

  /**
   * Jeden wyjątek, nazwany po imieniu zamiast wyłączania całej reguły.
   * KON_3 przyszedł w drugiej wersji banku jako dwanaście słów kontra osiem
   * i został w treści dokładnie tak, jak go napisano. Gdy biegun B urośnie
   * o cztery słowa, wystarczy usunąć stąd ten kod.
   */
  const SYMETRIA_WYJATKI = new Set(["KON_3"]);

  it("pary A3 nie różnią się długością o więcej niż trzy słowa", () => {
    const winne = PARY_A3.filter(
      (p) => !SYMETRIA_WYJATKI.has(p.id) && roznica(p.biegunA, p.biegunB) > 3,
    );
    expect(winne.map((p) => `${p.id}: ${p.biegunA} / ${p.biegunB}`)).toEqual([]);
  });

  it("wyjątek od symetrii jest jeden i nadal jest wyjątkiem", () => {
    // Gdyby ktoś dopisał do listy kolejny kod, reguła cicho przestałaby
    // obowiazywać. Test pilnuje, żeby lista nie rosła.
    expect([...SYMETRIA_WYJATKI]).toEqual(["KON_3"]);
    expect(PARY_A3.filter((p) => roznica(p.biegunA, p.biegunB) > 3).map((p) => p.id)).toEqual([
      "KON_3",
    ]);
  });

  it("pary A4 nie różnią się długością o więcej niż trzy słowa", () => {
    if (CZEKA_NA_PRZEPISANIE.has("A4")) return;
    const winne = PARY_A4.filter(
      (p) => roznica(BRZMIENIA_A4[p.lewa], BRZMIENIA_A4[p.prawa]) > 3,
    );
    expect(winne.map((p) => `${p.nr}`)).toEqual([]);
  });
});

describe("bilans banku po podmianie treści", () => {
  it("A1 ma 144 pozycje, po sześć na każdy z 24 obszarów", () => {
    const pozycje = BLOKI_A1.flatMap((b) => b.pozycje);
    expect(pozycje).toHaveLength(144);
    const naObszar = new Map<number, number>();
    for (const p of pozycje) naObszar.set(p.obszar, (naObszar.get(p.obszar) ?? 0) + 1);
    expect(naObszar.size).toBe(24);
    for (const [obszar, ile] of naObszar) expect(ile, `obszar ${obszar}`).toBe(6);
  });

  it("w żadnym zestawie nie ma więcej niż jednej pozycji imponującej", () => {
    for (const b of BLOKI_A1) {
      const ile = b.pozycje.filter((p) => p.wysoka).length;
      expect(ile, `zestaw ${b.index}`).toBeLessThanOrEqual(1);
    }
  });

  it("A5 ma 43 pozycje i trzy odpowiedzi w nowej ramie", async () => {
    const { ODPOWIEDZI_A5, INSTRUKCJA_A5 } = await import("@/lib/content/a5");
    expect(FILTRY_A5).toHaveLength(43);
    expect(INSTRUKCJA_A5.polecenieBloku).toBe("Jak byś to zniósł?");
    expect(ODPOWIEDZI_A5.map((o) => o.etykieta)).toEqual(["Dam radę", "Zależy", "To nie dla mnie"]);
    // Kody zostają: od nich zależy zapis odpowiedzi i cały silnik.
    expect(ODPOWIEDZI_A5.map((o) => o.kod)).toEqual(["tak", "moze", "nie"]);
  });

  it("każde z siedmiu pytań M1 ma punkty zaczepienia albo wersję odwrotną", async () => {
    const { OBSZARY_M1 } = await import("@/lib/content/m1");
    for (const o of OBSZARY_M1) {
      expect(Boolean(o.punkty || o.odwrotnie || o.zdania), `obszar ${o.nr}`).toBe(true);
    }
  });
});
