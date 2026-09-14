/**
 * Spis ilustracji do wygenerowania.
 *
 * Dokument dla osoby, ktora rysuje albo generuje grafiki: co ma powstac, pod
 * jaka nazwa, w jakim ksztalcie i co ma byc na obrazku. Powstaje **ze slownikow
 * platformy**, a nie z reki, zeby kody i teksty zgadzaly sie co do znaku z tym,
 * co widzi uczestnik, a kolumna "Stan" mowila prawde o tym, co juz lezy
 * w `public/grafika`. Po zmianie tresci wystarczy uruchomic skrypt jeszcze raz.
 *
 *   npx tsx scripts/grafiki-spis.ts
 */

import fs from "node:fs";
import path from "node:path";
import { PARY_A3 } from "../lib/content/a3";
import { PARY_M1 } from "../lib/content/m1";
import {
  FILTRY_A5,
  KOMPETENCJE_A2,
  OBSZARY_A1,
  WARTOSCI_A4,
  WYMIARY_A3,
  WYMIARY_M1,
} from "../lib/domain/slowniki";
import { maObraz, obrazPlanszy } from "../lib/ui/obrazy";

/** Polska odmiana po liczbie: 1 warunek, 2-4 warunki, 5 i wiecej warunkow. */
function warunkow(ile: number): string {
  const reszta = ile % 10;
  const setka = ile % 100;
  if (ile === 1) return "1 warunek";
  if (reszta >= 2 && reszta <= 4 && (setka < 12 || setka > 14)) return `${ile} warunki`;
  return `${ile} warunków`;
}

interface Pozycja {
  klucz: string;
  plik: string;
  co: string;
  /** Plansze sprawdzamy inna lista niz kafle. */
  plansza?: boolean;
}

// =====================================================================
// Zestawy pozycji ze slownikow
// =====================================================================

function obszaryA1(): Pozycja[] {
  return OBSZARY_A1.map((o) => ({
    klucz: `a1-${o.id}`,
    plik: `a1/${o.id}.png`,
    co: o.etykieta,
  }));
}

function planszeObszarow(): Pozycja[] {
  return OBSZARY_A1.map((o) => ({
    klucz: `a1-${o.id}`,
    plik: `plansze/a1-${o.id}.png`,
    co: `${o.etykieta}, kadr poziomy`,
    plansza: true,
  }));
}

function kompetencjeA2(): Pozycja[] {
  return KOMPETENCJE_A2.map((k) => ({
    klucz: `a2-${k.id}`,
    plik: `a2/${k.id}.png`,
    co: k.nazwa ?? String(k.id),
  }));
}

function osieA3(): Pozycja[] {
  return WYMIARY_A3.map((w) => ({
    klucz: `a3-${w.kod}`,
    plik: `a3/${w.kod}.png`,
    co: `${w.biegunA} / ${w.biegunB}`,
  }));
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

function blokiA5(): Pozycja[] {
  const bloki = new Map<number, string>();
  for (const f of FILTRY_A5) bloki.set(f.blok, f.nazwaBloku);
  return [...bloki.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([nr, nazwa]) => ({
      klucz: `a5-${nr}`,
      plik: `plansze/a5-${nr}.png`,
      plansza: true,
      co: `${nazwa} (${warunkow(FILTRY_A5.filter((f) => f.blok === nr).length)} w bloku)`,
    }));
}

function warunkiA5(): Pozycja[] {
  return FILTRY_A5.map((f) => ({
    klucz: `a5-${f.kod}`,
    plik: `plansze/a5-${f.kod}.png`,
    plansza: true,
    co: `${f.tekst} (blok: ${f.nazwaBloku})`,
  }));
}

// =====================================================================
// Skladanie dokumentu
// =====================================================================

function jest(p: Pozycja): boolean {
  return p.plansza ? Boolean(obrazPlanszy(p.klucz)) : maObraz(p.klucz);
}

function tabela(pozycje: Pozycja[]): string {
  const wiersze = pozycje.map(
    (p) => `| \`${p.plik}\` | ${p.co} | ${jest(p) ? "jest" : "**do zrobienia**"} |`,
  );
  return ["| Plik | Co ma być na obrazku | Stan |", "|---|---|---|", ...wiersze].join("\n");
}

function sekcja(tytul: string, wstep: string, pozycje: Pozycja[]): string {
  const czysty = wstep.replace(/[ \t]+\n/g, "\n").trim();
  const brakuje = pozycje.filter((p) => !jest(p)).length;
  const licznik =
    brakuje === 0
      ? `**Ile: ${pozycje.length}. Komplet leży w repozytorium.**`
      : `**Ile: ${pozycje.length}, w tym ${brakuje} do zrobienia.**`;
  return `## ${tytul}\n\n${czysty}\n\n${licznik}\n\n${tabela(pozycje)}\n`;
}

function wierszPodsumowania(nazwa: string, gdzie: string, pozycje: Pozycja[]): string {
  const brakuje = pozycje.filter((p) => !jest(p)).length;
  const stan = brakuje === 0 ? "komplet" : `**brakuje ${brakuje}**`;
  return `| ${nazwa} | ${gdzie} | ${pozycje.length} | ${stan} |`;
}

function main() {
  const zestawy = {
    a1: obszaryA1(),
    planszeA1: planszeObszarow(),
    a2: kompetencjeA2(),
    a3osie: osieA3(),
    a3bieguny: biegunyA3(),
    a4: wartosciA4(),
    a5bloki: blokiA5(),
    a5warunki: warunkiA5(),
    m1: biegunyM1(),
  };

  const brakuje = (pozycje: Pozycja[]) => pozycje.filter((p) => !jest(p)).length;
  /**
   * A5 da sie obsluzyc dwojako: siedmioma obrazkami blokowymi albo
   * czterdziestoma trzema warunkami. Gdy warunki sa komplet, bloki nie sa juz
   * potrzebne - platforma bierze najpierw obrazek warunku.
   */
  const a5Minimum = brakuje(zestawy.a5warunki) === 0 ? 0 : brakuje(zestawy.a5bloki);
  const a5Pelne = brakuje(zestawy.a5warunki);
  const bezA5 =
    brakuje(zestawy.a3bieguny) + brakuje(zestawy.m1) + brakuje(zestawy.planszeA1);
  const brakujeMin = bezA5 + a5Minimum;
  const brakujeMax = bezA5 + a5Pelne;

  const naglowek = `# Ilustracje do wygenerowania

Spis powstaje ze słowników platformy (\`npx tsx scripts/grafiki-spis.ts\`), więc
kody i teksty zgadzają się co do znaku z tym, co widzi uczestnik, a kolumna
**Stan** mówi prawdę o tym, co już leży w repozytorium.

## Ile tego jest

| Zestaw | Gdzie się pokazuje | Sztuk | Stan |
|---|---|---|---|
${[
  wierszPodsumowania("A1 · obszary zainteresowań", "kafel przy wierszu rankingu", zestawy.a1),
  wierszPodsumowania("A2 · kompetencje", "kafel przy wierszu rankingu", zestawy.a2),
  wierszPodsumowania("A3 · osie", "pas nad dwiema kartami wyboru", zestawy.a3osie),
  wierszPodsumowania("A3 · bieguny", "połowa pasa nad kartą wyboru", zestawy.a3bieguny),
  wierszPodsumowania("A4 · wartości", "połowa pasa nad kartą wyboru", zestawy.a4),
  // Bloki znikaja ze spisu, gdy warunki sa komplet: to alternatywa, nie dodatek.
  ...(a5Pelne === 0
    ? []
    : [wierszPodsumowania("A5 · bloki warunków", "pas nad trzema odpowiedziami", zestawy.a5bloki)]),
  wierszPodsumowania("A5 · warunki pracy", "pas nad trzema odpowiedziami", zestawy.a5warunki),
  wierszPodsumowania("M1 · bieguny wymiarów", "połowa pasa nad kartą wyboru", zestawy.m1),
  wierszPodsumowania("Plansze obszarów", "nagłówek karty zawodu", zestawy.planszeA1),
].join("\n")}

**Do zrobienia zostało ${brakujeMin} plików.**${
    a5Minimum === 0 && a5Pelne === 0
      ? "\nA5 ma komplet czterdziestu trzech warunków, więc obrazki blokowe\nnie są już potrzebne."
      : `\nTo wariant z siedmioma obrazkami blokowymi dla A5 zamiast czterdziestu\ntrzech pojedynczych. Z pełnym A5 wychodzi ${brakujeMax}.`
  }

## Jak to wgrać

1. Nazwij pliki źródłowe tak, jak mówi kolumna **Plik**, z ukośnikiem
   zamienionym na myślnik: \`a3/INI-A.png\` → plik \`a3-INI-A.png\`,
   \`m1w/CEN-A.png\` → plik \`m1w-CEN-A.png\`. **Wyjątek: plansze.** Tam klucz
   jest już w nazwie, więc \`plansze/a5-1.png\` → plik \`a5-1.png\`,
   a \`plansze/a1-7.png\` → plik \`a1-7.png\`.
2. Wrzuć wszystkie pliki jednego zestawu do jednego katalogu.
3. Uruchom \`npx tsx scripts/grafiki.ts <katalog> <zestaw>\`:
   - \`npx tsx scripts/grafiki.ts ~/Downloads/a3_bieguny a3\`
   - \`npx tsx scripts/grafiki.ts ~/Downloads/m1_bieguny m1w\`
   - \`npx tsx scripts/grafiki.ts ~/Downloads/a5_bloki plansze\`
   - \`npx tsx scripts/grafiki.ts ~/Downloads/plansze_obszarow plansze\`

   Kwadraty dostają dwie wersje, 256 px na kafel i 768 px na pas. Plansze
   jedną, szeroką 1200 px.
4. Dopisz klucze do list w \`lib/ui/obrazy.ts\`: kwadraty do \`Z_OBRAZEM\`,
   plansze do \`Z_PLANSZA\`. **Dopóki klucza tam nie ma, obrazek się nie
   pokaże**, i to jest celowe: klucz bez pliku dawałby pustą ramkę.

Warunki A5 i plansze obszarów idą **wyłącznie** do \`Z_PLANSZA\`, bo pokazują
się tylko jako pas. Bieguny A3 i M1 idą do \`Z_OBRAZEM\`.

Dopóki pliku nie ma, ekran po prostu rysuje się bez obrazka i nic się nie psuje.

## Dwa kształty, nie jeden

Panele assessmentów pokazują obrazki na dwa sposoby i od tego zależy kadr.

**Kwadrat 1:1, co najmniej 1024 × 1024 px.** Kafel przy wierszu rankingu
(A1, A2) i połowa pasa nad kartą wyboru (A3 bieguny, A4, M1). Połowa pasa ma
proporcję mniej więcej 1,9:1, więc kwadrat jest przycinany do środka: **ważna
rzecz musi być w środku kadru, nie przy krawędzi**.

**Pas poziomy 16:9, co najmniej 1600 × 900 px.** Pas nad trzema odpowiedziami
w A5 i nagłówek karty zawodu (plansze obszarów). Tu obrazek jest przycinany do
mniej więcej 3,8:1 w assessmencie i 1,5:1 na karcie zawodu, więc **dolne
i górne dwadzieścia procent kadru może zniknąć**.

Bez tekstu na obrazku: każdy napis musiałby być tłumaczony i skalowany razem
z obrazem, a przy 256 px zrobi się nieczytelny.

## Styl

Tak, żeby całość trzymała się kupy z tym, co już leży w \`public/grafika/a1\`:

- ilustracja, nie fotografia: miękkie światło, delikatny blask, lekko
  bajkowy realizm,
- jedna scena, jeden bohater albo jeden przedmiot, bez tłoku i bez kolaży,
- paleta chłodna z ciepłym akcentem: fiolet, granat i błękit jako podstawa,
  pomarańcz albo złoto jako źródło światła,
- tło rozmyte, bez ostrych krawędzi po brzegach, żeby kadr dobrze wyglądał
  po przycięciu do kwadratu i do pasa,
- ludzie różnorodni i w wieku uczestników programu, czyli 16 do 24 lat,
- bez marek, logotypów, twarzy konkretnych osób i bez czytelnych napisów.

## Czego nie rysować

**Ocen i wartościowania.** Obrazek bieguna „wolę pracować sam" nie może
wyglądać na smutny, a „wolę w grupie" na radosny. Obie strony każdej pary
muszą być tak samo atrakcyjne, bo inaczej obrazek wybiera za uczestnika
i psuje pomiar. To samo dotyczy warunków pracy w A5: hałas pokazujemy
rzeczowo, a nie jako kogoś cierpiącego.

Ta zasada jest twardsza niż wygląda. Pas nad dwiema kartami wyboru jest
dzielony na pół białą linią i obie połowy mają **dokładnie tę samą
szerokość i wysokość**, właśnie po to, żeby żadna strona nie dostała
przewagi. Jeśli jedna ilustracja będzie jaśniejsza, cieplejsza albo po
prostu ładniejsza od drugiej, przewagę odzyska obrazem.

`;

  const czesci = [
    sekcja(
      "A3 · Jak naturalnie działam, bieguny osi",
      [
        "**Najpilniejsze.** Panel wyboru z dwóch pokazuje jeden pas ilustracji dzielony",
        "na pół: lewa połowa należy do lewej odpowiedzi, prawa do prawej. Dziś A3 ma",
        "tylko obrazki całych osi, więc obie karty dzielą jedno zdjęcie i nie pomaga",
        "ono wybrać. Każdy biegun potrzebuje własnej sceny pokazującej **to samo",
        "zajęcie w dwóch stylach działania**, nie dwa różne zawody.",
        "\n\nKwadrat 1:1.",
      ].join(" "),
      zestawy.a3bieguny,
    ),
    sekcja(
      "M1 · Jakiego życia chcesz, bieguny wymiarów",
      [
        "To samo co w A3, tylko o życiu, a nie o pracy. Sceny z życia codziennego,",
        "nie z biura. Dwanaście par, żadna jeszcze nie ma obrazka, więc ten panel",
        "jest dziś bez ilustracji w ogóle.",
        "\n\nKwadrat 1:1.",
      ].join(" "),
      zestawy.m1,
    ),
    ...(brakuje(zestawy.a5warunki) === 0 ? [] : [sekcja(
      "A5 · Filtry rzeczywistości, siedem bloków",
      [
        "**Wariant zalecany.** Panel z trzema odpowiedziami ma nad pytaniem pas na",
        "całą szerokość i dziś jest pusty. Siedem obrazków blokowych obsłuży",
        "wszystkie czterdzieści trzy warunki: platforma bierze najpierw obrazek",
        "warunku, a gdy go nie ma, obrazek bloku.",
        "\n\nPas poziomy 16:9.",
      ].join(" "),
      zestawy.a5bloki,
    )]),
    sekcja(
      "Plansze obszarów, nagłówek karty zawodu",
      [
        "Karta zawodu ma w nagłówku zdjęcie dochodzące do prawej i górnej krawędzi,",
        "zszyte z tekstem maską gradientową. Bierze obrazek obszaru, do którego",
        "należy zawód. Dziś nie ma ani jednej planszy, więc kadr jest kwadratowy",
        "i rozciągany. Te same dwadzieścia cztery sceny co w A1, ale **kadrowane",
        "poziomo**, z miejscem po lewej, gdzie wchodzi biała maska.",
        "\n\nPas poziomy 16:9. Ważna rzecz po prawej stronie kadru.",
      ].join(" "),
      zestawy.planszeA1,
    ),
    sekcja(
      "A5 · Filtry rzeczywistości, czterdzieści trzy warunki",
      brakuje(zestawy.a5warunki) === 0
        ? [
            "Komplet. Każdy warunek ma własny pas nad trzema odpowiedziami,",
            "więc obrazki blokowe nie są już potrzebne. Spis dla porządku",
            "i do podmiany pojedynczych plików.",
          ].join(" ")
        : [
            "**Wariant pełny, zamiast siedmiu bloków albo po nich.** Czterdzieści trzy",
            "konkretne warunki. Każdy dosłany warunek nadpisuje obrazek swojego bloku,",
            "więc da się to robić partiami i nic się po drodze nie psuje.",
            "\n\nPas poziomy 16:9.",
          ].join(" "),
      zestawy.a5warunki,
    ),
    sekcja(
      "A1 · Co mnie ciągnie, dwadzieścia cztery obszary",
      "Komplet. Kafel przy wierszu w siatce rankingu. Spis dla porządku.",
      zestawy.a1,
    ),
    sekcja(
      "A2 · W czym mogę być dobry, trzydzieści kompetencji",
      "Komplet. Kafel przy wierszu w siatce rankingu. Spis dla porządku.",
      zestawy.a2,
    ),
    sekcja(
      "A3 · osie, trzynaście wymiarów",
      [
        "Komplet. Dopóki nie ma biegunów, ten obrazek stoi jako wspólny pas nad",
        "obiema kartami. Po dosłaniu biegunów przestaje być używany na ekranie",
        "wyboru, ale zostaje jako znak wymiaru w innych miejscach.",
      ].join(" "),
      zestawy.a3osie,
    ),
    sekcja(
      "A4 · Co jest dla mnie ważne, dwanaście wartości",
      [
        "Komplet. Tu obie strony pary to dwie różne wartości, więc jeden obrazek",
        "na wartość wystarcza i pas dzielony na pół działa od razu.",
      ].join(" "),
      zestawy.a4,
    ),
  ];

  const tresc = `${naglowek}${czesci.join("\n")}`;
  const plik = path.join(process.cwd(), "GRAFIKI_DO_WYGENEROWANIA.md");
  fs.writeFileSync(plik, tresc, "utf8");

  console.log(`zapisano ${path.basename(plik)}`);
  for (const [nazwa, pozycje] of Object.entries(zestawy)) {
    const brakuje = pozycje.filter((p) => !jest(p)).length;
    console.log(`  ${nazwa.padEnd(11)} ${String(pozycje.length).padStart(3)} · brakuje ${brakuje}`);
  }
  console.log(`minimum do zrobienia: ${brakujeMin}, z pełnym A5: ${brakujeMax}`);
}

main();
