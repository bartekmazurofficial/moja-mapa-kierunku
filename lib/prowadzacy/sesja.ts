/**
 * Logowanie prowadzacego: jedno konto, haslo ze zmiennej srodowiskowej,
 * sesja w podpisanym ciasteczku. Bez tabeli uzytkownikow i bez rejestracji.
 *
 * Ciasteczko nie zawiera zadnych danych poza data waznosci. Nie ma czego
 * podmienic, a podpis HMAC pilnuje, zeby nie dalo sie przedluzyc waznosci.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const CIASTECZKO = "prowadzacy";
/** Osiem godzin: tyle trwa dzien warsztatowy, nie dluzej. */
const WAZNOSC_MS = 8 * 60 * 60 * 1000;

function sekret(): string {
  const s = process.env.SESJA_SEKRET;
  if (!s || s.length < 32) {
    throw new Error("SESJA_SEKRET musi mieć co najmniej 32 znaki. Ustaw go w .env.");
  }
  return s;
}

function podpisz(tresc: string): string {
  return createHmac("sha256", sekret()).update(tresc).digest("hex");
}

/** Porownanie odporne na pomiar czasu. */
function rowne(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function hasloPoprawne(podane: string): boolean {
  const oczekiwane = process.env.PROWADZACY_HASLO;
  if (!oczekiwane) throw new Error("PROWADZACY_HASLO nie jest ustawione. Ustaw je w .env.");
  return rowne(podane, oczekiwane);
}

/**
 * Rola sesji.
 *
 * `pelna` to prowadzacy po haslem. `pokaz` to sesja zalozona przez ekran
 * demonstracyjny: widzi wylacznie grupe pokazowa i nie zna hasla. Rola jest
 * czescia podpisanej tresci ciasteczka, wiec nie da sie jej podmienic
 * na `pelna` bez sekretu.
 */
export type RolaSesji = "pelna" | "pokaz";

export function zbudujCiasteczko(
  teraz = Date.now(),
  rola: RolaSesji = "pelna",
): { nazwa: string; wartosc: string; maxAge: number } {
  const wygasa = String(teraz + WAZNOSC_MS);
  const tresc = `${wygasa}.${rola}`;
  return { nazwa: CIASTECZKO, wartosc: `${tresc}.${podpisz(tresc)}`, maxAge: WAZNOSC_MS / 1000 };
}

/** Rola z ciasteczka albo null, gdy nieważne. */
export function rolaZCiasteczka(wartosc: string | undefined, teraz = Date.now()): RolaSesji | null {
  if (!wartosc) return null;
  const czesci = wartosc.split(".");
  if (czesci.length !== 3) return null;
  const [wygasa, rola, podpis] = czesci;
  if (rola !== "pelna" && rola !== "pokaz") return null;
  if (!rowne(podpis, podpisz(`${wygasa}.${rola}`))) return null;
  if (!(Number(wygasa) > teraz)) return null;
  return rola;
}

export function ciasteczkoWazne(wartosc: string | undefined, teraz = Date.now()): boolean {
  return rolaZCiasteczka(wartosc, teraz) !== null;
}

/** Czy biezace zadanie pochodzi od zalogowanego prowadzacego. */
export async function zalogowany(): Promise<boolean> {
  return (await rolaSesji()) !== null;
}

/**
 * Rola biezacej sesji albo null.
 *
 * Null znaczy „brak sesji pokazowej", a nie „brak uprawnien": o wpuszczeniu
 * decyduje `zalogowany()` w stronie, a ta funkcja odpowiada tylko na pytanie,
 * czy zapytanie ma sie zawezic do grupy pokazowej.
 *
 * Poza zadaniem HTTP (skrypty, testy, zasiew bazy) ciasteczek nie ma i `cookies()`
 * rzuca. Tam sesji pokazowej byc nie moze, wiec zwracamy null zamiast przerywac
 * skrypt, ktory z panelem nie ma nic wspolnego.
 */
export async function rolaSesji(): Promise<RolaSesji | null> {
  try {
    const ciastka = await cookies();
    return rolaZCiasteczka(ciastka.get(CIASTECZKO)?.value);
  } catch {
    return null;
  }
}

export const NAZWA_CIASTECZKA = CIASTECZKO;
