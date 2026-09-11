/**
 * Ortografia w polach wyświetlanych.
 *
 * Bazy referencyjne były zakodowane bez polskich znaków i w fazie czwartej
 * ta treść trafiła wprost na ekran uczestnika. Test ma paść, jeśli cokolwiek
 * z tego wróci przy kolejnej edycji danych.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";

interface Pole {
  gdzie: string;
  tekst: string;
}

let pola: Pole[] = [];

beforeAll(async () => {
  const dodaj = (gdzie: string, tekst: string | null | undefined) => {
    if (tekst) pola.push({ gdzie, tekst });
  };

  for (const o of await prisma.obszar.findMany()) dodaj(`obszar.${o.id}.nazwa`, o.nazwa);
  for (const z of await prisma.zawod.findMany()) dodaj(`zawod.${z.kod}.nazwa`, z.nazwaWyswietlana);
  for (const k of await prisma.kierunek.findMany()) {
    dodaj(`kierunek.${k.kod}.nazwa`, k.nazwa);
    dodaj(`kierunek.${k.kod}.robi`, k.robi);
    dodaj(`kierunek.${k.kod}.nieDaje`, k.nieDaje);
  }
  for (const d of await prisma.drogaBezStudiow.findMany()) {
    dodaj(`droga.${d.kod}.nazwa`, d.nazwa);
    dodaj(`droga.${d.kod}.czas`, d.czas);
    dodaj(`droga.${d.kod}.koszt`, d.koszt);
    dodaj(`droga.${d.kod}.wymagania`, d.wymagania);
  }
  for (const k of await prisma.klaster.findMany()) {
    dodaj(`klaster.${k.kod}.nazwa`, k.nazwa);
    dodaj(`klaster.${k.kod}.pytanie`, k.pytanie);
    dodaj(`klaster.${k.kod}.roznica`, k.roznica);
    dodaj(`klaster.${k.kod}.uwaga`, k.uwaga);
  }
});

/** Granica słowa, która zna polskie litery. `\b` w JS ich nie zna. */
const LITERY = "A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż";
function slowo(tekst: string): RegExp {
  return new RegExp(`(?<![${LITERY}])${tekst}(?![${LITERY}])`, "i");
}

describe("polszczyzna w polach wyświetlanych", () => {
  it("nigdzie nie ma skrótu złotego bez ogonka", () => {
    const zle = pola.filter((p) => slowo("zl").test(p.tekst));
    expect(zle.map((p) => p.gdzie)).toEqual([]);
  });

  it("nie ma form, które w tych tekstach zawsze są brakiem znaku", () => {
    // „granica" bywa poprawne („granica z medycyną"), więc sprawdzamy tylko
    // te wystąpienia, które stoją po przyimku wymagającym narzędnika.
    const podejrzane = ["jezyk", "jezyka", "jezyku", "jezyki", "jezykowy", "sluchu",
      "obslugi", "uslugowej", "sygnaly", "muzykow", "etatow", "systemow", "dzialow",
      "zlece", "gorski", "gorskiego", "samochod", "rosnie", "osiaga", "trwalej",
      "kogos", "zespolowa", "kanalizacja"];
    const znalezione: string[] = [];
    for (const p of pola) {
      for (const forma of podejrzane) {
        if (slowo(forma).test(p.tekst)) znalezione.push(`${p.gdzie}: ${forma}`);
      }
    }
    expect(znalezione).toEqual([]);
  });

  it("nie ma narzędnika bez ogonka po przyimku", () => {
    // „za granica", „z kompetencja", „przed decyzja" — przyimek wymusza -ą.
    const wzorzec = new RegExp(
      `(?<![${LITERY}])(za|z|ze|nad|pod|przed|między)\\s+([a-ząćęłńóśźż]+[^ąęść\\s]a)(?![${LITERY}])`,
      "gi",
    );
    const znalezione: string[] = [];
    for (const p of pola) {
      for (const m of p.tekst.matchAll(wzorzec)) {
        // Mianownik po „z" bywa poprawny w wyliczeniach; interesują nas słowa,
        // które w tej bazie występują też w formie z ogonkiem.
        const zOgonkiem = m[2].replace(/a$/, "ą");
        if (pola.some((x) => x.tekst.includes(zOgonkiem))) {
          znalezione.push(`${p.gdzie}: „${m[0]}" → „${m[1]} ${zOgonkiem}"`);
        }
      }
    }
    expect(znalezione).toEqual([]);
  });

  it("każde pole opisowe ma choć jedną polską literę albo jest krótkie", () => {
    // Zdanie po polsku dłuższe niż sto znaków bez ani jednej polskiej litery
    // to prawie na pewno tekst po konwersji, nie świadomy wybór.
    const zle = pola
      .filter((p) => p.tekst.length > 100 && !/[ąćęłńóśźż]/i.test(p.tekst))
      .map((p) => p.gdzie);
    expect(zle).toEqual([]);
  });
});
