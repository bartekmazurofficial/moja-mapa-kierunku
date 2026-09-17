/**
 * Grupa pokazowa nowego programu.
 *
 * Osobna grupa, a nie dodatkowy uczestnik w `POKAZ`, i to nie jest ostroznosc:
 * wersja programu wynika z tego, co grupie otwarto, wiec otwarcie modulu `Z`
 * w grupie pokazowej przelaczyloby na nowy program takze uczestnikow, ktorzy
 * maja demonstrowac stary raport.
 *
 * **Wszystko tu jest zmyslone.** Skrypt nie dotyka zadnej innej grupy i nie
 * kopiuje danych od nikogo.
 *
 * Uzycie:
 *   npx tsx scripts/pokaz-nowy.ts
 *   DATABASE_URL=... npx tsx scripts/pokaz-nowy.ts     (na bazie produkcyjnej)
 */

import { prisma } from "../lib/db/klient";
import { wypelnijUczestnika } from "../lib/testy/wypelnianie";
import { otworzSpotkanie } from "../lib/moduly/otwarcie";
import { odblokujWarstwe } from "../lib/raport/dostep";
import { KOLEJNOSC_MODULOW } from "../lib/moduly/ekrany";
import { WARSTWY } from "../lib/raport/sekcje";
import { losowyKod, sformatujKod } from "../lib/kody";

const KOD_GRUPY = "POKAZNOWY";
const PUSTY = "Nowy program · przed startem";
const PELNY = "Nowy program · po czterech modułach";

async function uczestnik(grupaId: string, imie: string) {
  const istnieje = await prisma.uczestnik.findFirst({ where: { grupaId, imie } });
  if (istnieje) return istnieje;
  return prisma.uczestnik.create({ data: { grupaId, imie, kodDostepu: losowyKod() } });
}

async function main() {
  const grupa = await prisma.grupa.upsert({
    where: { kod: KOD_GRUPY },
    update: { nazwa: "Pokaz nowego programu" },
    create: { kod: KOD_GRUPY, nazwa: "Pokaz nowego programu" },
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

  for (const nr of [1, 2]) await otworzSpotkanie(grupa.id, nr);
  for (const w of WARSTWY) await odblokujWarstwe(grupa.id, w.kod);

  console.log(`\nGrupa pokazowa nowego programu (kod grupy ${sformatujKod(grupa.kod)})`);
  console.log(`  moduły: ${KOLEJNOSC_MODULOW.join(" ")}\n`);
  console.log(`  przed startem:  /u/${pusty.kodDostepu}`);
  console.log(`  po modułach:    /u/${pelny.kodDostepu}   (${zapisanych} pozycji)`);
  console.log(`  raport:         /u/${pelny.kodDostepu}/raport\n`);
  await prisma.$disconnect();
}

void main();
