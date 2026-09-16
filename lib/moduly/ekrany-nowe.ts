/**
 * EKRANY CZTERECH NOWYCH MODULOW.
 *
 * Trzy moduly leja (`Z` ciekawosc, `L` co lubie, `U` w czym jestem dobry) maja
 * dokladnie te sama mechanike i roznia sie wylacznie bankiem pozycji
 * i trescia trzech pytan. Dlatego jest tu jedna funkcja, ktora sklada etap,
 * a nie trzy prawie identyczne.
 *
 * Czwarty modul (`F` poziom zycia) to piec pytan wstepnych i jeden panel.
 *
 * Kazdy etap leja stoi w osobnej czesci modulu, bo etap drugi pokazuje
 * wylacznie to, co przeszlo pierwszy, i nie da sie go zbudowac przed
 * odpowiedzia. Serwer sklada czesc dopiero, kiedy uczestnik do niej dochodzi.
 */

import {
  BANK_ZAINTERESOWAN,
  EKRAN_PRZEJSCIA,
  INSTRUKCJA_ZAINTERESOWAN,
  ZAINTERESOWANIE_PO_ID,
} from "../content/bank-zainteresowan";
import {
  BANK_CZYNNOSCI,
  CZYNNOSC_PO_ID,
  INSTRUKCJA_LUBIE,
  INSTRUKCJA_UMIEM,
} from "../content/bank-czynnosci";
import {
  INSTRUKCJA_POZIOMU_ZYCIA,
  PYTANIA_WEJSCIOWE,
} from "../content/poziom-zycia";
import { LIMITY, przetasuj } from "./lej";
import type { CzescModulu, Ekran, KodModulu, OpcjaWyboru, Pozycja } from "./typy";

/** Moduly zbudowane na mechanice leja. */
export type ModulLeja = "Z" | "L" | "U";

/** Identyfikatory pozycji zapisywane w bazie. Etap i ulozona piatka. */
export const POZYCJE_LEJA = {
  etap1: "etap1",
  etap2: "etap2",
  etap3: "etap3",
  kolejnosc: "kolejnosc",
} as const;

interface TrescModulu {
  naglowek: string;
  wprowadzenie: readonly string[];
  etapy: {
    naglowek: string;
    podpis: string;
    limit: number;
  }[];
  ukladanie: { naglowek: string; podpis: string };
}

/** Bank i trzy pytania danego modulu, w jednym ksztalcie. */
function trescModulu(modul: ModulLeja): TrescModulu {
  if (modul === "Z") {
    const e = INSTRUKCJA_ZAINTERESOWAN.etapy;
    return {
      naglowek: INSTRUKCJA_ZAINTERESOWAN.naglowek,
      wprowadzenie: INSTRUKCJA_ZAINTERESOWAN.wprowadzenie,
      etapy: [e.z1, e.z2, e.z3],
      ukladanie: INSTRUKCJA_ZAINTERESOWAN.ukladanie,
    };
  }
  const i = modul === "L" ? INSTRUKCJA_LUBIE : INSTRUKCJA_UMIEM;
  return {
    naglowek: i.naglowek,
    wprowadzenie: i.wprowadzenie,
    etapy: [i.etapy.e1, i.etapy.e2, i.etapy.e3],
    ukladanie: i.ukladanie,
  };
}

/** Nazwa pozycji po numerze. Dwa banki, jeden odczyt. */
export function nazwaPozycji(modul: ModulLeja, id: number): string {
  const z = modul === "Z" ? ZAINTERESOWANIE_PO_ID.get(id) : CZYNNOSC_PO_ID.get(id);
  return z?.nazwa ?? String(id);
}

/** Wszystkie numery banku danego modulu. */
export function bankModulu(modul: ModulLeja): number[] {
  return (modul === "Z" ? BANK_ZAINTERESOWAN : BANK_CZYNNOSCI).map((p) => p.id);
}

function opcje(modul: ModulLeja, id: number[]): OpcjaWyboru[] {
  return id.map((x) => ({ kod: String(x), etykieta: nazwaPozycji(modul, x) }));
}

/**
 * Ekran wstepny modulu.
 *
 * Modul `U` dostaje dodatkowo zdanie o tym, ze lista jest ta sama co
 * w module `L`. Bez tego uczestnik uznaje przetasowana liste za nowa i szuka
 * roznic, ktorych nie ma.
 */
function wstepNowy(modul: ModulLeja, tresc: TrescModulu): Ekran {
  return {
    klucz: `${modul}_wstep`,
    typ: "wstep",
    naglowek: tresc.naglowek,
    akapity: [...tresc.wprowadzenie],
    przyciskDalej: "Zaczynamy",
  };
}

/**
 * Jeden etap leja.
 *
 * Etap pierwszy dostaje caly bank w kolejnosci przetasowanej ziarnem
 * uczestnika, kazdy nastepny wylacznie to, co przeszlo poprzedni, w tej samej
 * kolejnosci, w jakiej uczestnik to widzial. Przestawianie listy miedzy
 * etapami kazaloby szukac tych samych pozycji od nowa.
 */
export function czescEtapu(
  modul: ModulLeja,
  etap: 1 | 2 | 3,
  dostepne: number[],
  ziarno: string,
): CzescModulu {
  const tresc = trescModulu(modul);
  const t = tresc.etapy[etap - 1];
  const lista = etap === 1 ? przetasuj(dostepne, `${ziarno}:${modul}`) : dostepne;

  const pozycja: Pozycja = {
    id: etap === 1 ? POZYCJE_LEJA.etap1 : etap === 2 ? POZYCJE_LEJA.etap2 : POZYCJE_LEJA.etap3,
    typ: "lej",
    limit: t.limit,
    opcje: opcje(modul, lista),
  };

  const ekrany: Ekran[] = [];
  if (etap === 1) ekrany.push(wstepNowy(modul, tresc));
  ekrany.push({
    klucz: `${modul}_etap${etap}`,
    typ: "pozycje",
    naglowek: t.naglowek,
    podpis: t.podpis,
    pozycje: [pozycja],
    postep: { nr: etap, z: 4, slowo: "kroków" },
    przyciskDalej: "Dalej",
  });
  return { kod: String.fromCharCode(64 + etap), nazwa: `Etap ${etap}`, ekrany };
}

/**
 * Ostatnia czesc: ukladanie piatki w kolejnosci.
 *
 * Modul `Z` konczy sie dodatkowo ekranem przejscia do modulu `L`. Ten ekran
 * jest obowiazkowy i stoi wlasnie tu, a nie na wstepie `L`: uczestnik ma go
 * zobaczyc, zanim zamknie w glowie liste tematow, a nie po tym, jak juz
 * zaczal myslec o czynnosciach.
 */
export function czescUkladania(modul: ModulLeja, piatka: number[]): CzescModulu {
  const tresc = trescModulu(modul);
  const ekrany: Ekran[] = [
    {
      klucz: `${modul}_kolejnosc`,
      typ: "pozycje",
      naglowek: tresc.ukladanie.naglowek,
      podpis: tresc.ukladanie.podpis,
      pozycje: [
        {
          id: POZYCJE_LEJA.kolejnosc,
          typ: "kolejnosc",
          ile: Math.min(LIMITY.etap3, piatka.length),
          opcje: opcje(modul, piatka),
        },
      ],
      postep: { nr: 4, z: 4, slowo: "kroków" },
      przyciskDalej: modul === "Z" ? "Dalej" : "Zakończ moduł",
    },
  ];

  if (modul === "Z") {
    ekrany.push({
      klucz: "Z_przejscie",
      typ: "przerwa",
      naglowek: EKRAN_PRZEJSCIA.naglowek,
      akapity: [...EKRAN_PRZEJSCIA.akapity],
      przyciskDalej: EKRAN_PRZEJSCIA.przycisk,
    });
  }
  return { kod: "D", nazwa: "Twoja piątka", ekrany };
}

/* ================================================================== */
/* MODUL F: POZIOM ZYCIA                                               */
/* ================================================================== */

/**
 * Czesc A: piec pytan wstepnych.
 *
 * Kazde ma juz zaznaczona odpowiedz domyslna, bo od nich zalezy cala reszta
 * panelu, a uczestnik, ktory ich nie wypelni, dostalby kwoty dla singla
 * w duzym miescie bez wzgledu na to, jak chce zyc.
 */
export function czescPoziomuA(): CzescModulu {
  return {
    kod: "A",
    nazwa: "Zanim policzymy",
    ekrany: [
      {
        klucz: "F_wstep",
        typ: "wstep",
        naglowek: INSTRUKCJA_POZIOMU_ZYCIA.naglowek,
        akapity: [...INSTRUKCJA_POZIOMU_ZYCIA.wprowadzenie],
        przyciskDalej: "Zaczynamy",
      },
      // Pytanie stoi w tresci pozycji, a nie w naglowku ekranu: przy jednym
      // pytaniu na ekranie Runner bierze naglowek na nadpis, wiec to samo
      // zdanie staloby dwa razy jedno nad drugim.
      ...PYTANIA_WEJSCIOWE.map((p, i) => ({
        klucz: `F_${p.kod}`,
        typ: "pozycje" as const,
        pozycje: [
          {
            id: p.kod,
            typ: "pojedynczy" as const,
            tresc: p.pytanie,
            uklad: "karty" as const,
            opcje: p.opcje.map((o) => ({ kod: o.kod, etykieta: o.nazwa })),
          },
        ],
        postep: { nr: i + 1, z: PYTANIA_WEJSCIOWE.length, slowo: "pytań" },
      })),
    ],
  };
}

/**
 * Czesc B: panel.
 *
 * Odpowiedzi wstepne wchodza do definicji pozycji, bo panel liczy sume w
 * trakcie wypelniania i musi znac miasto oraz liczbe osob. Czesc A jest do
 * tego czasu domknieta, wiec sa juz w bazie.
 */
export function czescPoziomuB(wejscie: Record<string, string>): CzescModulu {
  return {
    kod: "B",
    nazwa: "Panel",
    ekrany: [
      {
        klucz: "F_panel",
        typ: "pozycje",
        naglowek: INSTRUKCJA_POZIOMU_ZYCIA.naglowekPanelu,
        podpis:
          "Każda pozycja ma już sensowną wartość. Zmieniasz tylko to, co chcesz mieć inaczej.",
        pozycje: [{ id: "panel", typ: "progi", wejscieBudzetu: wejscie, opcjonalna: true }],
        przyciskDalej: "Zakończ moduł",
      },
    ],
  };
}

/** Czesci nowych modulow, w kolejnosci. */
export const CZESCI_NOWE: Record<KodModulu | string, string[]> = {
  Z: ["A", "B", "C", "D"],
  L: ["A", "B", "C", "D"],
  U: ["A", "B", "C", "D"],
  F: ["A", "B"],
};
