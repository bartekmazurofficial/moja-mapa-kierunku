/**
 * Ile pytan ma czesc modulu i ile to potrwa.
 *
 * Osobny plik, bo liczy to ekran wstepu w przegladarce, a `ekrany.ts` ciagnie
 * za soba tresc wszystkich siedmiu modulow. Tutaj jest tylko arytmetyka na
 * gotowej liscie ekranow i zaden import poza typem.
 */

import type { Ekran } from "./typy";

/**
 * Ile pytan zobaczy jeden uczestnik: od najkrotszej sciezki do najdluzszej.
 *
 * Ekrany warunkowe grupujemy po polu warunku i dla kazdej wartosci tego pola
 * liczymy sume osobno. W A0 warunkiem jest etap zycia: licealista przechodzi
 * jedenascie pytan, ktos po studiach czternascie, a w definicji stoja
 * dwadziescia trzy ekrany i nikt nie zobaczy ich wszystkich. Tam, gdzie
 * warunkow nie ma, min rowna sie max i ekran pokazuje zwykla liczbe.
 */
export function zakresPozycji(ekrany: readonly Ekran[]): { min: number; max: number } {
  let staly = 0;
  /** pole warunku → wartosc → ile pozycji widac przy tej wartosci */
  const warunkowe = new Map<string, Map<string, number>>();
  for (const ekran of ekrany) {
    const ile = (ekran.pozycje ?? []).length;
    if (!ekran.warunek) {
      staly += ile;
      continue;
    }
    const poWartosci = warunkowe.get(ekran.warunek.pozycja) ?? new Map<string, number>();
    for (const wartosc of ekran.warunek.wartosci) {
      poWartosci.set(wartosc, (poWartosci.get(wartosc) ?? 0) + ile);
    }
    warunkowe.set(ekran.warunek.pozycja, poWartosci);
  }
  let min = staly;
  let max = staly;
  for (const poWartosci of warunkowe.values()) {
    const sumy = [...poWartosci.values()];
    min += Math.min(...sumy);
    max += Math.max(...sumy);
  }
  return { min, max };
}

/**
 * Ile mniej wiecej zajmie, w minutach.
 *
 * **To jest oszacowanie, nie pomiar.** Osiem sekund na pozycje to srednia
 * z przeklikania modulow przy budowie, zaokraglona w gore. Uczestnik przed
 * startem potrzebuje rzedu wielkosci („kwadrans czy pol godziny"), a nie
 * dokladnosci, i dlatego przy liczbie stoi slowo „okolo".
 *
 * Platforma zapisuje przy kazdej odpowiedzi `msSpent`, wiec po pilotazu da sie
 * podmienic te stala na mediany z prawdziwych przebiegow.
 */
const SEKUND_NA_POZYCJE = 8;

/**
 * A0 liczy sie inaczej niz reszta.
 *
 * Osiem sekund to tempo klikania par: dwa zdania, jedna decyzja. Pytanie A0
 * to osiem albo dziesiec opcji do przeczytania, czasem pole tekstowe, a przy
 * etapie zycia jeszcze chwila namyslu. Osiem sekund dawalo tam „okolo dwie
 * minuty" na czternascie pytan, czego nikt nie zrobi. Trzydziesci piec sekund
 * to nadal oszacowanie, ale rzedu wielkosci, ktory sie broni.
 */
/**
 * Moduly leja licza sie jeszcze inaczej.
 *
 * Etap leja to jedna „pozycja" w sensie zapisu, ale szescdziesiat kafli do
 * przeczytania i pietnascie decyzji do podjecia. Osiem sekund dawaloby tam
 * „okolo dwie minuty" na caly etap, czyli liczbe, ktora jest nieprawda
 * i ktora uczestnik wylapie po pol minucie.
 *
 * Trzy minuty na etap to nadal oszacowanie, ale rzedu wielkosci, ktory da
 * sie obronic: etap pierwszy trwa dluzej, dwa kolejne krocej, calosc modulu
 * wychodzi kolo dwunastu minut.
 *
 * Panel poziomu zycia to jeden ekran i dziesiec decyzji z opisami progow,
 * wiec piec minut.
 */
const SEKUND_W_MODULE: Record<string, number> = {
  A0: 35,
  Z: 180,
  L: 180,
  U: 180,
  F: 60,
};

export function sekundNaPozycje(modul?: string): number {
  return (modul && SEKUND_W_MODULE[modul]) || SEKUND_NA_POZYCJE;
}

export function minutyZPozycji(pozycji: number, modul?: string): number {
  return Math.max(2, Math.round((pozycji * sekundNaPozycje(modul)) / 60));
}
