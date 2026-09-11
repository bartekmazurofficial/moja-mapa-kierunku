/**
 * Wypełnienie części od nowa.
 *
 * Uczestnik, ktory chce zmienic odpowiedzi, nie ma jak ich edytowac pojedynczo:
 * moduly licza sie z calosci (rankingi w blokach, pary, limity wykluczen), wiec
 * polowiczna podmiana dalaby wynik, ktorego nikt nie umie zinterpretowac.
 * Zamiast tego kasujemy caly modul i uczestnik wypelnia go jeszcze raz.
 *
 * Kasujemy dwie rzeczy: odpowiedzi i postep modulu. Postep trzyma wylosowana
 * kolejnosc blokow — bez jego skasowania nowy przebieg szedlby w tej samej
 * kolejnosci co poprzedni, a kontrola efektu pozycji na tym polega, ze
 * kolejnosc jest losowana na nowo.
 *
 * Czego nie ruszamy: korekt prowadzacego i podsumowania sesji. To jest praca
 * czlowieka, nie dane uczestnika, i kasowanie jej po cichu byloby gorsze niz
 * zostawienie niespojnosci, ktora prowadzacy widzi w panelu.
 *
 * Bez "server-only": korzysta z tego takze skrypt resetu i testy.
 */

import { prisma } from "../db/klient";
import { CZESCI_MODULOW } from "./ekrany";
import { MARKER_ZAKONCZENIA, type KodModulu } from "./typy";

export interface DoWyczyszczenia {
  /** Ile zapisanych odpowiedzi zniknie. Bez znacznikow zakonczenia czesci. */
  odpowiedzi: number;
  /** Czesci, ktore uczestnik domknal: "A", "B", "C". */
  zakonczoneCzesci: string[];
  /** Czy caly modul jest wypelniony. */
  gotowy: boolean;
  /** Czy jest cokolwiek do skasowania. */
  cokolwiek: boolean;
}

/** Co zniknie po wyczyszczeniu. Do ekranu potwierdzenia — nic nie kasuje. */
export async function coZniknie(uczestnikId: string, modul: KodModulu): Promise<DoWyczyszczenia> {
  const wiersze = await prisma.odpowiedz.findMany({
    where: { uczestnikId, modul },
    select: { czesc: true, pozycja: true },
  });
  const zakonczoneCzesci = CZESCI_MODULOW[modul].filter((c) =>
    wiersze.some((w) => w.czesc === c && w.pozycja === MARKER_ZAKONCZENIA),
  );
  const odpowiedzi = wiersze.filter((w) => w.pozycja !== MARKER_ZAKONCZENIA).length;
  return {
    odpowiedzi,
    zakonczoneCzesci,
    gotowy: zakonczoneCzesci.length === CZESCI_MODULOW[modul].length,
    cokolwiek: wiersze.length > 0,
  };
}

/** Kasuje odpowiedzi i postep jednego modulu jednego uczestnika. */
export async function wyczyscModul(
  uczestnikId: string,
  modul: KodModulu,
): Promise<{ odpowiedzi: number }> {
  const { count } = await prisma.odpowiedz.deleteMany({ where: { uczestnikId, modul } });
  await prisma.postepModulu.deleteMany({ where: { uczestnikId, kod: modul } });
  return { odpowiedzi: count };
}
