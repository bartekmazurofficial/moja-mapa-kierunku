/**
 * LICZENIE POZIOMU ZYCIA.
 *
 * Wejscie: piec odpowiedzi wstepnych, dziesiec wyborow progu i lista pozycji
 * opcjonalnych. Wyjscie: trzy poziomy dochodu i ranking tego, co ten koszt
 * najbardziej podnosi.
 *
 * Trzy poziomy, nie jedna liczba, bo jedna liczba klamie w obie strony.
 *
 *   MINIMUM  najnizszy prog w kazdej kategorii plus pozycje automatyczne.
 *            Ponizej tego trudno utrzymac akceptowalny styl zycia.
 *   KOMFORT  suma tego, co uczestnik naprawde wybral.
 *   CEL      o jeden prog wyzej w kategoriach, ktore uczestnik podniosl
 *            ponad wartosc domyslna, czyli w tych, na ktorych mu zalezy.
 *
 * Definicja CELU jest jedyna nieoczywista rzecza w tym pliku i jest celowa:
 * podnoszenie wszystkiego o jeden prog daloby kwote, ktorej nikt nie chce,
 * bo uczestnikowi zwykle nie zalezy na drozszym jedzeniu i drozszych
 * ubraniach naraz. Podnosimy tam, gdzie sam juz podniosl.
 */

import {
  KATEGORIE_AKTYWNE,
  KOSZT_DZIECKA,
  MNOZNIK_MIASTA,
  POZYCJE_AUTO,
  type KategoriaKosztu,
} from "../content/poziom-zycia";

export interface OdpowiedziBudzetu {
  /** kod pytania wejsciowego -> kod opcji */
  wejscie: Record<string, string>;
  /** kod kategorii -> kod progu */
  decyzje: Record<string, string>;
  /** kod pozycji opcjonalnej -> kwota miesieczna */
  opcjonalne: Record<string, number>;
  /** Kwota wpisana recznie, gdy uczestnik nie chce zadnego z progow. */
  wlasne?: Record<string, number>;
}

export interface SkladnikKosztu {
  kod: string;
  nazwa: string;
  kwota: number;
  /** Udzial w calosci, w procentach. Do rankingu „co podnosi koszt". */
  udzial: number;
}

export interface WynikBudzetu {
  minimum: number;
  komfort: number;
  cel: number;
  /** Komfort rozbity na skladniki, od najwiekszego. */
  skladniki: SkladnikKosztu[];
  /** Ile osob dzieli koszty wspolne. */
  osobDoroslych: number;
  dzieci: number;
  mnoznikMiasta: number;
  kosztRoczny: number;
  /** Czy uczestnik cokolwiek zmienil, czy przeszedl na ustawieniach domyslnych. */
  zmienione: number;
}

const PUSTY: OdpowiedziBudzetu = { wejscie: {}, decyzje: {}, opcjonalne: {} };

function domyslnyProg(k: KategoriaKosztu): string {
  return (k.progi.find((p) => p.domyslny) ?? k.progi[0]).kod;
}

function opcjaWejscia(o: OdpowiedziBudzetu, kod: string, domyslna: string): string {
  return o.wejscie[kod] ?? domyslna;
}

/**
 * Kwota kategorii po uwzglednieniu miasta, liczby osob i dzieci.
 *
 * Koszty wspolne (mieszkanie, transport) dziela sie miedzy doroslych, koszty
 * osobiste (jedzenie, ubrania) mnoza sie przez liczbe osob. To nie jest
 * kosmetyka: para w jednym mieszkaniu placi za nie raz, ale je dwa razy.
 */
function kwotaKategorii(
  k: KategoriaKosztu,
  prog: string,
  o: OdpowiedziBudzetu,
  osob: number,
  mnoznik: number,
): number {
  const wlasna = o.wlasne?.[k.kod];
  const bazowa = wlasna ?? (k.progi.find((p) => p.kod === prog) ?? k.progi[0]).kwota;
  const zMiastem = k.zalezyOdMiasta ? bazowa * mnoznik : bazowa;
  return k.naOsobe ? zMiastem * osob : zMiastem;
}

export function policzBudzet(odpowiedzi: OdpowiedziBudzetu = PUSTY): WynikBudzetu {
  const o = odpowiedzi;
  const zKim = opcjaWejscia(o, "z_kim", "sam");
  const dzieci = Number(opcjaWejscia(o, "dzieci", "0")) || 0;
  const miasto = opcjaWejscia(o, "miasto", "duze");
  const mnoznik = MNOZNIK_MIASTA[miasto] ?? 1;
  // Wspollokatorzy dziela mieszkanie, ale nie sa gospodarstwem: koszty
  // osobiste liczymy tylko dla uczestnika.
  const osobDoroslych = zKim === "partner" || zKim === "malzenstwo" ? 2 : 1;

  const skladniki: SkladnikKosztu[] = [];
  let komfort = 0;
  let minimum = 0;
  let cel = 0;
  let zmienione = 0;

  for (const k of KATEGORIE_AKTYWNE) {
    const domyslny = domyslnyProg(k);
    const wybrany = o.decyzje[k.kod] ?? domyslny;
    if (wybrany !== domyslny || o.wlasne?.[k.kod] !== undefined) zmienione += 1;

    const kwota = kwotaKategorii(k, wybrany, o, osobDoroslych, mnoznik);
    komfort += kwota;
    skladniki.push({ kod: k.kod, nazwa: k.nazwa, kwota, udzial: 0 });

    // MINIMUM: najtanszy prog kategorii.
    minimum += kwotaKategorii(k, k.progi[0].kod, { ...o, wlasne: {} }, osobDoroslych, mnoznik);

    // CEL: o jeden prog wyzej, ale tylko tam, gdzie uczestnik juz podniosl.
    const indeksWybranego = k.progi.findIndex((p) => p.kod === wybrany);
    const indeksDomyslnego = k.progi.findIndex((p) => p.kod === domyslny);
    const podniosl = indeksWybranego > indeksDomyslnego;
    const docelowy = podniosl
      ? k.progi[Math.min(indeksWybranego + 1, k.progi.length - 1)].kod
      : wybrany;
    cel += kwotaKategorii(k, docelowy, { ...o, wlasne: {} }, osobDoroslych, mnoznik);
  }

  // Pozycje automatyczne. Nie da sie ich obnizyc, wiec wchodza do wszystkich
  // trzech poziomow tak samo.
  const auto = POZYCJE_AUTO.reduce(
    (s, p) => s + (p.naOsobe ? p.kwota * osobDoroslych : p.kwota),
    0,
  );
  komfort += auto;
  minimum += auto;
  cel += auto;
  skladniki.push({ kod: "auto", nazwa: "Pozostałe koszty", kwota: auto, udzial: 0 });

  // Dzieci: pelny koszt na kazde, w kazdym z trzech poziomow.
  if (dzieci > 0) {
    const naDziecko = KOSZT_DZIECKA.codzienne + KOSZT_DZIECKA.zajecia + KOSZT_DZIECKA.edukacja;
    const kwota = naDziecko * dzieci * mnoznik;
    komfort += kwota;
    minimum += KOSZT_DZIECKA.codzienne * dzieci * mnoznik;
    cel += kwota;
    skladniki.push({ kod: "dzieci", nazwa: "Dzieci", kwota, udzial: 0 });
  }

  // Pozycje opcjonalne wchodza tylko do komfortu i celu. Minimum jest z
  // definicji tym, bez czego sie nie da, a te pozycje wlacza sie z wyboru.
  const opcjonalne = Object.values(o.opcjonalne).reduce((s, x) => s + (x || 0), 0);
  if (opcjonalne > 0) {
    komfort += opcjonalne;
    cel += opcjonalne;
    skladniki.push({ kod: "opcjonalne", nazwa: "Pozycje dodatkowe", kwota: opcjonalne, udzial: 0 });
  }

  const zaokr = (x: number) => Math.round(x / 10) * 10;
  for (const s of skladniki) s.udzial = komfort > 0 ? Math.round((s.kwota / komfort) * 100) : 0;
  skladniki.sort((a, b) => b.kwota - a.kwota);

  return {
    minimum: zaokr(minimum),
    komfort: zaokr(komfort),
    cel: zaokr(Math.max(cel, komfort)),
    skladniki: skladniki.map((s) => ({ ...s, kwota: zaokr(s.kwota) })),
    osobDoroslych,
    dzieci,
    mnoznikMiasta: mnoznik,
    kosztRoczny: zaokr(komfort) * 12,
    zmienione,
  };
}
