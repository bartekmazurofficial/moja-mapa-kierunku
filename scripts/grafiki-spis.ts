/**
 * Spis ilustracji do wygenerowania.
 *
 * Dokument dla osoby, ktora rysuje albo generuje grafiki: co ma powstac, pod
 * jaka nazwa i co ma byc na obrazku. Powstaje **ze slownikow platformy**, a nie
 * z reki, zeby kody i teksty zgadzaly sie co do znaku z tym, co widzi
 * uczestnik. Po zmianie tresci wystarczy uruchomic skrypt jeszcze raz.
 *
 *   npx tsx scripts/grafiki-spis.ts
 */

import fs from "node:fs";
import path from "node:path";
import { PARY_A3 } from "../lib/content/a3";
import { PARY_M1 } from "../lib/content/m1";
import { FILTRY_A5, KOMPETENCJE_A2, WARTOSCI_A4, WYMIARY_A3, WYMIARY_M1 } from "../lib/domain/slowniki";
import { maObraz } from "../lib/ui/obrazy";

interface Pozycja {
  klucz: string;
  plik: string;
  co: string;
}

function biegunyA3(): Pozycja[] {
  const wynik: Pozycja[] = [];
  for (const w of WYMIARY_A3) {
    const para = PARY_A3.find((p) => p.wymiar === w.kod);
    if (!para) continue;
    for (const [biegun, tekst] of [["A", para.biegunA], ["B", para.biegunB]] as const) {
      wynik.push({
        klucz: `a3-${w.kod}-${biegun}`,
        plik: `a3/${w.kod}-${biegun}.png`,
        co: tekst,
      });
    }
  }
  return wynik;
}

function biegunyM1(): Pozycja[] {
  const wynik: Pozycja[] = [];
  for (const w of WYMIARY_M1) {
    const para = PARY_M1.find((p) => p.wymiar === w.kod);
    if (!para) continue;
    for (const [biegun, tekst] of [["A", para.biegunA], ["B", para.biegunB]] as const) {
      wynik.push({
        klucz: `m1w-${w.kod}-${biegun}`,
        plik: `m1w/${w.kod}-${biegun}.png`,
        co: tekst,
      });
    }
  }
  return wynik;
}

function wartosciA4(): Pozycja[] {
  return WARTOSCI_A4.map((v) => ({
    klucz: `a4-${v.kod}`,
    plik: `a4/${v.kod}.png`,
    co: v.nazwa ?? v.kod,
  }));
}

function warunkiA5(): Pozycja[] {
  return FILTRY_A5.map((f) => ({
    klucz: `a5-${f.kod}`,
    plik: `a5/${f.kod}.png`,
    co: `${f.tekst} (blok: ${f.nazwaBloku})`,
  }));
}

function kompetencjeA2(): Pozycja[] {
  return KOMPETENCJE_A2.map((k) => ({
    klucz: `a2-${k.id}`,
    plik: `a2/${k.id}.png`,
    co: k.nazwa ?? String(k.id),
  }));
}

function tabela(pozycje: Pozycja[]): string {
  const wiersze = pozycje.map((p) => {
    const stan = maObraz(p.klucz) ? "jest" : "**do zrobienia**";
    return `| \`${p.plik}\` | ${p.co} | ${stan} |`;
  });
  return ["| Plik | Co ma być na obrazku | Stan |", "|---|---|---|", ...wiersze].join("\n");
}

function sekcja(tytul: string, wstep: string, pozycje: Pozycja[]): string {
  return `## ${tytul}\n\n${wstep}\n\n**Ile: ${pozycje.length}.**\n\n${tabela(pozycje)}\n`;
}

const NAGLOWEK = `# Ilustracje do wygenerowania

Ten spis powstaje ze słowników platformy (\`npx tsx scripts/grafiki-spis.ts\`),
więc kody i teksty zgadzają się co do znaku z tym, co widzi uczestnik.

## Jak to wgrać

1. Pliki źródłowe nazwij **kluczem z kolumny Plik, z katalogiem zamienionym
   na myślnik**: dla \`a3/INI-A.png\` plik nazywa się \`a3-INI-A.png\`, dla
   \`a5/F01.png\` plik nazywa się \`a5-F01.png\`. Skrypt rozpoznaje pliki po
   tym przedrostku i pomija wszystko, co do niego nie pasuje.
2. Wrzuć wszystkie pliki jednego modułu do jednego katalogu.
3. Uruchom \`npx tsx scripts/grafiki.ts <katalog> <moduł>\`, na przykład
   \`npx tsx scripts/grafiki.ts ~/Downloads/grafiki_a3 a3\`. Skrypt zrobi dwie
   wersje: 256 px na kafel i 768 px na nagłówek, i położy je w
   \`public/grafika/<moduł>/\`.
4. Dopisz klucze do listy \`Z_OBRAZEM\` w \`lib/ui/obrazy.ts\`. **Dopóki klucza
   tam nie ma, obrazek się nie pokaże**, i to jest celowe: klucz bez pliku
   dawałby pustą ramkę.

Dopóki pliku nie ma, ekran po prostu rysuje się bez obrazka i nic się nie psuje.

## Format i styl

**Format:** PNG albo JPG, kwadrat 1:1, co najmniej 1024 × 1024 px. Bez tekstu
na obrazku: każdy napis musiałby być tłumaczony i skalowany razem z obrazem,
a przy 256 px zrobi się nieczytelny.

**Styl, żeby całość trzymała się kupy z tym, co już jest w \`public/grafika/a1\`:**

- ilustracja, nie fotografia: miękkie światło, delikatny blask, lekko
  bajkowy realizm,
- jedna scena, jeden bohater albo jeden przedmiot, bez tłoku i bez kolaży,
- paleta chłodna z ciepłym akcentem: fiolet, granat i błękit jako podstawa,
  pomarańcz albo złoto jako źródło światła,
- tło rozmyte, bez ostrych krawędzi po brzegach, żeby kadr dobrze wyglądał
  po przycięciu do kwadratu i do pasa,
- ludzie różnorodni i w wieku uczestników programu, czyli 16 do 24 lat,
- bez marek, logotypów, twarzy konkretnych osób i bez czytelnych napisów.

**Czego nie rysować:** ocen i wartościowania. Obrazek bieguna „wolę pracować
sam" nie może wyglądać na smutny, a „wolę w grupie" na radosny. Obie strony
każdej pary muszą być tak samo atrakcyjne, bo inaczej obrazek wybiera za
uczestnika i psuje pomiar.

`;

function main() {
  const czesci = [
    sekcja(
      "A3 · Jak naturalnie działam, bieguny osi",
      [
        "Najpilniejsze. Dziś obie karty pary dzielą jeden obrazek osi, więc",
        "nie pomagają wybrać. Każdy biegun potrzebuje własnej sceny, pokazującej",
        "**to samo zajęcie w dwóch stylach działania**, nie dwa różne zawody.",
      ].join(" "),
      biegunyA3(),
    ),
    sekcja(
      "M1 · Jakiego życia chcesz, bieguny wymiarów",
      [
        "To samo co w A3, tylko o życiu, a nie o pracy. Sceny z życia codziennego,",
        "nie z biura.",
      ].join(" "),
      biegunyM1(),
    ),
    sekcja(
      "A4 · Co jest dla mnie ważne, dwanaście wartości",
      [
        "Tu obie strony pary to dwie różne wartości, więc wystarczy jeden obrazek",
        "na wartość. Scena ma pokazywać wartość w działaniu, a nie symbol:",
        "nie waga dla sprawiedliwości, tylko ktoś, kto właśnie to robi.",
      ].join(" "),
      wartosciA4(),
    ),
    sekcja(
      "A5 · Filtry rzeczywistości, warunki pracy",
      [
        "Czterdzieści trzy konkretne warunki. Jeśli to za dużo, wystarczy siedem",
        "obrazków blokowych (`a5/1.png` … `a5/7.png`) i wtedy jeden obrazek",
        "obsłuży wszystkie pytania swojego bloku. Platforma bierze najpierw",
        "obrazek warunku, a gdy go nie ma, obrazek bloku.",
        "Warunek pokazujemy **neutralnie**: hałas w pracy ma być pokazany",
        "rzeczowo, a nie jako ktoś cierpiący.",
      ].join(" "),
      warunkiA5(),
    ),
    sekcja(
      "A2 · W czym mogę być dobry, trzydzieści kompetencji",
      [
        "Najmniej pilne: A2 ma układ wierszy jak A1 i działa bez obrazków.",
        "Warto zrobić na końcu, żeby oba moduły z zestawami wyglądały tak samo.",
      ].join(" "),
      kompetencjeA2(),
    ),
  ];

  const tresc = `${NAGLOWEK}${czesci.join("\n")}`;
  const plik = path.join(process.cwd(), "GRAFIKI_DO_WYGENEROWANIA.md");
  fs.writeFileSync(plik, tresc, "utf8");

  const ile = [biegunyA3(), biegunyM1(), wartosciA4(), warunkiA5(), kompetencjeA2()];
  console.log(`zapisano ${path.basename(plik)}`);
  console.log(
    `pozycji: A3 ${ile[0].length}, M1 ${ile[1].length}, A4 ${ile[2].length}, ` +
      `A5 ${ile[3].length}, A2 ${ile[4].length}, razem ${ile.reduce((s, x) => s + x.length, 0)}`,
  );
}

main();
