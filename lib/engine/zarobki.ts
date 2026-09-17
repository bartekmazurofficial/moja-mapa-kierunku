/**
 * ZAROBKI ZAWODU, WYCIAGNIETE Z KARTY.
 *
 * Widelki nie leza w tabeli dopasowania, tylko w sekcji `pieniadze` karty
 * zawodu, jako tabela w markdownie:
 *
 *     | Etap | Widelki |
 *     | Mlodszy administrator | 6000 do 9000 zl |
 *     | Architekt infrastruktury | 22 000 do 35 000 zl |
 *
 * Ten plik czyta te tabele i zamienia na trzy liczby, ktore da sie porownac
 * z poziomem zycia uczestnika. Karta zostaje nietknieta: czytamy ja, nie
 * przepisujemy.
 *
 * Trzy rzeczy, o ktore trzeba tu uwazac, bo kazda potrafi zepsuc wynik:
 *
 *   1. **Nie kazdy wiersz jest pensja miesieczna.** Aktor ma stawke dzienna
 *      za role w serialu i godzinowa za dubbing. Wiersz, przy ktorym stoi
 *      „za godzine", „stawka dzienna" albo „za nagranie", odrzucamy.
 *   2. **Karta podaje brutto, a poziom zycia jest netto.** Bez przeliczenia
 *      kazdy zawod wygladalby o jedna trzecia lepiej, niz jest.
 *   3. **Trzydziesci jeden kart nie jest pelnych.** Zawod bez widelek nie
 *      dostaje zera, tylko `null`: zero znaczyloby „nie zarabia sie nic",
 *      a prawda jest „nie wiemy".
 */

/** Widelki jednego etapu kariery, netto miesiecznie. */
export interface ZarobkiZawodu {
  /** Dolny koniec pierwszego etapu: tyle wyjdzie na start. */
  start: number;
  /** Realny poziom po kilku latach: srodek rozpietosci. */
  typowy: number;
  /** Gorny koniec najwyzszego etapu. */
  szczyt: number;
  /** Ile wierszy udalo sie odczytac. Ponizej dwoch wynik jest slaby. */
  wierszy: number;
  /** Dochod mocno zmienny: prowizja, sezon, wlasna dzialalnosc. */
  zmienny: boolean;
}

/**
 * Wiersze, ktore nie sa pensja miesieczna na etacie.
 *
 * Zostawienie ich w puli zaniza start do stu pieciudziesieciu zlotych
 * (stawka godzinowa dubbingu) i zawod wypada jako nieoplacalny, choc
 * aktor laczacy zrodla ma w tej samej tabeli 4000 do 20 000.
 */
const NIE_MIESIECZNE = /stawk[aię]|za godzin|godzinow|dzienn|za nagrani|za spektakl|za dzień|za projekt|za zlecen|za kurs/i;

/**
 * Wiersze w obcej walucie. Karty podaja zarobki za granica w euro i bez tego
 * filtru elektryk startowal od 2400 zlotych, bo tyle „zarabia" w Niemczech.
 */
const OBCA_WALUTA = /EUR|USD|GBP|CHF|NOK|€|£|\$/;

/**
 * Wiersze z przychodem wlasnej dzialalnosci.
 *
 * Przychod to nie dochod i karty same to pisza: po odjeciu materialu, paliwa,
 * skladek i przestojow zostaje mniej wiecej polowa. Wpuszczenie tych wierszy
 * podnosilo szczyt elektryka do trzydziestu pieciu tysiecy.
 */
const PRZYCHOD = /przychod|przychód/i;

/**
 * Najnizsza kwota, ktora moze byc miesieczna pensja.
 *
 * Ponizej tego progu w tabelach stoja stypendia stazowe w niepelnym wymiarze
 * i kwoty w obcej walucie, ktore uciekly innym filtrom. Prog jest nizszy niz
 * pensja minimalna celowo: staz w niepelnym wymiarze jest prawdziwym
 * poczatkiem sciezki i ma prawo tu zostac.
 */
const MINIMALNA_PENSJA = 3000;

/** Slowa, po ktorych poznajemy dochod mocno zmienny. */
const ZMIENNY = /prowizj|zmienno|sezon|niepewno|rozrzut|własn[aą] działalno|na swoim/i;

/**
 * Skladka i podatek: z brutto na netto, w przyblizeniu.
 *
 * To jest **przyblizenie i ma nim zostac**. Dokladne wyliczenie zalezy od
 * formy zatrudnienia, ulgi dla mlodych, progu podatkowego i kosztow uzyskania,
 * a raport i tak nie pokazuje kwoty zawodu obok kwoty uczestnika co do
 * zlotowki: pokazuje pasmo dopasowania. Wspolczynnik ma byc ostrozny, zeby
 * zawod nie wygladal lepiej, niz jest.
 */
export function bruttoNaNetto(brutto: number): number {
  if (brutto <= 0) return 0;
  // Drugi prog podatkowy zaczyna sie okolo 10 tys. brutto miesiecznie.
  const wspolczynnik = brutto > 10000 ? 0.66 : 0.72;
  return Math.round(brutto * wspolczynnik);
}

/** Liczby w karcie maja spacje jako separator tysiecy: „22 000". */
function naLiczbe(tekst: string): number {
  return Number(tekst.replace(/[\s ]/g, ""));
}

/**
 * Wyciaga widelki z sekcji `pieniadze`.
 *
 * Zwraca `null`, gdy karta nie ma ani jednego czytelnego wiersza. To jest
 * poprawny wynik dla trzydziestu jeden kart, ktore nie sa jeszcze pelne.
 */
export function odczytajZarobki(trescSekcji: string | null | undefined): ZarobkiZawodu | null {
  if (!trescSekcji) return null;

  const zakresy: Array<{ od: number; do: number }> = [];
  // Dzielimy takze na kropce srodkowej, nie tylko na koncu wiersza.
  //
  // Czesc kart nie ma tabeli, tylko jedno zdanie: „etat w spa 4000 do 6000 zl
  // · wlasna praktyka 8000 do 18 000 zl przychodu". Przy podziale wylacznie po
  // wierszach jedno slowo „przychodu" na koncu takiego zdania odrzucalo je
  // cale, razem z widelkami etatu, ktore sa poprawne.
  for (const linia of trescSekcji.split(/\n|·/)) {
    if (NIE_MIESIECZNE.test(linia) || OBCA_WALUTA.test(linia) || PRZYCHOD.test(linia)) continue;
    // „6000 do 9000 zl" albo „10 000 do 16 000 zl"
    const m = /(\d[\d\s ]*)\s*do\s*(\d[\d\s ]*)/.exec(linia);
    if (!m) continue;
    const od = naLiczbe(m[1]);
    const doK = naLiczbe(m[2]);
    // Odrzucamy oczywiste nie-pensje: stawki ponizej tysiaca i liczby
    // absurdalnie wysokie, ktore w karcie sa kwotami rocznymi albo obrotem.
    if (!Number.isFinite(od) || !Number.isFinite(doK)) continue;
    if (od < MINIMALNA_PENSJA || doK < od || doK > 200000) continue;
    zakresy.push({ od, do: doK });
  }

  if (zakresy.length === 0) return null;

  const dolne = zakresy.map((z) => z.od).sort((a, b) => a - b);
  const gorne = zakresy.map((z) => z.do).sort((a, b) => a - b);
  // Typowy poziom to **mediana srodkow wierszy**, a nie srodek calej
  // rozpietosci. Srodek rozpietosci jest ciagniety przez najwyzszy etap
  // tabeli i dla ksiegowego dawal osiemnascie tysiecy netto, czyli poziom
  // glownego ksiegowego w duzej firmie, a nie kogos po kilku latach.
  const srodkiWierszy = zakresy.map((z) => (z.od + z.do) / 2).sort((a, b) => a - b);
  const srodek = srodkiWierszy[Math.floor((srodkiWierszy.length - 1) / 2)];

  return {
    start: bruttoNaNetto(dolne[0]),
    typowy: bruttoNaNetto(srodek),
    szczyt: bruttoNaNetto(gorne[gorne.length - 1]),
    wierszy: zakresy.length,
    zmienny: ZMIENNY.test(trescSekcji),
  };
}

/* ================================================================== */
/* DOPASOWANIE FINANSOWE                                               */
/* ================================================================== */

export type PasmoFinansowe =
  | "bardzo_wysokie"
  | "wysokie"
  | "srednie"
  | "niskie"
  | "bardzo_niskie"
  | "nieznane";

export interface DopasowanieFinansowe {
  pasmo: PasmoFinansowe;
  /** Zdanie dla uczestnika. Nigdy nie mowi „za malo zarabiasz". */
  komunikat: string;
  zarobki: ZarobkiZawodu | null;
}

export const OPISY_PASM: Record<PasmoFinansowe, string> = {
  bardzo_wysokie: "Ten zawód dochodzi do poziomu, który sobie założyłeś, i idzie wyżej.",
  wysokie: "Ten zawód dochodzi do poziomu, który sobie założyłeś.",
  srednie: "Ten zawód pozwala żyć tak, jak chcesz, ale poziom docelowy jest tu trudny.",
  niskie: "Ten zawód pokrywa podstawy. Na poziom, który opisałeś, trzeba by tu wyjątkowej ścieżki.",
  bardzo_niskie:
    "Ten zawód raczej nie pokryje poziomu życia, który opisałeś. To nie znaczy, że jest zły, tylko że sam nie wystarczy.",
  nieznane: "Nie mamy jeszcze widełek dla tego zawodu, więc nie porównujemy go z Twoim poziomem.",
};

/**
 * Pasmo z porownania widelek zawodu z trzema poziomami uczestnika.
 *
 * **Zawodu nigdy nie usuwamy z powodu pieniedzy.** Pokazujemy pasmo i
 * zostawiamy decyzje: siedemnastolatek ma prawo wybrac zawod, ktory nie
 * dowiezie jego dzisiejszych wyobrazen o mieszkaniu, i ma prawo wiedziec,
 * ze tak jest.
 *
 * Porownujemy szczyt, a nie start: pytanie brzmi „czy tym zawodem da sie
 * dojsc do tego poziomu", a nie „czy da sie tam od razu".
 */
export function dopasowanieFinansowe(
  zarobki: ZarobkiZawodu | null,
  poziom: { minimum: number; komfort: number; cel: number },
): DopasowanieFinansowe {
  if (!zarobki) return { pasmo: "nieznane", komunikat: OPISY_PASM.nieznane, zarobki: null };

  const pasmo: PasmoFinansowe =
    zarobki.typowy >= poziom.cel
      ? "bardzo_wysokie"
      : zarobki.szczyt >= poziom.cel
        ? "wysokie"
        : zarobki.typowy >= poziom.komfort
          ? "srednie"
          : zarobki.szczyt >= poziom.minimum
            ? "niskie"
            : "bardzo_niskie";

  return { pasmo, komunikat: OPISY_PASM[pasmo], zarobki };
}

/** Liczba do rankingu B: pasmo na skale 0-100. */
export function punktyFinansowe(pasmo: PasmoFinansowe): number {
  switch (pasmo) {
    case "bardzo_wysokie":
      return 100;
    case "wysokie":
      return 80;
    case "srednie":
      return 55;
    case "niskie":
      return 30;
    case "bardzo_niskie":
      return 10;
    default:
      // Brak danych nie moze karac zawodu ani go premiowac.
      return 50;
  }
}
