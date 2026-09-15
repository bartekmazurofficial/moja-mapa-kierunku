/**
 * Grupa pokazowa: dwa panele uczestnika do obejrzenia bez kodu.
 *
 * Tworzy albo odswieza grupe o stalym kodzie `POKAZ` i w niej dwoch
 * uczestnikow: jednego bez ani jednej odpowiedzi i jednego po wszystkich
 * siedmiu modulach, z odslonietymi warstwami raportu. Drugi jest wypelniony
 * tym samym kodem, ktorego uzywaja testy, wiec jego raport przechodzi przez
 * ten sam silnik co prawdziwy.
 *
 * **Wszystko tu jest zmyslone.** Skrypt nie dotyka zadnej innej grupy i nie
 * kopiuje danych od nikogo. Stalego kodu grupy nie wolno uzyc nigdzie indziej.
 *
 * Uzycie:
 *   npx tsx scripts/pokaz.ts
 */

import { prisma } from "../lib/db/klient";
import { wypelnijUczestnika } from "../lib/testy/wypelnianie";
import { otworzModul, otworzSpotkanie } from "../lib/moduly/otwarcie";
import { odblokujWarstwe } from "../lib/raport/dostep";
import { KOLEJNOSC_MODULOW } from "../lib/moduly/ekrany";
import { WARSTWY } from "../lib/raport/sekcje";
import { KOD_GRUPY_POKAZ, IMIE_POKAZ_PELNY, IMIE_POKAZ_PUSTY } from "../lib/pokaz";
import { losowyKod } from "../lib/kody";

async function uczestnik(grupaId: string, imie: string) {
  const istnieje = await prisma.uczestnik.findFirst({ where: { grupaId, imie } });
  if (istnieje) return istnieje;
  return prisma.uczestnik.create({ data: { grupaId, imie, kodDostepu: losowyKod() } });
}

async function main() {
  const grupa = await prisma.grupa.upsert({
    where: { kod: KOD_GRUPY_POKAZ },
    update: { nazwa: "Pokaz demonstracyjny" },
    create: { kod: KOD_GRUPY_POKAZ, nazwa: "Pokaz demonstracyjny" },
  });

  const pusty = await uczestnik(grupa.id, IMIE_POKAZ_PUSTY);
  const pelny = await uczestnik(grupa.id, IMIE_POKAZ_PELNY);

  // Pusty zostaje pusty takze po ponownym uruchomieniu: ktos mogl go
  // przeklikac przy poprzednim pokazie.
  await prisma.odpowiedz.deleteMany({ where: { uczestnikId: pusty.id } });
  await prisma.postepModulu.deleteMany({ where: { uczestnikId: pusty.id } });

  await prisma.odpowiedz.deleteMany({ where: { uczestnikId: pelny.id } });
  await prisma.postepModulu.deleteMany({ where: { uczestnikId: pelny.id } });
  const zapisanych = await wypelnijUczestnika(pelny.id, "analityczny");

  // Wszystkie moduly otwarte, zeby pusty mial w co wejsc, i wszystkie warstwy
  // raportu odsloniete, zeby pelny pokazal raport w calosci.
  for (const m of KOLEJNOSC_MODULOW) await otworzModul(grupa.id, m);
  for (const s of [1, 2, 3, 4, 5]) await otworzSpotkanie(grupa.id, s);
  for (const w of WARSTWY) await odblokujWarstwe(grupa.id, w.kod);

  console.log("Grupa pokazowa gotowa.");
  console.log(`  pusty:  /u/${pusty.kodDostepu}`);
  console.log(`  pełny:  /u/${pelny.kodDostepu}  (${zapisanych} odpowiedzi)`);
  console.log("  panel prowadzącego: /wejscie, przycisk „Panel prowadzącego”");
  await prisma.$disconnect();
}

void main();
