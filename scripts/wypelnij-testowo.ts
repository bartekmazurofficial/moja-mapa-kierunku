/**
 * Wypelnia moduly uczestnika prawdopodobnymi odpowiedziami.
 * Logika siedzi w lib/testy/wypelnianie.ts, zeby korzystaly z niej takze testy.
 *
 * Uzycie: npx tsx scripts/wypelnij-testowo.ts <kodDostepu> [profil]
 *   profil: rzemieslniczy | spoleczny | analityczny | plaski
 */

import { prisma } from "../lib/db/klient";
import { wypelnijUczestnika, type ProfilTestowy } from "../lib/testy/wypelnianie";

async function main() {
  const [kodDostepu, profilArg] = process.argv.slice(2);
  if (!kodDostepu) {
    console.log("podaj kod dostępu uczestnika, opcjonalnie profil");
    return;
  }
  const uczestnik = await prisma.uczestnik.findUnique({ where: { kodDostepu } });
  if (!uczestnik) throw new Error(`nie ma uczestnika o kodzie ${kodDostepu}`);

  const profil = (profilArg ?? "rzemieslniczy") as ProfilTestowy;
  const ile = await wypelnijUczestnika(uczestnik.id, profil);
  console.log(`${uczestnik.imie}: wypełniono siedem modułów, ${ile} zapisów, profil ${profil}`);
  await prisma.$disconnect();
}

void main();
