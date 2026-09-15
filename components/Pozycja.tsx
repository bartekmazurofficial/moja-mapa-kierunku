"use client";

/**
 * Uniwersalny komponent pozycji assessmentowej.
 *
 * Jeden punkt wejscia dla wszystkich typow, ktore wystepuja w siedmiu
 * modulach. Kazdy typ ma wlasny renderer, ale wszystkie maja ten sam
 * kontrakt: dostaja wartosc i oddaja nowa wartosc.
 *
 * Elementy dotykowe maja minimum 44 piksele. Zaden typ nie uzywa samego
 * koloru jako nosnika informacji.
 */

import { useId, useMemo } from "react";
import type { OpcjaWyboru, Pozycja as PozycjaDef, StronaPary } from "@/lib/moduly/typy";
import { Ikona, Obraz } from "@/components/Ikona";
import { kluczBieguna, maObraz } from "@/lib/ui/obrazy";
import { kolorWyboru, type Kolor } from "@/lib/ui/kolory";
import { kolejnoscDoPokazania } from "@/lib/moduly/ranking";
export { pozycjaKompletna } from "@/lib/moduly/walidacja";

export interface WlasciwosciPozycji {
  pozycja: PozycjaDef;
  wartosc: unknown;
  naZmiane: (wartosc: unknown) => void;
  /** Wywolywane, gdy pozycja jest kompletna i ekran moze przejsc dalej sam. */
  naDomkniecie?: () => void;
  /** Pierwsza pozycja na ekranie: tylko przy niej pokazujemy opis skali. */
  pierwsza?: boolean;
  ostatnia?: boolean;
  /** Pozycja stoi w siatce kolumn, nie w jednej długiej liście. */
  wSiatce?: boolean;
  /** Klucz kategorii ekranu: stąd bierze się kolor bloku wyboru. */
  kluczKoloru?: string;
  /** Numer pozycji na ekranie, liczony od zera. Stąd bierze się kolor bloku. */
  miejsce?: number;
  /** Akcent ekranu. Blok odwrotny A4 zaznacza się cieplej niż reszta modułu. */
  akcent?: "pomarancz";
}

export function Pozycja(props: WlasciwosciPozycji) {
  switch (props.pozycja.typ) {
    case "ranking4":
      return <Ranking4 {...props} />;
    case "para":
      return <Para {...props} />;
    case "skala5":
      return <Skala5 {...props} />;
    case "kotwica":
      return <Kotwica {...props} />;
    case "trzystopniowa":
      return <Trzystopniowa {...props} />;
    case "pojedynczy":
      return <Pojedynczy {...props} />;
    case "wielokrotny":
      return <Wielokrotny {...props} />;
    case "dowody":
      return <Dowody {...props} />;
    case "tekst":
      return <PoleTekstowe {...props} />;
    case "kilka_tekstow":
      return <KilkaTekstow {...props} />;
    default:
      return null;
  }
}

// =====================================================================

/**
 * Obramowanie pozycji. W siatce kolumn kreska u dolu nie wiadomo czego dotyczy,
 * wiec pozycja dostaje wlasna ramke w kolorze swojej kategorii.
 */
function ramka(wSiatce: boolean | undefined, ostatnia: boolean | undefined): string {
  if (wSiatce) return "h-full rounded-xl border-2 p-4";
  return ostatnia ? "" : "border-b border-linia pb-5";
}

/** Styl bloku w kolorze kategorii. Tylko w siatce: w liscie kolor przeszkadza. */
function stylBloku(klucz: string | undefined, wSiatce: boolean | undefined, miejsce?: number) {
  if (!wSiatce) return undefined;
  const k = kolorWyboru(klucz, miejsce);
  if (!k) return undefined;
  return { borderColor: k.obwod, background: k.tlo };
}


/**
 * Karta wyboru. Wszystkie karty na ekranie sa identyczne: to samo tlo, ta sama
 * krawedz, ta sama typografia. Rozni je wylacznie tresc. Grubosc krawedzi jest
 * stala w obu stanach, zeby zaznaczenie nie przesuwalo ukladu o piksel.
 */
// =====================================================================
// Karty wyboru
// =====================================================================

/**
 * Wspólny kształt karty wyboru.
 *
 * Wszystkie karty na ekranie mają tę samą budowę, a różni je treść i jasna
 * tinta miejsca. Stan wybrany zaznacza obwódka gradientowa i znak w rogu,
 * ten sam we wszystkich siedmiu modułach. Grubość krawędzi jest stała, więc
 * zaznaczenie nie przesuwa układu o piksel.
 */
function klasyKarty(wybrana: boolean): string {
  return `przejscie relative w-full rounded-karta border-2 text-left active:scale-[0.995] ${
    wybrana ? "obwodka-gradient" : "border-linia hover:border-linia-mocna"
  }`;
}

/** Tinta karty z koloru miejsca. Bez koloru zostaje białe szkło. */
function stylKarty(kolor: Kolor | null, wybrana: boolean): React.CSSProperties {
  if (!kolor) return { ["--tinta" as string]: "#ffffff" };
  return {
    ["--tinta" as string]: kolor.tlo,
    background: wybrana ? undefined : kolor.tlo,
    borderColor: wybrana ? undefined : kolor.obwod,
  };
}

/** Znak wyboru w rogu karty: pełny gradient po wybraniu, pusty pierścień przed. */
function ZnakWyboru({
  wybrana,
  kwadrat,
  naObrazie,
  wRzedzie,
  male,
}: {
  wybrana: boolean;
  kwadrat?: boolean;
  /** Znak lezy na zdjeciu: kryjaca biel pod pierscieniem, inaczej ginie. */
  naObrazie?: boolean;
  /** Znak stoi w wierszu tekstu, nie w rogu karty. */
  wRzedzie?: boolean;
  /** Mniejszy znak w gestej siatce: oddaje szerokosc etykiecie. */
  male?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`${wRzedzie ? "mt-0.5 shrink-0" : "absolute right-3 top-3"} z-10 flex items-center justify-center border-2 ${
        male ? "h-5 w-5" : "h-7 w-7"
      } ${
        kwadrat ? "rounded-lg" : "rounded-full"
      } ${
        wybrana
          ? "przycisk-gradient border-transparent"
          : naObrazie
            ? "border-white bg-panel/90 shadow-sm"
            : "border-linia-mocna bg-panel/80"
      }`}
    >
      {wybrana ? (
        <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M2 6.3 4.6 9 10 3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

/** Znak kategorii w kółku na jasnym tle koloru, jak na kartach z makiet. */
function KolkoZnaku({ klucz, kolor, rozmiar = 56 }: { klucz: string; kolor: Kolor | null; rozmiar?: number }) {
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: rozmiar,
        height: rozmiar,
        background: kolor ? "#ffffff" : "var(--color-akcent-tlo)",
        boxShadow: `inset 0 0 0 1px ${kolor ? kolor.obwod : "var(--color-linia)"}`,
      }}
    >
      <Ikona klucz={klucz} rozmiar={Math.round(rozmiar * 0.62)} wybor kolor={kolor} />
    </span>
  );
}

/**
 * Dziewiec opcji jedna pod druga to sciana tekstu, przez ktora trzeba
 * przewijac. Od pieciu wzwyz ukladamy je w dwie kolumny; na telefonie
 * zostaje jedna, bo dwie nie zmieszcza sie z czytelna etykieta.
 */
function kolumnyOpcji(ile: number): string {
  return ile > 4 ? "grid sm:grid-cols-2" : "flex flex-col";
}

/**
 * Siatka kart odpowiedzi: ile kolumn przy ilu opcjach.
 *
 * Liczby sa przepisane z makiet, a nie dobrane na oko: cztery odpowiedzi ida
 * w cztery kolumny, piec i szesc w trzy, siedem do dziewieciu w cztery,
 * dziesiec i wiecej w piec. Kadr ma wtedy od 200 do 330 px szerokosci;
 * ponizej tego obrazek przestaje cokolwiek mowic, a powyzej karta rozciaga
 * sie na cala szerokosc i przestaje byc kafelkiem.
 *
 * `auto-rows-fr` wyrownuje wysokosc kart w rzedzie. Bez tego kazda karta jest
 * tak wysoka, jak jej wlasny tekst, i rzad wyglada na poszarpany.
 */
function kolumnyKart(ile: number): string {
  // Liczba kolumn jest dobrana tak, żeby ekran zmieścił się w oknie bez
  // przewijania: do czterech odpowiedzi jeden rząd, do dziesięciu dwa,
  // czternaście przedmiotów szkolnych w sześć kolumn i trzy rzędy.
  //
  // Siedem kolumn mieściłoby przedmioty w dwóch rzędach, ale przy 147 px
  // szerokości etykiety łamią się w środku wyrazu („matema/tyka") i to jest
  // gorsze niż jeden rząd więcej.
  const kolumny =
    ile <= 2
      ? "lg:grid-cols-2"
      : ile === 3
        ? "lg:grid-cols-3"
        : ile === 4
          ? "lg:grid-cols-4"
          : ile <= 6
            ? "lg:grid-cols-3"
            : ile <= 8
              ? "lg:grid-cols-4"
              : ile <= 10
                ? "lg:grid-cols-4 xl:grid-cols-5"
                : "lg:grid-cols-4 xl:grid-cols-6";
  // Gęsta siatka dostaje ciaśniejsze odstępy: przy trzech rzędach każde
  // cztery piksele przerwy to dwanaście pikseli wysokości ekranu.
  // Do sześciu odpowiedzi siatka dostaje sufit szerokości. Bez niego kafel
  // ma 362 px, a kadr 16:9 z niego 204 px wysokości: dwa rzędy takich kafli
  // schodziły pod krawędź okna, a zdjęcie nie mówi więcej dlatego, że jest
  // większe.
  const sufit = ile <= 6 ? "mx-auto w-full max-w-[62rem] " : "";
  return `${sufit}grid auto-rows-fr ${ile > 10 ? "gap-3" : "gap-4"} sm:grid-cols-2 ${kolumny}`;
}

/**
 * Szerokosc kadru w jednej karcie na szerokim ekranie, w pikselach CSS.
 *
 * Idzie do `sizes` przy zdjeciu: przegladarka dopiero z tej liczby wie, ktory
 * plik z `srcSet` wziac. Bez niej zakladala pelna szerokosc okna i w kazdy
 * kafel wkladala wersje szeroka, a przy dwoch kolumnach odwrotnie: kafel
 * 560 px szedl w kadr o szerokosci 480 px i na ekranie 2x bylo widac rozmycie.
 *
 * Liczby wychodza z `kolumnyKart`: kolumna tresci ma 74rem minus marginesy,
 * czyli 1120 px (przy czterech kartach siatka dostaje sufit 992 px), od tego
 * odchodza odstepy miedzy kolumnami i po 10 px na obramowanie i wyscielenie
 * z kazdej strony karty.
 */
function szerokoscKadru(ile: number): number {
  const kolumny = ile <= 2 ? 2 : ile <= 4 ? ile : ile <= 6 ? 3 : ile <= 10 ? 5 : 6;
  const siatka = ile <= 6 ? 992 : 1120;
  const przerwa = ile > 10 ? 12 : 16;
  return Math.round((siatka - przerwa * (kolumny - 1)) / kolumny) - 20;
}

/**
 * Jedna siatka kart odpowiedzi, razem z opcjami wyłącznymi.
 *
 * Wcześniej opcja wyłączna szła pod siatkę jako szeroki pasek, bo
 * `auto-rows-fr` wyrównuje wysokość kafli w rzędzie i kafel bez kadru zostawał
 * wysoką, pustą ramką. Pasek robił jednak z „nic z tego" coś innego niż
 * odpowiedź, a to nadal jest odpowiedź. Kafel bez kadru dostaje więc tekst
 * wyśrodkowany w pionie i wypełnia wysokość rzędu treścią, nie pustką.
 */
function KartyOdpowiedzi({
  opcje,
  kluczKoloru,
  kwadrat,
  zaznaczona,
  zablokowana,
  onClick,
}: {
  opcje: OpcjaWyboru[];
  kluczKoloru?: string;
  kwadrat?: boolean;
  zaznaczona: (o: OpcjaWyboru) => boolean;
  zablokowana?: (o: OpcjaWyboru) => boolean;
  onClick: (o: OpcjaWyboru) => void;
}) {
  // Opcja wyłączna stoi w tej samej siatce co reszta, tylko bez kadru.
  // Osobny, szeroki pasek pod spodem robił z niej coś innego niż odpowiedź,
  // a to nadal jest odpowiedź: „nic z tego" jest równie prawdziwe jak reszta.
  // Kafel bez kadru ma wysokość rzędu, ale tekst siedzi w nim wyśrodkowany,
  // więc nie zostaje po nim pusta ramka.

  // Siatkę układamy z pól, nie z odpowiedzi: kafel na dwie kolumny zajmuje
  // dwa pola i bez tego ostatni rząd wychodziłby poza siatkę.
  const pola = opcje.length + opcje.filter((o) => o.szeroka).length;

  return (
    <div className={`mt-4 ${kolumnyKart(pola)}`}>
      {opcje.map((o, miejsce) => (
        <KartaOdpowiedzi
          key={o.kod}
          opcja={o}
          wybrana={zaznaczona(o)}
          kwadrat={kwadrat}
          gesty={pola > 10}
          kadr={szerokoscKadru(pola)}
          zablokowana={zablokowana?.(o)}
          kolor={kolorWyboru(o.ikona ?? kluczKoloru, miejsce)}
          onClick={() => onClick(o)}
        />
      ))}
    </div>
  );
}

/**
 * Jedna karta odpowiedzi.
 *
 * Kadr dostaje każda zwykła odpowiedź, także ta, do której pliku jeszcze nie
 * ma: pusty kadr trzyma układ i pokazuje, gdzie grafika stanie, a karta bez
 * kadru obok karty z kadrem wyglądałaby jak inny rodzaj odpowiedzi.
 *
 * Wyjątkiem jest opcja wyłączna („nie wiem", „nic z tego", odmowa). To jest
 * wyjście z pytania, nie jedna z odpowiedzi, więc kadru nie dostaje, a jej
 * tekst staje na środku karty.
 */
function KartaOdpowiedzi({
  opcja,
  wybrana,
  kwadrat,
  zablokowana,
  gesty,
  kadr,
  kolor,
  onClick,
}: {
  opcja: OpcjaWyboru;
  wybrana: boolean;
  /** Zaznaczenie wielokrotne ma kwadrat, pojedyncze pierścień. */
  kwadrat?: boolean;
  /** Limit wyborów osiągnięty: karta nie reaguje, ale nie gaśnie. */
  zablokowana?: boolean;
  /**
   * Gęsta siatka, od jedenastu odpowiedzi w górę. Kafel ma wtedy 173 px
   * i etykieta w pełnym stopniu łamała się w środku wyrazu („matematyk/a").
   */
  gesty?: boolean;
  /** Szerokosc kadru w pikselach CSS: po niej przegladarka wybiera plik. */
  kadr?: number;
  kolor: Kolor | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={wybrana}
      disabled={zablokowana}
      /*
        Karta ma własne, kryjące tło. Wcześniej była przezroczysta, a biel
        dawała tylko stopka: przy krótkiej etykiecie obok tekstu prześwitywało
        tło strony i wyglądało to jak szary prostokąt w prawym dolnym rogu.

        `min-w-0`, bo element siatki ma domyślnie `min-width: auto` i długa
        etykieta rozpychała kafel ponad szerokość kolumny.
      */
      /*
        Zaznaczenie barwi całą kartę, nie prostokąt pod tekstem. Tinta na samej
        stopce rysowała wewnątrz karty drugi, zaokrąglony prostokąt, który
        kończył się w połowie i wyglądał jak szara plama obok etykiety.
      */
      className={`przejscie relative flex h-full min-w-0 flex-col overflow-hidden rounded-karta border-2 p-2 text-left active:scale-[0.995] ${
        opcja.szeroka ? "sm:col-span-2" : ""
      } ${
        wybrana
          ? "border-akcent bg-akcent-tlo/45"
          : zablokowana
            ? "cursor-not-allowed border-dashed border-linia bg-panel"
            : "border-linia bg-panel hover:border-linia-mocna"
      }`}
    >
      {/*
        Kadr jest neutralny, nie w kolorze miejsca. Osiem kart w ośmiu tintach
        czyta się jak osiem kategorii, a to są warianty jednej odpowiedzi.
        Kolor wróci wtedy, gdy w kadrze stanie zdjęcie.

        Opcja wyłączna („nie wiem", „nic z tego", odmowa) kadru nie dostaje.
        To jest wyjście z pytania, nie jedna z odpowiedzi, i kadr stawiałby ją
        na równi z treścią.
      */}
      {/*
        Zdjęcie stoi w karcie, nie na jej krawędzi: własna zaokrąglona ramka
        w proporcji 16:9, czyli tej, w której przychodzą wszystkie ilustracje.
        `object-contain` zamiast `object-cover`, żeby nawet źródło o innej
        proporcji weszło w całości, a nie wycinkiem.

        Opcja wyłączna („nie wiem", „nic z tego", odmowa) ramki nie dostaje.
        To jest wyjście z pytania, nie jedna z odpowiedzi.
      */}
      {opcja.ikona ? (
        <span
          aria-hidden
          className="flex aspect-[16/9] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-plyta text-atrament-slaby"
        >
          {maObraz(opcja.ikona) ? (
            <Obraz klucz={opcja.ikona} pelny kadr={kadr} wybor kolor={kolor} />
          ) : (
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m6 16 4-4 3 3 2.5-2.5L18 15" />
              <circle cx="9" cy="9.5" r="1.2" />
            </svg>
          )}
        </span>
      ) : null}
      {/*
        W gestej siatce stopka ma ciasniejsze wyscielenie: przy szesciu
        kolumnach na etykiete zostawalo 107 px, a „spoleczenstwie" ma 111 px
        i lamalo sie w srodku wyrazu na „spoleczenstwi/e".
      */}
      <span
        className={`relative flex flex-1 ${gesty ? "gap-1.5 px-1.5" : "gap-2.5 px-2.5"} ${
          opcja.ikona ? "items-start pb-0.5 pt-2.5" : "items-center py-3"
        }`}
      >
        <ZnakWyboru wybrana={wybrana} kwadrat={kwadrat} wRzedzie male={gesty} />
        <span className="min-w-0 flex-1">
          {opcja.nadpis ? (
            <span className="block text-drobne font-bold uppercase tracking-[0.14em] text-atrament-slaby">
              {opcja.nadpis}
            </span>
          ) : null}
          <span
            className={`block break-words font-boksowy font-semibold leading-snug text-atrament ${
              gesty ? "text-male" : "text-tresc"
            }`}
          >
            {opcja.etykieta}
          </span>
          {opcja.podpis ? (
            <span className="mt-0.5 block text-male font-normal leading-snug text-atrament-sciszony">
              {opcja.podpis}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}

// =====================================================================
// Ranking: układanie kolejności
// =====================================================================

/**
 * Zestaw czterech pozycji: siatka numerów 1–4.
 *
 * Uczestnik nie przestawia wierszy, tylko przypisuje każdemu zadaniu miejsce.
 * Wiersze stoją nieruchomo, więc nic nie skacze pod palcem — a kliknięcie
 * numeru zajętego przez inne zadanie **zamienia je miejscami**, zamiast
 * odmawiać. Zapis do bazy jest identyczny jak przy układaniu kolejności,
 * `{ identyfikator: miejsce 1-4 }`, więc silnik liczy dokładnie to samo
 * i cztery niezerowe wagi zostają.
 *
 * Wiersze są wizualnie identyczne i nie zmieniają koloru: kolor niesie
 * wyłącznie wybrany numer, ten sam we wszystkich czterech wierszach. Gdyby
 * wiersz miał własną barwę, różnica wyglądu przechylałaby wybór dokładnie tym
 * mechanizmem, przed którym broni reguła ochrony pomiaru.
 *
 * Nic nie zapisujemy, dopóki uczestnik nie ustawi czegoś sam: kolejność
 * startowa jest losowa, więc „Dalej" aktywne od razu pozwoliłoby przeklikać
 * trzydzieści sześć ekranów, oddając silnikowi czysty szum.
 */
function Ranking4({ pozycja, wartosc, naZmiane, naDomkniecie }: WlasciwosciPozycji) {
  // „1 najchętniej" → „najchętniej": numer stoi już w nagłówku kolumny.
  const podpisyKrancow = (pozycja.krance ?? ["", ""]).map((t) =>
    t.replace(/^\s*\d+\s*/, "").trim(),
  );
  const opcje = pozycja.opcje ?? [];
  const zapisane = (wartosc as Record<string, number> | undefined) ?? undefined;
  const kody = useMemo(
    () => kolejnoscDoPokazania(opcje.map((o) => o.kod), undefined),
    [opcje],
  );
  const poKodzie = useMemo(() => new Map(opcje.map((o) => [o.kod, o])), [opcje]);
  const ustawionych = zapisane ? Object.keys(zapisane).length : 0;

  /**
   * Przypisanie miejsca. Gdy numer jest zajęty, oba zadania wymieniają się
   * miejscami; gdy klikamy numer już nadany temu zadaniu, zdejmujemy go.
   */
  function ustaw(kod: string, numer: number) {
    const teraz: Record<string, number> = { ...(zapisane ?? {}) };
    const poprzedni = teraz[kod];
    if (poprzedni === numer) {
      delete teraz[kod];
    } else {
      const trzymajacy = Object.keys(teraz).find((k) => teraz[k] === numer && k !== kod);
      teraz[kod] = numer;
      if (trzymajacy) {
        if (poprzedni) teraz[trzymajacy] = poprzedni;
        else delete teraz[trzymajacy];
      }
    }
    if (Object.keys(teraz).length === opcje.length - 1) {
      const brakujacyKod = opcje.map((o) => o.kod).find((k) => teraz[k] === undefined);
      const brakujacyNumer = [1, 2, 3, 4]
        .slice(0, opcje.length)
        .find((n) => !Object.values(teraz).includes(n));
      if (brakujacyKod && brakujacyNumer) teraz[brakujacyKod] = brakujacyNumer;
    }
    naZmiane(Object.keys(teraz).length > 0 ? teraz : undefined);
    if (Object.keys(teraz).length === opcje.length) naDomkniecie?.();
  }

  return (
    <div className="szklo overflow-hidden p-0">
      {/* Szyna nagłówków: który numer co znaczy. Bez niej „1" jest tylko cyfrą. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 border-b border-linia bg-tlo/60 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_22rem] sm:px-7">
        <p className="text-drobne font-bold uppercase tracking-[0.18em] text-atrament-slaby">
          Zadanie
          {/* Na telefonie nie ma miejsca na cztery nagłówki kolumn, a bez nich
              „1" i „4" są samymi cyframi. Legenda mówi to samo w jednej linii. */}
          <span className="ml-2 font-semibold normal-case tracking-normal sm:hidden">
            · 1 {podpisyKrancow[0]}, 4 {podpisyKrancow[1]}
          </span>
        </p>
        <div className="hidden grid-cols-4 gap-3 text-center sm:grid">
          {[podpisyKrancow[0], "", "", podpisyKrancow[1]].map((podpis, i) => (
            <p key={i} className="text-drobne font-bold uppercase tracking-[0.14em] text-atrament-slaby">
              {i + 1}
              {podpis ? (
                <>
                  <br />
                  <span className="text-[0.7rem] tracking-[0.04em]">{podpis}</span>
                </>
              ) : null}
            </p>
          ))}
        </div>
      </div>

      <ul>
        {kody.map((kod) => {
          const o = poKodzie.get(kod);
          if (!o) return null;
          const teraz = zapisane?.[kod];
          return (
            <li
              key={kod}
              className={`grid grid-cols-[minmax(0,1fr)] items-center gap-4 border-t border-linia px-4 py-4 sm:grid-cols-[minmax(0,1fr)_22rem] sm:gap-5 sm:px-7 ${
                teraz ? "bg-akcent-tlo/30" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {o.ikona ? (
                  <Obraz klucz={o.ikona} rozmiar={64} aktywna={Boolean(teraz)} wybor />
                ) : null}
                <span className="min-w-0">
                  <span className="block text-tresc font-bold leading-snug text-atrament sm:text-tresc-duza">
                    {o.etykieta}
                  </span>
                  {o.podpis ? (
                    <span className="mt-1 block text-male leading-snug text-atrament-sciszony">
                      {o.podpis}
                    </span>
                  ) : null}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {[1, 2, 3, 4].map((n) => {
                  const wybrany = teraz === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => ustaw(kod, n)}
                      aria-pressed={wybrany}
                      aria-label={`${o.etykieta}: miejsce ${n} z 4${
                        n === 1 ? ", najchętniej" : n === 4 ? ", na końcu" : ""
                      }`}
                      className={`przejscie flex h-12 items-center justify-center rounded-2xl border-2 text-tresc font-extrabold tabular-nums sm:h-14 ${
                        wybrany
                          ? "przycisk-gradient border-transparent"
                          : "border-linia bg-tlo/70 text-atrament-slaby hover:border-linia-mocna hover:text-atrament"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Licznik i wyczyszczenie stoją pod siatką, bo dotyczą całego zestawu. */}
      <div className="flex items-center justify-between gap-4 border-t border-linia px-4 py-3 sm:px-7">
        <p className="text-male text-atrament-sciszony">
          <span className="font-bold tabular-nums text-atrament">{ustawionych}</span> z {opcje.length}{" "}
          ustawione
        </p>
        {ustawionych > 0 ? (
          <button
            type="button"
            onClick={() => naZmiane(undefined)}
            className="przejscie min-h-9 rounded-full border border-linia px-4 text-male font-semibold text-atrament-slaby hover:border-linia-mocna hover:text-atrament"
          >
            Wyczyść
          </button>
        ) : null}
      </div>
    </div>
  );
}

// =====================================================================
// Para: dwie karty obok siebie
// =====================================================================

function Para({ pozycja, wartosc, naZmiane, naDomkniecie, akcent }: WlasciwosciPozycji) {
  const cieply = akcent === "pomarancz";
  const strony = [pozycja.stronaA, pozycja.stronaB].filter(Boolean) as StronaPary[];

  function wybierz(kod: string) {
    naZmiane(kod);
    naDomkniecie?.();
  }

  /**
   * Dwie karty odpowiedzi, wizualnie identyczne.
   *
   * Ilustracja stoi nad nimi jako jeden wspólny pas (Runner), a nie na
   * kartach: karta jest tu samym zdaniem i kółkiem wyboru. Obie mają to samo
   * tło, tę samą ramkę i ten sam rozmiar — wybór JEST pomiarem, więc każda
   * różnica wyglądu przechylałaby wynik.
   */
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
      {strony.map((s, i) => {
        const wybrana = wartosc === s.kod;
        return (
          <button
            key={`${s.kod}-${i}`}
            type="button"
            onClick={() => wybierz(s.kod)}
            aria-pressed={wybrana}
            className={`przejscie relative flex min-h-[6rem] items-center justify-between gap-5 rounded-karta border-2 px-6 py-6 text-left sm:px-8 ${
              wybrana
                ? cieply
                  ? "border-pomarancz bg-pomarancz-tlo/70"
                  : "border-akcent bg-akcent-tlo/70"
                : "border-transparent bg-panel/80 hover:bg-panel"
            }`}
            style={
              wybrana
                ? undefined
                : { boxShadow: "0 8px 26px rgba(46, 60, 120, 0.07)" }
            }
          >
            {/* Nadpis i podpis niosą nazwę wartości albo etykietę oferty.
                Obie strony mają je zawsze albo żadna: brak po jednej stronie
                robiłby z niej odpowiedź gorzej opisaną, a wybór JEST pomiarem. */}
            <span className="flex min-w-0 flex-col gap-1.5">
              {s.nadpis ? (
                <span className="text-drobne font-bold uppercase tracking-[0.16em] text-atrament-slaby">
                  {s.nadpis}
                </span>
              ) : null}
              <span className="text-tresc-duza font-semibold leading-snug text-atrament sm:text-naglowek-maly">
                {s.tekst}
              </span>
              {s.podpis ? (
                <span className="text-drobne font-bold uppercase tracking-[0.16em] text-atrament-slaby">
                  {s.podpis}
                </span>
              ) : null}
            </span>
            <KolkoWyboru wybrana={wybrana} cieply={cieply} />
          </button>
        );
      })}
    </div>
  );
}

/** Pierścień wyboru: pusty przed, wypełniony gradientem po wybraniu. */
function KolkoWyboru({
  wybrana,
  cieply,
  barwa,
}: {
  wybrana: boolean;
  cieply?: boolean;
  /** Kolor pierścienia, gdy odpowiedź ma własną barwę (trzy stopnie A5). */
  barwa?: string;
}) {
  return (
    <span
      aria-hidden
      className={`przejscie relative flex h-8 w-8 shrink-0 rounded-full border-2 ${
        barwa ? "" : wybrana ? (cieply ? "border-pomarancz" : "border-akcent") : "border-linia-mocna"
      }`}
      style={barwa ? { borderColor: wybrana ? barwa : "var(--color-linia-mocna)" } : undefined}
    >
      {wybrana ? (
        <span
          className="absolute inset-1 rounded-full"
          style={{
            background: barwa
              ? barwa
              : cieply
                ? "linear-gradient(120deg, #b8460f, #c2185b)"
                : undefined,
          }}
        >
          {barwa || cieply ? null : (
            <span className="przycisk-gradient block h-full w-full rounded-full" />
          )}
        </span>
      ) : null}
    </span>
  );
}

function Skala5({ pozycja, wartosc, naZmiane, pierwsza, ostatnia, wSiatce, miejsce }: WlasciwosciPozycji) {
  const kolor = kolorWyboru(pozycja.ikona, miejsce);
  return (
    <div className={ramka(wSiatce, ostatnia)} style={stylBloku(pozycja.ikona, wSiatce, miejsce)}>
      {pozycja.tresc ? (
        <p className="mb-2 flex items-start gap-2.5 text-tresc leading-snug">
          {pozycja.ikona && wSiatce ? (
          <Ikona klucz={pozycja.ikona} rozmiar={36} wybor kolor={kolor} />
        ) : null}
          <span className="flex-1">{pozycja.tresc}</span>
        </p>
      ) : null}
      <SkalaPrzyciski
        wartosc={wartosc as number | undefined}
        naZmiane={naZmiane}
        krance={pierwsza ? pozycja.krance : undefined}
      />
    </div>
  );
}

function SkalaPrzyciski({
  wartosc,
  naZmiane,
  krance,
}: {
  wartosc: number | undefined;
  naZmiane: (v: number) => void;
  krance?: [string, string];
}) {
  return (
    <div className="max-w-md">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => naZmiane(n)}
            aria-label={`${n} z 5`}
            aria-pressed={wartosc === n}
            className={`przejscie h-11 flex-1 rounded-md border text-male tabular-nums ${
              wartosc === n
                ? "border-akcent bg-akcent text-na-akcencie"
                : "border-linia bg-szklo text-atrament-sciszony hover:border-linia-mocna"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {krance ? (
        <div className="mt-1 flex justify-between text-drobne text-atrament-slaby">
          <span>{krance[0]}</span>
          <span>{krance[1]}</span>
        </div>
      ) : null}
    </div>
  );
}

function Kotwica({ pozycja, wartosc, naZmiane, pierwsza, ostatnia, wSiatce, miejsce }: WlasciwosciPozycji) {
  const w = (wartosc as { skala?: number; probowal?: boolean }) ?? {};
  const kolor = kolorWyboru(pozycja.ikona, miejsce);
  return (
    <div className={ramka(wSiatce, ostatnia)} style={stylBloku(pozycja.ikona, wSiatce, miejsce)}>
      <p className="mb-2 flex items-start gap-2.5 text-tresc leading-snug">
        {pozycja.ikona && wSiatce ? (
          <Ikona klucz={pozycja.ikona} rozmiar={36} wybor kolor={kolor} />
        ) : null}
        <span className="flex-1">{pozycja.tresc}</span>
      </p>
      <SkalaPrzyciski
        wartosc={w.skala}
        naZmiane={(n) => naZmiane({ ...w, skala: n })}
        krance={pierwsza ? pozycja.krance : undefined}
      />
      <label className="mt-1.5 flex min-h-[2.5rem] cursor-pointer items-center gap-2.5 text-male text-atrament-slaby">
        <input
          type="checkbox"
          checked={Boolean(w.probowal)}
          onChange={(e) => naZmiane({ ...w, probowal: e.target.checked })}
          className="h-4.5 w-4.5 accent-[var(--color-akcent)]"
        />
        {pozycja.pytanieEkspozycja}
      </label>
    </div>
  );
}

function Trzystopniowa({
  pozycja,
  wartosc,
  naZmiane,
  naDomkniecie,
  pierwsza,
  ostatnia,
  wSiatce,
}: WlasciwosciPozycji) {
  const opcje = pozycja.opcje ?? [];
  // Jedyna pozycja na ekranie dostaje trzy duże karty. Ten sam komponent w
  // małym wydaniu obsługuje listy, gdzie stopnie stoją w jednym wierszu.
  const sama = Boolean(pierwsza && ostatnia && !wSiatce);

  if (sama) {
    /**
     * Trzy odpowiedzi jako trzy karty w rzędzie: znak, etykieta, podpis
     * i pierścień wyboru. Znak, nie ocena — żaden z trzech nie jest czerwony,
     * bo „To nie dla mnie" jest w tym module jedyną odpowiedzią, która usuwa
     * zawody bezwarunkowo, i nie wolno jej dokładać ładunku emocjonalnego.
     */
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {opcje.map((o, i) => {
          const wybrana = wartosc === o.kod;
          const barwa = BARWY_STOPNI[i] ?? BARWY_STOPNI[1];
          return (
            <button
              key={o.kod}
              type="button"
              onClick={() => {
                naZmiane(o.kod);
                naDomkniecie?.();
              }}
              aria-pressed={wybrana}
              className="przejscie relative flex min-h-[7rem] items-center gap-5 rounded-karta border-2 px-5 py-5 text-left sm:px-6"
              style={{
                background: barwa.tlo,
                borderColor: wybrana ? barwa.pelny : "transparent",
                boxShadow: wybrana
                  ? `0 10px 30px ${barwa.pelny}2e`
                  : "0 8px 24px rgba(46, 60, 120, 0.07)",
              }}
            >
              <ZnakStopnia ktory={i} wybrana={wybrana} barwa={barwa} />
              <span className="min-w-0 flex-1">
                <span className="block text-tresc-duza font-bold leading-tight text-atrament">
                  {o.etykieta}
                </span>
                {o.podpis ? (
                  <span className="mt-1.5 block text-male leading-snug text-atrament-sciszony">
                    {o.podpis}
                  </span>
                ) : null}
              </span>
              <KolkoWyboru wybrana={wybrana} barwa={barwa.pelny} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`sm:flex sm:items-center sm:gap-4 ${ramka(wSiatce, ostatnia)}`}>
      <p className="mb-2.5 flex-1 text-tresc leading-snug sm:mb-0">{pozycja.tresc}</p>
      <div className="flex shrink-0 gap-1.5">
        {opcje.map((o) => (
          <button
            key={o.kod}
            type="button"
            onClick={() => {
              naZmiane(o.kod);
              naDomkniecie?.();
            }}
            aria-pressed={wartosc === o.kod}
            className={`przejscie boks h-11 min-w-[4.5rem] rounded-xl border-2 px-3 text-male font-semibold ${
              wartosc === o.kod
                ? "border-akcent bg-akcent text-na-akcencie"
                : "border-linia bg-panel text-atrament-sciszony hover:border-linia-mocna hover:text-atrament"
            }`}
          >
            {o.etykieta}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Trzy barwy trzech stopni: zielona, niebieska, ciepła.
 *
 * Trzy identyczne karty czytały się jak jedna odpowiedź powtórzona trzy razy;
 * kolor daje im od razu rozróżnienie, jeszcze zanim ktoś przeczyta etykiety.
 *
 * Trzeci stopień jest ceglasty, nie czerwony, i to nie jest kosmetyka:
 * „To nie dla mnie" jest w tym module jedyną odpowiedzią, która usuwa zawody
 * bezwarunkowo, więc nie wolno jej dokładać ładunku emocjonalnego. Wszystkie
 * trzy pary (pełny kolor pod białym znakiem, atrament na tle karty) stoją
 * w PARY_KOLOROW i przechodzą 4,5:1.
 */
const BARWY_STOPNI = [
  { tlo: "#e3faed", pelny: "#067a45" },
  { tlo: "#e9f0ff", pelny: "#0a3ac9" },
  { tlo: "#fff1e8", pelny: "#b8460f" },
];

/** Trzy stopnie: ptaszek, fala, krzyżyk. Znak, nie ocena: żaden nie jest czerwony. */
function ZnakStopnia({
  ktory,
  wybrana,
  barwa,
}: {
  ktory: number;
  wybrana: boolean;
  barwa: { tlo: string; pelny: string };
}) {
  const SCIEZKI = [
    "M5 12.5 9.5 17 19 7",
    "M4 12c2.5-4 5-4 8 0s5.5 4 8 0",
    "M7 7l10 10M17 7 7 17",
  ];
  return (
    <span
      aria-hidden
      className="przejscie flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
      style={{
        // Zaznaczenie odwraca znak: biały na pełnym kolorze zamiast koloru
        // na bieli. Widać je z drugiego końca ekranu i nie zależy od samego
        // obramowania karty.
        background: wybrana ? barwa.pelny : "#ffffff",
        color: wybrana ? "#ffffff" : barwa.pelny,
      }}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={SCIEZKI[ktory] ?? SCIEZKI[1]} />
      </svg>
    </span>
  );
}

// =====================================================================
// Jeden z wielu i kilka z wielu
// =====================================================================

function Pojedynczy({ pozycja, wartosc, naZmiane, kluczKoloru }: WlasciwosciPozycji) {
  return (
    <fieldset>
      {pozycja.tresc ? (
        <legend className="mb-1 text-tresc-duza font-semibold leading-snug text-atrament">{pozycja.tresc}</legend>
      ) : null}
      {pozycja.podpis ? (
        <p className="mb-3 max-w-czytelna text-male text-atrament-sciszony">{pozycja.podpis}</p>
      ) : null}
      {pozycja.uklad === "karty" ? (
        <KartyOdpowiedzi
          opcje={pozycja.opcje ?? []}
          kluczKoloru={kluczKoloru}
          zaznaczona={(o) => wartosc === o.kod}
          onClick={(o) => naZmiane(o.kod)}
        />
      ) : (
      <div className={`mt-3 gap-2.5 ${kolumnyOpcji(pozycja.opcje?.length ?? 0)}`}>
        {(pozycja.opcje ?? []).map((o, miejsce) => {
          const kolor = kolorWyboru(kluczKoloru, miejsce);
          const wybrana = wartosc === o.kod;
          return (
            <button
              key={o.kod}
              type="button"
              onClick={() => naZmiane(o.kod)}
              aria-pressed={wybrana}
              className={`${klasyKarty(wybrana)} flex min-h-[3.5rem] items-center gap-3 py-3 pl-4 pr-12`}
              style={stylKarty(kolor, wybrana)}
            >
              <ZnakWyboru wybrana={wybrana} />
              <span className="min-w-0 flex-1 font-boksowy text-tresc font-medium leading-snug text-atrament">
                {o.etykieta}
                {o.podpis ? (
                  <span className="mt-0.5 block text-male font-normal text-atrament-sciszony">{o.podpis}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
      )}
    </fieldset>
  );
}

function Wielokrotny({ pozycja, wartosc, naZmiane, kluczKoloru }: WlasciwosciPozycji) {
  const wybrane = ((wartosc as string[]) ?? []).slice();
  const maks = pozycja.dokladnie ?? pozycja.maksWyborow;

  function przelacz(kod: string, wylaczna?: boolean) {
    if (wybrane.includes(kod)) {
      naZmiane(wybrane.filter((x) => x !== kod));
      return;
    }
    if (wylaczna) {
      naZmiane([kod]);
      return;
    }
    const bezWylacznych = wybrane.filter(
      (x) => !(pozycja.opcje ?? []).find((o) => o.kod === x)?.wylaczna,
    );
    if (maks && bezWylacznych.length >= maks) return;
    naZmiane([...bezWylacznych, kod]);
  }

  const limit = maks ? `${wybrane.length} z ${maks}` : null;

  return (
    <fieldset>
      {pozycja.tresc ? (
        <legend className="mb-1 text-tresc-duza font-semibold leading-snug text-atrament">{pozycja.tresc}</legend>
      ) : null}
      {pozycja.podpis ? (
        <p className="mb-3 max-w-czytelna text-male text-atrament-sciszony">{pozycja.podpis}</p>
      ) : null}
      {limit ? (
        <p className="mb-3 text-drobne tabular-nums text-atrament-slaby">Wybrano {limit}</p>
      ) : null}
      {pozycja.uklad === "karty" ? (
        /*
          Opcje wyłączne („nie wiem", „nic z tego", odmowa) stoją pod siatką
          jako osobne, szerokie paski. W siatce dostawałyby wysokość rzędu
          wyrównanego do kafli z kadrem, czyli wysoką pustą ramkę; a poza nią
          są tym, czym są: wyjściem z pytania, nie jedną z odpowiedzi.
        */
        <KartyOdpowiedzi
          opcje={pozycja.opcje ?? []}
          kluczKoloru={kluczKoloru}
          kwadrat
          zaznaczona={(o) => wybrane.includes(o.kod)}
          zablokowana={(o) =>
            !wybrane.includes(o.kod) && Boolean(maks) && wybrane.length >= (maks ?? 0) && !o.wylaczna
          }
          onClick={(o) => przelacz(o.kod, o.wylaczna)}
        />
      ) : (
      <div className={`mt-2 gap-2.5 ${kolumnyOpcji(pozycja.opcje?.length ?? 0)}`}>
        {(pozycja.opcje ?? []).map((o, miejsce) => {
          const zaznaczona = wybrane.includes(o.kod);
          const zablokowana = !zaznaczona && Boolean(maks) && wybrane.length >= (maks ?? 0) && !o.wylaczna;
          const kolor = kolorWyboru(o.ikona ?? kluczKoloru, miejsce);
          return (
            <button
              key={o.kod}
              type="button"
              onClick={() => przelacz(o.kod, o.wylaczna)}
              aria-pressed={zaznaczona}
              disabled={zablokowana}
              // Zablokowana karta bez przezroczystosci: `opacity-40` zabiera
              // tekstowi kontrast ponizej progu. Stan niesie kursor i to, ze
              // przycisk nie reaguje, a nie przygaszony napis.
              className={`${klasyKarty(zaznaczona)} flex min-h-[3.5rem] items-center gap-3 py-3 pl-4 pr-12 ${
                zablokowana ? "cursor-not-allowed border-dashed" : ""
              }`}
              style={stylKarty(kolor, zaznaczona)}
            >
              <ZnakWyboru wybrana={zaznaczona} kwadrat />
              {o.ikona ? <Ikona klucz={o.ikona} rozmiar={40} aktywna={zaznaczona} wybor kolor={kolor} /> : null}
              <span className="min-w-0 flex-1 font-boksowy text-tresc font-medium leading-snug text-atrament">
                {o.etykieta}
                {o.podpis ? (
                  <span className="mt-0.5 block text-male font-normal text-atrament-sciszony">{o.podpis}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
      )}
    </fieldset>
  );
}

function Dowody({ pozycja, wartosc, naZmiane, ostatnia, wSiatce, miejsce }: WlasciwosciPozycji) {
  const zaznaczone = (wartosc as boolean[]) ?? [false, false, false];
  const id = useId();
  const kolor = kolorWyboru(pozycja.ikona, miejsce);
  return (
    <div className={ramka(wSiatce, ostatnia)} style={stylBloku(pozycja.ikona, wSiatce, miejsce)}>
      <p className="flex items-start gap-2.5 text-tresc font-medium">
        {pozycja.ikona && wSiatce ? (
          <Ikona klucz={pozycja.ikona} rozmiar={36} wybor kolor={kolor} />
        ) : null}
        <span className="flex-1">{pozycja.tresc}</span>
      </p>
      <p className="mt-0.5 max-w-czytelna text-male text-atrament-sciszony">{pozycja.podpis}</p>
      <div className="mt-2.5 flex flex-col gap-1">
        {(pozycja.pola ?? []).map((pole, i) => (
          <label
            key={`${id}-${i}`}
            className="flex min-h-[2.5rem] cursor-pointer items-center gap-2.5 text-male text-atrament-sciszony"
          >
            <input
              type="checkbox"
              checked={Boolean(zaznaczone[i])}
              onChange={(e) => {
                const nowe = [...zaznaczone];
                nowe[i] = e.target.checked;
                naZmiane(nowe);
              }}
              className="h-5 w-5 accent-[var(--color-akcent)]"
            />
            {pole}
          </label>
        ))}
      </div>
    </div>
  );
}

function PoleTekstowe({ pozycja, wartosc, naZmiane }: WlasciwosciPozycji) {
  return (
    <div>
      {pozycja.tresc ? (
        <label className="mb-2 block max-w-czytelna text-tresc leading-snug" htmlFor={pozycja.id}>
          {pozycja.tresc}
        </label>
      ) : null}
      {pozycja.podpis ? (
        <p className="mb-2 max-w-czytelna text-male text-atrament-sciszony">{pozycja.podpis}</p>
      ) : null}
      <textarea
        id={pozycja.id}
        value={(wartosc as string) ?? ""}
        onChange={(e) => naZmiane(e.target.value)}
        rows={pozycja.duze ? 10 : 4}
        className="w-full max-w-artykul szklo p-3.5 text-tresc leading-relaxed placeholder:text-atrament-slaby"
        placeholder="Pisz krótko, hasłami. Nie musi być pełnymi zdaniami."
      />
    </div>
  );
}

function KilkaTekstow({ pozycja, wartosc, naZmiane }: WlasciwosciPozycji) {
  const zdania = pozycja.zdania ?? [];
  const wartosci = ((wartosc as string[]) ?? []).slice();
  return (
    <div className="flex flex-col gap-5">
      {zdania.map((zdanie, i) => (
        <div key={zdanie}>
          <label className="mb-1.5 block max-w-czytelna text-tresc" htmlFor={`${pozycja.id}-${i}`}>
            {zdanie}
          </label>
          <textarea
            id={`${pozycja.id}-${i}`}
            value={wartosci[i] ?? ""}
            onChange={(e) => {
              const nowe = [...wartosci];
              while (nowe.length < zdania.length) nowe.push("");
              nowe[i] = e.target.value;
              naZmiane(nowe);
            }}
            rows={2}
            className="w-full max-w-artykul szklo p-3 text-tresc leading-relaxed"
          />
        </div>
      ))}
    </div>
  );
}
