/**
 * Karta zawodu: sześć sekcji, które mają dane, dostaje formę.
 *
 * Treść kart jest bardzo dobra, a prezentacja była zerowa: dwadzieścia sekcji
 * przechodziło przez `marked` i lądowało jako jednolity tekst, przez co tabela
 * z sześcioma ocenami czytała się tak samo jak akapit o mitach.
 *
 * Komponenty są serwerowe i czyste: dostają strukturę z lib/karty/uklad.ts,
 * nic nie liczą i niczego nie pobierają. Czego układ nie rozpoznał, to leci
 * markdownem, dokładnie jak dotąd.
 *
 * Ograniczenie z metodyki kart: wysokie obciążenie nie jest wadą. Część ludzi
 * potrzebuje piątki, część jedynki, więc żaden wskaźnik nie może być czerwony
 * przy wysokiej wartości. Znaczniki „≈" i „○" zostają widoczne: mówią, że to
 * szacunek i kwota do corocznej aktualizacji, a nie dane z rejestru.
 */

import { marked } from "marked";
import type { Blok, WymiarObciazenia, WidelkiEtap, KrokDrogi, UdzialCzasu, LiczbaSkali } from "@/lib/karty/uklad";

export function BlokKarty({
  blok,
  stopienZagrozenia,
}: {
  blok: Blok;
  /** Stopien zagrozenia z bazy zawodow. Slowo, nie cyfra, i nigdy alarm. */
  stopienZagrozenia?: string;
}) {
  switch (blok.rodzaj) {
    case "obciazenie":
      return (
        <Sekcja tytul={blok.tytul}>
          <Obciazenie wymiary={blok.wymiary} />
        </Sekcja>
      );
    case "pieniadze":
      return (
        <Sekcja tytul={blok.tytul}>
          <Widelki etapy={blok.etapy} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "droga":
      return (
        <Sekcja tytul={blok.tytul}>
          <Droga kroki={blok.kroki} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "czas":
      return (
        <Sekcja tytul={blok.tytul}>
          <PodzialCzasu udzialy={blok.udzialy} />
        </Sekcja>
      );
    case "skala":
      return (
        <Sekcja tytul={blok.tytul}>
          <SkalaZawodu liczby={blok.liczby} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "zagrozenie":
      return (
        <Sekcja tytul={blok.tytul}>
          <div className="rounded-xl border border-przyszlosc/25 bg-przyszlosc-tlo px-5 py-4">
            {stopienZagrozenia ? (
              <p className="mb-2 inline-block rounded-full border border-przyszlosc/30 px-3 py-0.5 text-drobne font-semibold uppercase tracking-[0.1em] text-przyszlosc">
                {stopienZagrozenia}
              </p>
            ) : null}
            <p className="text-tresc-duza font-semibold leading-snug text-przyszlosc">{blok.werdykt}</p>
          </div>
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    default:
      return blok.tresc.trim() ? (
        <Sekcja tytul={blok.tytul}>
          <Proza tresc={blok.tresc} />
        </Sekcja>
      ) : null;
  }
}

function Sekcja({ tytul, children }: { tytul: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      {tytul ? (
        <h2 className="mb-4 text-naglowek-maly font-bold leading-tight text-atrament">{tytul}</h2>
      ) : null}
      {children}
    </section>
  );
}

/** Markdown w układzie czytelniczym. Wraca wszędzie tam, gdzie nie ma struktury. */
function Proza({ tresc }: { tresc: string }) {
  if (!tresc.trim()) return null;
  return (
    <div
      className="karta mt-4"
      dangerouslySetInnerHTML={{ __html: marked.parse(tresc, { async: false }) }}
    />
  );
}

// =====================================================================

/**
 * Sześć wymiarów obciążenia jako sześć pasków.
 *
 * Wszystkie w jednym kolorze, bo skala nie ma dobrego i złego końca. Liczba
 * stoi obok paska, żeby nie trzeba było jej odliczać, a uzasadnienie pod nim,
 * bo bez niego ocena jest tylko cyfrą.
 */
function Obciazenie({ wymiary }: { wymiary: WymiarObciazenia[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {wymiary.map((w) => (
        <li key={w.wymiar}>
          <div className="flex items-center gap-3">
            <span className="w-[11rem] shrink-0 text-male font-semibold text-atrament">{w.wymiar}</span>
            <span className="flex flex-1 gap-1" aria-hidden>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`h-2.5 flex-1 rounded-full ${n <= w.ocena ? "bg-akcent" : "bg-linia"}`}
                />
              ))}
            </span>
            <span className="w-8 shrink-0 text-right text-male font-bold tabular-nums text-atrament-sciszony">
              <span className="sr-only">ocena </span>
              {w.ocena}
              <span className="sr-only"> na 5</span>
            </span>
          </div>
          {w.uzasadnienie ? (
            <p className="ml-0 mt-1 text-male leading-relaxed text-atrament-sciszony sm:ml-[11.75rem]">
              {w.uzasadnienie}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

// =====================================================================

/** Kwota w złotych jako zakres liczbowy, o ile da się ją odczytać. */
function zakres(kwota: string): [number, number] | null {
  if (!/zł/.test(kwota)) return null;
  const liczby = [...kwota.matchAll(/(\d[\d\s ]*)/g)]
    .map((m) => Number(m[1].replace(/[\s ]/g, "")))
    .filter((n) => n >= 100);
  if (liczby.length === 0) return null;
  return [liczby[0], liczby[liczby.length - 1]];
}

/**
 * Widełki płacowe jako pasek na skali wspólnej dla całej karty.
 *
 * Sam wiersz tabeli nie pokazuje tego, co widać od razu na pasku: gdzie w tym
 * zawodzie jest skok, a gdzie sufit. Wiersz, którego nie da się odczytać jako
 * kwoty, zostaje samym tekstem i nie udaje, że coś mierzy.
 */
function Widelki({ etapy }: { etapy: WidelkiEtap[] }) {
  const zakresy = etapy.map((e) => zakres(e.kwota));
  const gorna = Math.max(...zakresy.filter(Boolean).map((z) => z![1]), 0);

  return (
    <ul className="flex flex-col gap-3">
      {etapy.map((e, i) => {
        const z = zakresy[i];
        return (
          <li key={`${e.etap}-${i}`} className="rounded-xl border border-linia bg-panel px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-male font-semibold text-atrament">{e.etap}</span>
              <span className="text-tresc font-bold tabular-nums text-akcent-jasny">{e.kwota}</span>
            </div>
            {z && gorna > 0 ? (
              <span aria-hidden className="mt-2.5 block h-2 w-full rounded-full bg-linia">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-akcent-ciemny to-akcent"
                  style={{
                    marginLeft: `${(z[0] / gorna) * 100}%`,
                    width: `${Math.max(3, ((z[1] - z[0]) / gorna) * 100)}%`,
                  }}
                />
              </span>
            ) : null}
            {e.uwaga ? (
              <p className="mt-1.5 text-male text-atrament-sciszony">{e.uwaga}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

// =====================================================================

/** Droga dojścia jako oś: kolejne etapy z czasem, jeden pod drugim. */
function Droga({ kroki }: { kroki: KrokDrogi[] }) {
  return (
    <ol className="relative flex flex-col gap-5 border-l-2 border-linia pl-6">
      {kroki.map((k, i) => (
        <li key={`${k.etap}-${i}`} className="relative">
          <span
            aria-hidden
            className="absolute -left-[1.9rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-akcent bg-panel text-drobne font-bold tabular-nums text-akcent-jasny"
          >
            {i + 1}
          </span>
          <p className="text-tresc font-semibold leading-snug text-atrament">{k.etap}</p>
          {k.czas ? (
            <p className="mt-1 inline-block rounded-full bg-akcent-tlo px-2.5 py-0.5 text-drobne font-semibold tabular-nums text-akcent-jasny">
              {k.czas}
            </p>
          ) : null}
          {k.opis ? <p className="mt-1 text-male leading-relaxed text-atrament-sciszony">{k.opis}</p> : null}
        </li>
      ))}
    </ol>
  );
}

// =====================================================================

/**
 * Na co idzie czas: paski proporcji.
 *
 * Skala idzie do stu, nie do największego udziału. Przy skali z największego
 * czterdzieści procent wyglądałoby jak cały dzień, a to jest dokładnie ta
 * liczba, którą uczestnik ma tu zobaczyć w prawdziwej proporcji.
 */
function PodzialCzasu({ udzialy }: { udzialy: UdzialCzasu[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {udzialy.map((u, i) => (
        <li key={`${u.nazwa}-${i}`}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-male font-semibold text-atrament">{u.nazwa}</span>
            <span className="shrink-0 text-male font-bold tabular-nums text-atrament-sciszony">
              {u.procent}%
            </span>
          </div>
          <span aria-hidden className="mt-1.5 block h-2.5 w-full rounded-full bg-linia">
            <span
              className="block h-full rounded-full bg-akcent"
              style={{ width: `${Math.min(100, u.procent)}%` }}
            />
          </span>
          {u.opis ? <p className="mt-1 text-male text-atrament-sciszony">{u.opis}</p> : null}
        </li>
      ))}
    </ul>
  );
}

// =====================================================================

/**
 * Skala zawodu: wyróżnione bloki zamiast tabeli.
 *
 * Wartości to zdania, nie liczby, więc wyciągamy na wierzch sam szacunek, a
 * resztę zostawiamy pod spodem. Znacznik „≈" zostaje: bez niego liczba udaje
 * dokładną, a nie jest.
 */
function SkalaZawodu({ liczby }: { liczby: LiczbaSkali[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {liczby.map((l, i) => {
        const dopasowanie = l.wartosc.match(
          /^(≈\s*[\d\s ]+(?:do\s+[\d\s ]+)?(?:tys\.|mln|%|lata|lat|roku|rok)?)(.*)$/,
        );
        const liczba = dopasowanie?.[1]?.trim();
        const reszta = (dopasowanie?.[2] ?? l.wartosc).trim().replace(/^,\s*/, "");
        return (
          <li key={`${l.etykieta}-${i}`} className="rounded-xl border border-linia bg-panel px-4 py-3.5">
            <p className="text-drobne uppercase tracking-[0.12em] text-atrament-slaby">{l.etykieta}</p>
            {liczba ? (
              <p className="mt-1.5 text-naglowek-maly font-extrabold leading-tight text-atrament">
                {liczba}
              </p>
            ) : null}
            {reszta ? (
              <p className={`text-male leading-relaxed text-atrament-sciszony ${liczba ? "mt-1" : "mt-1.5"}`}>
                {reszta}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
