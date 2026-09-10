import { pobierzBazeReferencyjna } from "../lib/db/repozytorium";
import { warstwa1, ustawTekstyFiltrow } from "../lib/engine/layer1-areas";
import { wskaznikiJakosci } from "../lib/engine/profil";
import { FILTRY_A5 } from "../lib/domain/slowniki";
import { prisma } from "../lib/db/klient";
import { PROFILE_WARSTWY1 } from "../tests/fixtures/profile-warstwy1";

async function main() {
  const { obszary } = await pobierzBazeReferencyjna();
  ustawTekstyFiltrow(FILTRY_A5);
  for (const [nazwa, w] of Object.entries(PROFILE_WARSTWY1)) {
    const r = warstwa1(w, obszary, wskaznikiJakosci(w));
    console.log("=".repeat(72));
    console.log(nazwa.toUpperCase());
    console.log("=".repeat(72));
    for (const o of r.obszary.slice(0, 9)) {
      console.log(
        `  ${o.wynik.toFixed(1).padStart(6)}  ${o.nazwa.padEnd(38)} [${o.poziomWejscia.poziom}: ${o.poziomWejscia.przyklad}]`,
      );
    }
    console.log(`  usuniete (${r.usuniete.length}): ${r.usuniete.map((u) => `${u.nazwa} [${u.powod}${u.filtr ? ":" + u.filtr : ""}]`).join(", ")}`);
    console.log(`  drogi: ${r.drogi.map((d) => `${d.etykieta}=${d.nazwaObszaru}`).join("  ")}`);
    console.log(`  podobienstwa: ${JSON.stringify(r.podobienstwa)}   flagi: ${r.flagi.join(", ") || "brak"}`);
    console.log(`  antydopasowania: ${r.antydopasowania.map((a) => `${a.nazwa} (${a.powod})`).join("; ") || "brak"}`);
    console.log();
  }
  await prisma.$disconnect();
}
void main();
