import { randomInt } from "node:crypto";

/**
 * Kody dostepu. Losowe i niewyliczalne, bo raport zawiera wizje zycia,
 * informacje o zdrowiu i o sytuacji finansowej.
 *
 * Alfabet bez znakow, ktore mylą sie przy przepisywaniu z kartki:
 * bez 0, O, 1, I, L, U, V.
 */
const ALFABET = "23456789ABCDEFGHJKMNPQRSTWXYZ";

export function losowyKod(dlugosc = 10): string {
  let kod = "";
  for (let i = 0; i < dlugosc; i++) kod += ALFABET[randomInt(ALFABET.length)];
  return kod;
}

/** Do pokazania na kartce: K7M2-X9RT-Q4. */
export function sformatujKod(kod: string): string {
  return kod.replace(/(.{4})(.{4})(.*)/, "$1-$2-$3").replace(/-$/, "");
}
