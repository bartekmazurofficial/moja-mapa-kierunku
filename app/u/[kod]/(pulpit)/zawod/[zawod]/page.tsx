import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzKarte } from "@/lib/raport/serwer";
import { ulozKarte, wSlocie, type Blok, type Slot } from "@/lib/karty/uklad";
import { BlokKarty, Proza } from "@/components/karta/Bloki";
import { POZIOM, STUDIA, KOSZT, ZAGROZENIE } from "@/lib/karty/etykiety";
import { towarzyszeZKlastra } from "@/lib/karty/klastry";
import { Obraz } from "@/components/Ikona";

export const dynamic = "force-dynamic";

/**
 * Karta zawodu: jak wygląda życie człowieka, który to robi.
 *
 * Układ jest prowadzony, a nie przepisany z dokumentu. Kolejność odpowiada
 * kolejności pytań, które zadaje sobie ktoś wybierający: co to w ogóle jest,
 * jak wygląda dzień, ile to kosztuje ciało i głowę, co trzeba umieć, ile
 * płacą, jak długa droga, czy to przetrwa i czy to na pewno nie jest dla mnie.
 *
 * Sekcja, której układ nie rozpoznał, ląduje na końcu jako tekst do czytania.
 * Nic z karty nie może przepaść tylko dlatego, że nie zmieściło się w planie.
 */
export default async function Strona({
  params,
}: {
  params: Promise<{ kod: string; zawod: string }>;
}) {
  const { kod, zawod } = await params;
  const karta = await pobierzKarte(kod, zawod);
  if (!karta) notFound();

  const bloki = ulozKarte(karta.sekcje);
  const obok = await towarzyszeZKlastra(karta.kod, karta.klasterKod);

  const w = (slot: Slot) => wSlocie(bloki, slot);
  // Sloty, ktore maja swoje miejsce w ukladzie. Reszta idzie na koniec.
  const ROZSTAWIONE: Slot[] = [
    "streszczenie", "czym_jest", "dzien", "czas", "obciazenie", "skala", "rok",
    "miekkie", "koszt", "twarde", "narzedzia", "pieniadze", "droga",
    "zagrozenie", "czlowiek", "kto", "mity", "dalej", "pokrewne",
  ];
  const reszta = bloki.filter((b) => !b.slot || !ROZSTAWIONE.includes(b.slot));

  const streszczenie = w("streszczenie");
  const ilustracja = karta.znakObszaru;

  return (
    <article className="flex flex-col gap-5">
      <nav>
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie inline-flex items-center gap-2 text-male text-atrament-slaby hover:text-atrament"
        >
          <span aria-hidden>←</span> Wróć do zawodów
        </Link>
      </nav>

      {/* NAGŁÓWEK */}
      <header className="szklo relative overflow-hidden p-7 sm:p-9 lg:pr-[19rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-akcent/20 blur-3xl"
        />
        {ilustracja ? (
          <div aria-hidden className="pointer-events-none absolute right-8 top-8 hidden lg:block">
            <Obraz klucz={ilustracja} rozmiar={208} />
          </div>
        ) : null}

        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">Zawód</p>
        <h1 className="mt-3 text-naglowek font-extrabold leading-tight tracking-tight sm:text-naglowek-duzy">
          <span className="gradient-tytul">{karta.tytul}</span>
        </h1>

        {streszczenie?.rodzaj === "markdown" ? (
          <>
            <p className="mt-6 text-tresc-duza font-bold text-atrament">Co to za praca naprawdę?</p>
            <div className="mt-1 max-w-czytelna">
              <Proza tresc={streszczenie.tresc} />
            </div>
          </>
        ) : null}

        {karta.zdanieKierunkowe ? (
          <p className="mt-6 max-w-czytelna border-l-2 border-akcent pl-4 text-tresc-duza font-semibold leading-relaxed">
            {karta.zdanieKierunkowe}
          </p>
        ) : null}

        {!karta.pelna ? (
          <p className="mt-5 max-w-czytelna rounded-xl border border-linia bg-tlo/50 px-4 py-3 text-male text-atrament-sciszony">
            Ta karta jest na razie w wersji skróconej. Pełny opis powstaje.
          </p>
        ) : null}
      </header>

      {/* TRZY ZNACZNIKI */}
      <ul className="grid gap-3 sm:grid-cols-3">
        <Znacznik
          barwa={karta.flaga === "trampolina" ? "zielony" : "niebieski"}
          tytul={karta.flaga === "trampolina" ? "Dobre pierwsze miejsce pracy" : "Zawód docelowy"}
          podpis={`${POZIOM[karta.poziom] ?? karta.poziom} · ${STUDIA[karta.studia] ?? karta.studia}`}
          ikona="start"
        />
        <Znacznik
          barwa="zolty"
          tytul={KOSZT[karta.koszt] ?? karta.koszt}
          podpis="Ile trzeba wyłożyć, zanim zacznie się zarabiać"
          ikona="koszt"
        />
        <Znacznik
          barwa={["wysokie", "bardzo_wysokie"].includes(karta.zagrozenie) ? "czerwony" : "fiolet"}
          tytul={ZAGROZENIE[karta.zagrozenie] ?? karta.zagrozenie}
          podpis="Jak ten zawód wygląda za dziesięć lat"
          ikona="przyszlosc"
        />
      </ul>

      {obok.length > 0 ? (
        <aside className="szklo p-6">
          <p className="text-male text-atrament-sciszony">
            {obok.length === 1
              ? "Ten zawód trudno odróżnić od jednego innego na podstawie samych odpowiedzi."
              : "Ten zawód trudno odróżnić od kilku innych na podstawie samych odpowiedzi."}{" "}
            Łatwiej to rozstrzygnąć, czytając obie karty obok siebie.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {obok.map((z) => (
              <Link
                key={z.kod}
                href={`/u/${kod}/porownanie?a=${karta.kod}&b=${z.kod}`}
                className="przejscie inline-flex min-h-11 items-center gap-2 rounded-xl bg-akcent px-5 text-male font-semibold text-na-akcencie hover:bg-akcent-ciemny"
              >
                Porównaj z: {z.nazwa} <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </aside>
      ) : null}

      <Karta blok={w("czym_jest")} tytul="Czym ta praca jest naprawdę" />

      <Para
        lewa={<Karta blok={w("dzien")} tytul="Jak wygląda zwykły dzień?" plaska />}
        prawa={<Karta blok={w("czas")} tytul="Na co naprawdę idzie czas?" plaska />}
      />

      <Karta blok={w("obciazenie")} tytul="Sześć wymiarów obciążenia" />
      <Karta blok={w("skala")} tytul="Skala zawodu" />

      <Para
        lewa={<Karta blok={w("rok")} tytul="Jak wygląda zwykły rok?" plaska />}
        prawa={
          <Karta
            blok={w("koszt")}
            tytul="Koszt wejścia"
            plaska
            nad={
              <p className="mb-3 inline-block rounded-full border border-koszt/30 bg-koszt-tlo px-3.5 py-1.5 text-male font-semibold text-koszt">
                {KOSZT[karta.koszt] ?? karta.koszt}
              </p>
            }
          />
        }
      />

      <Karta blok={w("miekkie")} tytul="Jakie umiejętności są potrzebne?" />
      <Karta blok={w("twarde")} tytul="Co trzeba umieć" />
      <Karta blok={w("narzedzia")} tytul="Narzędzia i programy, wyjaśnione" />
      <Karta blok={w("pieniadze")} tytul="Realne zarobki na etapach" />
      <Karta blok={w("droga")} tytul="Droga dojścia" />
      <Karta blok={w("zagrozenie")} tytul="Czy ten zawód jest zagrożony" stopien={ZAGROZENIE[karta.zagrozenie]} />

      <Para
        lewa={<Karta blok={w("czlowiek")} tytul="Co ta praca robi z człowiekiem" plaska />}
        prawa={<Karta blok={w("kto")} tytul="Kto może się tu nie odnaleźć?" plaska />}
      />

      <Karta blok={w("mity")} tytul="Trzy mity" />

      <Para
        lewa={<Karta blok={w("dalej")} tytul="Co dalej z tego zawodu" plaska />}
        prawa={<Karta blok={w("pokrewne")} tytul="Zawody pokrewne" plaska />}
      />

      {reszta.length > 0 ? (
        <div className="szklo flex flex-col gap-8 p-6 sm:p-8">
          {reszta.map((b, i) => (
            <BlokKarty key={`${b.rodzaj}-${i}`} blok={b} />
          ))}
        </div>
      ) : null}

      <footer className="flex flex-wrap gap-3">
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl border border-linia-mocna bg-szklo px-6 text-tresc font-semibold hover:border-akcent/50 hover:text-akcent-jasny"
        >
          <span aria-hidden>←</span> Wróć do listy
        </Link>
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie poswiata inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-akcent-ciemny to-akcent px-6 text-tresc font-bold text-na-akcencie hover:brightness-110"
        >
          Sprawdź podobne zawody <span aria-hidden>→</span>
        </Link>
      </footer>
    </article>
  );
}

/** Jedna sekcja w swojej szklanej płycie. Bez bloku nie renderuje się nic. */
function Karta({
  blok,
  tytul,
  stopien,
  nad,
  plaska,
}: {
  blok: Blok | null;
  tytul: string;
  stopien?: string;
  /** Treść nad blokiem, na przykład znacznik słownikowy z bazy zawodów. */
  nad?: React.ReactNode;
  /** Płyta w parze kolumn: ma się rozciągać na całą wysokość rzędu. */
  plaska?: boolean;
}) {
  if (!blok) return null;
  return (
    <div className={`szklo p-6 sm:p-7 ${plaska ? "h-full" : ""}`}>
      {nad}
      <BlokKarty blok={blok} tytul={tytul} stopienZagrozenia={stopien} />
    </div>
  );
}

/** Dwie płyty obok siebie. Gdy jest tylko jedna, zajmuje całą szerokość. */
function Para({ lewa, prawa }: { lewa: React.ReactNode; prawa: React.ReactNode }) {
  if (!lewa && !prawa) return null;
  if (!lewa || !prawa) return <>{lewa}{prawa}</>;
  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      {lewa}
      {prawa}
    </div>
  );
}

const BARWY: Record<string, { obwod: string; tlo: string; atrament: string }> = {
  zielony: { obwod: "#8fe3b8", tlo: "#e3faed", atrament: "#067a45" },
  niebieski: { obwod: "#9cbcff", tlo: "#e9f0ff", atrament: "#0a3ac9" },
  zolty: { obwod: "#f0cf6a", tlo: "#fff6dc", atrament: "#8a5a00" },
  czerwony: { obwod: "#ffa9bc", tlo: "#ffe9ee", atrament: "#c00030" },
  fiolet: { obwod: "#c3a9f7", tlo: "#f2ecff", atrament: "#5b21b6" },
};

const ZNAKI: Record<string, string[]> = {
  start: ["M12 20v-8", "M12 12c0-3 2-5 5-5 0 3-2 5-5 5Z", "M12 14c0-2.5-1.7-4-4-4 0 2.5 1.7 4 4 4Z"],
  koszt: ["M4 8c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Z", "M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"],
  przyszlosc: ["M12 4 3 19h18L12 4Z", "M12 10v4", "M12 17h.01"],
};

/**
 * Znacznik na górze karty: trzy rzeczy, które decydują o tym, czy w ogóle
 * czytać dalej. Kolor jest tu na miejscu, bo niesie znaczenie, a obok niego
 * zawsze stoi pełne zdanie.
 */
function Znacznik({
  barwa,
  tytul,
  podpis,
  ikona,
}: {
  barwa: keyof typeof BARWY | string;
  tytul: string;
  podpis: string;
  ikona: keyof typeof ZNAKI;
}) {
  const b = BARWY[barwa] ?? BARWY.niebieski;
  return (
    <li
      className="flex items-start gap-3 rounded-karta border px-4 py-4"
      style={{ borderColor: b.obwod, background: b.tlo }}
    >
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
        style={{ borderColor: b.obwod, background: "#ffffff", color: b.atrament }}
      >
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {ZNAKI[ikona].map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-male font-bold leading-snug" style={{ color: b.atrament }}>
          {tytul}
        </span>
        <span className="mt-0.5 block text-drobne leading-relaxed text-atrament-sciszony">
          {podpis}
        </span>
      </span>
    </li>
  );
}
