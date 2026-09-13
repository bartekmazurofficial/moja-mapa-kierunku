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
import { Zwijane } from "./Zwijane";
import type {
  Blok,
  KrokDrogi,
  KrokHarmonogramu,
  LiczbaSkali,
  Punkt,
  UdzialCzasu,
  WidelkiEtap,
  WierszTabeli,
  WymiarObciazenia,
} from "@/lib/karty/uklad";

export function BlokKarty({
  blok,
  tytul,
  stopienZagrozenia,
  bezTytulu,
  bezPrzyciecia,
}: {
  blok: Blok;
  /** Własny nagłówek zamiast tytułu z dokumentu. */
  tytul?: string;
  /** Stopien zagrozenia z bazy zawodow. Slowo, nie cyfra, i nigdy alarm. */
  stopienZagrozenia?: string;
  /** Nagłówek rysuje strona, nie blok. */
  bezTytulu?: boolean;
  /**
   * Sekcja pokazana w całości, bez „Rozwiń".
   *
   * Karta zawodu jest świadomie długą stroną: szablon pokazuje każdą sekcję
   * od razu, a przycisk „Rozwiń" w połowie akapitu robi z niej formularz.
   * Przycinanie zostaje tam, gdzie blok trafia w wąską kolumnę.
   */
  bezPrzyciecia?: boolean;
}) {
  const naglowek = bezTytulu ? "" : (tytul ?? blok.tytul);

  switch (blok.rodzaj) {
    case "obciazenie":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <Obciazenie wymiary={blok.wymiary} />
        </Sekcja>
      );
    case "pieniadze":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <Widelki etapy={blok.etapy} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "droga":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <Droga kroki={blok.kroki} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "czas":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <PodzialCzasu udzialy={blok.udzialy} />
        </Sekcja>
      );
    case "skala":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <SkalaZawodu liczby={blok.liczby} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "harmonogram":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <Harmonogram kroki={blok.kroki} />
        </Sekcja>
      );
    case "hasla":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <Hasla hasla={blok.hasla} />
        </Sekcja>
      );
    case "wypunktowanie":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <Punkty
            punkty={blok.punkty}
            ostrzezenie={blok.slot === "kto"}
            kafelki={blok.slot === "narzedzia" || blok.slot === "czlowiek"}
            // Narzędzia stoją na całej szerokości i mieszczą trzy kolumny.
            // „Co robi z człowiekiem" dzieli wiersz z mitami, więc jedna.
            waskie={blok.slot === "czlowiek" || blok.slot === "kto" || blok.slot === "mity"}
          />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "tabela":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <TabelaWierszy wiersze={blok.wiersze} znacznik={blok.slot === "profil"} />
          <Proza tresc={blok.uwagi} />
        </Sekcja>
      );
    case "zagrozenie":
      return (
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
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
        <Sekcja tytul={naglowek} bezPrzyciecia={bezPrzyciecia}>
          <Proza tresc={blok.tresc} />
        </Sekcja>
      ) : null;
  }
}

function Sekcja({
  tytul,
  children,
  bezPrzyciecia,
}: {
  tytul: string;
  children: React.ReactNode;
  bezPrzyciecia?: boolean;
}) {
  return (
    <section>
      {tytul ? (
        <h2 className="mb-4 text-naglowek-maly font-bold leading-tight text-atrament">{tytul}</h2>
      ) : null}
      {/* Sekcja dłuższa niż kilka akapitów zwija się do „Rozwiń". Krótka nie
          dostaje przycisku wcale: o tym decyduje zmierzona wysokość. */}
      {bezPrzyciecia ? children : <Zwijane>{children}</Zwijane>}
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
    <ul className="grid gap-x-11 sm:grid-cols-2">
      {wymiary.map((w, i) => {
        const kolor = kolorWymiaru(w.wymiar, i);
        return (
          <li
            key={w.wymiar}
            className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-x-5 gap-y-1 border-b border-linia py-3.5 last:border-b-0 sm:grid-cols-[8.5rem_5.5rem_minmax(0,1fr)]"
          >
            <span className="text-male font-bold leading-snug text-atrament">{w.wymiar}</span>
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="h-2 flex-1 rounded-full bg-linia">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${(w.ocena / 5) * 100}%`, background: kolor }}
                />
              </span>
              <span className="shrink-0 text-drobne font-extrabold tabular-nums" style={{ color: kolor }}>
                <span className="sr-only">ocena </span>
                {w.ocena}
                <span className="sr-only"> na 5</span>
              </span>
            </span>
            {w.uzasadnienie ? (
              <span className="col-span-2 text-drobne leading-relaxed text-atrament-sciszony sm:col-span-1">
                {w.uzasadnienie}
              </span>
            ) : (
              <span className="hidden sm:block" />
            )}
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
  const krotkie = etapy.length <= 4 && etapy.every((e) => e.etap.length < 46);
  return (
    <ul
      className={krotkie ? "grid gap-3.5" : "grid gap-3.5 sm:grid-cols-2"}
      style={
        krotkie
          ? { gridTemplateColumns: `repeat(${Math.min(etapy.length, 4)}, minmax(0, 1fr))` }
          : undefined
      }
    >
      {etapy.map((e, i) => (
        <li key={`${e.etap}-${i}`} className="rounded-2xl bg-plyta px-5 py-4">
          <p className="text-male font-bold text-atrament-slaby">{e.etap}</p>
          <p className="mt-1.5 text-naglowek-maly font-extrabold leading-tight tracking-tight text-atrament">
            {e.kwota}
          </p>
          {e.uwaga ? (
            <p className="mt-1.5 text-drobne leading-relaxed text-atrament-sciszony">{e.uwaga}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
// =====================================================================

/** Droga dojścia jako oś: kolejne etapy z czasem, jeden pod drugim. */
function Droga({ kroki }: { kroki: KrokDrogi[] }) {
  // Kolejne etapy jako pasmo kart, a nie pionowa oś: cała droga mieści się
  // wtedy w jednym spojrzeniu, zamiast wymuszać przewijanie.
  const KOLORY_ETAPU = ["#1d5bff", "#3f54ee", "#6b4fe8", "#8b5cf6", "#b05ce0", "#b8460f"];
  return (
    <ol className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
      {kroki.map((k, i) => {
        const kolor = KOLORY_ETAPU[i % KOLORY_ETAPU.length];
        return (
          <li
            key={`${k.etap}-${i}`}
            className="rounded-2xl bg-plyta px-5 py-4"
            style={{ borderTop: `3px solid ${kolor}` }}
          >
            {k.czas ? (
              <p
                className="text-drobne font-extrabold uppercase tracking-[0.1em]"
                style={{ color: kolor }}
              >
                {k.czas}
              </p>
            ) : null}
            <p className="mt-1.5 text-tresc font-extrabold leading-snug text-atrament">{k.etap}</p>
            {k.opis ? (
              <p className="mt-1.5 text-male leading-relaxed text-atrament-sciszony">{k.opis}</p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
// =====================================================================

/** Zwykły dzień: godzina przy godzinie, jak plan dnia, a nie jak tabela. */
function Harmonogram({ kroki }: { kroki: KrokHarmonogramu[] }) {
  return (
    <ol className="flex flex-col">
      {kroki.map((k, i) => (
        <li
          key={`${k.kiedy}-${i}`}
          className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-linia py-2.5 last:border-b-0"
        >
          <span className="text-male font-extrabold tabular-nums text-akcent-jasny">{k.kiedy}</span>
          <span className="text-male leading-relaxed text-atrament-sciszony">{k.co}</span>
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
  const krotkie = hasla.every((h) => h.length <= 34);

  if (krotkie) {
    return (
      <ul className="flex flex-wrap gap-2">
        {hasla.map((h, i) => (
          <li
            key={`${h}-${i}`}
            className="rounded-full bg-akcent-tlo px-4 py-2 text-male font-semibold text-akcent-jasny"
          >
            {h}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {hasla.map((h, i) => (
        <li
          key={`${h}-${i}`}
          className="rounded-2xl bg-plyta px-5 py-3.5 text-male font-semibold leading-relaxed text-atrament"
        >
          {h}
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
function Punkty({
  punkty,
  ostrzezenie,
  kafelki,
  waskie,
}: {
  punkty: Punkt[];
  ostrzezenie?: boolean;
  /** Narzędzia i „co robi z człowiekiem": kafel z tytułem, bez numeru. */
  kafelki?: boolean;
  /** Blok dzieli wiersz z innym: jedna kolumna zamiast trzech. */
  waskie?: boolean;
}) {
  if (kafelki) {
    return (
      <ul className={`grid gap-3.5 ${waskie ? "" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
        {punkty.map((p, i) => (
          <li key={`${p.etykieta}-${i}`} className="rounded-2xl bg-plyta px-5 py-4">
            <p className="text-tresc font-extrabold leading-snug text-atrament">{p.etykieta}</p>
            {p.opis ? (
              <p className="mt-1.5 text-male leading-relaxed text-atrament-sciszony">
                {p.opis.replace(/\*\*/g, "")}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={`grid gap-x-11 ${waskie ? "" : "sm:grid-cols-2"}`}>
      {punkty.map((p, i) => (
        <li
          key={`${p.etykieta}-${i}`}
          className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-4 border-b border-linia py-4 last:border-b-0"
        >
          <span
            aria-hidden
            className={`mt-0.5 flex h-7 w-7 items-center justify-center text-male font-extrabold ${
              ostrzezenie
                ? "rounded-full bg-uwaga-tlo text-uwaga"
                : "rounded-[0.65rem] bg-akcent-tlo text-akcent-jasny"
            }`}
          >
            {ostrzezenie ? "−" : i + 1}
          </span>
          <span className="min-w-0">
            <span className="block text-tresc font-bold leading-snug text-atrament">
              {p.etykieta}
            </span>
            {p.opis ? (
              <span className="mt-1 block text-male leading-relaxed text-atrament-sciszony">
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
  const KOLORY_CZASU = ["#1d5bff", "#5b57e8", "#8b5cf6", "#c2185b", "#b8460f", "#056b78"];
  return (
    <ul className="flex flex-col gap-4">
      {udzialy.map((u, i) => {
        const kolor = KOLORY_CZASU[i % KOLORY_CZASU.length];
        return (
          <li key={`${u.nazwa}-${i}`}>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="min-w-0 text-male font-semibold text-atrament">{u.nazwa}</span>
              <span className="shrink-0 text-male font-extrabold tabular-nums" style={{ color: kolor }}>
                {u.procent}%
              </span>
            </div>
            <span aria-hidden className="block h-2.5 w-full rounded-full bg-linia">
              <span
                className="block h-full rounded-full"
                style={{ width: `${Math.min(100, u.procent)}%`, background: kolor }}
              />
            </span>
            {u.opis ? <p className="mt-1.5 text-drobne text-atrament-sciszony">{u.opis}</p> : null}
          </li>
        );
      })}
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
    <ul className="flex flex-col">
      {liczby.map((l, i) => {
        const dopasowanie = l.wartosc.match(
          /^(≈\s*[\d\s ]+(?:do\s+[\d\s ]+)?(?:tys\.|mln|%|lata|lat|roku|rok)?)(.*)$/,
        );
        const liczba = dopasowanie?.[1]?.trim();
        const reszta = (dopasowanie?.[2] ?? l.wartosc).trim().replace(/^,\s*/, "");
        return (
          <li
            key={`${l.etykieta}-${i}`}
            className="grid gap-1 border-b border-linia py-3 last:border-b-0 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-5"
          >
            <span className="text-male font-bold text-atrament-slaby">{l.etykieta}</span>
            <span className="text-male leading-relaxed text-atrament">
              {liczba ? <b className="font-extrabold">{liczba}</b> : null}
              {liczba && reszta ? " " : null}
              {reszta}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// =====================================================================

/**
 * Tabela dwukolumnowa: profil i koszt wejścia.
 *
 * Profil dostaje po lewej znacznik modułu („A1 wysoko"), bo to nazwa części
 * programu, a nie zdanie. Koszt zostaje zwykłą etykietą.
 */
function TabelaWierszy({ wiersze, znacznik }: { wiersze: WierszTabeli[]; znacznik?: boolean }) {
  return (
    <ul className="flex flex-col">
      {wiersze.map((w, i) => (
        <li
          key={`${w.etykieta}-${i}`}
          className="grid gap-1.5 border-b border-linia py-3 last:border-b-0 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4"
        >
          {znacznik ? (
            <span className="justify-self-start rounded-lg bg-akcent-tlo px-2.5 py-1 text-drobne font-extrabold text-akcent-jasny">
              {w.etykieta}
            </span>
          ) : (
            <span className="text-male font-bold text-atrament-slaby">{w.etykieta}</span>
          )}
          <span className="text-male leading-relaxed text-atrament">{w.wartosc}</span>
        </li>
      ))}
    </ul>
  );
}
