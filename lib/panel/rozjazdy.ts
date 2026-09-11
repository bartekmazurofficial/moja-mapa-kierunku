/**
 * Pięć typów rozjazdu z `sesja_indywidualna_i_panel.md`, liczonych automatycznie.
 *
 * To jest sedno sesji indywidualnej: system wykrywa sprzeczność, ale jej nie
 * rozstrzyga. Każdy rozjazd jest gotowym tematem rozmowy, z pytaniem, które
 * prowadzący ma zadać.
 *
 * Funkcja czysta, bez bazy i bez efektów ubocznych. Wejście to wynik silnika,
 * wyniki modułów, oceny zawodów zapisane przez uczestnika i baza referencyjna.
 */

import { DZIEDZICZONE } from "../engine/config";
import type { WynikSilnika } from "../engine/typy";
import type { WynikiModulow } from "../engine/typy";
import type { BazaReferencyjna } from "../domain/typy";
import { FILTRY_A5, M1_PO_KODZIE } from "../domain/slowniki";
import { OBSZARY_M1 } from "../content/m1";

export type TypRozjazdu =
  | "odrzucony_faworyt"
  | "wybrany_outsider"
  | "sprzecznosc_a1_a5"
  | "sprzecznosc_z_wizja"
  | "bariera_kosztowa";

export interface Rozjazd {
  typ: TypRozjazdu;
  /** Nagłówek: czego rozjazd dotyczy. */
  tytul: string;
  /** Co system widzi. Fakty, bez interpretacji. */
  obserwacja: string;
  /** Pytanie do zadania, wprost ze specyfikacji sesji. */
  pytanie: string;
}

const NAZWY_TYPOW: Record<TypRozjazdu, string> = {
  odrzucony_faworyt: "Odrzucony faworyt",
  wybrany_outsider: "Wybrany outsider",
  sprzecznosc_a1_a5: "Sprzeczność A1 z A5",
  sprzecznosc_z_wizja: "Sprzeczność wyniku z wizją",
  bariera_kosztowa: "Bariera kosztowa",
};

export function nazwaTypu(typ: TypRozjazdu): string {
  return NAZWY_TYPOW[typ];
}

/** Pasma, przy których zawód uchodzi za wysoko punktowany. */
const PASMA_MOCNE = new Set(["bardzo_mocne", "mocne"]);

export interface WejscieRozjazdow {
  silnik: WynikSilnika;
  moduly: WynikiModulow;
  baza: BazaReferencyjna;
  /** kod zawodu -> interesuje | moze | nie_dla_mnie */
  oceny: Record<string, string>;
  /** Pełny tekst wizji życia, część B modułu M1. */
  wizja?: Record<number, unknown>;
}

export function policzRozjazdy(we: WejscieRozjazdow): Rozjazd[] {
  return [
    ...odrzuceniFaworyci(we),
    ...wybraniOutsiderzy(we),
    ...sprzecznosciA1A5(we),
    ...sprzecznosciZWizja(we),
    ...barieryKosztowe(we),
  ];
}

/** Zawód wysoko punktowany, oznaczony przez uczestnika jako NIE DLA MNIE. */
function odrzuceniFaworyci({ silnik, oceny }: WejscieRozjazdow): Rozjazd[] {
  const wynik: Rozjazd[] = [];
  for (const pozycja of silnik.warstwa2.pozycje) {
    for (const zawod of pozycja.zawody) {
      if (oceny[zawod.kod] !== "nie_dla_mnie") continue;
      if (!PASMA_MOCNE.has(zawod.pasmo)) continue;
      wynik.push({
        typ: "odrzucony_faworyt",
        tytul: zawod.nazwa,
        obserwacja: `Wyszedł wysoko, a uczestnik oznaczył go jako „nie dla mnie".`,
        pytanie: "Co konkretnie Cię tu odrzuca?",
      });
    }
  }
  return wynik;
}

/**
 * Zawód nisko punktowany, oznaczony jako INTERESUJE MNIE.
 *
 * „Nisko" mierzymy względem tego, co uczestnik w ogóle widzi: najsłabsze
 * pokazane pasmo plus zawody dosypane gwarancją reprezentacji, które stoją
 * poniżej progu pokazania. Zawodu spoza raportu uczestnik nie mógł oznaczyć.
 */
function wybraniOutsiderzy({ silnik, oceny }: WejscieRozjazdow): Rozjazd[] {
  const wynik: Rozjazd[] = [];
  for (const pozycja of silnik.warstwa2.pozycje) {
    for (const zawod of pozycja.zawody) {
      if (oceny[zawod.kod] !== "interesuje") continue;
      const nisko =
        zawod.pasmo === "warte_rozwazenia" ||
        zawod.pasmo === "ponizej_progu" ||
        zawod.zGwarancji !== null;
      if (!nisko) continue;
      wynik.push({
        typ: "wybrany_outsider",
        tytul: zawod.nazwa,
        obserwacja: "Wyszedł nisko, a uczestnik zaznaczył, że go interesuje.",
        pytanie: "Skąd to się bierze? Co o tym wiesz?",
      });
    }
  }
  return wynik;
}

/**
 * Ciągnie go do obszaru, w którym wykluczył warunek nieuchronny.
 *
 * Bierzemy obszary usunięte wetem i sprawdzamy, czy ciągnienie z A1 było
 * wysokie. Próg: nie niżej niż trzeci obszar z rankingu, który przetrwał.
 * Obszar usunięty wetem przy słabym ciągnieniu nie jest sprzecznością, tylko
 * poprawnym odsiewem.
 */
function sprzecznosciA1A5({ silnik }: WejscieRozjazdow): Rozjazd[] {
  const prog = silnik.warstwa1.obszary[2]?.wynik ?? silnik.warstwa1.obszary[0]?.wynik ?? 0;
  const nazwaFiltru = new Map(FILTRY_A5.map((f) => [f.kod, f.tekst]));
  return silnik.warstwa1.usuniete
    .filter((u) => u.powod === "weto" && u.ciagniecie >= prog)
    .sort((a, b) => b.ciagniecie - a.ciagniecie)
    .map((u) => {
      const warunek = nazwaFiltru.get(u.filtr ?? "") ?? u.filtr ?? "ten warunek";
      const nieuchronny = (u.wymaganie ?? 0) >= DZIEDZICZONE.PROG_WETA;
      return {
        typ: "sprzecznosc_a1_a5" as const,
        tytul: u.nazwa,
        obserwacja:
          `Ciągnie go do tego obszaru, a wykluczył warunek „${warunek}"` +
          (nieuchronny ? ", którego w tym obszarze nie da się uniknąć." : "."),
        pytanie: `Ciągnie Cię do obszaru „${u.nazwa}", a wykluczyłeś „${warunek}", którego tam nie da się uniknąć. Które z tych dwóch jest twardsze?`,
      };
    });
}

/**
 * Droga A prowadzi do życia, którego uczestnik nie opisał.
 *
 * Sygnałem jest mnożnik zgodności poniżej jedności: obszar wygrał samym
 * ciągnieniem, mimo że wizja życia i wartości działają przeciw niemu.
 * Nazywamy konkretny wymiar M1, który się rozjeżdża, bo bez tego rozjazd jest
 * nie do rozmawiania.
 */
function sprzecznosciZWizja({ silnik, moduly, baza }: WejscieRozjazdow): Rozjazd[] {
  const drogaA = silnik.warstwa1.drogi.find((d) => d.etykieta === "A");
  if (!drogaA) return [];
  const wynikObszaru = silnik.warstwa1.obszary.find((o) => o.id === drogaA.obszar);
  if (!wynikObszaru || wynikObszaru.mnoznik >= 1) return [];

  const obszar = baza.obszary.find((o) => o.id === drogaA.obszar);
  if (!obszar) return [];

  // Wymiar wizji życia, na którym rozjazd jest największy. `zycie` to te same
  // wymiary M1, na których silnik liczy mnożnik zgodności.
  let najgorszy: { kod: string; opis: string; dystans: number } | null = null;
  for (const [kod, biegun] of Object.entries(obszar.zycie)) {
    const wartosc = moduly.shape[kod];
    if (typeof wartosc !== "number") continue;
    const cel = biegun === "A" ? 100 : 0;
    const dystans = Math.abs(wartosc - cel) / 100;
    const wymiar = M1_PO_KODZIE.get(kod);
    if (!wymiar || dystans < 0.6) continue;
    if (!najgorszy || dystans > najgorszy.dystans) {
      najgorszy = { kod, opis: biegun === "A" ? wymiar.biegunB : wymiar.biegunA, dystans };
    }
  }
  if (!najgorszy) return [];

  const obszarM1 = OBSZARY_M1.find((o) => o.szkicZ.includes(najgorszy!.kod));
  const czego = obszarM1 ? obszarM1.tytul.toLowerCase() : "wizja życia";

  return [
    {
      typ: "sprzecznosc_z_wizja",
      tytul: `Droga A: ${drogaA.nazwaObszaru}`,
      obserwacja: `W wizji życia („${czego}") wybrał „${najgorszy.opis}", a ta droga prowadzi w drugą stronę.`,
      pytanie: `Napisałeś, że chcesz „${najgorszy.opis}". Ta droga do tego nie prowadzi. Co wybierasz?`,
    },
  ];
}

/** Droga A wymaga środków, których uczestnik nie ma. */
function barieryKosztowe({ silnik, moduly }: WejscieRozjazdow): Rozjazd[] {
  const zasoby = moduly.punktStartu?.zasoby;
  if (zasoby !== "nierealne" && zasoby !== "bardzo_trudne") return [];

  const drogaA = silnik.warstwa1.drogi.find((d) => d.etykieta === "A");
  if (!drogaA) return [];

  const zBariera = silnik.warstwa2.wszystkie.filter(
    (z) => z.obszar === drogaA.obszar && z.flagi.barieraKosztowa,
  );
  if (zBariera.length === 0) return [];

  return [
    {
      typ: "bariera_kosztowa",
      tytul: `Droga A: ${drogaA.nazwaObszaru}`,
      obserwacja: `Zawody z barierą kosztową na tej drodze: ${zBariera.map((z) => z.nazwa).join(", ")}. W A0 zaznaczył, że opłacenie kursu albo sprzętu jest ${zasoby === "nierealne" ? "nierealne" : "bardzo trudne"}.`,
      pytanie: "Ta droga kosztuje. Sprawdźmy, czy są sposoby, i czy w ogóle chcesz ją utrzymać.",
    },
  ];
}
