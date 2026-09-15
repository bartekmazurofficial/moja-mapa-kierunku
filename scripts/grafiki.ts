/**
 * Przygotowanie ilustracji kategorii do publikacji.
 *
 * Oryginaly maja 1254 px i po okolo 2 MB. Aplikacja nie moze ich pobierac:
 * jeden ekran A1 to cztery kafle, wiec samo przeklikanie modulu zassaloby
 * kilkadziesiat megabajtow na telefonie w szkole. Do repozytorium trafiaja
 * dwie wersje: 256 px na kafel i 768 px na naglowek.
 *
 * Nazwy plikow zrodlowych: `<modul>-<klucz>.png`, gdzie klucz jest taki sam
 * jak w aplikacji: numer w A1 i A2, kod osi w A3 (`a3-INI`), kod wartosci
 * w A4. Podwojne rozszerzenie (`a1-1.png.png`) tez przyjmujemy, bo tak
 * potrafi zapisac przegladarka.
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

import { SZEROKOSCI_DOMYSLNE, SZEROKOSCI_MODULU } from "../lib/ui/obrazy";

type Rozmiar = { px: number; jakosc: number; przyrostek: string };

/**
 * Kafel przy tekscie i naglowek. Dla A1 do A4 obrazek stoi obok zdania
 * i 256 px wystarcza z zapasem.
 */
const ROZMIARY: Rozmiar[] = [
  { px: SZEROKOSCI_DOMYSLNE[0], jakosc: 70, przyrostek: "" },
  { px: SZEROKOSCI_DOMYSLNE[1], jakosc: 72, przyrostek: "-duzy" },
];

/** Plansze pytan sa poziome i idą w jednej wersji, szerokiej. */
const ROZMIARY_PLANSZ: Rozmiar[] = [{ px: 1200, jakosc: 74, przyrostek: "" }];

/**
 * A0 liczy sie inaczej: zdjecie JEST odpowiedzia, a nie miniaturka przy niej.
 *
 * Kafel ma na ekranie od 170 do 270 px, wiec na ekranie o podwojonej gestosci
 * potrzebuje do 540 px; 256 px dawalo tam widoczne rozmycie. Wersja szeroka
 * idzie pod kadr nad odpowiedziami, ktory ma okolo 700 px, wiec 768 px bylo
 * dokladnie na styk i tez bylo widac.
 *
 * Jakosc 80 zamiast 72: to sa zdjecia ludzi, a nie ikony, i artefakty widac
 * na twarzach.
 */
const ROZMIARY_A0: Rozmiar[] = [
  { px: SZEROKOSCI_MODULU.a0[0], jakosc: 80, przyrostek: "" },
  { px: SZEROKOSCI_MODULU.a0[1], jakosc: 80, przyrostek: "-duzy" },
];

/**
 * Kadr nad pytaniem A0 idzie na cala szerokosc kolumny, do 832 px, wiec na
 * ekranie o podwojonej gestosci potrzebuje 1664 px; 1280 px bylo tam widocznie
 * miekkie. Zrodla maja 1672 px, wiec nic sie nie rozciaga.
 *
 * Dotyczy szesciu plikow `pytanie-*` — reszta zostaje przy 1280 px, bo w
 * `srcSet` kafla i tak nigdy nie zejdzie nizej niz dwa piksele na piksel.
 */
const ROZMIARY_A0_KADR: Rozmiar[] = [
  { px: SZEROKOSCI_MODULU.a0[0], jakosc: 80, przyrostek: "" },
  { px: 1664, jakosc: 74, przyrostek: "-duzy" },
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
    // Plansze nazywają się pełnym kluczem (`a3-INI.png`), kafle kodem po
    // przedrostku modułu (`a1-7.png`, `a3-INI.png`). Kod bywa dwuczłonowy,
    // bo bieguny osi mają przyrostek: `a3-INI-A.png` daje klucz `INI-A`.
    const m =
      modul === "plansze"
        ? plik.match(/^([A-Za-z0-9_]+-[A-Za-z0-9_-]+)\.png/i)
        : plik.match(new RegExp(`^${modul}-([A-Za-z0-9_-]+)\\.png`, "i"));
    if (!m) {
      console.log(`pomijam ${plik}: nazwa nie pasuje do wzorca modułu ${modul}`);
      continue;
    }
    const klucz = m[1];
    const rozmiary =
      modul === "plansze"
        ? ROZMIARY_PLANSZ
        : modul !== "a0"
          ? ROZMIARY
          : klucz.startsWith("pytanie-")
            ? ROZMIARY_A0_KADR
            : ROZMIARY_A0;
    for (const r of rozmiary) {
      execFileSync("sips", [
        "-Z", String(r.px),
        "-s", "format", "jpeg",
        "-s", "formatOptions", String(r.jakosc),
        path.join(zrodla, plik),
        "--out", path.join(cel, `${klucz}${r.przyrostek}.jpg`),
      ], { stdio: "ignore" });
    }
    zrobione += 1;
  }

  const waga = fs
    .readdirSync(cel)
    .reduce((s, f) => s + fs.statSync(path.join(cel, f)).size, 0);
  console.log(`${zrobione} ilustracji modułu ${modul}, razem ${(waga / 1024 / 1024).toFixed(1)} MB`);
  console.log(`kafle: ${cel}/<klucz>.jpg, nagłówki: ${cel}/<klucz>-duzy.jpg`);
}

main();
