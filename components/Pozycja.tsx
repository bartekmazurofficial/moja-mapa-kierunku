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
import { Baner, Ikona } from "@/components/Ikona";
import { nadajNumer, wlascicieleNumerow } from "@/lib/moduly/ranking";
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
 * Obramowanie pozycji. W jednej kolumnie wystarcza kreska u dolu; w siatce
 * kolumn kreska nie wiadomo czego dotyczy, wiec pozycja dostaje wlasna ramke.
 */
function ramka(wSiatce: boolean | undefined, ostatnia: boolean | undefined): string {
  if (wSiatce) return "h-full rounded-xl border border-linia bg-tlo/35 p-4";
  return ostatnia ? "" : "border-b border-linia pb-5";
}

/**
 * Dziewiec opcji jedna pod druga to sciana tekstu, przez ktora trzeba
 * przewijac. Od pieciu wzwyz ukladamy je w dwie kolumny; na telefonie
 * zostaje jedna, bo dwie nie zmieszcza sie z czytelna etykieta.
 */
function kolumnyOpcji(ile: number): string {
  return ile > 4 ? "grid sm:grid-cols-2" : "flex flex-col";
}

const KAFELEK =
  "przejscie w-full min-h-[3rem] rounded-lg border bg-szklo px-4 py-3 text-left text-tresc " +
  "hover:border-linia-mocna active:scale-[0.995]";

function Ranking4({ pozycja, wartosc, naZmiane, naDomkniecie }: WlasciwosciPozycji) {
  const ranking = (wartosc as Record<string, number>) ?? {};
  const opcje = pozycja.opcje ?? [];
  const ile = opcje.length;
  const wlasciciel = wlascicieleNumerow(ranking);

  function ustaw(kod: string, numer: number) {
    const nowy = nadajNumer(ranking, kod, numer);
    naZmiane(nowy);
    if (Object.keys(nowy).length === ile) naDomkniecie?.();
  }

  return (
    <div>
      {pozycja.krance ? (
        <p className="mb-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-center text-drobne text-atrament-slaby">
          <span>{pozycja.krance[0]}</span>
          <span>{pozycja.krance[1]}</span>
        </p>
      ) : null}

      {/* Cztery kafle w dwóch rzędach po dwa. Na telefonie jeden pod drugim:
          przy dwóch kolumnach cztery przyciski numerów zeszłyby poniżej
          czterdziestu czterech pikseli, czyli poniżej progu dotyku. */}
      <ul className="mx-auto grid max-w-3xl gap-2.5 sm:grid-cols-2">
        {opcje.map((o) => {
          const numer = ranking[o.kod];
          return (
            <li
              key={o.kod}
              className={`przejscie flex flex-col rounded-xl border bg-szklo p-3 ${
                numer ? "border-akcent bg-akcent-tlo" : "border-linia"
              }`}
            >
              <div className="flex flex-1 flex-col">
                {o.ikona ? <Baner klucz={o.ikona} wysokosc={104} aktywna={Boolean(numer)} /> : null}
                <span className="mt-2.5 flex-1 text-center text-tresc leading-snug">
                  {o.etykieta}
                </span>
              </div>

              <div
                role="group"
                aria-label={o.etykieta}
                className="mt-3 flex justify-center gap-1.5 border-t border-linia pt-2.5"
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
                      className={`przejscie h-11 w-11 rounded-lg border text-tresc font-bold tabular-nums ${
                        wybrany
                          ? "border-akcent bg-akcent text-na-akcencie"
                          : uKogosInnego
                            ? "border-linia text-atrament-slaby opacity-45"
                            : "border-linia-mocna text-atrament-sciszony hover:border-akcent/60 hover:text-akcent-jasny"
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
    </div>
  );
}

function Para({ pozycja, wartosc, naZmiane, naDomkniecie }: WlasciwosciPozycji) {
  const strony = [pozycja.stronaA, pozycja.stronaB].filter(Boolean) as Array<{
    kod: string;
    tekst: string;
  }>;

  function wybierz(kod: string) {
    naZmiane(kod);
    naDomkniecie?.();
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {strony.map((s, i) => (
        <button
          key={`${s.kod}-${i}`}
          type="button"
          onClick={() => wybierz(s.kod)}
          aria-pressed={wartosc === s.kod}
          className={`${KAFELEK} min-h-[5.5rem] sm:min-h-[8rem] ${
            wartosc === s.kod ? "border-akcent bg-akcent-tlo" : "border-linia"
          }`}
        >
          <span className="leading-snug">{s.tekst}</span>
        </button>
      ))}
    </div>
  );
}

function Skala5({ pozycja, wartosc, naZmiane, pierwsza, ostatnia, wSiatce }: WlasciwosciPozycji) {
  return (
    <div className={ramka(wSiatce, ostatnia)}>
      {pozycja.tresc ? (
        <p className="mb-2 text-tresc leading-snug">{pozycja.tresc}</p>
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

function Kotwica({ pozycja, wartosc, naZmiane, pierwsza, ostatnia, wSiatce }: WlasciwosciPozycji) {
  const w = (wartosc as { skala?: number; probowal?: boolean }) ?? {};
  return (
    <div className={ramka(wSiatce, ostatnia)}>
      <p className="mb-2 text-tresc leading-snug">{pozycja.tresc}</p>
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
  // Jedyna pozycja na ekranie dostaje cały ekran: duże zdanie i trzy duże
  // przyciski pośrodku. Ten sam komponent w małym wydaniu obsługuje listy.
  const sama = Boolean(pierwsza && ostatnia && !wSiatce);

  const przycisk = (o: { kod: string; etykieta: string }) => (
    <button
      key={o.kod}
      type="button"
      onClick={() => {
        naZmiane(o.kod);
        naDomkniecie?.();
      }}
      aria-pressed={wartosc === o.kod}
      className={`przejscie rounded-xl border font-semibold ${
        sama ? "min-h-14 min-w-[7rem] px-6 text-tresc-duza" : "h-11 min-w-[4.5rem] px-3 text-male"
      } ${
        wartosc === o.kod
          ? "border-akcent bg-akcent text-na-akcencie"
          : "border-linia-mocna bg-szklo text-atrament-sciszony hover:border-akcent/55 hover:text-akcent-jasny"
      }`}
    >
      {o.etykieta}
    </button>
  );

  if (sama) {
    return (
      <div className="mx-auto max-w-czytelna text-center">
        <p className="text-naglowek-maly font-bold leading-snug text-atrament">{pozycja.tresc}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">{opcje.map(przycisk)}</div>
      </div>
    );
  }

  return (
    <div className={`sm:flex sm:items-center sm:gap-4 ${ramka(wSiatce, ostatnia)}`}>
      <p className="mb-2.5 flex-1 text-tresc leading-snug sm:mb-0">{pozycja.tresc}</p>
      <div className="flex shrink-0 gap-1.5">{opcje.map(przycisk)}</div>
    </div>
  );
}

function Pojedynczy({ pozycja, wartosc, naZmiane }: WlasciwosciPozycji) {
  return (
    <fieldset>
      {pozycja.tresc ? (
        <legend className="mb-1 text-tresc-duza leading-snug">{pozycja.tresc}</legend>
      ) : null}
      {pozycja.podpis ? (
        <p className="mb-3 max-w-czytelna text-male text-atrament-sciszony">{pozycja.podpis}</p>
      ) : null}
      <div className={`mt-3 gap-2 ${kolumnyOpcji(pozycja.opcje?.length ?? 0)}`}>
        {(pozycja.opcje ?? []).map((o) => (
          <button
            key={o.kod}
            type="button"
            onClick={() => naZmiane(o.kod)}
            aria-pressed={wartosc === o.kod}
            className={`${KAFELEK} flex items-center gap-3 ${
              wartosc === o.kod ? "border-akcent bg-akcent-tlo" : "border-linia"
            }`}
          >
            <span
              aria-hidden
              className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                wartosc === o.kod ? "border-akcent bg-akcent" : "border-linia-mocna"
              }`}
            />
            <span className="min-w-0 flex-1 leading-snug">
              {o.etykieta}
              {o.podpis ? (
                <span className="mt-0.5 block text-male text-atrament-sciszony">{o.podpis}</span>
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Wielokrotny({ pozycja, wartosc, naZmiane }: WlasciwosciPozycji) {
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
        <legend className="mb-1 text-tresc-duza leading-snug">{pozycja.tresc}</legend>
      ) : null}
      {pozycja.podpis ? (
        <p className="mb-3 max-w-czytelna text-male text-atrament-sciszony">{pozycja.podpis}</p>
      ) : null}
      {limit ? (
        <p className="mb-3 text-drobne tabular-nums text-atrament-slaby">Wybrano {limit}</p>
      ) : null}
      <div className={`mt-2 gap-2 ${kolumnyOpcji(pozycja.opcje?.length ?? 0)}`}>
        {(pozycja.opcje ?? []).map((o) => {
          const zaznaczona = wybrane.includes(o.kod);
          const zablokowana = !zaznaczona && Boolean(maks) && wybrane.length >= (maks ?? 0) && !o.wylaczna;
          return (
            <button
              key={o.kod}
              type="button"
              onClick={() => przelacz(o.kod, o.wylaczna)}
              aria-pressed={zaznaczona}
              disabled={zablokowana}
              className={`${KAFELEK} flex items-center gap-3 ${
                zaznaczona ? "border-akcent bg-akcent-tlo" : "border-linia"
              } ${zablokowana ? "opacity-40" : ""}`}
            >
              <span
                aria-hidden
                className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border-2 ${
                  zaznaczona ? "border-akcent bg-akcent text-na-akcencie" : "border-linia-mocna"
                }`}
              >
                {zaznaczona ? (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 6.5 4.5 9 10 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </span>
              {o.ikona ? <Ikona klucz={o.ikona} rozmiar={44} aktywna={zaznaczona} /> : null}
              <span className="min-w-0 flex-1 leading-snug">
                {o.etykieta}
                {o.podpis ? (
                  <span className="mt-0.5 block text-male text-atrament-sciszony">{o.podpis}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Dowody({ pozycja, wartosc, naZmiane, ostatnia, wSiatce }: WlasciwosciPozycji) {
  const zaznaczone = (wartosc as boolean[]) ?? [false, false, false];
  const id = useId();
  return (
    <div className={ramka(wSiatce, ostatnia)}>
      <p className="text-tresc font-medium">{pozycja.tresc}</p>
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
