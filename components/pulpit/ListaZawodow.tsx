"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pasmo } from "@/components/raport/Sekcje";
import { kolorKategorii } from "@/lib/ui/kolory";
import { POZIOM, STUDIA } from "@/lib/karty/etykiety";
import type { ZawodWRaporcie } from "@/lib/raport/typy";

/**
 * Lista kart zawodów: pogrupowana, z filtrami i z wejściem w porównanie.
 *
 * Uczestnik, który dostaje kilkadziesiąt pozycji naraz, nie czyta żadnej.
 * Program obiecuje uporządkowanie, a lista bez grupowania jest jego
 * zaprzeczeniem. Dlatego karty stoją w grupach obszarów, obszary z czołówki
 * uczestnika są otwarte, a reszta czeka pod jednym przyciskiem.
 *
 * Tu kolor kategorii jest na miejscu: uczestnik zna już swój wynik, więc kolor
 * niesie informację, zamiast ją podpowiadać (inaczej niż na ekranach wyboru,
 * patrz lib/ui/kolory.ts).
 */

export interface ZawodNaLiscie extends ZawodWRaporcie {
  klaster: string | null;
}

interface Grupa {
  obszarId: number;
  nazwa: string;
  zawody: ZawodNaLiscie[];
}

const FILTRY = [
  {
    kod: "bez_studiow",
    etykieta: "bez wymaganych studiów",
    // „Częściowo" zostaje: to są zawody, do których da się wejść bez dyplomu.
    pasuje: (z: ZawodNaLiscie) => z.studia !== "tak",
  },
  {
    kod: "szybkie",
    etykieta: "szybkie wejście",
    pasuje: (z: ZawodNaLiscie) => z.poziom === "szybki",
  },
] as const;

const DROGI = ["A", "B", "C"] as const;

export function ListaZawodow({
  kod,
  zawody,
  czolowka,
}: {
  kod: string;
  zawody: ZawodNaLiscie[];
  /** Numery obszarów z czołówki uczestnika: te grupy startują otwarte. */
  czolowka: number[];
}) {
  const [wlaczone, ustawWlaczone] = useState<string[]>([]);
  const [drogi, ustawDrogi] = useState<string[]>([]);
  const [pokazReszte, ustawPokazReszte] = useState(false);
  const [doPorownania, ustawDoPorownania] = useState<string[]>([]);

  const widoczne = useMemo(() => {
    return zawody.filter((z) => {
      for (const f of FILTRY) if (wlaczone.includes(f.kod) && !f.pasuje(z)) return false;
      if (drogi.length > 0 && (!z.droga || !drogi.includes(z.droga))) return false;
      return true;
    });
  }, [zawody, wlaczone, drogi]);

  // Kolejność grup jest kolejnością pierwszego zawodu, czyli kolejnością
  // wyniku z silnika. Nic tu nie sortujemy od nowa.
  const grupy = useMemo(() => {
    const mapa = new Map<number, Grupa>();
    for (const z of widoczne) {
      const grupa = mapa.get(z.obszarId);
      if (grupa) grupa.zawody.push(z);
      else mapa.set(z.obszarId, { obszarId: z.obszarId, nazwa: z.obszar, zawody: [z] });
    }
    return [...mapa.values()];
  }, [widoczne]);

  const czolowe = grupy.filter((g) => czolowka.includes(g.obszarId));
  const pozostale = grupy.filter((g) => !czolowka.includes(g.obszarId));
  // Bez czołówki nie ma czego zwijać: wtedy wszystko stoi otwarte.
  const zwijamy = czolowe.length > 0 && pozostale.length > 0;

  function przelaczFiltr(kodFiltra: string) {
    ustawWlaczone((p) =>
      p.includes(kodFiltra) ? p.filter((x) => x !== kodFiltra) : [...p, kodFiltra],
    );
  }

  function przelaczDroge(litera: string) {
    ustawDrogi((p) => (p.includes(litera) ? p.filter((x) => x !== litera) : [...p, litera]));
  }

  function przelaczPorownanie(kodZawodu: string) {
    ustawDoPorownania((p) => {
      if (p.includes(kodZawodu)) return p.filter((x) => x !== kodZawodu);
      // Trzeci wybór zastępuje najstarszy: porównujemy dwa, nie trzy.
      return p.length < 2 ? [...p, kodZawodu] : [p[1], kodZawodu];
    });
  }

  const grupaOtwarta = (g: Grupa) => !zwijamy || czolowka.includes(g.obszarId);

  return (
    <>
      <div className="szklo flex flex-col gap-3 p-5">
        <p className="text-drobne uppercase tracking-[0.14em] text-atrament-slaby">Zawęź listę</p>
        <div className="flex flex-wrap gap-2">
          {FILTRY.map((f) => (
            <Chip
              key={f.kod}
              aktywny={wlaczone.includes(f.kod)}
              onClick={() => przelaczFiltr(f.kod)}
            >
              {f.etykieta}
            </Chip>
          ))}
          {DROGI.map((d) => (
            <Chip key={d} aktywny={drogi.includes(d)} onClick={() => przelaczDroge(d)}>
              Droga {d}
            </Chip>
          ))}
          {wlaczone.length > 0 || drogi.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                ustawWlaczone([]);
                ustawDrogi([]);
              }}
              className="przejscie min-h-11 px-3 text-male text-atrament-slaby underline decoration-linia-mocna underline-offset-4 hover:text-atrament"
            >
              wyczyść
            </button>
          ) : null}
        </div>
        <p className="text-male text-atrament-sciszony">
          {widoczne.length === zawody.length
            ? `Wszystkie karty: ${zawody.length}.`
            : `Pasuje ${widoczne.length} z ${zawody.length} kart.`}{" "}
          Zaznacz dwie karty, żeby zobaczyć je obok siebie.
        </p>
      </div>

      {widoczne.length === 0 ? (
        <p className="szklo p-6 text-tresc text-atrament-sciszony">
          Przy tych warunkach nie ma żadnej karty. To nie znaczy, że nic Ci nie pasuje: znaczy, że
          te trzy warunki naraz są za wąskie. Odznacz jeden i spróbuj jeszcze raz.
        </p>
      ) : null}

      {czolowe.length > 0 ? (
        <div className="flex flex-col gap-4">
          {czolowe.map((g) => (
            <GrupaObszaru
              key={g.obszarId}
              kod={kod}
              grupa={g}
              otwarta
              wybrane={doPorownania}
              naWybor={przelaczPorownanie}
            />
          ))}
        </div>
      ) : null}

      {pozostale.length > 0 ? (
        <div className="flex flex-col gap-4">
          {zwijamy && !pokazReszte ? (
            <button
              type="button"
              onClick={() => ustawPokazReszte(true)}
              className="przejscie szklo min-h-12 px-6 text-tresc font-semibold text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
            >
              Pokaż pozostałe obszary ({pozostale.length}) <span aria-hidden>↓</span>
            </button>
          ) : (
            pozostale.map((g) => (
              <GrupaObszaru
                key={g.obszarId}
                kod={kod}
                grupa={g}
                otwarta={grupaOtwarta(g)}
                wybrane={doPorownania}
                naWybor={przelaczPorownanie}
              />
            ))
          )}
        </div>
      ) : null}

      {/* Pasek porównania siedzi na dole ekranu, bo wybór drugiej karty
          zdarza się zwykle po przewinięciu daleko od pierwszej. */}
      {doPorownania.length > 0 ? (
        <div className="sticky bottom-4 z-30 flex flex-wrap items-center gap-3 rounded-xl border border-akcent/35 bg-panel px-5 py-4 shadow-lg">
          <p className="flex-1 text-male text-atrament-sciszony">
            {doPorownania.length === 1
              ? "Zaznaczona jedna karta. Wybierz drugą, żeby je porównać."
              : "Dwie karty gotowe do porównania."}
          </p>
          <button
            type="button"
            onClick={() => ustawDoPorownania([])}
            className="przejscie min-h-11 px-3 text-male text-atrament-slaby hover:text-atrament"
          >
            Odznacz
          </button>
          {doPorownania.length === 2 ? (
            <Link
              href={`/u/${kod}/porownanie?a=${doPorownania[0]}&b=${doPorownania[1]}`}
              className="przejscie inline-flex min-h-11 items-center rounded-xl bg-akcent px-5 text-male font-semibold text-na-akcencie hover:bg-akcent-ciemny"
            >
              Porównaj obok siebie <span aria-hidden className="ml-2">→</span>
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function Chip({
  aktywny,
  onClick,
  children,
}: {
  aktywny: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktywny}
      className={`przejscie min-h-11 rounded-full border px-4 text-male font-semibold ${
        aktywny
          ? "border-akcent bg-akcent text-na-akcencie"
          : "border-linia-mocna bg-panel text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
      }`}
    >
      {children}
    </button>
  );
}

function GrupaObszaru({
  kod,
  grupa,
  otwarta,
  wybrane,
  naWybor,
}: {
  kod: string;
  grupa: Grupa;
  otwarta: boolean;
  wybrane: string[];
  naWybor: (kodZawodu: string) => void;
}) {
  // Ten sam kolor, co na planszy wyników modułu: obszar wygląda tak samo wszędzie.
  const kolor = kolorKategorii(`a1-${grupa.obszarId}`);
  return (
    <details open={otwarta} className="szklo overflow-hidden">
      <summary
        className="przejscie flex cursor-pointer list-none items-center gap-3 px-5 py-4"
        style={{ borderLeft: `4px solid ${kolor.neon}` }}
      >
        <h2 className="flex-1 text-tresc-duza font-bold" style={{ color: kolor.atrament }}>
          {grupa.nazwa}
        </h2>
        <span className="shrink-0 text-male tabular-nums text-atrament-slaby">
          {grupa.zawody.length}
        </span>
        <span aria-hidden className="shrink-0 text-atrament-slaby">
          ▾
        </span>
      </summary>

      <ul className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
        {grupa.zawody.map((z) => (
          <li key={z.kod}>
            <KartaZawodu
              kod={kod}
              zawod={z}
              zaznaczona={wybrane.includes(z.kod)}
              naWybor={() => naWybor(z.kod)}
            />
          </li>
        ))}
      </ul>
    </details>
  );
}

function KartaZawodu({
  kod,
  zawod,
  zaznaczona,
  naWybor,
}: {
  kod: string;
  zawod: ZawodNaLiscie;
  zaznaczona: boolean;
  naWybor: () => void;
}) {
  return (
    <div
      className={`przejscie flex h-full flex-col rounded-xl border-2 bg-panel p-4 ${
        zaznaczona ? "wybor-wybrany" : "border-linia"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-tresc font-bold leading-snug">{zawod.nazwa}</h3>
        {zawod.maPelnaKarte ? null : (
          <span className="mt-0.5 shrink-0 rounded-full border border-linia-mocna px-2 py-0.5 text-drobne text-atrament-slaby">
            skrót
          </span>
        )}
      </div>

      <p className="mt-1.5 text-drobne text-atrament-slaby">
        {POZIOM[zawod.poziom] ?? zawod.poziom} · {STUDIA[zawod.studia] ?? zawod.studia}
      </p>

      <div className="mt-3">
        <Pasmo opis={zawod.pasmoOpis} />
      </div>

      {zawod.klaster ? (
        <p className="mt-3 text-drobne text-atrament-slaby">
          Razem z innym zawodem w grupie „{zawod.klaster}"
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
        <Link
          href={`/u/${kod}/zawod/${zawod.kod}`}
          className="przejscie text-male font-semibold text-akcent-jasny hover:underline"
        >
          Przeczytaj kartę <span aria-hidden>→</span>
        </Link>
        <button
          type="button"
          onClick={naWybor}
          aria-pressed={zaznaczona}
          className="przejscie ml-auto min-h-9 rounded-full border border-linia-mocna px-3 text-drobne font-semibold text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
        >
          {zaznaczona ? "Zaznaczona" : "Do porównania"}
        </button>
      </div>
    </div>
  );
}
