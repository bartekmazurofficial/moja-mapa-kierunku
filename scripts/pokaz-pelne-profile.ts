/**
 * Trzy konta uczestnikow z wypelnionymi wszystkimi assessmentami.
 *
 * Do ogladania platformy w stanie, ktory normalnie powstaje dopiero po
 * czterech spotkaniach: pelny raport, lista zawodow, karty, porownania.
 * Skrypt **tylko dopisuje**: istniejacych uczestnikow nie rusza, a konto
 * o tym samym imieniu w tej grupie wypelnia ponownie zamiast tworzyc drugie.
 *
 *   npx tsx scripts/pokaz-pelne-profile.ts [nazwa grupy]
 */

import { prisma } from "../lib/db/klient";
import { losowyKod, sformatujKod } from "../lib/kody";
import { wypelnijUczestnika, type ProfilTestowy } from "../lib/testy/wypelnianie";
import { otworzModul } from "../lib/moduly/otwarcie";
import { odblokujWarstwe } from "../lib/raport/dostep";
import { KOLEJNOSC_MODULOW } from "../lib/moduly/ekrany";
import { WARSTWY } from "../lib/raport/sekcje";

/** Trzy rozne profile, zeby bylo widac, ze wynik naprawde zalezy od odpowiedzi. */
const KONTA: Array<{ imie: string; profil: ProfilTestowy }> = [
  { imie: "Zofia", profil: "spoleczny" },
  { imie: "Marek", profil: "rzemieslniczy" },
  { imie: "Nina", profil: "analityczny" },
];

async function main() {
  const nazwaGrupy = process.argv[2];

  const grupa = nazwaGrupy
    ? ((await prisma.grupa.findFirst({ where: { nazwa: nazwaGrupy } })) ??
      (await prisma.grupa.create({ data: { nazwa: nazwaGrupy, kod: losowyKod(8) } })))
    : ((await prisma.grupa.findFirst({ orderBy: { id: "asc" } })) ??
      (await prisma.grupa.create({ data: { nazwa: "Pilotaż testowy", kod: losowyKod(8) } })));

  console.log(`grupa: ${grupa.nazwa}\n`);

  for (const { imie, profil } of KONTA) {
    const istniejacy = await prisma.uczestnik.findFirst({
      where: { grupaId: grupa.id, imie },
    });
    const uczestnik =
      istniejacy ??
      (await prisma.uczestnik.create({
        data: { grupaId: grupa.id, imie, kodDostepu: losowyKod(10) },
      }));

    const ile = await wypelnijUczestnika(uczestnik.id, profil);
    console.log(
      `  ${imie.padEnd(7)} ${sformatujKod(uczestnik.kodDostepu).padEnd(16)} ` +
        `/u/${uczestnik.kodDostepu}   ${ile} zapisów, profil ${profil}` +
        `${istniejacy ? "  (wypełniony ponownie)" : ""}`,
    );
  }

  // Bez otwartych modulow i odslonietych warstw wypelnione odpowiedzi nie maja
  // gdzie sie pokazac: raport i lista zawodow stoja za brama dostepu.
  for (const m of KOLEJNOSC_MODULOW) await otworzModul(grupa.id, m);
  for (const w of WARSTWY) {
    if (w.kod !== "ZAWSZE") await odblokujWarstwe(grupa.id, w.kod);
  }
  console.log(`\notwarte wszystkie moduły i odsłonięte wszystkie warstwy raportu`);

  await prisma.$disconnect();
}

void main();
