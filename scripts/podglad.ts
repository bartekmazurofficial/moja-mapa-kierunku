/** Szybki zrzut kilku adresów. Uzycie: npx tsx scripts/podglad.ts nazwa:/sciezka:szer:wys ... */
import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function main() {
  const adres = "http://localhost:3100";
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });

  // Ekrany panelu wymagaja sesji prowadzacego. Logujemy sie raz.
  const log = await b.newPage();
  await log.goto(adres + "/prowadzacy", { waitUntil: "domcontentloaded" });
  const pole = await log.$("#haslo");
  if (pole) {
    await pole.type(process.env.PROWADZACY_HASLO ?? "zmien-to-przed-pilotazem");
    await Promise.all([
      log.waitForNavigation({ waitUntil: "domcontentloaded" }).catch(() => {}),
      log.click("button[type=submit]"),
    ]);
    await new Promise((r) => setTimeout(r, 800));
  }
  await log.close();

  for (const arg of process.argv.slice(2)) {
    const [nazwa, sciezka, w = "1440", h = "1100"] = arg.split("|");
    const p = await b.newPage();
    await p.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 2 });
    await p.goto(adres + sciezka, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1400));
    await p.screenshot({ path: `/tmp/zrzuty/${nazwa}.png` as `${string}.png` });
    console.log(`${nazwa}  ${w}x${h}  ${sciezka}`);
    await p.close();
  }
  await b.close();
}
void main();
