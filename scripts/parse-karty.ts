/**
 * Parser 157 kart zawodow.
 *
 * Zrodlo: program-doradztwa/05_karty_zawodow/*.md
 * Wyjscie: data/generated/karty.json
 *
 * Karty sa pogrupowane po kilkanascie w pliku, ale NIE maja jednolitej
 * struktury naglowkow. Wystepuja trzy uklady:
 *   - karta na poziomie 1, sekcje na poziomie 2 (wiekszosc plikow),
 *   - karta na poziomie 2, sekcje na poziomie 3 (prawo i panstwo, technologia 2),
 *   - karta na poziomie 1, sekcje na poziomie 3 (oba pliki biznesu).
 * Parser wykrywa poziom karty per plik i traktuje jako sekcje kazdy naglowek
 * glebszy od niego.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ZRODLO = join(process.cwd(), "program-doradztwa/05_karty_zawodow");
const KATALOG = join(process.cwd(), "data/generated");
const WYJSCIE = join(KATALOG, "karty.json");

/** Nazwy w kartach rozniace sie od nazw w bazie zawodow. */
const ALIASY: Record<string, string> = {
  "koordynator projektow w organizacji pozarzadowej": "koordynator_ngo",
};

const TRANSLITERACJA: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
  Ą: "a", Ć: "c", Ę: "e", Ł: "l", Ń: "n", Ó: "o", Ś: "s", Ź: "z", Ż: "z",
};

function normalizuj(tekst: string): string {
  return tekst
    .split("")
    .map((z) => TRANSLITERACJA[z] ?? z)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Kluczowe sekcje, rozpoznawane po poczatku tytulu. Reszta jest tekstem karty. */
const KLUCZOWE: Array<{ klucz: string; prefiksy: string[] }> = [
  { klucz: "streszczenie", prefiksy: ["w jednym zdaniu"] },
  { klucz: "czym_jest", prefiksy: ["czym ta praca jest", "czym ta praca naprawde"] },
  { klucz: "kto_sie_nie_odnajdzie", prefiksy: ["kto sie"] },
  { klucz: "koszt", prefiksy: ["ile kosztuje", "ile realnie kosztuje"] },
  { klucz: "droga", prefiksy: ["droga dojscia"] },
  { klucz: "pieniadze", prefiksy: ["pieniadze"] },
  { klucz: "przyszlosc", prefiksy: ["czy zagrozony", "czy ten zawod jest zagrozony"] },
  { klucz: "profil", prefiksy: ["profil"] },
];

function kluczSekcji(tytul: string): string | null {
  const n = normalizuj(tytul);
  for (const k of KLUCZOWE) {
    if (k.prefiksy.some((p) => n.startsWith(p))) return k.klucz;
  }
  return null;
}

export interface SekcjaKarty {
  tytul: string;
  klucz: string | null;
  tresc: string;
}

export interface Karta {
  kod: string;
  tytul: string;
  plik: string;
  sekcje: SekcjaKarty[];
}

interface Zawod {
  nazwa: string;
}

function main(): void {
  const zawody = JSON.parse(
    readFileSync(join(process.cwd(), "program-doradztwa/03_dane/zawody_baza.json"), "utf8"),
  ) as Record<string, Zawod>;

  const poNazwie = new Map<string, string>();
  for (const [kod, z] of Object.entries(zawody)) poNazwie.set(normalizuj(z.nazwa), kod);
  for (const [nazwa, kod] of Object.entries(ALIASY)) poNazwie.set(normalizuj(nazwa), kod);

  const karty: Karta[] = [];
  const niedopasowane: Array<{ plik: string; tytul: string }> = [];
  const pliki = readdirSync(ZRODLO).filter((p) => p.startsWith("karty_") && p.endsWith(".md")).sort();

  for (const plik of pliki) {
    const tekst = readFileSync(join(ZRODLO, plik), "utf8");
    const linie = tekst.split("\n");

    // Poziom karty w tym pliku: ten, na ktorym stoja nazwy zawodow.
    let poziomKarty = 0;
    for (const poziom of [1, 2]) {
      const trafienia = linie.filter((l) => {
        const m = l.match(new RegExp(`^#{${poziom}} (.+)$`));
        return m ? poNazwie.has(normalizuj(m[1])) : false;
      }).length;
      if (trafienia > 0) {
        poziomKarty = poziom;
        break;
      }
    }
    if (poziomKarty === 0) continue;

    // Sekcja to KAZDY naglowek glebszy niz poziom karty. W trzech plikach
    // karty stoja na poziomie pierwszym, a sekcje na trzecim, z pominieciem
    // drugiego - dlatego nie wystarczy poziomKarty + 1.
    const naglowekKarty = new RegExp(`^#{${poziomKarty}} (.+)$`);
    const naglowekSekcji = new RegExp(`^#{${poziomKarty + 1},6} (.+)$`);

    let biezaca: Karta | null = null;
    let sekcja: SekcjaKarty | null = null;

    const zamknijSekcje = () => {
      if (biezaca && sekcja) {
        sekcja.tresc = sekcja.tresc.trim();
        if (sekcja.tresc.length > 0 || sekcja.tytul) biezaca.sekcje.push(sekcja);
      }
      sekcja = null;
    };
    const zamknijKarte = () => {
      zamknijSekcje();
      if (biezaca && biezaca.sekcje.length > 0) karty.push(biezaca);
      biezaca = null;
    };

    for (const linia of linie) {
      const mKarta = linia.match(naglowekKarty);
      if (mKarta) {
        zamknijKarte();
        const kod = poNazwie.get(normalizuj(mKarta[1]));
        if (kod) {
          biezaca = { kod, tytul: mKarta[1].trim(), plik, sekcje: [] };
        } else if (!/^(karty zawodow|obszar |podsumowanie|co laczy|czego)/.test(normalizuj(mKarta[1]))) {
          niedopasowane.push({ plik, tytul: mKarta[1].trim() });
        }
        continue;
      }
      if (!biezaca) continue;

      const mSekcja = linia.match(naglowekSekcji);
      if (mSekcja) {
        zamknijSekcje();
        sekcja = { tytul: mSekcja[1].trim(), klucz: kluczSekcji(mSekcja[1]), tresc: "" };
        continue;
      }
      if (sekcja) sekcja.tresc += linia + "\n";
    }
    zamknijKarte();
  }

  const dopasowane = new Set(karty.map((k) => k.kod));
  const bezKarty = Object.keys(zawody).filter((kod) => !dopasowane.has(kod));
  const duplikaty = karty
    .map((k) => k.kod)
    .filter((kod, i, lista) => lista.indexOf(kod) !== i);

  mkdirSync(KATALOG, { recursive: true });
  writeFileSync(WYJSCIE, JSON.stringify(karty, null, 1) + "\n", "utf8");

  console.log(`plikow:           ${pliki.length}`);
  console.log(`kart:             ${karty.length}`);
  console.log(`zawodow z karta:  ${dopasowane.size} / ${Object.keys(zawody).length}`);
  console.log(`sekcji razem:     ${karty.reduce((s, k) => s + k.sekcje.length, 0)}`);

  const pokrycie = (klucz: string) => karty.filter((k) => k.sekcje.some((s) => s.klucz === klucz)).length;
  console.log("\npokrycie kluczowych sekcji:");
  for (const k of KLUCZOWE) console.log(`  ${k.klucz.padEnd(24)} ${pokrycie(k.klucz)} / ${karty.length}`);

  if (duplikaty.length > 0) console.log(`\nZDUBLOWANE KARTY: ${duplikaty.join(", ")}`);
  if (niedopasowane.length > 0) {
    console.log(`\nNAGLOWKI BEZ ZAWODU (${niedopasowane.length}):`);
    for (const n of niedopasowane) console.log(`  ${n.plik}: ${n.tytul}`);
  }
  if (bezKarty.length > 0) {
    console.log(`\nZAWODY BEZ KARTY (${bezKarty.length}):`);
    for (const kod of bezKarty) console.log(`  ${kod}  (${zawody[kod].nazwa})`);
  } else {
    console.log("\nkazdy ze 157 zawodow ma karte");
  }
  console.log(`\nzapisano ${WYJSCIE}`);
}

main();
