/**
 * Spis ilustracji A0 z katalogu do pliku, ktory czyta aplikacja.
 *
 * Uruchamiane po `scripts/grafiki.ts ... a0`. Osobny krok, bo `grafiki.ts`
 * obsluguje wszystkie moduly, a tylko A0 trzyma liste kluczy w kodzie.
 */

import fs from "node:fs";
import path from "node:path";

const KATALOG = path.join(process.cwd(), "public", "grafika", "a0");
const kody = [
  ...new Set(
    fs
      .readdirSync(KATALOG)
      .filter((f) => f.endsWith(".jpg") && !f.endsWith("-duzy.jpg"))
      .map((f) => f.slice(0, -4)),
  ),
].sort();

const plik = path.join(process.cwd(), "lib", "ui", "obrazy-a0.ts");
const stary = fs.readFileSync(plik, "utf8");
const naglowek = stary.slice(0, stary.indexOf("export const OBRAZY_A0"));
fs.writeFileSync(
  plik,
  `${naglowek}export const OBRAZY_A0: ReadonlySet<string> = new Set([\n${kody
    .map((k) => `  "a0-${k}",`)
    .join("\n")}\n]);\n`,
);
console.log(`${kody.length} ilustracji A0 wpisanych do lib/ui/obrazy-a0.ts`);
