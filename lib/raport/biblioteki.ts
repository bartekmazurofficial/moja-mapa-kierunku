/**
 * BIBLIOTEKI TRESCI RAPORTU KONCOWEGO.
 *
 * Raport nie jest pisany przez model jezykowy w czasie dzialania. Jest
 * skladany z tekstow stalych, wywolywanych regulami, wiec ten sam obszar ma
 * identyczny opis u kazdego uczestnika. To zaleta, nie ograniczenie: taki
 * raport da sie sprawdzic, poprawic i obronic przed rodzicem.
 *
 * Ten plik jest jedynym wejsciem do `data/tresc`. Reszta kodu nie siega do
 * plikow JSON wprost, zeby ksztalt danych byl opisany typem w jednym miejscu,
 * a nie zgadywany w pieciu.
 *
 * Integralnosci tych plikow pilnuje `tests/biblioteki-tresci.test.ts`: komplet
 * kluczy, brak slow wewnetrznych, dlugosci pol.
 */

import obszaryJson from "@/data/tresc/obszary.json";
import obszarySciezkiJson from "@/data/tresc/obszary_sciezki.json";
import kompetencjeJson from "@/data/tresc/kompetencje.json";
import ukryteAtutyJson from "@/data/tresc/ukryte_atuty.json";
import osiePracyJson from "@/data/tresc/osie_pracy.json";
import wartosciJson from "@/data/tresc/wartosci.json";
import warunkiJson from "@/data/tresc/warunki.json";

/** Obszar zainteresowan A1: co to jest naprawde i w co sie latwo zamienia. */
export interface TrescObszaru {
  nazwa: string;
  czym_to_jest: string;
  gdzie_to_wpada: string;
  nie_myl_z: string;
}

/** Sciezka rozwoju obszaru: kroki bez cen i terminow. */
export interface TrescSciezki {
  nazwa: string;
  sciezka_rozwoju: string[];
  co_warto_wiedziec: string;
  ikona: string;
}

/** Kompetencja A2: na czym polega, gdzie to widac, czego nie daje. */
export interface TrescKompetencji {
  nazwa: string;
  na_czym_polega: string;
  gdzie_to_widac: string;
  czego_nie_daje: string;
}

/** Kompetencja jako ukryty atut: dlaczego warto o niej wiedziec. */
export interface TrescAtutu {
  nazwa: string;
  dlaczego_warto_wiedziec: string;
}

/**
 * Biegun osi stylu dzialania.
 *
 * `prace_ktore_to_lamia` jest tu najwazniejsze: to jest druga strona warunku,
 * czyli praca, w ktorej ten warunek nie ma prawa byc spelniony. Bez niej
 * sekcja o srodowisku mowi tylko, czego uczestnik potrzebuje, a nie mowi,
 * czego przez to unikac.
 */
export interface TrescOsi {
  os: string;
  strona: "A" | "B";
  nazwa: string;
  co_to_o_tobie_mowi: string;
  prace_ktore_to_szanuja: string[];
  prace_ktore_to_lamia: string[];
  co_to_kosztuje: string;
}

export interface TrescWartosci {
  nazwa: string;
  co_to_znaczy_w_praktyce: string;
  zawody_ktore_to_spelniaja: string[];
  zawody_ktore_tego_nie_daja: string[];
  czego_nie_przyjmiesz: string;
}

/** Klucz napiecia to dwa kody wartosci zlaczone podkreslnikiem: `PIE_CZA`. */
export interface TrescNapiecia {
  nazwa: string;
  na_czym_polega: string;
  jak_z_tym_zyc: string;
}

/**
 * Warunek pracy z A5.
 *
 * `co_zostaje` jest bezpiecznikiem: przy odmowie uczestnik ma uslyszec, co mu
 * po niej zostaje, a nie sama liste tego, co odpadlo. `przewaga` dziala
 * odwrotnie, przy zgodzie.
 */
export interface TrescWarunku {
  tekst: string;
  czego_to_dotyczy: string;
  co_zostaje: string;
  przewaga: string;
}

export const OBSZARY_TRESC = obszaryJson as unknown as Record<string, TrescObszaru>;
export const SCIEZKI_TRESC = obszarySciezkiJson as unknown as Record<string, TrescSciezki>;
export const KOMPETENCJE_TRESC = kompetencjeJson as unknown as Record<string, TrescKompetencji>;
export const ATUTY_TRESC = ukryteAtutyJson as unknown as Record<string, TrescAtutu>;
export const OSIE_TRESC = osiePracyJson as unknown as Record<string, TrescOsi>;
export const WARUNKI_TRESC = warunkiJson as unknown as Record<string, TrescWarunku>;

const wartosciPelne = wartosciJson as unknown as {
  wartosci: Record<string, TrescWartosci>;
  napiecia: Record<string, TrescNapiecia>;
};
export const WARTOSCI_TRESC = wartosciPelne.wartosci;
export const NAPIECIA_TRESC = wartosciPelne.napiecia;

/** Biegun osi po kodzie osi i stronie: `SAM` plus `A` daje `SAM_A`. */
export function trescOsi(os: string, strona: "A" | "B"): TrescOsi | undefined {
  return OSIE_TRESC[`${os}_${strona}`];
}

/** Napiecie miedzy dwiema wartosciami, w dowolnej kolejnosci kodow. */
export function trescNapiecia(a: string, b: string): TrescNapiecia | undefined {
  return NAPIECIA_TRESC[`${a}_${b}`] ?? NAPIECIA_TRESC[`${b}_${a}`];
}
