"use client";

/**
 * Uniwersalny komponent pozycji assessmentowej.
 *
 * Jeden punkt wejscia dla czterech typow, ktore wystepuja w programie. Kazdy
 * ma wlasny renderer, ale wszystkie maja ten sam kontrakt: dostaja wartosc
 * i oddaja nowa wartosc.
 *
 * Elementy dotykowe maja minimum 44 piksele. Zaden typ nie uzywa samego
 * koloru jako nosnika informacji.
 */

import { useId, useMemo } from "react";
import type { OpcjaWyboru, Pozycja as PozycjaDef } from "@/lib/moduly/typy";
import { Ikona, Obraz } from "@/components/Ikona";
import { kluczBieguna, maObraz } from "@/lib/ui/obrazy";
import { kolorWyboru, type Kolor } from "@/lib/ui/kolory";
import { Kolejnosc, LejWyboru } from "@/components/moduly/Lej";
import { PanelBudzetu } from "@/components/moduly/PanelBudzetu";
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
}

export function Pozycja(props: WlasciwosciPozycji) {
  switch (props.pozycja.typ) {
    case "pojedynczy":
      return <Pojedynczy {...props} />;
    case "lej":
      return <LejWyboru {...props} />;
    case "kolejnosc":
      return <Kolejnosc {...props} />;
    case "progi":
      return <PanelBudzetu {...props} />;
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
 * ten sam we wszystkich modułach. Grubość krawędzi jest stała, więc
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

