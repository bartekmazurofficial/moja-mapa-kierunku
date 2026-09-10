/** Liczy pelny wynik uczestnika z zapisanych odpowiedzi. */
import { prisma } from "../lib/db/klient";
import { zbierzOdpowiedzi } from "../lib/moduly/zbieranie";
import { zlozWynikiModulow } from "../lib/engine/moduly";
import { uruchomSilnik } from "../lib/engine";
import { pobierzBazeReferencyjna } from "../lib/db/repozytorium";

async function main() {
  const kod = process.argv[2];
  const uczestnik = await prisma.uczestnik.findUnique({ where: { kodDostepu: kod } });
  if (!uczestnik) throw new Error(`nie ma uczestnika ${kod}`);

  const odpowiedzi = await zbierzOdpowiedzi(uczestnik.id);
  const wyniki = zlozWynikiModulow(odpowiedzi);
  const baza = await pobierzBazeReferencyjna();
  const r = uruchomSilnik(wyniki, baza);

  console.log(`\n${uczestnik.imie.toUpperCase()}   pewność profilu: ${r.wskazniki.pewnosc}`);
  console.log(`   A1 zróżnicowanie ${r.wskazniki.zroznicowanieA1.toFixed(1)} · A2 ${r.wskazniki.zroznicowanieA2.toFixed(1)} · zamknięcie ${r.wskazniki.wskaznikZamkniecia} · okazje ${r.wskazniki.wskaznikOkazji}`);

  console.log("\nOBSZARY");
  for (const o of r.warstwa1.obszary.slice(0, 5)) {
    console.log(`  ${o.wynik.toFixed(1).padStart(6)}  ${o.pasmo.padEnd(16)} ${o.nazwa}`);
  }
  console.log("\nTRZY DROGI");
  for (const d of r.warstwa1.drogi) {
    console.log(`  ${d.etykieta}: ${d.nazwaObszaru} [${d.poziom.etykieta}, ${d.poziom.czas}]`);
  }
  console.log(`  flagi: ${r.warstwa1.flagi.join(", ") || "brak"}`);

  console.log(`\nPOZYCJE (${r.warstwa2.pozycje.length})`);
  for (const p of r.warstwa2.pozycje.slice(0, 8)) {
    console.log(`  ${String(p.wynik).padStart(5)}  ${p.typ === "klaster" ? "[K] " : "    "}${p.nazwa}`);
  }
  console.log(`\nSTUDIA: ${r.warstwa3.sensStudiow} (udział ${r.warstwa3.udzialZawodowZeStudiami})`);
  console.log(`KIERUNKI: ${r.warstwa3.kierunki.slice(0, 3).map((k) => `${k.nazwa} ${k.wynik}`).join(" · ")}`);
  console.log(`DROGI BEZ STUDIÓW: ${r.warstwa3.drogiBezStudiow.slice(0, 3).map((d) => d.nazwa).join(" · ")}`);
  console.log(`\nPYTANIA NA SESJĘ: ${r.pytaniaNaSesje.length}`);
  for (const p of r.pytaniaNaSesje.slice(0, 3)) console.log(`  - ${p.slice(0, 120)}`);
  console.log();
  await prisma.$disconnect();
}
void main();
