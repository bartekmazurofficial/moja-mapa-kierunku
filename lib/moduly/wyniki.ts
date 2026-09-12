/**
 * Plansza wyników modułu: co uczestnik odpowiedział, w podziale na kategorie.
 *
 * To nie jest raport. Raport mówi, co z tego wynika dla zawodów, i otwiera się
 * warstwami. Tu chodzi o coś prostszego i dostępnego od razu: uczestnik widzi
 * własne odpowiedzi uporządkowane w kategorie, po kilka w rzędzie, i może
 * wrócić do modułu, żeby coś zmienić.
 *
 * Żadnych liczb dopasowania — tylko to, co sam wybrał.
 */

import "server-only";
import { zbierzOdpowiedzi } from "./zbieranie";
import { policzA1, policzA2, policzA3, policzA4, policzA5, policzM1 } from "../engine/moduly";
import {
  OBSZARY_A1,
  KOMPETENCJE_A2,
  WYMIARY_A3,
  WYMIARY_M1,
  WARTOSCI_A4,
  FILTRY_A5,
} from "../domain/slowniki";
import { OBSZARY_M1 } from "../content/m1";
import { etykietaM1, NAZWY_M1 } from "./ekrany";
import { CWIARTKI } from "../content/a2";
import type { KodModulu } from "./typy";

export interface KafelWyniku {
  klucz: string;
  ikona?: string;
  tytul: string;
  /** Krótka odpowiedź: biegun, poziom, wybór. Nigdy liczba dopasowania. */
  odpowiedz: string;
  /** Dopisek, gdy sama odpowiedź nie wystarcza. */
  podpis?: string;
  /** Wyróżnienie: to, co u uczestnika wyszło najmocniej. */
  mocne?: boolean;
}

export interface SekcjaWynikow {
  tytul: string;
  wstep?: string;
  kafle: KafelWyniku[];
}

export interface PlanszaWynikow {
  modul: KodModulu;
  gotowy: boolean;
  sekcje: SekcjaWynikow[];
}

/** Słowny opis miejsca na skali 0–100, bez podawania liczby. */
function pasmo(x: number): string {
  if (x >= 75) return "bardzo wysoko";
  if (x >= 60) return "wysoko";
  if (x >= 40) return "pośrodku";
  if (x >= 25) return "nisko";
  return "bardzo nisko";
}

export async function planszaWynikow(
  uczestnikId: string,
  modul: KodModulu,
): Promise<PlanszaWynikow> {
  const o = await zbierzOdpowiedzi(uczestnikId);

  if (modul === "A1") {
    const w = policzA1(o.a1);
    const posortowane = [...OBSZARY_A1].sort((a, b) => (w.z[b.id] ?? 0) - (w.z[a.id] ?? 0));
    const gotowy = Object.keys(o.a1.czescA ?? {}).length > 0;
    return {
      modul,
      gotowy,
      sekcje: [
        {
          tytul: "Dwadzieścia cztery obszary, od najmocniejszego",
          wstep: "To nie jest ranking zawodów, tylko to, do czego Cię ciągnie. Kolejność wyszła z Twoich wyborów w zestawach.",
          kafle: posortowane.map((obszar, i) => ({
            klucz: `a1-${obszar.id}`,
            ikona: `a1-${obszar.id}`,
            tytul: obszar.etykieta,
            odpowiedz: pasmo(w.z[obszar.id] ?? 0),
            podpis: w.ekspozycja[obszar.id] ? "próbowałeś tego" : "jeszcze nie próbowałeś",
            mocne: i < 5,
          })),
        },
      ],
    };
  }

  if (modul === "A2") {
    const w = policzA2(o.a2);
    const posortowane = [...KOMPETENCJE_A2].sort((a, b) => (w.k[b.id] ?? 0) - (w.k[a.id] ?? 0));
    const opisCwiartki = new Map(CWIARTKI.map((c) => [c.kod, c.etykieta]));
    return {
      modul,
      gotowy: Object.keys(o.a2.czescA ?? {}).length > 0,
      sekcje: [
        {
          tytul: "Trzydzieści kompetencji, od najmocniejszej",
          wstep: "Niskie miejsce nie jest wyrokiem. W Twoim wieku większość kompetencji dopiero się buduje.",
          kafle: posortowane.map((k, i) => ({
            klucz: `a2-${k.id}`,
            ikona: `a2-${k.id}`,
            tytul: k.nazwa,
            odpowiedz: pasmo(w.k[k.id] ?? 0),
            podpis:
              (w.dowody[k.id] ?? 0) > 0
                ? `${w.dowody[k.id]} ${w.dowody[k.id] === 1 ? "przykład" : "przykłady"} z życia`
                : opisCwiartki.get("raczej_nie") && i >= posortowane.length - 5
                  ? "do zbudowania"
                  : undefined,
            mocne: i < 5,
          })),
        },
      ],
    };
  }

  if (modul === "A3") {
    const w = policzA3(o.a3);
    return {
      modul,
      gotowy: Object.keys(o.a3.czescA ?? {}).length > 0,
      sekcje: [
        {
          tytul: "Trzynaście osi stylu działania",
          wstep: "Żaden biegun nie jest lepszy. Chodzi o to, w jakim otoczeniu będzie Ci naturalnie.",
          kafle: WYMIARY_A3.map((wym) => {
            const poz = w.pozycje[wym.kod] ?? 50;
            const sila = w.sila[wym.kod] ?? 0;
            return {
              klucz: `a3-${wym.kod}`,
              ikona: `a3-${wym.kod}`,
              tytul: `${wym.biegunA} albo ${wym.biegunB}`,
              odpowiedz: poz >= 50 ? wym.biegunA : wym.biegunB,
              podpis: sila >= 65 ? "warunek kluczowy" : poz >= 40 && poz <= 60 ? "bez wyraźnej strony" : undefined,
              mocne: sila >= 65,
            };
          }),
        },
      ],
    };
  }

  if (modul === "A4") {
    const w = policzA4(o.a4);
    const nazwa = new Map(WARTOSCI_A4.map((x) => [x.kod, x.nazwa]));
    // `rank` to miejsce w rankingu: im mniejsze, tym wazniejsza wartosc.
    const kolejnosc = [...WARTOSCI_A4].sort(
      (a, b) => (w.rank[a.kod] ?? 99) - (w.rank[b.kod] ?? 99),
    );
    return {
      modul,
      gotowy: Object.keys(o.a4.czescA ?? {}).length > 0,
      sekcje: [
        {
          tytul: "Dwanaście wartości, od najważniejszej",
          wstep: "Wszystkie są dobre. Pytanie brzmi, które z nich wygrywają, kiedy trzeba wybrać.",
          kafle: kolejnosc.map((v) => ({
            klucz: `a4-${v.kod}`,
            ikona: `a4-${v.kod}`,
            tytul: nazwa.get(v.kod) ?? v.kod,
            odpowiedz: w.progowe.includes(v.kod)
              ? "bez tego nie ma sensu"
              : w.top5.includes(v.kod)
                ? "wysoko"
                : w.bottom3.includes(v.kod)
                  ? "nisko"
                  : "pośrodku",
            mocne: w.progowe.includes(v.kod) || w.top5.includes(v.kod),
          })),
        },
      ],
    };
  }

  if (modul === "A5") {
    const w = policzA5(o.a5);
    const bloki = [...new Set(FILTRY_A5.map((f) => f.blok))];
    const slowo: Record<number, string> = { 1: "dam radę", 0.5: "zależy", 0: "to nie dla mnie" };
    return {
      modul,
      gotowy: Object.keys(o.a5.czescA ?? {}).length > 0,
      sekcje: bloki.map((b) => ({
        tytul: FILTRY_A5.find((f) => f.blok === b)!.nazwaBloku,
        kafle: FILTRY_A5.filter((f) => f.blok === b).map((f) => ({
          klucz: f.kod,
          ikona: `a5-${b}`,
          tytul: f.tekst,
          odpowiedz: w.weta.includes(f.kod) ? "wykluczone" : (slowo[w.g[f.kod] ?? 0.5] ?? "może"),
          mocne: w.weta.includes(f.kod),
        })),
      })),
    };
  }

  // M1
  const w = policzM1(o.m1);
  const czescB = o.m1.czescB ?? {};
  return {
    modul,
    gotowy: Object.keys(czescB).length > 0 || Object.keys(o.m1.czescA ?? {}).length > 0,
    sekcje: [
      {
        tytul: "Siedem obszarów, Twoimi słowami",
        wstep: "Jedyna część, której nikt nie policzy. To Twój tekst i zostaje Twój.",
        kafle: OBSZARY_M1.map((obszar) => {
          const tresc = czescB[obszar.nr];
          const napisane =
            typeof tresc === "string"
              ? tresc.trim()
              : Array.isArray(tresc)
                ? tresc.filter(Boolean).join(" · ")
                : "";
          return {
            klucz: `m1-${obszar.nr}`,
            ikona: `m1-${obszar.nr}`,
            tytul: obszar.tytul,
            odpowiedz: napisane.length > 0 ? napisane : "jeszcze nie wypełnione",
            mocne: napisane.length > 0,
          };
        }),
      },
      {
        tytul: "Kształt życia, z par zdań",
        wstep:
          "To wyszło z par, w których wybierałeś zdanie bliższe prawdzie o Tobie. " +
          "Żadna strona nie jest lepsza.",
        // Wymiar dwubiegunowy nie ma „wysoko” i „nisko”: ma stronę. Kod wymiaru
        // i słowo z pasma nie znaczyły dla uczestnika nic.
        kafle: WYMIARY_M1.filter((wym) => w.shape[wym.kod] !== null && w.shape[wym.kod] !== undefined)
          .map((wym) => ({
            klucz: `shape-${wym.kod}`,
            tytul: NAZWY_M1[wym.kod] ?? wym.kod,
            odpowiedz: etykietaM1(wym.kod, w.shape[wym.kod] ?? null),
            mocne: (w.shape[wym.kod] ?? 50) >= 75 || (w.shape[wym.kod] ?? 50) <= 25,
          }))
          .filter((k) => k.odpowiedz.length > 0),
      },
    ],
  };
}
