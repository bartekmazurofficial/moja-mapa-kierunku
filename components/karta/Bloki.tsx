/**
 * Karta zawodu: sekcje, które mają dane, dostają formę.
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
 * potrzebuje piątki, część jedynki, więc **żaden wskaźnik nie jest czerwony**.
 * Kolor paska mówi, który to wymiar, i nie zmienia się z wartością. Znaczniki
 * „≈" i „○" zostają widoczne: mówią, że to szacunek i kwota do corocznej
 * aktualizacji, a nie dane z rejestru.
 */

import { marked } from "marked";
import type {
  Blok,
  KrokDrogi,
  KrokHarmonogramu,
  LiczbaSkali,
  Punkt,
  UdzialCzasu,
  WidelkiEtap,
  WymiarObciazenia,
} from "@/lib/karty/uklad";

export function BlokKarty({
  blok,
  tytul,
  stopienZagrozenia,
  bezTytulu,
}: {
  blok: Blok;
  /** Własny nagłówek zamiast tytułu z dokumentu. */
  tytul?: string;
  /** Stopien zagrozenia z bazy zawodow. Slowo, nie cyfra, i nigdy alarm. */
  stopienZagrozenia?: string;
  /** Nagłówek rysuje strona, nie blok. */
  bezTytulu?: boolean;
}) {
  const naglowek = bezTytulu ? "" : (tytul ?? blok.tytul);

  switch (blok.rodzaj) {
    case "obciazenie":
      return (
        <Sekcja tytul={naglowek}>
          <Obciazenie wymiary={blok.wymiary} />
        </Sekcja>
      );
    case "pieniadze":
      return (
        <Sekcja tytul={naglowek}>
          <Widelki etapy={blok.etapy} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "droga":
      return (
        <Sekcja tytul={naglowek}>
          <Droga kroki={blok.kroki} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "czas":
      return (
        <Sekcja tytul={naglowek}>
          <PodzialCzasu udzialy={blok.udzialy} />
        </Sekcja>
      );
    case "skala":
      return (
        <Sekcja tytul={naglowek}>
          <SkalaZawodu liczby={blok.liczby} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "harmonogram":
      return (
        <Sekcja tytul={naglowek}>
          <Harmonogram kroki={blok.kroki} />
        </Sekcja>
      );
    case "hasla":
      return (
        <Sekcja tytul={naglowek}>
          <Hasla hasla={blok.hasla} />
        </Sekcja>
      );
    case "wypunktowanie":
      return (
        <Sekcja tytul={naglowek}>
          <Punkty punkty={blok.punkty} ostrzezenie={blok.slot === "kto"} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "zagrozenie":
      return (
        <Sekcja tytul={naglowek}>
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
        <Sekcja tytul={naglowek}>
          <Proza tresc={blok.tresc} />
        </Sekcja>
      ) : null;
  }
}

function Sekcja({ tytul, children }: { tytul: string; children: React.ReactNode }) {
  return (
    <section>
      {tytul ? (
        <h2 className="mb-4 text-naglowek-maly font-bold leading-tight text-atrament">{tytul}</h2>
      ) : null}
      {children}
    </section>
  );
}

/** Markdown w układzie czytelniczym. Wraca wszędzie tam, gdzie nie ma struktury. */
export function Proza({ tresc }: { tresc: string }) {
  if (!tresc.trim()) return null;
  return (
    <div
      className="karta mt-4 first:mt-0"
      dangerouslySetInnerHTML={{ __html: marked.parse(tresc, { async: false }) }}
    />
  );
}

// =====================================================================

/**
 * Kolor wymiaru obciążenia. Stały, przypisany wymiarowi, nigdy zależny od
 * wartości: piątka na kontakcie z ludźmi jest dla jednych powodem, a dla
 * innych przeszkodą, i interfejs nie ma prawa tego rozstrzygać. Dlatego nie
 * ma tu ani jednego czerwonego paska.
 */
const KOLOR_WYMIARU: Array<{ dopasowanie: RegExp; kolor: string }> = [
  { dopasowanie: /^fizyczn/i, kolor: "#00c56a" },
  { dopasowanie: /^psychiczn/i, kolor: "#8b5cf6" },
  { dopasowanie: /^presja/i, kolor: "#ffc400" },
  { dopasowanie: /^odpowiedzialn/i, kolor: "#1d5bff" },
  { dopasowanie: /^kontakt/i, kolor: "#00c2d8" },
  { dopasowanie: /^nieprzewidywaln|^przewidywaln/i, kolor: "#0730a8" },
];

function kolorWymiaru(nazwa: string, i: number): string {
  return (
    KOLOR_WYMIARU.find((w) => w.dopasowanie.test(nazwa))?.kolor ??
    KOLOR_WYMIARU[i % KOLOR_WYMIARU.length].kolor
  );
}

/**
 * Sześć wymiarów obciążenia jako sześć pasków.
 *
 * Liczba stoi obok paska, żeby nie trzeba było jej odliczać, a uzasadnienie
 * pod nim, bo bez niego ocena jest tylko cyfrą.
 */
function Obciazenie({ wymiary }: { wymiary: WymiarObciazenia[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {wymiary.map((w, i) => {
        const kolor = kolorWymiaru(w.wymiar, i);
        return (
          <li key={w.wymiar}>
            <div className="flex items-center gap-3">
              <span className="min-w-0 flex-1 text-male font-semibold leading-snug text-atrament">
                {w.wymiar}
              </span>
              <span className="flex w-[7.5rem] shrink-0 gap-1" aria-hidden>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className="h-2.5 flex-1 rounded-full"
                    style={{ background: n <= w.ocena ? kolor : "var(--color-linia)" }}
                  />
                ))}
              </span>
              <span className="w-9 shrink-0 text-right text-male font-bold tabular-nums text-atrament-sciszony">
                <span className="sr-only">ocena </span>
                {w.ocena}
                <span aria-hidden className="text-atrament-slaby">/5</span>
                <span className="sr-only"> na 5</span>
              </span>
            </div>
            {w.uzasadnienie ? (
              <p className="mt-1 text-drobne leading-relaxed text-atrament-sciszony">
                {w.uzasadnienie}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

// =====================================================================

/** Kwota w złotych jako zakres liczbowy, o ile da się ją odczytać. */
function zakres(kwota: string): [number, number] | null {
  if (!/zł/.test(kwota)) return null;
  const liczby = [...kwota.matchAll(/(\d[\d\s ]*)/g)]
    .map((m) => Number(m[1].replace(/[\s ]/g, "")))
    .filter((n) => n >= 100);
  if (liczby.length === 0) return null;
  return [liczby[0], liczby[liczby.length - 1]];
}

/**
 * Widełki płacowe. Do czterech etapów stoją obok siebie jak kolejne szczeble,
 * bo tak widać skok między nimi. Więcej etapów wraca do listy z paskiem na
 * skali wspólnej dla całej karty.
 */
function Widelki({ etapy }: { etapy: WidelkiEtap[] }) {
  if (etapy.length <= 4 && etapy.every((e) => e.etap.length < 46)) {
    return (
      <ul
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${Math.min(etapy.length, 4)}, minmax(0, 1fr))` }}
      >
        {etapy.map((e, i) => (
          <li
            key={`${e.etap}-${i}`}
            className="rounded-xl border border-akcent/20 bg-akcent-tlo/60 px-4 py-4 text-center"
          >
            <p className="text-drobne font-semibold uppercase tracking-[0.1em] text-atrament-slaby">
              {e.etap}
            </p>
            <p className="mt-2 text-tresc-duza font-extrabold leading-tight text-akcent-jasny">
              {e.kwota}
            </p>
            {e.uwaga ? (
              <p className="mt-1.5 text-drobne text-atrament-sciszony">{e.uwaga}</p>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

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
            {e.uwaga ? <p className="mt-1.5 text-male text-atrament-sciszony">{e.uwaga}</p> : null}
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
          {k.opis ? (
            <p className="mt-1 text-male leading-relaxed text-atrament-sciszony">{k.opis}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

// =====================================================================

/** Zwykły dzień: godzina przy godzinie, jak plan dnia, a nie jak tabela. */
function Harmonogram({ kroki }: { kroki: KrokHarmonogramu[] }) {
  return (
    <ol className="relative flex flex-col gap-4 border-l-2 border-linia pl-5">
      {kroki.map((k, i) => (
        <li key={`${k.kiedy}-${i}`} className="relative">
          <span
            aria-hidden
            className="absolute -left-[1.65rem] top-1.5 h-3 w-3 rounded-full border-2 border-akcent bg-panel"
          />
          <p className="text-drobne font-bold tabular-nums text-akcent-jasny">{k.kiedy}</p>
          <p className="mt-0.5 text-male leading-relaxed text-atrament-sciszony">{k.co}</p>
        </li>
      ))}
    </ol>
  );
}

// =====================================================================

/**
 * Lista haseł rozdzielonych kropką.
 *
 * Krótkie hasła (zawody pokrewne, kierunki rozwoju) stają się pastylkami.
 * Dłuższe, jak umiejętności miękkie albo czynności zwykłego dnia, zostają
 * listą: pastylka na pół wiersza tekstu przestaje być pastylką.
 */
function Hasla({ hasla }: { hasla: string[] }) {
  const krotkie = hasla.every((h) => h.length <= 30);

  if (krotkie) {
    return (
      <ul className="flex flex-wrap gap-2">
        {hasla.map((h, i) => (
          <li
            key={`${h}-${i}`}
            className="rounded-full border border-akcent/25 bg-akcent-tlo px-4 py-2 text-male font-medium text-akcent-jasny"
          >
            {h}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {hasla.map((h, i) => (
        <li
          key={`${h}-${i}`}
          className="flex gap-2.5 rounded-xl border border-linia bg-panel px-4 py-3 text-male leading-relaxed text-atrament-sciszony"
        >
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-akcent" />
          <span>{h}</span>
        </li>
      ))}
    </ul>
  );
}

// =====================================================================

/**
 * Akapity z pogrubioną etykietą jako lista tez z rozwinięciem.
 *
 * „Kto się nie odnajdzie" dostaje znacznik odjęcia, bo to jedyna z tych
 * sekcji, która mówi „to nie dla Ciebie". Reszta jest neutralna: umiejętności,
 * narzędzia i mity nie są ani zaletą, ani wadą.
 */
function Punkty({ punkty, ostrzezenie }: { punkty: Punkt[]; ostrzezenie?: boolean }) {
  return (
    <ul className="flex flex-col gap-3">
      {punkty.map((p, i) => (
        <li
          key={`${p.etykieta}-${i}`}
          className={`flex gap-3 rounded-xl border px-4 py-3 ${
            ostrzezenie ? "border-uwaga/25 bg-uwaga-tlo/50" : "border-linia bg-panel"
          }`}
        >
          <span
            aria-hidden
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.8rem] font-bold ${
              ostrzezenie ? "bg-uwaga text-na-akcencie" : "bg-akcent-tlo text-akcent-jasny"
            }`}
          >
            {ostrzezenie ? "−" : i + 1}
          </span>
          <span className="min-w-0">
            <span className="block text-male font-bold leading-snug text-atrament">
              {p.etykieta}
            </span>
            {p.opis ? (
              <span className="mt-0.5 block text-male leading-relaxed text-atrament-sciszony">
                {p.opis.replace(/\*\*/g, "")}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
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
  const KOLORY_CZASU = ["#1d5bff", "#8b5cf6", "#ff2d55", "#ffc400", "#00c56a", "#00c2d8"];
  return (
    <ul className="flex flex-col gap-3">
      {udzialy.map((u, i) => (
        <li key={`${u.nazwa}-${i}`}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="flex min-w-0 items-baseline gap-2.5">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 translate-y-[-1px] rounded-full"
                style={{ background: KOLORY_CZASU[i % KOLORY_CZASU.length] }}
              />
              <span className="text-male text-atrament">{u.nazwa}</span>
            </span>
            <span className="shrink-0 text-male font-bold tabular-nums text-atrament">
              {u.procent}%
            </span>
          </div>
          <span aria-hidden className="mt-1.5 block h-2 w-full rounded-full bg-linia">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${Math.min(100, u.procent)}%`,
                background: KOLORY_CZASU[i % KOLORY_CZASU.length],
              }}
            />
          </span>
          {u.opis ? <p className="mt-1 text-drobne text-atrament-sciszony">{u.opis}</p> : null}
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
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {liczby.map((l, i) => {
        const dopasowanie = l.wartosc.match(
          /^(≈\s*[\d\s ]+(?:do\s+[\d\s ]+)?(?:tys\.|mln|%|lata|lat|roku|rok)?)(.*)$/,
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
