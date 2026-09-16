/**
 * Eksport PDF. Regresja: sekcje miały `wrap={false}` i cały dokument przestawał
 * się renderować, gdy jedna sekcja urosła ponad wysokość strony — co działo się
 * dopiero po odsłonięciu ostatniej warstwy i zapisaniu podsumowania sesji.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import { zbierzOdpowiedzi } from "@/lib/moduly/zbieranie";
import { zbudujRaport } from "@/lib/raport/budowa";
import { zbudujPdf } from "@/lib/raport/pdf";
import { SEKCJE } from "@/lib/raport/sekcje";
import { uczestnikTestowy } from "./pomocnicze/fixtury";
import type { BazaReferencyjna } from "@/lib/domain/typy";
import type { KompletOdpowiedzi } from "@/lib/engine/moduly";

let baza: BazaReferencyjna;
let odpowiedzi: KompletOdpowiedzi;
let karty: Map<string, { pelna: boolean }>;

const WSZYSTKIE = new Set(SEKCJE.map((s) => s.id));

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
  const uczestnik = await uczestnikTestowy("rzemieslniczy");
  odpowiedzi = await zbierzOdpowiedzi(uczestnik.id);
  const wiersze = await prisma.karta.findMany({ select: { kod: true, pelna: true } });
  karty = new Map(wiersze.map((k) => [k.kod, { pelna: k.pelna }]));
});

/** Długie teksty z sesji, czyli ten przypadek, który wywracał renderowanie. */
const DECYZJA = {
  tresc:
    "Na teraz idę w rzemiosło. Chcę spróbować u kogoś w warsztacie, zanim wybiorę szkołę, " +
    "bo nie chcę decydować o pięciu latach na podstawie wyobrażenia.",
  kroki: [
    "Do 30 września napiszę do dwóch warsztatów z trzema pytaniami.",
    "Do końca października pojadę na jeden dzień otwarty w technikum.",
    "W listopadzie sprawdzę, ile kosztuje kurs spawania i czy są dofinansowania.",
  ],
  notatka:
    "Bardzo konkretna. Pytała o pieniądze i o to, co robić, gdy nie wyjdzie. " +
    "Warto wrócić do tematu kosztów wejścia na kolejnym spotkaniu.",
};

describe("eksport PDF", () => {
  it("renderuje się z pełną treścią i wszystkimi warstwami", async () => {
    const raport = zbudujRaport({
      imie: "Ania",
      odpowiedzi,
      baza,
      karty,
      dostepne: WSZYSTKIE,
      decyzja: DECYZJA,
      korekty: [{ typ: "dopisany_zawod", wartosc: "pielegniarka", uzasadnienie: "Z rozmowy." }],
    });
    const buf = await zbudujPdf({ raport, oceny: {} });
    expect(buf.length).toBeGreaterThan(20_000);
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  }, 60_000);

  it("renderuje się także przy zamkniętych warstwach", async () => {
    const raport = zbudujRaport({
      imie: "Ania",
      odpowiedzi,
      baza,
      karty,
      dostepne: new Set(["wizja_zycia"]),
    });
    const buf = await zbudujPdf({ raport, oceny: {} });
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  }, 60_000);
});

/**
 * Sufit długości dokumentu.
 *
 * Renderer ma granicę, powyżej której przestaje umieć policzyć układ strony
 * i wywala się komunikatem „unsupported number”. Zmierzona granica to około
 * stu trzydziestu pozycji w sekcji zawodów, czyli kilkadziesiąt stron.
 *
 * W praktyce nie da się tam dojść: raport wypełnionego uczestnika ma **sześć**
 * pozycji, bo progi odcinają resztę. Sto dwadzieścia dziewięć wychodzi
 * wyłącznie przy profilu bez ani jednej odpowiedzi, któremu ktoś odsłonił
 * wszystkie warstwy raportu — a tego program nie robi, bo warstwy odsłania się
 * po wypełnieniu modułów.
 *
 * Ten test pilnuje realnego rozmiaru, nie sufitu: gdyby raport prawdziwego
 * uczestnika urósł do kilkudziesięciu pozycji, znaczyłoby to, że progi
 * przestały działać, i dowiemy się o tym tutaj, a nie przy eksporcie.
 */
describe("rozmiar raportu", () => {
  it("wypełniony profil mieści się w kilkunastu pozycjach sekcji zawodów", async () => {
    const { uczestnikTestowy } = await import("./pomocnicze/fixtury");
    const { pobierzRaport } = await import("@/lib/raport/serwer");
    const { odblokujWarstwe } = await import("@/lib/raport/dostep");
    const { WARSTWY } = await import("@/lib/raport/sekcje");

    const u = await uczestnikTestowy("rzemieslniczy");
    for (const w of WARSTWY.filter((x) => x.kod !== "ZAWSZE")) {
      await odblokujWarstwe(u.grupaId, w.kod as never);
    }
    const widok = await pobierzRaport(u.kodDostepu);
    const ile = widok?.raport.zawody?.pozycje.length ?? 0;
    expect(ile).toBeGreaterThan(0);
    expect(ile, "progi przestały odcinać zawody").toBeLessThan(40);
  });
});

/**
 * PDF nowego programu.
 *
 * Ta sama zasada co wyzej: dokument ma sie renderowac takze wtedy, gdy czesc
 * modulow jest pusta, bo uczestnik moze pobrac plik po pierwszym spotkaniu.
 * I ta sama zasada, ktora dotyczy ekranu: **zawody nie wchodza do pliku przed
 * odsloniecem warstwy**. Plik zyje latami, wiec wyciek jest tam trwalszy niz
 * na stronie.
 */
describe("eksport PDF nowego programu", () => {
  const PODSTAWA = {
    imie: "Ania",
    dataWygenerowania: "16 września 2026",
    stopka: "Fundacja Służąc Życiu",
    tematy: ["Medycyna i zdrowie", "Sport", "Psychologia"],
    lubie: ["Naprawianie", "Budowanie", "Rozwiązywanie problemów"],
    umiem: ["Naprawianie", "Precyzyjna praca manualna"],
    listy: [
      { tytul: "To lubisz i dobrze Ci wychodzi", opis: "opis listy", pozycje: ["Naprawianie"] },
    ],
    poziom: { minimum: "4 500 zł", komfort: "9 200 zł", cel: "11 000 zł", rocznie: "110 400 zł" },
    koszty: [{ nazwa: "Mieszkanie", kwota: "3 500 zł", udzial: 30 }],
  };

  it("renderuje się z pełną treścią", async () => {
    const { zbudujPdfNowy } = await import("@/lib/raport/pdf");
    const buf = await zbudujPdfNowy({
      ...PODSTAWA,
      zawody: Array.from({ length: 10 }, (_, i) => ({
        nazwa: `Zawód ${i + 1}`,
        bezStudiow: i % 2 === 0,
        uzasadnienie: "Z Twoich zaznaczeń: naprawianie, budowanie.",
        widelki: "Widełki: od 3 000 zł na start, typowo 5 000 zł, do 9 000 zł na szczycie.",
        finanse: "Ten zawód dochodzi do poziomu, który sobie założyłeś.",
      })),
    });
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(buf.length).toBeGreaterThan(20_000);
  }, 60_000);

  it("renderuje się, gdy nie ma jeszcze zawodów ani poziomu życia", async () => {
    const { zbudujPdfNowy } = await import("@/lib/raport/pdf");
    const buf = await zbudujPdfNowy({ ...PODSTAWA, poziom: null, koszty: [], zawody: [] });
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  }, 60_000);
});
