/**
 * Pokaz demonstracyjny: trzy panele do obejrzenia bez kodu.
 *
 * Na ekranie wejścia można pokazać trzy rzeczy naraz: panel uczestnika, który
 * jeszcze nic nie wypełnił, panel uczestnika po wszystkich czterech modułach
 * razem z raportem, i panel prowadzącego. Bez tego każdy pokaz produktu
 * wymaga kodu i cudzych danych.
 *
 * **Wszystko w grupie pokazowej jest zmyślone.** Uczestnicy są wypełnieni
 * skryptem, nie przez człowieka, a grupa ma stały kod, co byłoby błędem przy
 * każdej innej grupie i jest konieczne tutaj: link ma działać bez zaglądania
 * do bazy. Żadne prawdziwe dane nie mogą trafić do tej grupy.
 *
 * Sesja prowadzącego założona przez pokaz ma rolę `pokaz` i widzi wyłącznie
 * tę jedną grupę. Filtr stoi w `lib/prowadzacy/dane.ts`, czyli w warstwie
 * danych, a nie w stronach: strona może zapomnieć sprawdzić, zapytanie nie.
 *
 * Wyłączone domyślnie. Włącza `POKAZ_DEMO=1`.
 */

export const KOD_GRUPY_POKAZ = "POKAZ";

/** Imiona uczestników pokazowych. Po nich skrypt ich znajduje i odświeża. */
export const IMIE_POKAZ_PUSTY = "Pokaz · przed startem";
export const IMIE_POKAZ_PELNY = "Pokaz · po wszystkich modułach";

export function pokazWlaczony(): boolean {
  return process.env.POKAZ_DEMO === "1";
}
