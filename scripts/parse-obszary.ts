/**
 * Parser bazy 27 obszarow zawodowych.
 *
 * Zrodlo: program-doradztwa/03_dane/obszary_27_opis.md
 * Wyjscie: data/generated/obszary.json
 *
 * Baza obszarow jest jedyna z czterech, ktora nie ma postaci JSON. Ten parser
 * zamienia proze na dane i przerywa prace przy pierwszej etykiecie, ktorej nie
 * potrafi odwzorowac - milczace pominiecie profilu obszaru przesunieoby caly
 * ranking warstwy pierwszej.
 *
 * Macierz sasiedztwa liczymy sami, miara kosinusowa na polaczonym wektorze
 * zainteresowan i kompetencji, tak jak opisuje to rozdzial 6 dokumentu
 * zrodlowego. Dzieki temu aktualizuje sie sama przy kazdej zmianie profilu.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { OBSZARY_A1, KOMPETENCJE_A2 } from "../lib/domain/slowniki";
import {
  A5_ETYKIETY,
  A4_ETYKIETY,
  M1_FRAZY,
  A3_FRAZY,
  POZIOMY_ETYKIETY,
  A2_ALIASY,
} from "./mapowanie-obszarow";

const ZRODLO = join(process.cwd(), "program-doradztwa/03_dane/obszary_27_opis.md");
const KATALOG_WYJSCIA = join(process.cwd(), "data/generated");
const WYJSCIE = join(KATALOG_WYJSCIA, "obszary.json");

export interface PoziomWejscia {
  poziom: string;
  etykieta: string;
  przyklad: string;
  czas: string;
  lata: number;
  studiaOpis: string;
  wymagaStudiow: boolean;
}

export interface WarunekSrodowiska {
  fraza: string;
  wymiar: string | null;
  biegun: string | null;
}

export interface ObszarSparsowany {
  id: number;
  nazwa: string;
  grupa: string;
  szczegolny: boolean;
  wariantWlasny: boolean;
  zainteresowania: Record<string, number>;
  kompetencje: Record<string, number>;
  wartosciPlus: string[];
  wartosciMinus: string[];
  filtry: Record<string, number>;
  zycie: Record<string, string>;
  srodowisko: WarunekSrodowiska[];
  trudne: string[];
  poziomy: PoziomWejscia[];
  sasiedztwo: Record<string, number>;
  przykladoweZawody: string;
  kierunkiStudiow: string;
  drogaBezStudiow: string;
}

const bledy: string[] = [];

function zglos(obszar: number, komunikat: string): void {
  bledy.push(`obszar ${obszar}: ${komunikat}`);
}

/** Wyciaga zawartosc linii zaczynajacej sie od **Etykieta:** */
function pole(body: string, etykieta: string): string | null {
  const re = new RegExp(`\\*\\*${etykieta}[^*]*\\*\\*[ \\t]*(.*)`, "u");
  const m = body.match(re);
  return m ? m[1].trim().replace(/\s+$/, "") : null;
}

/** Dzieli liste rozdzielona przecinkami albo srodkowa kropka. */
function lista(tekst: string): string[] {
  return tekst
    .split(/,|·/)
    .map((x) => x.trim().replace(/\.$/, ""))
    .filter((x) => x.length > 0);
}

/**
 * Wagowana lista nazw z dokumentu: "Prowadzenie ludzi (3), Planowanie (2)".
 * Nazwy zawieraja przecinki ("Liczby, dane, wzorce"), wiec dopasowujemy
 * po slowniku, od najdluzszej nazwy, i sprawdzamy, czy nic nie zostalo.
 */
function wagi(
  tekst: string,
  slownik: Array<{ id: number; nazwa: string }>,
  obszar: number,
  ktore: string,
): Record<string, number> {
  let reszta = tekst;
  const wynik: Record<string, number> = {};
  const posortowane = [...slownik].sort((a, b) => b.nazwa.length - a.nazwa.length);
  for (const wpis of posortowane) {
    const re = new RegExp(`${wpis.nazwa.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\((\\d)\\)`, "u");
    const m = reszta.match(re);
    if (m) {
      wynik[String(wpis.id)] = Number(m[1]);
      reszta = reszta.replace(re, "");
    }
  }
  const zostalo = reszta.replace(/[,·\s]+/g, "");
  if (zostalo.length > 0) zglos(obszar, `${ktore}: nierozpoznane "${reszta.trim()}"`);
  if (Object.keys(wynik).length === 0) zglos(obszar, `${ktore}: pusty profil`);
  return wynik;
}

/** "0–1 rok", "3–5 lat", "8+ lat", "11+ lat" -> liczba lat do samodzielnej pracy. */
function lataZCzasu(czas: string, obszar: number): number {
  const m = czas.match(/(\d+)/);
  if (!m) {
    zglos(obszar, `nie umiem odczytac czasu dojscia "${czas}"`);
    return 0;
  }
  return Number(m[1]);
}

function parsujPoziomy(body: string, obszar: number): PoziomWejscia[] {
  const wiersze = [...body.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gmu)];
  const poziomy: PoziomWejscia[] = [];
  for (const w of wiersze) {
    const etykieta = w[1].trim();
    const kod = POZIOMY_ETYKIETY[etykieta];
    if (!kod) continue; // naglowek tabeli albo inna tabela
    const czas = w[3].trim();
    const studiaOpis = w[4].trim();
    poziomy.push({
      poziom: kod,
      etykieta,
      przyklad: w[2].trim(),
      czas,
      lata: lataZCzasu(czas, obszar),
      studiaOpis,
      // Regula z prototypu warstwy pierwszej: wymog studiow tylko wtedy,
      // gdy opis zaczyna sie od "tak". "zwykle tak" nie zamyka poziomu
      // osobie, ktora nie idzie na studia.
      wymagaStudiow: studiaOpis.startsWith("tak"),
    });
  }
  if (poziomy.length < 2 || poziomy.length > 4) {
    zglos(obszar, `oczekiwano 2-4 poziomow wejscia, jest ${poziomy.length}`);
  }
  return poziomy;
}

function kosinus(a: number[], b: number[]): number {
  let licznik = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    licznik += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return licznik / (Math.sqrt(na) * Math.sqrt(nb));
}

function main(): void {
  const tekst = readFileSync(ZRODLO, "utf8");

  // Grupy porzadkujace: "## GRUPA: BIZNES I WPŁYW"
  const grupy = new Map<number, string>();
  const czesciGrup = tekst.split(/^## GRUPA: (.+)$/mu);
  for (let i = 1; i < czesciGrup.length; i += 2) {
    const nazwaGrupy = czesciGrup[i].trim();
    for (const m of czesciGrup[i + 1].matchAll(/^### (\d+)\. /gmu)) {
      grupy.set(Number(m[1]), nazwaGrupy);
    }
  }

  const czesci = tekst.split(/^### (\d+)\. (.+)$/mu);
  const obszary: ObszarSparsowany[] = [];

  for (let i = 1; i < czesci.length; i += 3) {
    const id = Number(czesci[i]);
    const nazwa = czesci[i + 1].trim();
    const body = czesci[i + 2];

    const surowyA1 = pole(body, "Zainteresowania \\(A1\\)");
    const surowyA2 = pole(body, "Kompetencje \\(A2\\)");
    const surowyA4p = pole(body, "Wartości zaspokajane \\(A4\\)");
    const surowyA4m = pole(body, "W konflikcie z");
    const surowyA5 = pole(body, "Wymagania \\(A5\\)");
    const surowyM1 = pole(body, "Typowy kształt życia \\(M1\\)");
    const surowyA3 = pole(body, "Środowisko, które oferuje \\(A3\\)");
    const surowyTrudne = pole(body, "Co może przeszkadzać");

    if (!surowyA1 || !surowyA2 || !surowyA4p || !surowyA5 || !surowyM1 || !surowyA3) {
      zglos(id, "brakuje ktoregos z profili");
      continue;
    }

    const zainteresowania = wagi(
      surowyA1,
      OBSZARY_A1.map((o) => ({ id: o.id, nazwa: o.nazwaTechniczna })),
      id,
      "A1",
    );
    const kompetencje = wagi(
      surowyA2,
      [
        ...KOMPETENCJE_A2,
        ...Object.entries(A2_ALIASY).map(([nazwa, id]) => ({ id, nazwa })),
      ],
      id,
      "A2",
    );

    const wartosciPlus: string[] = [];
    for (const etykieta of lista(surowyA4p)) {
      const kod = A4_ETYKIETY[etykieta];
      if (!kod) zglos(id, `A4 zaspokajane: nieznana wartosc "${etykieta}"`);
      else wartosciPlus.push(kod);
    }

    const wartosciMinus: string[] = [];
    for (const etykieta of lista(surowyA4m ?? "")) {
      const kod = A4_ETYKIETY[etykieta];
      if (!kod) zglos(id, `A4 w konflikcie: nieznana wartosc "${etykieta}"`);
      else wartosciMinus.push(kod);
    }

    const filtry: Record<string, number> = {};
    for (const czesc of surowyA5.split(",")) {
      const m = czesc.match(/^\s*(.+?)\s*\*\*([\d.,]+)\*\*\s*$/u);
      if (!m) {
        if (czesc.trim()) zglos(id, `A5: nie umiem odczytac "${czesc.trim()}"`);
        continue;
      }
      const kod = A5_ETYKIETY[m[1].trim()];
      if (!kod) {
        zglos(id, `A5: nieznane wymaganie "${m[1].trim()}"`);
        continue;
      }
      filtry[kod] = Number(m[2].replace(",", "."));
    }

    const zycie: Record<string, string> = {};
    for (const fraza of lista(surowyM1)) {
      const cel = M1_FRAZY[fraza];
      if (cel === undefined) {
        zglos(id, `M1: nieznana fraza "${fraza}"`);
        continue;
      }
      const [wymiar, biegun] = cel.split(":");
      zycie[wymiar] = biegun;
    }

    const srodowisko: WarunekSrodowiska[] = [];
    for (const fraza of lista(surowyA3)) {
      if (!(fraza in A3_FRAZY)) {
        zglos(id, `A3: nieznana fraza srodowiskowa "${fraza}"`);
        continue;
      }
      const cel = A3_FRAZY[fraza];
      if (cel === null) {
        srodowisko.push({ fraza, wymiar: null, biegun: null });
      } else {
        const [wymiar, biegun] = cel.split(":");
        srodowisko.push({ fraza, wymiar, biegun });
      }
    }

    obszary.push({
      id,
      nazwa,
      grupa: grupy.get(id) ?? "",
      szczegolny: /\*\*Obszar szczególny\.\*\*/u.test(body),
      wariantWlasny: /\*\*Wariant na własny rachunek:\*\*\s*realny/u.test(body),
      zainteresowania,
      kompetencje,
      wartosciPlus,
      wartosciMinus,
      filtry,
      zycie,
      srodowisko,
      trudne: surowyTrudne ? lista(surowyTrudne) : [],
      poziomy: parsujPoziomy(body, id),
      sasiedztwo: {},
      przykladoweZawody: pole(body, "Przykładowe zawody") ?? "",
      kierunkiStudiow: pole(body, "Kierunki studiów") ?? "",
      drogaBezStudiow: pole(body, "Droga bez studiów") ?? "",
    });
  }

  if (obszary.length !== 27) {
    bledy.push(`oczekiwano 27 obszarow, sparsowano ${obszary.length}`);
  }

  // Macierz sasiedztwa: kosinus na polaczonym wektorze A1 (24) + A2 (30).
  const wektor = (o: ObszarSparsowany): number[] => [
    ...OBSZARY_A1.map((a) => o.zainteresowania[String(a.id)] ?? 0),
    ...KOMPETENCJE_A2.map((k) => o.kompetencje[String(k.id)] ?? 0),
  ];
  const wektory = new Map(obszary.map((o) => [o.id, wektor(o)]));
  for (const a of obszary) {
    for (const b of obszary) {
      if (a.id === b.id) continue;
      a.sasiedztwo[String(b.id)] = Number(
        kosinus(wektory.get(a.id)!, wektory.get(b.id)!).toFixed(4),
      );
    }
  }

  if (bledy.length > 0) {
    console.error("PARSER BAZY OBSZAROW: BLEDY\n");
    for (const b of bledy) console.error("  - " + b);
    console.error(`\nRazem bledow: ${bledy.length}. Nie zapisuje pliku.`);
    process.exit(1);
  }

  mkdirSync(KATALOG_WYJSCIA, { recursive: true });
  writeFileSync(WYJSCIE, JSON.stringify(obszary, null, 1) + "\n", "utf8");

  // Raport kontrolny.
  const wszystkieA1 = new Set<string>();
  const wszystkieA2 = new Set<string>();
  const wszystkieA4 = new Set<string>();
  const wszystkieA5 = new Set<string>();
  let poziomowRazem = 0;
  for (const o of obszary) {
    Object.keys(o.zainteresowania).forEach((k) => wszystkieA1.add(k));
    Object.keys(o.kompetencje).forEach((k) => wszystkieA2.add(k));
    [...o.wartosciPlus, ...o.wartosciMinus].forEach((k) => wszystkieA4.add(k));
    Object.keys(o.filtry).forEach((k) => wszystkieA5.add(k));
    poziomowRazem += o.poziomy.length;
  }
  const pary = obszary.flatMap((a) => obszary.filter((b) => b.id > a.id).map((b) => a.sasiedztwo[String(b.id)]));
  const srednia = pary.reduce((s, x) => s + x, 0) / pary.length;

  console.log(`obszarow:            ${obszary.length}/27`);
  console.log(`poziomow wejscia:    ${poziomowRazem}`);
  console.log(`pokrycie A1:         ${wszystkieA1.size}/24`);
  console.log(`pokrycie A2:         ${wszystkieA2.size}/30`);
  console.log(`pokrycie A4:         ${wszystkieA4.size}/12`);
  console.log(`pokrycie A5:         ${wszystkieA5.size}/32`);
  console.log(`sasiedztwo: srednie ${srednia.toFixed(2)}, maks ${Math.max(...pary).toFixed(2)}`);
  console.log(`zapisano ${WYJSCIE}`);
}

main();
