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
import { policzLej, trzyListy, type OdpowiedziLeja, type WynikLeja } from "../moduly/lej";
import { policzBudzet, type WynikBudzetu } from "../engine/budzet";
import { policzDopasowania, wybierzDoRaportu, type DopasowanieZawodu } from "../engine/ranking-czynnosci";
import { odczytajZarobki, type ZarobkiZawodu } from "../engine/zarobki";
import { NAZWY_LIST } from "../content/bank-czynnosci";

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
