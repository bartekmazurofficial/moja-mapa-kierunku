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
