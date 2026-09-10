/** Podglad pelnego wyniku silnika dla profilu kontrolnego. */
import { pobierzBazeReferencyjna } from "../lib/db/repozytorium";
import { prisma } from "../lib/db/klient";
import { uruchomSilnik } from "../lib/engine";
import { PROFILE_WARSTWY1 } from "../tests/fixtures/profile-warstwy1";
import type { WynikiModulow } from "../lib/engine/typy";

async function main() {
  const baza = await pobierzBazeReferencyjna();
  const nazwa = (process.argv[2] ?? "rzemieslnik_17") as keyof typeof PROFILE_WARSTWY1;
  const bazowy = PROFILE_WARSTWY1[nazwa];
  const w: WynikiModulow = {
    ...bazowy,
    a3Pozycje: { SAM: 90, OTO: 85, DEC: 80, KON: 20, NOW: 30 },
    a3Sila: { SAM: 80, OTO: 80, DEC: 70, KON: 75, NOW: 60 },
  };
  const r = uruchomSilnik(w, baza);

  console.log(`PROFIL: ${nazwa}   pewnosc: ${r.wskazniki.pewnosc}`);
  console.log(`\nTRZY DROGI`);
  for (const d of r.warstwa1.drogi) {
    console.log(`  ${d.etykieta}: ${d.nazwaObszaru} [${d.poziom.etykieta}: ${d.poziom.przyklad}, ${d.poziom.czas}]`);
    console.log(`     zawody: ${d.zawody.join(", ") || "brak powyżej progu"}`);
  }
  console.log(`\nPOZYCJE (${r.warstwa2.pozycje.length}), prog ${r.warstwa2.progPokazania}${r.warstwa2.wynikiWstepne ? " (wstepne)" : ""}`);
  for (const p of r.warstwa2.pozycje.slice(0, 12)) {
    const flagi = [
      p.zawody.some((z) => z.flagi.trampolina) ? "TRAMPOLINA" : "",
      p.zawody.some((z) => z.flagi.zagrozony) ? "ZAGROZONY" : "",
      p.zawody.some((z) => z.flagi.barieraKosztowa) ? "KOSZT" : "",
      p.zawody.some((z) => z.ostrzezenia.length > 0) ? "ANTY" : "",
      p.zawody.find((z) => z.zGwarancji)?.zGwarancji ?? "",
    ].filter(Boolean).join(" ");
    console.log(`  ${String(p.wynik).padStart(5)}  ${p.pasmo.padEnd(16)} ${p.typ === "klaster" ? "[K] " : "    "}${p.nazwa}  ${flagi}`);
  }
  console.log(`\n  gwarancje: bez studiow ${r.warstwa2.gwarancje.bezStudiow}, szybkie wejscie ${r.warstwa2.gwarancje.szybkieWejscie}, dosypane: ${r.warstwa2.gwarancje.dosypane.join(", ") || "brak"}`);
  console.log(`  usuniete: weto ${r.warstwa2.usunieteWetem.length}, A0 ${r.warstwa2.usunieteA0.length}, bez poziomu ${r.warstwa2.usunieteBezPoziomu.length}`);

  console.log(`\nCZY STUDIA SA POTRZEBNE: ${r.warstwa3.sensStudiow} (udzial ${r.warstwa3.udzialZawodowZeStudiami})`);
  console.log(`  ${r.warstwa3.komunikatOSensie.slice(0, 140)}...`);
  console.log(`  kolejnosc: ${r.warstwa3.drogiBezStudiowPierwsze ? "drogi bez studiow PRZED kierunkami" : "kierunki pierwsze"}`);
  console.log(`\nKIERUNKI (${r.warstwa3.kierunki.length}), usuniete ${r.warstwa3.usuniete.length}`);
  for (const k of r.warstwa3.kierunki.slice(0, 5)) {
    console.log(`  ${String(k.wynik).padStart(5)}  ${k.nazwa.padEnd(34)} ${k.ostrzezenia.length} ostrz.`);
  }
  console.log(`\nDROGI BEZ STUDIOW (${r.warstwa3.drogiBezStudiow.length})`);
  for (const d of r.warstwa3.drogiBezStudiow.slice(0, 5)) console.log(`  ${d.nazwa} (${d.czas}, ${d.koszt})`);

  console.log(`\nPYTANIA NA SESJE 1:1 (${r.pytaniaNaSesje.length})`);
  for (const p of r.pytaniaNaSesje.slice(0, 6)) console.log(`  - ${p.slice(0, 150)}`);

  await prisma.$disconnect();
}
void main();
