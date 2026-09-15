/**
 * OSIEM SCIEZEK: sekcja 08 raportu koncowego.
 *
 * Najwazniejsza sekcja calego produktu i jedyne miejsce, w ktorym uczestnik
 * widzi nazwy zawodow.
 *
 * **To nie jest drugi silnik.** Silnik dopasowania juz policzyl obszary
 * (warstwa 1), zawody (warstwa 2) i kierunki (warstwa 3), z wszystkimi
 * bezpiecznikami: weta, zdrowie, poziom wejscia, gwarancje reprezentacji.
 * Tutaj tylko wybieramy z tego osiem drog i wymuszamy roznorodnosc. Liczenie
 * od nowa, z wlasnym katalogiem i wlasnymi wagami, znaczyloby dwa rankingi,
 * ktore predzej czy pozniej powiedza co innego.
 *
 * Piec regul, ktore ta sekcja ma trzymac i ktorych pilnuje walidator:
 *
 *   1. **Zawsze dokladnie osiem.** Nigdy mniej, nigdy wiecej, nigdy pusto.
 *   2. **To nie ranking.** Jedna sciezka moze byc oznaczona jako najblizsza
 *      wynikowi, ale bez legendy z poziomami i bez sortowania od najlepszej.
 *   3. **Kazda sciezka ma wariant bez studiow.** Zawsze.
 *   4. **Cztery albo piec zawodow na karte.** Nie dwa.
 *   5. **Wymuszona roznorodnosc.** Bez niej osiem sciezek wychodzi z jednej
 *      rodziny obszarow i raport traci sens: uczestnik dostaje osiem nazw
 *      tej samej rzeczy.
 *
 * Regula piata jest tym, co odroznia to narzedzie od wyszukiwarki zawodow.
 * Uczestnik, ktory postawil weto na kontakt z krwia i ze smiercia, ma
 * medycyne pozornie zamknieta. Ale w obszarze zdrowia zostaja serwis sprzetu
 * medycznego, technik radiolog i optyka: praca z aparatura, nie z pacjentem.
 * Sam by tego nie znalazl, bo odbilby sie od pierwszego wyniku wyszukiwania.
 */

import type { BazaReferencyjna, Obszar, Zawod } from "../domain/typy";
import type { WynikSilnika, WynikObszaru, WynikZawodu } from "../engine/typy";

/** Ile sciezek ma raport. Liczba stala, nie parametr. */
export const ILE_SCIEZEK = 8;

/** Ile zawodow stoi na karcie. Dwa to za malo, zeby zobaczyc, o czym mowa. */
export const ZAWODOW_NA_KARCIE = { min: 4, max: 5 } as const;

export type GrupaNauki = "od_razu" | "kurs" | "lepiej_studia";

/** Dlaczego ta sciezka jest na liscie. Do notatki trenera, nie na ekran. */
export type PowodWyboru =
  | "czolowka"
  | "ukryty_atut"
  | "czesciowo_zamkniety"
  | "roznorodnosc";

export interface Sciezka {
  /** A do H. Litera, nie numer: numer czytalby sie jak miejsce w rankingu. */
  litera: string;
  obszar: number;
  nazwa: string;
  /** Klucz ikony SVG. Zadnych zdjec i zadnych slotow do recznego wypelnienia. */
  ikona: string;
  grupaNauki: GrupaNauki;
  /** Plakietka „ile nauki": z poziomu wejscia obszaru, bez cen i terminow. */
  ileNauki: string;
  /** Trzy punkty, kazdy do pieciu slow. Z regul, nie z modelu jezykowego. */
  dlaczegoPasuje: string[];
  /** Cztery albo piec nazw zawodow, w brzmieniu pokazywanym uczestnikowi. */
  zawody: string[];
  /** Dwa albo trzy kroki. Bez cen, bez terminow, bez nazw kursow. */
  sciezkaRozwoju: string[];
  /** Jedno albo dwa zdania. Tresc stala dla obszaru, nie generowana. */
  coWartoWiedziec: string;
  /** Zawsze prawda. Gdyby nie byla, sciezka nie moglaby wejsc do raportu. */
  bezStudiow: true;
  /** Dokladnie jedna sciezka w raporcie ma tu prawde. */
  najblizej: boolean;
  powodWyboru: PowodWyboru;
}

export interface WynikSciezek {
  sciezki: Sciezka[];
  /** Litery w trzech grupach nauki, do bloku pod kartami. */
  grupy: Array<{ grupa: GrupaNauki; etykieta: string; litery: string[] }>;
  /** Czego nie brac: osiem pozycji z odwolaniem do wlasnej odpowiedzi. */
  czegoNieBrac: Array<{ co: string; dlaczego: string }>;
  /** Wspolny pierwszy krok wszystkich osmiu. Blok „jedna decyzja zamiast osmiu". */
  jednaDecyzja: string | null;
}

export const ETYKIETY_GRUP: Record<GrupaNauki, string> = {
  od_razu: "Od razu po technikum i papierach",
  kurs: "Technikum i kurs albo szkoła policealna",
  lepiej_studia: "Lepiej ze studiami, ale da się bez",
};

/**
 * Poziom wejscia z bazy obszarow na jedna z trzech grup nauki.
 *
 * `bardzo_dlugi` i `dlugi` ida razem: dla szesnastolatka roznica miedzy
 * pieciu a osmiu latami nauki jest zadna, obie znacza „nie w tej dekadzie".
 */
function grupaZPoziomu(poziom: string): GrupaNauki {
  if (poziom === "szybki") return "od_razu";
  if (poziom === "sredni") return "kurs";
  return "lepiej_studia";
}

/**
 * Ile nauki wymaga ta karta: poziom, na ktorym stoi wiekszosc jej zawodow.
 *
 * Dwie inne kandydatury na to miejsce odpadly i warto wiedziec dlaczego,
 * bo obie wygladaja rozsadnie:
 *
 *   - `poziomWejscia` z warstwy pierwszej jest poziomem docelowym dobranym
 *     pod konkretnego uczestnika, a nie wlasnoscia drogi. Dla dziewietnastolatki
 *     po maturze wypada wszedzie na „sredni" i grupa „od razu po technikum"
 *     wychodzi pusta, mimo ze te same obszary maja wejscia bez studiow.
 *   - najtansze wejscie do obszaru jest wlasnoscia drogi, ale bezuzyteczna:
 *     dwadziescia piec obszarow na dwadziescia siedem ma poziom „szybki",
 *     wiec wszystkie karty wpadaja do jednej grupy i podzial znika.
 *
 * Zostaje poziom zawodow, ktore na tej karcie naprawde stoja. Karta
 * z technikiem radiologiem i serwisantem sprzetu medycznego nie jest droga
 * „od razu po technikum", nawet jesli obszar zdrowia ma takie wejscie.
 * Przy remisie wygrywa poziom tanszy: kolumna bez studiow nigdy nie jest
 * slabiej wyeksponowana niz ta ze studiami.
 */
const WAGA_POZIOMU: Record<string, number> = {
  szybki: 0,
  sredni: 1,
  dlugi: 2,
  bardzo_dlugi: 3,
};

function poziomKarty(zawody: Zawod[]): string {
  const ile = new Map<string, number>();
  for (const z of zawody) ile.set(z.poziom, (ile.get(z.poziom) ?? 0) + 1);
  let najlepszy = zawody[0]?.poziom ?? "sredni";
  for (const [poziom, n] of ile) {
    const teraz = ile.get(najlepszy) ?? 0;
    if (n > teraz || (n === teraz && (WAGA_POZIOMU[poziom] ?? 9) < (WAGA_POZIOMU[najlepszy] ?? 9))) {
      najlepszy = poziom;
    }
  }
  return najlepszy;
}

/**
 * Cztery albo piec zawodow na karte.
 *
 * **Pierwszy zawod bez studiow wchodzi zawsze**, nawet gdy w rankingu stoi
 * nizej. Bez tego karta z plakietka „da sie bez studiow" wymienialaby same
 * zawody ze studiami i obietnica bylaby pusta.
 */
function zawodyKarty(ranking: WynikZawodu[], zawodyPoKodzie: Map<string, Zawod>): Zawod[] {
  const pelne = ranking
    .map((z) => zawodyPoKodzie.get(z.kod))
    .filter((z): z is Zawod => Boolean(z));
  const bezStudiow = pelne.filter((z) => z.studia !== "tak");
  const wybrane: Zawod[] = [];
  if (bezStudiow.length > 0) wybrane.push(bezStudiow[0]);
  for (const z of pelne) {
    if (wybrane.length >= ZAWODOW_NA_KARCIE.max) break;
    if (!wybrane.includes(z)) wybrane.push(z);
  }
  return wybrane;
}

const LITERY = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Prog, od ktorego uznajemy obszar za ukryty atut.
 *
 * Kompetencje wysoko, ciagniecie nisko. Obie liczby sa juz policzone przez
 * warstwe pierwsza silnika, wiec nie liczymy ich tu jeszcze raz.
 */
const UKRYTY_ATUT = { kompetencje: 60, ciagniecie: 45 } as const;

interface Kandydat {
  obszar: WynikObszaru;
  definicja: Obszar;
  zawody: WynikZawodu[];
  /** Cztery albo piec zawodow, ktore stana na karcie. */
  karta: Zawod[];
  /** Opis poziomu z bazy obszarow, dobrany do poziomu zawodow na karcie. */
  wejscie: Obszar["poziomy"][number];
  grupaNauki: GrupaNauki;
  rodzina: string;
  ukrytyAtut: boolean;
  czesciowoZamkniety: boolean;
}

/**
 * Sklada osiem sciezek z gotowego wyniku silnika.
 *
 * Kolejnosc krokow jest ta sama co w specyfikacji: najpierw kandydaci
 * (silnik juz usunal to, co usunac trzeba), potem kwoty roznorodnosci,
 * na koncu dopelnienie do osmiu i wyroznienie jednej.
 */
export function zbudujSciezki(
  silnik: WynikSilnika,
  baza: BazaReferencyjna,
): WynikSciezek {
  const definicje = new Map(baza.obszary.map((o) => [o.id, o]));
  const zawodyPoKodzie = new Map(baza.zawody.map((z) => [z.kod, z]));

  // Zawody, ktore przetrwaly wszystkie filtry, pogrupowane obszarem.
  const zawodyObszaru = new Map<number, WynikZawodu[]>();
  for (const z of silnik.warstwa2.wszystkie) {
    const lista = zawodyObszaru.get(z.obszar) ?? [];
    lista.push(z);
    zawodyObszaru.set(z.obszar, lista);
  }
  for (const lista of zawodyObszaru.values()) lista.sort((a, b) => b.wynik - a.wynik);

  // Obszary, z ktorych weto zabralo przynajmniej jeden zawod, ale nie wszystkie.
  const obszarPoKodzieZawodu = new Map(baza.zawody.map((z) => [z.kod, z.obszar]));
  const naruszoneWetem = new Set<number>();
  for (const u of silnik.warstwa2.usunieteWetem) {
    const obszar = obszarPoKodzieZawodu.get(u.kod);
    if (obszar !== undefined) naruszoneWetem.add(obszar);
  }

  const kandydaci: Kandydat[] = [];
  for (const o of silnik.warstwa1.obszary) {
    // Obszar 27 nigdy nie stoi samodzielnie: to tryb przedsiebiorczy,
    // ktory zawsze wystepuje w parze z branza, wiec nie jest sciezka.
    if (o.id === 27) continue;
    const definicja = definicje.get(o.id);
    const zawody = zawodyObszaru.get(o.id) ?? [];
    /*
      Obszar, w ktorym po wszystkich filtrach zostaly mniej niz cztery zawody,
      nie moze byc karta: karta ma wymienic cztery albo piec, a dosypywanie
      zawodow z sasiedniego obszaru daloby karte, ktora klamie o swojej nazwie.
      Taki obszar wraca dopiero w dopelnieniu, gdyby inaczej zabraklo osmiu.
    */
    if (!definicja || zawody.length < ZAWODOW_NA_KARCIE.min) continue;
    const karta = zawodyKarty(zawody, zawodyPoKodzie);
    if (karta.length < ZAWODOW_NA_KARCIE.min) continue;
    const poziom = poziomKarty(karta);
    const wejscie =
      definicja.poziomy.find((p) => p.poziom === poziom) ??
      [...definicja.poziomy].sort((a, b) => a.lata - b.lata)[0];
    kandydaci.push({
      obszar: o,
      definicja,
      zawody,
      karta,
      wejscie,
      grupaNauki: grupaZPoziomu(poziom),
      rodzina: definicja.grupa,
      ukrytyAtut:
        o.kompetencje >= UKRYTY_ATUT.kompetencje && o.ciagniecie <= UKRYTY_ATUT.ciagniecie,
      czesciowoZamkniety: naruszoneWetem.has(o.id),
    });
  }

  const wybrani = wybierzOsiem(kandydaci);

  const sciezki = wybrani.map((k, i) => zlozSciezke(k, LITERY[i]));

  // Wyroznienie: pierwszy kandydat, czyli ten o najwyzszym wyniku obszaru.
  // Karty na ekranie nie sa po nim sortowane, wiec to nie jest ranking.
  if (sciezki.length > 0) {
    const najlepszy = wybrani.reduce(
      (naj, k, i) => (k.obszar.wynik > wybrani[naj].obszar.wynik ? i : naj),
      0,
    );
    sciezki[najlepszy].najblizej = true;
  }

  return {
    sciezki,
    grupy: (["od_razu", "kurs", "lepiej_studia"] as GrupaNauki[]).map((g) => ({
      grupa: g,
      etykieta: ETYKIETY_GRUP[g],
      litery: sciezki.filter((s) => s.grupaNauki === g).map((s) => s.litera),
    })),
    czegoNieBrac: [],
    jednaDecyzja: null,
  };
}

/**
 * Krok trzeci specyfikacji: wybierz osiem, ale wymus roznorodnosc.
 *
 * Kwoty bierzemy najpierw, reszte dobieramy po wyniku. Kolejnosc kwot nie
 * jest przypadkowa: najpierw te, ktorych moze zabraknac (ukryty atut,
 * obszar czesciowo zamkniety), potem te, ktore zwykle sa pod dostatkiem.
 *
 * Sufit „najwyzej trzy z tej samej rodziny" obowiazuje takze kwoty. Bez tego
 * kwota „min. trzy od razu po technikum" potrafila wciagnac trzy sciezki
 * z jednej rodziny i cala roznorodnosc szla do kosza.
 */
function wybierzOsiem(kandydaci: Kandydat[]): Kandydat[] {
  const posortowani = [...kandydaci].sort((a, b) => b.obszar.wynik - a.obszar.wynik);
  const wybrani: Kandydat[] = [];
  const rodziny = new Map<string, number>();

  const wolno = (k: Kandydat) => (rodziny.get(k.rodzina) ?? 0) < 3;
  const wez = (k: Kandydat) => {
    wybrani.push(k);
    rodziny.set(k.rodzina, (rodziny.get(k.rodzina) ?? 0) + 1);
  };
  const dostepni = () =>
    posortowani.filter((k) => !wybrani.includes(k) && wolno(k));

  // Kwoty rzadkie najpierw: jesli takiego kandydata nie ma, nie da sie go
  // wyprodukowac pozniej, a miejsca beda juz zajete.
  const kwoty: Array<{ ile: number; pasuje: (k: Kandydat) => boolean }> = [
    { ile: 1, pasuje: (k) => k.ukrytyAtut },
    { ile: 1, pasuje: (k) => k.czesciowoZamkniety },
    { ile: 3, pasuje: (k) => k.grupaNauki === "od_razu" },
    { ile: 2, pasuje: (k) => k.grupaNauki === "kurs" },
  ];

  for (const kwota of kwoty) {
    let brakuje = kwota.ile - wybrani.filter(kwota.pasuje).length;
    while (brakuje > 0 && wybrani.length < ILE_SCIEZEK) {
      const kandydat = dostepni().find(kwota.pasuje);
      if (!kandydat) break;
      wez(kandydat);
      brakuje -= 1;
    }
  }

  // Reszta po wyniku, z sufitem rodziny.
  for (const k of posortowani) {
    if (wybrani.length >= ILE_SCIEZEK) break;
    if (wybrani.includes(k) || !wolno(k)) continue;
    wez(k);
  }

  /*
    Dopelnienie. Sufit rodziny jest regula jakosci, a „zawsze osiem" jest
    regula produktu, wiec przy niedoborze ustepuje sufit, nie liczba. Osiem
    sciezek z dwoch rodzin jest gorsze niz osiem z osmiu, ale szesc sciezek
    nie jest raportem.
  */
  for (const k of posortowani) {
    if (wybrani.length >= ILE_SCIEZEK) break;
    if (!wybrani.includes(k)) wez(k);
  }

  return wybrani.slice(0, ILE_SCIEZEK);
}

/** Jedna karta. Zawody i poziom sa juz policzone przy budowie kandydata. */
function zlozSciezke(k: Kandydat, litera: string): Sciezka {
  return {
    litera,
    obszar: k.obszar.id,
    nazwa: k.obszar.nazwa,
    ikona: `sciezka-${k.obszar.id}`,
    grupaNauki: k.grupaNauki,
    ileNauki: k.wejscie.etykieta,
    dlaczegoPasuje: k.obszar.dlaczegoPasuje.slice(0, 3),
    zawody: k.karta.map((z) => z.nazwaWyswietlana),
    sciezkaRozwoju: [],
    coWartoWiedziec: "",
    bezStudiow: true,
    najblizej: false,
    powodWyboru: k.ukrytyAtut
      ? "ukryty_atut"
      : k.czesciowoZamkniety
        ? "czesciowo_zamkniety"
        : "czolowka",
  };
}
