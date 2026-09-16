/**
 * LEJ: szeroko, wezej, TOP 5.
 *
 * Wspolna mechanika trzech pierwszych modulow. Trzy etapy, za kazdym razem
 * **inne pytanie**, a nie to samo trzy razy: najpierw deklaracja, potem
 * zachowanie, na koncu gotowosc do inwestycji. Kazde nastepne pytanie jest
 * drozsze i dlatego kazde nastepne wiecej znaczy.
 *
 * Sila liczy sie z tego, jak gleboko pozycja doszla, a nie z tego, ile razy
 * ktos ja kliknal:
 *
 *   TOP 5, miejsce 1-5   100, 90, 80, 70, 60
 *   przeszla etap 2      45
 *   przeszla etap 1      25
 *   nie zaznaczona        0
 *
 * Przeskok z 45 na 60 jest celowy i jest najwazniejsza liczba w tym pliku:
 * miedzy „wracam do tego" a „poswiecilbym na to setki godzin" jest przepasc
 * i wynik ma ja widziec.
 */

export const LIMITY = { etap1: 15, etap2: 8, etap3: 5 } as const;

/** Odpowiedzi jednego toru: numery pozycji na kazdym etapie plus kolejnosc. */
export interface OdpowiedziLeja {
  /** Pozycje zaznaczone na etapie pierwszym. */
  etap1: number[];
  /** Podzbior etapu pierwszego. */
  etap2: number[];
  /** Podzbior etapu drugiego, najwyzej piec. */
  etap3: number[];
  /** Piatka w kolejnosci wybranej przez uczestnika. Pierwsza pozycja to nr 1. */
  kolejnosc: number[];
}

export const PUSTY_LEJ: OdpowiedziLeja = { etap1: [], etap2: [], etap3: [], kolejnosc: [] };

export interface PozycjaTop5 {
  id: number;
  /** 1 do 5. */
  miejsce: number;
  sila: number;
}

export interface WynikLeja {
  /** id pozycji -> sila 0-100. Pozycje niezaznaczone maja zero. */
  sila: Record<number, number>;
  /** Piatka w kolejnosci, gotowa do raportu. */
  top5: PozycjaTop5[];
  /** Ile pozycji doszlo do etapu drugiego. Wskaznik na sesje, nie dla uczestnika. */
  szerokosc: number;
  /** Czy lej jest domkniety: piatka ulozona w kolejnosci. */
  gotowy: boolean;
}

/**
 * Sila pozycji z gleboskosci, na ktora doszla.
 *
 * Kolejnosc sprawdzania idzie od najglebszego etapu: pozycja z TOP 5 jest tez
 * w etapie drugim i pierwszym, wiec gdyby liczyc od konca, kazda dostalaby 25.
 */
function silaPozycji(id: number, o: OdpowiedziLeja): number {
  const miejsce = o.kolejnosc.indexOf(id);
  if (miejsce !== -1) return 100 - miejsce * 10;
  // Piatka wybrana, ale jeszcze nieulozona: liczy sie jak dolny koniec TOP 5.
  if (o.etap3.includes(id)) return 60;
  if (o.etap2.includes(id)) return 45;
  if (o.etap1.includes(id)) return 25;
  return 0;
}

export function policzLej(o: OdpowiedziLeja, wszystkieId: number[]): WynikLeja {
  const sila: Record<number, number> = {};
  for (const id of wszystkieId) sila[id] = silaPozycji(id, o);

  const top5 = o.kolejnosc
    .slice(0, LIMITY.etap3)
    .map((id, i) => ({ id, miejsce: i + 1, sila: 100 - i * 10 }));

  return {
    sila,
    top5,
    szerokosc: o.etap2.length,
    gotowy: o.kolejnosc.length === Math.min(LIMITY.etap3, o.etap3.length) && o.etap3.length > 0,
  };
}

/**
 * Pozycje do pokazania na danym etapie.
 *
 * Etap pierwszy pokazuje caly bank, kazdy nastepny wylacznie to, co przeszlo
 * poprzedni. Uczestnik nie ma szansy dodac na etapie drugim czegos, czego nie
 * zaznaczyl na pierwszym: lej zwezajacy sie tylko w jedna strone jest cala
 * mechanika tego modulu.
 */
export function pozycjeEtapu(etap: 1 | 2 | 3, o: OdpowiedziLeja, wszystkieId: number[]): number[] {
  if (etap === 1) return wszystkieId;
  if (etap === 2) return o.etap1;
  return o.etap2;
}

/**
 * Przetasowanie banku dla modulu „w czym jestem dobry".
 *
 * Bez tego uczestnik widzi te sama liste w tej samej kolejnosci drugi raz
 * i mechanicznie powtarza wybory z modulu „co lubie". Cala wartosc obu
 * modulow jest w rozjezdzie, wiec ta jedna funkcja robi wiecej dla wyniku niz
 * polowa instrukcji na ekranie.
 *
 * Tasowanie jest **deterministyczne i zwiazane z uczestnikiem**: ta sama osoba
 * przy powrocie do modulu widzi te sama kolejnosc, a dwie rozne osoby widza
 * inna. Losowanie przy kazdym wejsciu przestawialoby liste pod palcami.
 */
export function przetasuj<T>(pozycje: T[], ziarno: string): T[] {
  let stan = 0;
  for (let i = 0; i < ziarno.length; i += 1) {
    stan = (stan * 31 + ziarno.charCodeAt(i)) % 2147483647;
  }
  const nastepna = () => {
    stan = (stan * 1103515245 + 12345) % 2147483648;
    return stan / 2147483648;
  };

  const kopia = [...pozycje];
  for (let i = kopia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nastepna() * (i + 1));
    [kopia[i], kopia[j]] = [kopia[j], kopia[i]];
  }
  return kopia;
}

/**
 * Trzy listy z nalozenia obu torow.
 *
 * To jest najciekawsza czesc raportu i jedyna, ktora powstaje dopiero
 * z dwoch modulow naraz. Progi sa dobrane tak, zeby kazda lista miala sens:
 *
 *   - **lubie i umiem**: obie sily w TOP 5 albo tuz pod nim,
 *   - **do rozwoju**: chec wysoka, umiejetnosc wyraznie nizsza,
 *   - **umiem, nie lubie**: odwrotnie.
 *
 * Roznicy 25 punktow nie da sie zrobic przypadkiem: to jest odleglosc miedzy
 * „przeszlo etap drugi" a „weszlo do piatki".
 */
export const PROG_MOCNY = 60;
export const PROG_ROZJAZDU = 25;

export interface TrzyListy {
  lubieIUmiem: number[];
  doRozwoju: number[];
  umiemNieLubie: number[];
}

export function trzyListy(
  lubie: Record<number, number>,
  umiem: Record<number, number>,
  wszystkieId: number[],
): TrzyListy {
  const wynik: TrzyListy = { lubieIUmiem: [], doRozwoju: [], umiemNieLubie: [] };
  for (const id of wszystkieId) {
    const l = lubie[id] ?? 0;
    const u = umiem[id] ?? 0;
    if (l >= PROG_MOCNY && u >= PROG_MOCNY) wynik.lubieIUmiem.push(id);
    else if (l >= PROG_MOCNY && l - u >= PROG_ROZJAZDU) wynik.doRozwoju.push(id);
    else if (u >= PROG_MOCNY && u - l >= PROG_ROZJAZDU) wynik.umiemNieLubie.push(id);
  }
  const wgSily = (mapa: Record<number, number>) => (a: number, b: number) =>
    (mapa[b] ?? 0) - (mapa[a] ?? 0) || a - b;
  wynik.lubieIUmiem.sort(wgSily(lubie));
  wynik.doRozwoju.sort(wgSily(lubie));
  wynik.umiemNieLubie.sort(wgSily(umiem));
  return wynik;
}
