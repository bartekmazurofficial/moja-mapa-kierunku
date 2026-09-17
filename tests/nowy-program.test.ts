/**
 * Nowy program: cztery moduly zamiast osmiu.
 *
 * Testy pilnuja fundamentu, na ktorym stanie reszta: banki, lej, mostek do
 * istniejacej bazy zawodow, ranking i model poziomu zycia.
 *
 * Najwazniejszy jest tu mostek. Baza 157 zawodow zostaje nietknieta, wiec
 * caly nowy ranking stoi na tlumaczeniu szescdziesieciu czynnosci na
 * znaczniki, ktore w kartach juz sa. Gdyby to tlumaczenie mialo dziury,
 * czesc zawodow wypadlaby z rankingu bez sladu i nikt by tego nie zauwazyl.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/klient";
import { pobierzBazeReferencyjna } from "@/lib/db/repozytorium";
import { BANK_ZAINTERESOWAN } from "@/lib/content/bank-zainteresowan";
import { BANK_CZYNNOSCI, KATEGORIE_CZYNNOSCI } from "@/lib/content/bank-czynnosci";
import { KATEGORIE_AKTYWNE, POZYCJE_AUTO } from "@/lib/content/poziom-zycia";
import { LIMITY, policzLej, przetasuj, trzyListy } from "@/lib/moduly/lej";
import { MOSTEK, wagiZawodu, zgodnosc } from "@/lib/engine/mostek";
import { policzDopasowania, wybierzDoRaportu, MIN_BEZ_STUDIOW, MAX_Z_KATEGORII, DO_RAPORTU } from "@/lib/engine/ranking-czynnosci";
import { policzBudzet } from "@/lib/engine/budzet";
import { odczytajZarobki, dopasowanieFinansowe, punktyFinansowe } from "@/lib/engine/zarobki";
import { kwotaProgu } from "@/lib/engine/budzet";
import {
  bankModulu,
  czescEtapu,
  czescPoziomuB,
  czescUkladania,
  type ModulLeja,
} from "@/lib/moduly/ekrany-nowe";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW } from "@/lib/moduly/ekrany";
import { nastepnyEtap, numerEtapu, stanAssessmentu } from "@/lib/moduly/etapy";
import { pozycjaKompletna } from "@/lib/moduly/walidacja";
import type { BazaReferencyjna } from "@/lib/domain/typy";

let baza: BazaReferencyjna;
const WSZYSTKIE_CZYNNOSCI = BANK_CZYNNOSCI.map((c) => c.id);

beforeAll(async () => {
  baza = await pobierzBazeReferencyjna();
});

describe("banki", () => {
  it("bank zainteresowań ma sześćdziesiąt pozycji o kolejnych numerach", () => {
    expect(BANK_ZAINTERESOWAN).toHaveLength(60);
    expect(BANK_ZAINTERESOWAN.map((t) => t.id)).toEqual(
      Array.from({ length: 60 }, (_, i) => i + 1),
    );
  });

  it("bank czynności ma sześćdziesiąt pozycji i wszystkie osiem kategorii", () => {
    expect(BANK_CZYNNOSCI).toHaveLength(60);
    expect(BANK_CZYNNOSCI.map((c) => c.id)).toEqual(Array.from({ length: 60 }, (_, i) => i + 1));
    const uzyte = new Set(BANK_CZYNNOSCI.map((c) => c.kategoria));
    for (const k of KATEGORIE_CZYNNOSCI) expect(uzyte).toContain(k);
  });

  it("żadna nazwa się nie powtarza", () => {
    expect(new Set(BANK_CZYNNOSCI.map((c) => c.nazwa)).size).toBe(60);
    expect(new Set(BANK_ZAINTERESOWAN.map((t) => t.nazwa)).size).toBe(60);
  });
});

describe("lej: siła zależy od głębokości, na którą pozycja doszła", () => {
  const lej = {
    etap1: [1, 2, 3, 4, 5, 6, 7],
    etap2: [1, 2, 3, 4, 5],
    etap3: [1, 2, 3],
    kolejnosc: [3, 1, 2],
  };

  it("pozycje z TOP 5 dostają 100, 90, 80 według miejsca", () => {
    const w = policzLej(lej, WSZYSTKIE_CZYNNOSCI);
    expect(w.sila[3]).toBe(100);
    expect(w.sila[1]).toBe(90);
    expect(w.sila[2]).toBe(80);
  });

  it("etap drugi daje 45, pierwszy 25, brak zaznaczenia 0", () => {
    const w = policzLej(lej, WSZYSTKIE_CZYNNOSCI);
    expect(w.sila[4]).toBe(45);
    expect(w.sila[5]).toBe(45);
    expect(w.sila[6]).toBe(25);
    expect(w.sila[60]).toBe(0);
  });

  it("przeskok między etapem drugim a piątką jest większy niż między pierwszym a drugim", () => {
    const w = policzLej(lej, WSZYSTKIE_CZYNNOSCI);
    const zEtapu1Do2 = w.sila[4] - w.sila[6];
    const zEtapu2DoTop = w.sila[2] - w.sila[4];
    expect(zEtapu2DoTop).toBeGreaterThan(zEtapu1Do2);
  });

  it("TOP 5 wychodzi w kolejności wybranej przez uczestnika", () => {
    const w = policzLej(lej, WSZYSTKIE_CZYNNOSCI);
    expect(w.top5.map((p) => p.id)).toEqual([3, 1, 2]);
    expect(w.top5[0].miejsce).toBe(1);
  });

  it("limity są zgodne ze specyfikacją", () => {
    expect(LIMITY).toEqual({ etap1: 15, etap2: 8, etap3: 5 });
  });
});

describe("lej: przetasowanie banku dla modułu o umiejętnościach", () => {
  it("ten sam uczestnik widzi tę samą kolejność, inny widzi inną", () => {
    const a = przetasuj(WSZYSTKIE_CZYNNOSCI, "ABC123");
    const b = przetasuj(WSZYSTKIE_CZYNNOSCI, "ABC123");
    const c = przetasuj(WSZYSTKIE_CZYNNOSCI, "XYZ789");
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it("przetasowanie nie gubi ani nie dubluje pozycji", () => {
    const p = przetasuj(WSZYSTKIE_CZYNNOSCI, "ABC123");
    expect([...p].sort((x, y) => x - y)).toEqual(WSZYSTKIE_CZYNNOSCI);
  });

  it("kolejność faktycznie się zmienia", () => {
    expect(przetasuj(WSZYSTKIE_CZYNNOSCI, "ABC123")).not.toEqual(WSZYSTKIE_CZYNNOSCI);
  });
});

describe("trzy listy z nałożenia obu torów", () => {
  it("rozdziela lubię+umiem, do rozwoju i umiem bez chęci", () => {
    const lubie = { 1: 100, 2: 90, 3: 25, 4: 0 };
    const umiem = { 1: 90, 2: 25, 3: 100, 4: 0 };
    const l = trzyListy(lubie, umiem, [1, 2, 3, 4]);
    expect(l.lubieIUmiem).toEqual([1]);
    expect(l.doRozwoju).toEqual([2]);
    expect(l.umiemNieLubie).toEqual([3]);
  });

  it("pozycja słaba w obu torach nie trafia nigdzie", () => {
    const l = trzyListy({ 9: 25 }, { 9: 25 }, [9]);
    expect(l.lubieIUmiem.concat(l.doRozwoju, l.umiemNieLubie)).toEqual([]);
  });
});

describe("mostek na istniejącą bazę zawodów", () => {
  it("każda z sześćdziesięciu czynności ma wpis w mostku", () => {
    for (const c of BANK_CZYNNOSCI) expect(MOSTEK[c.id], c.nazwa).toBeDefined();
  });

  it("każdy zawód z bazy dostaje co najmniej kilka czynności", () => {
    const bez = baza.zawody.filter((z) => wagiZawodu(z).length < 3);
    expect(bez.map((z) => z.nazwaWyswietlana)).toEqual([]);
  });

  it("żadna czynność nie jest martwa: każda występuje w jakimś zawodzie", () => {
    const uzyte = new Set<number>();
    for (const z of baza.zawody) for (const w of wagiZawodu(z)) uzyte.add(w.czynnosc);
    const martwe = BANK_CZYNNOSCI.filter((c) => !uzyte.has(c.id));
    expect(martwe.map((c) => c.nazwa)).toEqual([]);
  });

  it("kompetencja wymagana waży więcej niż wspierająca", () => {
    const zawod = baza.zawody[0];
    const wagi = wagiZawodu(zawod);
    expect(Math.max(...wagi.map((w) => w.waga))).toBe(10);
  });

  it("zgodność liczy się jako średnia ważona, nie jako suma", () => {
    const wagi = [
      { czynnosc: 1, waga: 10 },
      { czynnosc: 2, waga: 5 },
    ];
    // Obie czynnosci na maksa: zgodnosc ma byc 100, a nie 150.
    expect(zgodnosc({ 1: 100, 2: 100 }, wagi)).toBe(100);
    // Tylko mocniejsza: wynik blizej 100 niz 50.
    expect(zgodnosc({ 1: 100, 2: 0 }, wagi)).toBeCloseTo(66.7, 0);
  });

  it("brak odpowiedzi daje zgodność zero, a nie błąd", () => {
    expect(zgodnosc({}, wagiZawodu(baza.zawody[0]))).toBe(0);
  });
});

describe("ranking zawodów", () => {
  /** Uczestnik techniczny: naprawianie, budowanie, sprzęt, problemy. */
  const lubie: Record<number, number> = { 12: 100, 13: 90, 14: 80, 2: 70, 3: 60, 1: 45, 5: 45 };
  const umiem: Record<number, number> = { 12: 90, 14: 100, 13: 70, 2: 60, 15: 60, 10: 45 };

  it("chęć waży więcej niż umiejętność", () => {
    const r = policzDopasowania({ 12: 100 }, {}, baza.zawody);
    const tylkoUmiem = policzDopasowania({}, { 12: 100 }, baza.zawody);
    const najlepszy = r[0];
    const ten = tylkoUmiem.find((x) => x.kod === najlepszy.kod)!;
    expect(najlepszy.dopasowanie).toBeGreaterThan(ten.dopasowanie);
  });

  it("zwraca wszystkie zawody, posortowane od najlepszego", () => {
    const r = policzDopasowania(lubie, umiem, baza.zawody);
    expect(r).toHaveLength(baza.zawody.length);
    for (let i = 1; i < r.length; i += 1) {
      expect(r[i - 1].dopasowanie).toBeGreaterThanOrEqual(r[i].dopasowanie);
    }
  });

  it("do raportu trafia od ośmiu do dziesięciu zawodów", () => {
    const wybrani = wybierzDoRaportu(policzDopasowania(lubie, umiem, baza.zawody));
    expect(wybrani.length).toBeGreaterThanOrEqual(DO_RAPORTU.min);
    expect(wybrani.length).toBeLessThanOrEqual(DO_RAPORTU.max);
  });

  it("w raporcie są co najmniej trzy drogi bez studiów", () => {
    const wybrani = wybierzDoRaportu(policzDopasowania(lubie, umiem, baza.zawody));
    expect(wybrani.filter((z) => z.bezStudiow).length).toBeGreaterThanOrEqual(MIN_BEZ_STUDIOW);
  });

  it("żadna kategoria czynności nie zajmuje więcej niż trzy miejsca", () => {
    const wybrani = wybierzDoRaportu(policzDopasowania(lubie, umiem, baza.zawody));
    const licznik = new Map<string, number>();
    for (const z of wybrani) licznik.set(z.kategoriaWiodaca, (licznik.get(z.kategoriaWiodaca) ?? 0) + 1);
    for (const [, ile] of licznik) expect(ile).toBeLessThanOrEqual(MAX_Z_KATEGORII);
  });

  it("nawet przy pustych odpowiedziach coś wychodzi: nigdy nie ma pustej listy", () => {
    const wybrani = wybierzDoRaportu(policzDopasowania({}, {}, baza.zawody));
    expect(wybrani.length).toBeGreaterThanOrEqual(DO_RAPORTU.min);
  });

  it("każdy wybrany zawód ma opisane, co się w tej pracy robi", () => {
    const wybrani = wybierzDoRaportu(policzDopasowania(lubie, umiem, baza.zawody));
    for (const z of wybrani) {
      expect(z.czynnosci.length, z.nazwa).toBeGreaterThan(0);
      expect(z.czynnosci[0].waga).toBeGreaterThanOrEqual(z.czynnosci[z.czynnosci.length - 1].waga);
    }
  });
});

describe("poziom życia", () => {
  it("dziesięć aktywnych decyzji, każda z dokładnie jednym progiem domyślnym", () => {
    expect(KATEGORIE_AKTYWNE).toHaveLength(10);
    for (const k of KATEGORIE_AKTYWNE) {
      expect(k.progi.filter((p) => p.domyslny), k.nazwa).toHaveLength(1);
    }
  });

  it("każdy próg mówi, co znaczy w praktyce, a nie tylko jak się nazywa", () => {
    for (const k of KATEGORIE_AKTYWNE) {
      for (const p of k.progi) expect(p.opis.length, `${k.nazwa} / ${p.nazwa}`).toBeGreaterThan(5);
    }
  });

  it("pozycje automatyczne sumują się do około dwóch tysięcy", () => {
    const suma = POZYCJE_AUTO.reduce((s, p) => s + p.kwota, 0);
    expect(suma).toBeGreaterThan(1800);
    expect(suma).toBeLessThan(2300);
  });

  it("da się przejść panel bez żadnej zmiany i dostać wynik", () => {
    const w = policzBudzet();
    expect(w.komfort).toBeGreaterThan(0);
    expect(w.zmienione).toBe(0);
  });

  it("minimum jest niższe od komfortu, a cel nie niższy od komfortu", () => {
    const w = policzBudzet();
    expect(w.minimum).toBeLessThan(w.komfort);
    expect(w.cel).toBeGreaterThanOrEqual(w.komfort);
  });

  it("cel rośnie tylko tam, gdzie uczestnik sam podniósł próg", () => {
    const bezZmian = policzBudzet();
    const zPodniesieniem = policzBudzet({
      wejscie: {},
      decyzje: { mieszkanie: "duze" },
      opcjonalne: {},
    });
    expect(bezZmian.cel).toBe(bezZmian.komfort);
    expect(zPodniesieniem.cel).toBeGreaterThan(zPodniesieniem.komfort);
  });

  it("przy najwyższym progu cel nie rośnie, bo nie ma dokąd", () => {
    const naSzczycie = policzBudzet({
      wejscie: {},
      decyzje: { mieszkanie: "premium" },
      opcjonalne: {},
    });
    expect(naSzczycie.cel).toBe(naSzczycie.komfort);
  });

  it("miasto działa jako mnożnik mieszkania", () => {
    const duze = policzBudzet({ wejscie: { miasto: "duze" }, decyzje: {}, opcjonalne: {} });
    const mala = policzBudzet({ wejscie: { miasto: "mala" }, decyzje: {}, opcjonalne: {} });
    expect(mala.komfort).toBeLessThan(duze.komfort);
  });

  it("dzieci liczą się osobno na każde", () => {
    const bez = policzBudzet();
    const jedno = policzBudzet({ wejscie: { dzieci: "1" }, decyzje: {}, opcjonalne: {} });
    const dwoje = policzBudzet({ wejscie: { dzieci: "2" }, decyzje: {}, opcjonalne: {} });
    expect(jedno.komfort - bez.komfort).toBeCloseTo(dwoje.komfort - jedno.komfort, -2);
  });

  it("ranking składników pokazuje, gdzie naprawdę leżą pieniądze", () => {
    const w = policzBudzet();
    expect(w.skladniki[0].kod).toBe("mieszkanie");
    expect(w.skladniki[0].udzial).toBeGreaterThan(20);
  });
});

describe("zarobki z kart zawodów", () => {
  it("odczytuje widełki z tabeli w karcie", () => {
    const z = odczytajZarobki(
      "| Etap | Widełki |\n|---|---|\n| Młodszy | **○**6000 do 9000 zł |\n| Starszy | **○**16 000 do 26 000 zł |",
    );
    expect(z).not.toBeNull();
    expect(z!.wierszy).toBe(2);
    // Brutto przeliczone na netto: nigdy nie pokazujemy kwoty brutto obok
    // kosztu życia, bo to dwie różne rzeczy.
    expect(z!.start).toBeLessThan(6000);
    expect(z!.szczyt).toBeLessThan(26000);
  });

  it("pomija stawki godzinowe i dzienne", () => {
    const z = odczytajZarobki(
      "| Etat w teatrze | **○**4500 do 9000 zł |\n| Dubbing, stawka godzinowa | **○**150 do 500 zł |",
    );
    expect(z!.wierszy).toBe(1);
  });

  it("pomija kwoty w obcej walucie", () => {
    const z = odczytajZarobki(
      "| Etat | **○**5500 do 8500 zł |\n| **Za granicą:** Niemcy **○**2400 do 3400 EUR netto |",
    );
    expect(z!.wierszy).toBe(1);
    expect(z!.start).toBe(Math.round(5500 * 0.72));
  });

  it("pomija przychód własnej działalności, bo to nie dochód", () => {
    const z = odczytajZarobki(
      "| Etat | **○**5500 do 8500 zł |\n| Własna działalność, przychód | **○**15 000 do 35 000 zł przychodu |",
    );
    expect(z!.wierszy).toBe(1);
  });

  it("karta bez widełek daje null, a nie zero", () => {
    expect(odczytajZarobki(null)).toBeNull();
    expect(odczytajZarobki("Nie mamy jeszcze danych.")).toBeNull();
  });

  it("większość kart z bazy ma czytelne widełki", async () => {
    const karty = await prisma.karta.findMany();
    let z = 0;
    for (const k of karty) {
      const s = (JSON.parse(k.sekcje) as Array<{ klucz: string | null; tresc: string }>).find(
        (x) => x.klucz === "pieniadze",
      );
      if (odczytajZarobki(s?.tresc)) z += 1;
    }
    expect(z).toBeGreaterThan(100);
  });
});

describe("dopasowanie finansowe", () => {
  const poziom = { minimum: 5000, komfort: 9000, cel: 13000 };

  it("zawód powyżej celu dostaje najwyższe pasmo", () => {
    const d = dopasowanieFinansowe({ start: 8000, typowy: 14000, szczyt: 20000, wierszy: 3, zmienny: false }, poziom);
    expect(d.pasmo).toBe("bardzo_wysokie");
  });

  it("zawód, który dochodzi do celu dopiero na szczycie, dostaje wysokie", () => {
    const d = dopasowanieFinansowe({ start: 4000, typowy: 8000, szczyt: 14000, wierszy: 3, zmienny: false }, poziom);
    expect(d.pasmo).toBe("wysokie");
  });

  it("zawód poniżej minimum dostaje najniższe pasmo, ale nie znika", () => {
    const d = dopasowanieFinansowe({ start: 3000, typowy: 3500, szczyt: 4000, wierszy: 2, zmienny: false }, poziom);
    expect(d.pasmo).toBe("bardzo_niskie");
    expect(d.komunikat).toContain("To nie znaczy, że jest zły");
  });

  it("brak widełek nie karze zawodu ani go nie premiuje", () => {
    expect(punktyFinansowe(dopasowanieFinansowe(null, poziom).pasmo)).toBe(50);
  });
});

/* ================================================================== */
/* EKRANY NOWYCH MODULOW                                               */
/* ================================================================== */

describe("ekrany czterech nowych modułów", () => {
  const MODULY: ModulLeja[] = ["Z", "L", "U"];

  it("każdy moduł leja ma cztery części: trzy etapy i układanie", () => {
    for (const m of MODULY) expect(CZESCI_MODULOW[m]).toEqual(["A", "B", "C", "D"]);
    expect(CZESCI_MODULOW.F).toEqual(["A", "B"]);
  });

  it("etap pierwszy pokazuje cały bank, kolejne tylko to, co przeszło", () => {
    for (const m of MODULY) {
      const bank = bankModulu(m);
      const etap1 = czescEtapu(m, 1, bank, "ziarno");
      const pozycja = etap1.ekrany.find((e) => e.pozycje?.length)!.pozycje![0];
      expect(pozycja.typ).toBe("lej");
      expect(pozycja.opcje).toHaveLength(bank.length);
      expect(pozycja.limit).toBe(LIMITY.etap1);

      const przeszlo = bank.slice(0, 15);
      const etap2 = czescEtapu(m, 2, przeszlo, "ziarno").ekrany[0].pozycje![0];
      expect(etap2.opcje).toHaveLength(15);
      expect(etap2.limit).toBe(LIMITY.etap2);
      // Lej zweza sie tylko w jedna strone: na etapie drugim nie moze pojawic
      // sie nic, czego nie bylo na pierwszym.
      const kody = new Set(etap2.opcje!.map((o) => o.kod));
      for (const k of kody) expect(przeszlo.map(String)).toContain(k);

      const etap3 = czescEtapu(m, 3, przeszlo.slice(0, 8), "ziarno").ekrany[0].pozycje![0];
      expect(etap3.opcje).toHaveLength(8);
      expect(etap3.limit).toBe(LIMITY.etap3);
    }
  });

  it("tasowanie banku jest różne dla dwóch uczestników i stałe dla jednego", () => {
    const kody = (ziarno: string) =>
      czescEtapu("L", 1, bankModulu("L"), ziarno).ekrany[1].pozycje![0].opcje!.map((o) => o.kod);
    expect(kody("uczestnik-a")).toEqual(kody("uczestnik-a"));
    expect(kody("uczestnik-a")).not.toEqual(kody("uczestnik-b"));
  });

  it("moduł Z kończy się obowiązkowym ekranem przejścia, pozostałe nie", () => {
    const z = czescUkladania("Z", [1, 2, 3, 4, 5]);
    expect(z.ekrany.some((e) => e.klucz === "Z_przejscie")).toBe(true);
    for (const m of ["L", "U"] as ModulLeja[]) {
      expect(czescUkladania(m, [1, 2, 3, 4, 5]).ekrany).toHaveLength(1);
    }
  });

  it("układanie prosi o dokładnie tyle pozycji, ile przeszło ostatni etap", () => {
    const pelna = czescUkladania("U", [1, 2, 3, 4, 5]).ekrany[0].pozycje![0];
    expect(pelna.typ).toBe("kolejnosc");
    expect(pelna.ile).toBe(5);
    // Uczestnik, ktory zaznaczyl mniej niz piec, ma ulozyc tyle, ile ma,
    // a nie utknac na ekranie, ktory czeka na piata pozycje.
    expect(czescUkladania("U", [1, 2, 3]).ekrany[0].pozycje![0].ile).toBe(3);
  });

  it("panel poziomu życia dostaje odpowiedzi wstępne i wolno go przejść bez zmian", () => {
    const panel = czescPoziomuB({ miasto: "warszawa", z_kim: "partner" }).ekrany[0].pozycje![0];
    expect(panel.typ).toBe("progi");
    expect(panel.wejscieBudzetu).toEqual({ miasto: "warszawa", z_kim: "partner" });
    expect(pozycjaKompletna(panel, undefined)).toBe(true);
  });

  it("etap leja bez zaznaczeń nie przepuszcza dalej, z zaznaczeniem przepuszcza", () => {
    const poz = czescEtapu("Z", 1, bankModulu("Z"), "x").ekrany[1].pozycje![0];
    expect(pozycjaKompletna(poz, [])).toBe(false);
    expect(pozycjaKompletna(poz, [3])).toBe(true);
  });

  it("niepełna kolejność nie przepuszcza dalej", () => {
    const poz = czescUkladania("L", [1, 2, 3, 4, 5]).ekrany[0].pozycje![0];
    expect(pozycjaKompletna(poz, [1, 2, 3])).toBe(false);
    expect(pozycjaKompletna(poz, [1, 2, 3, 4, 5])).toBe(true);
  });
});

describe("kwota progu w panelu zgadza się z sumą", () => {
  it("kwota progu uwzględnia miasto i liczbę osób", () => {
    const mieszkanie = KATEGORIE_AKTYWNE.find((k) => k.kod === "mieszkanie")!;
    const wWarszawie = kwotaProgu(mieszkanie, "dobre", { wejscie: { miasto: "warszawa" }, decyzje: {}, opcjonalne: {} });
    const wMalej = kwotaProgu(mieszkanie, "dobre", { wejscie: { miasto: "mala" }, decyzje: {}, opcjonalne: {} });
    expect(wWarszawie).toBeGreaterThan(wMalej);
    expect(wMalej).toBe(Math.round(3500 * 0.7));
  });

  it("zmiana progu podnosi sumę dokładnie o różnicę pokazaną przy progach", () => {
    const wejscie = { miasto: "duze" };
    const mieszkanie = KATEGORIE_AKTYWNE.find((k) => k.kod === "mieszkanie")!;
    const przed = policzBudzet({ wejscie, decyzje: {}, opcjonalne: {} });
    const po = policzBudzet({ wejscie, decyzje: { mieszkanie: "duze" }, opcjonalne: {} });
    const roznica =
      kwotaProgu(mieszkanie, "duze", { wejscie, decyzje: {}, opcjonalne: {} }) -
      kwotaProgu(mieszkanie, "dobre", { wejscie, decyzje: {}, opcjonalne: {} });
    expect(po.komfort - przed.komfort).toBe(roznica);
  });
});

/* ================================================================== */
/* JEDEN ASSESSMENT, CZTERY ETAPY                                      */
/* ================================================================== */

describe("stan assessmentu", () => {
  const pusty = new Map<string, Set<string>>();

  it("uczestnik bez ani jednej odpowiedzi zaczyna od etapu pierwszego", () => {
    const s = stanAssessmentu(pusty);
    expect(s.biezacy).toBe("Z");
    expect(s.ukonczonych).toBe(0);
    expect(s.rozpoczety).toBe(false);
    expect(s.gotowy).toBe(false);
    expect(s.etapy.map((e) => e.numer)).toEqual([1, 2, 3, 4]);
  });

  it("domknięty etap przesuwa na następny", () => {
    const z = new Map([["Z", new Set(CZESCI_MODULOW.Z)]]);
    const s = stanAssessmentu(z);
    expect(s.biezacy).toBe("L");
    expect(s.ukonczonych).toBe(1);
    expect(s.etapy[0].stan).toBe("gotowy");
    expect(s.etapy[1].stan).toBe("przed");
  });

  it("etap zaczęty, ale niedomknięty, jest bieżący", () => {
    const s = stanAssessmentu(new Map([["Z", new Set(["A"])]]), new Map([["Z", 3]]));
    expect(s.biezacy).toBe("Z");
    expect(s.etapy[0].stan).toBe("wtrakcie");
    expect(s.rozpoczety).toBe(true);
  });

  it("komplet czterech etapów kończy assessment", () => {
    const wszystkie = new Map(
      KOLEJNOSC_MODULOW.map((m) => [m, new Set(CZESCI_MODULOW[m])] as const),
    );
    const s = stanAssessmentu(wszystkie);
    expect(s.gotowy).toBe(true);
    expect(s.biezacy).toBeNull();
    expect(s.ukonczonych).toBe(4);
  });

  it("każdy etap poza ostatnim prowadzi w następny", () => {
    // To jest cala mechanika „jednego assessmentu": po etapie nie wraca sie
    // do spisu tresci, tylko idzie dalej.
    expect(nastepnyEtap("Z")).toBe("L");
    expect(nastepnyEtap("L")).toBe("U");
    expect(nastepnyEtap("U")).toBe("F");
    expect(nastepnyEtap("F")).toBeNull();
  });

  it("pieniądze są ostatnie, a „umiem” po „lubię”", () => {
    // Zapytanie o pieniadze wczesniej przestawia wszystkie poprzednie
    // odpowiedzi pod zarobki; kto najpierw powie, w czym jest dobry, ten
    // potem „lubi" dokladnie to samo.
    expect(numerEtapu("F")).toBe(4);
    expect(numerEtapu("U")).toBeGreaterThan(numerEtapu("L"));
  });
});
