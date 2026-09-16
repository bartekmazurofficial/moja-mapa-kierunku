/**
 * WYNIK NOWEGO PROGRAMU.
 *
 * Sklada cztery moduly w jedno: piatke tematow, dwa tory czynnosci, poziom
 * zycia i wynikajaca z tego wszystkiego propozycje osmiu do dziesieciu
 * zawodow.
 *
 * Kolejnosc liczenia nie jest dowolna i wynika wprost z zasad programu:
 *
 *   1. Z leja „lubie" i „umiem" wychodza sily czynnosci. **Zainteresowania
 *      nie wchodza do tej matematyki w ogole** — sprzedaz jest sprzedaza
 *      i w motoryzacji, i w medycynie, wiec temat nie moze podnosic
 *      dopasowania do roli. Wracaja pozniej, jako podpowiedz branzowa przy
 *      zawodach, ktore juz sa wysoko.
 *   2. Poziom zycia daje trzy kwoty. Dopiero majac je, wolno porownac
 *      widelki zawodu z czymkolwiek.
 *   3. Zawody licza sie na koncu, bo potrzebuja obu poprzednich krokow.
 *
 * Braki sa dopuszczalne i nie zerują wyniku. Uczestnik, ktory wypelnil trzy
 * moduly z czterech, dostaje wszystko poza pasmami finansowymi, a nie pusta
 * strone. „Nic nie pasuje" nie jest wynikiem, ktory ten program dopuszcza.
 */

import "server-only";
import { prisma } from "../db/klient";
import { pobierzBazeReferencyjna } from "../db/repozytorium";
import { pobierzOdpowiedzi, type ZapisaneOdpowiedzi } from "../moduly/serwer";
import { MARKER_ZAKONCZENIA } from "../moduly/typy";
import { CZESCI_MODULOW } from "../moduly/ekrany";
import { bankModulu, nazwaPozycji, type ModulLeja } from "../moduly/ekrany-nowe";
import {
  policzLej,
  trzyListy,
  PROG_MOCNY,
  PROG_ROZJAZDU,
  type OdpowiedziLeja,
  type WynikLeja,
} from "../moduly/lej";
import { policzBudzet, type WynikBudzetu } from "../engine/budzet";
import { policzDopasowania, wybierzDoRaportu, type DopasowanieZawodu } from "../engine/ranking-czynnosci";
import { odczytajZarobki, type ZarobkiZawodu } from "../engine/zarobki";
import { NAZWY_LIST } from "../content/bank-czynnosci";
import { PASMA_ZAWODOW } from "../engine/config";
import { znakObszaru } from "../karty/obszary";
import type { ZawodWRaporcie } from "./typy";

export interface PozycjaZNazwa {
  id: number;
  nazwa: string;
  miejsce?: number;
}

export interface TorLeja {
  wynik: WynikLeja;
  top5: PozycjaZNazwa[];
  /** Czy uczestnik domknal wszystkie cztery czesci tego modulu. */
  gotowy: boolean;
}

export interface ListaZNazwami {
  tytul: string;
  opis: string;
  pozycje: PozycjaZNazwa[];
}

export interface WynikNowegoProgramu {
  ciekawosc: TorLeja;
  lubie: TorLeja;
  umiem: TorLeja;
  /** Trzy listy z nalozenia obu torow czynnosci. */
  listy: ListaZNazwami[];
  poziom: WynikBudzetu | null;
  /** Osiem do dziesieciu zawodow. Pusta lista znaczy: nie ma z czego liczyc. */
  zawody: DopasowanieZawodu[];
  /** Ktore moduly sa domkniete. Na komunikaty „czego jeszcze brakuje". */
  domkniete: Record<"Z" | "L" | "U" | "F", boolean>;
}

/** Czy wszystkie czesci modulu maja marker domkniecia. */
function domkniety(modul: string, zapisane: ZapisaneOdpowiedzi): boolean {
  return CZESCI_MODULOW[modul as "Z"].every((c) => Boolean(zapisane[c]?.[MARKER_ZAKONCZENIA]));
}

function liczby(wartosc: unknown): number[] {
  return Array.isArray(wartosc) ? (wartosc as unknown[]).filter((x): x is number => typeof x === "number") : [];
}

/** Cztery pola leja z czterech czesci modulu. */
function odczytajLej(zapisane: ZapisaneOdpowiedzi): OdpowiedziLeja {
  return {
    etap1: liczby(zapisane["A"]?.["etap1"]),
    etap2: liczby(zapisane["B"]?.["etap2"]),
    etap3: liczby(zapisane["C"]?.["etap3"]),
    kolejnosc: liczby(zapisane["D"]?.["kolejnosc"]),
  };
}

function tor(modul: ModulLeja, zapisane: ZapisaneOdpowiedzi): TorLeja {
  const wynik = policzLej(odczytajLej(zapisane), bankModulu(modul));
  return {
    wynik,
    top5: wynik.top5.map((p) => ({ id: p.id, nazwa: nazwaPozycji(modul, p.id), miejsce: p.miejsce })),
    gotowy: domkniety(modul, zapisane),
  };
}

/**
 * Widelki wszystkich zawodow, odczytane z sekcji `pieniadze` kart.
 *
 * Czytamy karty, nie przepisujemy ich. Baza zawodow zostaje nietknieta i to
 * jest warunek, na ktorym caly nowy ranking mogl stanac.
 */
export async function pobierzZarobki(): Promise<Map<string, ZarobkiZawodu | null>> {
  const karty = await prisma.karta.findMany({ select: { kod: true, sekcje: true } });
  const mapa = new Map<string, ZarobkiZawodu | null>();
  for (const k of karty) {
    const sekcje = JSON.parse(k.sekcje) as Array<{ klucz: string | null; tresc: string }>;
    mapa.set(k.kod, odczytajZarobki(sekcje.find((s) => s.klucz === "pieniadze")?.tresc));
  }
  return mapa;
}

export async function zbudujWynikNowy(uczestnikId: string): Promise<WynikNowegoProgramu> {
  const [z, l, u, f] = await Promise.all([
    pobierzOdpowiedzi(uczestnikId, "Z"),
    pobierzOdpowiedzi(uczestnikId, "L"),
    pobierzOdpowiedzi(uczestnikId, "U"),
    pobierzOdpowiedzi(uczestnikId, "F"),
  ]);

  const ciekawosc = tor("Z", z);
  const lubie = tor("L", l);
  const umiem = tor("U", u);

  const nazwyList = [NAZWY_LIST.lubieIUmiem, NAZWY_LIST.doRozwoju, NAZWY_LIST.umiemNieLubie];
  const trzy = trzyListy(lubie.wynik.sila, umiem.wynik.sila, bankModulu("L"));
  const listy: ListaZNazwami[] = [trzy.lubieIUmiem, trzy.doRozwoju, trzy.umiemNieLubie].map(
    (pozycje, i) => ({
      tytul: nazwyList[i].tytul,
      opis: nazwyList[i].opis,
      pozycje: pozycje.map((id) => ({ id, nazwa: nazwaPozycji("L", id) })),
    }),
  );

  // Poziom zycia liczymy tylko wtedy, gdy uczestnik przeszedl panel. Domyslne
  // kwoty policzone za kogos, kto nie odpowiadal, wygladalyby jak jego wybor.
  const panel = f["B"]?.["panel"] as { decyzje?: Record<string, string>; opcjonalne?: Record<string, number> } | undefined;
  const wejscie = Object.fromEntries(
    Object.entries(f["A"] ?? {})
      .filter(([kod, v]) => kod !== MARKER_ZAKONCZENIA && typeof v === "string")
      .map(([kod, v]) => [kod, v as string]),
  );
  const maPoziom = domkniety("F", f);
  const poziom = maPoziom
    ? policzBudzet({ wejscie, decyzje: panel?.decyzje ?? {}, opcjonalne: panel?.opcjonalne ?? {} })
    : null;

  // Bez zadnego toru czynnosci nie ma czego rankingowac: ranking z samych zer
  // ustawilby zawody alfabetycznie i wygladal jak wynik.
  const maCzynnosci = lubie.wynik.top5.length > 0 || umiem.wynik.top5.length > 0;
  if (!maCzynnosci) {
    return {
      ciekawosc,
      lubie,
      umiem,
      listy,
      poziom,
      zawody: [],
      domkniete: { Z: ciekawosc.gotowy, L: lubie.gotowy, U: umiem.gotowy, F: maPoziom },
    };
  }

  const [baza, zarobki] = await Promise.all([pobierzBazeReferencyjna(), pobierzZarobki()]);
  const ranking = policzDopasowania(
    lubie.wynik.sila,
    umiem.wynik.sila,
    baza.zawody,
    zarobki,
    poziom ?? undefined,
  );

  return {
    ciekawosc,
    lubie,
    umiem,
    listy,
    poziom,
    zawody: wybierzDoRaportu(ranking),
    domkniete: { Z: ciekawosc.gotowy, L: lubie.gotowy, U: umiem.gotowy, F: maPoziom },
  };
}

/* ================================================================== */
/* PELNA LISTA KART ZAWODOW                                            */
/* ================================================================== */

/**
 * Pasmo opisowe zawodu, **po normalizacji do wlasnego najlepszego wyniku**.
 *
 * Progi bezwzgledne tu nie dzialaja i probowalem ich najpierw. Surowy wynik
 * jest srednia wazona z szescdziesieciu czynnosci, z ktorych jeden zawod
 * dotyka kilkunastu, wiec jego wysokosc zalezy glownie od tego, ile pozycji
 * uczestnik w ogole zaznaczyl. W pomiarze na dwoch profilach najlepszy zawod
 * dostal 47 punktow u jednego i 33 u drugiego: przy stalym progu drugi
 * uczestnik nie zobaczylby ani jednego zdania, choc jego lista jest rownie
 * dobra.
 *
 * Dlatego dzielimy przez wlasny najlepszy wynik i uzywamy tych samych progow
 * co stary silnik, ktory robil dokladnie to samo. Pasmo mowi „to pasuje do
 * Ciebie na tle reszty Twojej listy", a nie „na tle innych ludzi": porownan
 * miedzy uczestnikami nie ma tu nadal zadnych.
 *
 * **Liczba nie wychodzi na ekran.** Uczestnik dostaje zdanie.
 */
function pasmoNowe(wynik: number, najlepszy: number) {
  // Ranking prawie pusty: zadnego zdania o dopasowaniu nie wolno wtedy wydac.
  if (najlepszy < MINIMALNY_SZCZYT) return PASMA_ZAWODOW[PASMA_ZAWODOW.length - 1];
  const znormalizowany = (wynik / najlepszy) * 100;
  return PASMA_ZAWODOW.find((x) => znormalizowany >= x.od)!;
}

/**
 * Ponizej tego wyniku najlepszy zawod uczestnika nie zasluguje na zadne
 * zdanie o dopasowaniu. Przy lejku wymuszajacym zaznaczenia na kazdym etapie
 * ta granica nie powinna sie uruchomic; jest na wypadek danych z importu.
 */
const MINIMALNY_SZCZYT = 12;

/**
 * Trzy zdania uzasadnienia, w tej samej roli co w starym raporcie.
 *
 * Pierwsze mowi, co uczestnik sam zaznaczyl, drugie o drodze wejscia, trzecie
 * o pieniadzach. Zadne nie zaczyna sie od „system uznal": kazde wskazuje
 * odpowiedz, ktora da sie znalezc we wlasnym module.
 */
function uzasadnienieNowe(z: DopasowanieZawodu): string[] {
  const zdania: string[] = [];
  if (z.trafienia.length > 0) {
    zdania.push(`Wchodzi tu, bo sam zaznaczyłeś: ${z.trafienia.join(", ")}.`);
  } else if (z.czynnosci.length > 0) {
    zdania.push(
      `W tej pracy najwięcej waży: ${z.czynnosci.slice(0, 3).map((c) => c.nazwa.toLowerCase()).join(", ")}.`,
    );
  }
  zdania.push(
    z.bezStudiow
      ? "Da się tu wejść bez studiów."
      : "Ta droga prowadzi przez studia albo dłuższą naukę.",
  );
  if (z.finanse.zarobki) zdania.push(z.finanse.komunikat);
  return zdania;
}

/**
 * Wszystkie karty zawodow w kolejnosci nowego rankingu.
 *
 * Osobno od `zbudujWynikNowy`, bo to jest inna lista: raport pokazuje osiem
 * do dziesieciu z wymuszona roznorodnoscia, a strona kart pokazuje cale sto
 * piecdziesiat siedem, zeby dalo sie przeczytac takze te, ktore nie weszly.
 */
export async function kartyNowego(uczestnikId: string): Promise<ZawodWRaporcie[]> {
  const [l, u, f] = await Promise.all([
    pobierzOdpowiedzi(uczestnikId, "L"),
    pobierzOdpowiedzi(uczestnikId, "U"),
    pobierzOdpowiedzi(uczestnikId, "F"),
  ]);
  const lubie = policzLej(odczytajLej(l), bankModulu("L"));
  const umiem = policzLej(odczytajLej(u), bankModulu("U"));
  if (lubie.top5.length === 0 && umiem.top5.length === 0) return [];

  const panel = f["B"]?.["panel"] as
    | { decyzje?: Record<string, string>; opcjonalne?: Record<string, number> }
    | undefined;
  const wejscie = Object.fromEntries(
    Object.entries(f["A"] ?? {})
      .filter(([kod, v]) => kod !== MARKER_ZAKONCZENIA && typeof v === "string")
      .map(([kod, v]) => [kod, v as string]),
  );
  const poziom = domkniety("F", f)
    ? policzBudzet({ wejscie, decyzje: panel?.decyzje ?? {}, opcjonalne: panel?.opcjonalne ?? {} })
    : undefined;

  const [baza, zarobki, karty] = await Promise.all([
    pobierzBazeReferencyjna(),
    pobierzZarobki(),
    prisma.karta.findMany({ select: { kod: true, pelna: true } }),
  ]);
  const pelna = new Map(karty.map((k) => [k.kod, k.pelna]));
  const obszary = new Map(baza.obszary.map((o) => [o.id, o]));
  const zawodyPoKodzie = new Map(baza.zawody.map((z) => [z.kod, z]));

  const ranking = policzDopasowania(lubie.sila, umiem.sila, baza.zawody, zarobki, poziom);
  const najlepszy = ranking[0]?.dopasowanie ?? 0;

  return ranking.map((d) => {
    const z = zawodyPoKodzie.get(d.kod)!;
    const o = obszary.get(z.obszar);
    const p = pasmoNowe(d.dopasowanie, najlepszy);
    return {
      kod: d.kod,
      nazwa: d.nazwa,
      pasmo: p.kod,
      pasmoOpis: p.opis,
      obszar: o?.nazwa ?? "",
      obszarId: z.obszar,
      grupaObszaru: o?.grupa ?? "",
      znakObszaru: o ? znakObszaru(o.zainteresowania) : null,
      poziom: z.poziom,
      studia: z.studia,
      koszt: z.koszt,
      zagrozenie: z.zagr,
      // Trzy drogi i klastry nalezaly do warstwy pierwszej starego raportu.
      // Nowy program ich nie liczy, wiec nie udajemy, ze je ma.
      droga: null,
      klasterKod: null,
      uzasadnienie: uzasadnienieNowe(d),
      flagi: {
        trampolina: z.flaga === "trampolina",
        zagrozony: z.zagr === "wysokie",
        barieraKosztowa: z.koszt === "wysoki",
        zdanieKierunkowe: null,
      },
      ostrzezenia: [],
      zGwarancji: null,
      maPelnaKarte: pelna.get(d.kod) ?? false,
    };
  });
}

/* ================================================================== */
/* KARTA DLA PROWADZACEGO                                              */
/* ================================================================== */

export interface KartaNowegoProgramu {
  tematy: string[];
  lubie: string[];
  umiem: string[];
  /** Czynnosci wysoko w „lubie" i nisko w „umiem", i odwrotnie. */
  rozjazdy: Array<{ czynnosc: string; strona: "lubie" | "umiem" }>;
  poziom: { minimum: number; komfort: number; cel: number } | null;
  /** Co najbardziej podnosi koszt. Trzy pozycje wystarcza na rozmowe. */
  kosztNajwiekszy: Array<{ nazwa: string; kwota: number; udzial: number }>;
  zawody: Array<{
    nazwa: string;
    bezStudiow: boolean;
    pasmoFinansowe: string;
    widelki: string | null;
    trafienia: string[];
  }>;
  /** Czego jeszcze nie ma. Prowadzacy ma wiedziec, czego nie pyta. */
  brakujaceModuly: string[];
}

/** Nazwy modulow do zdania „czego jeszcze nie ma". */
const NAZWY_NOWYCH: Record<string, string> = {
  Z: "Co mnie ciekawi",
  L: "Co lubię robić",
  U: "W czym jestem dobry",
  F: "Poziom życia i dochodu",
};

/**
 * Karta uczestnika nowego programu, dla prowadzacego przed sesja.
 *
 * Powstala, bo stara karta **zmyslala**. Budowala sie ze starego silnika,
 * ktory dla uczestnika nowego programu nie ma ani jednej odpowiedzi, wiec
 * wypisywala piec obszarow, piec kompetencji i ostrzezenia antyprofilowe
 * przy zawodach, o ktore nikt nigdy nie zapytal. Zdanie o czlowieku
 * wystawione bez danych jest gorsze niz puste miejsce, a na sesji
 * indywidualnej jest wprost szkodliwe.
 *
 * Rozjazdy sa tu najwazniejsze: to jedyna rzecz, ktorej uczestnik sam
 * o sobie nie widzi, a ktora zmienia rozmowe.
 */
export async function kartaNowego(uczestnikId: string): Promise<KartaNowegoProgramu> {
  const w = await zbudujWynikNowy(uczestnikId);

  const rozjazdy: KartaNowegoProgramu["rozjazdy"] = [];
  for (const id of bankModulu("L")) {
    const l = w.lubie.wynik.sila[id] ?? 0;
    const u = w.umiem.wynik.sila[id] ?? 0;
    if (l >= PROG_MOCNY && l - u >= PROG_ROZJAZDU) {
      rozjazdy.push({ czynnosc: nazwaPozycji("L", id), strona: "lubie" });
    } else if (u >= PROG_MOCNY && u - l >= PROG_ROZJAZDU) {
      rozjazdy.push({ czynnosc: nazwaPozycji("L", id), strona: "umiem" });
    }
  }

  return {
    tematy: w.ciekawosc.top5.map((p) => p.nazwa),
    lubie: w.lubie.top5.map((p) => p.nazwa),
    umiem: w.umiem.top5.map((p) => p.nazwa),
    rozjazdy,
    poziom: w.poziom
      ? { minimum: w.poziom.minimum, komfort: w.poziom.komfort, cel: w.poziom.cel }
      : null,
    kosztNajwiekszy: (w.poziom?.skladniki ?? [])
      .slice(0, 3)
      .map((s) => ({ nazwa: s.nazwa, kwota: s.kwota, udzial: s.udzial })),
    zawody: w.zawody.map((z) => ({
      nazwa: z.nazwa,
      bezStudiow: z.bezStudiow,
      pasmoFinansowe: z.finanse.pasmo,
      widelki: z.finanse.zarobki
        ? `${z.finanse.zarobki.start} do ${z.finanse.zarobki.szczyt} zł netto`
        : null,
      trafienia: z.trafienia,
    })),
    brakujaceModuly: (["Z", "L", "U", "F"] as const)
      .filter((m) => !w.domkniete[m])
      .map((m) => NAZWY_NOWYCH[m]),
  };
}
