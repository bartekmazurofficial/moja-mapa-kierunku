import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzKarte } from "@/lib/raport/serwer";
import { ulozKarte, wSlocie, type Blok, type Slot } from "@/lib/karty/uklad";
import { BlokKarty, Proza } from "@/components/karta/Bloki";
import { POZIOM, STUDIA, KOSZT, ZAGROZENIE } from "@/lib/karty/etykiety";
import { towarzyszeZKlastra } from "@/lib/karty/klastry";
import { obrazDuzy, obrazPlanszy } from "@/lib/ui/obrazy";

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
  const zdjecieHero = ilustracja ? (obrazPlanszy(ilustracja) ?? obrazDuzy(ilustracja)) : null;

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

      {/* NAGŁÓWEK: 55% tekstu, 45% obrazu dochodzącego do prawej i górnej
          krawędzi, zszytego z kartą maską gradientową. */}
      <header className="szklo szklo-mocne relative isolate overflow-hidden rounded-[1.75rem] p-5 sm:p-7 lg:min-h-[23rem] lg:pr-[44%]">
        {zdjecieHero ? (
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[54%] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zdjecieHero} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            <span className="absolute -left-2 inset-y-0 right-0 bg-gradient-to-r from-white from-18% via-white/45 via-55% to-transparent" />
          </div>
        ) : (
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-akcent/20 blur-3xl"
          />
        )}
        {zdjecieHero ? (
          <div aria-hidden className="pointer-events-none relative -mx-5 -mt-5 mb-4 h-40 overflow-hidden sm:-mx-7 sm:-mt-7 sm:h-48 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zdjecieHero} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            <span className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          </div>
        ) : null}

        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">Zawód</p>
        <h1 className="mt-3 max-w-[16ch] text-naglowek-duzy font-extrabold leading-[1.05] tracking-tight sm:text-tytul">
          {karta.tytul}
        </h1>

        {streszczenie?.rodzaj === "markdown" ? (
          <>
            <p className="mt-4 text-tresc font-bold text-atrament">Co to za praca naprawdę?</p>
            <div className="mt-0.5 max-w-czytelna">
              <Proza tresc={streszczenie.tresc} />
            </div>
          </>
        ) : null}

        {karta.zdanieKierunkowe ? (
          <p className="mt-4 max-w-czytelna border-l-2 border-akcent pl-4 text-tresc font-semibold leading-relaxed">
            {karta.zdanieKierunkowe}
          </p>
        ) : null}

        {!karta.pelna ? (
          <p className="mt-4 max-w-czytelna rounded-xl border border-linia bg-tlo/50 px-4 py-3 text-male text-atrament-sciszony">
            Ta karta jest na razie w wersji skróconej. Pełny opis powstaje.
          </p>
        ) : null}


      </header>

      {/* SZYBKIE FAKTY: trzy karty pod hero, jak w referencji. */}
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
                className="przejscie inline-flex min-h-11 items-center gap-2 rounded-2xl bg-akcent px-6 text-male font-semibold text-na-akcencie hover:bg-akcent-ciemny"
              >
                Porównaj z: {z.nazwa} <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </aside>
      ) : null}

      {/* Tablica, nie kolumna.
          Karta ma dwadzieścia sekcji i w jednej kolumnie rozciągała się na
          prawie dziewięć ekranów. Układ wielokolumnowy pakuje je obok siebie:
          płyta nigdy nie pęka między kolumnami, a to, co najważniejsze przy
          decyzji, stoi na początku pierwszej kolumny. */}
      <div className="gap-4 [column-fill:balance] md:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        <Karta blok={w("czym_jest")} tytul="Czym ta praca jest naprawdę" slot="czym_jest" />
        <Karta blok={w("obciazenie")} tytul="Sześć wymiarów obciążenia" slot="obciazenie" />
        <Karta blok={w("pieniadze")} tytul="Realne zarobki na etapach" slot="pieniadze" />
        <Karta blok={w("czas")} tytul="Na co naprawdę idzie czas?" slot="czas" />
        <Karta blok={w("dzien")} tytul="Jak wygląda zwykły dzień?" slot="dzien" />
        <Karta blok={w("droga")} tytul="Droga dojścia" slot="droga" />
        <Karta
          blok={w("koszt")}
          tytul="Koszt wejścia"
          slot="koszt"
          nad={
            <p className="mb-3 inline-block rounded-full border border-koszt/30 bg-koszt-tlo px-3.5 py-1.5 text-male font-semibold text-koszt">
              {KOSZT[karta.koszt] ?? karta.koszt}
            </p>
          }
        />
        <Karta
          blok={w("zagrozenie")}
          tytul="Czy ten zawód jest zagrożony"
          slot="zagrozenie"
          stopien={ZAGROZENIE[karta.zagrozenie]}
        />
        <Karta blok={w("miekkie")} tytul="Jakie umiejętności są potrzebne?" slot="miekkie" />
        <Karta blok={w("kto")} tytul="Kto może się tu nie odnaleźć?" slot="kto" />
        <Karta blok={w("czlowiek")} tytul="Co ta praca robi z człowiekiem" slot="czlowiek" />
        <Karta blok={w("skala")} tytul="Skala zawodu" slot="skala" />
        <Karta blok={w("rok")} tytul="Jak wygląda zwykły rok?" slot="rok" />
        <Karta blok={w("twarde")} tytul="Co trzeba umieć" slot="twarde" />
        <Karta blok={w("narzedzia")} tytul="Narzędzia i programy, wyjaśnione" slot="narzedzia" />
        <Karta blok={w("mity")} tytul="Trzy mity" slot="mity" />
        <Karta blok={w("dalej")} tytul="Co dalej z tego zawodu" slot="dalej" />
        <Karta blok={w("pokrewne")} tytul="Zawody pokrewne" slot="pokrewne" />
      </div>

      {reszta.length > 0 ? (
        <div className="gap-4 lg:columns-2 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {reszta.map((b, i) => (
            <div key={`${b.rodzaj}-${i}`} className="szklo min-w-0 p-5">
              <BlokKarty blok={b} />
            </div>
          ))}
        </div>
      ) : null}

      <footer className="flex flex-wrap gap-3">
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie przycisk-pigulka inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-2xl px-7 text-tresc font-semibold"
        >
          <span aria-hidden>←</span> Wróć do listy
        </Link>
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie przycisk-gradient inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-2xl px-7 text-tresc font-bold"
        >
          Sprawdź podobne zawody <span aria-hidden>→</span>
        </Link>
      </footer>
    </article>
  );
}

/**
 * Znaki sekcji: jeden na slot, w kolorze, który mówi, o jakim rodzaju rzeczy
 * mowa (czas i dzień turkusowe, pieniądze żółte, ostrzeżenia fioletowe).
 * Kolor niesie nastrój, nie informację, bo obok zawsze stoi tytuł.
 */
const ZNAKI_SLOTOW: Record<string, { sciezki: string[]; tlo: string; atrament: string }> = {
  czym_jest: { sciezki: ["M4 6h16v12H4z", "M8 10h8M8 14h5"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
  skala: { sciezki: ["M4 19h16", "M7 19V11", "M12 19V6", "M17 19v-5"], tlo: "#f2ecff", atrament: "#5b21b6" },
  dzien: { sciezki: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3 2"], tlo: "#e2f8fb", atrament: "#056b78" },
  czas: { sciezki: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 12V5", "M12 12h6"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
  obciazenie: { sciezki: ["M5 20V11", "M12 20V5", "M19 20v-6"], tlo: "#fff6dc", atrament: "#8a5a00" },
  miekkie: { sciezki: ["m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"], tlo: "#f2ecff", atrament: "#5b21b6" },
  koszt: { sciezki: ["M4 8c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Z", "M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"], tlo: "#fff6dc", atrament: "#8a5a00" },
  twarde: { sciezki: ["M12 3 4 7l8 4 8-4-8-4Z", "M4 12l8 4 8-4", "M4 17l8 4 8-4"], tlo: "#e3faed", atrament: "#067a45" },
  narzedzia: { sciezki: ["M14 6a4 4 0 0 0 4 4l-8 8-3-3 8-8a4 4 0 0 0-1-1Z", "M5 19l2-2"], tlo: "#e2f8fb", atrament: "#056b78" },
  pieniadze: { sciezki: ["M4 7h16v10H4z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"], tlo: "#fff6dc", atrament: "#8a5a00" },
  droga: { sciezki: ["M6 20c0-6 12-6 12-12", "M6 20v-3", "M18 8V5"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
  zagrozenie: { sciezki: ["M12 4 3 19h18L12 4Z", "M12 10v4", "M12 17h.01"], tlo: "#f0eefa", atrament: "#4a4a6a" },
  czlowiek: { sciezki: ["M12 20S4 14.6 4 9.4A4.4 4.4 0 0 1 12 6.8 4.4 4.4 0 0 1 20 9.4C20 14.6 12 20 12 20Z"], tlo: "#ffe9ee", atrament: "#c00030" },
  kto: { sciezki: ["M9 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", "M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6", "M16 4.2a2.5 2.5 0 0 1 0 4.6", "M17.5 14.4c2.1.8 3.5 2.8 3.5 5.1"], tlo: "#fff4dc", atrament: "#a15c00" },
  mity: { sciezki: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.5", "M12 17h.01"], tlo: "#f2ecff", atrament: "#5b21b6" },
  rok: { sciezki: ["M4 6h16v14H4z", "M4 10h16", "M8 4v4M16 4v4"], tlo: "#e2f8fb", atrament: "#056b78" },
  dalej: { sciezki: ["M5 12h14", "m13 6 6 6-6 6"], tlo: "#e3faed", atrament: "#067a45" },
  pokrewne: { sciezki: ["M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M16 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "m11 11 2 2"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
};

function ZnakSekcji({ slot }: { slot: string }) {
  const z = ZNAKI_SLOTOW[slot];
  if (!z) return null;
  return (
    <span aria-hidden className="znak-sekcji" style={{ background: z.tlo, color: z.atrament }}>
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {z.sciezki.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </span>
  );
}

/** Jedna sekcja w swojej szklanej płycie, ze znakiem. Bez bloku nie renderuje się nic. */
function Karta({
  blok,
  tytul,
  slot,
  stopien,
  nad,
}: {
  blok: Blok | null;
  tytul: string;
  slot: string;
  stopien?: string;
  /** Treść nad blokiem, na przykład znacznik słownikowy z bazy zawodów. */
  nad?: React.ReactNode;
}) {
  if (!blok) return null;
  return (
    <div className="szklo min-w-0 p-5">
      <div className="mb-4 flex items-center gap-3">
        <ZnakSekcji slot={slot} />
        <h2 className="text-naglowek-maly font-bold leading-tight text-atrament">{tytul}</h2>
      </div>
      {nad}
      <BlokKarty blok={blok} stopienZagrozenia={stopien} bezTytulu />
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
      className="flex items-start gap-3 rounded-karta border px-3.5 py-3"
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
