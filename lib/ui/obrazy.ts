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
 *   - wartosci A4: `a4-PIE`, `a4-STA`, ... (12)
 *   - warunki A5: `a5-F01` ... `a5-F43` albo same bloki `a5-1` ... `a5-7`
 *   - kompetencje A2: `a2-1` ... `a2-30`
 */
const Z_OBRAZEM = new Set<string>([
  ...Array.from({ length: 24 }, (_, i) => `a1-${i + 1}`),
  ...["INI", "STR", "TEM", "SAM", "GLE", "RYZ", "DEC", "KON", "NOW", "NAP", "RYT", "OTO", "EFE"].map(
    (kod) => `a3-${kod}`,
  ),
]);

export function maObraz(klucz: string): boolean {
  return Z_OBRAZEM.has(klucz);
}

/** Adres kafla (256 px). Null, gdy kategoria nie ma jeszcze ilustracji. */
export function obrazKafla(klucz: string): string | null {
  if (!maObraz(klucz)) return null;
  const [modul, ...reszta] = klucz.split("-");
  return `/grafika/${modul}/${reszta.join("-")}.jpg`;
}

/** Adres większej wersji (768 px), do nagłówków i kart obszaru. */
export function obrazDuzy(klucz: string): string | null {
  if (!maObraz(klucz)) return null;
  const [modul, ...reszta] = klucz.split("-");
  return `/grafika/${modul}/${reszta.join("-")}-duzy.jpg`;
}

/**
 * Plansze pytań: poziomy pas nad blokami odpowiedzi, proporcja około 3,7:1.
 *
 * Lista jest pusta, dopóki plansz nie ma. Wtedy pas pokazuje duży znak
 * kategorii, a w A3 kwadratową ilustrację pośrodku. Po dosłaniu plików
 * wystarczy dopisać klucze tutaj: `components/Ikona.tsx` samo je weźmie.
 *
 * Spis tego, co ma być na których planszach: `GRAFIKI-KATEGORIE.md`.
 */
const Z_PLANSZA = new Set<string>([]);

export function obrazPlanszy(klucz: string): string | null {
  if (!Z_PLANSZA.has(klucz)) return null;
  return `/grafika/plansze/${klucz}.jpg`;
}
