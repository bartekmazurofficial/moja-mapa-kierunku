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

export function minutyZPozycji(pozycji: number): number {
  return Math.max(2, Math.round((pozycji * SEKUND_NA_POZYCJE) / 60));
}
