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
  /** Tekst naglowka, do ktorego przewijamy przed zrzutem. */
  przewinDo?: string;
  /** Ekran panelu: trzeba najpierw zalogowac prowadzacego. */
  panel?: boolean;
  /** Ile razy kliknac przycisk „dalej", zeby przejsc ekran wstepu. */
  dalej?: number;
}

const ZRZUTY: Zrzut[] = [
  { nazwa: "nowy-1-przeglad", sciezka: "/u/3DEPKJBQW9", szerokosc: 1440, wysokosc: 1000 },
  { nazwa: "nowy-2-moduly", sciezka: "/u/3DEPKJBQW9/moduly", szerokosc: 1440, wysokosc: 1200 },
  { nazwa: "nowy-3-przeglad-telefon", sciezka: "/u/3DEPKJBQW9", szerokosc: 390, wysokosc: 1400 },
  { nazwa: "telefon-1-trzy-drogi", sciezka: "/u/3DEPKJBQW9/raport?otwarte=trzy_drogi", szerokosc: 390, wysokosc: 1500, przewinDo: "Trzy drogi" },
  { nazwa: "telefon-2-karta-zawodu", sciezka: "/u/KJR5D49GKS/zawod/pielegniarka", szerokosc: 390, wysokosc: 1400 },
  { nazwa: "telefon-3-raport-lista", sciezka: "/u/3DEPKJBQW9/raport", szerokosc: 390, wysokosc: 1200 },
  { nazwa: "telefon-4-blok-zainteresowan", sciezka: "/u/B3DAXR77EH/modul/A1", szerokosc: 390, wysokosc: 844 },
  { nazwa: "komputer-1-trzy-drogi", sciezka: "/u/3DEPKJBQW9/raport?otwarte=trzy_drogi", szerokosc: 1440, wysokosc: 1100, przewinDo: "Trzy drogi" },
  { nazwa: "komputer-2-kierunki-bez-studiow", sciezka: "/u/3DEPKJBQW9/raport?otwarte=kierunki", szerokosc: 1440, wysokosc: 1300, przewinDo: "Kierunki i drogi" },
  { nazwa: "komputer-3-zawody", sciezka: "/u/KJR5D49GKS/raport?otwarte=zawody", szerokosc: 1440, wysokosc: 1300, przewinDo: "Konkretne zawody" },
  { nazwa: "komputer-4-karta-zawodu", sciezka: "/u/KJR5D49GKS/zawod/pielegniarka", szerokosc: 1440, wysokosc: 1200 },
  { nazwa: "telefon-7-filtry-a5", sciezka: "/u/FGN8GB99JH/modul/A5", szerokosc: 390, wysokosc: 844, dalej: 1 },
  { nazwa: "telefon-5-profil-plaski", sciezka: "/u/S4YBD2DEJH/raport?otwarte=obszary", szerokosc: 390, wysokosc: 1500, przewinDo: "Moje najmocniejsze obszary" },
  { nazwa: "komputer-5-profil-plaski", sciezka: "/u/S4YBD2DEJH/raport?otwarte=trzy_drogi", szerokosc: 1440, wysokosc: 1300, przewinDo: "Trzy drogi" },
  { nazwa: "komputer-6-korekta-prowadzacego", sciezka: "/u/3DEPKJBQW9/raport?otwarte=zawody", szerokosc: 1440, wysokosc: 1200, przewinDo: "Dopisane podczas rozmowy" },
  { nazwa: "telefon-6-moja-decyzja", sciezka: "/u/3DEPKJBQW9/raport?otwarte=moja_decyzja", szerokosc: 390, wysokosc: 1000, przewinDo: "Moja decyzja" },
  { nazwa: "panel-1-grupa", sciezka: "/prowadzacy/grupa/PRN2X3ZP", szerokosc: 1440, wysokosc: 1100, panel: true },
  { nazwa: "panel-2-uczestnik", sciezka: "/prowadzacy/uczestnik/3DEPKJBQW9", szerokosc: 1440, wysokosc: 1400, panel: true },
  { nazwa: "panel-3-sesja", sciezka: "/prowadzacy/sesja/3DEPKJBQW9", szerokosc: 1440, wysokosc: 1400, panel: true },
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

  // Panel wymaga sesji prowadzacego. Logujemy sie raz, ciasteczko zyje w profilu.
  const logowanie = await przegladarka.newPage();
  await logowanie.goto(adres + "/prowadzacy", { waitUntil: "networkidle0" });
  const pole = await logowanie.$("#haslo");
  if (pole) {
    await pole.type(process.env.PROWADZACY_HASLO ?? "zmien-to-przed-pilotazem");
    await Promise.all([
      logowanie.waitForNavigation({ waitUntil: "networkidle0" }),
      logowanie.click("button[type=submit]"),
    ]);
  }
  await logowanie.close();

  for (const z of ZRZUTY) {
    const karta = await przegladarka.newPage();
    await karta.setViewport({ width: z.szerokosc, height: z.wysokosc, deviceScaleFactor: 2 });
    await karta.goto(adres + z.sciezka, { waitUntil: "networkidle0" });
    for (let i = 0; i < (z.dalej ?? 0); i++) {
      await karta.evaluate(() => {
        const przyciski = [...document.querySelectorAll("button")];
        const dalej = przyciski.find((b) => /Zaczynamy|Dalej|Przejdź/.test(b.textContent ?? ""));
        dalej?.click();
      });
      await new Promise((r) => setTimeout(r, 500));
    }
    if (z.przewinDo) {
      await karta.evaluate((szukany: string) => {
        const kandydaci = [...document.querySelectorAll("h2, h3, p, summary")];
        const cel = kandydaci.find((h) => h.textContent?.includes(szukany));
        if (!cel) throw new Error(`nie ma na stronie tekstu: ${szukany}`);
        cel.scrollIntoView({ block: "start" });
      }, z.przewinDo);
    }
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
