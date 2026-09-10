/**
 * Zaklada grupe pilotazowa i uczestnikow, wypisuje kody dostepu.
 * Uzycie: npx tsx scripts/seed-grupa.ts "Pilotaż 2026" Ania Bartek Cezary
 */

import { prisma } from "../lib/db/klient";
import { losowyKod, sformatujKod } from "../lib/kody";

const DOMYSLNE_IMIONA = [
  "Ania", "Bartek", "Celina", "Dawid", "Ewa", "Filip",
  "Gosia", "Hubert", "Iga", "Jakub", "Kinga", "Leon",
];

async function main() {
  const [nazwa = "Pilotaż", ...imiona] = process.argv.slice(2);
  const lista = imiona.length > 0 ? imiona : DOMYSLNE_IMIONA;

  const grupa = await prisma.grupa.create({
    data: { nazwa, kod: losowyKod(8) },
  });

  console.log(`\nGRUPA: ${grupa.nazwa}   (kod grupy ${sformatujKod(grupa.kod)})\n`);
  console.log("  imię         kod dostępu        adres");
  console.log("  " + "-".repeat(62));

  for (const imie of lista) {
    const kodDostepu = losowyKod(10);
    await prisma.uczestnik.create({ data: { grupaId: grupa.id, imie, kodDostepu } });
    console.log(`  ${imie.padEnd(12)} ${sformatujKod(kodDostepu).padEnd(18)} /u/${kodDostepu}`);
  }

  console.log(`\n  ${lista.length} uczestników. Kody są losowe i nie da się ich wyliczyć.\n`);
  await prisma.$disconnect();
}

void main();
