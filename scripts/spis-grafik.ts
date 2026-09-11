/**
 * Generuje spis grafik do dosłania: klucz, plik, format i kategoria,
 * którą obraz ma ilustrować. Klucze są te same, których używa aplikacja,
 * więc podmiana rysowanego glifu na plik jest jednoznaczna.
 *
 * Uzycie: npx tsx scripts/spis-grafik.ts > GRAFIKI-KATEGORIE.md
 */

import { OBSZARY_A1, KOMPETENCJE_A2, WYMIARY_A3, WARTOSCI_A4, FILTRY_A5 } from "../lib/domain/slowniki";
import { OBSZARY_M1 } from "../lib/content/m1";

const linie: string[] = [];
const w = (s = "") => linie.push(s);

w("# Spis grafik kategorii");
w();
w("Klucze są te same, których używa aplikacja. Każdy plik zastępuje jeden");
w("rysowany dziś znak. Kolumna **ilustruje** mówi, jaką treść obraz ma nieść:");
w("nie jak ma wyglądać, tylko co ma znaczyć.");
w();
w("## Format");
w();
w("**Tak jak dwadzieścia cztery obrazy A1, które już są w aplikacji.** To jest");
w("wzorzec, do którego dopasowujemy resztę, żeby moduły nie wyglądały jak");
w("złożone z dwóch różnych produktów:");
w();
w("- **PNG, kwadrat, 1254 × 1254 px** (albo więcej, byle kwadrat)");
w("- **z tłem**, nie do wycięcia: tło jest częścią obrazu");
w("- malarska, ciepłe światło na fiolecie, jedna scena z człowiekiem przy pracy");
w("- czytelna po zmniejszeniu do kwadratu **64 px**: jedna postać, jedno światło,");
w("  żadnych drobnych detali niosących sens");
w("- bez napisów, które trzeba przeczytać, żeby zrozumieć obraz");
w();
w("Nazwa pliku = klucz. Na przykład `a1-7.png`, `a2-13.png`.");
w();
w("Aplikacja sama przelicza oryginały na dwie wersje (256 px na kafel,");
w("768 px na nagłówek): `npx tsx scripts/grafiki.ts <katalog> <moduł>`.");
w("Do repozytorium trafiają tylko przeliczone, bo oryginał waży 2 MB.");
w();

function sekcja(tytul: string, wstep: string, wiersze: Array<[string, string, string]>) {
  w(`---`);
  w();
  w(`## ${tytul}`);
  w();
  w(wstep);
  w();
  w("| Klucz | Plik | Ilustruje |");
  w("|---|---|---|");
  for (const [klucz, plik, opis] of wiersze) w(`| \`${klucz}\` | \`${plik}\` | ${opis} |`);
  w();
}

sekcja(
  "A1 · 24 obszary zainteresowań · DOSTARCZONE, są w aplikacji",
  "Komplet jest wgrany i widać go przy każdej z 144 pozycji modułu „Co mnie ciągnie” " +
    "oraz na planszy wyników. Zostawiam tabelę jako opis tego, co który plik znaczy.",
  OBSZARY_A1.map((o) => [`a1-${o.id}`, `a1-${o.id}.png`, o.etykieta] as [string, string, string]),
);

sekcja(
  "A2 · 30 kompetencji",
  "Pokazywane przy 180 pozycjach modułu „W czym mogę być dobry” i na planszy wyników.",
  KOMPETENCJE_A2.map((k) => [`a2-${k.id}`, `a2-${k.id}.png`, k.nazwa] as [string, string, string]),
);

sekcja(
  "A3 · 13 osi stylu działania",
  "Oś ma dwa bieguny, ale grafika jest jedna na oś: ilustruje wymiar, nie stronę. " +
    "Pokazywana na planszy wyników przy odpowiedzi uczestnika.",
  WYMIARY_A3.map((x) => [
    `a3-${x.kod}`,
    `a3-${x.kod}.png`,
    `oś: ${x.biegunA} ↔ ${x.biegunB}`,
  ] as [string, string, string]),
);

sekcja(
  "A4 · 12 wartości",
  "Pokazywane przy wyborze wartości nieodzownych i na planszy wyników.",
  WARTOSCI_A4.map((x) => [`a4-${x.kod}`, `a4-${x.kod}.png`, x.nazwa] as [string, string, string]),
);

sekcja(
  "A5 · 7 grup warunków pracy",
  "Jedna grafika na grupę, nie na pozycję: 43 pozycje dzielą się na siedem bloków tematycznych.",
  [...new Set(FILTRY_A5.map((f) => f.blok))].map((b) => {
    const blok = FILTRY_A5.find((f) => f.blok === b)!;
    const ile = FILTRY_A5.filter((f) => f.blok === b).length;
    return [`a5-${b}`, `a5-${b}.png`, `${blok.nazwaBloku} (${ile} warunków)`] as [string, string, string];
  }),
);

sekcja(
  "M1 · 7 obszarów wizji życia",
  "Pokazywane przy każdym z siedmiu pytań otwartych i na planszy wyników.",
  OBSZARY_M1.map((o) => [`m1-${o.nr}`, `m1-${o.nr}.png`, o.tytul] as [string, string, string]),
);

sekcja(
  "A0 · 6 grup metryczki",
  "Moduł startowy. Nie ma kategorii wynikowych, więc grupujemy po tym, o co pytamy.",
  [
    ["a0-etap", "a0-etap.png", "etap nauki: szkoła, matura, studia, praca"],
    ["a0-przedmioty", "a0-przedmioty.png", "przedmioty mocne i trudne"],
    ["a0-doswiadczenie", "a0-doswiadczenie.png", "co uczestnik już robił: praca, wolontariat, projekty"],
    ["a0-miejsce", "a0-miejsce.png", "miejsce zamieszkania i gotowość do przeprowadzki"],
    ["a0-zasoby", "a0-zasoby.png", "możliwość opłacenia kursów i sprzętu"],
    ["a0-zdrowie", "a0-zdrowie.png", "ograniczenia zdrowotne, pytanie dobrowolne"],
  ],
);

const suma =
  OBSZARY_A1.length +
  KOMPETENCJE_A2.length +
  WYMIARY_A3.length +
  WARTOSCI_A4.length +
  new Set(FILTRY_A5.map((f) => f.blok)).size +
  OBSZARY_M1.length +
  6;

w("---");
w();
w(`## Razem: ${suma} grafik`);
w();
w("Bez tej optymalizacji trzeba by ich było **ponad czterysta**: tyle jest");
w("pojedynczych pozycji we wszystkich modułach. Ilustrujemy kategorie, więc");
w("jedna grafika pracuje średnio na sześciu ekranach, a w jednym zestawie");
w("cztery pozycje pochodzą z czterech różnych kategorii, więc żadne dwa kafle");
w("obok siebie nie są takie same.");
w();
w("A1 jest już zrobione: dwadzieścia cztery obrazy siedzą w aplikacji.");
w("Następne w kolejności zysku to **A2, trzydzieści kompetencji**: to drugi");
w("najdłuższy moduł, 180 pozycji, i jedyny, który dalej wygląda na rysowany.");

console.log(linie.join("\n"));
