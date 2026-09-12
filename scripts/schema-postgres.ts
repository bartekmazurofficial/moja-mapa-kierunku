/**
 * Schemat dla PostgreSQL, generowany ze schematu SQLite.
 *
 * Jedno zrodlo prawdy zostaje `prisma/schema.prisma`: lokalnie pracujemy
 * na SQLite, bo testy musza byc szybkie i jednorazowe, a na Vercelu aplikacja
 * chodzi na Postgresie w Supabase. Zamiast utrzymywac dwa pliki i patrzec,
 * jak sie rozjezdzaja, generujemy drugi przy kazdym wdrozeniu.
 *
 * Roznica jest jedna: blok `datasource`. Wszystkie pola listowe i mapy sa
 * trzymane jako String z JSON-em w srodku, wiec na Postgresie staja sie `text`
 * i zadna warstwa domenowa nie wie o zmianie.
 *
 * `directUrl` jest potrzebny osobno: `prisma db push` nie dziala przez pooler
 * na porcie 6543, a aplikacja bez poolera wyczerpie limit polaczen przy
 * pierwszym ruchu.
 *
 * Uzycie: npx tsx scripts/schema-postgres.ts
 */

import fs from "node:fs";
import path from "node:path";

const ZRODLO = path.join(process.cwd(), "prisma", "schema.prisma");
const CEL = path.join(process.cwd(), "prisma", "schema.postgres.prisma");

const NOWY_DATASOURCE = `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}`;

function main() {
  const zrodlo = fs.readFileSync(ZRODLO, "utf8");
  const wzor = /datasource db \{[^}]*\}/;
  if (!wzor.test(zrodlo)) {
    throw new Error("nie znalazłem bloku datasource w prisma/schema.prisma");
  }
  const wynik = zrodlo.replace(
    wzor,
    `// WYGENEROWANE przez scripts/schema-postgres.ts. Nie edytuj tego pliku.\n${NOWY_DATASOURCE}`,
  );
  fs.writeFileSync(CEL, wynik, "utf8");
  const modeli = (wynik.match(/^model /gm) ?? []).length;
  console.log(`zapisano ${path.relative(process.cwd(), CEL)}: ${modeli} modeli, provider postgresql`);
}

main();
