/**
 * Kasuje postęp uczestników i ustawia grupę na stan pierwszego dnia.
 *
 * Usuwa wyłącznie to, co uczestnik wprowadził: odpowiedzi, postęp modułów,
 * zapisane wyniki, oceny zawodów, pytanie na sesję, korekty prowadzącego
 * i podsumowanie rozmowy. Grupy, uczestnicy i ich kody dostępu zostają —
 * inaczej trzeba by rozdawać nowe kody.
 *
 * Uzycie:
 *   npx tsx scripts/reset.ts                    wszystkie grupy, stan pierwszego dnia
 *   npx tsx scripts/reset.ts --moduly           dodatkowo otwiera wszystkie moduły
 *   npx tsx scripts/reset.ts --warstwy          dodatkowo odsłania wszystkie warstwy
 *   npx tsx scripts/reset.ts <kod grupy> ...    tylko ta grupa
 *
 * Grupa testowa zakladana przez testy automatyczne (kod TESTAUTO) jest
 * kasowana w calosci: testy odtwarzaja ja same przy nastepnym uruchomieniu.
 */

import { prisma } from "../lib/db/klient";
import { KOLEJNOSC_MODULOW } from "../lib/moduly/ekrany";
import { otworzModul, otworzSpotkanie, zamknijModul } from "../lib/moduly/otwarcie";
import { odblokujWarstwe, zamknijWarstwe } from "../lib/raport/dostep";
import { WARSTWY, type KodWarstwy } from "../lib/raport/sekcje";

async function main() {
  const argumenty = process.argv.slice(2);
  const wszystkieModuly = argumenty.includes("--moduly");
  const wszystkieWarstwy = argumenty.includes("--warstwy");
  const kodGrupy = argumenty.find((a) => !a.startsWith("--"));

  // Grupa testów automatycznych nie jest niczyim pilotażem: kasujemy ją całą,
  // żeby nie wisiała w panelu ani na liście wejścia. Testy odtworzą ją same.
  if (!kodGrupy) {
    const automat = await prisma.grupa.findUnique({ where: { kod: "TESTAUTO" } });
    if (automat) {
      await prisma.grupa.delete({ where: { id: automat.id } });
      console.log("skasowana grupa testów automatycznych (TESTAUTO)");
    }
  }

  const grupy = kodGrupy
    ? [await prisma.grupa.findUniqueOrThrow({ where: { kod: kodGrupy } })]
    : await prisma.grupa.findMany();

  for (const grupa of grupy) {
    const uczestnicy = await prisma.uczestnik.findMany({
      where: { grupaId: grupa.id },
      select: { id: true, imie: true },
    });
    const idki = uczestnicy.map((u) => u.id);

    // Kolejność ma znaczenie tylko tam, gdzie są klucze obce; tu każda tabela
    // wisi bezpośrednio na uczestniku, więc kasujemy wprost.
    const usuniete = {
      odpowiedzi: (await prisma.odpowiedz.deleteMany({ where: { uczestnikId: { in: idki } } })).count,
      postepy: (await prisma.postepModulu.deleteMany({ where: { uczestnikId: { in: idki } } })).count,
      wyniki: (await prisma.wynik.deleteMany({ where: { uczestnikId: { in: idki } } })).count,
      oceny: (await prisma.ocenaZawodu.deleteMany({ where: { uczestnikId: { in: idki } } })).count,
      pytania: (await prisma.pytanieUczestnika.deleteMany({ where: { uczestnikId: { in: idki } } })).count,
      korekty: (await prisma.korekta.deleteMany({ where: { uczestnikId: { in: idki } } })).count,
      sesje: (await prisma.sesja.deleteMany({ where: { uczestnikId: { in: idki } } })).count,
    };

    // Stan pierwszego dnia: otwarte spotkanie pierwsze, żadna warstwa raportu.
    for (const m of KOLEJNOSC_MODULOW) await zamknijModul(grupa.id, m);
    for (const w of WARSTWY) await zamknijWarstwe(grupa.id, w.kod);

    if (wszystkieModuly) for (const m of KOLEJNOSC_MODULOW) await otworzModul(grupa.id, m);
    else await otworzSpotkanie(grupa.id, 1);

    if (wszystkieWarstwy) {
      for (const w of WARSTWY.filter((x) => x.kod !== "ZAWSZE")) {
        await odblokujWarstwe(grupa.id, w.kod as KodWarstwy);
      }
    }

    const otwarte = await prisma.otwarcieModulu.findMany({ where: { grupaId: grupa.id } });
    const odsloniete = await prisma.odslona.findMany({ where: { grupaId: grupa.id } });

    console.log(`\n${grupa.nazwa}   (kod grupy ${grupa.kod})`);
    console.log(`  uczestników:      ${uczestnicy.length}, wszyscy do zrobienia`);
    console.log(
      `  skasowane:        ${usuniete.odpowiedzi} odpowiedzi, ${usuniete.postepy} postępów, ` +
        `${usuniete.oceny} ocen, ${usuniete.korekty} korekt, ${usuniete.sesje} sesji`,
    );
    console.log(
      `  moduły otwarte:   ${KOLEJNOSC_MODULOW.filter((m) => otwarte.some((o) => o.modul === m)).join(" ") || "brak"}`,
    );
    console.log(
      `  warstwy raportu:  ${odsloniete.map((o) => o.warstwa).join(" ") || "żadna"}`,
    );
  }

  console.log("\ngotowe");
  await prisma.$disconnect();
}

void main();
