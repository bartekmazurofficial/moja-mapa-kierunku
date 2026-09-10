/** Pomocniczy podglad rekordu zawodu. Uzycie: npx tsx scripts/pokaz-zawod.ts elektryk */
import { pobierzZawod } from "../lib/db/repozytorium";
import { prisma } from "../lib/db/klient";

async function main() {
  const kod = process.argv[2] ?? "elektryk";
  const z = await pobierzZawod(kod);
  if (!z) {
    console.error(`nie ma zawodu o kodzie "${kod}"`);
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify(z, null, 1));
    console.log("liczba pol:", Object.keys(z).length);
  }
  await prisma.$disconnect();
}

void main();
