/**
 * Pokaz demonstracyjny: sesja prowadzącego bez hasła.
 *
 * To jest jedyne wejście w panel prowadzącego, które nie zna hasła, więc musi
 * być wąskie i musi to być sprawdzone, a nie założone. Dwie własności:
 * roli nie da się podmienić bez sekretu, a sesja pokazowa nie ma prawa zapisu.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { ciasteczkoWazne, rolaZCiasteczka, zbudujCiasteczko } from "@/lib/prowadzacy/sesja";
import { KOD_GRUPY_POKAZ } from "@/lib/pokaz";

beforeAll(() => {
  process.env.SESJA_SEKRET ??= "sekret-do-testow-co-najmniej-32-znaki-dlugi";
});

describe("ciasteczko sesji niesie rolę", () => {
  it("pełna i pokazowa czytają się jako to, czym są", () => {
    expect(rolaZCiasteczka(zbudujCiasteczko(Date.now(), "pelna").wartosc)).toBe("pelna");
    expect(rolaZCiasteczka(zbudujCiasteczko(Date.now(), "pokaz").wartosc)).toBe("pokaz");
  });

  it("podmiana roli na pełną unieważnia podpis", () => {
    // Bez tego pokaz byłby obejściem hasła: wystarczyłoby przepisać jedno
    // słowo w ciasteczku.
    const pokaz = zbudujCiasteczko(Date.now(), "pokaz").wartosc;
    const podrobione = pokaz.replace(".pokaz.", ".pelna.");
    expect(podrobione).not.toBe(pokaz);
    expect(rolaZCiasteczka(podrobione)).toBeNull();
    expect(ciasteczkoWazne(podrobione)).toBe(false);
  });

  it("przeterminowane i bezkształtne nie przechodzą", () => {
    const stare = zbudujCiasteczko(Date.now() - 9 * 60 * 60 * 1000, "pelna").wartosc;
    expect(rolaZCiasteczka(stare)).toBeNull();
    expect(rolaZCiasteczka("")).toBeNull();
    expect(rolaZCiasteczka("cokolwiek")).toBeNull();
    // Format sprzed wprowadzenia roli: dwie części zamiast trzech.
    expect(rolaZCiasteczka("99999999999999.abc")).toBeNull();
  });

  it("wydłużenie ważności unieważnia podpis", () => {
    const c = zbudujCiasteczko(Date.now(), "pelna").wartosc;
    const [, rola, podpis] = c.split(".");
    expect(rolaZCiasteczka(`${Date.now() + 10 ** 10}.${rola}.${podpis}`)).toBeNull();
  });
});

describe("grupa pokazowa", () => {
  it("ma stały kod, po którym filtruje warstwa danych", () => {
    expect(KOD_GRUPY_POKAZ).toBe("POKAZ");
  });

  it("żadna prawdziwa grupa nie używa tego kodu", async () => {
    const { prisma } = await import("@/lib/db/klient");
    const grupy = await prisma.grupa.findMany({ where: { kod: KOD_GRUPY_POKAZ } });
    // Zero albo jedna: kod jest unikalny w bazie, więc druga grupa o tym
    // kodzie nie powstanie, ale pilnujemy, żeby nikt nie nazwał tak roboczej.
    expect(grupy.length).toBeLessThanOrEqual(1);
    for (const g of grupy) expect(g.nazwa).toContain("Pokaz");
  });
});

describe("przełącznik pokazu", () => {
  it("domyślnie wyłączony", async () => {
    const zapamietane = process.env.POKAZ_DEMO;
    delete process.env.POKAZ_DEMO;
    const { pokazWlaczony } = await import("@/lib/pokaz");
    expect(pokazWlaczony()).toBe(false);
    process.env.POKAZ_DEMO = "1";
    expect(pokazWlaczony()).toBe(true);
    if (zapamietane === undefined) delete process.env.POKAZ_DEMO;
    else process.env.POKAZ_DEMO = zapamietane;
  });
});
