/**
 * Raport: reguly odslaniania, jezyk i zasady, ktorych nie wolno zlamac.
 * Testy akceptacyjne z rozdzialu 10 raport_struktura.md.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import { zbierzOdpowiedzi } from "@/lib/moduly/zbieranie";
import { zbudujRaport } from "@/lib/raport/budowa";
import { SEKCJE, SLOWA_ZAKAZANE, stopkaRaportu, WARSTWY } from "@/lib/raport/sekcje";
import { stanDostepu, odblokujWarstwe, zamknijWarstwe } from "@/lib/raport/dostep";
import type { BazaReferencyjna } from "@/lib/domain/typy";
import type { KompletOdpowiedzi } from "@/lib/engine/moduly";

let baza: BazaReferencyjna;
let odpowiedzi: KompletOdpowiedzi;
let karty: Map<string, { pelna: boolean }>;
let uczestnikId: string;
let grupaId: string;

const WSZYSTKIE = new Set(SEKCJE.map((s) => s.id));

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
  const uczestnik = await prisma.uczestnik.findFirstOrThrow({
    where: { kodDostepu: "3DEPKJBQW9" },
  });
  uczestnikId = uczestnik.id;
  grupaId = uczestnik.grupaId;
  odpowiedzi = await zbierzOdpowiedzi(uczestnik.id);
  const wiersze = await prisma.karta.findMany({ select: { kod: true, pelna: true } });
  karty = new Map(wiersze.map((k) => [k.kod, { pelna: k.pelna }]));
});

function raport(dostepne: Set<string> = WSZYSTKIE) {
  return zbudujRaport({ imie: "Ania", odpowiedzi, baza, karty, dostepne });
}

describe("struktura raportu", () => {
  it("dwadzieścia sekcji plus punkt startu, w pięciu warstwach", () => {
    expect(SEKCJE).toHaveLength(22);
    const numery = SEKCJE.map((s) => s.numer).filter((n): n is number => n !== null);
    expect(new Set(numery).size).toBe(numery.length);
    expect(Math.max(...numery)).toBe(20);
    expect(WARSTWY).toHaveLength(6);
  });

  it("sekcja wizji życia jest dostępna od razu, bo to własny tekst uczestnika", () => {
    expect(SEKCJE.find((s) => s.id === "wizja_zycia")?.warstwa).toBe("ZAWSZE");
  });
});

describe("odsłanianie warstw jest egzekwowane po stronie serwera", () => {
  it("zamknięta warstwa nie przepuszcza swoich sekcji", async () => {
    await zamknijWarstwe(grupaId, "W4B");
    const stan = await stanDostepu(uczestnikId, grupaId);
    expect(stan.dostepne.has("zawody")).toBe(false);
    expect(stan.dostepne.has("trzy_drogi")).toBe(false);
    await odblokujWarstwe(grupaId, "W4B");
    const po = await stanDostepu(uczestnikId, grupaId);
    expect(po.dostepne.has("zawody")).toBe(true);
  });

  it("sekcja z zamkniętej warstwy nie powstaje w raporcie, nie jest tylko ukryta", () => {
    const bez = raport(new Set(["punkt_startu"]));
    expect(bez.zawody).toBeUndefined();
    expect(bez.trzy_drogi).toBeUndefined();
    expect(bez.obszary).toBeUndefined();
    expect(JSON.stringify(bez)).not.toContain("Rzemios");
  });

  it("blokada z modułu A2 zamyka sekcje oparte na A1 i A3", async () => {
    const uczestnik = await prisma.uczestnik.findFirstOrThrow({ where: { kodDostepu: "THJBQW2AJA" } });
    await prisma.odpowiedz.deleteMany({
      where: { uczestnikId: uczestnik.id, modul: "A2", czesc: "B", pozycja: "__zakonczono" },
    });
    const stan = await stanDostepu(uczestnik.id, uczestnik.grupaId);
    expect(stan.blokadaA2).toBe(true);
    expect(stan.dostepne.has("co_mnie_interesuje")).toBe(false);
    expect(stan.dostepne.has("jak_dzialam")).toBe(false);
  });
});

describe("zasady, których nie wolno złamać", () => {
  it("nigdzie w raporcie nie pojawia się liczba dopasowania", () => {
    const tekst = JSON.stringify(raport());
    // Pasma opisowe, nigdy punkty.
    expect(tekst).not.toMatch(/"wynik":\s*\d/);
    expect(tekst).not.toMatch(/\d+\s*(punkt|pkt|%)/i);
    expect(tekst).toContain("bardzo mocne dopasowanie");
  });

  it("tekst generowany przez aplikację nie zawiera słów zakazanych", () => {
    // Sprawdzamy wylacznie zdania, ktore sklada aplikacja. Tresci cytowane
    // doslownie z dokumentacji (opisy klastrow, karty, slowa uczestnika) maja
    // wlasnego autora i nie podlegaja tej regule: slowo "diagnoza" w zdaniu
    // o diagnozowaniu usterek znaczy co innego niz diagnoza czlowieka.
    const r = raport();
    const generowane = [
      ...(r.profil_w_jednym_ekranie?.zdania ?? []),
      r.co_mnie_interesuje?.zdanie ?? "",
      r.co_mnie_interesuje?.osie ?? "",
      r.w_czym_dobry?.zdanie ?? "",
      r.jak_dzialam?.zdanie ?? "",
      r.obszary?.komunikatNieostry ?? "",
      r.kierunki?.komunikat ?? "",
      ...(r.trzy_drogi?.flagi ?? []),
      ...(r.czego_unikac?.pozycje ?? []).map((p) => p.komunikat),
      r.stopka,
    ]
      .join(" ")
      .toLowerCase();
    for (const slowo of SLOWA_ZAKAZANE) {
      expect(generowane, slowo).not.toContain(slowo.toLowerCase());
    }
  });

  it("nie ma porównania z grupą", () => {
    // Tu sprawdzamy caly raport, takze teksty cytowane z dokumentacji: regula 2
    // nie zna wyjatku dla autora. „Lepiej niz wiekszosci" przeszlo poprzednia
    // wersje tej listy, bo lista byla za waska.
    const tekst = JSON.stringify(raport()).toLowerCase();
    const porownania = [
      "niż inni",
      "niż większość",
      "niż większości",
      "niż pozostali",
      "niż reszta",
      "przeciętn",
      "percentyl",
      "na tle grupy",
      "średnia grupy",
      "twoja pozycja w grupie",
      "w porównaniu z innymi",
    ];
    for (const fraza of porownania) {
      expect(tekst, fraza).not.toContain(fraza);
    }
  });

  it("punkt startu nie wyprzedza sekcji obszarów", () => {
    const przed = zbudujRaport({
      imie: "Ania",
      odpowiedzi,
      baza,
      karty,
      dostepne: new Set(["punkt_startu"]),
    });
    expect(JSON.stringify(przed)).not.toContain("Rzemios");
    const po = raport();
    expect(JSON.stringify(po.punkt_startu)).toContain("Rzemios");
  });

  it("uczestnik nie widzi listy zawodów usuniętych przez weto", () => {
    const r = raport();
    const tekst = JSON.stringify(r);
    expect(tekst).not.toContain("usunieteWetem");
    expect(tekst).not.toContain("Pielęgniarka");
  });

  it("lista dróg bez studiów jest w raporcie niezależnie od profilu", () => {
    const r = raport();
    expect(r.kierunki?.drogiBezStudiow.length ?? 0).toBeGreaterThan(0);
  });

  it("blok „kierunek to nie zawód” jest w raporcie", () => {
    expect(raport().kierunki?.kierunekToNieZawod).toContain("Wybierasz zestaw drzwi");
  });

  it("sekcja wizji życia cytuje tekst uczestnika dosłownie", () => {
    const r = raport();
    const wszystkie = (r.wizja_zycia?.obszary ?? []).flatMap((o) => o.tresc);
    const zOdpowiedzi = Object.values(odpowiedzi.m1.czescB)
      .flatMap((v) => (Array.isArray(v) ? (v as string[]) : [v as string]))
      .filter((x) => typeof x === "string" && x.trim().length > 0);
    for (const t of wszystkie) expect(zOdpowiedzi).toContain(t);
  });

  it("niskie kompetencje pojawiają się tylko jako lista do nauczenia się", () => {
    const r = raport();
    const tekst = JSON.stringify(r.w_czym_dobry);
    expect(tekst).not.toMatch(/jesteś słaby|nie potrafisz|braki/i);
    expect(r.w_czym_dobry?.ramka).toContain("To nie jest wyrok");
  });

  it("stopka mówi, z kiedy jest raport", () => {
    const s = stopkaRaportu(new Date(2026, 8, 11));
    expect(s).toContain("wrześniu 2026");
    expect(s).toContain("Ludzie się zmieniają");
  });
});

describe("prezentacja zawodów", () => {
  it("klaster jest jedną pozycją z pytaniem rozstrzygającym", () => {
    const r = raport();
    const klastry = (r.zawody?.pozycje ?? []).filter((p) => p.typ === "klaster");
    expect(klastry.length).toBeGreaterThan(0);
    for (const k of klastry) {
      expect(k.pytanieRozstrzygajace?.length ?? 0).toBeGreaterThan(10);
      expect(k.zawody.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("każda pozycja ma pasmo opisowe zamiast liczby", () => {
    for (const p of raport().zawody?.pozycje ?? []) {
      expect(p.pasmoOpis.length).toBeGreaterThan(5);
      expect(p.pasmoOpis).not.toMatch(/\d/);
    }
  });

  it("ostrzeżenie antyprofilowe jest zdaniem zapraszającym do rozmowy", () => {
    const ostrzezenia = (raport().zawody?.pozycje ?? [])
      .flatMap((p) => p.zawody)
      .flatMap((z) => z.ostrzezenia);
    for (const o of ostrzezenia) {
      expect(o).toContain("sesji indywidualnej");
      expect(o).not.toMatch(/nie nadajesz się|odradzamy/i);
    }
  });

  it("trzy drogi mają równorzędne role, nie ranking", () => {
    const drogi = raport().trzy_drogi?.drogi ?? [];
    expect(drogi.length).toBeGreaterThanOrEqual(2);
    for (const d of drogi) {
      expect(d.zawody.length).toBeGreaterThan(0);
      expect(d.obszar.length).toBeGreaterThan(3);
    }
  });

  it("każda droga ma własne umiejętności, a pierwszy krok stoi raz", () => {
    const sekcja = raport().trzy_drogi;
    expect(sekcja?.pierwszyKrok).toBeTruthy();
    const listy = (sekcja?.drogi ?? []).map((d) => d.umiejetnosci.join("|"));
    expect(listy.every((l) => l.length > 0)).toBe(true);
    // Trzy identyczne listy oznaczalyby, ze licza sie z profilu, a nie z obszaru.
    expect(new Set(listy).size).toBeGreaterThan(1);
  });
});
