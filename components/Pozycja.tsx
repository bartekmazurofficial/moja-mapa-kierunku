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

import { useId } from "react";
import type { Pozycja as PozycjaDef } from "@/lib/moduly/typy";
import { Ikona, Obraz } from "@/components/Ikona";
import { kolorWyboru, paraWyboru, type Kolor } from "@/lib/ui/kolory";
import { dopelnijOstatni, nadajNumer, wlascicieleNumerow } from "@/lib/moduly/ranking";
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
  return `przejscie relative w-full rounded-2xl border-2 text-left active:scale-[0.995] ${
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
function ZnakWyboru({ wybrana, kwadrat }: { wybrana: boolean; kwadrat?: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center border-2 ${
        kwadrat ? "rounded-lg" : "rounded-full"
      } ${wybrana ? "przycisk-gradient border-transparent" : "border-linia-mocna bg-panel/80"}`}
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

// =====================================================================
// Ranking: cztery wiersze, numer z lewej, przyciski numerów z prawej
// =====================================================================

/**
 * Zestaw czterech pozycji jako cztery wiersze.
 *
 * Wiersz ma z lewej kółko z nadanym numerem, obok znak kategorii i treść,
 * z prawej cztery przyciski numerów. Kolejność wierszy jest kolejnością z
 * planu i nie zmienia się po nadaniu numeru: przestawianie wierszy pod ręką
 * wyglądałoby jak awaria. Kolor wiersza bierze się z miejsca, nie z kategorii.
 */
function Ranking4({ pozycja, wartosc, naZmiane, naDomkniecie }: WlasciwosciPozycji) {
  const ranking = (wartosc as Record<string, number>) ?? {};
  const opcje = pozycja.opcje ?? [];
  const ile = opcje.length;
  const wlasciciel = wlascicieleNumerow(ranking);

  function ustaw(kod: string, numer: number) {
    // Ponowne stuknięcie we własny numer go zdejmuje. Wtedy nie wolno domykać,
    // bo numer wskakiwałby z powrotem i nie dałoby się niczego cofnąć.
    const zdejmowanie = ranking[kod] === numer;
    const nadane = nadajNumer(ranking, kod, numer);
    const nowy = zdejmowanie ? nadane : dopelnijOstatni(nadane, opcje.map((o) => o.kod));
    naZmiane(nowy);
    if (Object.keys(nowy).length === ile) naDomkniecie?.();
  }

  return (
    <div>
      {pozycja.krance ? (
        <p className="mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-drobne text-atrament-sciszony">
          {pozycja.krance.map((k, i) => {
            const spacja = k.indexOf(" ");
            const cyfra = spacja > 0 ? k.slice(0, spacja) : k;
            const slowo = spacja > 0 ? k.slice(spacja + 1) : "";
            return (
              <span key={k} className="inline-flex items-center gap-1.5">
                {i > 0 ? <span aria-hidden className="mr-1 text-atrament-slaby">·</span> : null}
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-linia-mocna bg-panel font-bold tabular-nums">
                  {cyfra}
                </span>
                {slowo}
              </span>
            );
          })}
        </p>
      ) : null}

      <ul className="flex flex-col gap-2.5">
        {opcje.map((o, miejsce) => {
          const numer = ranking[o.kod];
          const kolor = kolorWyboru(o.ikona, miejsce);
          return (
            <li
              key={o.kod}
              className="przejscie flex flex-wrap items-center gap-3 rounded-2xl border-2 p-3 sm:flex-nowrap sm:p-3.5"
              style={{
                borderColor: kolor ? (numer ? kolor.neon : kolor.obwod) : numer ? "var(--color-akcent)" : "var(--color-linia)",
                background: kolor ? kolor.tlo : "var(--color-szklo)",
                boxShadow: numer && kolor ? `0 14px 30px -20px ${kolor.neon}` : undefined,
              }}
            >
              {/* Nadany numer. Puste kółko mówi „to jeszcze czeka". */}
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-tresc-duza font-extrabold tabular-nums"
                style={{
                  borderColor: kolor ? kolor.obwod : "var(--color-linia-mocna)",
                  background: numer ? (kolor ? kolor.atrament : "var(--color-akcent)") : "#ffffff",
                  color: numer ? "#ffffff" : "var(--color-atrament-slaby)",
                }}
              >
                {numer ?? ""}
              </span>

              {o.ikona ? <Obraz klucz={o.ikona} rozmiar={56} aktywna={Boolean(numer)} wybor kolor={kolor} /> : null}

              <span className="min-w-0 flex-1 font-boksowy text-tresc font-medium leading-snug text-atrament">
                {o.etykieta}
              </span>

              <div
                role="group"
                aria-label={o.etykieta}
                className="flex basis-full justify-end gap-1.5 sm:basis-auto"
              >
                {Array.from({ length: ile }, (_, i) => i + 1).map((n) => {
                  const wybrany = numer === n;
                  const uKogosInnego = wlasciciel.get(n) !== undefined && !wybrany;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => ustaw(o.kod, n)}
                      aria-pressed={wybrany}
                      aria-label={`${o.etykieta}: miejsce ${n}`}
                      className={`przejscie h-10 w-10 rounded-xl border text-male font-bold tabular-nums ${
                        wybrany
                          ? `text-na-akcencie ${kolor ? "" : "border-akcent bg-akcent"}`
                          : uKogosInnego
                            ? "border-linia bg-panel/60 text-atrament-slaby opacity-45"
                            : "border-linia-mocna bg-panel text-atrament-sciszony hover:text-atrament"
                      }`}
                      style={
                        wybrany && kolor
                          ? // Pelny kolor to atrament kategorii, nie neon: bialy
                            // numer na neonowym zoltym ma 1,7:1 i znika.
                            { background: kolor.atrament, borderColor: kolor.atrament }
                          : undefined
                      }
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
    </div>
  );
}

// =====================================================================
// Para: dwie karty obok siebie
// =====================================================================

function Para({ pozycja, wartosc, naZmiane, naDomkniecie, kluczKoloru }: WlasciwosciPozycji) {
  const strony = [pozycja.stronaA, pozycja.stronaB].filter(Boolean) as Array<{
    kod: string;
    tekst: string;
    ikona?: string;
  }>;
  const wlasne =
    pozycja.stronaA?.ikona && pozycja.stronaB?.ikona
      ? ([kolorWyboru(pozycja.stronaA.ikona, 0), kolorWyboru(pozycja.stronaB.ikona, 1)] as const)
      : null;
  const kolory =
    wlasne?.[0] && wlasne[1] && wlasne[0].kod !== wlasne[1].kod
      ? ([wlasne[0], wlasne[1]] as const)
      : paraWyboru(kluczKoloru);

  function wybierz(kod: string) {
    naZmiane(kod);
    naDomkniecie?.();
  }

  /**
   * Znak przy odpowiedzi tylko wtedy, gdy strony mają różne. W A3 i M1 obie
   * strony to dwa bieguny jednej osi i dostają ten sam znak, a dwa identyczne
   * znaczki niczego nie rozróżniają.
   */
  const zeZnakiem = strony.length === 2 && strony[0].ikona !== strony[1].ikona;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {strony.map((s, i) => {
        const wybrana = wartosc === s.kod;
        const kolor = kolory ? kolory[i] : null;
        return (
          <button
            key={`${s.kod}-${i}`}
            type="button"
            onClick={() => wybierz(s.kod)}
            aria-pressed={wybrana}
            className={`${klasyKarty(wybrana)} flex min-h-[9rem] flex-col items-center justify-center gap-3 px-4 pb-5 pt-9 sm:min-h-[11rem] sm:px-6`}
            style={stylKarty(kolor, wybrana)}
          >
            <ZnakWyboru wybrana={wybrana} />
            {zeZnakiem && s.ikona ? <KolkoZnaku klucz={s.ikona} kolor={kolor} /> : null}
            <span className="boks text-tresc leading-snug text-atrament sm:text-tresc-duza">{s.tekst}</span>
          </button>
        );
      })}
    </div>
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
    return (
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {opcje.map((o, i) => {
          const wybrana = wartosc === o.kod;
          return (
            <button
              key={o.kod}
              type="button"
              onClick={() => {
                naZmiane(o.kod);
                naDomkniecie?.();
              }}
              aria-pressed={wybrana}
              className={`${klasyKarty(wybrana)} flex flex-col items-center gap-3 px-2 pb-5 pt-9 sm:px-4`}
              style={stylKarty(null, wybrana)}
            >
              <ZnakWyboru wybrana={wybrana} />
              <ZnakStopnia ktory={i} wybrana={wybrana} />
              <span className="boks text-tresc font-bold text-atrament sm:text-tresc-duza">{o.etykieta}</span>
              {o.podpis ? (
                <span className="boks -mt-1.5 text-drobne font-normal text-atrament-sciszony sm:text-male">
                  {o.podpis}
                </span>
              ) : null}
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

/** Trzy stopnie: ptaszek, fala, krzyżyk. Znak, nie ocena: żaden nie jest czerwony. */
function ZnakStopnia({ ktory, wybrana }: { ktory: number; wybrana: boolean }) {
  const SCIEZKI = [
    "M5 12.5 9.5 17 19 7",
    "M4 12c2.5-4 5-4 8 0s5.5 4 8 0",
    "M7 7l10 10M17 7 7 17",
  ];
  return (
    <span
      aria-hidden
      className={`flex h-14 w-14 items-center justify-center rounded-full ${
        wybrana ? "przycisk-gradient" : "bg-akcent-tlo text-akcent-jasny"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
              className={`${klasyKarty(zaznaczona)} flex min-h-[3.5rem] items-center gap-3 py-3 pl-4 pr-12 ${
                zablokowana ? "opacity-40" : ""
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
