/**
 * Przejście między częściami wewnątrz modułu.
 *
 * Błąd, który to wymusił: po domknięciu części `router.refresh()` podmieniał
 * definicję w locie, a numer ekranu zostawał z części poprzedniej. Część A
 * modułu A1 ma 38 ekranów, część B jeden, więc numer 37 wskazywał w pustkę
 * i strona robiła się pusta. Wyglądało to jak zawieszenie aplikacji i nie dało
 * się z tego wyjść inaczej niż przeładowaniem.
 *
 * Zabezpieczenie jest po stronie Reacta (klucz komponentu z kodu części),
 * więc test pilnuje trzech rzeczy naraz: że różnica długości istnieje,
 * że klucz jest w kodzie strony i że stan serwera faktycznie przechodzi
 * do następnej części.
 */

import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, zbudujCzesc } from "@/lib/moduly/ekrany";
import { zbudujPlan } from "@/lib/moduly/plan";
import { pobierzStanModulu } from "@/lib/moduly/serwer";
import { wypelnijUczestnika } from "@/lib/testy/wypelnianie";
import { uczestnikTestowy } from "./pomocnicze/fixtury";
import type { KodModulu } from "@/lib/moduly/typy";

const KOD = "TEST000098";
let uczestnikId: string;

beforeAll(async () => {
  const wzorzec = await uczestnikTestowy();
  const istniejacy = await prisma.uczestnik.findUnique({ where: { kodDostepu: KOD } });
  const u =
    istniejacy ??
    (await prisma.uczestnik.create({
      data: { grupaId: wzorzec.grupaId, imie: "Test przejścia", kodDostepu: KOD },
    }));
  uczestnikId = u.id;
  await wypelnijUczestnika(uczestnikId, "rzemieslniczy");
});

describe("długości części", () => {
  it("części tego samego modułu różnią się długością, i to mocno", () => {
    const roznice = KOLEJNOSC_MODULOW.filter((m) => CZESCI_MODULOW[m].length > 1).map((m) => {
      const plan = zbudujPlan(m);
      const dlugosci = CZESCI_MODULOW[m].map((c) => zbudujCzesc(m, c, plan, {}).ekrany.length);
      return { m, dlugosci };
    });
    // Gdyby wszystkie części miały tyle samo ekranów, błąd nigdy by nie wyszedł
    // na jaw. Ten test istnieje po to, żeby było jasne, dlaczego klucz jest
    // potrzebny, a nie dlatego, że któraś liczba jest sama w sobie ważna.
    for (const { m, dlugosci } of roznice) {
      expect(new Set(dlugosci).size, `${m}: ${dlugosci.join(" ")}`).toBeGreaterThan(1);
    }
  });
});

describe("komponent przebiegu dostaje klucz z części", () => {
  it("strona modułu przekazuje key zależny od kodu części", () => {
    const plik = path.resolve(__dirname, "..", "app/u/[kod]/modul/[modul]/page.tsx");
    const tresc = fs.readFileSync(plik, "utf8");
    expect(tresc).toMatch(/key=\{`\$\{modul\}-\$\{stan\.czesc\}`\}/);
  });
});

describe("stan serwera po domknięciu części", () => {
  it("każdy moduł przechodzi do kolejnej części, aż do końca", async () => {
    for (const m of KOLEJNOSC_MODULOW) {
      const stan = await pobierzStanModulu(uczestnikId, m);
      // Uczestnik ma wszystko wypełnione, więc nie ma już części otwartej.
      expect(stan.czesc, m).toBeNull();
      expect(stan.zakonczoneCzesci, m).toEqual(CZESCI_MODULOW[m]);
    }
  });

  it("po skasowaniu ostatniej części moduł wraca dokładnie do niej", async () => {
    const modul: KodModulu = "A4";
    const ostatnia = CZESCI_MODULOW[modul].at(-1)!;
    await prisma.odpowiedz.deleteMany({ where: { uczestnikId, modul, czesc: ostatnia } });
    const stan = await pobierzStanModulu(uczestnikId, modul);
    expect(stan.czesc).toBe(ostatnia);
    expect(stan.definicja).not.toBeNull();
    expect(stan.definicja!.ekrany.length).toBeGreaterThan(0);
    await wypelnijUczestnika(uczestnikId, "rzemieslniczy");
  });
});
