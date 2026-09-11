/**
 * Pomiar obciążenia: dwunastu uczestników wypełnia moduły jednocześnie.
 *
 * Nie chodzi o rekord wydajności, tylko o jedną odpowiedź: czy przy grupie
 * pracującej naraz któryś zapis przepada. SQLite obsługuje jeden zapis naraz,
 * więc to jest przypuszczenie do sprawdzenia, a nie pewnik.
 *
 * Skrypt zakłada własną grupę, pisze do niej przez prawdziwe API i na koniec
 * ją kasuje. Nie dotyka danych pilotażowych.
 *
 * Uzycie: npx tsx scripts/obciazenie.ts [adres] [sekundy] [osob]
 */

import { prisma } from "../lib/db/klient";
import { losowyKod } from "../lib/kody";
import { otworzModul } from "../lib/moduly/otwarcie";

interface Wynik {
  wyslane: number;
  potwierdzone: number;
  odrzucone: number;
  bledy: number;
  opoznienia: number[];
}

async function uczestnikPisze(
  adres: string,
  kod: string,
  doKiedy: number,
  wynik: Wynik,
): Promise<void> {
  let nr = 0;
  while (Date.now() < doKiedy) {
    nr++;
    const start = Date.now();
    wynik.wyslane++;
    try {
      const odpowiedz = await fetch(`${adres}/api/odpowiedz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kod,
          modul: "A1",
          czesc: "A",
          pozycja: `blok_${nr}`,
          wartosc: { a: nr, b: nr + 1, c: nr + 2, d: nr + 3 },
          msSpent: 4000 + nr,
        }),
      });
      wynik.opoznienia.push(Date.now() - start);
      if (odpowiedz.ok) wynik.potwierdzone++;
      else wynik.odrzucone++;
    } catch {
      wynik.bledy++;
    }
    // Realistyczne tempo: uczestnik nie klika częściej niż raz na sekundę.
    await new Promise((r) => setTimeout(r, 300));
  }
}

function percentyl(liczby: number[], p: number): number {
  const s = [...liczby].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((s.length * p) / 100))] ?? 0;
}

async function main() {
  const adres = process.argv[2] ?? "http://localhost:3100";
  const sekundy = Number(process.argv[3] ?? 300);
  const osob = Number(process.argv[4] ?? 12);

  const grupa = await prisma.grupa.create({
    data: { nazwa: `Pomiar obciążenia ${new Date().toISOString()}`, kod: losowyKod(8) },
  });
  await otworzModul(grupa.id, "A1");

  const kody: string[] = [];
  for (let i = 0; i < osob; i++) {
    const kodDostepu = losowyKod(10);
    await prisma.uczestnik.create({
      data: { grupaId: grupa.id, imie: `Test ${i + 1}`, kodDostepu },
    });
    kody.push(kodDostepu);
  }

  console.log(`${osob} osób pisze przez ${sekundy} s do ${adres}`);
  const wyniki: Wynik[] = kody.map(() => ({
    wyslane: 0, potwierdzone: 0, odrzucone: 0, bledy: 0, opoznienia: [],
  }));

  const start = Date.now();
  await Promise.all(
    kody.map((kod, i) => uczestnikPisze(adres, kod, start + sekundy * 1000, wyniki[i])),
  );
  const trwalo = (Date.now() - start) / 1000;

  const suma = (pole: keyof Omit<Wynik, "opoznienia">) =>
    wyniki.reduce((s, w) => s + w[pole], 0);
  const wszystkieOpoznienia = wyniki.flatMap((w) => w.opoznienia);

  // Najważniejsza liczba: czy każdy potwierdzony zapis siedzi w bazie.
  const wBazie = await prisma.odpowiedz.count({
    where: { uczestnik: { grupaId: grupa.id } },
  });
  const oczekiwane = wyniki.reduce((s, w, i) => {
    // Każdy uczestnik pisze do innych pozycji, więc liczba wierszy to liczba
    // potwierdzonych zapisów danej osoby.
    return s + w.potwierdzone;
  }, 0);

  console.log(`\nczas                ${trwalo.toFixed(1)} s`);
  console.log(`wysłane             ${suma("wyslane")}`);
  console.log(`potwierdzone        ${suma("potwierdzone")}`);
  console.log(`odrzucone (4xx/5xx) ${suma("odrzucone")}`);
  console.log(`błędy sieci         ${suma("bledy")}`);
  console.log(`opóźnienie mediana  ${percentyl(wszystkieOpoznienia, 50)} ms`);
  console.log(`opóźnienie p95      ${percentyl(wszystkieOpoznienia, 95)} ms`);
  console.log(`opóźnienie maks     ${Math.max(...wszystkieOpoznienia)} ms`);
  console.log(`\nwierszy w bazie     ${wBazie}`);
  console.log(`oczekiwanych        ${oczekiwane}`);
  console.log(wBazie === oczekiwane ? "\nŻaden zapis nie przepadł." : "\nUWAGA: zapisy przepadły.");

  await prisma.grupa.delete({ where: { id: grupa.id } });
  console.log("grupa pomiarowa skasowana");
  await prisma.$disconnect();
}

void main();
