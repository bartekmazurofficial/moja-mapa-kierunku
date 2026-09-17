/**
 * Sekcje raportu i to, co jest w nim zamkniete.
 *
 * Raport ma cztery sekcje i jedna z nich jest zamknieta: zawody. Reszta
 * otwiera sie razem z modulem, ktory ja wypelnia, bo to sa wlasne odpowiedzi
 * uczestnika, a nie wynik dzialania silnika na nich.
 *
 * **Zawody nie moga pojawic sie przed obszarami.** Konkretny zawod
 * przeczytany zanim uczestnik zobaczy, z czego wyszedl, zamyka myslenie na
 * wszystko inne; przeczytany po tym jest przykladem, nie wyrokiem. Dlatego
 * odslania je prowadzacy na spotkaniu, jednym kliknieciem dla calej grupy.
 *
 * Regula jest egzekwowana po stronie serwera, nie ukrywaniem w interfejsie:
 * sekcja zamknieta nie renderuje sie przed odblokowaniem, nawet przy
 * bezposrednim odwolaniu do adresu, i nie wchodzi do pliku PDF.
 */

export type KodWarstwy = "ZAWSZE" | "W4B";

export interface Warstwa {
  kod: KodWarstwy;
  nazwa: string;
  kiedy: string;
}

export const WARSTWY: Warstwa[] = [
  { kod: "ZAWSZE", nazwa: "Twoje odpowiedzi", kiedy: "dostępne od razu" },
  { kod: "W4B", nazwa: "Zawody i karty zawodów", kiedy: "na spotkaniu, po omówieniu obszarów" },
];

export interface DefinicjaSekcji {
  id: string;
  numer: number | null;
  tytul: string;
  warstwa: KodWarstwy;
  zrodlo: string;
}

export const SEKCJE: DefinicjaSekcji[] = [
  { id: "co_mnie_ciekawi", numer: 1, tytul: "Co Cię ciekawi", warstwa: "ZAWSZE", zrodlo: "moduł Z" },
  { id: "lubie_i_umiem", numer: 2, tytul: "Co lubisz i w czym jesteś dobry", warstwa: "ZAWSZE", zrodlo: "moduły L i U" },
  { id: "poziom_zycia", numer: 3, tytul: "Ile kosztuje życie, którego chcesz", warstwa: "ZAWSZE", zrodlo: "moduł F" },
  { id: "zawody", numer: 4, tytul: "Zawody, od których warto zacząć", warstwa: "W4B", zrodlo: "silnik dopasowania" },
];

export const SEKCJE_PO_ID = new Map(SEKCJE.map((s) => [s.id, s]));

/** Stopka na kazdym ekranie i kazdej stronie eksportu. */
export function stopkaRaportu(data: Date): string {
  const miesiace = [
    "styczniu", "lutym", "marcu", "kwietniu", "maju", "czerwcu",
    "lipcu", "sierpniu", "wrześniu", "październiku", "listopadzie", "grudniu",
  ];
  return (
    `Ten raport powstał na podstawie tego, co o sobie wiedziałeś w ${miesiace[data.getMonth()]} ` +
    `${data.getFullYear()}. Ludzie się zmieniają. Za dwa lata część z tego będzie już nieaktualna ` +
    `i to jest normalne.`
  );
}
