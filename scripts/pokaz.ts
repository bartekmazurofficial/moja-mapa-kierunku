/**
 * Grupa pokazowa: dwa panele uczestnika do obejrzenia bez kodu.
 *
 * Jeden uczestnik przed startem, drugi po wszystkich czterech etapach,
 * z odslonietymi zawodami. Drugi jest wypelniony tym samym kodem, ktorego
 * uzywaja testy, wiec jego raport przechodzi przez ten sam silnik co
 * prawdziwy.
 *
 * **Wszystko tu jest zmyslone.** Skrypt nie dotyka zadnej innej grupy i nie
 * kopiuje danych od nikogo. Stalego kodu grupy nie wolno uzyc nigdzie indziej.
 *
 * Uzycie:
 *   npx tsx scripts/pokaz.ts
 *   DATABASE_URL=... npx tsx scripts/pokaz.ts     (na bazie produkcyjnej)
 */

import { prisma } from "../lib/db/klient";
import { wypelnijUczestnika } from "../lib/testy/wypelnianie";
import { odblokujWarstwe } from "../lib/raport/dostep";
import { KOLEJNOSC_MODULOW } from "../lib/moduly/ekrany";
import { WARSTWY } from "../lib/raport/sekcje";
import { losowyKod, sformatujKod } from "../lib/kody";

import { KOD_GRUPY_POKAZ, IMIE_POKAZ_PELNY, IMIE_POKAZ_PUSTY } from "../lib/pokaz";

const KOD_GRUPY = KOD_GRUPY_POKAZ;
const PUSTY = IMIE_POKAZ_PUSTY;
const PELNY = IMIE_POKAZ_PELNY;

async function uczestnik(grupaId: string, imie: string) {
  const istnieje = await prisma.uczestnik.findFirst({ where: { grupaId, imie } });
  if (istnieje) return istnieje;
  return prisma.uczestnik.create({ data: { grupaId, imie, kodDostepu: losowyKod() } });
}

async function main() {
  const grupa = await prisma.grupa.upsert({
    where: { kod: KOD_GRUPY },
    update: { nazwa: "Pokaz demonstracyjny" },
    create: { kod: KOD_GRUPY, nazwa: "Pokaz demonstracyjny" },
  });

  const pusty = await uczestnik(grupa.id, PUSTY);
  const pelny = await uczestnik(grupa.id, PELNY);

  // Pusty zostaje pusty takze po ponownym uruchomieniu: ktos mogl go
  // przeklikac przy poprzednim pokazie.
  for (const u of [pusty, pelny]) {
    await prisma.odpowiedz.deleteMany({ where: { uczestnikId: u.id } });
    await prisma.postepModulu.deleteMany({ where: { uczestnikId: u.id } });
  }
  const zapisanych = await wypelnijUczestnika(pelny.id, "rzemieslniczy");

  for (const w of WARSTWY) await odblokujWarstwe(grupa.id, w.kod);

  console.log(`\nGrupa pokazowa (kod grupy ${sformatujKod(grupa.kod)})`);
  console.log(`  etapy: ${KOLEJNOSC_MODULOW.join(" ")}\n`);
  console.log(`  przed startem:  /u/${pusty.kodDostepu}`);
  console.log(`  po etapach:     /u/${pelny.kodDostepu}   (${zapisanych} pozycji)`);
  console.log(`  raport:         /u/${pelny.kodDostepu}/raport\n`);
  await prisma.$disconnect();
}

void main();
