/**
 * RAPORT KONCOWY: to, czego nie ma w zadnej pojedynczej sekcji.
 *
 * Raport warstwowy pokazywal kazdy modul osobno, bo odslanial sie po kolei.
 * Raport koncowy uczestnik dostaje w calosci i czyta raz, wiec potrzebuje
 * rzeczy, ktore powstaja dopiero ze zlozenia modulow:
 *
 *   - szesc kafli z calego programu, czytelnych z dwoch metrow,
 *   - druga strona warunku srodowiskowego, czyli praca, ktora go lamie,
 *   - warunek, ktorego uczestnik jeszcze o sobie nie sprawdzil,
 *   - zdanie napisane dwa razy, w dwoch modulach, o ktore nikt nie pytal,
 *   - zgoda na warunki, na ktore wiekszosc ludzi sie nie godzi,
 *   - sciezki pogrupowane progiem wejscia, a nie kolejnoscia dopasowania.
 *
 * Zadna z tych rzeczy nie pokazuje liczby dopasowania i zadna nie porownuje
 * uczestnika z kimkolwiek.
 */

import { KOMPETENCJE_A2, OBSZARY_A1, WYMIARY_A3, WYMIARY_M1 } from "../domain/slowniki";
import {
  DOWOD_A3,
  KAFEL_A1,
  KAFEL_A3,
  KAFEL_A4,
  KAFEL_M1,
  TEKSTY_KONCOWE,
  TRUDNE_A5,
} from "../content/koncowy";
import { ATUTY_TRESC, trescNapiecia, trescOsi, WARUNKI_TRESC } from "./biblioteki";
import { MACIERZ_WSPARCIA } from "../content/a2";
import { zbudujSciezki, type WynikSciezek } from "./sciezki";
import type { policzA1, policzA2, policzA3, policzA4, policzA5, policzM1 } from "../engine/moduly";
import type { uruchomSilnik } from "../engine";
import type { BazaReferencyjna } from "../domain/typy";

export interface KafelKoncowy {
  /** Zdanie w drugiej osobie, najwyzej szesc slow. */
  tekst: string;
  /** Z ktorego modulu to wyszlo. Podpis pod kaflem, nie kod. */
  zrodlo: string;
}

export interface WarunekPracy {
  potrzebujesz: string;
  nieDlaCiebie: string;
}

/** Kompetencja mocna tam, gdzie uczestnika nie ciagnie. Sekcja trzecia. */
export interface UkrytyAtut {
  nazwa: string;
  dlaczego: string;
}

export interface SekcjeKoncowe {
  kafle: KafelKoncowy[];
  ukryteAtuty: UkrytyAtut[];
  warunki: WarunekPracy[];
  przezyjeszBez: string[];
  doSprawdzenia: { warunek: string; zdanie: string } | null;
  napiecie: { tytul: string; tresc: string } | null;
  przewaga: { pozycje: string[]; komunikat: string } | null;
  /**
   * Wszystko, na co uczestnik sie zgodzil, w krotkim brzmieniu.
   *
   * Pelny tekst warunku („Studia trwajace piec lat albo dluzej") jest pisany
   * do ekranu z pytaniem, gdzie stoi sam w wierszu. W raporcie te same rzeczy
   * stoja obok siebie jako plakietki i musza byc krotkie, inaczej kolumna
   * robi sie z nich na pol ekranu wysoka.
   */
  zgody: string[];
  powtorzone: { tresc: string; komunikat: string } | null;
  /**
   * Sekcja osma. Liczy ja `lib/raport/sciezki.ts`, bo trzyma wlasne reguly:
   * zawsze osiem, wymuszona roznorodnosc, kazda z wariantem bez studiow.
   */
  sciezki: WynikSciezek | null;
}

type WynikA1 = ReturnType<typeof policzA1>;
type WynikA2 = ReturnType<typeof policzA2>;
type WynikA3 = ReturnType<typeof policzA3>;
type WynikA4 = ReturnType<typeof policzA4>;
type WynikA5 = ReturnType<typeof policzA5>;
type WynikM1 = ReturnType<typeof policzM1>;
type WynikSilnika = ReturnType<typeof uruchomSilnik>;

/**
 * Slowa, ktore w dwoch zdaniach o niczym nie swiadcza.
 *
 * Bez tej listy „nie chcialbym pracy, w ktorej" pokrywa sie z kazdym innym
 * zdaniem zaczynajacym sie tak samo, a to jest poczatek pytania, nie
 * odpowiedz uczestnika.
 */
const PUSTE_SLOWA = new Set([
  "nie", "chcialbym", "chciałbym", "chce", "chcę", "pracy", "praca", "ktorej", "której",
  "ktorym", "którym", "zeby", "żeby", "moja", "moje", "musialbym", "musiałbym",
  "bylo", "było", "jest", "byc", "być", "sie", "się", "tego", "takiej", "takich",
  "wymagala", "wymagała", "zgodzilbym", "zgodziłbym", "odemnie", "ode",
]);

function slowaZnaczace(tekst: string): string[] {
  return tekst
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter((s) => s.length >= 4 && !PUSTE_SLOWA.has(s));
}

/**
 * Zdanie powtorzone w dwoch modulach, o ktore nie pytalismy dwa razy.
 *
 * M1 pyta „czego nie chce" w czesci opisowej, A5 pyta o to samo na koncu
 * innego modulu, kilka dni pozniej i w innym kontekscie. Kiedy uczestnik
 * napisze tam to samo, jest to mocniejsza granica niz cokolwiek, co wyszlo
 * z liczenia: nikt mu tego nie podpowiedzial i nie odhaczyl z listy.
 *
 * Prog trzech znaczacych slow wspolnych jest dobrany tak, zeby nie lapac
 * samego poczatku zdania: koncowki pytan sa w obu modulach podobne.
 */
function znajdzPowtorzone(m1: WynikM1, a5: WynikA5): SekcjeKoncowe["powtorzone"] {
  const zM1 = Array.isArray(m1.czescB[6]) ? (m1.czescB[6] as string[]) : [];
  const zdaniaM1 = zM1.map((x) => (x ?? "").trim()).filter((x) => x.length > 0);
  const zdaniaA5 = a5.zdania.map((x) => (x ?? "").trim()).filter((x) => x.length > 0);

  for (const m of zdaniaM1) {
    const slowaM = new Set(slowaZnaczace(m));
    for (const a of zdaniaA5) {
      const wspolne = slowaZnaczace(a).filter((s) => slowaM.has(s));
      if (new Set(wspolne).size < 3) continue;
      return {
        tresc: m.length <= a.length ? m : a,
        komunikat:
          "To zdanie napisałeś dwa razy, w dwóch różnych momentach programu, nie pytany o to samo. " +
          "To najmocniejsza granica w całym Twoim raporcie, mocniejsza niż wszystko, co wyszło z liczenia.",
      };
    }
  }
  return null;
}

/**
 * Szesc kafli z calego programu.
 *
 * Kolejnosc zrodel jest kolejnoscia pewnosci, a nie waznosci: dwa
 * najmocniejsze zainteresowania, najmocniejsza kompetencja, dwa warunki
 * stylu dzialania i wartosc, ktora wygrywala najczesciej. Kazdy kafel
 * pochodzi z innego pytania, wiec szesc kafli to szesc niezaleznych
 * pomiarow, a nie jeden powtorzony szesc razy.
 */
function zbudujKafle(a1: WynikA1, a2: WynikA2, a3: WynikA3, a4: WynikA4, m1: WynikM1): KafelKoncowy[] {
  const kafle: KafelKoncowy[] = [];

  const najA1 = [...OBSZARY_A1].sort((x, y) => a1.z[y.id] - a1.z[x.id] || x.id - y.id).slice(0, 2);
  for (const o of najA1) {
    const tekst = KAFEL_A1[o.id];
    if (tekst) kafle.push({ tekst, zrodlo: "co Cię ciągnie" });
  }

  const najA2 = [...KOMPETENCJE_A2].sort((x, y) => a2.k[y.id] - a2.k[x.id] || x.id - y.id)[0];
  if (najA2) kafle.push({ tekst: najA2.nazwa, zrodlo: "co Ci wychodzi" });

  for (const w of a3.warunkiKluczowe.slice(0, 2)) {
    const para = KAFEL_A3[w.wymiar];
    if (para) kafle.push({ tekst: para[w.biegun === "A" ? 0 : 1], zrodlo: "jak działasz" });
  }

  // Ksztalt zycia wchodzi tylko wtedy, gdy uczestnik wskazal wyraznie: przy
  // wyniku posrodku kafel mowilby cos, czego uczestnik nie powiedzial.
  for (const wym of WYMIARY_M1) {
    const s = m1.shape[wym.kod];
    if (s === null || s === undefined) continue;
    if (s < 75 && s > 25) continue;
    const para = KAFEL_M1[wym.kod];
    if (para) {
      kafle.push({ tekst: para[s >= 75 ? 0 : 1], zrodlo: "jakiego życia chcesz" });
      break;
    }
  }

  const najwazniejsza = a4.progowe[0] ?? a4.top3[0];
  if (najwazniejsza && KAFEL_A4[najwazniejsza]) {
    kafle.push({ tekst: KAFEL_A4[najwazniejsza], zrodlo: "co jest dla Ciebie ważne" });
  }

  // Szesc kafli, nie wiecej. Gdy ktoregos zrodla brakuje, dosypujemy kolejnymi
  // zainteresowaniami: to jedyne zrodlo, ktore ma zawsze komplet pozycji.
  const uzyte = new Set(kafle.map((k) => k.tekst));
  for (const o of [...OBSZARY_A1].sort((x, y) => a1.z[y.id] - a1.z[x.id] || x.id - y.id)) {
    if (kafle.length >= 6) break;
    const tekst = KAFEL_A1[o.id];
    if (!tekst || uzyte.has(tekst)) continue;
    uzyte.add(tekst);
    kafle.push({ tekst, zrodlo: "co Cię ciągnie" });
  }

  return kafle.slice(0, 6);
}

/**
 * Kompetencje mocne w obszarach, do ktorych uczestnika nie ciagnie.
 *
 * To jest najciekawsza czesc calego raportu i jedyna, ktorej uczestnik nie
 * znalazlby sam: nikt nie szuka swoich mocnych stron tam, gdzie nie lubi
 * zagladac. Liczymy to z macierzy wsparcia A1 do A2: kompetencja wysoka
 * w A2, ktorej uzywaja obszary siedzace u uczestnika nisko w A1.
 *
 * Prog 60 na kompetencji jest ten sam co w cwiartkach modulu A2, zeby dwa
 * miejsca w raporcie nie nazywaly „mocnym" dwoch roznych rzeczy.
 */
function zbudujUkryteAtuty(a1: WynikA1, a2: WynikA2): UkrytyAtut[] {
  // Dla kazdej kompetencji: jak mocno ciagnie uczestnika do obszarow, ktore
  // jej uzywaja. Srednia wazona po wadze kompetencji w obszarze.
  const ciagnienie = new Map<number, { suma: number; wagi: number }>();
  for (const [obszar, wagi] of Object.entries(MACIERZ_WSPARCIA)) {
    const z = a1.z[Number(obszar)] ?? 50;
    for (const [id, waga] of Object.entries(wagi)) {
      const biezace = ciagnienie.get(Number(id)) ?? { suma: 0, wagi: 0 };
      biezace.suma += waga * z;
      biezace.wagi += waga;
      ciagnienie.set(Number(id), biezace);
    }
  }

  return KOMPETENCJE_A2.filter((k) => (a2.k[k.id] ?? 0) >= 60)
    .map((k) => {
      const c = ciagnienie.get(k.id);
      const pull = c && c.wagi > 0 ? c.suma / c.wagi : 50;
      return { k, roznica: (a2.k[k.id] ?? 0) - pull };
    })
    .filter((x) => x.roznica >= 20)
    .sort((x, y) => y.roznica - x.roznica || x.k.id - y.k.id)
    .slice(0, 2)
    .map(({ k }) => ({
      nazwa: ATUTY_TRESC[String(k.id)]?.nazwa ?? k.nazwa,
      dlaczego: ATUTY_TRESC[String(k.id)]?.dlaczego_warto_wiedziec ?? k.opis,
    }));
}

/**
 * Warunek, ktorego uczestnik jeszcze o sobie nie sprawdzil.
 *
 * Warunek kluczowy ze stylu dzialania plus zero dowodow w kompetencji, ktora
 * ten warunek obsluguje. Nigdzie nie nazywamy tego sprzecznoscia ani
 * slaboscia: to jest pierwsza rzecz warta sprawdzenia, bo od niej zalezy sens
 * calej drogi.
 */
function zbudujDoSprawdzenia(a2: WynikA2, a3: WynikA3): SekcjeKoncowe["doSprawdzenia"] {
  for (const regula of DOWOD_A3) {
    const warunek = a3.warunkiKluczowe.find(
      (w) => w.wymiar === regula.wymiar && w.biegun === regula.biegun,
    );
    if (!warunek) continue;
    if ((a2.dowody[regula.kompetencja] ?? 0) > 0) continue;
    return { warunek: warunek.warunek, zdanie: regula.zdanie };
  }
  return null;
}

export function zbudujKoncowy(dane: {
  a1: WynikA1;
  a2: WynikA2;
  a3: WynikA3;
  a4: WynikA4;
  a5: WynikA5;
  m1: WynikM1;
  silnik: WynikSilnika;
  odpowiedziA5: Record<string, "tak" | "moze" | "nie">;
  baza: BazaReferencyjna;
  /**
   * Reguly odslaniania. Raport koncowy sklada sie z tych samych danych co
   * warstwowy i podlega tym samym regulom: kafel z wartosci nie ma prawa
   * pokazac sie przed czwartym spotkaniem tylko dlatego, ze stoi w innym
   * ukladzie. Czesc, ktorej nie wolno zbudowac, nie powstaje w ogole.
   */
  wolno: (sekcja: string) => boolean;
}): SekcjeKoncowe {
  const { a1, a2, a3, a4, a5, m1, silnik, wolno } = dane;

  // --- WARUNKI I ICH DRUGA STRONA ---
  // Druga strona nie jest przeczeniem warunku, tylko nazwa pracy, w ktorej ten
  // warunek nie ma prawa byc spelniony. Bierzemy ja z biblioteki tresci, zeby
  // przy kazdym uczestniku brzmiala tak samo.
  const warunki: WarunekPracy[] = !wolno("srodowisko")
    ? []
    : a3.warunkiKluczowe.slice(0, 4).map((w) => {
        const biblioteka = trescOsi(w.wymiar, w.biegun);
        return {
          potrzebujesz: w.warunek,
          nieDlaCiebie: biblioteka?.prace_ktore_to_lamia[0] ?? "",
        };
      });

  // --- NAPIECIE MIEDZY WARTOSCIAMI ---
  const pierwsze = wolno("wartosci") ? a4.napiecia[0] : undefined;
  const definicja = pierwsze ? trescNapiecia(pierwsze.a, pierwsze.b) : undefined;
  const napiecie =
    pierwsze && definicja
      ? {
          tytul: definicja.nazwa,
          tresc: `${definicja.na_czym_polega} ${definicja.jak_z_tym_zyc}`,
        }
      : null;

  // --- ZGODA NA WARUNKI, NA KTORE WIEKSZOSC SIE NIE GODZI ---
  const zgodzoneKody = !wolno("na_co_gotow")
    ? []
    : Object.keys(TRUDNE_A5).filter((kod) => dane.odpowiedziA5[kod] === "tak");
  // Krotkie brzmienie tam, gdzie je mamy; reszta pelnym tekstem warunku.
  const zgody = !wolno("na_co_gotow")
    ? []
    : Object.entries(dane.odpowiedziA5)
        .filter(([, odp]) => odp === "tak")
        .map(([kod]) => TRUDNE_A5[kod] ?? WARUNKI_TRESC[kod]?.tekst ?? kod)
        .slice(0, 10);

  const przewaga =
    zgodzoneKody.length >= 4
      ? {
          pozycje: zgodzoneKody.map((kod) => TRUDNE_A5[kod]),
          // Zdanie o jednym warunku z biblioteki, a nie ogolnik o wszystkich:
          // „kto to udzwignie, wchodzi do zawodow z ciaglym brakiem rak".
          komunikat: `${TEKSTY_KONCOWE.przewaga} ${WARUNKI_TRESC[zgodzoneKody[0]]?.przewaga ?? ""}`.trim(),
        }
      : null;

  // --- SCIEZKI ---
  // Osiem sciezek liczy osobny modul, bo trzyma wlasne reguly: zawsze osiem,
  // wymuszona roznorodnosc rodzin obszarow, kazda z wariantem bez studiow.
  // Zawody sa tam jedynym miejscem, w ktorym uczestnik widzi ich nazwy, wiec
  // sekcja powstaje dopiero razem z warstwa zawodow.
  const sciezki = wolno("obszary") && wolno("zawody") ? zbudujSciezki(silnik, dane.baza) : null;

  return {
    kafle: wolno("wartosci") ? zbudujKafle(a1, a2, a3, a4, m1) : [],
    ukryteAtuty: wolno("lubie_a_wychodzi") ? zbudujUkryteAtuty(a1, a2) : [],
    warunki,
    przezyjeszBez: wolno("srodowisko") ? a3.preferencje.slice(0, 2).map((w) => w.warunek) : [],
    doSprawdzenia: wolno("srodowisko") ? zbudujDoSprawdzenia(a2, a3) : null,
    napiecie,
    przewaga,
    zgody,
    powtorzone: wolno("czego_nie_chce") ? znajdzPowtorzone(m1, a5) : null,
    sciezki,
  };
}

/** Nazwa osi stylu dzialania, do podpisu pod warunkiem. */
export function nazwaOsiA3(kod: string): string {
  const w = WYMIARY_A3.find((x) => x.kod === kod);
  return w ? `${w.biegunA} albo ${w.biegunB}` : kod;
}
