/**
 * Przygotowanie fontow do eksportu PDF.
 *
 * Dwa problemy do rozwiazania naraz:
 *   1. @react-pdf przyjmuje wylacznie TTF, a pakiety fontow daja woff2,
 *   2. pakiety dziela znaki na podzbiory i zaden plik nie ma jednoczesnie
 *      alfabetu podstawowego i polskich znakow diakrytycznych.
 *
 * Rozpakowujemy wiec oba podzbiory i sklejamy je w jeden plik. Sklejanie
 * po stronie fontu, a nie listy rodzin w stylach, ma konkretny powod:
 * przy liscie rodzin renderer osadza osobny podzbior fontu przy kazdym
 * przelaczeniu, a raport z polskimi znakami przelacza sie co kilka slow.
 * Przy scalonym pliku PDF wazy okolo 50 kB, przy liscie rodzin ponad 800 kB.
 *
 * Nic nie jest pobierane w czasie dzialania aplikacji.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { decompress } from "wawoff2";
import opentype from "opentype.js";

const WYJSCIE = join(process.cwd(), "data/generated/fonty");
const MODULY = join(process.cwd(), "node_modules");

interface DoZlozenia {
  plik: string;
  rodzina: string;
  styl: string;
  podstawowy: string;
  rozszerzony: string;
}

const FONTY: DoZlozenia[] = [
  {
    plik: "serif-400.ttf",
    rodzina: "SourceSerif4",
    styl: "Regular",
    podstawowy: "@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff2",
    rozszerzony: "@fontsource/source-serif-4/files/source-serif-4-latin-ext-400-normal.woff2",
  },
  {
    plik: "serif-600.ttf",
    rodzina: "SourceSerif4",
    styl: "Semibold",
    podstawowy: "@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff2",
    rozszerzony: "@fontsource/source-serif-4/files/source-serif-4-latin-ext-600-normal.woff2",
  },
  {
    plik: "sans-400.ttf",
    rodzina: "Inter",
    styl: "Regular",
    podstawowy: "@fontsource/inter/files/inter-latin-400-normal.woff2",
    rozszerzony: "@fontsource/inter/files/inter-latin-ext-400-normal.woff2",
  },
  {
    plik: "sans-500.ttf",
    rodzina: "Inter",
    styl: "Medium",
    podstawowy: "@fontsource/inter/files/inter-latin-500-normal.woff2",
    rozszerzony: "@fontsource/inter/files/inter-latin-ext-500-normal.woff2",
  },
];

async function wczytaj(wzgledna: string): Promise<opentype.Font> {
  const ttf = await decompress(readFileSync(join(MODULY, wzgledna)));
  const kopia = new Uint8Array(ttf);
  return opentype.parse(kopia.buffer.slice(kopia.byteOffset, kopia.byteOffset + kopia.byteLength));
}

async function main() {
  mkdirSync(WYJSCIE, { recursive: true });

  for (const f of FONTY) {
    const podstawowy = await wczytaj(f.podstawowy);
    const rozszerzony = await wczytaj(f.rozszerzony);

    const glify: opentype.Glyph[] = [podstawowy.glyphs.get(0)];
    const kody = new Set<number>();
    for (const zrodlo of [podstawowy, rozszerzony]) {
      for (let i = 1; i < zrodlo.glyphs.length; i++) {
        const g = zrodlo.glyphs.get(i);
        if (g.unicode === undefined || kody.has(g.unicode)) continue;
        kody.add(g.unicode);
        glify.push(g);
      }
    }

    const scalony = new opentype.Font({
      familyName: f.rodzina,
      styleName: f.styl,
      unitsPerEm: podstawowy.unitsPerEm,
      ascender: podstawowy.ascender,
      descender: podstawowy.descender,
      glyphs: glify,
    });

    writeFileSync(join(WYJSCIE, f.plik), Buffer.from(scalony.toArrayBuffer()));
    const rozmiar = Buffer.from(scalony.toArrayBuffer()).length;
    console.log(`  ${f.plik.padEnd(14)} ${glify.length} glifów, ${(rozmiar / 1024).toFixed(0)} kB`);
  }

  console.log(`\nzapisano w ${WYJSCIE}`);
}

void main();
