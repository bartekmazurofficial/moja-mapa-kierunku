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

export function zbudujCiasteczko(teraz = Date.now()): { nazwa: string; wartosc: string; maxAge: number } {
  const wygasa = String(teraz + WAZNOSC_MS);
  return { nazwa: CIASTECZKO, wartosc: `${wygasa}.${podpisz(wygasa)}`, maxAge: WAZNOSC_MS / 1000 };
}

export function ciasteczkoWazne(wartosc: string | undefined, teraz = Date.now()): boolean {
  if (!wartosc) return false;
  const [wygasa, podpis] = wartosc.split(".");
  if (!wygasa || !podpis) return false;
  if (!rowne(podpis, podpisz(wygasa))) return false;
  return Number(wygasa) > teraz;
}

/** Czy biezace zadanie pochodzi od zalogowanego prowadzacego. */
export async function zalogowany(): Promise<boolean> {
  const ciastka = await cookies();
  return ciasteczkoWazne(ciastka.get(CIASTECZKO)?.value);
}

export const NAZWA_CIASTECZKA = CIASTECZKO;
