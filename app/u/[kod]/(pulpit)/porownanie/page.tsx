import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { pobierzKarty, type KartaZawodu } from "@/lib/raport/serwer";
import { klasterPary } from "@/lib/karty/klastry";
import { ulozKarte, znajdzBlok, znajdzSekcje, type Blok } from "@/lib/karty/uklad";
import { KOSZT, POZIOM, STUDIA, ZAGROZENIE } from "@/lib/karty/etykiety";
import { PrzelacznikKart } from "@/components/karta/PrzelacznikKart";

export const dynamic = "force-dynamic";

/**
 * Porównanie dwóch zawodów obok siebie.
 *
 * System ma dwadzieścia sześć klastrów, czyli grup zawodów, których odpowiedzi
 * uczestnika nie rozróżniają. Przy każdym mówi wprost: „Twoje odpowiedzi nie
 * rozstrzygają, przeczytaj obie karty" - i dotąd zostawiał go z dwiema kartami
 * do otwierania na zmianę i trzymania w głowie.
 *
 * Ten widok pokazuje te same pola jedno pod drugim, więc różnica widać od razu,
 * a na górze stoi pytanie rozstrzygające z bazy klastrów. To jedyne miejsce w
 * programie, które nie opisuje wyniku, tylko pomaga podjąć decyzję.
 */
export default async function Strona({
  params,
  searchParams,
}: {
  params: Promise<{ kod: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { kod } = await params;
  const { a, b } = await searchParams;
  if (!a || !b || a === b) notFound();

  const karty = await pobierzKarty(kod, [a, b]);
  if (!karty || karty.length !== 2) notFound();
  const [lewa, prawa] = karty;
  const klaster = await klasterPary(a, b);

  const blokiLewej = ulozKarte(lewa.sekcje);
  const blokiPrawej = ulozKarte(prawa.sekcje);

  const wiersze = zestawWierszy(
    { karta: lewa, bloki: blokiLewej },
    { karta: prawa, bloki: blokiPrawej },
  );

  return (
    <article className="flex flex-col gap-6">
      <nav>
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie inline-flex items-center gap-2 text-male text-atrament-slaby hover:text-atrament"
        >
          <span aria-hidden>←</span> Wszystkie karty
        </Link>
      </nav>

      <header className="szklo relative overflow-hidden p-7 sm:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-akcent/20 blur-3xl"
        />
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">
          Dwie karty obok siebie
        </p>
        <h1 className="mt-3 text-naglowek font-extrabold leading-tight tracking-tight">
          {lewa.tytul} <span className="text-atrament-slaby">czy</span> {prawa.tytul}
        </h1>

        {klaster ? (
          <div className="mt-6 rounded-xl border border-akcent/30 bg-akcent-tlo px-5 py-4">
            <p className="text-drobne uppercase tracking-[0.14em] text-akcent-jasny">
              Pytanie, które to rozstrzyga
            </p>
            <p className="mt-2 text-tresc-duza font-semibold leading-snug text-atrament">
              {klaster.pytanie}
            </p>
            <p className="mt-3 text-tresc leading-relaxed text-atrament-sciszony">{klaster.roznica}</p>
            {klaster.uwaga ? (
              <p className="mt-2 text-male leading-relaxed text-atrament-sciszony">{klaster.uwaga}</p>
            ) : null}
          </div>
        ) : (
          <p className="proza mt-5">
            Te dwa zawody nie stoją w jednej grupie, więc nie ma gotowego pytania rozstrzygającego.
            Porównanie pól poniżej i tak pokazuje, czym się różnią.
          </p>
        )}

        {!lewa.pelna || !prawa.pelna ? (
          <p className="mt-5 rounded-xl border border-linia bg-tlo/50 px-4 py-3 text-male text-atrament-sciszony">
            {!lewa.pelna && !prawa.pelna
              ? "Obie karty są na razie w wersji skróconej, więc część pól będzie pusta."
              : `Karta „${(!lewa.pelna ? lewa : prawa).tytul}" jest na razie w wersji skróconej, więc część pól będzie pusta.`}
          </p>
        ) : null}
      </header>

      <PrzelacznikKart nazwaA={lewa.tytul} nazwaB={prawa.tytul}>
        <div className="flex flex-col gap-4">
          {/* Nagłówki kolumn zostają na górze, żeby nie zgubić, która jest która. */}
          <div className="sticky top-2 z-10 hidden gap-4 sm:grid sm:grid-cols-2">
            {[lewa, prawa].map((k) => (
              <p
                key={k.kod}
                className="szklo szklo-mocne px-4 py-2.5 text-tresc font-bold text-atrament"
              >
                {k.tytul}
              </p>
            ))}
          </div>

          {wiersze.map((w) => (
            <section key={w.pole} data-pole={w.pole} className="szklo p-5 sm:p-6">
              <h2 className="mb-4 text-naglowek-maly font-bold text-atrament">{w.tytul}</h2>
              {w.razem ? (
                w.razem
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="kolumna-a">
                    <p className="mb-2 text-drobne uppercase tracking-[0.12em] text-atrament-slaby sm:hidden">
                      {lewa.tytul}
                    </p>
                    {w.lewa ?? <Pusto />}
                  </div>
                  <div className="kolumna-b">
                    <p className="mb-2 text-drobne uppercase tracking-[0.12em] text-atrament-slaby sm:hidden">
                      {prawa.tytul}
                    </p>
                    {w.prawa ?? <Pusto />}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </PrzelacznikKart>

      <footer className="szklo flex flex-wrap gap-3 p-6">
        <Link
          href={`/u/${kod}/zawod/${lewa.kod}`}
          className="przejscie przycisk-pigulka inline-flex min-h-12 items-center rounded-full px-7 text-male font-semibold"
        >
          Cała karta: {lewa.tytul}
        </Link>
        <Link
          href={`/u/${kod}/zawod/${prawa.kod}`}
          className="przejscie przycisk-pigulka inline-flex min-h-12 items-center rounded-full px-7 text-male font-semibold"
        >
          Cała karta: {prawa.tytul}
        </Link>
      </footer>
    </article>
  );
}

interface Strona {
  karta: KartaZawodu;
  bloki: Blok[];
}

interface Wiersz {
  pole: string;
  tytul: string;
  lewa?: React.ReactNode;
  prawa?: React.ReactNode;
  /** Pole, które czyta się lepiej zestawione w jednej tabelce niż w dwóch kolumnach. */
  razem?: React.ReactNode;
}

/**
 * Siedem pól, po których naprawdę podejmuje się tę decyzję. Kolejność jest
 * kolejnością pytań, które zadaje sobie ktoś wybierający: co to w ogóle jest,
 * ile to kosztuje ciało i głowę, ile płacą, jak długa droga, ile to kosztuje
 * na wejściu, czy to przetrwa i czy to na pewno nie jest dla mnie.
 */
function zestawWierszy(a: Strona, b: Strona): Wiersz[] {
  const obciazenieA = znajdzBlok(a.bloki, "obciazenie");
  const obciazenieB = znajdzBlok(b.bloki, "obciazenie");

  return [
    {
      pole: "streszczenie",
      tytul: "W jednym zdaniu",
      lewa: <Akapit tresc={znajdzSekcje(a.karta.sekcje, "streszczenie")?.tresc} duzy />,
      prawa: <Akapit tresc={znajdzSekcje(b.karta.sekcje, "streszczenie")?.tresc} duzy />,
    },
    {
      pole: "obciazenie",
      tytul: "Sześć wymiarów obciążenia",
      razem:
        obciazenieA && obciazenieB ? (
          <ObciazenieObok a={obciazenieA} b={obciazenieB} nazwaA={a.karta.tytul} nazwaB={b.karta.tytul} />
        ) : undefined,
      lewa: obciazenieA ? <ListaWymiarow blok={obciazenieA} /> : undefined,
      prawa: obciazenieB ? <ListaWymiarow blok={obciazenieB} /> : undefined,
    },
    {
      pole: "pieniadze",
      tytul: "Widełki",
      lewa: <ListaEtapow blok={znajdzBlok(a.bloki, "pieniadze")} />,
      prawa: <ListaEtapow blok={znajdzBlok(b.bloki, "pieniadze")} />,
    },
    {
      pole: "droga",
      tytul: "Droga dojścia",
      lewa: <ListaKrokow karta={a} />,
      prawa: <ListaKrokow karta={b} />,
    },
    {
      pole: "koszt",
      tytul: "Ile kosztuje wejście",
      lewa: <Koszt karta={a.karta} />,
      prawa: <Koszt karta={b.karta} />,
    },
    {
      pole: "zagrozenie",
      tytul: "Czy zagrożony w przyszłości",
      lewa: <Zagrozenie karta={a} />,
      prawa: <Zagrozenie karta={b} />,
    },
    {
      pole: "kto_sie_nie_odnajdzie",
      tytul: "Kto się w tym nie odnajdzie",
      lewa: <Akapit tresc={znajdzSekcje(a.karta.sekcje, "kto_sie_nie_odnajdzie")?.tresc} />,
      prawa: <Akapit tresc={znajdzSekcje(b.karta.sekcje, "kto_sie_nie_odnajdzie")?.tresc} />,
    },
  ];
}

function Pusto() {
  return (
    <p className="text-male italic text-atrament-slaby">
      Tego pola nie ma jeszcze w tej karcie.
    </p>
  );
}

function Akapit({ tresc, duzy }: { tresc?: string; duzy?: boolean }) {
  if (!tresc?.trim()) return <Pusto />;
  return (
    <div
      className={`karta ${duzy ? "text-tresc-duza font-medium leading-relaxed text-atrament" : ""}`}
      dangerouslySetInnerHTML={{ __html: marked.parse(tresc, { async: false }) }}
    />
  );
}

/**
 * Sześć wymiarów zestawionych w jednej tabelce, a nie w dwóch kolumnach.
 *
 * To jest jedyne pole, w którym obie karty mają dokładnie te same wiersze, więc
 * różnicę widać dopiero wtedy, gdy dwie oceny stoją w tej samej linii.
 */
function ObciazenieObok({
  a,
  b,
  nazwaA,
  nazwaB,
}: {
  a: Extract<Blok, { rodzaj: "obciazenie" }>;
  b: Extract<Blok, { rodzaj: "obciazenie" }>;
  nazwaA: string;
  nazwaB: string;
}) {
  const wymiary = a.wymiary.map((w, i) => ({
    nazwa: w.wymiar,
    ocenaA: w.ocena,
    ocenaB: b.wymiary[i]?.ocena,
  }));

  return (
    <ul className="flex flex-col gap-4">
      {wymiary.map((w) => (
        <li key={w.nazwa} className="border-b border-linia pb-4 last:border-0 last:pb-0">
          <p className="text-male font-semibold text-atrament">{w.nazwa}</p>
          <div className="mt-2 flex flex-col gap-1.5">
            <Pasek nazwa={nazwaA} ocena={w.ocenaA} />
            <Pasek nazwa={nazwaB} ocena={w.ocenaB} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Wymiary jednej karty. Wariant na wypadek, gdy druga karta ich nie ma. */
function ListaWymiarow({ blok }: { blok: Extract<Blok, { rodzaj: "obciazenie" }> }) {
  return (
    <ul className="flex flex-col gap-2">
      {blok.wymiary.map((w) => (
        <li key={w.wymiar}>
          <Pasek nazwa={w.wymiar} ocena={w.ocena} />
        </li>
      ))}
    </ul>
  );
}

/** Ocena jako pięć pól. Bez czerwieni: wysokie obciążenie nie jest wadą. */
function Pasek({ nazwa, ocena }: { nazwa: string; ocena?: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[8.5rem] shrink-0 truncate text-drobne text-atrament-slaby">{nazwa}</span>
      <span className="flex flex-1 gap-1" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`h-2.5 flex-1 rounded-full ${ocena && n <= ocena ? "bg-akcent" : "bg-linia"}`}
          />
        ))}
      </span>
      <span className="w-6 shrink-0 text-right text-male font-bold tabular-nums text-atrament-sciszony">
        {ocena ?? "?"}
      </span>
    </div>
  );
}

function ListaEtapow({ blok }: { blok: Extract<Blok, { rodzaj: "pieniadze" }> | null }) {
  if (!blok) return <Pusto />;
  return (
    <ul className="flex flex-col gap-2">
      {blok.etapy.map((e, i) => (
        <li key={`${e.etap}-${i}`} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <span className="text-male text-atrament-sciszony">{e.etap}</span>
          <span className="text-male font-bold tabular-nums text-akcent-jasny">{e.kwota}</span>
        </li>
      ))}
    </ul>
  );
}

function ListaKrokow({ karta }: { karta: Strona }) {
  const blok = znajdzBlok(karta.bloki, "droga");
  if (!blok) return <Pusto />;
  return (
    <>
      <p className="mb-3 text-drobne uppercase tracking-[0.12em] text-atrament-slaby">
        {POZIOM[karta.karta.poziom] ?? karta.karta.poziom} · {STUDIA[karta.karta.studia] ?? karta.karta.studia}
      </p>
      <ol className="flex flex-col gap-2.5 border-l-2 border-linia pl-5">
        {blok.kroki.map((k, i) => (
          <li key={`${k.etap}-${i}`} className="relative">
            <span
              aria-hidden
              className="absolute -left-[1.65rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-akcent bg-panel text-[0.7rem] font-bold tabular-nums text-akcent-jasny"
            >
              {i + 1}
            </span>
            <p className="text-male font-semibold leading-snug text-atrament">{k.etap}</p>
            {k.czas ? (
              <p className="text-drobne tabular-nums text-atrament-slaby">{k.czas}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </>
  );
}

function Koszt({ karta }: { karta: KartaZawodu }) {
  const sekcja = znajdzSekcje(karta.sekcje, "koszt");
  return (
    <>
      <p className="inline-block rounded-full border border-koszt/30 bg-koszt-tlo px-3 py-1 text-drobne font-semibold text-koszt">
        {KOSZT[karta.koszt] ?? karta.koszt}
      </p>
      {sekcja ? <Akapit tresc={sekcja.tresc} /> : null}
    </>
  );
}

function Zagrozenie({ karta }: { karta: Strona }) {
  const blok = znajdzBlok(karta.bloki, "zagrozenie");
  return (
    <>
      <p className="inline-block rounded-full border border-przyszlosc/30 bg-przyszlosc-tlo px-3 py-1 text-drobne font-semibold text-przyszlosc">
        {ZAGROZENIE[karta.karta.zagrozenie] ?? karta.karta.zagrozenie}
      </p>
      {blok ? (
        <p className="mt-3 text-tresc font-semibold leading-snug text-atrament">{blok.werdykt}</p>
      ) : (
        <div className="mt-3">
          <Pusto />
        </div>
      )}
    </>
  );
}
