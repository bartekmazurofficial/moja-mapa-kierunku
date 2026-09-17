/**
 * Porzadki po poprzedniej wersji programu.
 *
 * Baza trzyma kody modulow i warstw jako zwykle napisy, wiec po usunieciu
 * osmiu starych assessmentow zostaly w niej wiersze, ktorych nic juz nie
 * czyta. Dwa rodzaje z nich **zmieniaja zachowanie** i te kasujemy:
 *
 *   - `OtwarcieModulu` starych kodow: decyduje o tym, co grupa ma otwarte,
 *     a stary kod udaje otwarty modul, ktorego nie ma,
 *   - `Odslona` warstw poza `W4B`: stary raport mial ich szesc, nowy jedna.
 *
 * **Odpowiedzi uczestnikow zostaja.** To jest praca konkretnych ludzi z
 * pilotazu i nikt jej nie czyta, ale nikt jej tez nie odzyska. Skrypt
 * wypisuje, ile jej jest; kasowanie wymaga osobnej, swiadomej decyzji
 * i flagi `--skasuj-odpowiedzi`.
 *
 * Uzycie:
 *   npx tsx scripts/porzadki.ts                       (podglad, nic nie kasuje)
 *   npx tsx scripts/porzadki.ts --wykonaj
 *   npx tsx scripts/porzadki.ts --wykonaj --skasuj-odpowiedzi
 */

import { prisma } from "../lib/db/klient";
import { KOLEJNOSC_MODULOW } from "../lib/moduly/ekrany";
import { WARSTWY } from "../lib/raport/sekcje";

async function main() {
  const wykonaj = process.argv.includes("--wykonaj");
  const skasujOdpowiedzi = process.argv.includes("--skasuj-odpowiedzi");
  const moduly = KOLEJNOSC_MODULOW as string[];
  const warstwy = WARSTWY.map((w) => w.kod) as string[];

  const otwarcia = { modul: { notIn: moduly } };
  const odslony = { warstwa: { notIn: warstwy } };
  const odpowiedzi = { modul: { notIn: moduly } };
  const postepy = { kod: { notIn: moduly } };

  const [ileOtwarc, ileOdslon, ileOdpowiedzi, ilePostepow] = await Promise.all([
    prisma.otwarcieModulu.count({ where: otwarcia }),
    prisma.odslona.count({ where: odslony }),
    prisma.odpowiedz.count({ where: odpowiedzi }),
    prisma.postepModulu.count({ where: postepy }),
  ]);

  const stareModuly = await prisma.odpowiedz.groupBy({
    by: ["modul"],
    where: odpowiedzi,
    _count: { _all: true },
  });

  console.log(`\nZostaly po poprzedniej wersji programu:\n`);
  console.log(`  otwarcia modulow   ${ileOtwarc}`);
  console.log(`  odslony warstw     ${ileOdslon}`);
  console.log(`  postepy modulow    ${ilePostepow}`);
  console.log(`  odpowiedzi         ${ileOdpowiedzi}`);
  for (const m of stareModuly.sort((a, b) => b._count._all - a._count._all)) {
    console.log(`      ${m.modul.padEnd(4)} ${m._count._all}`);
  }

  if (!wykonaj) {
    console.log(`\nPodglad. Zeby skasowac otwarcia, odslony i postepy: --wykonaj`);
    console.log(`Odpowiedzi kasuje dopiero --wykonaj --skasuj-odpowiedzi.\n`);
    await prisma.$disconnect();
    return;
  }

  await prisma.otwarcieModulu.deleteMany({ where: otwarcia });
  await prisma.odslona.deleteMany({ where: odslony });
  await prisma.postepModulu.deleteMany({ where: postepy });
  console.log(`\nSkasowano otwarcia, odslony i postepy.`);

  if (skasujOdpowiedzi) {
    await prisma.odpowiedz.deleteMany({ where: odpowiedzi });
    console.log(`Skasowano ${ileOdpowiedzi} odpowiedzi z nieistniejacych modulow.`);
  } else {
    console.log(`Odpowiedzi (${ileOdpowiedzi}) zostaly nietkniete.`);
  }
  console.log();
  await prisma.$disconnect();
}

void main();
