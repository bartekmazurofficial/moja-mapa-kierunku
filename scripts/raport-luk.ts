/**
 * Raport luk miedzy slownikami kart a slownikami modulow.
 *
 * Wypisuje wszystko, czego silnik nie potrafi sprawdzic, bo karta wie wiecej,
 * niz assessment potrafi zapytac. Do uruchomienia po kazdej zmianie danych.
 */

import { pobierzBazeReferencyjna } from "../lib/db/repozytorium";
import { prisma } from "../lib/db/klient";
import { ANTYPROFIL, kodyNieaktywne } from "../lib/engine/antyprofil";
import {
  A2_KARTA_NA_MODUL,
  A3_KARTA_NA_MODUL,
  A4_KARTA_NA_MODUL,
  A5_KARTA_NA_MODUL,
} from "../lib/engine/mapowanie";
import { WYMIARY_A3 } from "../lib/domain/slowniki";

async function main() {
  const { zawody } = await pobierzBazeReferencyjna();

  const ile = (pole: (z: (typeof zawody)[number]) => string[], kod: string): number =>
    zawody.filter((z) => pole(z).includes(kod)).length;

  console.log("=".repeat(78));
  console.log("1. ANTYPROFIL: KODY NIEAKTYWNE");
  console.log("=".repeat(78));
  const nieaktywne = kodyNieaktywne();
  const aktywne = Object.values(ANTYPROFIL).filter((r) => r.aktywna).length;
  console.log(`aktywnych ${aktywne} z 60, nieaktywnych ${nieaktywne.length}\n`);
  const zLiczba = nieaktywne
    .map((n) => ({ ...n, zawodow: ile((z) => z.anty, n.kod) }))
    .sort((a, b) => b.zawodow - a.zawodow);
  for (const n of zLiczba) {
    console.log(`  ${n.kod.padEnd(22)} ${String(n.zawodow).padStart(3)} zawodów   ${n.powod}`);
  }
  console.log(`\n  łącznie trafień, których silnik nie sprawdzi: ${zLiczba.reduce((s, n) => s + n.zawodow, 0)}`);

  console.log("\n" + "=".repeat(78));
  console.log("2. WYMOGI GOTOWOŚCI Z KART BEZ POZYCJI W MODULE A5");
  console.log("=".repeat(78));
  const martweA5 = Object.entries(A5_KARTA_NA_MODUL)
    .filter(([, f]) => f === null)
    .map(([kod]) => ({ kod, zawodow: ile((z) => z.a5, kod) }))
    .sort((a, b) => b.zawodow - a.zawodow);
  for (const m of martweA5) {
    console.log(`  ${m.kod.padEnd(22)} ${String(m.zawodow).padStart(3)} zawodów`);
  }
  console.log(
    `\n  Te wymogi nie moga ani zawetowac zawodu, ani go obnizyc: uczestnik nigdy`,
  );
  console.log(`  nie jest o nie pytany. Łącznie dotyczy to ${martweA5.reduce((s, m) => s + m.zawodow, 0)} wystąpień w kartach.`);

  console.log("\n" + "=".repeat(78));
  console.log("3. STYL DZIAŁANIA: ROZJAZD MIĘDZY KARTAMI A MODUŁEM A3");
  console.log("=".repeat(78));
  const martweA3 = Object.entries(A3_KARTA_NA_MODUL)
    .filter(([, v]) => v === null)
    .map(([kod]) => ({ kod, zawodow: ile((z) => z.a3, kod) }));
  console.log("  kody kart bez wymiaru w module:");
  for (const m of martweA3) console.log(`    ${m.kod.padEnd(20)} ${String(m.zawodow).padStart(3)} zawodów`);
  const uzywaneWymiary = new Set(
    Object.values(A3_KARTA_NA_MODUL)
      .filter((v): v is string => v !== null)
      .map((v) => v.split(":")[0]),
  );
  const bezKodu = WYMIARY_A3.filter((w) => !uzywaneWymiary.has(w.kod));
  console.log("\n  wymiary modułu bez odpowiednika w kartach:");
  for (const w of bezKodu) console.log(`    ${w.kod}  ${w.biegunA} / ${w.biegunB}`);

  console.log("\n" + "=".repeat(78));
  console.log("4. POZOSTAŁE SŁOWNIKI");
  console.log("=".repeat(78));
  const martweA2 = Object.entries(A2_KARTA_NA_MODUL).filter(([, v]) => v === null).map(([k]) => k);
  const martweA4 = Object.entries(A4_KARTA_NA_MODUL).filter(([, v]) => v === null).map(([k]) => k);
  console.log(`  kody A2 bez kompetencji w module: ${martweA2.join(", ")}`);
  console.log(`    (występują wyłącznie w polu wspierającym, które nie wchodzi do mnożnika)`);
  console.log(`  kody A4 bez wartości w module:    ${martweA4.join(", ")}`);
  console.log(`    (pola A4 kart nie wchodzą do mnożnika, służą wyjaśnieniom)`);

  await prisma.$disconnect();
}

void main();
