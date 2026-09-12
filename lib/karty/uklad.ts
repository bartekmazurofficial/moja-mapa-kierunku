/**
 * Rozbiór karty zawodu na bloki, które da się pokazać, a nie tylko wydrukować.
 *
 * Karta ma dwadzieścia sekcji, z czego sześć to dane strukturalne zapisane w
 * markdownie: sześć wymiarów obciążenia, widełki płacowe, droga dojścia, na co
 * idzie czas, skala zawodu i zagrożenie w przyszłości. Puszczone przez
 * `marked` zamieniają się w jednolity tekst i wyglądają jak wszystko inne.
 *
 * Ten moduł jest czysty i nie wie nic o Reakcie: rozpoznaje rodzaj sekcji,
 * czyta z niej liczby i oddaje strukturę. Czego nie rozpozna, to zostaje
 * markdownem, dokładnie takim jak dotąd. Żadna karta nie może wyjść pusta.
 *
 * Dwie rzeczy, o które trzeba tu uważać:
 *   - tytuły sekcji nie są jednolite („Czy zagrożony" i „Czy ten zawód jest
 *     zagrożony w przyszłości" to ta sama sekcja), więc dopasowanie idzie po
 *     znormalizowanym przedrostku, nigdy po pełnym tytule,
 *   - trzydzieści jeden kart skróconych trzyma obciążenie, pieniądze i drogę
 *     jako pogrubione akapity wewnątrz sekcji „Skala", a nie jako sekcje.
 */

export type RodzajBloku =
  | "obciazenie"
  | "pieniadze"
  | "droga"
  | "czas"
  | "skala"
  | "zagrozenie";

export interface SekcjaKarty {
  tytul: string;
  klucz: string | null;
  tresc: string;
}

export interface WymiarObciazenia {
  wymiar: string;
  ocena: number;
  uzasadnienie?: string;
}

export interface WidelkiEtap {
  etap: string;
  kwota: string;
  uwaga?: string;
}

export interface KrokDrogi {
  etap: string;
  czas?: string;
  opis?: string;
}

export interface UdzialCzasu {
  nazwa: string;
  procent: number;
  opis?: string;
}

export interface LiczbaSkali {
  etykieta: string;
  wartosc: string;
}

export type Blok =
  | { rodzaj: "markdown"; tytul: string; tresc: string }
  | { rodzaj: "obciazenie"; tytul: string; wymiary: WymiarObciazenia[] }
  | { rodzaj: "pieniadze"; tytul: string; etapy: WidelkiEtap[]; uwagi: string }
  | { rodzaj: "droga"; tytul: string; kroki: KrokDrogi[]; uwagi: string }
  | { rodzaj: "czas"; tytul: string; udzialy: UdzialCzasu[] }
  | { rodzaj: "skala"; tytul: string; liczby: LiczbaSkali[]; uwagi: string }
  | { rodzaj: "zagrozenie"; tytul: string; werdykt: string; uwagi: string };

// =====================================================================
// Rozpoznanie sekcji
// =====================================================================

/** Bez ogonków i wielkich liter: tytuły w kartach różnią się jednym i drugim. */
function bezOgonkow(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Rodzaj sekcji po przedrostku tytułu. Dopasowanie po pełnym tytule zawiedzie:
 * „Skala" i „Skala zawodu", „Ile kosztuje wejście" i „Ile realnie kosztuje
 * wejście", „Droga dojścia" i „Droga dojścia, krok po kroku".
 */
export function rodzajSekcji(tytul: string, klucz?: string | null): RodzajBloku | null {
  const t = bezOgonkow(tytul);
  if (t.startsWith("obciazenie")) return "obciazenie";
  if (t.startsWith("pieniadze") || klucz === "pieniadze") return "pieniadze";
  if (t.startsWith("droga") || klucz === "droga") return "droga";
  if (t.startsWith("na co")) return "czas";
  if (t.startsWith("skala") && !t.includes("miedzynarodow")) return "skala";
  if (t.startsWith("czy zagrozony") || t.startsWith("czy ten zawod") || klucz === "przyszlosc") {
    return "zagrozenie";
  }
  return null;
}

// =====================================================================
// Tabela markdown
// =====================================================================

export interface Tabela {
  naglowki: string[];
  wiersze: string[][];
}

/** Pierwsza tabela w treści albo nic. Nagłówek bywa pusty („| | |"). */
export function tabela(tresc: string): Tabela | null {
  const linie = tresc.split("\n");
  const start = linie.findIndex((l) => l.trim().startsWith("|"));
  if (start === -1) return null;
  const rozdzielacz = linie[start + 1]?.trim() ?? "";
  if (!/^\|[\s:|-]+\|$/.test(rozdzielacz)) return null;

  const komorki = (linia: string) =>
    linia
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((k) => k.trim());

  const naglowki = komorki(linie[start]);
  const wiersze: string[][] = [];
  for (let i = start + 2; i < linie.length; i++) {
    const linia = linie[i].trim();
    if (!linia.startsWith("|")) break;
    wiersze.push(komorki(linia));
  }
  return wiersze.length > 0 ? { naglowki, wiersze } : null;
}

/** Co zostaje po tabeli: uwagi pod nią, które nie mogą przepaść. */
export function pozaTabela(tresc: string): string {
  const linie = tresc.split("\n");
  const start = linie.findIndex((l) => l.trim().startsWith("|"));
  if (start === -1) return tresc.trim();
  let koniec = start;
  while (koniec < linie.length && (linie[koniec].trim().startsWith("|") || linie[koniec].trim() === "")) {
    koniec++;
  }
  return [...linie.slice(0, start), ...linie.slice(koniec)].join("\n").trim();
}

/** Pierwszy akapit treści. Warianty prozą trzymają całość w jednej linii. */
function pierwszyAkapit(tresc: string): string {
  return tresc.trim().split(/\n\s*\n/)[0]?.trim() ?? "";
}

/** Reszta po pierwszym akapicie. */
function poPierwszymAkapicie(tresc: string): string {
  const czesci = tresc.trim().split(/\n\s*\n/);
  return czesci.slice(1).join("\n\n").trim();
}

/** Pozycje rozdzielone kropką środkową. Tak zapisane są wszystkie warianty prozą. */
function nakropki(akapit: string): string[] {
  return akapit
    .split("·")
    .map((c) => c.trim().replace(/\.$/, "").trim())
    .filter(Boolean);
}

/** Sam tekst: bez gwiazdek pogrubienia, bez podwójnych spacji. */
function bezPogrubien(tekst: string): string {
  return tekst.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

// =====================================================================
// Sześć czytników
// =====================================================================

const OCEN_NAJMNIEJ = 4;

/**
 * Sześć wymiarów obciążenia. Osiemdziesiąt siedem kart ma tabelę, czterdzieści
 * jeden jedną linię prozy, a trzydzieści jeden trzyma to samo jako pogrubiony
 * akapit w sekcji „Skala".
 */
export function czytajObciazenie(tresc: string): WymiarObciazenia[] | null {
  const t = tabela(tresc);
  if (t) {
    const wymiary: WymiarObciazenia[] = [];
    for (const w of t.wiersze) {
      const ocena = Number(bezPogrubien(w[1] ?? "").match(/\d/)?.[0]);
      if (!ocena || ocena < 1 || ocena > 5) continue;
      wymiary.push({
        wymiar: zWielkiej(bezPogrubien(w[0] ?? "")),
        ocena,
        uzasadnienie: bezPogrubien(w[2] ?? "") || undefined,
      });
    }
    return wymiary.length >= OCEN_NAJMNIEJ ? wymiary : null;
  }

  const wymiary: WymiarObciazenia[] = [];
  for (const czesc of nakropki(pierwszyAkapit(tresc))) {
    const dopasowanie = czesc.match(/^(.*?)\*\*(\d)\*\*\s*$/);
    if (!dopasowanie) continue;
    const ocena = Number(dopasowanie[2]);
    if (ocena < 1 || ocena > 5) continue;
    wymiary.push({ wymiar: zWielkiej(bezPogrubien(dopasowanie[1])), ocena });
  }
  return wymiary.length >= OCEN_NAJMNIEJ ? wymiary : null;
}

/** Widełki płacowe. Znacznik „○" zostaje: mówi, że to kwota do aktualizacji. */
export function czytajWidelki(tresc: string): { etapy: WidelkiEtap[]; uwagi: string } | null {
  const t = tabela(tresc);
  if (t) {
    const etapy = t.wiersze
      .filter((w) => (w[0] ?? "").trim() && (w[1] ?? "").trim())
      .map((w) => ({
        etap: bezPogrubien(w[0]),
        kwota: bezPogrubien(w[1]),
        uwaga: bezPogrubien(w[2] ?? "") || undefined,
      }));
    return etapy.length >= 2 ? { etapy, uwagi: pozaTabela(tresc) } : null;
  }

  const etapy: WidelkiEtap[] = [];
  for (const czesc of nakropki(pierwszyAkapit(tresc))) {
    const gdzie = czesc.indexOf("○");
    if (gdzie === -1) continue;
    const etap = bezPogrubien(czesc.slice(0, gdzie));
    const kwota = bezPogrubien(czesc.slice(gdzie));
    if (etap && kwota) etapy.push({ etap, kwota });
  }
  return etapy.length >= 2 ? { etapy, uwagi: poPierwszymAkapicie(tresc) } : null;
}

/** Droga dojścia jako kolejne kroki. Sześćdziesiąt dwie karty w tabeli, sześćdziesiąt pięć prozą. */
export function czytajDroge(tresc: string): { kroki: KrokDrogi[]; uwagi: string } | null {
  const t = tabela(tresc);
  if (t) {
    const kroki = t.wiersze
      .filter((w) => (w[0] ?? "").trim())
      .map((w) => ({
        etap: bezPogrubien(w[0]),
        czas: bezPogrubien(w[1] ?? "") || undefined,
        opis: bezPogrubien(w[2] ?? "") || undefined,
      }));
    return kroki.length >= 2 ? { kroki, uwagi: pozaTabela(tresc) } : null;
  }

  const kroki: KrokDrogi[] = [];
  for (const czesc of nakropki(pierwszyAkapit(tresc))) {
    // „Szkoła branżowa albo kurs, 1 do 3 lata": czas stoi po ostatnim przecinku.
    const dopasowanie = bezPogrubien(czesc).match(/^(.*),\s*([^,]*\d[^,]*(?:lat|lata|rok|roku|miesi)[^,]*)$/);
    if (dopasowanie) kroki.push({ etap: dopasowanie[1].trim(), czas: dopasowanie[2].trim() });
    else kroki.push({ etap: bezPogrubien(czesc) });
  }
  return kroki.length >= 2 ? { kroki, uwagi: poPierwszymAkapicie(tresc) } : null;
}

/** Na co idzie czas. Sekcja rzadka: ma ją dwadzieścia dziewięć kart ze stu pięćdziesięciu siedmiu. */
export function czytajCzas(tresc: string): UdzialCzasu[] | null {
  const t = tabela(tresc);
  if (t) {
    const udzialy: UdzialCzasu[] = [];
    for (const w of t.wiersze) {
      const procent = Number(bezPogrubien(w[1] ?? "").match(/(\d{1,3})\s*%/)?.[1]);
      if (!procent) continue;
      udzialy.push({
        nazwa: bezPogrubien(w[0]),
        procent,
        opis: bezPogrubien(w[2] ?? "") || undefined,
      });
    }
    return udzialy.length >= 3 ? udzialy : null;
  }

  const udzialy: UdzialCzasu[] = [];
  for (const czesc of nakropki(pierwszyAkapit(tresc))) {
    const dopasowanie = bezPogrubien(czesc).match(/^(.*?)(\d{1,3})\s*%$/);
    if (!dopasowanie) continue;
    udzialy.push({ nazwa: dopasowanie[1].trim(), procent: Number(dopasowanie[2]) });
  }
  return udzialy.length >= 3 ? udzialy : null;
}

/**
 * Skala zawodu. Wartości to zdania, nie liczby, i mają w sobie znacznik „≈".
 * Znacznika nie wolno usuwać: mówi, że to szacunek, a nie dane z rejestru.
 */
export function czytajSkale(tresc: string): { liczby: LiczbaSkali[]; uwagi: string } | null {
  const t = tabela(tresc);
  if (!t) return null;
  const liczby = t.wiersze
    .filter((w) => (w[0] ?? "").trim() && (w[1] ?? "").trim())
    .map((w) => ({ etykieta: bezPogrubien(w[0]), wartosc: bezPogrubien(w[1]) }));
  return liczby.length >= 3 ? { liczby, uwagi: pozaTabela(tresc) } : null;
}

/**
 * Zagrożenie: pogrubiony werdykt na początku, potem proza. Werdykt bywa całym
 * pierwszym akapitem, a bywa jednym zdaniem, po którym proza leci dalej w tym
 * samym akapicie. Ogon wraca na początek reszty, żeby nic nie przepadło.
 */
export function czytajZagrozenie(tresc: string): { werdykt: string; tresc: string } | null {
  const akapit = pierwszyAkapit(tresc);
  const dopasowanie = akapit.match(/^\*\*(.+?)\*\*/s);
  if (!dopasowanie) return null;
  const ogon = akapit.slice(dopasowanie[0].length).trim();
  return {
    werdykt: bezPogrubien(dopasowanie[1]),
    tresc: [ogon, poPierwszymAkapicie(tresc)].filter(Boolean).join("\n\n"),
  };
}

function zWielkiej(tekst: string): string {
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

// =====================================================================
// Karty skrócone: dane upchnięte w akapitach
// =====================================================================

/** Etykieta pogrubionego akapitu -> rodzaj bloku, który się z niego składa. */
const AKAPITY_Z_DANYMI: Array<{ etykieta: string; rodzaj: RodzajBloku; tytul: string }> = [
  { etykieta: "Obciążenie", rodzaj: "obciazenie", tytul: "Obciążenie" },
  { etykieta: "Na co idzie czas", rodzaj: "czas", tytul: "Na co idzie czas" },
  { etykieta: "Pieniądze", rodzaj: "pieniadze", tytul: "Pieniądze" },
  { etykieta: "Droga", rodzaj: "droga", tytul: "Droga dojścia" },
];

/**
 * Wyjmuje z treści akapit zaczynający się od „**Etykieta.**".
 * Zwraca treść bez tego akapitu i sam akapit bez etykiety.
 */
function wyjmijAkapit(tresc: string, etykieta: string): { reszta: string; wyjete: string | null } {
  const akapity = tresc.split(/\n\s*\n/);
  const i = akapity.findIndex((a) => a.trim().startsWith(`**${etykieta}.**`));
  if (i === -1) return { reszta: tresc, wyjete: null };
  const wyjete = akapity[i].trim().slice(`**${etykieta}.**`.length).trim();
  return { reszta: [...akapity.slice(0, i), ...akapity.slice(i + 1)].join("\n\n"), wyjete };
}

// =====================================================================
// Układ całej karty
// =====================================================================

/** Zamienia jedną sekcję w blok strukturalny albo w markdown, jak dotąd. */
function zlozBlok(rodzaj: RodzajBloku | null, tytul: string, tresc: string): Blok | null {
  if (rodzaj === "obciazenie") {
    const wymiary = czytajObciazenie(tresc);
    return wymiary ? { rodzaj, tytul, wymiary } : null;
  }
  if (rodzaj === "pieniadze") {
    const czytane = czytajWidelki(tresc);
    return czytane ? { rodzaj, tytul, etapy: czytane.etapy, uwagi: czytane.uwagi } : null;
  }
  if (rodzaj === "droga") {
    const czytane = czytajDroge(tresc);
    return czytane ? { rodzaj, tytul, kroki: czytane.kroki, uwagi: czytane.uwagi } : null;
  }
  if (rodzaj === "czas") {
    const udzialy = czytajCzas(tresc);
    return udzialy ? { rodzaj, tytul, udzialy } : null;
  }
  if (rodzaj === "skala") {
    const czytane = czytajSkale(tresc);
    return czytane ? { rodzaj, tytul, liczby: czytane.liczby, uwagi: czytane.uwagi } : null;
  }
  if (rodzaj === "zagrozenie") {
    const czytane = czytajZagrozenie(tresc);
    return czytane ? { rodzaj, tytul, werdykt: czytane.werdykt, uwagi: czytane.tresc } : null;
  }
  return null;
}

/**
 * Cała karta jako lista bloków w kolejności z dokumentu.
 *
 * Sekcja rozpoznana daje blok strukturalny, a to, co po niej zostało w
 * markdownie, idzie osobnym blokiem, żeby żadna uwaga nie przepadła. Sekcja
 * nierozpoznana zostaje markdownem, dokładnie jak dotąd.
 */
export function ulozKarte(sekcje: SekcjaKarty[]): Blok[] {
  const bloki: Blok[] = [];

  for (const s of sekcje) {
    const rodzaj = rodzajSekcji(s.tytul, s.klucz);
    let tresc = s.tresc;

    // Karty skrócone trzymają dane w pogrubionych akapitach. Wyjmujemy je
    // dopiero z sekcji, która sama nie jest tymi danymi.
    const dodatkowe: Blok[] = [];
    for (const wzor of AKAPITY_Z_DANYMI) {
      if (wzor.rodzaj === rodzaj) continue;
      const { reszta, wyjete } = wyjmijAkapit(tresc, wzor.etykieta);
      if (!wyjete) continue;
      const blok = zlozBlok(wzor.rodzaj, wzor.tytul, wyjete);
      if (blok) {
        dodatkowe.push(blok);
        tresc = reszta;
      }
    }

    // Blok strukturalny niesie swoje uwagi sam, więc nic tu nie przepada.
    const glowny = zlozBlok(rodzaj, s.tytul, tresc);
    bloki.push(glowny ?? { rodzaj: "markdown", tytul: s.tytul, tresc });

    bloki.push(...dodatkowe);
  }

  return bloki;
}

/** Pierwszy blok danego rodzaju albo nic. Do porównania dwóch kart pole po polu. */
export function znajdzBlok<R extends Blok["rodzaj"]>(
  bloki: Blok[],
  rodzaj: R,
): Extract<Blok, { rodzaj: R }> | null {
  return (bloki.find((b) => b.rodzaj === rodzaj) as Extract<Blok, { rodzaj: R }>) ?? null;
}

/** Sekcja po kluczu nadanym przy imporcie. Tytuły mają warianty, klucze nie. */
export function znajdzSekcje(sekcje: SekcjaKarty[], klucz: string): SekcjaKarty | null {
  return sekcje.find((s) => s.klucz === klucz) ?? null;
}
