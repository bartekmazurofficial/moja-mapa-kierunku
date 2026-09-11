/**
 * Otwieranie modulow dla grupy z wiersza polecen.
 * Uzycie: npx tsx scripts/otworz.ts <kod grupy | kod uczestnika | --wszystkie> [A1 A2 ... | 1 2 3]
 */

import { prisma } from "../lib/db/klient";
import { MODULY_SPOTKANIA, otwarteModuly, otworzModul, otworzSpotkanie, zamknijModul } from "../lib/moduly/otwarcie";
import { KOLEJNOSC_MODULOW } from "../lib/moduly/ekrany";
import type { KodModulu } from "../lib/moduly/typy";

async function grupyZArgumentu(kod: string) {
  if (kod === "--wszystkie") return prisma.grupa.findMany();
  const uczestnik = await prisma.uczestnik.findUnique({ where: { kodDostepu: kod } });
  const grupa = uczestnik
    ? await prisma.grupa.findUnique({ where: { id: uczestnik.grupaId } })
    : await prisma.grupa.findUnique({ where: { kod } });
  if (!grupa) throw new Error(`nie ma grupy ani uczestnika o kodzie ${kod}`);
  return [grupa];
}

async function main() {
  const [kod, ...co] = process.argv.slice(2);
  if (!kod) {
    console.log("podaj kod grupy, kod uczestnika albo --wszystkie");
    console.log("potem moduły (A1 A2 M1) albo numery spotkań (1 2 3); prefiks minus zamyka");
    return;
  }

  for (const grupa of await grupyZArgumentu(kod)) {
    for (const arg of co) {
      if (arg.startsWith("-")) {
        await zamknijModul(grupa.id, arg.slice(1) as KodModulu);
      } else if (/^\d$/.test(arg)) {
        await otworzSpotkanie(grupa.id, Number(arg));
      } else {
        await otworzModul(grupa.id, arg as KodModulu);
      }
    }
    const otwarte = await otwarteModuly(grupa.id);
    const opis = KOLEJNOSC_MODULOW.map((m) => `${m}${otwarte.has(m) ? "+" : "-"}`).join(" ");
    console.log(`${grupa.nazwa.padEnd(28)} ${opis}`);
  }

  console.log(`\nspotkania: ${Object.entries(MODULY_SPOTKANIA).map(([n, m]) => `${n}=${m.join(",")}`).join("  ")}`);
  await prisma.$disconnect();
}

void main();
