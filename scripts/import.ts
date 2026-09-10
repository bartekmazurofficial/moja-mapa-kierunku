/**
 * Import czterech baz referencyjnych do bazy danych.
 *
 * Zrodla:
 *   data/generated/obszary.json                  -> 27 obszarow  (parse-obszary.ts)
 *   program-doradztwa/03_dane/zawody_baza.json   -> 157 zawodow
 *   program-doradztwa/03_dane/kierunki_baza.json -> 75 kierunkow + 56 drog bez studiow
 *   program-doradztwa/03_dane/klastry.json       -> 26 klastrow
 *
 * Import najpierw waliduje calosc i dopiero potem cokolwiek zapisuje.
 * Baza w polowie zaimportowana jest gorsza niz brak bazy, bo silnik na niej
 * policzy wynik i nikt nie zauwazy, ze brakuje dwudziestu zawodow.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../lib/db/klient";
import { zapiszJson } from "../lib/db/json";
import type { ObszarSparsowany } from "./parse-obszary";
import {
  KODY_A1,
  KODY_A2,
  KODY_A3,
  KODY_A4,
  KODY_A5,
  KODY_M1,
  KODY_ANTY,
  KODY_PRZEDMIOTY,
  KODY_PRZECIWWSKAZANIA,
  KODY_DOSWIADCZENIE,
  KODY_KOSZTY,
  KODY_ZAGROZENIA,
  KODY_POZIOMY,
} from "../lib/domain/kody-kart";

const KATALOG_DANYCH = join(process.cwd(), "program-doradztwa/03_dane");

interface ZawodZrodlowy {
  nazwa: string;
  obszar: number;
  poziom: string;
  studia: string;
  a1: string[];
  a2r: string[];
  a2w: string[];
  a3: string[];
  a4p: string[];
  a4m: string[];
  a5: string[];
  m1: string[];
  anty: string[];
  koszt: string;
  flaga: string;
  zagr: string;
  kier: string | null;
  klaster: string | null;
  duze_miasto: boolean;
  teren: boolean;
  przeciw: string[];
  przedm: string[];
  dosw: string[];
}

interface KierunekZrodlowy {
  nazwa: string;
  typ: string;
  poziom: string;
  lata: number;
  wymagane: string[];
  punktowane: string[];
  trudnosc: string;
  bezposrednie: string[];
  posrednie: string[];
  odsetek: number | null;
  gdzie: string;
  robi: string;
  nie_daje: string | null;
  alternatywa_bez_studiow: boolean;
}

interface DrogaZrodlowa {
  nazwa: string;
  typ: string;
  czas: string;
  koszt: string;
  zawody: string[];
  wymagania: string;
}

interface KlasterZrodlowy {
  nazwa: string;
  sklad: string[];
  pytanie: string;
  roznica: string;
  uwaga?: string;
}

const bledy: string[] = [];
const ostrzezenia: string[] = [];

function wczytaj<T>(sciezka: string): T {
  return JSON.parse(readFileSync(sciezka, "utf8")) as T;
}

function sprawdzKody(
  gdzie: string,
  kody: string[],
  slownik: readonly string[],
  pole: string,
): void {
  for (const k of kody) {
    if (!slownik.includes(k)) bledy.push(`${gdzie}: kod "${k}" spoza slownika ${pole}`);
  }
}

async function main(): Promise<void> {
  const obszary = wczytaj<ObszarSparsowany[]>(join(process.cwd(), "data/generated/obszary.json"));
  const zawody = wczytaj<Record<string, ZawodZrodlowy>>(join(KATALOG_DANYCH, "zawody_baza.json"));
  const kierunkiPlik = wczytaj<{
    kierunki: Record<string, KierunekZrodlowy>;
    drogi_bez_studiow: Record<string, DrogaZrodlowa>;
  }>(join(KATALOG_DANYCH, "kierunki_baza.json"));
  const klastry = wczytaj<Record<string, KlasterZrodlowy>>(join(KATALOG_DANYCH, "klastry.json"));

  const kierunki = kierunkiPlik.kierunki;
  const drogi = kierunkiPlik.drogi_bez_studiow;

  // --- WALIDACJA: liczby ---
  const oczekiwane: Array<[string, number, number]> = [
    ["obszary", obszary.length, 27],
    ["zawody", Object.keys(zawody).length, 157],
    ["kierunki", Object.keys(kierunki).length, 75],
    ["drogi bez studiow", Object.keys(drogi).length, 56],
    ["klastry", Object.keys(klastry).length, 26],
  ];
  for (const [nazwa, jest, ma] of oczekiwane) {
    if (jest !== ma) bledy.push(`${nazwa}: jest ${jest}, oczekiwano ${ma}`);
  }

  // --- WALIDACJA: zawody ---
  const idObszarow = new Set(obszary.map((o) => o.id));
  for (const [kod, z] of Object.entries(zawody)) {
    if (!idObszarow.has(z.obszar)) bledy.push(`zawod ${kod}: nieznany obszar ${z.obszar}`);
    if (!KODY_POZIOMY.includes(z.poziom as never)) bledy.push(`zawod ${kod}: poziom "${z.poziom}"`);
    if (!["tak", "nie", "czesciowo"].includes(z.studia)) bledy.push(`zawod ${kod}: studia "${z.studia}"`);
    if (!KODY_KOSZTY.includes(z.koszt as never)) bledy.push(`zawod ${kod}: koszt "${z.koszt}"`);
    if (!KODY_ZAGROZENIA.includes(z.zagr as never)) bledy.push(`zawod ${kod}: zagrozenie "${z.zagr}"`);
    if (!["docelowy", "trampolina"].includes(z.flaga)) bledy.push(`zawod ${kod}: flaga "${z.flaga}"`);
    sprawdzKody(`zawod ${kod}`, z.a1, KODY_A1, "A1");
    sprawdzKody(`zawod ${kod}`, [...z.a2r, ...z.a2w], KODY_A2, "A2");
    sprawdzKody(`zawod ${kod}`, z.a3, KODY_A3, "A3");
    sprawdzKody(`zawod ${kod}`, [...z.a4p, ...z.a4m], KODY_A4, "A4");
    sprawdzKody(`zawod ${kod}`, z.a5, KODY_A5, "A5");
    sprawdzKody(`zawod ${kod}`, z.m1, KODY_M1, "M1");
    sprawdzKody(`zawod ${kod}`, z.anty, KODY_ANTY, "ANTY");
    sprawdzKody(`zawod ${kod}`, z.przedm, KODY_PRZEDMIOTY, "PRZEDM");
    sprawdzKody(`zawod ${kod}`, z.przeciw, KODY_PRZECIWWSKAZANIA, "PRZECIW");
    sprawdzKody(`zawod ${kod}`, z.dosw, KODY_DOSWIADCZENIE, "DOSW");
    if (z.a1.length === 0 || z.a2r.length === 0 || z.a5.length === 0) {
      bledy.push(`zawod ${kod}: pusty profil obowiazkowy (a1/a2r/a5)`);
    }
  }

  // --- WALIDACJA: klastry ---
  for (const [kod, k] of Object.entries(klastry)) {
    for (const z of k.sklad) {
      if (!(z in zawody)) bledy.push(`klaster ${kod}: nieznany zawod "${z}"`);
      else if (zawody[z].klaster !== kod) {
        bledy.push(`klaster ${kod}: zawod ${z} wskazuje klaster "${zawody[z].klaster}"`);
      }
    }
    if (!k.pytanie?.trim()) bledy.push(`klaster ${kod}: brak pytania rozstrzygajacego`);
  }
  for (const [kod, z] of Object.entries(zawody)) {
    if (z.klaster && !(z.klaster in klastry)) bledy.push(`zawod ${kod}: nieznany klaster "${z.klaster}"`);
  }

  // --- WALIDACJA: drogi edukacyjne ---
  const pokryte = new Set<string>();
  for (const [kod, k] of Object.entries(kierunki)) {
    for (const z of [...k.bezposrednie, ...k.posrednie]) {
      if (!(z in zawody)) bledy.push(`kierunek ${kod}: nieznany zawod "${z}"`);
      else pokryte.add(z);
    }
    sprawdzKody(`kierunek ${kod}`, [...k.wymagane, ...k.punktowane], KODY_PRZEDMIOTY, "PRZEDM");
  }
  const pokryteKrotkie = new Set<string>();
  for (const [kod, d] of Object.entries(drogi)) {
    for (const z of d.zawody) {
      if (!(z in zawody)) bledy.push(`droga ${kod}: nieznany zawod "${z}"`);
      else {
        pokryte.add(z);
        pokryteKrotkie.add(z);
      }
    }
  }
  for (const kod of Object.keys(zawody)) {
    if (!pokryte.has(kod)) bledy.push(`zawod ${kod}: brak jakiejkolwiek drogi edukacyjnej`);
  }
  for (const [kod, z] of Object.entries(zawody)) {
    if (z.studia === "nie" && !pokryteKrotkie.has(kod)) {
      ostrzezenia.push(`zawod ${kod}: nie wymaga studiow, ale nie ma drogi krotkiej`);
    }
  }

  if (bledy.length > 0) {
    console.error("IMPORT PRZERWANY, BLEDY W DANYCH:\n");
    for (const b of bledy.slice(0, 40)) console.error("  - " + b);
    if (bledy.length > 40) console.error(`  ... i ${bledy.length - 40} wiecej`);
    process.exit(1);
  }

  // --- ZAPIS ---
  await prisma.$transaction([
    prisma.zawod.deleteMany(),
    prisma.klaster.deleteMany(),
    prisma.kierunek.deleteMany(),
    prisma.drogaBezStudiow.deleteMany(),
    prisma.obszar.deleteMany(),
  ]);

  await prisma.obszar.createMany({
    data: obszary.map((o) => ({
      id: o.id,
      nazwa: o.nazwa,
      grupa: o.grupa,
      szczegolny: o.szczegolny,
      wariantWlasny: o.wariantWlasny,
      zainteresowania: zapiszJson(o.zainteresowania),
      kompetencje: zapiszJson(o.kompetencje),
      wartosciPlus: zapiszJson(o.wartosciPlus),
      wartosciMinus: zapiszJson(o.wartosciMinus),
      filtry: zapiszJson(o.filtry),
      zycie: zapiszJson(o.zycie),
      srodowisko: zapiszJson(o.srodowisko),
      trudne: zapiszJson(o.trudne),
      poziomy: zapiszJson(o.poziomy),
      sasiedztwo: zapiszJson(o.sasiedztwo),
      przykladoweZawody: o.przykladoweZawody,
      kierunkiStudiow: o.kierunkiStudiow,
      drogaBezStudiow: o.drogaBezStudiow,
    })),
  });

  await prisma.klaster.createMany({
    data: Object.entries(klastry).map(([kod, k]) => ({
      kod,
      nazwa: k.nazwa,
      sklad: zapiszJson(k.sklad),
      pytanie: k.pytanie,
      roznica: k.roznica,
      uwaga: k.uwaga ?? null,
    })),
  });

  await prisma.zawod.createMany({
    data: Object.entries(zawody).map(([kod, z]) => ({
      kod,
      nazwa: z.nazwa,
      obszarId: z.obszar,
      poziom: z.poziom,
      studia: z.studia,
      a1: zapiszJson(z.a1),
      a2r: zapiszJson(z.a2r),
      a2w: zapiszJson(z.a2w),
      a3: zapiszJson(z.a3),
      a4p: zapiszJson(z.a4p),
      a4m: zapiszJson(z.a4m),
      a5: zapiszJson(z.a5),
      m1: zapiszJson(z.m1),
      anty: zapiszJson(z.anty),
      koszt: z.koszt,
      flaga: z.flaga,
      zagr: z.zagr,
      kier: z.kier && z.kier.trim() ? z.kier : null,
      klasterKod: z.klaster,
      duzeMiasto: Boolean(z.duze_miasto),
      teren: Boolean(z.teren),
      przeciw: zapiszJson(z.przeciw),
      przedm: zapiszJson(z.przedm),
      dosw: zapiszJson(z.dosw),
    })),
  });

  await prisma.kierunek.createMany({
    data: Object.entries(kierunki).map(([kod, k]) => ({
      kod,
      nazwa: k.nazwa,
      typ: k.typ,
      poziom: k.poziom,
      lata: k.lata,
      wymagane: zapiszJson(k.wymagane),
      punktowane: zapiszJson(k.punktowane),
      trudnosc: k.trudnosc,
      bezposrednie: zapiszJson(k.bezposrednie),
      posrednie: zapiszJson(k.posrednie),
      odsetek: k.odsetek,
      gdzie: k.gdzie,
      robi: k.robi,
      nieDaje: k.nie_daje,
      alternatywaBezStudiow: Boolean(k.alternatywa_bez_studiow),
    })),
  });

  await prisma.drogaBezStudiow.createMany({
    data: Object.entries(drogi).map(([kod, d]) => ({
      kod,
      nazwa: d.nazwa,
      typ: d.typ,
      czas: d.czas,
      koszt: d.koszt,
      zawody: zapiszJson(d.zawody),
      wymagania: d.wymagania,
    })),
  });

  // --- RAPORT ---
  const [lObszary, lZawody, lKierunki, lDrogi, lKlastry] = await Promise.all([
    prisma.obszar.count(),
    prisma.zawod.count(),
    prisma.kierunek.count(),
    prisma.drogaBezStudiow.count(),
    prisma.klaster.count(),
  ]);
  const wKlastrach = Object.values(klastry).reduce((s, k) => s + k.sklad.length, 0);

  console.log("IMPORT ZAKONCZONY\n");
  console.log(`  obszary            ${lObszary}`);
  console.log(`  zawody             ${lZawody}`);
  console.log(`  kierunki           ${lKierunki}`);
  console.log(`  drogi bez studiow  ${lDrogi}`);
  console.log(`  klastry            ${lKlastry}  (${wKlastrach} zawodow)`);
  console.log(`  rozdzielczosc      ${lZawody - wKlastrach + lKlastry} pozycji rozroznialnych`);
  if (ostrzezenia.length > 0) {
    console.log("\nOSTRZEZENIA:");
    for (const o of ostrzezenia) console.log("  - " + o);
  }
  await prisma.$disconnect();
}

main().catch(async (e: unknown) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
