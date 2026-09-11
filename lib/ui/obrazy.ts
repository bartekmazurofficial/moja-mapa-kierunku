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

/** Klucze, dla których leży plik. Ręczna lista: build ma nie chodzić po dysku. */
const Z_OBRAZEM = new Set<string>(
  Array.from({ length: 24 }, (_, i) => `a1-${i + 1}`),
);

export function maObraz(klucz: string): boolean {
  return Z_OBRAZEM.has(klucz);
}

/** Adres kafla (256 px). Null, gdy kategoria nie ma jeszcze ilustracji. */
export function obrazKafla(klucz: string): string | null {
  if (!maObraz(klucz)) return null;
  const [modul, numer] = klucz.split("-");
  return `/grafika/${modul}/${numer}.jpg`;
}

/** Adres większej wersji (768 px), do nagłówków i kart obszaru. */
export function obrazDuzy(klucz: string): string | null {
  if (!maObraz(klucz)) return null;
  const [modul, numer] = klucz.split("-");
  return `/grafika/${modul}/${numer}-duzy.jpg`;
}
