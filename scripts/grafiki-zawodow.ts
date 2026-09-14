/**
 * Zdjecia zawodow: z paczki od zleceniodawcy do `public/grafika/zawody/`.
 *
 * Dotad kazdy zawod pokazywal ilustracje swojego obszaru, wiec „Kurator
 * sadowy" i „Notariusz" mialy na liscie ten sam obrazek. Paczki ze zdjeciami
 * przychodza partiami po kilkadziesiat sztuk i ten skrypt jest calym
 * wdrozeniem jednej partii.
 *
 * **Dopasowanie idzie po nazwie zawodu, nie po katalogu.** Katalogi w paczce
 * maja wlasny podzial na kategorie, ktory nie pokrywa sie z dwudziestoma
 * siedmioma obszarami platformy (u nadawcy „Finanse, ksiegowosc i prawo" jest
 * jednym workiem, u nas to sa dwa obszary). Nazwa pliku jest jedyna rzecza,
 * ktora znaczy to samo po obu stronach.
 *
 * Nazwy porownujemy bez ogonkow i bez znakow innych niz litery i cyfry, bo
 * paczka bywa zapisana raz z „Specjalista cyberbezpieczenstwa", raz bez „n"
 * z ogonkiem. Czego tak nie da sie dopasowac, trafia do `ALIASY` recznie
 * i skrypt wypisuje liste nietrafionych, zamiast je po cichu pomijac.
 *
 * Dwa rozmiary, bo dwa miejsca uzycia:
 *   - 480 px na kafel listy (karta ma 247 do 437 px szerokosci),
 *   - 1000 px na naglowek karty zawodu.
 * Oryginaly maja 1672 px i po 2 MB; lista pokazuje kilkadziesiat kafli naraz,
 * wiec oryginalow nie wolno tam podawac.
 *
 * Skrypt dopisuje tez `lib/ui/zdjecia-zawodow.ts` z lista kodow, ktore maja
 * plik. Aplikacja czyta ta liste, a nie dysk: build ma nie chodzic po plikach.
 *
 * Uzycie:
 *   npx tsx scripts/grafiki-zawodow.ts ~/Downloads/wszystkie_zawody_90
 *
 * Wymaga `sips` z macOS.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/db/klient";

const ROZMIARY = [
  { px: 480, jakosc: 70, przyrostek: "" },
  { px: 1000, jakosc: 70, przyrostek: "-duzy" },
];

/** Nazwy, ktorych nie da sie sprowadzic do siebie samym czyszczeniem znakow. */
const ALIASY: Record<string, string> = {
  // W paczce „R&D" zapisane jest jako „RnD", bo ampersand psuje nazwy plikow.
  specjalista_rnd: "spec_rd",
};

/** Bez ogonkow, bez znakow poza literami i cyframi, wszystko malymi literami. */
function klucz(tekst: string): string {
  return tekst
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function pngWKatalogu(korzen: string): string[] {
  const wynik: string[] = [];
  for (const wpis of fs.readdirSync(korzen, { withFileTypes: true })) {
    const pelna = path.join(korzen, wpis.name);
    if (wpis.isDirectory()) wynik.push(...pngWKatalogu(pelna));
    else if (/\.png$/i.test(wpis.name)) wynik.push(pelna);
  }
  return wynik.sort();
}

async function main() {
  const zrodla = process.argv[2];
  if (!zrodla) {
    console.log("podaj katalog z paczką, np. npx tsx scripts/grafiki-zawodow.ts ~/Downloads/wszystkie_zawody_90");
    return;
  }

  const zawody = await prisma.zawod.findMany({ select: { kod: true, nazwa: true } });
  const poNazwie = new Map(zawody.map((z) => [klucz(z.nazwa), z.kod]));
  const poKodzie = new Map(zawody.map((z) => [klucz(z.kod), z.kod]));
  const istnieje = new Set(zawody.map((z) => z.kod));

  const cel = path.join(process.cwd(), "public", "grafika", "zawody");
  fs.mkdirSync(cel, { recursive: true });

  const nietrafione: string[] = [];
  const podwojne = new Map<string, string>();
  let zrobione = 0;

  for (const plik of pngWKatalogu(zrodla)) {
    // Nazwa w paczce ma numer porzadkowy w katalogu: „07_Ksiegowy.png".
    const nazwa = path.basename(plik, path.extname(plik)).replace(/^\d+_/, "");
    const k = klucz(nazwa);
    const kod = poNazwie.get(k) ?? poKodzie.get(k) ?? (ALIASY[k] && istnieje.has(ALIASY[k]) ? ALIASY[k] : undefined);
    if (!kod) {
      nietrafione.push(`${path.basename(path.dirname(plik))}/${path.basename(plik)}`);
      continue;
    }
    const juz = podwojne.get(kod);
    if (juz) {
      console.log(`UWAGA: ${kod} dostaje drugi plik. Zostaje ${path.basename(plik)}, nadpisuje ${juz}.`);
    }
    podwojne.set(kod, path.basename(plik));

    for (const r of ROZMIARY) {
      execFileSync(
        "sips",
        [
          "-Z", String(r.px),
          "-s", "format", "jpeg",
          "-s", "formatOptions", String(r.jakosc),
          plik,
          "--out", path.join(cel, `${kod}${r.przyrostek}.jpg`),
        ],
        { stdio: "ignore" },
      );
    }
    zrobione += 1;
  }

  // Lista kodow powstaje z tego, co naprawde lezy na dysku po tym przebiegu,
  // wiec obejmuje takze partie wgrane wczesniej.
  const kody = [
    ...new Set(
      fs
        .readdirSync(cel)
        .filter((f) => f.endsWith(".jpg") && !f.endsWith("-duzy.jpg"))
        .map((f) => f.slice(0, -4)),
    ),
  ].sort();

  const osierocone = kody.filter((k) => !istnieje.has(k));
  fs.writeFileSync(
    path.join(process.cwd(), "lib", "ui", "zdjecia-zawodow.ts"),
    `/**
 * Zawody, dla których leży zdjęcie w \`public/grafika/zawody/\`.
 *
 * Plik jest generowany: \`npx tsx scripts/grafiki-zawodow.ts <katalog paczki>\`.
 * Ręczna edycja nie ma sensu, bo następna partia zdjęć go nadpisze. Kod bez
 * wpisu na tej liście pokazuje ilustrację swojego obszaru, tak jak dotąd,
 * więc zdjęcia mogą dochodzić partiami i nic się po drodze nie psuje.
 */

export const ZAWODY_ZE_ZDJECIEM: ReadonlySet<string> = new Set([
${kody.map((k) => `  "${k}",`).join("\n")}
]);
`,
  );

  const waga = fs.readdirSync(cel).reduce((s, f) => s + fs.statSync(path.join(cel, f)).size, 0);
  console.log(`przerobione w tym przebiegu: ${zrobione}`);
  console.log(`zdjęć na dysku razem: ${kody.length} z ${zawody.length} zawodów, ${(waga / 1024 / 1024).toFixed(1)} MB`);
  if (nietrafione.length > 0) {
    console.log(`\nNIETRAFIONE (${nietrafione.length}), dopisz do ALIASY albo popraw nazwę pliku:`);
    for (const n of nietrafione) console.log(`  ${n}`);
  }
  if (osierocone.length > 0) {
    console.log(`\nPLIKI BEZ ZAWODU W BAZIE (${osierocone.length}): ${osierocone.join(", ")}`);
  }
  await prisma.$disconnect();
}

void main();
