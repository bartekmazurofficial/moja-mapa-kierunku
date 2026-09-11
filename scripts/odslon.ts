/**
 * Odslanianie warstw raportu dla grupy. Do czasu, az powstanie panel.
 * Uzycie: npx tsx scripts/odslon.ts <kod grupy albo kod uczestnika> W1 W2 ...
 */

import { prisma } from "../lib/db/klient";
import { odblokujWarstwe, zamknijWarstwe } from "../lib/raport/dostep";
import { WARSTWY, type KodWarstwy } from "../lib/raport/sekcje";

async function main() {
  const [kod, ...warstwy] = process.argv.slice(2);
  if (!kod) {
    console.log("podaj kod grupy albo kod dostępu uczestnika, potem warstwy: W1 W2 W4A W4B W5");
    console.log("prefiks minus zamyka warstwę, np. -W4B");
    return;
  }

  const uczestnik = await prisma.uczestnik.findUnique({ where: { kodDostepu: kod } });
  const grupa = uczestnik
    ? await prisma.grupa.findUnique({ where: { id: uczestnik.grupaId } })
    : await prisma.grupa.findUnique({ where: { kod } });
  if (!grupa) throw new Error(`nie ma grupy ani uczestnika o kodzie ${kod}`);

  for (const w of warstwy) {
    if (w.startsWith("-")) {
      await zamknijWarstwe(grupa.id, w.slice(1) as KodWarstwy);
      console.log(`zamknięta: ${w.slice(1)}`);
    } else {
      await odblokujWarstwe(grupa.id, w as KodWarstwy);
      console.log(`odsłonięta: ${w}`);
    }
  }

  const stan = await prisma.odslona.findMany({ where: { grupaId: grupa.id } });
  console.log(`\n${grupa.nazwa}:`);
  for (const warstwa of WARSTWY.filter((w) => w.kod !== "ZAWSZE")) {
    const o = stan.find((x) => x.warstwa === warstwa.kod);
    console.log(`  ${warstwa.kod.padEnd(5)} ${o?.odblokowana ? "otwarta" : "zamknięta"}   ${warstwa.nazwa}`);
  }
  await prisma.$disconnect();
}

void main();
