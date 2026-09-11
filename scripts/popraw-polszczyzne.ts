/**
 * Przywrócenie polskiej ortografii w bazach referencyjnych.
 *
 * To nie jest zmiana treści, tylko znaków. Skrypt rusza **wyłącznie pola
 * wyświetlane** uczestnikowi albo prowadzącemu. Kody, identyfikatory, klucze
 * i wartości słownikowe (`poziom`, `trudnosc`, `typ`, `flaga`, `zagr`) oraz
 * listy kodów (`a1`, `a2r`, `bezposrednie`, `posrednie`, `zawody`, `sklad`)
 * zostają nietknięte — od nich zależą powiązania między bazami.
 *
 * Skrypt jest idempotentny: drugie uruchomienie nic nie zmienia.
 * Uzycie: npx tsx scripts/popraw-polszczyzne.ts [--sprawdz]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const KATALOG = join(process.cwd(), "program-doradztwa/03_dane");

/** Pola wyswietlane, per plik. Nic poza nimi nie jest dotykane. */
const POLA_JSON = {
  zawody: ["nazwa"],
  kierunki: ["nazwa", "robi", "nie_daje"],
  drogi: ["nazwa", "czas", "koszt", "wymagania"],
  klastry: ["nazwa", "pytanie", "roznica", "uwaga"],
} as const;

/** Kolumny wyswietlane w plikach CSV, liczone od zera. */
const KOLUMNY_CSV: Record<string, number[]> = {
  "zawody_baza.csv": [1],
  "kierunki_baza.csv": [1, 12, 13],
  "drogi_bez_studiow.csv": [1, 3, 4, 6],
  "klastry.csv": [1, 3, 4, 5],
};

/**
 * Reguły ogólne: całe słowa, wszędzie w polach wyświetlanych.
 *
 * Granica słowa `\b` w JavaScripcie nie zna polskich liter: dla „zleceń"
 * uznaje, że słowo kończy się przed „ń", i podmienia jego początek.
 * Stąd własna granica, która traktuje ą, ć, ę, ł, ń, ó, ś, ź, ż jak litery.
 */
const LITERY = "A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż";
function slowo(tekst: string): RegExp {
  return new RegExp(`(?<![${LITERY}])${tekst}(?![${LITERY}])`, "g");
}

const SLOWA: Array<[RegExp, string]> = [
  [slowo("zl"), "zł"],
  [slowo("sluchu"), "słuchu"],
  [slowo("obslugi"), "obsługi"],
  [slowo("uslugowej"), "usługowej"],
  [slowo("sygnaly"), "sygnały"],
  [slowo("muzykow"), "muzyków"],
  [slowo("etatow"), "etatów"],
  [slowo("systemow"), "systemów"],
  [slowo("dzialow"), "działów"],
  [slowo("zlece"), "zleceń"],
];

/**
 * Poprawki punktowe: fragment zdania, nie pojedyncze słowo.
 * Kontekst jest częścią reguły, bo `plac` to raz plac, raz płac, a `prace`
 * raz prace, raz pracę.
 */
const FRAZY: Array<[string, string]> = [
  // kierunki, „co się tam robi"
  ["ekonomia globalna, jezyki", "ekonomia globalna, języki"],
  ["Dużo teorii przed praktyka", "Dużo teorii przed praktyką"],
  ["technologia robot", "technologia robót"],
  ["Jezyk, literatura", "Język, literatura"],
  ["mniej praktycznego jezyka", "mniej praktycznego języka"],
  ["przy rzadszym jezyku", "przy rzadszym języku"],
  ["gra zespolowa", "gra zespołowa"],
  ["praca przed kamera", "praca przed kamerą"],
  // kierunki, „czego nie daje"
  ["Znajomości jezyka", "Znajomości języka"],
  ["Znajomość jezyka", "Znajomość języka"],
  ["Praktycznego jezyka", "Praktycznego języka"],
  ["bez własnej pracy poza uczelnia", "bez własnej pracy poza uczelnią"],
  ["nastawiony na administrację publiczna", "nastawiony na administrację publiczną"],
  ["Pierwsza prace zdobywa się", "Pierwszą pracę zdobywa się"],
  ["presję sprzedażowa", "presję sprzedażową"],
  ["która jest główna przyczyną", "która jest główną przyczyną"],
  ["Granicy z medycyna estetyczna", "Granicy z medycyną estetyczną"],
  // klastry, pytanie rozstrzygające
  ["Wolisz stała pensję z prowizja", "Wolisz stałą pensję z prowizją"],
  ["nadawać dokumentom moc prawna", "nadawać dokumentom moc prawną"],
  ["uczyć przedmiotu cała klasę", "uczyć przedmiotu całą klasę"],
  ["usługę, która wykonujesz z ekipa", "usługę, którą wykonujesz z ekipą"],
  ["Prad czy woda?", "Prąd czy woda?"],
  // klastry, opis różnicy
  ["podstawę i samochod", "podstawę i samochód"],
  ["musi im mówić, ze nie ma", "musi im mówić, że nie ma"],
  ["prowadzi własna praktykę", "prowadzi własną praktykę"],
  ["ma stała pensję", "ma stałą pensję"],
  ["prowadzi własna kancelarię", "prowadzi własną kancelarię"],
  ["Ratownik gorski", "Ratownik górski"],
  ["łączy to z inna praca", "łączy to z inną pracą"],
  ["który rosnie najszybciej", "który rośnie najszybciej"],
  ["w kontakcie z kanalizacja", "w kontakcie z kanalizacją"],
  ["spędza jedna czwarta czasu", "spędza jedną czwartą czasu"],
  ["często z prowizja", "często z prowizją"],
  ["zarządza własna flota", "zarządza własną flotą"],
  ["także za granica", "także za granicą"],
  ["prowadzi 30-osobowa grupe", "prowadzi 30-osobową grupę"],
  ["pracuje z forma i marka", "pracuje z formą i marką"],
  ["niższe koszty stale", "niższe koszty stałe"],
  ["można ja zacząć malutko", "można ją zacząć malutko"],
  ["nie osiaga trwalej rentowności", "nie osiąga trwałej rentowności"],
  // klastry, uwaga
  ["ma realna możliwość terapii", "ma realną możliwość terapii"],
  // klastry, uwaga
  ["Traktuj jako pierwsza prace", "Traktuj jako pierwszą pracę"],
  ["Matematyka jest tu twarda bariera", "Matematyka jest tu twardą barierą"],
  ["analityk danych jest realna droga", "analityk danych jest realną drogą"],
  ["utrzymywanej przez cała karierę", "utrzymywanej przez całą karierę"],
  ["jest najlepsza droga dla kogos", "jest najlepszą drogą dla kogoś"],
  ["przemysłowy płaca najlepiej", "przemysłowy płacą najlepiej"],
  ["Praca za granica w opiece", "Praca za granicą w opiece"],
  ["Alergie kontaktowe są częsta przyczyną", "Alergie kontaktowe są częstą przyczyną"],
  // drogi bez studiów, nazwa i wymagania
  ["Kursy ratownictwa gorskiego", "Kursy ratownictwa górskiego"],
  ["Certyfikat jezykowy", "Certyfikat językowy"],
  ["daje narzędzia, często samochod", "daje narzędzia, często samochód"],
  ["Jezyk obcy podnosi stawkę", "Język obcy podnosi stawkę"],
  ["Podstawy techniczne plus jezyk", "Podstawy techniczne plus język"],
  ["Decyduje poziom jezyka", "Decyduje poziom języka"],
  ["Krótki wyjazd przed decyzja", "Krótki wyjazd przed decyzją"],
  // wspólne dla klastrów i dróg bez studiów
  ["Przedsiębiorczość jest nadbudowa nad kompetencja", "Przedsiębiorczość jest nadbudową nad kompetencją"],
];

function popraw(tekst: string): string {
  let wynik = tekst;
  for (const [szukaj, zamien] of FRAZY) wynik = wynik.split(szukaj).join(zamien);
  for (const [wzorzec, zamien] of SLOWA) wynik = wynik.replace(wzorzec, zamien);
  return wynik;
}

let zmian = 0;
const przyklady: string[] = [];

function poprawPole(gdzie: string, wartosc: unknown): unknown {
  if (typeof wartosc !== "string") return wartosc;
  const nowa = popraw(wartosc);
  if (nowa !== wartosc) {
    zmian++;
    if (przyklady.length < 8) przyklady.push(`${gdzie}: ${wartosc.slice(0, 70)}`);
  }
  return nowa;
}

function poprawRekordy(
  rekordy: Record<string, Record<string, unknown>>,
  pola: readonly string[],
  etykieta: string,
) {
  for (const [kod, rekord] of Object.entries(rekordy)) {
    for (const pole of pola) {
      if (pole in rekord) rekord[pole] = poprawPole(`${etykieta}.${kod}.${pole}`, rekord[pole]);
    }
  }
}

function wczytaj<T>(plik: string): T {
  return JSON.parse(readFileSync(join(KATALOG, plik), "utf8")) as T;
}

function zapisz(plik: string, dane: unknown, sprawdz: boolean) {
  if (sprawdz) return;
  writeFileSync(join(KATALOG, plik), JSON.stringify(dane, null, 2) + "\n", "utf8");
}

function poprawCsv(plik: string, sprawdz: boolean) {
  const kolumny = KOLUMNY_CSV[plik];
  const wiersze = readFileSync(join(KATALOG, plik), "utf8").split("\n");
  const wynik = wiersze.map((wiersz, i) => {
    if (i === 0 || wiersz.trim() === "") return wiersz;
    const pola = wiersz.split(";");
    for (const k of kolumny) if (pola[k] !== undefined) pola[k] = poprawPole(`${plik}:${i + 1}`, pola[k]) as string;
    return pola.join(";");
  });
  if (!sprawdz) writeFileSync(join(KATALOG, plik), wynik.join("\n"), "utf8");
}

function main() {
  const sprawdz = process.argv.includes("--sprawdz");

  const zawody = wczytaj<Record<string, Record<string, unknown>>>("zawody_baza.json");
  poprawRekordy(zawody, POLA_JSON.zawody, "zawod");
  zapisz("zawody_baza.json", zawody, sprawdz);

  const kierunki = wczytaj<{
    kierunki: Record<string, Record<string, unknown>>;
    drogi_bez_studiow: Record<string, Record<string, unknown>>;
  }>("kierunki_baza.json");
  poprawRekordy(kierunki.kierunki, POLA_JSON.kierunki, "kierunek");
  poprawRekordy(kierunki.drogi_bez_studiow, POLA_JSON.drogi, "droga");
  zapisz("kierunki_baza.json", kierunki, sprawdz);

  const klastry = wczytaj<Record<string, Record<string, unknown>>>("klastry.json");
  poprawRekordy(klastry, POLA_JSON.klastry, "klaster");
  zapisz("klastry.json", klastry, sprawdz);

  for (const plik of Object.keys(KOLUMNY_CSV)) poprawCsv(plik, sprawdz);

  console.log(`${sprawdz ? "do poprawy" : "poprawiono"}: ${zmian} pól`);
  for (const p of przyklady) console.log(`  ${p}`);
  if (sprawdz && zmian > 0) process.exitCode = 1;
}

main();
