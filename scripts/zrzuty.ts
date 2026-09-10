/**
 * Zrzuty ekranu do przegladu wizualnego. Nie wchodzi do aplikacji.
 * Uzycie: npx tsx scripts/zrzuty.ts [adres serwera] [katalog wyjscia]
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

interface Zrzut {
  nazwa: string;
  sciezka: string;
  szerokosc: number;
  wysokosc: number;
  pelnaStrona?: boolean;
}

const ZRZUTY: Zrzut[] = [
  { nazwa: "telefon-1-blok-zainteresowan", sciezka: "/u/B3DAXR77EH/modul/A1", szerokosc: 390, wysokosc: 844 },
  { nazwa: "telefon-2-lista-modulow", sciezka: "/u/3DEPKJBQW9", szerokosc: 390, wysokosc: 844 },
  { nazwa: "telefon-3-filtry", sciezka: "/u/HK56YWDWRT/modul/A5", szerokosc: 390, wysokosc: 844 },
  { nazwa: "komputer-1-filtry-rzeczywistosci", sciezka: "/u/HK56YWDWRT/modul/A5", szerokosc: 1440, wysokosc: 900 },
  { nazwa: "komputer-2-kotwice-zainteresowan", sciezka: "/u/68KFWMZJ6N/modul/A1", szerokosc: 1440, wysokosc: 1000 },
  { nazwa: "komputer-3-lista-modulow", sciezka: "/u/3DEPKJBQW9", szerokosc: 1440, wysokosc: 950 },
];

async function main() {
  const adres = process.argv[2] ?? "http://localhost:3100";
  const katalog = process.argv[3] ?? "/tmp/zrzuty";
  mkdirSync(katalog, { recursive: true });

  const przegladarka = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
  });

  for (const z of ZRZUTY) {
    const karta = await przegladarka.newPage();
    await karta.setViewport({ width: z.szerokosc, height: z.wysokosc, deviceScaleFactor: 2 });
    await karta.goto(adres + z.sciezka, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));
    const plik = join(katalog, `${z.nazwa}.png`);
    await karta.screenshot({ path: plik as `${string}.png`, fullPage: z.pelnaStrona ?? false });
    console.log(`  ${z.nazwa}  ${z.szerokosc}x${z.wysokosc}`);
    await karta.close();
  }

  await przegladarka.close();
  console.log(`\nzapisano w ${katalog}`);
}

void main();
