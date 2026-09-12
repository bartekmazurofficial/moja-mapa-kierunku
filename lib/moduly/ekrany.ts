/**
 * Budowanie ekranow modulu.
 *
 * Modul dzieli sie na czesci. Czesci zalezne od wyniku wczesniejszej czesci
 * (kotwice A3, test kosztu A4, ekran wet A5, szkice M1) sa budowane na
 * serwerze, kiedy uczestnik do nich dojdzie - inaczej nie da sie ich ulozyc.
 */

import { BLOKI_A1, INSTRUKCJA_A1 } from "../content/a1";
import { BLOKI_A2, DOWODY_A2, INSTRUKCJA_A2 } from "../content/a2";
import { KOTWICE_A3, PARY_A3, INSTRUKCJA_A3 } from "../content/a3";
import { BRZMIENIA_A4, PARY_A4, TEST_KOSZTU, INSTRUKCJA_A4 } from "../content/a4";
import { INSTRUKCJA_A5, ODPOWIEDZI_A5, ZDANIA_A5 } from "../content/a5";
import { INSTRUKCJA_M1, OBSZARY_M1, PARY_M1 } from "../content/m1";
import { PYTANIA_A0, INSTRUKCJA_A0 } from "../content/a0";
import { FILTRY_A5, OBSZARY_A1, KOMPETENCJE_A2, WARTOSCI_A4, WYMIARY_M1 } from "../domain/slowniki";
import type { CzescModulu, Ekran, KodModulu, Pozycja } from "./typy";
import type { PlanModulu } from "./plan";

/** Wynik czesci wczesniejszych, potrzebny do zbudowania czesci zaleznych. */
export interface KontekstModulu {
  /** A3: biegun, ktory wyszedl na kazdym wymiarze. */
  a3Bieguny?: Record<string, "A" | "B">;
  /** A4: najwyzsza wartosc uczestnika. */
  a4Najwyzsza?: string;
  /** A5: pozycje z odpowiedzia NIE, jedyne, ktore moga dostac weto. */
  a5Odmowy?: string[];
  /** M1: szkice do siedmiu obszarow, generowane z czesci A. */
  m1Szkice?: Record<number, string>;
  /** M1: warunki srodowiskowe z A3, pokazywane w obszarze 2. */
  a3Warunki?: string[];
}

export const NAZWY_MODULOW: Record<KodModulu, string> = {
  A0: "Punkt startu",
  A1: "Co mnie ciągnie",
  A2: "W czym mogę być dobry",
  A3: "Jak naturalnie działam",
  A4: "Co jest dla mnie ważne",
  A5: "Filtry rzeczywistości",
  M1: "Jakiego życia chcesz",
};

/**
 * Kolejnosc modulow zgodna ze scenariuszami czterech spotkan.
 * Na spotkaniu trzecim: wartosci, przerwa, wizja zycia, filtry. A5 musi isc
 * po M1, bo jego wlasna instrukcja zaczyna sie od „Przed chwila opisales,
 * jak chcesz zyc".
 */
export const KOLEJNOSC_MODULOW: KodModulu[] = ["A0", "A1", "A3", "A2", "A4", "M1", "A5"];

function wstep(
  modul: KodModulu,
  instrukcja: { naglowek: string; wprowadzenie: readonly string[]; rozwiniecie?: readonly string[] },
): Ekran {
  return {
    klucz: `${modul}_wstep`,
    typ: "wstep",
    naglowek: instrukcja.naglowek,
    akapity: [...instrukcja.wprowadzenie],
    rozwiniecie: instrukcja.rozwiniecie ? [...instrukcja.rozwiniecie] : undefined,
    przyciskDalej: "Zaczynamy",
  };
}

// =====================================================================
// A0
// =====================================================================

function czescA0(): CzescModulu {
  const ekrany: Ekran[] = [wstep("A0", INSTRUKCJA_A0)];
  const bloki = [...new Set(PYTANIA_A0.map((p) => p.blok))];

  for (const blok of bloki) {
    const pytania = PYTANIA_A0.filter((p) => p.blok === blok);
    for (const pytanie of pytania) {
      const pozycja: Pozycja = {
        id: pytanie.id,
        typ:
          pytanie.typ === "pojedynczy"
            ? "pojedynczy"
            : pytanie.typ === "tekst"
              ? "tekst"
              : "wielokrotny",
        tresc: pytanie.tresc,
        podpis: pytanie.podpis,
        opcje: pytanie.opcje?.map((o) => ({
          kod: o.kod,
          etykieta: o.etykieta,
          wylaczna: o.odmowa || o.kod === "brak" || o.kod === "nic" || o.kod === "nie_wiem",
        })),
        dokladnie: pytanie.typ === "dokladnie_trzy" ? 3 : undefined,
        opcjonalna: pytanie.opcjonalne,
        warunek: pytanie.tylkoEtapy ? { pozycja: "etap", wartosci: pytanie.tylkoEtapy } : undefined,
      };
      ekrany.push({
        klucz: `A0_${pytanie.id}`,
        typ: "pozycje",
        naglowek: pytanie.nazwaBloku,
        kolor: `a0-${blok}`,
        pozycje: [pozycja],
        warunek: pozycja.warunek,
      });
    }
  }
  return { kod: "A", nazwa: "Punkt startu", ekrany };
}

// =====================================================================
// A1
// =====================================================================

function czescA1A(plan: PlanModulu): CzescModulu {
  const ekrany: Ekran[] = [wstep("A1", INSTRUKCJA_A1)];
  const poIndeksie = new Map(BLOKI_A1.map((b) => [String(b.index), b]));

  plan.kolejnosc.forEach((klucz, i) => {
    const blok = poIndeksie.get(klucz);
    if (!blok) return;
    const kolejnoscOpcji = plan.wewnatrz[klucz] ?? blok.pozycje.map((p) => p.id);
    const opcje = kolejnoscOpcji
      .map((id) => blok.pozycje.find((p) => p.id === id))
      .filter((p): p is (typeof blok.pozycje)[number] => Boolean(p))
      // Znak bierze sie z obszaru, nie z pozycji: 24 znaki na 144 pozycje,
      // a w jednym zestawie cztery pozycje to cztery rozne obszary.
      .map((p) => ({ kod: p.id, etykieta: p.tekst, ikona: `a1-${p.obszar}` }));
    ekrany.push({
      klucz: `A1_blok_${blok.index}`,
      typ: "pozycje",
      polecenie: INSTRUKCJA_A1.polecenieBloku,
      pozycje: [
        {
          id: `blok_${blok.index}`,
          typ: "ranking4",
          opcje,
          krance: [...INSTRUKCJA_A1.krancePozycji] as [string, string],
        },
      ],
      postep: { nr: i + 1, z: plan.kolejnosc.length, slowo: "zestawów" },
    });
  });

  ekrany.push({
    klucz: "A1_przejscie",
    typ: "przerwa",
    naglowek: INSTRUKCJA_A1.przejscie,
    przyciskDalej: "Dalej",
  });
  return { kod: "A", nazwa: "Zestawy czynności", ekrany };
}

function czescA1B(plan: PlanModulu): CzescModulu {
  // Kolejnosc 24 kotwic losowa dla kazdego uczestnika i utrwalona razem z planem.
  const kolejnosc = plan.kotwice ?? OBSZARY_A1.map((o) => String(o.id));
  const poId = new Map(OBSZARY_A1.map((o) => [String(o.id), o]));
  const pozycje: Pozycja[] = kolejnosc
    .map((id) => poId.get(id))
    .filter((o): o is (typeof OBSZARY_A1)[number] => Boolean(o))
    .map((o) => ({
      id: `kotwica_${o.id}`,
      ikona: `a1-${o.id}`,
      typ: "kotwica",
      tresc: o.kotwica,
      krance: [INSTRUKCJA_A1.kotwiceSkala[0], INSTRUKCJA_A1.kotwiceSkala[4]],
      pytanieEkspozycja: INSTRUKCJA_A1.ekspozycjaTak,
    }));
  return {
    kod: "B",
    nazwa: "Kotwice",
    ekrany: [
      {
        klucz: "A1_kotwice",
        typ: "pozycje",
        naglowek: INSTRUKCJA_A1.kotwiceNaglowek,
        podpis:
          "Przy każdej pozycji zaznacz też, czy już czegoś takiego próbowałeś. To nie jest ocena. Chodzi o to, żeby odróżnić wyobrażenie od doświadczenia.",
        pozycje,
        skupiskaCo: 5,
        przyciskDalej: "Zakończ moduł",
      },
    ],
  };
}

// =====================================================================
// A2
// =====================================================================

function czescA2A(plan: PlanModulu): CzescModulu {
  const ekrany: Ekran[] = [wstep("A2", INSTRUKCJA_A2)];
  const poIndeksie = new Map(BLOKI_A2.map((b) => [String(b.index), b]));

  plan.kolejnosc.forEach((klucz, i) => {
    const blok = poIndeksie.get(klucz);
    if (!blok) return;
    const kolejnoscOpcji = plan.wewnatrz[klucz] ?? blok.pozycje.map((p) => p.id);
    const opcje = kolejnoscOpcji
      .map((id) => blok.pozycje.find((p) => p.id === id))
      .filter((p): p is (typeof blok.pozycje)[number] => Boolean(p))
      .map((p) => ({ kod: p.id, etykieta: p.tekst, ikona: `a2-${p.kompetencja}` }));
    ekrany.push({
      klucz: `A2_blok_${blok.index}`,
      typ: "pozycje",
      polecenie: INSTRUKCJA_A2.polecenieBloku,
      pozycje: [
        {
          id: `blok_${blok.index}`,
          typ: "ranking4",
          opcje,
          krance: [...INSTRUKCJA_A2.krancePozycji] as [string, string],
        },
      ],
      postep: { nr: i + 1, z: plan.kolejnosc.length, slowo: "zestawów" },
    });
    // Przerwa obowiazkowa po 23 blokach: bez niej jakosc drugiej polowy spada.
    if (i === 22) {
      ekrany.push({
        klucz: "A2_przerwa",
        typ: "przerwa",
        naglowek: INSTRUKCJA_A2.przerwa,
        przyciskDalej: "Dalej",
      });
    }
  });
  return { kod: "A", nazwa: "Zestawy zadań", ekrany };
}

function czescA2B(): CzescModulu {
  const ekrany: Ekran[] = [];
  for (let strona = 0; strona < 3; strona++) {
    const kompetencje = KOMPETENCJE_A2.slice(strona * 10, strona * 10 + 10);
    ekrany.push({
      klucz: `A2_dowody_${strona + 1}`,
      typ: "pozycje",
      naglowek: INSTRUKCJA_A2.dowodyNaglowek,
      podpis: strona === 0 ? INSTRUKCJA_A2.dowodyPodtytul : undefined,
      pozycje: kompetencje.map((k) => ({
        id: `dowody_${k.id}`,
        ikona: `a2-${k.id}`,
        typ: "dowody",
        tresc: k.nazwa,
        podpis: k.opis,
        pola: [...DOWODY_A2],
        opcjonalna: true,
      })),
      postep: { nr: strona + 1, z: 3, slowo: "części" },
      przyciskDalej: strona === 2 ? "Zakończ moduł" : "Dalej",
    });
  }
  return { kod: "B", nazwa: "Dowody", ekrany };
}

// =====================================================================
// A3
// =====================================================================

function czescA3A(plan: PlanModulu): CzescModulu {
  const ekrany: Ekran[] = [wstep("A3", INSTRUKCJA_A3)];
  const poId = new Map(PARY_A3.map((p) => [p.id, p]));

  plan.kolejnosc.forEach((id, i) => {
    const para = poId.get(id);
    if (!para) return;
    const odwrocona = plan.odwrocone[id] ?? false;
    const a = { kod: "A", tekst: para.biegunA };
    const b = { kod: "B", tekst: para.biegunB };
    ekrany.push({
      klucz: `A3_${id}`,
      typ: "pozycje",
      polecenie: INSTRUKCJA_A3.polecenieBloku,
      // Ilustracja osi, nie bieguna: jeden obraz na piec par tej samej osi.
      ikona: `a3-${para.wymiar}`,
      pozycje: [
        { id, typ: "para", stronaA: odwrocona ? b : a, stronaB: odwrocona ? a : b },
      ],
      postep: { nr: i + 1, z: plan.kolejnosc.length, slowo: "par" },
    });
  });
  return { kod: "A", nazwa: "Pary", ekrany };
}

function czescA3B(kontekst: KontekstModulu): CzescModulu {
  const bieguny = kontekst.a3Bieguny ?? {};
  const pozycje: Pozycja[] = KOTWICE_A3.map((k) => ({
    id: `kotwica_${k.wymiar}`,
    ikona: `a3-${k.wymiar}`,
    typ: "skala5",
    tresc: `${INSTRUKCJA_A3.kotwicePrefiks} ${bieguny[k.wymiar] === "B" ? k.tekstB : k.tekstA}`,
    krance: [INSTRUKCJA_A3.kotwiceSkala[0], INSTRUKCJA_A3.kotwiceSkala[4]],
  }));
  return {
    kod: "B",
    nazwa: "Kotwice ważności",
    ekrany: [
      {
        klucz: "A3_kotwice",
        typ: "pozycje",
        naglowek: INSTRUKCJA_A3.kotwiceNaglowek,
        podpis:
          "Wiemy już, gdzie jesteś na każdej z dwunastu osi. Teraz pytamy o coś innego: na ilu z nich naprawdę Ci zależy.",
        pozycje,
        przyciskDalej: "Zakończ moduł",
      },
    ],
  };
}

// =====================================================================
// A4
// =====================================================================

function czescA4A(plan: PlanModulu): CzescModulu {
  const ekrany: Ekran[] = [wstep("A4", INSTRUKCJA_A4)];
  const poNumerze = new Map(PARY_A4.map((p) => [String(p.nr), p]));

  plan.kolejnosc.forEach((klucz, i) => {
    const para = poNumerze.get(klucz);
    if (!para) return;
    const odwrocona = plan.odwrocone[klucz] ?? false;
    const a = { kod: para.lewa, tekst: BRZMIENIA_A4[para.lewa] };
    const b = { kod: para.prawa, tekst: BRZMIENIA_A4[para.prawa] };
    ekrany.push({
      klucz: `A4_para_${para.nr}`,
      typ: "pozycje",
      polecenie: INSTRUKCJA_A4.polecenieBloku,
      kolor: `a4-${para.lewa}`,
      pozycje: [
        { id: `para_${para.nr}`, typ: "para", stronaA: odwrocona ? b : a, stronaB: odwrocona ? a : b },
      ],
      postep: { nr: i + 1, z: plan.kolejnosc.length, slowo: "par" },
    });
  });
  return { kod: "A", nazwa: "Pary wartości", ekrany };
}

function czescA4B(): CzescModulu {
  return {
    kod: "B",
    nazwa: "Trzy nieodzowne",
    ekrany: [
      {
        klucz: "A4_nieodzowne",
        typ: "pozycje",
        naglowek: INSTRUKCJA_A4.nieodzowneNaglowek,
        pozycje: [
          {
            id: "nieodzowne",
            typ: "wielokrotny",
            tresc: INSTRUKCJA_A4.nieodzownePolecenie,
            maksWyborow: 3,
            opcjonalna: true,
            opcje: WARTOSCI_A4.map((w) => ({
              kod: w.kod,
              etykieta: w.nazwa,
              podpis: w.znaczenie,
              ikona: `a4-${w.kod}`,
            })),
          },
        ],
        przyciskDalej: "Dalej",
      },
    ],
  };
}

function czescA4C(kontekst: KontekstModulu): CzescModulu {
  const najwyzsza = kontekst.a4Najwyzsza ?? "WOL";
  const nazwa = WARTOSCI_A4.find((w) => w.kod === najwyzsza)?.nazwa ?? "";
  const uzyte = new Set([najwyzsza]);
  const pytania: Array<{ kod: string; tekst: string }> = [];
  for (const p of TEST_KOSZTU.pytania) {
    if (uzyte.has(p.kod)) continue;
    uzyte.add(p.kod);
    pytania.push(p);
  }
  for (const z of TEST_KOSZTU.zamienniki) {
    if (pytania.length >= 4) break;
    if (uzyte.has(z.kod)) continue;
    uzyte.add(z.kod);
    pytania.push(z);
  }

  return {
    kod: "C",
    nazwa: "Test kosztu",
    ekrany: [
      {
        klucz: "A4_koszt",
        typ: "pozycje",
        naglowek: INSTRUKCJA_A4.kosztNaglowek,
        podpis: `Twoja najwyższa wartość to: ${nazwa.toLowerCase()}. ${TEST_KOSZTU.wstep}`,
        pozycje: pytania.slice(0, 4).map((p, i) => ({
          id: `koszt_${i + 1}`,
          typ: "pojedynczy",
          tresc: `Czy zrezygnowałbyś dla niej z ${p.tekst}?`,
          opcje: TEST_KOSZTU.odpowiedzi.map((o) => ({ kod: o.wartosc, etykieta: o.etykieta })),
        })),
        przyciskDalej: "Zakończ moduł",
      },
    ],
  };
}

// =====================================================================
// A5
// =====================================================================

function czescA5A(): CzescModulu {
  const ekrany: Ekran[] = [wstep("A5", INSTRUKCJA_A5)];

  // Jeden warunek na ekran. Pieciu naraz nikt nie czyta osobno: wzrok laduje
  // na pierwszym, reszta dostaje te sama odpowiedz co on. Kazdy z tych
  // warunkow moze samodzielnie usunac zawod, wiec zasluguje na wlasny ekran.
  FILTRY_A5.forEach((f, i) => {
    ekrany.push({
      klucz: `A5_${f.kod}`,
      typ: "pozycje",
      naglowek: f.nazwaBloku,
      polecenie: INSTRUKCJA_A5.polecenieBloku,
      kolor: `a5-${f.blok}`,
      pozycje: [
        {
          id: f.kod,
          typ: "trzystopniowa",
          tresc: f.tekst,
          opcje: ODPOWIEDZI_A5.map((o) => ({ kod: o.kod, etykieta: o.etykieta })),
        },
      ],
      postep: { nr: i + 1, z: FILTRY_A5.length, slowo: "warunków" },
    });
  });
  return { kod: "A", nazwa: "Warunki pracy", ekrany };
}

function czescA5B(kontekst: KontekstModulu): CzescModulu {
  const odmowy = kontekst.a5Odmowy ?? [];
  const opcje = odmowy
    .map((kod) => FILTRY_A5.find((f) => f.kod === kod))
    .filter((f): f is (typeof FILTRY_A5)[number] => Boolean(f))
    .map((f) => ({ kod: f.kod, etykieta: f.tekst }));

  return {
    kod: "B",
    nazwa: "Twarde weta",
    ekrany: [
      {
        klucz: "A5_weta",
        typ: "pozycje",
        naglowek: INSTRUKCJA_A5.wetaNaglowek,
        podpis: opcje.length === 0 ? "Nie odrzuciłeś żadnego warunku, więc nie ma tu nic do zaznaczenia." : undefined,
        pozycje: [
          {
            id: "weta",
            typ: "wielokrotny",
            tresc:
              opcje.length > 0
                ? `Zaznaczyłeś ${opcje.length} ${opcje.length === 1 ? "rzecz, której" : "rzeczy, których"} byś nie chciał. ${INSTRUKCJA_A5.wetaPolecenie}`
                : INSTRUKCJA_A5.wetaMoznaPominac,
            podpis: INSTRUKCJA_A5.wetaMoznaPominac,
            maksWyborow: 3,
            opcjonalna: true,
            opcje,
          },
        ],
        przyciskDalej: "Dalej",
      },
    ],
  };
}

function czescA5C(): CzescModulu {
  return {
    kod: "C",
    nazwa: "Trzy zdania",
    ekrany: [
      {
        klucz: "A5_zdania",
        typ: "pozycje",
        naglowek: INSTRUKCJA_A5.zdaniaNaglowek,
        podpis: INSTRUKCJA_A5.zdaniaPodpis,
        pozycje: [
          { id: "zdania", typ: "kilka_tekstow", zdania: [...ZDANIA_A5], opcjonalna: true },
        ],
        przyciskDalej: "Zakończ moduł",
      },
    ],
  };
}

// =====================================================================
// M1
// =====================================================================

function czescM1A(plan: PlanModulu): CzescModulu {
  const ekrany: Ekran[] = [wstep("M1", INSTRUKCJA_M1)];
  const poId = new Map(PARY_M1.map((p) => [p.id, p]));

  plan.kolejnosc.forEach((id, i) => {
    const para = poId.get(id);
    if (!para) return;
    const odwrocona = plan.odwrocone[id] ?? false;
    const a = { kod: "A", tekst: para.biegunA };
    const b = { kod: "B", tekst: para.biegunB };
    ekrany.push({
      klucz: `M1_${id}`,
      typ: "pozycje",
      polecenie: INSTRUKCJA_M1.polecenieBloku,
      kolor: `m1w-${para.wymiar}`,
      pozycje: [{ id, typ: "para", stronaA: odwrocona ? b : a, stronaB: odwrocona ? a : b }],
      postep: { nr: i + 1, z: plan.kolejnosc.length, slowo: "par" },
    });
  });
  return { kod: "A", nazwa: "Dwanaście kompromisów", ekrany };
}

function czescM1B(kontekst: KontekstModulu): CzescModulu {
  const ekrany: Ekran[] = [
    {
      klucz: "M1_wstep_b",
      typ: "wstep",
      naglowek: "Własnymi słowami",
      akapity: [...INSTRUKCJA_M1.czescBWstep],
      przyciskDalej: "Zaczynamy",
    },
  ];

  for (const obszar of OBSZARY_M1) {
    const szkic = kontekst.m1Szkice?.[obszar.nr];
    const pozycje: Pozycja[] = [];

    if (obszar.typ === "piec_zdan") {
      pozycje.push({ id: `obszar_${obszar.nr}`, typ: "kilka_tekstow", zdania: obszar.zdania, opcjonalna: true });
    } else if (obszar.typ === "lista_i_tekst") {
      pozycje.push({
        id: `obszar_${obszar.nr}_lista`,
        typ: "wielokrotny",
        tresc: "Zaznacz od trzech do sześciu rzeczy.",
        minWyborow: 3,
        maksWyborow: 6,
        opcjonalna: true,
        opcje: (obszar.lista ?? []).map((x) => ({ kod: x, etykieta: x })),
      });
      pozycje.push({ id: `obszar_${obszar.nr}`, typ: "tekst", tresc: obszar.polecenie, opcjonalna: true });
    } else {
      pozycje.push({
        id: `obszar_${obszar.nr}`,
        typ: "tekst",
        tresc: obszar.polecenie,
        duze: obszar.typ === "tekst_duzy",
        opcjonalna: true,
      });
    }

    ekrany.push({
      klucz: `M1_obszar_${obszar.nr}`,
      typ: "pozycje",
      naglowek: obszar.tytul,
      kolor: `m1-${obszar.nr}`,
      notatka: szkic,
      notatkaZPola:
        obszar.typ === "lista_i_tekst"
          ? `obszar_${obszar.nr}_lista`
          : obszar.typ === "piec_zdan"
            ? `obszar_${obszar.nr}`
            : undefined,
      pozycje,
      postep: { nr: obszar.nr, z: OBSZARY_M1.length, slowo: "obszarów" },
      przyciskDalej: obszar.nr === OBSZARY_M1.length ? "Zakończ moduł" : "Dalej",
    });
  }

  return { kod: "B", nazwa: "Własnymi słowami", ekrany };
}

// =====================================================================
// SKLADANIE
// =====================================================================

/** Wszystkie czesci modulu, w kolejnosci. */
export const CZESCI_MODULOW: Record<KodModulu, string[]> = {
  A0: ["A"],
  A1: ["A", "B"],
  A2: ["A", "B"],
  A3: ["A", "B"],
  A4: ["A", "B", "C"],
  A5: ["A", "B", "C"],
  M1: ["A", "B"],
};

export function zbudujCzesc(
  modul: KodModulu,
  czesc: string,
  plan: PlanModulu,
  kontekst: KontekstModulu,
): CzescModulu {
  const klucz = `${modul}${czesc}`;
  switch (klucz) {
    case "A0A":
      return czescA0();
    case "A1A":
      return czescA1A(plan);
    case "A1B":
      return czescA1B(plan);
    case "A2A":
      return czescA2A(plan);
    case "A2B":
      return czescA2B();
    case "A3A":
      return czescA3A(plan);
    case "A3B":
      return czescA3B(kontekst);
    case "A4A":
      return czescA4A(plan);
    case "A4B":
      return czescA4B();
    case "A4C":
      return czescA4C(kontekst);
    case "A5A":
      return czescA5A();
    case "A5B":
      return czescA5B(kontekst);
    case "A5C":
      return czescA5C();
    case "M1A":
      return czescM1A(plan);
    case "M1B":
      return czescM1B(kontekst);
    default:
      throw new Error(`nieznana część modułu: ${klucz}`);
  }
}

/** Etykiety wyniku czesci A modulu M1, do szkicow w czesci B. */
export const ETYKIETY_M1: Record<string, [string, string, string]> = {
  CEN: ["praca w centrum życia", "praca ważna, ale nie najważniejsza", "praca jako część życia, nie jego oś"],
  GRA: ["praca i życie mogą się przenikać", "trochę przenikania, ale z granicą", "wyraźna granica między pracą a resztą"],
  GOD: ["gotowość na dużo godzin", "umiarkowany wymiar pracy", "mniej pracy, więcej czasu"],
  TEMP: ["szybka, intensywna kariera", "spokojne, ale konsekwentne budowanie", "bez pośpiechu, byle w dobrą stronę"],
  MIE: ["praca w konkretnym miejscu", "mieszanie obu form", "możliwość pracy zdalnej"],
  ORG: ["duża organizacja ze strukturą", "średnia skala", "mały zespół albo własne"],
  KOR: ["jedno miejsce, korzenie", "osiadłość z możliwością zmiany", "mobilność, lekkość"],
  INW: ["szybkie wejście na rynek", "równowaga nauki i praktyki", "długa inwestycja w wykształcenie"],
  POZ: ["wysoki poziom życia", "wygodnie, bez luksusu", "wystarczy, żeby nie brakowało"],
  LUD: ["chęć prowadzenia ludzi", "otwartość, bez ambicji", "odpowiedzialność wyłącznie za siebie"],
  WID: ["życie widoczne", "umiarkowana widoczność", "życie prywatne, praca w cieniu"],
  ROD: ["rodzina stosunkowo wcześnie", "rodzina kiedyś, bez terminu", "najpierw co innego"],
};

/**
 * Nazwa wymiaru dla uczestnika. Slownik ma same kody i nazwy biegunow, a kod
 * na ekranie („CEN bardzo wysoko”) nie znaczy dla uczestnika nic.
 */
export const NAZWY_M1: Record<string, string> = {
  CEN: "Miejsce pracy w życiu",
  GRA: "Granica pracy i reszty życia",
  GOD: "Ile godzin",
  TEMP: "Tempo kariery",
  MIE: "Gdzie pracujesz",
  ORG: "Skala miejsca pracy",
  KOR: "Jedno miejsce czy ruch",
  INW: "Zarabiać wcześniej czy uczyć się dłużej",
  POZ: "Poziom życia",
  LUD: "Prowadzenie ludzi",
  WID: "Widoczność",
  ROD: "Rodzina",
};

export function etykietaM1(wymiar: string, pozycja: number | null): string {
  const e = ETYKIETY_M1[wymiar];
  if (!e || pozycja === null) return "";
  if (pozycja >= 75) return e[0];
  if (pozycja <= 25) return e[2];
  return e[1];
}

export { WYMIARY_M1 };
