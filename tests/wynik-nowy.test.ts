/**
 * Skladanie wyniku nowego programu.
 *
 * Testy pilnuja trzech rzeczy, ktorych zadna inna warstwa nie sprawdzi:
 * czy odpowiedzi z bazy w ogole dochodza do silnika, czy braki nie zeruja
 * calosci i czy zawody spelniaja kwoty, na ktorych stoi caly pomysl listy.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";
import { wypelnijNowyProgram, type ProfilTestowy } from "@/lib/testy/wypelnianie";
import { otworzSpotkanieNowe } from "@/lib/moduly/otwarcie";
import { zbudujWynikNowy, type WynikNowegoProgramu } from "@/lib/raport/nowy";
import { DO_RAPORTU, MAX_Z_KATEGORII, MIN_BEZ_STUDIOW } from "@/lib/engine/ranking-czynnosci";

const KOD_GRUPY = "TESTNOWY";

async function uczestnik(profil: ProfilTestowy, kod: string) {
  // Upsert, a nie „znajdz albo utworz": dwaj uczestnicy zakladani rownolegle
  // wchodzili sobie w droge na unikalnym kodzie grupy.
  const grupa = await prisma.grupa.upsert({
    where: { kod: KOD_GRUPY },
    create: { kod: KOD_GRUPY, nazwa: "Nowy program (automat)" },
    update: {},
  });
  await otworzSpotkanieNowe(grupa.id, 1);
  await otworzSpotkanieNowe(grupa.id, 2);

  const u = await prisma.uczestnik.upsert({
    where: { kodDostepu: kod },
    create: { grupaId: grupa.id, imie: `Nowy ${profil}`, kodDostepu: kod },
    update: { grupaId: grupa.id },
  });
  await wypelnijNowyProgram(u.id, profil);
  return u;
}

describe("wynik nowego programu", () => {
  let rzemieslnik: WynikNowegoProgramu;
  let spoleczny: WynikNowegoProgramu;

  beforeAll(async () => {
    const [a, b] = await Promise.all([
      uczestnik("rzemieslniczy", "NOWYTEST01"),
      uczestnik("spoleczny", "NOWYTEST02"),
    ]);
    rzemieslnik = await zbudujWynikNowy(a.id);
    spoleczny = await zbudujWynikNowy(b.id);
  });

  it("wszystkie cztery moduły są domknięte", () => {
    expect(rzemieslnik.domkniete).toEqual({ Z: true, L: true, U: true, F: true });
  });

  it("każdy tor daje piątkę w kolejności", () => {
    for (const tor of [rzemieslnik.ciekawosc, rzemieslnik.lubie, rzemieslnik.umiem]) {
      expect(tor.top5).toHaveLength(5);
      expect(tor.top5.map((p) => p.miejsce)).toEqual([1, 2, 3, 4, 5]);
      for (const p of tor.top5) expect(p.nazwa.length).toBeGreaterThan(3);
    }
  });

  it("poziom życia rośnie od minimum przez komfort do celu", () => {
    const p = rzemieslnik.poziom!;
    expect(p.minimum).toBeLessThan(p.komfort);
    expect(p.cel).toBeGreaterThanOrEqual(p.komfort);
    expect(p.kosztRoczny).toBe(p.komfort * 12);
  });

  it("nałożenie torów daje przynajmniej jedną niepustą listę", () => {
    expect(rzemieslnik.listy).toHaveLength(3);
    expect(rzemieslnik.listy.some((l) => l.pozycje.length > 0)).toBe(true);
  });

  it("lista zawodów ma właściwą długość i trzyma kwoty", () => {
    for (const w of [rzemieslnik, spoleczny]) {
      expect(w.zawody.length).toBeGreaterThanOrEqual(DO_RAPORTU.min);
      expect(w.zawody.length).toBeLessThanOrEqual(DO_RAPORTU.max);

      // Drogi bez studiow: zasada programu, nie preferencja.
      expect(w.zawody.filter((z) => z.bezStudiow).length).toBeGreaterThanOrEqual(MIN_BEZ_STUDIOW);

      // Roznorodnosc: bez limitu lista jest osmioma odmianami tej samej roboty.
      const wKategorii = new Map<string, number>();
      for (const z of w.zawody) {
        wKategorii.set(z.kategoriaWiodaca, (wKategorii.get(z.kategoriaWiodaca) ?? 0) + 1);
      }
      for (const [kat, ile] of wKategorii) {
        expect(ile, `${kat}`).toBeLessThanOrEqual(MAX_Z_KATEGORII);
      }

      // Zaden zawod nie powtarza sie na liscie.
      expect(new Set(w.zawody.map((z) => z.kod)).size).toBe(w.zawody.length);
    }
  });

  it("dwa różne profile dostają różne zawody", () => {
    const a = new Set(rzemieslnik.zawody.map((z) => z.kod));
    const b = spoleczny.zawody.map((z) => z.kod);
    const wspolne = b.filter((k) => a.has(k)).length;
    expect(wspolne).toBeLessThan(b.length / 2);
  });

  it("uczestnik bez ani jednej odpowiedzi nie dostaje zawodów, ale nie wywala strony", async () => {
    const grupa = await prisma.grupa.findUnique({ where: { kod: KOD_GRUPY } });
    const pusty = await prisma.uczestnik.upsert({
      where: { kodDostepu: "NOWYTEST03" },
      create: { grupaId: grupa!.id, imie: "Nowy pusty", kodDostepu: "NOWYTEST03" },
      update: {},
    });
    const w = await zbudujWynikNowy(pusty.id);
    expect(w.zawody).toEqual([]);
    expect(w.poziom).toBeNull();
    expect(w.domkniete).toEqual({ Z: false, L: false, U: false, F: false });
    expect(w.ciekawosc.top5).toEqual([]);
  });
});
