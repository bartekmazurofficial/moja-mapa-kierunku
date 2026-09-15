/**
 * Budowanie ekranow modulu.
 *
 * Modul dzieli sie na czesci. Czesci zalezne od wyniku wczesniejszej czesci
 * (kotwice A3, test kosztu A4, ekran wet A5, szkice M1) sa budowane na
 * serwerze, kiedy uczestnik do nich dojdzie - inaczej nie da sie ich ulozyc.
 */

import { BLOKI_A1, INSTRUKCJA_A1 } from "../content/a1";
import { BLOKI_A2, DOWODY_A2, INSTRUKCJA_A2 } from "../content/a2";
import { INSTRUKCJA_A6, INWESTYCJA_A6, PARY_A6 } from "../content/a6";
import { KOTWICE_A3, PARY_A3, INSTRUKCJA_A3 } from "../content/a3";
import {
  BRZMIENIA_A4,
  FORMULY_A4,
  INSTRUKCJA_A4,
  LICZBA_BLOKOW_A4,
  NAZWY_KROTKIE_A4,
  OSTRZEZENIE_A4,
  PARY_A4,
  TEST_KOSZTU,
  type ParaA4,
} from "../content/a4";
import { INSTRUKCJA_A5, ODPOWIEDZI_A5, ZDANIA_A5 } from "../content/a5";
import { INSTRUKCJA_M1, OBSZARY_M1, PARY_MIEKKIE_M1, PYTANIA_WPROST_M1 } from "../content/m1";
import { PRZEDMIOTY_A0, PYTANIA_A0, INSTRUKCJA_A0 } from "../content/a0";
import { ODDECHY } from "../content/wspolne";
import { FILTRY_A5, OBSZARY_A1, KOMPETENCJE_A2, WARTOSCI_A4, WYMIARY_M1 } from "../domain/slowniki";
import type { CzescModulu, Ekran, KodModulu, Pozycja } from "./typy";
import { zbudujPlan, type PlanModulu } from "./plan";
import { minutyZPozycji, zakresPozycji } from "./miara";

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
  A6: "Jak się uczę",
  M1: "Jakiego życia chcesz",
};

/**
 * Kolejnosc modulow zgodna ze scenariuszami czterech spotkan.
 * Na spotkaniu trzecim: wartosci, przerwa, wizja zycia, filtry. A5 musi isc
 * po M1, bo jego wlasna instrukcja zaczyna sie od „Przed chwila opisales,
 * jak chcesz zyc".
 */
export const KOLEJNOSC_MODULOW: KodModulu[] = ["A0", "A1", "A3", "A2", "A4", "M1", "A5", "A6"];

/**
 * Ile pozycji ma caly modul. Do paska postepu na liscie modulow.
 *
 * Liczba nie zalezy od wylosowanego planu, wiec budujemy czesci raz, z planem
 * domyslnym. Pozycje warunkowe licza sie do sumy: sa tylko dwie, obie w A0,
 * wiec dla szesciu modulow liczba jest dokladna, a dla A0 jest gornym
 * ograniczeniem. Sygnalem „skonczone" jest i tak marker domkniecia czesci,
 * a nie ten ulamek.
 */
const POZYCJI_W_MODULE = new Map<KodModulu, number>();

export function liczbaPozycjiModulu(modul: KodModulu): number {
  const zapamietane = POZYCJI_W_MODULE.get(modul);
  if (zapamietane !== undefined) return zapamietane;
  const plan = zbudujPlan(modul);
  let ile = 0;
  for (const czesc of CZESCI_MODULOW[modul]) {
    for (const ekran of zbudujCzesc(modul, czesc, plan, {}).ekrany) {
      ile += (ekran.pozycje ?? []).length;
    }
  }
  POZYCJI_W_MODULE.set(modul, ile);
  return ile;
}

/** Ile mniej wiecej zajmie caly modul, w minutach. Do listy modulow. */
export function minutyModulu(modul: KodModulu): number {
  return minutyZPozycji(zakresPozycjiModulu(modul).max, modul);
}

/**
 * Ile pytan zobaczy jeden uczestnik: od najkrotszej sciezki do najdluzszej.
 *
 * `liczbaPozycjiModulu` sumuje wszystko, co stoi w definicji, i do paska
 * postepu to wystarcza. Liczbe obiecana uczestnikowi trzeba wziac z jego
 * sciezki, a to liczy `zakresPozycji` z lib/moduly/miara.ts.
 */
export function zakresPozycjiModulu(modul: KodModulu): { min: number; max: number } {
  const zapamietane = ZAKRES_W_MODULE.get(modul);
  if (zapamietane) return zapamietane;
  const plan = zbudujPlan(modul);
  const zakres = zakresPozycji(
    CZESCI_MODULOW[modul].flatMap((czesc) => zbudujCzesc(modul, czesc, plan, {}).ekrany),
  );
  ZAKRES_W_MODULE.set(modul, zakres);
  return zakres;
}

const ZAKRES_W_MODULE = new Map<KodModulu, { min: number; max: number }>();

/**
 * Ekran oddechu w dlugim module.
 *
 * Trzydziesci szesc zestawow bez jednego slowa to najdluzszy odcinek bez
 * kontaktu w calym programie i tam ludzie odpadaja. Jedno zdanie, przycisk,
 * nic wiecej: stwierdzenie faktu, nigdy pochwala. W tych modulach nie da sie
 * isc dobrze ani zle, wiec „swietnie Ci idzie" byloby klamstwem, a odznaka za
 * serie zamienilaby rozmowe o czyims zyciu w aplikacje do nauki slowek.
 */
function oddech(modul: KodModulu, poBloku: number, wszystkich: number): Ekran | null {
  const tekst = ODDECHY[modul]?.[poBloku];
  if (!tekst || poBloku >= wszystkich) return null;
  return {
    klucz: `${modul}_oddech_${poBloku}`,
    typ: "przerwa",
    naglowek: tekst,
    przyciskDalej: "Dalej",
  };
}

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

/** Numer bloku metryczki -> klucz znaku. Znaki maja nazwy, nie numery. */
const ZNAKI_A0: Record<number, string> = {
  1: "a0-etap",
  2: "a0-przedmioty",
  3: "a0-doswiadczenie",
  4: "a0-miejsce",
  5: "a0-zasoby",
  6: "a0-zdrowie",
};

/** Kody przedmiotow szkolnych: ta sama lista wraca w szesciu pytaniach. */
const PRZEDMIOTY_PO_KODZIE = new Set(PRZEDMIOTY_A0.map((p) => p.kod));

/**
 * Klucz obrazu odpowiedzi A0.
 *
 * Przedmioty szkolne dostaja jeden wspolny plik na przedmiot, a nie osobny
 * w kazdym pytaniu. Matematyka wyglada tak samo, gdy uczestnik ja planuje,
 * gdy ja zdaje i gdy sie z nia meczy: rozni sie pytanie, nie przedmiot.
 * Osobne pliki znaczylyby osiemdziesiat obrazkow zamiast czternastu i cztery
 * rozne matematyki na czterech ekranach.
 *
 * Opcja wylaczna („nie wiem", „nic z tego", odmowa) nie dostaje obrazu wcale.
 * To jest wyjscie z pytania, nie jedna z odpowiedzi, i kadr stawialby ja
 * na rowni z trescia.
 */
function kluczObrazuA0(idPytania: string, kod: string, wylaczna: boolean): string | undefined {
  if (wylaczna) return undefined;
  // Pytanie z jednym kadrem nad odpowiedziami nie daje kadru kazdej z nich:
  // piec identycznych zdjec obok siebie nie niesie zadnej roznicy.
  if (PYTANIA_Z_KADREM_WSPOLNYM.has(idPytania)) return undefined;
  if (PRZEDMIOTY_PO_KODZIE.has(kod)) return `a0-przedmiot-${kod}`;
  return `a0-${idPytania}-${kod}`;
}

/**
 * Pytania, ktore maja jeden kadr nad wszystkimi odpowiedziami.
 *
 * „Gdzie mieszkasz" ma piec odpowiedzi roznicacych sie wielkoscia miejscowosci
 * i jeden obraz miasta; „na co Cie stac" trzy progi i jeden obraz pieniedzy.
 * Tam kadr ilustruje pytanie, a nie odpowiedz, wiec stoi raz, u gory.
 */
const PYTANIA_Z_KADREM_WSPOLNYM = new Set([
  "miejsce",
  "mobilnosc",
  "dojazd",
  "zasoby",
  "staz_pracy",
  "kierunek_ocena",
]);

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
        opcje: pytanie.opcje?.map((o) => {
          const wylaczna = o.odmowa || o.kod === "brak" || o.kod === "nic" || o.kod === "nie_wiem";
          return {
            kod: o.kod,
            etykieta: o.etykieta,
            nadpis: o.nadpis,
            ikona: kluczObrazuA0(pytanie.id, o.kod, wylaczna),
            wylaczna,
            szeroka: o.szeroka,
          };
        }),
        // A0 pyta o sytuację życiową i tam obraz niesie treść, a nie ozdobę.
        // Pole tekstowe kart nie ma.
        uklad: pytanie.typ === "tekst" ? undefined : "karty",
        dokladnie: pytanie.typ === "dokladnie_trzy" ? 3 : undefined,
        opcjonalna: pytanie.opcjonalne,
        warunek: pytanie.tylkoEtapy ? { pozycja: "etap", wartosci: pytanie.tylkoEtapy } : undefined,
      };
      ekrany.push({
        klucz: `A0_${pytanie.id}`,
        typ: "pozycje",
        naglowek: pytanie.nazwaBloku,
        obraz: PYTANIA_Z_KADREM_WSPOLNYM.has(pytanie.id) ? `a0-pytanie-${pytanie.id}` : undefined,
        kolor: ZNAKI_A0[blok] ?? `a0-${blok}`,
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
    const przerwa = oddech("A1", i + 1, plan.kolejnosc.length);
    if (przerwa) ekrany.push(przerwa);
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
    // Oddech co dwanascie zestawow. Przerwa w polowie byla juz wczesniej i
    // zostaje - teraz jako jedna z trzech, a nie jako jedyna na czterdziesci piec.
    const przerwa = oddech("A2", i + 1, plan.kolejnosc.length);
    if (przerwa) ekrany.push(przerwa);
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
    const a = { kod: "A", tekst: para.biegunA, ikona: `a3-${para.wymiar}` };
    const b = { kod: "B", tekst: para.biegunB, ikona: `a3-${para.wymiar}` };
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

/** Liczebnik slownie: ekran mowi „trzynastu osi", nie „13 osi". */
function liczebnik(n: number): string {
  const SLOWNIE: Record<number, string> = {
    10: "dziesięciu",
    11: "jedenastu",
    12: "dwunastu",
    13: "trzynastu",
    14: "czternastu",
    15: "piętnastu",
  };
  return SLOWNIE[n] ?? String(n);
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
        // Liczba osi bierze sie z banku, a nie ze zdania wpisanego recznie:
        // po dolozeniu osi EFE ekran przez caly czas mowil o dwunastu,
        // pokazujac trzynascie kotwic.
        podpis: `Wiemy już, gdzie jesteś na każdej z ${liczebnik(KOTWICE_A3.length)} osi. Teraz pytamy o coś innego: na ilu z nich naprawdę Ci zależy.`,
        pozycje,
        przyciskDalej: "Zakończ moduł",
      },
    ],
  };
}

// =====================================================================
// A4
// =====================================================================

/**
 * Czesc A: 36 porownan w pieciu formulach.
 *
 * **Bloki ida ciagiem**, bo zmiana formuly w srodku bloku znaczylaby dla
 * uczestnika, ze zmienily sie zasady. Wewnatrz bloku kolejnosc jest nadal
 * losowana razem z planem: to jest ta sama ochrona przed efektem pozycji,
 * co w pozostalych modulach, i grupowania blokow nie psuje.
 *
 * Przed blokiem czwartym stoi ekran ostrzegawczy. Nie jest ozdoba: bez niego
 * uczestnik odpowiada przez szesc pytan odwrotnie, niz mysli, a wynik wyglada
 * potem sensownie i jest falszywy.
 */
function czescA4A(plan: PlanModulu): CzescModulu {
  const ekrany: Ekran[] = [wstep("A4", INSTRUKCJA_A4)];
  const poNumerze = new Map(PARY_A4.map((p) => [String(p.nr), p]));

  const wLosowejKolejnosci = plan.kolejnosc
    .map((klucz) => poNumerze.get(klucz))
    .filter((p): p is ParaA4 => Boolean(p));
  // Stabilne sortowanie po numerze bloku zostawia losowa kolejnosc w srodku.
  const kolejka = [...wLosowejKolejnosci].sort(
    (a, b) => FORMULY_A4[a.formula].blok - FORMULY_A4[b.formula].blok,
  );

  let poprzedniBlok = 0;
  kolejka.forEach((para, i) => {
    const f = FORMULY_A4[para.formula];
    if (f.odwrotna && poprzedniBlok !== f.blok) {
      ekrany.push({
        klucz: "A4_ostrzezenie",
        typ: "przerwa",
        ostrzezenie: true,
        etykieta: `Blok ${f.blok} z ${LICZBA_BLOKOW_A4} · ${OSTRZEZENIE_A4.etykieta}`,
        naglowek: OSTRZEZENIE_A4.naglowek,
        akapity: [...OSTRZEZENIE_A4.akapity],
        zestawienie: OSTRZEZENIE_A4.zestawienie.map((z) => ({ ...z })),
        dopisek: OSTRZEZENIE_A4.dopisek,
        przyciskDalej: OSTRZEZENIE_A4.przycisk,
      });
    }
    poprzedniBlok = f.blok;

    const nadpis = (kod: string, ktora: "A" | "B") =>
      f.nadpisOdpowiedzi === "Oferta"
        ? `Oferta ${ktora}`
        : (f.nadpisOdpowiedzi ?? NAZWY_KROTKIE_A4[kod]);
    // Nazwa wartosci stoi albo nad zdaniem, albo pod nim, nigdy dwa razy.
    const podpis = (kod: string) => (f.nadpisOdpowiedzi ? NAZWY_KROTKIE_A4[kod] : undefined);

    const a = {
      kod: para.lewa,
      tekst: para.tekstLewej,
      ikona: `a4-${para.lewa}`,
      nadpis: nadpis(para.lewa, "A"),
      podpis: podpis(para.lewa),
    };
    const b = {
      kod: para.prawa,
      tekst: para.tekstPrawej,
      ikona: `a4-${para.prawa}`,
      nadpis: nadpis(para.prawa, "B"),
      podpis: podpis(para.prawa),
    };
    const odwrocona = plan.odwrocone[String(para.nr)] ?? false;
    ekrany.push({
      klucz: `A4_para_${para.nr}`,
      typ: "pozycje",
      etykieta: `Blok ${f.blok} z ${LICZBA_BLOKOW_A4} · ${f.etykieta}`,
      akcent: f.odwrotna ? "pomarancz" : undefined,
      polecenie: f.naglowek,
      podpis: f.podtytul,
      dopisek: f.dopisek,
      ikona: `a4-${para.lewa}`,
      pozycje: [
        {
          id: `para_${para.nr}`,
          typ: "para",
          // Strona zamieniona razem z nadpisem oferty: „Oferta A" ma zostac
          // po lewej niezaleznie od tego, ktora wartosc tam wylosowano.
          stronaA: odwrocona ? { ...b, nadpis: nadpis(para.prawa, "A") } : a,
          stronaB: odwrocona ? { ...a, nadpis: nadpis(para.lewa, "B") } : b,
        },
      ],
      postep: { nr: i + 1, z: kolejka.length, slowo: "par" },
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
  const nazwa = NAZWY_KROTKIE_A4[najwyzsza] ?? "";
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
        // Jedyne miejsce w programie, gdzie uczestnik widzi fragment wlasnego
        // wyniku przed koncem. Tu nie ma pomiaru, jest swiadomy wybor: zeby
        // zapytac o cene, trzeba najpierw powiedziec, czego cena dotyczy.
        podpis: `Najwyżej wyszło u Ciebie: ${nazwa}. ${TEST_KOSZTU.wstep}`,
        pozycje: pytania.slice(0, 4).map((p, i) => ({
          id: `koszt_${i + 1}`,
          typ: "pojedynczy",
          tresc: `Czy zrezygnowałbyś z ${p.tekst}, żeby ${BRZMIENIA_A4[najwyzsza].charAt(0).toLowerCase()}${BRZMIENIA_A4[najwyzsza].slice(1)}?`,
          opcje: TEST_KOSZTU.odpowiedzi.map((o) => ({
            kod: o.wartosc,
            etykieta: o.etykieta,
            podpis: o.podpis,
          })),
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
      obraz: `a5-${f.kod}`,
      pozycje: [
        {
          id: f.kod,
          typ: "trzystopniowa",
          tresc: f.tekst,
          opcje: ODPOWIEDZI_A5.map((o) => ({ kod: o.kod, etykieta: o.etykieta, podpis: o.podpis })),
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

/**
 * Czesc A modulu M1: dziewiec wymiarow miekkich z par, trzy twarde wprost.
 *
 * Pytania wprost stoja NA KONCU, a nie na poczatku. Uczestnik ma najpierw
 * przejsc przez pary i zobaczyc, o czym w ogole jest ten modul; trzy pytania
 * o godziny, miejsce i przeprowadzke postawione na wejsciu brzmialyby jak
 * formularz rekrutacyjny, a nie jak rozmowa o zyciu.
 */
function czescM1A(plan: PlanModulu): CzescModulu {
  const ekrany: Ekran[] = [wstep("M1", INSTRUKCJA_M1)];
  const poId = new Map(PARY_MIEKKIE_M1.map((p) => [p.id, p]));

  plan.kolejnosc.forEach((id, i) => {
    const para = poId.get(id);
    if (!para) return;
    const odwrocona = plan.odwrocone[id] ?? false;
    const a = { kod: "A", tekst: para.biegunA, ikona: `m1w-${para.wymiar}` };
    const b = { kod: "B", tekst: para.biegunB, ikona: `m1w-${para.wymiar}` };
    ekrany.push({
      klucz: `M1_${id}`,
      typ: "pozycje",
      polecenie: INSTRUKCJA_M1.polecenieBloku,
      ikona: `m1w-${para.wymiar}`,
      pozycje: [{ id, typ: "para", stronaA: odwrocona ? b : a, stronaB: odwrocona ? a : b }],
      postep: { nr: i + 1, z: plan.kolejnosc.length, slowo: "par" },
    });
  });

  for (const [i, p] of PYTANIA_WPROST_M1.entries()) {
    ekrany.push({
      klucz: `M1_wprost_${p.wymiar}`,
      typ: "pozycje",
      naglowek: i === 0 ? "Trzy rzeczy wprost" : undefined,
      podpis:
        i === 0
          ? "Te trzy naprawdę przycinają listę zawodów, więc nie zgadujemy ich z par. „Jeszcze nie wiem” jest pełnoprawną odpowiedzią i nie przycina niczego."
          : undefined,
      ikona: `m1w-${p.wymiar}`,
      pozycje: [
        {
          id: `wprost_${p.wymiar}`,
          typ: "pojedynczy",
          tresc: p.tresc,
          podpis: p.podpis,
          uklad: "karty",
          opcje: p.opcje.map((o) => ({
            kod: o.kod,
            etykieta: o.etykieta,
            podpis: o.podpis,
            ikona: `m1w-${p.wymiar}`,
            wylaczna: o.kod === "nie_wiem",
          })),
        },
      ],
      przyciskDalej: i === PYTANIA_WPROST_M1.length - 1 ? "Zakończ część" : undefined,
    });
  }

  return { kod: "A", nazwa: "Kompromisy", ekrany };
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
      // Punkty zaczepienia mówią, o czym w ogóle mowa. Pusta kartka blokuje
      // szesnastolatka, który nigdy się nad tym nie zastanawiał.
      podpis: obszar.punkty,
      odwrotnie: obszar.odwrotnie,
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

/**
 * Czesc A modulu A6: dwadziescia par o tym, jak czlowiek sie uczy.
 *
 * Ten sam uklad co w A3 i M1, celowo. Uczestnik zna juz te mechanike z dwoch
 * poprzednich modulow, wiec nie traci czasu na uczenie sie ekranu, a modul
 * ma byc krotki: cztery minuty na koniec czwartego spotkania.
 */
function czescA6A(plan: PlanModulu): CzescModulu {
  const ekrany: Ekran[] = [wstep("A6", INSTRUKCJA_A6)];
  const poId = new Map(PARY_A6.map((p) => [p.id, p]));

  plan.kolejnosc.forEach((id, i) => {
    const para = poId.get(id);
    if (!para) return;
    const odwrocona = plan.odwrocone[id] ?? false;
    // Ilustracja osi, nie bieguna: jeden znak na cztery pary tej samej osi.
    const znak = `a6-${para.os}`;
    const a = { kod: "A", tekst: para.biegunA, ikona: znak };
    const b = { kod: "B", tekst: para.biegunB, ikona: znak };
    ekrany.push({
      klucz: `A6_${id}`,
      typ: "pozycje",
      polecenie: INSTRUKCJA_A6.polecenieBloku,
      ikona: znak,
      pozycje: [
        { id, typ: "para", stronaA: odwrocona ? b : a, stronaB: odwrocona ? a : b },
      ],
      postep: { nr: i + 1, z: plan.kolejnosc.length, slowo: "par" },
    });
  });
  return { kod: "A", nazwa: "Pary", ekrany };
}

/**
 * Czesc B: trzy pytania wprost o gotowosc do inwestycji czasowej.
 *
 * Wprost, a nie z par, bo te trzy odpowiedzi realnie przesuwaja cala grupe
 * drog. Przy czterech parach jedna zmieniona odpowiedz przesuwa wynik o
 * dwadziescia piec punktow, a to zbyt mocna konsekwencja ze zbyt slabej
 * podstawy. Kazde pytanie ma „jeszcze nie wiem" i ta odpowiedz nie przycina
 * niczego: brak zdania nie jest zdaniem.
 */
function czescA6B(): CzescModulu {
  return {
    kod: "B",
    nazwa: "Ile w to wkładam",
    ekrany: INWESTYCJA_A6.map((p, i) => ({
      klucz: `A6_${p.id}`,
      typ: "pozycje" as const,
      naglowek: i === 0 ? INSTRUKCJA_A6.inwestycjaNaglowek : undefined,
      podpis: i === 0 ? INSTRUKCJA_A6.inwestycjaPodpis : undefined,
      pozycje: [
        {
          id: p.id,
          typ: "pojedynczy" as const,
          tresc: p.tresc,
          podpis: p.podpis,
          uklad: "karty" as const,
          opcje: p.opcje.map((o) => ({
            kod: o.kod,
            etykieta: o.etykieta,
            podpis: o.podpis,
            wylaczna: o.kod === "nie_wiem",
          })),
        },
      ],
      przyciskDalej: i === INWESTYCJA_A6.length - 1 ? "Zakończ moduł" : undefined,
    })),
  };
}

/** Wszystkie czesci modulu, w kolejnosci. */
export const CZESCI_MODULOW: Record<KodModulu, string[]> = {
  A0: ["A"],
  A1: ["A", "B"],
  A2: ["A", "B"],
  A3: ["A", "B"],
  A4: ["A", "B", "C"],
  A5: ["A", "B", "C"],
  A6: ["A", "B"],
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
    case "A6A":
      return czescA6A(plan);
    case "A6B":
      return czescA6B();
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
