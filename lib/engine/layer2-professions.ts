/**
 * WARSTWA 2: ZAWODY.
 *
 * Etapy A-I, zgodnie z 04_silniki/warstwa2_zawody.md.
 *
 * Kluczowa zasada relacji miedzy warstwami: wynik obszaru jest BAZA, karta
 * jest KOREKTA. Zawod dobrze dopasowany z obszaru trzeciego moze wyprzedzic
 * zawod slabo dopasowany z obszaru pierwszego, ale tylko wtedy, gdy roznica
 * obszarowa jest niewielka. Karta nie uniewaznia obszaru, tylko go dostraja.
 */

import {
  BARIERA_KOSZTOWA,
  DEGRADACJA,
  GWARANCJE,
  KARA_ODRZUCENIA,
  KARA_ZA_POZIOM,
  PASMA_ZAWODOW,
  WAGI_KARTOWE,
  WARSTWA2,
} from "./config";
import { ANTYPROFIL } from "./antyprofil";
import { filtrTwardyA0, korektaMiekkaA0 } from "./layer0-start";
import { RANGA_KOSZTU, RANGA_POZIOMU, RANGA_ZAGROZENIA } from "./mapowanie";
import type { ProfilKartowy } from "./profil";
import type { Klaster, Zawod } from "../domain/typy";
import type { UsunietyObszar } from "./typy";
import type {
  OstrzezenieAntyprofilowe,
  PozycjaWyniku,
  PunktStartu,
  WynikWarstwy2,
  WynikZawodu,
} from "./typy";

export type Zasoby = "brak" | "ograniczone" | "dobre";

export interface OpcjeWarstwy2 {
  /** Poziom wejscia, na jaki uczestnik jest gotow. Z osi INW modulu M1. */
  poziomDocelowy: string;
  zasoby: Zasoby;
  punktStartu: PunktStartu | null;
  /**
   * Obszary usuniete w warstwie pierwszej. Bez tego zawody z zawetowanego
   * obszaru znikalyby po cichu i prowadzacy nie zobaczylby, ze pielegniarka
   * odpadla przez weto na widok krwi.
   */
  usunieteObszary?: UsunietyObszar[];
}

/**
 * Zasoby z modulu A0 (cztery odpowiedzi) na trzy kategorie warstwy drugiej.
 * "Bardzo trudne, musialbym zarobic na to sam" traktujemy jak brak zasobow:
 * to jest sytuacja, w ktorej bariera jest realna, a nie kwestia rozlozenia na raty.
 */
export function zasobyZPunktuStartu(punktStartu: PunktStartu | null): Zasoby {
  switch (punktStartu?.zasoby) {
    case "realne":
      return "dobre";
    case "raty":
      return "ograniczone";
    case "bardzo_trudne":
    case "nierealne":
      return "brak";
    default:
      return "ograniczone";
  }
}

export function pasmoZawodu(wynik: number): { kod: string; opis: string } {
  const p = PASMA_ZAWODOW.find((x) => wynik >= x.od)!;
  return { kod: p.kod, opis: p.opis };
}

/**
 * Zaokraglenie bankierskie, zgodne z round() Pythona.
 * Prototyp zaokragla wynik surowy do jednego miejsca PRZED normalizacja
 * i dopiero potem dzieli przez najlepszy. Odtwarzamy to dokladnie, inaczej
 * opublikowane liczby przebiegu na sucho rozjezdzaja sie o jedna dziesiata.
 */
function zaokraglij(x: number, miejsca = 0): number {
  const skala = 10 ** miejsca;
  const przeskalowane = Number((x * skala).toPrecision(15));
  const podloga = Math.floor(przeskalowane);
  const reszta = przeskalowane - podloga;
  const zaokraglone =
    Math.abs(reszta - 0.5) < 1e-9
      ? podloga % 2 === 0
        ? podloga
        : podloga + 1
      : Math.round(przeskalowane);
  return zaokraglone / skala;
}

function pokrycie(uczestnik: Set<string>, karta: string[]): number {
  if (karta.length === 0) return 0;
  let trafienia = 0;
  for (const kod of karta) if (uczestnik.has(kod)) trafienia++;
  return trafienia / karta.length;
}

export function warstwa2(
  profil: ProfilKartowy,
  wynikiObszarow: Map<number, number>,
  zawody: Zawod[],
  klastry: Klaster[],
  opcje: OpcjeWarstwy2,
): WynikWarstwy2 {
  const wyniki: WynikZawodu[] = [];
  const usunieteWetem: WynikWarstwy2["usunieteWetem"] = [];
  const usunieteA0: WynikWarstwy2["usunieteA0"] = [];
  const usunieteBezPoziomu: WynikWarstwy2["usunieteBezPoziomu"] = [];
  const usunieteObszary = new Map((opcje.usunieteObszary ?? []).map((u) => [u.id, u]));
  const a0 = opcje.punktStartu;
  const rangaUczestnika = RANGA_POZIOMU[opcje.poziomDocelowy] ?? 1;

  for (const zawod of zawody) {
    const wynikObszaru = wynikiObszarow.get(zawod.obszar);
    if (wynikObszaru === undefined) {
      const usuniety = usunieteObszary.get(zawod.obszar);
      if (usuniety?.powod === "weto") {
        usunieteWetem.push({
          kod: zawod.kod,
          nazwa: zawod.nazwaWyswietlana,
          filtry: usuniety.filtr ? [usuniety.filtr] : [],
        });
      } else if (usuniety?.powod === "brak_poziomu") {
        usunieteBezPoziomu.push({ kod: zawod.kod, nazwa: zawod.nazwaWyswietlana, obszar: usuniety.nazwa });
      }
      continue;
    }

    // --- ETAP A: WETO ZAWODOWE. Jedyne miejsce, gdzie cos znika bezwarunkowo. ---
    const trafioneWeta = zawod.a5.filter((k) => profil.a5Weta.has(k));
    if (trafioneWeta.length > 0) {
      usunieteWetem.push({ kod: zawod.kod, nazwa: zawod.nazwaWyswietlana, filtry: trafioneWeta });
      continue;
    }
    if (zawod.studia === "tak" && profil.a5Weta.has("studia")) {
      usunieteWetem.push({ kod: zawod.kod, nazwa: zawod.nazwaWyswietlana, filtry: ["studia"] });
      continue;
    }

    // --- WARSTWA 0: dwa filtry twarde, reszta jest miekka ---
    const powodUsunieciaA0 = filtrTwardyA0(zawod, a0);
    if (powodUsunieciaA0 !== null) {
      usunieteA0.push({ kod: zawod.kod, nazwa: zawod.nazwaWyswietlana, powod: powodUsunieciaA0 });
      continue;
    }

    // --- ETAP B: MNOZNIK KARTOWY. Sedno warstwy drugiej. ---
    const a1 = pokrycie(profil.a1, zawod.a1);
    const a2 = pokrycie(profil.a2, zawod.a2r);
    const a3 = pokrycie(profil.a3, zawod.a3);
    const odrzucone = zawod.a5.filter((k) => profil.a5Odrzucone.has(k)).length;
    // Roznica miedzy "wolalbym nie" a "nie ma mowy". System musi ja utrzymac.
    const karaA5 = Math.min(KARA_ODRZUCENIA.sufit, KARA_ODRZUCENIA.za_sztuke * odrzucone);
    const baza = WAGI_KARTOWE.a1 * a1 + WAGI_KARTOWE.a2 * a2 + WAGI_KARTOWE.a3 * a3;
    const mnoznikKartowy = Math.max(
      WARSTWA2.MNOZNIK_MIN,
      Math.min(WARSTWA2.MNOZNIK_MAX, 0.65 + 0.5 * baza - karaA5),
    );

    // --- ETAP C: KARA ZA ROZJAZD POZIOMU. Zawod krotszy nie jest karany. ---
    const karaPoziomu =
      KARA_ZA_POZIOM * Math.max(0, (RANGA_POZIOMU[zawod.poziom] ?? 1) - rangaUczestnika);

    // --- ETAP D: BARIERA KOSZTOWA. Lagodna celowo. ---
    let karaKosztu = 0;
    if (opcje.zasoby === "brak" && (zawod.koszt === "wysoki" || zawod.koszt === "bardzo_wysoki")) {
      karaKosztu = BARIERA_KOSZTOWA.brak_zasobow_koszt_wysoki;
    } else if (opcje.zasoby === "ograniczone" && zawod.koszt === "bardzo_wysoki") {
      karaKosztu = BARIERA_KOSZTOWA.ograniczone_zasoby_koszt_bardzo_wysoki;
    }

    // --- WARSTWA 0: filtry miekkie i wzmocnienia, wylacznie w gore ---
    const { mnoznik: korektaA0, ostrzezenia: ostrzezeniaA0 } = korektaMiekkaA0(zawod, a0);

    const wynik = zaokraglij(
      wynikObszaru * mnoznikKartowy * (1 - karaPoziomu) * (1 - karaKosztu) * korektaA0,
      1,
    );

    // --- ETAP E: ANTYPROFIL. Ostrzezenie, nigdy kara. ---
    const ostrzezenia: OstrzezenieAntyprofilowe[] = [];
    for (const kod of zawod.anty) {
      if (!profil.anty.has(kod)) continue;
      const regula = ANTYPROFIL[kod];
      if (!regula?.aktywna) continue;
      ostrzezenia.push({
        kod,
        zdanie: `${regula.wZawodzie} Twoje odpowiedzi sugerują, że to może być dla Ciebie trudniejsze niż dla innych, bo ${regula.zrodlo}. Warto o tym porozmawiać na sesji indywidualnej.`,
        zrodlo: regula.zrodlo,
      });
    }
    for (const zdanie of ostrzezeniaA0) {
      ostrzezenia.push({ kod: "punkt_startu", zdanie, zrodlo: "moduł A0" });
    }

    wyniki.push({
      kod: zawod.kod,
      nazwa: zawod.nazwaWyswietlana,
      obszar: zawod.obszar,
      wynik,
      pasmo: "",
      wynikObszaru,
      mnoznikKartowy,
      pokrycie: { a1, a2, a3, odrzucone },
      karaPoziomu,
      karaKosztu,
      korektaA0,
      ostrzezenia,
      flagi: {
        trampolina: zawod.flaga === "trampolina",
        zagrozony: zawod.zagr === "wysokie" || zawod.zagr === "bardzo_wysokie",
        zdanieKierunkowe: zawod.kier,
        barieraKosztowa: karaKosztu > 0,
      },
      poziom: zawod.poziom,
      studia: zawod.studia,
      klaster: zawod.klaster,
      zGwarancji: null,
    });
  }

  // --- ETAP F: NORMALIZACJA. Najlepszy dostaje 100, reszta proporcjonalnie. ---
  // Obciecie do 100 powtorzyloby blad warstwy pierwszej: saturacje, w ktorej
  // trzy najlepsze zawody maja identyczne 100 i ranking przestaje istniec.
  const maks = wyniki.reduce((m, x) => Math.max(m, x.wynik), 0);
  if (maks > 0) {
    for (const x of wyniki) x.wynik = zaokraglij((100 * x.wynik) / maks, 1);
  }
  for (const x of wyniki) x.pasmo = pasmoZawodu(x.wynik).kod;

  // --- ETAP G: ROZSTRZYGANIE REMISOW ---
  // Przy roznicy ponizej trzech punktow rozstrzyga bezpieczenstwo uczestnika,
  // nie atrakcyjnosc zawodu: nizsze zagrozenie, nizszy koszt, krotsza droga.
  const poKodzie = new Map(zawody.map((z) => [z.kod, z]));
  const tb = (x: WynikZawodu): [number, number, number] => {
    const z = poKodzie.get(x.kod)!;
    return [
      RANGA_ZAGROZENIA[z.zagr] ?? 2,
      RANGA_KOSZTU[z.koszt] ?? 3,
      RANGA_POZIOMU[z.poziom] ?? 1,
    ];
  };
  wyniki.sort((a, b) => {
    const grupaA = zaokraglij(a.wynik / WARSTWA2.PROG_REMISU);
    const grupaB = zaokraglij(b.wynik / WARSTWA2.PROG_REMISU);
    if (grupaA !== grupaB) return grupaB - grupaA;
    const ta = tb(a);
    const tbb = tb(b);
    for (let i = 0; i < 3; i++) if (ta[i] !== tbb[i]) return ta[i] - tbb[i];
    if (a.wynik !== b.wynik) return b.wynik - a.wynik;
    return a.kod.localeCompare(b.kod);
  });

  // --- Prog pokazania, z degradacja przy zbyt malej liczbie zawodow ---
  let progPokazania: number = WARSTWA2.PROG_POKAZANIA;
  let wynikiWstepne = false;
  if (wyniki.filter((x) => x.wynik >= progPokazania).length < DEGRADACJA.MIN_ZAWODOW) {
    progPokazania = DEGRADACJA.PROG_POKAZANIA_OBNIZONY;
    wynikiWstepne = true;
  }
  const widoczne = wyniki.filter((x) => x.wynik >= progPokazania);

  // --- ETAP H: GWARANCJE REPREZENTACJI ---
  const dosypane: string[] = [];
  const bezStudiow = widoczne.filter((x) => x.studia === "nie");
  if (bezStudiow.length < GWARANCJE.MIN_BEZ_STUDIOW) {
    const brakuje = GWARANCJE.MIN_BEZ_STUDIOW - bezStudiow.length;
    for (const x of wyniki.filter((y) => y.studia === "nie" && !widoczne.includes(y)).slice(0, brakuje)) {
      x.zGwarancji = "droga_krotsza";
      widoczne.push(x);
      dosypane.push(x.kod);
    }
  }
  const szybkie = widoczne.filter((x) => x.poziom === "szybki");
  if (szybkie.length < GWARANCJE.MIN_SZYBKIE_WEJSCIE) {
    const brakuje = GWARANCJE.MIN_SZYBKIE_WEJSCIE - szybkie.length;
    for (const x of wyniki.filter((y) => y.poziom === "szybki" && !widoczne.includes(y)).slice(0, brakuje)) {
      x.zGwarancji = "szybkie_wejscie";
      widoczne.push(x);
      dosypane.push(x.kod);
    }
  }
  widoczne.sort((a, b) => wyniki.indexOf(a) - wyniki.indexOf(b));

  // --- Skladanie klastrow w jedna pozycje ---
  const pozycje = zlozKlastry(widoczne, klastry);

  return {
    pozycje,
    wszystkie: wyniki,
    usunieteWetem,
    usunieteA0,
    usunieteBezPoziomu,
    gwarancje: {
      bezStudiow: widoczne.filter((x) => x.studia === "nie").length,
      szybkieWejscie: widoczne.filter((x) => x.poziom === "szybki").length,
      dosypane,
    },
    progPokazania,
    wynikiWstepne,
  };
}

/**
 * Klaster jest jedna pozycja wyniku tam, gdzie assessment nie rozroznia
 * zawodow. Wynik klastra to najwyzszy wynik ze skladu.
 *
 * Wyjatek: jesli powyzej progu jest tylko JEDEN zawod z klastra, pokazujemy go
 * jako pojedynczy zawod, bez nazwy zbiorczej i bez pytania rozstrzygajacego.
 * Pokazywanie klastra "Opieka pielegniarska i poloznictwo" osobie, u ktorej
 * polozna wypadla ponizej progu, sugerowaloby wybor, ktorego nie ma.
 */
export function zlozKlastry(widoczne: WynikZawodu[], klastry: Klaster[]): PozycjaWyniku[] {
  const poKodzie = new Map(klastry.map((k) => [k.kod, k]));
  const uzyte = new Set<string>();
  const pozycje: PozycjaWyniku[] = [];

  for (const zawod of widoczne) {
    if (uzyte.has(zawod.kod)) continue;
    const klaster = zawod.klaster ? poKodzie.get(zawod.klaster) : undefined;
    if (!klaster) {
      uzyte.add(zawod.kod);
      pozycje.push({
        typ: "zawod",
        kod: zawod.kod,
        nazwa: zawod.nazwa,
        wynik: zawod.wynik,
        pasmo: zawod.pasmo,
        zawody: [zawod],
      });
      continue;
    }
    const czlonkowie = widoczne.filter((x) => x.klaster === klaster.kod);
    for (const c of czlonkowie) uzyte.add(c.kod);
    if (czlonkowie.length === 1) {
      pozycje.push({
        typ: "zawod",
        kod: zawod.kod,
        nazwa: zawod.nazwa,
        wynik: zawod.wynik,
        pasmo: zawod.pasmo,
        zawody: [zawod],
      });
      continue;
    }
    const najlepszy = czlonkowie.reduce((m, x) => (x.wynik > m.wynik ? x : m));
    pozycje.push({
      typ: "klaster",
      kod: klaster.kod,
      nazwa: klaster.nazwa,
      wynik: najlepszy.wynik,
      pasmo: najlepszy.pasmo,
      zawody: czlonkowie,
      pytanieRozstrzygajace: klaster.pytanie,
      roznica: klaster.roznica,
      uwaga: klaster.uwaga,
    });
  }

  return pozycje;
}
