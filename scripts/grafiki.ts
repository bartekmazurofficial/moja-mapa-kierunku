/**
 * Przygotowanie ilustracji kategorii do publikacji.
 *
 * Oryginaly maja 1254 px i po okolo 2 MB. Aplikacja nie moze ich pobierac:
 * jeden ekran A1 to cztery kafle, wiec samo przeklikanie modulu zassaloby
 * kilkadziesiat megabajtow na telefonie w szkole. Do repozytorium trafiaja
 * dwie wersje: 256 px na kafel i 768 px na naglowek.
 *
 * Nazwy plikow zrodlowych: `<modul>-<numer>.png`. Podwojne rozszerzenie
 * (`a1-1.png.png`) tez przyjmujemy, bo tak potrafi zapisac przegladarka.
 *
 * Uzycie:
 *   npx tsx scripts/grafiki.ts <katalog ze zrodlami> [modul]
 *
 * Wymaga `sips`, ktore jest czescia macOS. Na innym systemie trzeba podmienic
 * jedno wywolanie na `convert` albo `sharp`.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROZMIARY: Array<{ px: number; jakosc: number; przyrostek: string }> = [
  { px: 256, jakosc: 70, przyrostek: "" },
  { px: 768, jakosc: 72, przyrostek: "-duzy" },
];

function main() {
  const [zrodla, modul = "a1"] = process.argv.slice(2);
  if (!zrodla) {
    console.log("podaj katalog ze źródłami, np. npx tsx scripts/grafiki.ts ~/Downloads/grafiki_a1 a1");
    return;
  }

  const cel = path.join(process.cwd(), "public", "grafika", modul);
  fs.mkdirSync(cel, { recursive: true });

  const pliki = fs.readdirSync(zrodla).filter((f) => f.toLowerCase().endsWith(".png"));
  let zrobione = 0;

  for (const plik of pliki) {
    const m = plik.match(new RegExp(`^${modul}-(\\d+)\\.png`, "i"));
    if (!m) {
      console.log(`pomijam ${plik}: nazwa nie pasuje do ${modul}-<numer>.png`);
      continue;
    }
    const numer = Number(m[1]);
    for (const r of ROZMIARY) {
      execFileSync("sips", [
        "-Z", String(r.px),
        "-s", "format", "jpeg",
        "-s", "formatOptions", String(r.jakosc),
        path.join(zrodla, plik),
        "--out", path.join(cel, `${numer}${r.przyrostek}.jpg`),
      ], { stdio: "ignore" });
    }
    zrobione += 1;
  }

  const waga = fs
    .readdirSync(cel)
    .reduce((s, f) => s + fs.statSync(path.join(cel, f)).size, 0);
  console.log(`${zrobione} ilustracji modułu ${modul}, razem ${(waga / 1024 / 1024).toFixed(1)} MB`);
  console.log(`kafle: ${cel}/<numer>.jpg, nagłówki: ${cel}/<numer>-duzy.jpg`);
}

main();
