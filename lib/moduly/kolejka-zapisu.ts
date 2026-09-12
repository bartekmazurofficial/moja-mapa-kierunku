/**
 * Kolejka zapisu odpowiedzi, odporna na zerwane połączenie.
 *
 * Uczestnik wypełnia moduł na telefonie, w szkole, na cudzym wifi. Zapis
 * pojedynczym `fetch` bez ponowień znaczy, że przy chwilowej utracie sieci
 * odpowiedź przepada po cichu, a uczestnik dowiaduje się o tym dopiero wtedy,
 * gdy wraca do modułu i widzi pustą pozycję.
 *
 * Klasa nie zna Reacta ani `fetch`: wysyłkę i odmierzanie czasu dostaje
 * z zewnątrz, więc da się ją przetestować bez przeglądarki i bez czekania.
 */

export interface ZadanieZapisu {
  pozycja: string;
  tresc: unknown;
}

export interface OpcjeKolejki {
  /** Wysyła jedno zadanie. Rzuca, gdy się nie udało. */
  wyslij: (zadanie: ZadanieZapisu) => Promise<void>;
  /** Odstępy między ponowieniami, w milisekundach. */
  odstepy?: number[];
  /** Czekanie. Wstrzykiwane, żeby testy nie stały. */
  poczekaj?: (ms: number) => Promise<void>;
  /**
   * Wywolywane przy kazdej zmianie liczby pozycji, ktore **nie doszly**.
   * Liczy sie tylko to, co juz raz nie przeszlo: pozycja w locie nie jest
   * jeszcze zadnym problemem i nie ma prawa zapalac ostrzezenia na ekranie.
   */
  naZmiane?: (nieZapisane: number) => void;
}

const DOMYSLNE_ODSTEPY = [600, 2000, 6000];

export class KolejkaZapisu {
  private readonly wyslij: OpcjeKolejki["wyslij"];
  private readonly odstepy: number[];
  private readonly poczekaj: (ms: number) => Promise<void>;
  private readonly naZmiane?: (n: number) => void;

  /** Pozycje bez potwierdzenia: w locie albo po nieudanej próbie. */
  private zalegle = new Map<string, unknown>();
  /**
   * Pozycje, przy ktorych wysylka juz raz sie nie udala. To one, i tylko one,
   * sa "niezapisane" dla uczestnika.
   *
   * Bez tego rozroznienia zolty pasek "brak polaczenia" mrugal przy **kazdej**
   * odpowiedzi: zapis trwa kilkanascie milisekund, ale przez te kilkanascie
   * milisekund pozycja byla zalegla, pasek sie pojawial i spychal tresc w dol.
   */
  private nieudane = new Set<string>();
  /** Zadania w locie, żeby `oproznij` wiedział, na co czeka. */
  private wLocie = new Set<Promise<void>>();

  constructor(opcje: OpcjeKolejki) {
    this.wyslij = opcje.wyslij;
    this.odstepy = opcje.odstepy ?? DOMYSLNE_ODSTEPY;
    this.poczekaj = opcje.poczekaj ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
    this.naZmiane = opcje.naZmiane;
  }

  get nieZapisane(): number {
    return this.nieudane.size;
  }

  /** Wszystko bez potwierdzenia, razem z tym, co jest w locie. */
  get bezPotwierdzenia(): number {
    return this.zalegle.size;
  }

  get zaleglePozycje(): string[] {
    return [...this.zalegle.keys()];
  }

  /** Zapisuje pozycję. Przy niepowodzeniu ponawia, potem odkłada na później. */
  zapisz(pozycja: string, tresc: unknown): void {
    // Nowsza odpowiedź na tę samą pozycję zastępuje starszą: zapisujemy stan,
    // nie historię klikania.
    this.zalegle.set(pozycja, tresc);
    const zadanie = this.probuj(pozycja, tresc).finally(() => this.wLocie.delete(zadanie));
    this.wLocie.add(zadanie);
  }

  private async probuj(pozycja: string, tresc: unknown): Promise<void> {
    for (let proba = 0; proba <= this.odstepy.length; proba++) {
      // Pozycja mogla zostac w miedzyczasie nadpisana nowsza odpowiedzia.
      if (this.zalegle.get(pozycja) !== tresc) return;
      try {
        await this.wyslij({ pozycja, tresc });
        if (this.zalegle.get(pozycja) === tresc) {
          this.zalegle.delete(pozycja);
          this.nieudane.delete(pozycja);
          this.zglos();
        }
        return;
      } catch {
        // Pierwsza nieudana proba: dopiero teraz uczestnik ma o tym wiedziec.
        if (!this.nieudane.has(pozycja)) {
          this.nieudane.add(pozycja);
          this.zglos();
        }
        if (proba < this.odstepy.length) await this.poczekaj(this.odstepy[proba]);
      }
    }
    // Zostaje w zaległych. Wróci przy `ponow` albo przy zamykaniu części.
  }

  /** Ponawia wszystko, co zostało. Wywoływane po powrocie połączenia. */
  async ponow(): Promise<void> {
    const doPonowienia = [...this.zalegle.entries()];
    await Promise.all(doPonowienia.map(([pozycja, tresc]) => this.probuj(pozycja, tresc)));
  }

  /**
   * Czeka na wszystko, co w locie, i ponawia to, co zostało.
   * Zwraca `true`, gdy nic nie zalega.
   */
  async oproznij(): Promise<boolean> {
    await Promise.all([...this.wLocie]);
    if (this.zalegle.size > 0) await this.ponow();
    return this.zalegle.size === 0;
  }

  private zglos(): void {
    this.naZmiane?.(this.nieudane.size);
  }
}
