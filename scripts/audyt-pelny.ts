/**
 * Audyt osiągalności na pełnym silniku, nie na uproszczonym dopasowaniu.
 *
 * Audyt z fazy pierwszej liczy tylko zainteresowania i kompetencje. Po
 * dołożeniu jedenastu pozycji A5 i trzynastej osi A3 trzeba sprawdzić to,
 * czego tamten nie widzi: nowe wykluczenia usuwają zawody bezwarunkowo,
 * a nowa oś zmienia składową A3 mnożnika kartowego.
 *
 * Uzycie: npx tsx scripts/audyt-pelny.ts [ile profili] [--bez-nowych]
 */

import { prisma } from "../lib/db/klient";
import { pobierzBazeReferencyjna } from "../lib/db/repozytorium";
import { uruchomSilnik } from "../lib/engine";
import { ustawTekstyFiltrow } from "../lib/engine/layer1-areas";
import { FILTRY_A5, KOMPETENCJE_A2, OBSZARY_A1, WARTOSCI_A4, WYMIARY_A3, WYMIARY_M1 } from "../lib/domain/slowniki";
import type { WynikiModulow } from "../lib/engine/typy";

/** Deterministyczny generator: ten sam wynik przy kazdym uruchomieniu. */
function losowy(ziarno: number): () => number {
  let a = ziarno >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Nowe pozycje A5, dolozone po fazie 5. Do porownania „przed i po". */
const NOWE_FILTRY = ["F33", "F34", "F35", "F36", "F37", "F38", "F39", "F40", "F41", "F42", "F43"];

function profil(rnd: () => number, bezNowych: boolean): WynikiModulow {
  const wybierz = <T,>(pula: T[], ile: number): T[] => {
    const kopia = [...pula];
    const wynik: T[] = [];
    for (let i = 0; i < ile && kopia.length > 0; i++) {
      wynik.push(kopia.splice(Math.floor(rnd() * kopia.length), 1)[0]);
    }
    return wynik;
  };

  const z: Record<number, number> = {};
  for (const o of OBSZARY_A1) z[o.id] = Math.round(rnd() * 100);
  const k: Record<number, number> = {};
  const dowody: Record<number, number> = {};
  for (const c of KOMPETENCJE_A2) {
    k[c.id] = Math.round(rnd() * 100);
    dowody[c.id] = Math.floor(rnd() * 4);
  }

  const a3Pozycje: Record<string, number> = {};
  const a3Sila: Record<string, number> = {};
  for (const w of WYMIARY_A3) {
    a3Pozycje[w.kod] = Math.round(rnd() * 100);
    a3Sila[w.kod] = Math.round(rnd() * 100);
  }

  const wartosci = wybierz(WARTOSCI_A4.map((w) => w.kod), WARTOSCI_A4.length);
  const a4Top5 = wartosci.slice(0, 5);
  const a4Bottom3 = wartosci.slice(-3);
  const a4Progowe = a4Top5.slice(0, Math.floor(rnd() * 3));

  const g: Record<string, number> = {};
  for (const f of FILTRY_A5) {
    // Pozycje dolozone po fazie 5 mozna wylaczyc, zeby porownac stan sprzed.
    if (bezNowych && NOWE_FILTRY.includes(f.kod)) {
      g[f.kod] = 1;
      continue;
    }
    const r = rnd();
    g[f.kod] = r < 0.2 ? 0 : r < 0.5 ? 0.5 : 1;
  }
  const kandydaciNaWeta = FILTRY_A5.filter(
    (f) => g[f.kod] === 0 && !(bezNowych && NOWE_FILTRY.includes(f.kod)),
  ).map((f) => f.kod);
  const weta = wybierz(kandydaciNaWeta, Math.floor(rnd() * 4));

  const shape: Record<string, number | null> = {};
  for (const w of WYMIARY_M1) shape[w.kod] = Math.round(rnd() * 100);

  return {
    punktStartu: null,
    z,
    ekspozycja: {},
    k,
    dowody,
    a3Pozycje,
    a3Sila,
    a4Top5,
    a4Bottom3,
    a4Progowe,
    g,
    weta,
    shape,
    m1CzescB: {},
  } as unknown as WynikiModulow;
}

async function main() {
  const ile = Number(process.argv[2] ?? 400);
  const bezNowych = process.argv.includes("--bez-nowych");

  const baza = await pobierzBazeReferencyjna();
  ustawTekstyFiltrow(FILTRY_A5);

  const rnd = losowy(20260911);
  const osiagalne = new Set<string>();
  const licznik = new Map<string, number>();
  const trojki = new Set<string>();
  let bezPozycji = 0;
  let nieostre = 0;
  let usunieteWetem = 0;

  for (let i = 0; i < ile; i++) {
    const w = profil(rnd, bezNowych);
    const s = uruchomSilnik(w, baza);
    const pokazane = s.warstwa2.pozycje.flatMap((p) => p.zawody.map((z) => z.kod));
    if (pokazane.length === 0) bezPozycji++;
    if (s.warstwa1.profilNieostry) nieostre++;
    usunieteWetem += s.warstwa2.usunieteWetem.length;
    for (const kod of pokazane) osiagalne.add(kod);
    // Czestotliwosc liczymy na pierwszej dziesiatce, tak jak T13 w audycie
    // z fazy pierwszej. Cala pokazana lista bywa dluga i nie jest porownywalna.
    for (const kod of pokazane.slice(0, 10)) licznik.set(kod, (licznik.get(kod) ?? 0) + 1);
    trojki.add(pokazane.slice(0, 3).join("|"));
  }

  const sieroty = baza.zawody.filter((z) => !osiagalne.has(z.kod)).map((z) => z.nazwaWyswietlana);
  const najczestszy = [...licznik.entries()].sort((a, b) => b[1] - a[1])[0];

  console.log(`profili: ${ile}${bezNowych ? "   (bez jedenastu nowych pozycji A5)" : ""}`);
  console.log(`osiągalnych zawodów   ${osiagalne.size} / ${baza.zawody.length}`);
  console.log(`różnorodność TOP3     ${(trojki.size / ile).toFixed(3)}`);
  console.log(`najczęstszy w TOP10   ${najczestszy[0]} w ${((najczestszy[1] / ile) * 100).toFixed(1)}% profili`);
  console.log(`średnio usuniętych wetem ${(usunieteWetem / ile).toFixed(1)} zawodów na profil`);
  console.log(`profili bez ani jednej pozycji: ${bezPozycji}`);
  console.log(`profili nieostrych: ${nieostre}`);
  if (sieroty.length > 0) console.log(`\nNIEOSIĄGALNE (${sieroty.length}): ${sieroty.join(", ")}`);

  await prisma.$disconnect();
}

void main();
