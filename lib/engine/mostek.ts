/**
 * MOSTEK: szescdziesiat czynnosci na istniejaca baze zawodow.
 *
 * Specyfikacja nowego programu chce, zeby kazdy zawod mial wlasna liste
 * czynnosci z ocena 0-10 („co sie w tej pracy robi"). Tego w bazie nie ma
 * i nie bedzie: **baza zawodow zostaje nietknieta**, bo 157 kart razy
 * kilkadziesiat pol to jest osobny projekt, a nie efekt uboczny wymiany
 * assessmentow.
 *
 * Zamiast tego liczymy wage czynnosci z tego, co w bazie juz jest. Kazdy
 * zawod ma tam dziewiec znacznikow:
 *
 *   `a2r` trzy kompetencje wymagane, czyli rdzen roboty,
 *   `a2w` trzy kompetencje wspierajace, czyli to, co pomaga,
 *   `a1`  trzy obszary zainteresowan, czyli czym ta praca sie zajmuje.
 *
 * Kazda z szescdziesieciu czynnosci wskazuje, ktore ze znacznikow znacza to
 * samo. Z przeciecia wychodzi waga:
 *
 *   10  czynnosc odpowiada kompetencji WYMAGANEJ,
 *    8  czynnosc odpowiada obszarowi, ktorym ta praca sie zajmuje,
 *    7  czynnosc odpowiada kompetencji WSPIERAJACEJ,
 *    0  brak zwiazku, czynnosci nie liczymy dla tego zawodu.
 *
 * Bierzemy najwyzsza pasujaca, nie sume: zawod, ktory ma „negocjowanie"
 * i jako wymagane, i jako obszar, nie robi tego dwa razy mocniej.
 *
 * **Czego ten plik nie robi.** Nie jest drugim silnikiem i nie zmienia
 * kolejnosci zawodow sam z siebie. Jest tlumaczeniem jednego slownika na
 * drugi i tyle. Gdyby kiedys powstaly prawdziwe oceny 0-10 w kartach, ten
 * plik znika, a `wagaCzynnosci` czyta je wprost.
 */

import { BANK_CZYNNOSCI } from "../content/bank-czynnosci";
import type { Zawod } from "../domain/typy";

/** Waga, gdy czynnosc odpowiada kompetencji wymaganej przez zawod. */
export const WAGA_RDZEN = 10;
/** Waga, gdy czynnosc odpowiada temu, czym ta praca sie zajmuje. */
export const WAGA_OBSZAR = 8;
/** Waga, gdy czynnosc odpowiada kompetencji wspierajacej. */
export const WAGA_WSPARCIE = 7;

/**
 * Czynnosc na znaczniki karty zawodu.
 *
 * `a2` to kody z `KODY_A2` (trzydziesci trzy kompetencje kart), `a1` to kody
 * z `KODY_A1` (dwadziescia cztery obszary kart). **To nie sa numery pozycji
 * ze starych modulow A1 i A2**, tylko wlasny, bogatszy slownik bazy zawodow.
 *
 * Czynnosc bez ani jednego znacznika jest dopuszczalna: znaczy tylko tyle, ze
 * baza zawodow nie odroznia jej od sasiednich. Wtedy nie wnosi nic do
 * rankingu, ale nadal stoi w raporcie jako TOP 5 uczestnika.
 */
export interface MostekCzynnosci {
  a2?: string[];
  a1?: string[];
}

export const MOSTEK: Record<number, MostekCzynnosci> = {
  // --- ANALIZA ---
  1: { a2: ["analiza"] },
  2: { a2: ["problemy"] },
  3: { a2: ["problemy"], a1: ["dociekanie"] },
  4: { a2: ["analiza"] },
  5: { a2: ["system", "analiza"] },
  6: { a2: ["analiza", "system"] },
  7: { a2: ["analiza"] },
  8: { a2: ["rachunki"], a1: ["liczby"] },
  9: { a2: ["analiza", "rachunki"], a1: ["liczby"] },
  10: { a2: ["dokladnosc", "reguly"], a1: ["precyzja"] },

  // --- TECHNICZNE ---
  11: { a2: ["system"], a1: ["tech"] },
  12: { a2: ["problemy", "sprzet"], a1: ["naprawianie"] },
  13: { a2: ["manualne"], a1: ["rece"] },
  14: { a2: ["sprzet"] },
  15: { a2: ["manualne"], a1: ["precyzja", "rece"] },
  16: { a1: ["przyroda"] },
  17: { a1: ["przyroda"] },
  18: { a2: ["manualne"], a1: ["rece"] },

  // --- TWORCZE ---
  19: { a2: ["tworzenie"] },
  20: { a2: ["tworzenie"] },
  21: { a2: ["tworzenie", "problemy"] },
  22: { a2: ["tworzenie", "system"] },
  23: { a2: ["estetyka"], a1: ["obraz"] },
  24: { a2: ["estetyka"], a1: ["obraz"] },
  25: { a2: ["estetyka"], a1: ["obraz"] },
  26: { a2: ["estetyka", "tworzenie"], a1: ["obraz"] },
  27: { a2: ["slowo"], a1: ["pisanie"] },
  28: { a2: ["slowo"], a1: ["pisanie", "scena"] },
  29: { a1: ["dzwiek"] },
  30: { a2: ["slowo", "dokladnosc"], a1: ["pisanie"] },

  // --- KOMUNIKACJA ---
  31: { a2: ["wyjasnianie"], a1: ["uczenie"] },
  32: { a2: ["wyjasnianie"], a1: ["uczenie"] },
  33: { a2: ["wystapienia", "slowo"] },
  34: { a2: ["wystapienia"], a1: ["scena"] },
  35: { a1: ["rozmowa"] },
  36: { a2: ["wyczuwanie", "cierpliwosc"], a1: ["rozmowa"] },

  // --- RELACJE ---
  37: { a2: ["wyczuwanie"] },
  38: { a2: ["uprzejmosc"], a1: ["rozmowa"] },
  39: { a1: ["przekonywanie", "rozmowa"] },
  40: { a2: ["opiekunczosc", "cierpliwosc"], a1: ["opieka"] },
  41: { a2: ["wyjasnianie"], a1: ["rozmowa"] },
  42: { a2: ["prowadzenie_grupy", "przekonywanie"] },
  43: { a2: ["cierpliwosc"], a1: ["uczenie", "opieka"] },
  44: { a2: ["rozbrajanie"] },

  // --- WPLYW ---
  45: { a2: ["przekonywanie"], a1: ["przekonywanie"] },
  46: { a2: ["konfrontacja", "przekonywanie"], a1: ["prawo"] },
  47: { a2: ["negocjowanie"] },
  48: { a2: ["przekonywanie"], a1: ["przekonywanie", "przedsiebiorczosc"] },

  // --- ORGANIZACJA ---
  49: { a2: ["organizowanie"], a1: ["planowanie"] },
  50: { a2: ["organizowanie"], a1: ["planowanie"] },
  51: { a2: ["organizowanie", "zespol"] },
  52: { a2: ["system", "organizowanie"], a1: ["porzadek"] },
  53: { a2: ["organizowanie"], a1: ["porzadek"] },
  54: { a2: ["wytrwalosc", "samodzielnosc"] },
  55: { a2: ["dokladnosc"], a1: ["precyzja"] },

  // --- PRZYWODZTWO ---
  56: { a2: ["opanowanie", "samodzielnosc"] },
  57: { a2: ["system"] },
  58: { a2: ["prowadzenie_grupy"], a1: ["prowadzenie"] },
  59: { a2: ["prowadzenie_grupy", "organizowanie"] },
  60: { a2: ["samodzielnosc"], a1: ["przedsiebiorczosc"] },
};

/**
 * Ile ta czynnosc znaczy w tym zawodzie. Zero, gdy nie znaczy nic.
 *
 * Kolejnosc sprawdzania jest kolejnoscia wagi: rdzen bije obszar, obszar bije
 * wsparcie. Pierwsze trafienie wygrywa i dalej nie szukamy.
 */
export function wagaCzynnosci(czynnosc: number, zawod: Zawod): number {
  const m = MOSTEK[czynnosc];
  if (!m) return 0;
  const a2 = m.a2 ?? [];
  const a1 = m.a1 ?? [];
  if (a2.some((k) => zawod.a2r.includes(k))) return WAGA_RDZEN;
  if (a1.some((k) => zawod.a1.includes(k))) return WAGA_OBSZAR;
  if (a2.some((k) => zawod.a2w.includes(k))) return WAGA_WSPARCIE;
  return 0;
}

/** Komplet wag jednego zawodu: tylko czynnosci, ktore cos znacza. */
export function wagiZawodu(zawod: Zawod): Array<{ czynnosc: number; waga: number }> {
  const wynik: Array<{ czynnosc: number; waga: number }> = [];
  for (const c of BANK_CZYNNOSCI) {
    const waga = wagaCzynnosci(c.id, zawod);
    if (waga > 0) wynik.push({ czynnosc: c.id, waga });
  }
  return wynik.sort((a, b) => b.waga - a.waga || a.czynnosc - b.czynnosc);
}

/**
 * Zgodnosc jednego toru z zawodem: srednia wazona sily po czynnosciach,
 * ktore w tym zawodzie cokolwiek znacza.
 *
 * Dzielimy przez sume wag, a nie przez liczbe czynnosci, wiec zawod o dwoch
 * mocnych czynnosciach nie jest karany za to, ze ma ich mniej niz zawod
 * o dwunastu slabych.
 */
export function zgodnosc(sila: Record<number, number>, wagi: Array<{ czynnosc: number; waga: number }>): number {
  if (wagi.length === 0) return 0;
  let licznik = 0;
  let mianownik = 0;
  for (const { czynnosc, waga } of wagi) {
    licznik += waga * (sila[czynnosc] ?? 0);
    mianownik += waga;
  }
  return mianownik === 0 ? 0 : licznik / mianownik;
}
