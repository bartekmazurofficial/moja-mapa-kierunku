/**
 * Bank A3, wersja druga: reguły, które ta treść naprawdę spełnia.
 *
 * Dokument zmiany dorzucił sześć sprawdzeń. Trzy z nich przypięte są tutaj na
 * stałe, bo bank przechodzi je co do jednego bieguna: minimalna długość, lista
 * idiomów i brak powtórzeń. Symetria stoi w `bank-pozycji.test.ts` razem
 * z parami A4.
 *
 * **Trzech nie przypinam i to jest świadome.** Wersja druga sama ich nie
 * przechodzi, więc test byłby czerwony od pierwszego dnia albo musiałbym
 * przepisać treść, której nie jestem autorem:
 *
 *   - „każdy biegun ma nazwaną sytuację", sprawdzane obecnością słowa kiedy ·
 *     gdy · w · zanim · przy · po · żeby · wolę: nie ma go w 26 biegunach,
 *     w większości całkowicie zrozumiałych („Bałagan na biurku utrudnia mi
 *     pracę"). Lista słów jest za wąska na regułę, którą miała opisać.
 *   - „rzeczownik bez dopełnienia", sprawdzane końcówką zdania: łapie NOW_4B
 *     („czuję przede wszystkim napięcie") i EFE_2A („czy moja praca ma sens").
 *     W obu sytuacja jest nazwana zdanie wcześniej, więc to fałszywe trafienia.
 *   - „oba bieguny zaczynają się od tego samego wyrazu": nie zaczyna się tak
 *     16 par z 65, w tym RYZ_4 i NAP_2. To jest realna uwaga redakcyjna do
 *     treści, nie do kodu, i zgłaszam ją zamiast chować pod zielonym testem.
 */

import { describe, expect, it } from "vitest";
import { PARY_A3, KOTWICE_A3, INSTRUKCJA_A3 } from "@/lib/content/a3";

const WYMIARY = ["INI", "STR", "TEM", "SAM", "GLE", "RYZ", "DEC", "KON", "NOW", "NAP", "RYT", "OTO", "EFE"];

const BIEGUNY = PARY_A3.flatMap((p) => [
  { klucz: `${p.id}A`, tekst: p.biegunA },
  { klucz: `${p.id}B`, tekst: p.biegunB },
]);

const slowa = (tekst: string) => tekst.trim().split(/\s+/);

/**
 * Idiomy, które w pierwszej wersji banku znaczyły dla każdego co innego.
 * „Postawiłbym na siebie" da się przeczytać jako zaufałbym sobie, jako
 * zainwestowałbym w siebie i jako wybrałbym siebie do zadania.
 */
const IDIOMY = [
  "postawić na",
  "postawiłbym na",
  "brać na siebie",
  "biorę na siebie",
  "mieć nosa",
  "iść na całość",
  "lepiej coś niż",
  "lepiej nic niż",
];

describe("struktura banku", () => {
  it("65 par, po pięć na każdy z trzynastu wymiarów", () => {
    expect(PARY_A3).toHaveLength(65);
    for (const w of WYMIARY) {
      expect(PARY_A3.filter((p) => p.wymiar === w).map((p) => p.id), w).toEqual([1, 2, 3, 4, 5].map((n) => `${w}_${n}`));
    }
  });

  it("identyfikator zawsze zgadza się z wymiarem", () => {
    // Od tego zależy liczenie wyniku: para policzy się do osi z identyfikatora,
    // a tekst zobaczy uczestnik. Rozjazd byłby niewidoczny na ekranie.
    for (const p of PARY_A3) expect(p.id.startsWith(`${p.wymiar}_`), p.id).toBe(true);
  });

  it("żaden biegun nie powtarza się w całym module", () => {
    const teksty = BIEGUNY.map((b) => b.tekst.toLowerCase());
    expect(teksty.length - new Set(teksty).size).toBe(0);
  });
});

describe("sześć zasad redakcyjnych drugiej wersji", () => {
  it("żaden biegun nie ma mniej niż pięć słów", () => {
    const winne = BIEGUNY.filter((b) => slowa(b.tekst).length < 5);
    expect(winne.map((b) => `${b.klucz} (${slowa(b.tekst).length}): ${b.tekst}`)).toEqual([]);
  });

  it("żaden biegun nie używa idiomu z listy", () => {
    const winne = BIEGUNY.flatMap((b) =>
      IDIOMY.filter((i) => b.tekst.toLowerCase().includes(i)).map((i) => `${b.klucz}: „${i}"`),
    );
    expect(winne).toEqual([]);
  });

  it("żaden biegun nie kończy się kropką ani nie zaczyna małą literą", () => {
    const winne = BIEGUNY.filter((b) => b.tekst.endsWith(".") || b.tekst[0] !== b.tekst[0].toUpperCase());
    expect(winne.map((b) => `${b.klucz}: ${b.tekst}`)).toEqual([]);
  });
});

describe("kotwice ważności", () => {
  it("trzynaście kotwic, po jednej na wymiar, w kolejności par", () => {
    expect(KOTWICE_A3.map((k) => k.wymiar)).toEqual(WYMIARY);
  });

  it("obie strony każdej kotwicy domykają zdanie z przedrostkiem", () => {
    // Ekran skleja „Zależy mi na tym," z tekstem kotwicy, więc kotwica musi
    // być dalszą częścią zdania, a nie osobnym zdaniem.
    expect(INSTRUKCJA_A3.kotwicePrefiks.endsWith(",")).toBe(true);
    for (const k of KOTWICE_A3) {
      for (const [strona, t] of [["A", k.tekstA], ["B", k.tekstB]] as const) {
        expect(t.startsWith("żeby"), `${k.wymiar}${strona}: ${t}`).toBe(true);
        expect(t.endsWith("."), `${k.wymiar}${strona}: ${t}`).toBe(false);
      }
    }
  });

  it("obie strony kotwicy mówią o czymś innym", () => {
    for (const k of KOTWICE_A3) expect(k.tekstA, k.wymiar).not.toBe(k.tekstB);
  });
});
