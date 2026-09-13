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
  | "zagrozenie"
  | "harmonogram"
  | "hasla"
  | "tabela"
  | "wypunktowanie";

/**
 * Miejsce sekcji w karcie.
 *
 * Rodzaj mowi, jak sekcje narysowac; slot mowi, ktora to sekcja. Dwie rzeczy,
 * bo piec roznych sekcji rysuje sie tak samo (lista pogrubionych akapitow),
 * a strona uklada je w roznych miejscach i pod roznymi naglowkami.
 */
export type Slot =
  | "streszczenie"
  | "czym_jest"
  | "skala"
  | "dzien"
  | "rok"
  | "obciazenie"
  | "czas"
  | "twarde"
  | "narzedzia"
  | "miekkie"
  | "profil"
  | "kto"
  | "koszt"
  | "droga"
  | "pieniadze"
  | "miedzynarodowa"
  | "zagrozenie"
  | "czlowiek"
  | "mity"
  | "dalej"
  | "pokrewne";

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

export interface KrokHarmonogramu {
  kiedy: string;
  co: string;
}

export interface Punkt {
  etykieta: string;
  opis: string;
}

/** Wiersz tabeli dwukolumnowej: etykieta po lewej, treść po prawej. */
export interface WierszTabeli {
  etykieta: string;
  wartosc: string;
}

export type Blok = { slot: Slot | null } & PostacBloku;

export type PostacBloku =
  | { rodzaj: "markdown"; tytul: string; tresc: string }
  | { rodzaj: "harmonogram"; tytul: string; kroki: KrokHarmonogramu[] }
  | { rodzaj: "hasla"; tytul: string; hasla: string[] }
  | { rodzaj: "wypunktowanie"; tytul: string; punkty: Punkt[]; uwagi: string }
  | { rodzaj: "tabela"; tytul: string; wiersze: WierszTabeli[]; uwagi: string }
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
 * Znormalizowany przedrostek tytułu -> slot. Kolejność ma znaczenie: pierwszy
 * pasujący wygrywa, więc dłuższe przedrostki stoją przed krótszymi.
 */
const SLOTY: Array<[string, Slot]> = [
  ["w jednym zdaniu", "streszczenie"],
  ["czym ta praca", "czym_jest"],
  ["skala miedzynarodowa", "miedzynarodowa"],
  ["skala", "skala"],
  ["zwykly dzien", "dzien"],
  ["zwykly dyzur", "dzien"],
  ["zwykla zmiana", "dzien"],
  ["zwykly rok", "rok"],
  ["obciazenie", "obciazenie"],
  ["na co", "czas"],
  ["umiejetnosci twarde", "twarde"],
  ["narzedzia", "narzedzia"],
  ["umiejetnosci miekkie", "miekkie"],
  ["profil", "profil"],
  ["kto sie", "kto"],
  ["ile kosztuje", "koszt"],
  ["ile realnie kosztuje", "koszt"],
  ["droga", "droga"],
  ["pieniadze", "pieniadze"],
  ["czy zagrozony", "zagrozenie"],
  ["czy ten zawod", "zagrozenie"],
  ["co ten zawod robi", "czlowiek"],
  ["co robi z", "czlowiek"],
  ["trzy mity", "mity"],
  ["mity", "mity"],
  ["co dalej", "dalej"],
  ["zawody pokrewne", "pokrewne"],
  ["pokrewne", "pokrewne"],
];

/** Klucz z importu -> slot, gdy tytuł nie wystarczy. */
const SLOT_Z_KLUCZA: Record<string, Slot> = {
  streszczenie: "streszczenie",
  czym_jest: "czym_jest",
  kto_sie_nie_odnajdzie: "kto",
  koszt: "koszt",
  droga: "droga",
  pieniadze: "pieniadze",
  przyszlosc: "zagrozenie",
  profil: "profil",
};

/** Która to sekcja karty. Dopasowanie po przedrostku, nigdy po pełnym tytule. */
export function slotSekcji(tytul: string, klucz?: string | null): Slot | null {
  const t = bezOgonkow(tytul);
  // „Skala międzynarodowa" ma ten sam kształt co pieniądze, ale własne miejsce
  // w układzie: wrzucona do slotu pieniędzy przepadała, bo slot jest jeden.
  if (t.startsWith("skala miedzynarodowa")) return "miedzynarodowa";
  for (const [przedrostek, slot] of SLOTY) {
    if (t.startsWith(przedrostek)) return slot;
  }
  return klucz ? (SLOT_Z_KLUCZA[klucz] ?? null) : null;
}

/** Jak narysować sekcję stojącą w tym slocie. */
function postacSlotu(slot: Slot | null): RodzajBloku | "markdown" {
  switch (slot) {
    case "obciazenie":
      return "obciazenie";
    case "pieniadze":
    case "miedzynarodowa":
      return "pieniadze";
    case "droga":
      return "droga";
    case "profil":
    case "koszt":
      return "tabela";
    case "czas":
      return "czas";
    case "skala":
      return "skala";
    case "zagrozenie":
      return "zagrozenie";
    case "dzien":
      return "harmonogram";
    case "miekkie":
    case "dalej":
    case "pokrewne":
      return "hasla";
    case "twarde":
    case "narzedzia":
    case "kto":
    case "czlowiek":
    case "mity":
      return "wypunktowanie";
    default:
      return "markdown";
  }
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

/**
 * Tabela dwukolumnowa: etykieta i treść.
 *
 * Tak zapisany jest profil (dziewięćdziesiąt siedem kart) i koszt wejścia
 * (trzydzieści cztery). Trzecia kolumna, gdy jest, dokleja się do drugiej:
 * żadna z tych tabel nie ma trzech kolumn niosących osobne znaczenie.
 */
export function czytajTabeleDwukolumnowa(
  tresc: string,
): { wiersze: WierszTabeli[]; uwagi: string } | null {
  const t = tabela(tresc);
  if (!t) return null;
  const wiersze = t.wiersze
    .filter((w) => (w[0] ?? "").trim() && (w[1] ?? "").trim())
    .map((w) => ({
      etykieta: bezPogrubien(w[0]),
      wartosc: [bezPogrubien(w[1]), bezPogrubien(w[2] ?? "")].filter(Boolean).join(" · "),
    }));
  return wiersze.length >= 2 ? { wiersze, uwagi: pozaTabela(tresc) } : null;
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

/**
 * Zwykły dzień jako kolejne godziny.
 *
 * Siedemdziesiąt siedem kart ma tabelę „godzina / co się dzieje", pięćdziesiąt
 * jeden jedną linię z kropkami, w której każda pozycja zaczyna się od godziny.
 */
export function czytajHarmonogram(tresc: string): KrokHarmonogramu[] | null {
  const t = tabela(tresc);
  if (t) {
    const kroki = t.wiersze
      .filter((w) => (w[0] ?? "").trim() && (w[1] ?? "").trim())
      .map((w) => ({ kiedy: bezPogrubien(w[0]), co: bezPogrubien(w[1]) }));
    return kroki.length >= 3 ? kroki : null;
  }

  const kroki: KrokHarmonogramu[] = [];
  for (const czesc of nakropki(pierwszyAkapit(tresc))) {
    const dopasowanie = bezPogrubien(czesc).match(/^(\d{1,2}[:.]\d{2})\s+(.*)$/);
    if (!dopasowanie) continue;
    kroki.push({ kiedy: dopasowanie[1].replace(".", ":"), co: dopasowanie[2].trim() });
  }
  return kroki.length >= 3 ? kroki : null;
}

/**
 * Lista haseł rozdzielonych kropką środkową.
 *
 * Tak zapisane są umiejętności miękkie, zawody pokrewne i „co dalej z tego
 * zawodu". Każde hasło jest krótkie i samodzielne, więc nadaje się na pastylkę.
 */
export function czytajHasla(tresc: string): string[] | null {
  const akapit = pierwszyAkapit(tresc);
  if (!akapit.includes("·")) return null;
  const hasla = nakropki(akapit)
    .map((h) => bezPogrubien(h))
    .filter((h) => h.length > 1 && h.length < 120);
  return hasla.length >= 2 ? hasla : null;
}

/**
 * Akapity zaczynające się od pogrubionej etykiety.
 *
 * Tak zapisane są umiejętności twarde, narzędzia, trzy mity, „co ten zawód
 * robi z człowiekiem" i „kto się nie odnajdzie". Etykieta jest tezą, reszta
 * akapitu jej rozwinięciem, więc w druku to działa, a na ekranie zlewa się
 * w ścianę tekstu.
 */
export function czytajPunkty(tresc: string): { punkty: Punkt[]; uwagi: string } | null {
  const punkty: Punkt[] = [];
  const luzne: string[] = [];
  for (const akapit of tresc.trim().split(/\n\s*\n/)) {
    const dopasowanie = akapit.trim().match(/^\*\*(.+?)([.:]?)\*\*\s*([\s\S]*)$/);
    const etykieta = dopasowanie?.[1] ?? "";
    const domkniecie = dopasowanie?.[2] ?? "";
    const reszta = (dopasowanie?.[3] ?? "").trim();

    // Pogrubienie na początku akapitu bywa etykietą, a bywa zwykłym
    // wyróżnieniem w środku zdania („**Za to jest to zawód przewidywalny**,
    // z jasną granicą…"). Etykietę domyka kropka albo dwukropek, po niej idzie
    // nowe zdanie. Bez domknięcia decyduje długość: „**Narzędzie do mailingu**,
    // na przykład Mailchimp" to etykieta, a zdanie na pół akapitu nią nie jest.
    const KROTKA_ETYKIETA = 45;
    const etykietowe =
      Boolean(dopasowanie) &&
      etykieta.length < 90 &&
      (domkniecie !== "" ||
        reszta === "" ||
        /^[:.]/.test(reszta) ||
        /^[A-ZĄĆĘŁŃÓŚŹŻ]/.test(reszta) ||
        etykieta.length <= KROTKA_ETYKIETA);

    if (etykietowe) {
      punkty.push({
        etykieta: bezPogrubien(etykieta).replace(/[.:]$/, ""),
        // „**Portale urzędowe**: e-Deklaracje" zostawia dwukropek poza pogrubieniem.
        opis: reszta.replace(/^[:.]\s*/, ""),
      });
    } else if (akapit.trim()) {
      luzne.push(akapit.trim());
    }
  }
  return punkty.length >= 2 ? { punkty, uwagi: luzne.join("\n\n") } : null;
}

function zWielkiej(tekst: string): string {
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

// =====================================================================
// Karty skrócone: dane upchnięte w akapitach
// =====================================================================

/** Etykieta pogrubionego akapitu -> rodzaj bloku, który się z niego składa. */
const AKAPITY_Z_DANYMI: Array<{ etykieta: string; slot: Slot; tytul: string }> = [
  { etykieta: "Obciążenie", slot: "obciazenie", tytul: "Obciążenie" },
  { etykieta: "Na co idzie czas", slot: "czas", tytul: "Na co idzie czas" },
  { etykieta: "Pieniądze", slot: "pieniadze", tytul: "Pieniądze" },
  { etykieta: "Droga", slot: "droga", tytul: "Droga dojścia" },
  { etykieta: "Zwykły dzień", slot: "dzien", tytul: "Zwykły dzień" },
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

/** Zamienia jedną sekcję w postać strukturalną albo nic, gdy kształt się nie zgadza. */
function zlozBlok(
  rodzaj: RodzajBloku | "markdown" | null,
  tytul: string,
  tresc: string,
): PostacBloku | null {
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
  if (rodzaj === "harmonogram") {
    const kroki = czytajHarmonogram(tresc);
    if (kroki) return { rodzaj, tytul, kroki };
    // Połowa kart opisuje dzień listą czynności, bez godzin. To nie jest oś
    // czasu i nie wolno jej taką udawać, ale listą pozostaje.
    const hasla = czytajHasla(tresc);
    return hasla ? { rodzaj: "hasla", tytul, hasla } : null;
  }
  if (rodzaj === "hasla") {
    const hasla = czytajHasla(tresc);
    return hasla ? { rodzaj, tytul, hasla } : null;
  }
  if (rodzaj === "tabela") {
    const czytane = czytajTabeleDwukolumnowa(tresc);
    return czytane ? { rodzaj, tytul, wiersze: czytane.wiersze, uwagi: czytane.uwagi } : null;
  }
  if (rodzaj === "wypunktowanie") {
    const czytane = czytajPunkty(tresc);
    if (czytane) return { rodzaj, tytul, punkty: czytane.punkty, uwagi: czytane.uwagi };
    // Część kart zapisuje to samo jako listę haseł, a nie akapity z etykietą.
    const hasla = czytajHasla(tresc);
    return hasla ? { rodzaj: "hasla", tytul, hasla } : null;
  }
  return null;
}

/**
 * Cała karta jako lista bloków w kolejności z dokumentu.
 *
 * Każdy blok niesie dwie rzeczy: `rodzaj` mówi, jak go narysować, `slot` mówi,
 * która to sekcja karty. Strona układa bloki po slotach, a czego nie rozpozna,
 * zostawia markdownem w kolejności z dokumentu. Żadna karta nie może wyjść
 * pusta i nic z niej nie może przepaść.
 */
export function ulozKarte(sekcje: SekcjaKarty[]): Blok[] {
  const bloki: Blok[] = [];

  for (const s of sekcje) {
    const slot = slotSekcji(s.tytul, s.klucz);
    const rodzaj = postacSlotu(slot);
    let tresc = s.tresc;

    // Karty skrócone trzymają dane w pogrubionych akapitach. Wyjmujemy je
    // dopiero z sekcji, która sama nie jest tymi danymi.
    const dodatkowe: Blok[] = [];
    for (const wzor of AKAPITY_Z_DANYMI) {
      if (wzor.slot === slot) continue;
      const { reszta, wyjete } = wyjmijAkapit(tresc, wzor.etykieta);
      if (!wyjete) continue;
      const postac = zlozBlok(postacSlotu(wzor.slot), wzor.tytul, wyjete);
      if (postac) {
        dodatkowe.push({ ...postac, slot: wzor.slot });
        tresc = reszta;
      }
    }

    // Blok strukturalny niesie swoje uwagi sam, więc nic tu nie przepada.
    const postac = zlozBlok(rodzaj, s.tytul, tresc);
    bloki.push({ ...(postac ?? { rodzaj: "markdown", tytul: s.tytul, tresc }), slot });

    bloki.push(...dodatkowe);
  }

  return bloki;
}

/** Blok stojący w danym slocie karty. */
export function wSlocie(bloki: Blok[], slot: Slot): Blok | null {
  return bloki.find((b) => b.slot === slot) ?? null;
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
