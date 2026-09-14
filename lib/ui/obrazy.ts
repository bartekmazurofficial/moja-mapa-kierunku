/**
 * Ilustracje kategorii.
 *
 * Ta sama zasada co przy glifach: ilustrujemy **kategorię, nie pozycję**.
 * Moduł A1 ma 144 pozycje i tylko 24 obszary zainteresowań, więc 24 obrazy
 * obsługują cały moduł, a w jednym zestawie cztery pozycje pochodzą z czterech
 * różnych obszarów — żadne dwa kafle na ekranie nie mogą być takie same.
 *
 * Klucze są te same, których używają glify (`a1-1`…`a1-24`). Kategoria bez
 * obrazu dostaje rysowany glif, więc dosyłanie grafik partiami niczego nie psuje.
 *
 * Pliki leżą w `public/grafika/<moduł>/`. Oryginały mają 1254 px i po 2 MB,
 * więc do repozytorium trafia tylko to, co aplikacja naprawdę pobiera:
 * 256 px na kafel i 768 px na nagłówek. Przelicza je `scripts/grafiki.ts`.
 */

/**
 * Klucze, dla ktorych lezy plik. Reczna lista: build ma nie chodzic po dysku.
 *
 * Ilustracje dochodza partiami i **klucz dopisany tutaj musi miec plik**
 * w `public/grafika/<modul>/`, bo inaczej kafel pokaze pusta ramke. Dopoki
 * klucza tu nie ma, ekran po prostu go nie rysuje i nic sie nie psuje.
 *
 * Co czeka na pliki (spis tresci w GRAFIKI_DO_WYGENEROWANIA.md):
 *   - bieguny osi A3: `a3-INI-A`, `a3-INI-B`, ... (13 osi po dwa)
 *   - bieguny wymiarow M1: `m1w-CEN-A`, `m1w-CEN-B`, ... (12 po dwa)
 *   - plansze obszarow pod naglowek karty zawodu: `a1-1` ... `a1-24`
 */
const Z_OBRAZEM = new Set<string>([
  ...Array.from({ length: 24 }, (_, i) => `a1-${i + 1}`),
  ...Array.from({ length: 30 }, (_, i) => `a2-${i + 1}`),
  ...["INI", "STR", "TEM", "SAM", "GLE", "RYZ", "DEC", "KON", "NOW", "NAP", "RYT", "OTO", "EFE"].map(
    (kod) => `a3-${kod}`,
  ),
  ...["PIE", "STA", "WOL", "ROZ", "WPL", "SEN", "UZN", "REL", "CZA", "MIS", "ZMI", "ZAS"].map(
    (kod) => `a4-${kod}`,
  ),
]);

/**
 * Plansze pytań: kadr nad blokami odpowiedzi, proporcja 16:9 (1200 na 675).
 *
 * Lista jest pusta, dopóki plansz nie ma. Wtedy pas pokazuje duży znak
 * kategorii, a w A3 kwadratową ilustrację pośrodku. Po dosłaniu plików
 * wystarczy dopisać klucze tutaj: `components/Ikona.tsx` samo je weźmie.
 *
 * Spis tego, co ma być na których planszach: `GRAFIKI-KATEGORIE.md`.
 */
const Z_PLANSZA = new Set<string>([
  // Czterdziesci trzy warunki A5. Panel filtrow pokazuje wylacznie pas nad
  // odpowiedziami, wiec te klucze nie maja kwadratowego kafla i nie potrzebuja
  // go: `maObraz` uznaje sam pas.
  ...Array.from({ length: 43 }, (_, i) => `a5-F${String(i + 1).padStart(2, "0")}`),
]);

export function obrazPlanszy(klucz: string): string | null {
  if (!Z_PLANSZA.has(klucz)) return null;
  return `/grafika/plansze/${klucz}.jpg`;
}

/**
 * Czy dla klucza cokolwiek narysujemy.
 *
 * Prawda takze wtedy, gdy jest sam pas (plansza) bez kwadratowego kafla:
 * warunki A5 pokazuja sie wylacznie jako pas nad odpowiedziami, wiec
 * wymaganie od nich kafla zmuszaloby do rysowania obrazka, ktorego nikt
 * nigdy nie zobaczy.
 */
export function maObraz(klucz: string): boolean {
  return Z_OBRAZEM.has(klucz) || Z_PLANSZA.has(klucz);
}

/**
 * Klucz ilustracji bieguna pary.
 *
 * Gdy strony maja rozne kategorie (wartosci A4), ilustruje je sama kategoria.
 * Gdy dziela jedna os (A3, M1), biegun dostaje przyrostek `-A` albo `-B`.
 * Null, gdy pliku nie ma: kafel zostaje bez obrazu i nie udaje, ze cos tam jest.
 */
export function kluczBieguna(
  ikonaA: string | undefined,
  ikonaB: string | undefined,
  ktory: 0 | 1,
): string | null {
  const ikona = ktory === 0 ? ikonaA : ikonaB;
  if (!ikona) return null;
  const rozne = Boolean(ikonaA && ikonaB && ikonaA !== ikonaB);
  const klucz = rozne ? ikona : `${ikona}-${ktory === 0 ? "A" : "B"}`;
  return maObraz(klucz) ? klucz : null;
}

/** Czy obie strony pary maja wlasna ilustracje. Wtedy pas nad nimi jest zbedny. */
export function paraMaObrazy(ikonaA: string | undefined, ikonaB: string | undefined): boolean {
  return Boolean(kluczBieguna(ikonaA, ikonaB, 0) && kluczBieguna(ikonaA, ikonaB, 1));
}

/** Adres kafla (256 px). Null, gdy kategoria nie ma jeszcze kwadratowej ilustracji. */
export function obrazKafla(klucz: string): string | null {
  if (!Z_OBRAZEM.has(klucz)) return null;
  const [modul, ...reszta] = klucz.split("-");
  return `/grafika/${modul}/${reszta.join("-")}.jpg`;
}

/** Adres większej wersji (768 px), do nagłówków i kart obszaru. */
export function obrazDuzy(klucz: string): string | null {
  if (!Z_OBRAZEM.has(klucz)) return null;
  const [modul, ...reszta] = klucz.split("-");
  return `/grafika/${modul}/${reszta.join("-")}-duzy.jpg`;
}

