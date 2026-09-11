/**
 * Sprawdzenie nawigacji klawiaturą. Nie wchodzi do aplikacji.
 * Przechodzi tabem przez stronę i sprawdza, czy każdy element interaktywny
 * da się osiągnąć i czy ma widoczny fokus.
 *
 * Uzycie: npx tsx scripts/klawiatura.ts [adres] [sciezka...]
 */

import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const DOMYSLNE = [
  "/u/3DEPKJBQW9/raport",
  "/u/3DEPKJBQW9/modul/A4",
  "/u/KJR5D49GKS/zawod/pielegniarka",
  "/prowadzacy/grupa/PRN2X3ZP",
  "/prowadzacy/sesja/3DEPKJBQW9",
];

async function main() {
  const adres = process.argv[2] ?? "http://localhost:3100";
  const sciezki = process.argv.length > 3 ? process.argv.slice(3) : DOMYSLNE;

  const przegladarka = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox"],
  });

  // Logowanie prowadzacego, zeby ekrany panelu w ogole sie otworzyly.
  const log = await przegladarka.newPage();
  await log.goto(adres + "/prowadzacy", { waitUntil: "networkidle0" });
  const pole = await log.$("#haslo");
  if (pole) {
    await pole.type(process.env.PROWADZACY_HASLO ?? "zmien-to-przed-pilotazem");
    await Promise.all([
      log.waitForNavigation({ waitUntil: "networkidle0" }),
      log.click("button[type=submit]"),
    ]);
  }
  await log.close();

  let bledy = 0;
  for (const sciezka of sciezki) {
    const karta = await przegladarka.newPage();
    await karta.setViewport({ width: 1280, height: 900 });
    await karta.goto(adres + sciezka, { waitUntil: "networkidle0" });

    // Liczymy tylko elementy realnie dostepne z klawiatury: wylaczony przycisk
    // celowo wypada z kolejnosci tabulacji i nie jest bledem.
    const interaktywne = await karta.evaluate(() => {
      const wybor = "a[href], button, input, select, textarea, summary, [tabindex]";
      return [...document.querySelectorAll(wybor)].filter((e) => {
        const el = e as HTMLElement;
        if (el.hidden || el.offsetParent === null) return false;
        if ((el as HTMLButtonElement).disabled) return false;
        if (el.getAttribute("tabindex") === "-1") return false;
        return true;
      }).length;
    });

    // Kazdy element dostaje wlasny znacznik, bo etykiety sie powtarzaja
    // („Karta", „Sesja" w kazdym wierszu tabeli).
    await karta.evaluate(() => {
      document.querySelectorAll("a[href], button, input, select, textarea, summary, [tabindex]")
        .forEach((e, i) => e.setAttribute("data-tab", String(i)));
    });

    const osiagniete = new Set<string>();
    let bezFokusu = 0;
    const bezFokusuOpis: string[] = [];
    for (let i = 0; i < interaktywne + 3; i++) {
      await karta.keyboard.press("Tab");
      const stan = await karta.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const styl = getComputedStyle(el);
        const widoczny = styl.outlineStyle !== "none" && parseFloat(styl.outlineWidth) > 0;
        const etykieta = (el.innerText || el.getAttribute("aria-label") || el.id || "").slice(0, 30);
        return { klucz: el.getAttribute("data-tab") ?? etykieta, widoczny, opis: `${el.tagName} ${etykieta}` };
      });
      if (!stan) break;
      if (osiagniete.has(stan.klucz)) break;
      osiagniete.add(stan.klucz);
      if (!stan.widoczny) {
        bezFokusu++;
        bezFokusuOpis.push(stan.opis);
      }
    }

    const brakuje = interaktywne - osiagniete.size;
    const ok = bezFokusu === 0 && brakuje <= 0;
    if (!ok) bledy++;
    console.log(
      `${ok ? "ok  " : "BŁĄD"} ${sciezka.padEnd(36)} dostępnych ${String(interaktywne).padStart(3)} · osiągniętych tabem ${String(osiagniete.size).padStart(3)} · bez widocznego fokusu ${bezFokusu}`,
    );
    for (const o of bezFokusuOpis.slice(0, 5)) console.log(`       bez fokusu: ${o}`);
    await karta.close();
  }

  await przegladarka.close();
  console.log(bledy === 0 ? "\nwszystkie ekrany przechodzą" : `\n${bledy} ekranów do poprawy`);
}

void main();
