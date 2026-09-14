"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plansza } from "@/components/Ikona";
import { Pasmo } from "@/components/raport/Sekcje";
import { kolorKategorii } from "@/lib/ui/kolory";
import { POZIOM, STUDIA } from "@/lib/karty/etykiety";
import type { ZawodWRaporcie } from "@/lib/raport/typy";

/**
 * Lista kart zawodów: jeden pasek sterowania u góry, pod nim same karty.
 *
 * Uczestnik, który dostaje kilkadziesiąt pozycji naraz, nie czyta żadnej,
 * więc są trzy sposoby zawężenia (fakty o zawodzie, obszar, droga z raportu)
 * i wyszukiwanie po nazwie. Wszystkie siedzą pod jednym przyciskiem „Filtruj":
 * wcześniej połowa stała w kolumnie z lewej, a połowa w pasku u góry i nie
 * było wiadomo, gdzie szukać której.
 *
 * Karta prowadzi wprost do pełnego opisu. Kolumna podglądu, która stała tu
 * przedtem, zabierała jedną trzecią szerokości na skrót tej samej treści,
 * do której klik dalej i tak prowadził. Bez niej w rzędzie mieści się pięć
 * kart zamiast trzech.
 *
 * Kolejność kart jest kolejnością wyniku z silnika i nic tu jej nie zmienia.
 * Tu kolor kategorii jest na miejscu: uczestnik zna już swój wynik.
 */

export interface ZawodNaLiscie extends ZawodWRaporcie {
  klaster: string | null;
}

const FAKTY = [
  {
    kod: "bez_studiow",
    etykieta: "Bez wymaganych studiów",
    // „Częściowo" zostaje: to są zawody, do których da się wejść bez dyplomu.
    pasuje: (z: ZawodNaLiscie) => z.studia !== "tak",
  },
  {
    kod: "na_start",
    etykieta: "Dobre na start",
    pasuje: (z: ZawodNaLiscie) => z.flagi.trampolina || z.poziom === "szybki",
  },
  {
    kod: "niski_koszt",
    etykieta: "Niski koszt wejścia",
    pasuje: (z: ZawodNaLiscie) => ["zerowy", "bardzo_niski", "niski"].includes(z.koszt),
  },
  {
    kod: "malo_zmian",
    etykieta: "Mniejsze ryzyko zmian",
    pasuje: (z: ZawodNaLiscie) => ["bardzo_niskie", "niskie"].includes(z.zagrozenie),
  },
] as const;

const DROGI = ["A", "B", "C"] as const;

export function ListaZawodow({
  kod,
  zawody,
  oceny,
}: {
  kod: string;
  zawody: ZawodNaLiscie[];
  /** Oceny zawodów z bazy: serce oznacza „interesuje mnie". */
  oceny: Record<string, string>;
}) {
  /**
   * Numer dopasowania: miejsce na pełnej liście, a nie na przefiltrowanej.
   * Dzięki temu „siódmy" znaczy siódmy w całym wyniku i nie zmienia się,
   * kiedy uczestnik zawęzi listę filtrem.
   */
  const numery = useMemo(() => {
    const mapa = new Map<string, number>();
    zawody.forEach((z, i) => mapa.set(z.kod, i + 1));
    return mapa;
  }, [zawody]);
  const [szukaj, ustawSzukaj] = useState("");
  const [grupa, ustawGrupe] = useState<string | null>(null);
  const [fakty, ustawFakty] = useState<string[]>([]);
  const [obszary, ustawObszary] = useState<number[]>([]);
  const [drogi, ustawDrogi] = useState<string[]>([]);
  /** Czy rozwinięte jest menu filtrów. Zamknięte na wejściu: najpierw karty. */
  const [panel, ustawPanel] = useState(false);
  const [doPorownania, ustawDoPorownania] = useState<string[]>([]);
  const [serca, ustawSerca] = useState<Record<string, string>>(oceny);

  const grupy = useMemo(() => [...new Set(zawody.map((z) => z.grupaObszaru).filter(Boolean))], [zawody]);
  const listaObszarow = useMemo(() => {
    const mapa = new Map<number, { nazwa: string; ile: number; znak: string | null }>();
    for (const z of zawody) {
      const w = mapa.get(z.obszarId);
      if (w) w.ile += 1;
      else mapa.set(z.obszarId, { nazwa: z.obszar, ile: 1, znak: z.znakObszaru });
    }
    return [...mapa.entries()].map(([id, w]) => ({ id, ...w }));
  }, [zawody]);
  const maDrogi = zawody.some((z) => z.droga);

  const widoczne = useMemo(() => {
    const fraza = szukaj.trim().toLowerCase();
    return zawody.filter((z) => {
      if (fraza && !z.nazwa.toLowerCase().includes(fraza) && !z.obszar.toLowerCase().includes(fraza)) return false;
      if (grupa && z.grupaObszaru !== grupa) return false;
      for (const f of FAKTY) if (fakty.includes(f.kod) && !f.pasuje(z)) return false;
      if (obszary.length > 0 && !obszary.includes(z.obszarId)) return false;
      if (drogi.length > 0 && (!z.droga || !drogi.includes(z.droga))) return false;
      return true;
    });
  }, [zawody, szukaj, grupa, fakty, obszary, drogi]);

  const cosZawezone = szukaj.trim() !== "" || grupa !== null || fakty.length + obszary.length + drogi.length > 0;

  function przelacz<T>(lista: T[], element: T): T[] {
    return lista.includes(element) ? lista.filter((x) => x !== element) : [...lista, element];
  }

  function przelaczPorownanie(kodZawodu: string) {
    ustawDoPorownania((p) => {
      if (p.includes(kodZawodu)) return p.filter((x) => x !== kodZawodu);
      // Trzeci wybór zastępuje najstarszy: porównujemy dwa, nie trzy.
      return p.length < 2 ? [...p, kodZawodu] : [p[1], kodZawodu];
    });
  }

  /** Serce to ocena „interesuje mnie". Zdjęcie serca wraca do „może". */
  function przelaczSerce(kodZawodu: string) {
    const nowa = serca[kodZawodu] === "interesuje" ? "moze" : "interesuje";
    ustawSerca((p) => ({ ...p, [kodZawodu]: nowa }));
    void fetch("/api/ocena", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kod, zawod: kodZawodu, ocena: nowa }),
    });
  }

  function wyczysc() {
    ustawSzukaj("");
    ustawGrupe(null);
    ustawFakty([]);
    ustawObszary([]);
    ustawDrogi([]);
  }

  /** Ile filtrów z menu jest włączonych. Rodzina obszarów ma własne żetony. */
  const ileFiltrow = fakty.length + obszary.length + drogi.length;

  /** Co jest włączone, w jednym miejscu: etykieta i sposób zdjęcia. */
  const aktywne = [
    ...(grupa ? [{ klucz: `g-${grupa}`, etykieta: zWielkiej(grupa.toLowerCase()), zdejmij: () => ustawGrupe(null) }] : []),
    ...FAKTY.filter((f) => fakty.includes(f.kod)).map((f) => ({
      klucz: `f-${f.kod}`,
      etykieta: f.etykieta,
      zdejmij: () => ustawFakty((p) => przelacz(p, f.kod)),
    })),
    ...listaObszarow
      .filter((o) => obszary.includes(o.id))
      .map((o) => ({ klucz: `o-${o.id}`, etykieta: o.nazwa, zdejmij: () => ustawObszary((p) => przelacz(p, o.id)) })),
    ...drogi.map((d) => ({ klucz: `d-${d}`, etykieta: `Droga ${d}`, zdejmij: () => ustawDrogi((p) => przelacz(p, d)) })),
  ];

  return (
    <div className="flex flex-col gap-4">
      {/*
        PASEK STEROWANIA. Jedno miejsce na wyszukiwanie, rodziny obszarów
        i wejście w pełne filtry. Nic nie stoi już z boku listy.
      */}
      <div className="szklo p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Szukaj zawodu</span>
            <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-atrament-slaby">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m20 20-4.2-4.2" />
              </svg>
            </span>
            <input
              type="search"
              value={szukaj}
              onChange={(e) => ustawSzukaj(e.target.value)}
              placeholder="Wyszukaj zawód, na przykład „programista” albo „pielęgniarka”"
              className="pole pole-z-ikona min-h-12 text-tresc"
            />
          </label>

          <button
            type="button"
            onClick={() => ustawPanel((p) => !p)}
            aria-expanded={panel}
            aria-controls="menu-filtrow"
            className={`przejscie inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-2xl border px-5 text-male font-bold ${
              panel || ileFiltrow > 0
                ? "border-akcent bg-akcent-tlo text-akcent-jasny"
                : "border-linia-mocna bg-panel text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
            }`}
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M7 12h10M10 17h4" />
            </svg>
            Filtruj
            {ileFiltrow > 0 ? (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-akcent px-1.5 text-drobne font-extrabold tabular-nums text-na-akcencie">
                {ileFiltrow}
              </span>
            ) : null}
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className={`przejscie h-4 w-4 ${panel ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Rodziny obszarów: jeden wybór naraz, najszybsze zawężenie. */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip aktywny={grupa === null} onClick={() => ustawGrupe(null)}>
            Wszystkie
          </Chip>
          {grupy.map((g) => (
            <Chip key={g} aktywny={grupa === g} onClick={() => ustawGrupe(grupa === g ? null : g)}>
              {zWielkiej(g.toLowerCase())}
            </Chip>
          ))}
        </div>

        {panel ? (
          <div id="menu-filtrow" className="mt-4 border-t border-linia pt-4">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
              <div className="flex flex-col gap-5">
                <GrupaFiltrow tytul="Twoja sytuacja">
                  {FAKTY.map((f) => (
                    <ChipFiltru
                      key={f.kod}
                      etykieta={f.etykieta}
                      ile={zawody.filter(f.pasuje).length}
                      zaznaczone={fakty.includes(f.kod)}
                      onClick={() => ustawFakty((p) => przelacz(p, f.kod))}
                    />
                  ))}
                </GrupaFiltrow>

                {maDrogi ? (
                  <GrupaFiltrow tytul="Droga z raportu">
                    {DROGI.map((d) => {
                      const ile = zawody.filter((z) => z.droga === d).length;
                      if (ile === 0) return null;
                      return (
                        <ChipFiltru
                          key={d}
                          etykieta={`Droga ${d}`}
                          ile={ile}
                          zaznaczone={drogi.includes(d)}
                          onClick={() => ustawDrogi((p) => przelacz(p, d))}
                        />
                      );
                    })}
                  </GrupaFiltrow>
                ) : null}
              </div>

              <GrupaFiltrow tytul="Obszar">
                {listaObszarow.map((o) => (
                  <ChipFiltru
                    key={o.id}
                    etykieta={o.nazwa}
                    ile={o.ile}
                    kolor={kolorKategorii(o.znak ?? `obszar-${o.id}`).neon}
                    zaznaczone={obszary.includes(o.id)}
                    onClick={() => ustawObszary((p) => przelacz(p, o.id))}
                  />
                ))}
              </GrupaFiltrow>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-linia pt-4">
              <button
                type="button"
                onClick={wyczysc}
                disabled={!cosZawezone}
                className="przejscie min-h-11 rounded-full border border-linia px-4 text-male font-semibold text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny disabled:invisible"
              >
                Wyczyść wszystko
              </button>
              <button
                type="button"
                onClick={() => ustawPanel(false)}
                className="przejscie przycisk-gradient inline-flex min-h-11 items-center rounded-2xl px-6 text-male font-bold"
              >
                Pokaż {widoczne.length} {liczebnik(widoczne.length)}
              </button>
            </div>
          </div>
        ) : aktywne.length > 0 ? (
          /* Przy zamkniętym menu widać, co jest włączone, i da się zdjąć
             pojedynczy filtr bez otwierania go z powrotem. */
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {aktywne.map((a) => (
              <button
                key={a.klucz}
                type="button"
                onClick={a.zdejmij}
                className="przejscie inline-flex min-h-9 items-center gap-2 rounded-full border border-akcent bg-akcent-tlo px-3.5 text-drobne font-semibold text-akcent-jasny"
              >
                {a.etykieta}
                <span aria-hidden className="text-male leading-none">×</span>
                <span className="sr-only">, zdejmij ten filtr</span>
              </button>
            ))}
            <button
              type="button"
              onClick={wyczysc}
              className="przejscie min-h-9 px-2 text-drobne font-semibold text-atrament-slaby underline decoration-linia-mocna underline-offset-4 hover:text-atrament"
            >
              Wyczyść wszystko
            </button>
          </div>
        ) : null}
      </div>

      <p className="flex flex-wrap items-baseline justify-between gap-2 px-1 text-male text-atrament-sciszony">
        <span>
          {cosZawezone
            ? `Pasuje ${widoczne.length} z ${zawody.length} kart.`
            : `${zawody.length} ${liczebnik(zawody.length)}, w kolejności dopasowania.`}
        </span>
        <span className="text-drobne text-atrament-slaby">Zaznacz dwie karty, żeby je porównać.</span>
      </p>

      {widoczne.length === 0 ? (
        <p className="szklo p-6 text-tresc text-atrament-sciszony">
          Przy tych warunkach nie ma żadnej karty. To nie znaczy, że nic Ci nie pasuje: znaczy,
          że te warunki naraz są za wąskie. Odznacz jeden i spróbuj jeszcze raz.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {widoczne.map((z) => (
            <li key={z.kod}>
              <KartaZawodu
                kod={kod}
                zawod={z}
                numer={numery.get(z.kod) ?? 0}
                wPorownaniu={doPorownania.includes(z.kod)}
                serce={serca[z.kod] === "interesuje"}
                naSerce={() => przelaczSerce(z.kod)}
                naPorownanie={() => przelaczPorownanie(z.kod)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Pasek porównania siedzi na dole ekranu, bo wybór drugiej karty
          zdarza się zwykle po przewinięciu daleko od pierwszej. */}
      {doPorownania.length > 0 ? (
        <div className="sticky bottom-4 z-30 flex flex-wrap items-center gap-3 rounded-2xl border border-akcent/35 bg-panel px-5 py-4 shadow-lg">
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
              className="przejscie przycisk-gradient inline-flex min-h-11 items-center rounded-2xl px-6 text-male font-bold"
            >
              Porównaj obok siebie <span aria-hidden className="ml-2">→</span>
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// =====================================================================

function liczebnik(n: number): string {
  if (n === 1) return "zawód";
  const r = n % 10;
  const r100 = n % 100;
  if (r >= 2 && r <= 4 && !(r100 >= 12 && r100 <= 14)) return "zawody";
  return "zawodów";
}

function zWielkiej(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function GrupaFiltrow({ tytul, children }: { tytul: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-drobne font-bold uppercase tracking-[0.14em] text-atrament-slaby">
        {tytul}
      </legend>
      <div className="mt-2.5 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/**
 * Jeden filtr w menu. Żeton, nie wiersz z kwadracikiem: dwudziestu siedmiu
 * obszarów w kolumnie nie da się objąć wzrokiem, a zawinięte żetony mieszczą
 * się w czterech liniach. Stan niesie obwódka i ptaszek, nie sam kolor.
 */
function ChipFiltru({
  etykieta,
  ile,
  kolor,
  zaznaczone,
  onClick,
}: {
  etykieta: string;
  ile: number;
  kolor?: string;
  zaznaczone: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={zaznaczone}
      className={`przejscie inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-male font-semibold ${
        zaznaczone
          ? "border-akcent bg-akcent-tlo text-akcent-jasny"
          : "border-linia-mocna bg-panel text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
      }`}
    >
      {zaznaczone ? (
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
      ) : kolor ? (
        <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: kolor }} />
      ) : null}
      <span className="text-left leading-snug">{etykieta}</span>
      {/* Liczba przygaszona kolorem, nie przezroczystością: `opacity-70`
          daje 4,14:1 na bieli i 3,93:1 na zaznaczonym żetonie, czyli poniżej
          progu, a wygląda identycznie. */}
      <span className="shrink-0 text-drobne tabular-nums text-atrament-slaby">{ile}</span>
    </button>
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
      className={`przejscie min-h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-male font-semibold ${
        aktywny
          ? "przycisk-gradient border-transparent"
          : "border-linia bg-panel text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
      }`}
    >
      {children}
    </button>
  );
}

function Serce({ pelne, onClick, etykieta }: { pelne: boolean; onClick: () => void; etykieta: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-pressed={pelne}
      aria-label={etykieta}
      className={`przejscie flex h-10 w-10 items-center justify-center rounded-full border shadow-sm ${
        pelne ? "border-transparent bg-akcent text-na-akcencie" : "border-linia bg-panel/90 text-atrament-sciszony hover:text-akcent-jasny"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={pelne ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M12 20S4 14.6 4 9.4A4.4 4.4 0 0 1 12 6.8 4.4 4.4 0 0 1 20 9.4C20 14.6 12 20 12 20Z" />
      </svg>
    </button>
  );
}

/**
 * Ile pierwszych pozycji dostaje pełne podświetlenie.
 *
 * To nie jest próg silnika ani żadna granica w wyniku, tylko tyle kart, ile
 * człowiek obejmuje wzrokiem naraz. Numer stoi przy każdej pozycji, więc
 * podświetlenie niczego nie niesie samo: mówi tylko „zacznij stąd".
 */
const CZOLOWKA = 3;

function KartaZawodu({
  kod,
  zawod,
  numer,
  wPorownaniu,
  serce,
  naSerce,
  naPorownanie,
}: {
  kod: string;
  zawod: ZawodNaLiscie;
  /** Miejsce na pełnej liście, od najmocniej do najsłabiej dopasowanego. */
  numer: number;
  wPorownaniu: boolean;
  serce: boolean;
  naSerce: () => void;
  naPorownanie: () => void;
}) {
  const kolor = kolorKategorii(zawod.znakObszaru ?? `obszar-${zawod.obszarId}`);
  const zCzolowki = numer > 0 && numer <= CZOLOWKA;
  return (
    <article
      className={`przejscie relative flex h-full flex-col overflow-hidden rounded-karta border-2 bg-panel ${
        wPorownaniu
          ? "border-akcent"
          : zCzolowki
            ? "border-akcent/45 poswiata"
            : "border-linia hover:border-linia-mocna"
      }`}
    >
      {/* Serce i odznaka leżą obok przycisku wyboru, nie w nim: przycisk
          w przycisku to błędny HTML i przeglądarka rozrywa go przy hydratacji. */}
      <div className="absolute right-3 top-3 z-20">
        <Serce pelne={serce} onClick={naSerce} etykieta={`${zawod.nazwa}: interesuje mnie`} />
      </div>
      {/* Numer dopasowania. Czołówka ma go wypełnionego, reszta na białym:
          kolor mówi „zacznij stąd", a liczba i tak stoi przy każdej karcie. */}
      <span
        className={`absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full text-male font-extrabold tabular-nums shadow-sm ${
          zCzolowki ? "przycisk-gradient" : "border border-linia bg-panel/90 text-atrament-sciszony"
        }`}
      >
        <span className="sr-only">Dopasowanie, miejsce </span>
        {numer}
      </span>
      <div>
        {zawod.znakObszaru ? (
          <Plansza klucz={zawod.znakObszaru} wysokosc={124} />
        ) : (
          <div className="h-[7.75rem] w-full" style={{ background: kolor.tlo }} />
        )}
      </div>

      <div className="px-4 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          {/*
            Tytuł jest linkiem, a jego nakładka rozciąga się na całą kartę,
            więc klika się gdziekolwiek. Serce i porównanie leżą nad nią
            (`relative z-10`): przycisk w linku to błędny HTML i przeglądarka
            rozrywa go przy hydratacji.
          */}
          <h3 className="text-tresc font-bold leading-snug text-atrament">
            <Link
              href={`/u/${kod}/zawod/${zawod.kod}`}
              className="przejscie after:absolute after:inset-0 after:content-[''] hover:text-akcent-jasny"
            >
              {zawod.nazwa}
            </Link>
          </h3>
          {zawod.maPelnaKarte ? null : (
            <span className="mt-0.5 shrink-0 rounded-full border border-linia-mocna px-2 py-0.5 text-drobne text-atrament-slaby">
              skrót
            </span>
          )}
        </div>
        <p className="mt-1 text-drobne" style={{ color: kolor.atrament }}>
          {zawod.obszar}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Pasmo opis={zawod.pasmoOpis} />
          <Tag>{POZIOM[zawod.poziom] ?? zawod.poziom}</Tag>
          <Tag>{STUDIA[zawod.studia] ?? zawod.studia}</Tag>
        </div>
      </div>

      <div className="relative z-20 mt-auto flex items-center gap-2 px-4 pb-4 pt-3.5">
        <span aria-hidden className="text-male font-semibold text-akcent-jasny">
          Przeczytaj kartę →
        </span>
        <button
          type="button"
          onClick={naPorownanie}
          aria-pressed={wPorownaniu}
          aria-label={`${zawod.nazwa}: do porównania`}
          className={`przejscie ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
            wPorownaniu
              ? "border-akcent bg-akcent-tlo text-akcent-jasny"
              : "border-linia-mocna bg-panel text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
          }`}
          title={wPorownaniu ? "W porównaniu" : "Do porównania"}
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h6v13H4zM14 6h6v13h-6" />
          </svg>
        </button>
      </div>
    </article>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-linia bg-tlo/60 px-2.5 py-0.5 text-drobne text-atrament-sciszony">
      {children}
    </span>
  );
}
