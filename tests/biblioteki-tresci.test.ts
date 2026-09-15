/**
 * Biblioteki tresci raportu koncowego.
 *
 * Raport nie jest pisany przez model jezykowy w czasie dzialania. Jest
 * skladany z tekstow stalych, wywolywanych regulami, wiec ten sam obszar ma
 * identyczny opis u kazdego uczestnika. To jest zaleta, nie ograniczenie: taki
 * raport da sie sprawdzic, poprawic i obronic przed rodzicem. Przy nieletnich
 * i przy fundacji to nie drobiazg, tylko warunek.
 *
 * Skoro tresc jest stala, to daje sie ja sprawdzic raz, automatem, i wlasnie
 * to robi ten plik. Kazda regula ponizej jest regula z dokumentu
 * SPEC_dla_Claude_Code_v2.md, a nie wymyslona tutaj.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { OBSZARY_A1, KOMPETENCJE_A2, WYMIARY_A3, WARTOSCI_A4, FILTRY_A5 } from "@/lib/domain/slowniki";
import { NAPIECIA_A4 } from "@/lib/content/a4";

const KATALOG = path.join(process.cwd(), "data", "tresc");

function wczytaj(plik: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(KATALOG, `${plik}.json`), "utf8"));
}

/**
 * Slowa, ktorych uczestnik nie zobaczy nigdy.
 *
 * Sa nasze, wewnetrzne, i wystepuja w dokumentacji metodycznej oraz w starych
 * raportach. Test szuka rdzeni, nie calych slow, bo polska odmiana zrobilaby
 * z listy sito: „dopasowanie", „dopasowania", „dopasowaniem".
 *
 * Nie ma tu slow „sila" i „punkt", choc specyfikacja je wymienia. Oba maja
 * zwykle, nietechniczne znaczenie („praca wymagajaca sily", „punkt zbiorki")
 * i wpisane tutaj wycinalyby poprawne zdania. Pilnuje ich czlowiek przy
 * czytaniu, nie automat.
 */
const RDZENIE_ZAKAZANE = [
  "kotwic",
  "wyrazist",
  "ekspozycj",
  "ipsatyw",
  "normalizacj",
  "cwiartk",
  "ćwiartk",
  "rozjazd",
  "rozbieżnoś",
  "dopasowani",
  "biegun",
  "zróżnicowani",
  "napięci",
  "ranking",
  "ukryty atut",
  "warunek kluczowy",
];

/** Weto ma wlasna regule: wystepuje tylko w calych slowach, nie jako rdzen. */
const SLOWA_ZAKAZANE = ["weto", "weta", "wetem", "wet", "pasmo", "pasma", "pasmie", "profil", "profilu", "profilem"];

interface Znalezione {
  plik: string;
  sciezka: string;
  slowo: string;
  cytat: string;
}

function przejdz(
  wartosc: unknown,
  sciezka: string,
  odwiedz: (tekst: string, sciezka: string) => void,
): void {
  if (typeof wartosc === "string") odwiedz(wartosc, sciezka);
  else if (Array.isArray(wartosc)) {
    wartosc.forEach((v, i) => przejdz(v, `${sciezka}[${i}]`, odwiedz));
  } else if (wartosc && typeof wartosc === "object") {
    for (const [k, v] of Object.entries(wartosc)) przejdz(v, `${sciezka}/${k}`, odwiedz);
  }
}

const PLIKI = [
  "obszary",
  "kompetencje",
  "ukryte_atuty",
  "osie_pracy",
  "warunki",
  "wartosci",
  "obszary_sciezki",
] as const;

describe("biblioteki treści: komplet", () => {
  it.each([
    ["obszary", 24],
    ["kompetencje", 30],
    ["ukryte_atuty", 30],
    ["osie_pracy", 26],
    ["warunki", 43],
    ["obszary_sciezki", 27],
  ])("%s ma %i wpisów", (plik, ile) => {
    expect(Object.keys(wczytaj(plik as string))).toHaveLength(ile as number);
  });

  it("klucze zgadzają się ze słownikami, bez wymyślonych i bez brakujących", () => {
    const sprawdz = (plik: string, oczekiwane: string[]) => {
      const sa = Object.keys(wczytaj(plik)).sort();
      expect(sa, plik).toEqual([...oczekiwane].sort());
    };
    sprawdz("obszary", OBSZARY_A1.map((o) => String(o.id)));
    sprawdz("kompetencje", KOMPETENCJE_A2.map((k) => String(k.id)));
    sprawdz("ukryte_atuty", KOMPETENCJE_A2.map((k) => String(k.id)));
    sprawdz("warunki", FILTRY_A5.map((f) => f.kod));
    sprawdz(
      "osie_pracy",
      WYMIARY_A3.flatMap((w) => [`${w.kod}_A`, `${w.kod}_B`]),
    );
  });

  it("wartości i to, co się w nich bije, mają komplet kluczy", () => {
    const d = wczytaj("wartosci") as {
      wartosci: Record<string, unknown>;
      napiecia: Record<string, unknown>;
    };
    expect(Object.keys(d.wartosci).sort()).toEqual(WARTOSCI_A4.map((w) => w.kod).sort());
    expect(Object.keys(d.napiecia)).toHaveLength(NAPIECIA_A4.length);
  });

  /**
   * Nazwa w bibliotece musi byc przepisana ze slownika znak w znak. Gdyby
   * biblioteka miala wlasna nazwe obszaru, raport i ekran wyniku modulu
   * mowilyby o tej samej rzeczy dwoma nazwami i nikt by tego nie zauwazyl.
   */
  it("nazwy są przepisane ze słowników dosłownie", () => {
    const obszary = wczytaj("obszary") as Record<string, { nazwa: string }>;
    for (const o of OBSZARY_A1) expect(obszary[String(o.id)].nazwa, String(o.id)).toBe(o.etykieta);

    const kompetencje = wczytaj("kompetencje") as Record<string, { nazwa: string }>;
    for (const k of KOMPETENCJE_A2) {
      expect(kompetencje[String(k.id)].nazwa, String(k.id)).toBe(k.nazwa);
    }

    const warunki = wczytaj("warunki") as Record<string, { tekst: string }>;
    for (const f of FILTRY_A5) expect(warunki[f.kod].tekst, f.kod).toBe(f.tekst);
  });
});

describe("biblioteki treści: język uczestnika", () => {
  it("nigdzie nie ma słowa z listy zakazanych", () => {
    const znalezione: Znalezione[] = [];
    for (const plik of PLIKI) {
      przejdz(wczytaj(plik), "", (tekst, sciezka) => {
        // Klucz „napiecia" i nazwa „Rozbrajanie napiec" pochodza ze slownika
        // i nie sa tekstem pisanym dla uczestnika, wiec ich nie sprawdzamy.
        if (sciezka.includes("/nazwa")) return;
        const low = tekst.toLowerCase();
        for (const rdzen of RDZENIE_ZAKAZANE) {
          if (low.includes(rdzen)) znalezione.push({ plik, sciezka, slowo: rdzen, cytat: tekst });
        }
        for (const slowo of SLOWA_ZAKAZANE) {
          if (new RegExp(`\\b${slowo}\\b`, "i").test(tekst)) {
            znalezione.push({ plik, sciezka, slowo, cytat: tekst });
          }
        }
      });
    }
    expect(znalezione).toEqual([]);
  });

  /**
   * Ta sama regula co w tests/bez-myslnika.test.ts, tylko dla bibliotek.
   * Myslnik jest w polszczyznie znakiem pisma urzedowego i w tekscie dla
   * siedemnastolatka nie ma czego szukac.
   */
  it("nigdzie nie ma myślnika ani półpauzy", () => {
    const znalezione: string[] = [];
    for (const plik of PLIKI) {
      przejdz(wczytaj(plik), "", (tekst, sciezka) => {
        if (tekst.includes("—") || tekst.includes("–")) znalezione.push(`${plik}${sciezka}: ${tekst}`);
      });
    }
    expect(znalezione).toEqual([]);
  });

  /**
   * Raport nie wydaje polecenia. Konkretny krok ma sens po decyzji, a nie
   * przed nia, wiec ceny, terminy i nazwy kursow trafiaja do sekcji
   * wypelnianej przez prowadzacego, a nie do bibliotek.
   */
  it("nigdzie nie ma cen, terminów ani trybu rozkazującego", () => {
    const znalezione: string[] = [];
    const ceny = /\b\d+\s*(zł|zlotych|złotych|PLN)\b/i;
    const terminy = /\b(do końca roku|w tym miesiącu|w przyszłym roku|deadline|termin składania)\b/i;
    const rozkaz = /\b(zapisz się|zdobądź|zbuduj portfolio|wyślij aplikację|załóż konto)\b/i;
    for (const plik of PLIKI) {
      przejdz(wczytaj(plik), "", (tekst, sciezka) => {
        for (const [nazwa, wzorzec] of [["cena", ceny], ["termin", terminy], ["rozkaz", rozkaz]] as const) {
          if (wzorzec.test(tekst)) znalezione.push(`${plik}${sciezka} (${nazwa}): ${tekst}`);
        }
      });
    }
    expect(znalezione).toEqual([]);
  });

  /** Poziom dwunastolatka: jedna mysl na zdanie, bez zdan wielokrotnie zlozonych. */
  it("żadne zdanie nie przekracza trzydziestu pięciu słów", () => {
    const zadlugie: string[] = [];
    for (const plik of PLIKI) {
      przejdz(wczytaj(plik), "", (tekst, sciezka) => {
        for (const zdanie of tekst.split(/(?<=[.!?])\s+/)) {
          const slow = zdanie.trim().split(/\s+/).filter(Boolean).length;
          if (slow > 35) zadlugie.push(`${plik}${sciezka} (${slow} słów): ${zdanie}`);
        }
      });
    }
    expect(zadlugie).toEqual([]);
  });

  /**
   * Najwazniejsza regula calej sekcji o warunkach: odmowa nigdy nie zamyka
   * obszaru. Pole `co_zostaje` jest tym, co odroznia to narzedzie od filtra
   * w wyszukiwarce ofert, wiec musi byc wypelnione przy kazdym z 43 warunkow.
   */
  it("każdy warunek mówi, co zostaje otwarte", () => {
    const warunki = wczytaj("warunki") as Record<string, { co_zostaje?: string; przewaga?: string }>;
    for (const f of FILTRY_A5) {
      expect(warunki[f.kod]?.co_zostaje, f.kod).toBeTruthy();
      expect((warunki[f.kod]?.co_zostaje ?? "").length, f.kod).toBeGreaterThan(30);
      expect(warunki[f.kod]?.przewaga, f.kod).toBeTruthy();
    }
  });

  /** Kazda strona kazdej osi ma swoja cene. Zadna nie jest darmowa. */
  it("każda strona osi stylu pracy ma swoją cenę", () => {
    const osie = wczytaj("osie_pracy") as Record<
      string,
      { co_to_kosztuje?: string; prace_ktore_to_szanuja?: string[]; prace_ktore_to_lamia?: string[] }
    >;
    for (const w of WYMIARY_A3) {
      for (const strona of ["A", "B"]) {
        const klucz = `${w.kod}_${strona}`;
        expect(osie[klucz]?.co_to_kosztuje, klucz).toBeTruthy();
        expect(osie[klucz]?.prace_ktore_to_szanuja?.length ?? 0, klucz).toBeGreaterThanOrEqual(4);
        expect(osie[klucz]?.prace_ktore_to_lamia?.length ?? 0, klucz).toBeGreaterThanOrEqual(4);
      }
    }
  });

  /** Ikona sciezki ma byc inna dla kazdego z 27 obszarow: inaczej karty zlewaja sie w jedno. */
  it("każdy obszar ma własną ikonę ścieżki", () => {
    const sciezki = wczytaj("obszary_sciezki") as Record<string, { ikona: string; sciezka_rozwoju: string[] }>;
    const ikony = Object.values(sciezki).map((s) => s.ikona);
    expect(new Set(ikony).size, ikony.join(", ")).toBe(ikony.length);
    for (const [id, s] of Object.entries(sciezki)) {
      expect(s.sciezka_rozwoju.length, id).toBeGreaterThanOrEqual(2);
      expect(s.sciezka_rozwoju.length, id).toBeLessThanOrEqual(3);
    }
  });
});
