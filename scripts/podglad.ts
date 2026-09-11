/** Szybki zrzut kilku adresów. Uzycie: npx tsx scripts/podglad.ts nazwa:/sciezka:szer:wys ... */
import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function main() {
  const adres = "http://localhost:3100";
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });
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
