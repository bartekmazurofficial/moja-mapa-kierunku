"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plansza } from "@/components/Ikona";
import { Pasmo } from "@/components/raport/Sekcje";
import { kolorKategorii } from "@/lib/ui/kolory";
import {
  KOSZT_KROTKO,
  POZIOM,
  POZIOM_KROTKO,
  STUDIA,
  STUDIA_KROTKO,
  ZAGROZENIE_KROTKO,
} from "@/lib/karty/etykiety";
import type { ZawodWRaporcie } from "@/lib/raport/typy";

/**
 * Lista kart zawodów: filtry z lewej, karty w środku, podgląd z prawej.
 *
 * Uczestnik, który dostaje kilkadziesiąt pozycji naraz, nie czyta żadnej.
 * Dlatego są trzy sposoby zawężenia (fakty o zawodzie, obszar, droga) i
 * wyszukiwanie po nazwie, a kliknięcie karty otwiera podgląd obok, zamiast
 * od razu zabierać na długą stronę.
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
  czolowka,
  oceny,
}: {
  kod: string;
  zawody: ZawodNaLiscie[];
  /** Numery obszarów z czołówki uczestnika: te grupy startują otwarte. */
  czolowka: number[];
  /** Oceny zawodów z bazy: serce oznacza „interesuje mnie". */
  oceny: Record<string, string>;
}) {
  const [szukaj, ustawSzukaj] = useState("");
  const [grupa, ustawGrupe] = useState<string | null>(null);
  const [fakty, ustawFakty] = useState<string[]>([]);
  const [obszary, ustawObszary] = useState<number[]>([]);
  const [drogi, ustawDrogi] = useState<string[]>([]);
  const [wybrany, ustawWybrany] = useState<string | null>(null);
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

  const zawodWybrany = wybrany ? zawody.find((z) => z.kod === wybrany) ?? null : null;
  const czolowe = new Set(czolowka);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[15.5rem_minmax(0,1fr)] xl:grid-cols-[15.5rem_minmax(0,1fr)_19.5rem]">
      {/* FILTRY */}
      <aside className="szklo p-5 lg:sticky lg:top-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-tresc-duza font-bold">Filtry</h2>
          {cosZawezone ? (
            <button
              type="button"
              onClick={wyczysc}
              className="przejscie rounded-full border border-linia px-3 py-1 text-drobne font-semibold text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
            >
              Wyczyść
            </button>
          ) : null}
        </div>

        <GrupaFiltrow tytul="Twoja sytuacja">
          {FAKTY.map((f) => (
            <Pole
              key={f.kod}
              etykieta={f.etykieta}
              ile={zawody.filter(f.pasuje).length}
              zaznaczone={fakty.includes(f.kod)}
              onChange={() => ustawFakty((p) => przelacz(p, f.kod))}
            />
          ))}
        </GrupaFiltrow>

        <GrupaFiltrow tytul="Obszar">
          {listaObszarow.map((o) => (
            <Pole
              key={o.id}
              etykieta={o.nazwa}
              ile={o.ile}
              kolor={kolorKategorii(o.znak ?? `obszar-${o.id}`).neon}
              zaznaczone={obszary.includes(o.id)}
              onChange={() => ustawObszary((p) => przelacz(p, o.id))}
            />
          ))}
        </GrupaFiltrow>

        {maDrogi ? (
          <GrupaFiltrow tytul="Droga z raportu">
            {DROGI.map((d) => {
              const ile = zawody.filter((z) => z.droga === d).length;
              if (ile === 0) return null;
              return (
                <Pole
                  key={d}
                  etykieta={`Droga ${d}`}
                  ile={ile}
                  zaznaczone={drogi.includes(d)}
                  onChange={() => ustawDrogi((p) => przelacz(p, d))}
                />
              );
            })}
          </GrupaFiltrow>
        ) : null}

        <a
          href="#karty-zawodow"
          className="przejscie przycisk-gradient mt-5 flex min-h-11 items-center justify-center rounded-xl px-4 text-male font-bold lg:hidden"
        >
          Pokaż {widoczne.length} {liczebnik(widoczne.length)}
        </a>
      </aside>

      {/* KARTY */}
      <section id="karty-zawodow" className="min-w-0">
        <label className="relative block">
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

        {/* Szybkie zawężenie po rodzinie obszarów. Jeden wybór naraz. */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          <Chip aktywny={grupa === null} onClick={() => ustawGrupe(null)}>
            Wszystkie
          </Chip>
          {grupy.map((g) => (
            <Chip key={g} aktywny={grupa === g} onClick={() => ustawGrupe(grupa === g ? null : g)}>
              {zWielkiej(g.toLowerCase())}
            </Chip>
          ))}
        </div>

        <p className="mt-4 flex flex-wrap items-baseline justify-between gap-2 px-1 text-male text-atrament-sciszony">
          <span>
            {cosZawezone
              ? `Pasuje ${widoczne.length} z ${zawody.length} kart.`
              : `${zawody.length} ${liczebnik(zawody.length)}, w kolejności dopasowania.`}
          </span>
          <span className="text-drobne text-atrament-slaby">Zaznacz dwie karty, żeby je porównać.</span>
        </p>

        {widoczne.length === 0 ? (
          <p className="szklo mt-4 p-6 text-tresc text-atrament-sciszony">
            Przy tych warunkach nie ma żadnej karty. To nie znaczy, że nic Ci nie pasuje: znaczy,
            że te warunki naraz są za wąskie. Odznacz jeden i spróbuj jeszcze raz.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {widoczne.map((z) => (
              <li key={z.kod}>
                <KartaZawodu
                  kod={kod}
                  zawod={z}
                  wybrana={wybrany === z.kod}
                  zCzolowki={czolowe.has(z.obszarId)}
                  wPorownaniu={doPorownania.includes(z.kod)}
                  serce={serca[z.kod] === "interesuje"}
                  naWybor={() => ustawWybrany(wybrany === z.kod ? null : z.kod)}
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
          <div className="sticky bottom-4 z-30 mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-akcent/35 bg-panel px-5 py-4 shadow-lg">
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
                className="przejscie przycisk-gradient inline-flex min-h-11 items-center rounded-xl px-5 text-male font-bold"
              >
                Porównaj obok siebie <span aria-hidden className="ml-2">→</span>
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>

      {/* PODGLĄD: kolumna na szerokim ekranie, wysuwana płyta na węższym. */}
      <aside className="hidden xl:sticky xl:top-5 xl:block">
        {zawodWybrany ? (
          <Podglad
            kod={kod}
            zawod={zawodWybrany}
            serce={serca[zawodWybrany.kod] === "interesuje"}
            wPorownaniu={doPorownania.includes(zawodWybrany.kod)}
            naZamknij={() => ustawWybrany(null)}
            naSerce={() => przelaczSerce(zawodWybrany.kod)}
            naPorownanie={() => przelaczPorownanie(zawodWybrany.kod)}
          />
        ) : (
          <div className="szklo flex min-h-[18rem] flex-col items-center justify-center p-6 text-center">
            <span aria-hidden className="znak-sekcji bg-akcent-tlo text-akcent-jasny">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16v11H4zM8 7V5h8v2" />
              </svg>
            </span>
            <p className="mt-4 text-tresc font-semibold text-atrament">Wybierz kartę</p>
            <p className="mt-1 text-male text-atrament-sciszony">
              Kliknij zawód na liście, a tu zobaczysz jego skrót, zanim otworzysz całą kartę.
            </p>
          </div>
        )}
      </aside>

      {zawodWybrany ? (
        <div className="fixed inset-x-0 bottom-0 z-40 max-h-[82dvh] overflow-y-auto rounded-t-3xl border-t border-linia bg-panel p-4 shadow-2xl xl:hidden">
          <Podglad
            kod={kod}
            zawod={zawodWybrany}
            serce={serca[zawodWybrany.kod] === "interesuje"}
            wPorownaniu={doPorownania.includes(zawodWybrany.kod)}
            naZamknij={() => ustawWybrany(null)}
            naSerce={() => przelaczSerce(zawodWybrany.kod)}
            naPorownanie={() => przelaczPorownanie(zawodWybrany.kod)}
            plaski
          />
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
    <fieldset className="mt-5 border-t border-linia pt-4">
      <legend className="pr-2 text-drobne uppercase tracking-[0.14em] text-atrament-slaby">{tytul}</legend>
      <div className="mt-2 flex flex-col">{children}</div>
    </fieldset>
  );
}

function Pole({
  etykieta,
  ile,
  kolor,
  zaznaczone,
  onChange,
}: {
  etykieta: string;
  ile: number;
  kolor?: string;
  zaznaczone: boolean;
  onChange: () => void;
}) {
  return (
    <label className="przejscie flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 text-male text-atrament-sciszony hover:bg-tlo/60 hover:text-atrament">
      <input
        type="checkbox"
        checked={zaznaczone}
        onChange={onChange}
        className="h-4.5 w-4.5 shrink-0 rounded accent-[var(--color-akcent)]"
      />
      {kolor ? <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: kolor }} /> : null}
      <span className="min-w-0 flex-1 leading-snug">{etykieta}</span>
      <span className="shrink-0 text-drobne tabular-nums text-atrament-slaby">{ile}</span>
    </label>
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

function KartaZawodu({
  kod,
  zawod,
  wybrana,
  zCzolowki,
  wPorownaniu,
  serce,
  naWybor,
  naSerce,
  naPorownanie,
}: {
  kod: string;
  zawod: ZawodNaLiscie;
  wybrana: boolean;
  zCzolowki: boolean;
  wPorownaniu: boolean;
  serce: boolean;
  naWybor: () => void;
  naSerce: () => void;
  naPorownanie: () => void;
}) {
  const kolor = kolorKategorii(zawod.znakObszaru ?? `obszar-${zawod.obszarId}`);
  return (
    <article
      className={`przejscie relative flex h-full flex-col overflow-hidden rounded-karta border-2 bg-panel ${
        wybrana ? "obwodka-gradient" : wPorownaniu ? "border-akcent" : "border-linia hover:border-linia-mocna"
      }`}
    >
      {/* Serce i odznaka leżą obok przycisku wyboru, nie w nim: przycisk
          w przycisku to błędny HTML i przeglądarka rozrywa go przy hydratacji. */}
      <div className="absolute right-3 top-3 z-10">
        <Serce pelne={serce} onClick={naSerce} etykieta={`${zawod.nazwa}: interesuje mnie`} />
      </div>
      {zCzolowki ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-panel/90 px-2.5 py-1 text-drobne font-semibold text-akcent-jasny shadow-sm">
          Twoja czołówka
        </span>
      ) : null}
      <button type="button" onClick={naWybor} className="block w-full text-left" aria-pressed={wybrana}>
        <div>
          {zawod.znakObszaru ? (
            <Plansza klucz={zawod.znakObszaru} wysokosc={128} />
          ) : (
            <div className="h-32 w-full" style={{ background: kolor.tlo }} />
          )}
        </div>
        <div className="px-4 pt-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-tresc font-bold leading-snug text-atrament">{zawod.nazwa}</h3>
            {zawod.maPelnaKarte ? null : (
              <span className="mt-0.5 shrink-0 rounded-full border border-linia-mocna px-2 py-0.5 text-drobne text-atrament-slaby">
                skrót
              </span>
            )}
          </div>
          <p className="mt-1 text-drobne text-atrament-slaby" style={{ color: kolor.atrament }}>
            {zawod.obszar}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Pasmo opis={zawod.pasmoOpis} />
            <Tag>{POZIOM[zawod.poziom] ?? zawod.poziom}</Tag>
            <Tag>{STUDIA[zawod.studia] ?? zawod.studia}</Tag>
          </div>
        </div>
      </button>

      <div className="mt-auto flex items-center gap-3 px-4 pb-4 pt-3">
        <Link
          href={`/u/${kod}/zawod/${zawod.kod}`}
          className="przejscie text-male font-semibold text-akcent-jasny hover:underline"
        >
          Przeczytaj kartę <span aria-hidden>→</span>
        </Link>
        <button
          type="button"
          onClick={naPorownanie}
          aria-pressed={wPorownaniu}
          className={`przejscie ml-auto min-h-9 rounded-full border px-3 text-drobne font-semibold ${
            wPorownaniu
              ? "border-akcent bg-akcent-tlo text-akcent-jasny"
              : "border-linia-mocna text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
          }`}
        >
          {wPorownaniu ? "W porównaniu" : "Do porównania"}
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

/**
 * Podgląd zawodu: skrót, zanim uczestnik otworzy całą kartę.
 *
 * Wszystko, co tu jest, pochodzi z raportu tego uczestnika: uzasadnienie
 * mówi, dlaczego ten zawód wyszedł u niego, a nie w ogóle.
 */
function Podglad({
  kod,
  zawod,
  serce,
  wPorownaniu,
  naZamknij,
  naSerce,
  naPorownanie,
  plaski,
}: {
  kod: string;
  zawod: ZawodNaLiscie;
  serce: boolean;
  wPorownaniu: boolean;
  naZamknij: () => void;
  naSerce: () => void;
  naPorownanie: () => void;
  plaski?: boolean;
}) {
  const kolor = kolorKategorii(zawod.znakObszaru ?? `obszar-${zawod.obszarId}`);
  const FAKTY_ZAWODU = [
    { etykieta: "Poziom wejścia", wartosc: POZIOM_KROTKO[zawod.poziom] ?? zawod.poziom },
    { etykieta: "Studia", wartosc: STUDIA_KROTKO[zawod.studia] ?? zawod.studia },
    { etykieta: "Koszt wejścia", wartosc: KOSZT_KROTKO[zawod.koszt] ?? zawod.koszt },
    { etykieta: "Zagrożenie", wartosc: ZAGROZENIE_KROTKO[zawod.zagrozenie] ?? zawod.zagrozenie },
  ];

  return (
    <div className={plaski ? "" : "szklo overflow-hidden"}>
      <div className="relative">
        {zawod.znakObszaru ? (
          <Plansza klucz={zawod.znakObszaru} wysokosc={plaski ? 120 : 168} />
        ) : (
          <div className="h-40 w-full" style={{ background: kolor.tlo }} />
        )}
        <button
          type="button"
          onClick={naZamknij}
          aria-label="Zamknij podgląd"
          className="przejscie absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-linia bg-panel/90 text-atrament-sciszony shadow-sm hover:text-atrament"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <div className="absolute bottom-3 left-3">
          <Pasmo opis={zawod.pasmoOpis} />
        </div>
      </div>

      <div className={plaski ? "pt-4" : "p-5"}>
        <p className="text-drobne uppercase tracking-[0.12em]" style={{ color: kolor.atrament }}>
          {zawod.obszar}
        </p>
        <h3 className="mt-1 text-naglowek-maly font-extrabold leading-tight text-atrament">{zawod.nazwa}</h3>

        {zawod.uzasadnienie.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-1.5">
            {zawod.uzasadnienie.slice(0, 3).map((u, i) => (
              <li key={i} className="flex gap-2 text-male leading-relaxed text-atrament-sciszony">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-akcent" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <dl className="mt-4 grid grid-cols-2 gap-2">
          {FAKTY_ZAWODU.map((f) => (
            <div key={f.etykieta} className="rounded-xl border border-linia bg-tlo/50 px-3 py-2.5">
              <dt className="text-drobne text-atrament-slaby">{f.etykieta}</dt>
              <dd className="mt-0.5 text-male font-bold text-atrament">{f.wartosc}</dd>
            </div>
          ))}
        </dl>

        {zawod.flagi.trampolina || zawod.flagi.zagrozony || zawod.flagi.barieraKosztowa ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {zawod.flagi.trampolina ? <Tag>dobre pierwsze miejsce pracy</Tag> : null}
            {zawod.flagi.zagrozony ? <Tag>część tego zawodu się kurczy</Tag> : null}
            {zawod.flagi.barieraKosztowa ? <Tag>wejście kosztuje</Tag> : null}
          </div>
        ) : null}

        <Link
          href={`/u/${kod}/zawod/${zawod.kod}`}
          className="przejscie przycisk-gradient mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-male font-bold"
        >
          Zobacz pełny opis zawodu <span aria-hidden>→</span>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-linia pt-3">
          <button
            type="button"
            onClick={naPorownanie}
            aria-pressed={wPorownaniu}
            className={`przejscie min-h-10 rounded-full border px-3.5 text-drobne font-semibold ${
              wPorownaniu
                ? "border-akcent bg-akcent-tlo text-akcent-jasny"
                : "border-linia-mocna text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
            }`}
          >
            {wPorownaniu ? "W porównaniu" : "Do porównania"}
          </button>
          <button
            type="button"
            onClick={naSerce}
            aria-pressed={serce}
            className={`przejscie inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-drobne font-semibold ${
              serce ? "border-akcent bg-akcent text-na-akcencie" : "border-linia-mocna text-atrament-sciszony hover:text-akcent-jasny"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill={serce ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 20S4 14.6 4 9.4A4.4 4.4 0 0 1 12 6.8 4.4 4.4 0 0 1 20 9.4C20 14.6 12 20 12 20Z" />
            </svg>
            {serce ? "Interesuje mnie" : "Zaznacz: interesuje mnie"}
          </button>
        </div>
      </div>
    </div>
  );
}
