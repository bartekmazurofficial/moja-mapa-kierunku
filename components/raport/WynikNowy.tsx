/**
 * WYNIK NOWEGO PROGRAMU.
 *
 * Piec sekcji, w kolejnosci, w ktorej uczestnik je wypelnial: ciekawosc,
 * dwa tory czynnosci i ich nalozenie, poziom zycia, dopiero na koncu zawody.
 *
 * **Zawody na koncu, nigdy wyzej.** To jest regula produktu, nie uklad
 * strony: konkretny zawod przeczytany przed obszarami zamyka mysleie
 * na wszystko inne, a przeczytany po nich jest przykladem, nie wyrokiem.
 * Sekcja zawodow stoi za warstwa, ktora otwiera prowadzacy, wiec do tego
 * czasu nie ma jej takze w kodzie strony.
 *
 * Czego tu nie ma, swiadomie:
 *
 *   - **zadnej liczby dopasowania.** Ranking jest w silniku i ma tam zostac.
 *     Uczestnik dostaje kolejnosc i uzasadnienie, nie procent,
 *   - **zadnego porownania z kimkolwiek.** Ani z grupa, ani ze srednia,
 *   - **zadnego „nic nie pasuje".** Brakujacy modul daje zdanie o tym,
 *     czego jeszcze brakuje, a nie pusta strone.
 */

import Link from "next/link";
import { BARWA, GRADIENT } from "./barwy";
import { zl } from "@/lib/ui/kwota";
import { OPISY_PASM } from "@/lib/engine/zarobki";
import { INSTRUKCJA_POZIOMU_ZYCIA } from "@/lib/content/poziom-zycia";
import type { WynikNowegoProgramu } from "@/lib/raport/nowy";

interface Wlasciwosci {
  wynik: WynikNowegoProgramu;
  kodUczestnika: string;
  /** Czy prowadzacy odslonil warstwe z zawodami. */
  zawodyOdslonite: boolean;
  imie: string;
}

function Sekcja({
  numer,
  tytul,
  podpis,
  kolor,
  children,
}: {
  numer: number;
  tytul: string;
  podpis?: string;
  kolor: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="flex items-baseline gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-drobne font-bold text-white"
          style={{ background: kolor }}
        >
          {numer}
        </span>
        <h2 className="text-naglowek font-extrabold tracking-tight" style={{ color: BARWA.atrament }}>
          {tytul}
        </h2>
      </div>
      {podpis ? (
        <p className="proza mt-2 max-w-czytelna text-atrament-sciszony">{podpis}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Zdanie o module, ktorego uczestnik jeszcze nie domknal. */
function Brakuje({ co }: { co: string }) {
  return (
    <p className="rounded-xl border-2 border-dashed border-linia-mocna bg-plyta px-4 py-3 text-male text-atrament-sciszony">
      Tej części jeszcze nie ma, bo moduł „{co}” nie jest domknięty. Wróć do niego, a ta sekcja
      pojawi się sama.
    </p>
  );
}

export function WynikNowy({ wynik, kodUczestnika, zawodyOdslonite, imie }: Wlasciwosci) {
  const { ciekawosc, lubie, umiem, listy, poziom, zawody, domkniete } = wynik;

  return (
    <article className="pb-16">
      <header className="overflow-hidden rounded-2xl" style={{ background: GRADIENT.ciemny }}>
        <div className="px-6 py-10 sm:px-10 sm:py-14">
          <p className="text-drobne uppercase tracking-[0.2em] text-white/70">Twój wynik</p>
          <h1 className="mt-3 text-naglowek-duzy font-extrabold leading-tight tracking-tight text-white">
            {imie}, to jest to, co o sobie powiedziałeś
          </h1>
          <p className="mt-4 max-w-czytelna text-tresc leading-relaxed text-white/85">
            Nic tu nie zostało zgadnięte. Każda sekcja niżej wynika z odpowiedzi, które sam
            zaznaczyłeś, i da się pokazać, z których.
          </p>
        </div>
      </header>

      {/* 1 · CIEKAWOŚĆ */}
      <Sekcja
        numer={1}
        kolor={BARWA.niebieski}
        tytul="Co Cię ciekawi"
        podpis="Piątka tematów, przy których zostałeś po trzech coraz trudniejszych pytaniach. Temat nie jest zawodem: mówi, w jakiej branży ta sama praca będzie dla Ciebie ciekawsza."
      >
        {domkniete.Z ? (
          <ol className="flex flex-col gap-2">
            {ciekawosc.top5.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 rounded-xl border-2 border-linia bg-panel px-4 py-3"
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-male font-bold text-white"
                  style={{ background: BARWA.niebieski }}
                >
                  {p.miejsce}
                </span>
                <span className="text-tresc font-medium text-atrament">{p.nazwa}</span>
              </li>
            ))}
          </ol>
        ) : (
          <Brakuje co="Co mnie ciekawi" />
        )}
      </Sekcja>

      {/* 2 · DWA TORY */}
      <Sekcja
        numer={2}
        kolor={BARWA.fiolet}
        tytul="Co lubisz i w czym jesteś dobry"
        podpis="Dwa osobne pytania, zadane w dwóch osobnych modułach. Najciekawsze jest tam, gdzie odpowiedzi się rozjeżdżają."
      >
        {domkniete.L && domkniete.U ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { tytul: "Lubisz najbardziej", lista: lubie.top5, kolor: BARWA.fiolet },
                { tytul: "Wychodzi Ci najlepiej", lista: umiem.top5, kolor: BARWA.zielenSrednia },
              ].map((k) => (
                <div key={k.tytul} className="rounded-xl border-2 border-linia bg-panel p-4">
                  <h3 className="text-drobne font-bold uppercase tracking-wide" style={{ color: k.kolor }}>
                    {k.tytul}
                  </h3>
                  <ol className="mt-3 flex flex-col gap-2">
                    {k.lista.map((p) => (
                      <li key={p.id} className="flex gap-3 text-male text-atrament">
                        <span className="w-4 shrink-0 font-bold tabular-nums text-atrament-sciszony">
                          {p.miejsce}
                        </span>
                        <span>{p.nazwa}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {listy.map((l, i) => (
                <div
                  key={l.tytul}
                  className="rounded-xl p-4 text-white"
                  style={{ background: GRADIENT.wartosci[i] ?? GRADIENT.wartosci[0] }}
                >
                  <h3 className="text-tresc font-bold">{l.tytul}</h3>
                  <p className="mt-1 text-male leading-relaxed text-white/85">{l.opis}</p>
                  {l.pozycje.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {l.pozycje.map((p) => (
                        <li
                          key={p.id}
                          className="rounded-lg bg-white/20 px-3 py-1.5 text-male font-medium text-white"
                        >
                          {p.nazwa}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-male text-white/70">
                      Na tej liście nic nie wyszło. To nie jest brak: to znaczy, że oba Twoje tory
                      pokrywają się wyjątkowo mocno.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <Brakuje co={domkniete.L ? "W czym jestem dobry" : "Co lubię robić"} />
        )}
      </Sekcja>

      {/* 3 · POZIOM ŻYCIA */}
      <Sekcja
        numer={3}
        kolor={BARWA.zielenSrednia}
        tytul="Ile kosztuje życie, którego chcesz"
        podpis="Nie pytaliśmy, ile chcesz zarabiać. Zaprojektowałeś życie, a kwota wyszła z niego sama. Dlatego da się ją sprawdzić."
      >
        {poziom ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { ...INSTRUKCJA_POZIOMU_ZYCIA.wynik.minimum, kwota: poziom.minimum, grad: GRADIENT.progi[0] },
                { ...INSTRUKCJA_POZIOMU_ZYCIA.wynik.komfort, kwota: poziom.komfort, grad: GRADIENT.progi[1] },
                { ...INSTRUKCJA_POZIOMU_ZYCIA.wynik.cel, kwota: poziom.cel, grad: GRADIENT.progi[2] },
              ].map((p) => (
                <div key={p.nazwa} className="rounded-xl p-5 text-white" style={{ background: p.grad }}>
                  <p className="text-drobne font-bold uppercase tracking-wide text-white/80">{p.nazwa}</p>
                  <p className="mt-1 text-naglowek font-extrabold tracking-tight">{zl(p.kwota)}</p>
                  <p className="mt-2 text-male leading-relaxed text-white/85">{p.opis}</p>
                </div>
              ))}
            </div>

            <p className="proza mt-6 max-w-czytelna text-atrament-sciszony">
              Twoje docelowe życie kosztuje około <strong>{zl(poziom.kosztRoczny)}</strong> rocznie.
            </p>

            <h3 className="mt-6 text-naglowek-maly font-bold tracking-tight text-atrament">
              Co najbardziej podnosi Twój koszt życia
            </h3>
            <p className="proza mt-1 max-w-czytelna text-atrament-sciszony">
              {INSTRUKCJA_POZIOMU_ZYCIA.rankingWstep}
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {poziom.skladniki.slice(0, 7).map((s) => (
                <li key={s.kod} className="rounded-xl border-2 border-linia bg-panel px-4 py-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-male font-semibold text-atrament">{s.nazwa}</span>
                    <span className="shrink-0 text-male tabular-nums text-atrament-sciszony">
                      {zl(s.kwota)} · {s.udzial}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-linia">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.udzial}%`, background: BARWA.zielenSrednia }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Brakuje co="Poziom życia i dochodu" />
        )}
      </Sekcja>

      {/* 4 · ZAWODY */}
      <Sekcja
        numer={4}
        kolor={BARWA.rdza}
        tytul="Zawody, od których warto zacząć"
        podpis="To nie jest wyrok ani ranking. To lista miejsc, w których Twoje odpowiedzi spotykają się z realną pracą, celowo różnorodna, żeby nie było ośmiu odmian tego samego."
      >
        {!zawodyOdslonite ? (
          <p className="rounded-xl border-2 border-dashed border-linia-mocna bg-plyta px-4 py-4 text-male text-atrament-sciszony">
            Ta część otworzy się na spotkaniu, po omówieniu obszarów. Kolejność ma znaczenie:
            konkretny zawód czyta się zupełnie inaczej, kiedy wiadomo już, z czego wyszedł.
          </p>
        ) : zawody.length === 0 ? (
          <Brakuje co="Co lubię robić" />
        ) : (
          <>
            <ol className="flex flex-col gap-3">
              {zawody.map((z, i) => (
                <li key={z.kod} className="rounded-xl border-2 border-linia bg-panel p-4">
                  <div className="flex items-start gap-4">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-male font-bold text-white"
                      style={{ background: BARWA.rdza }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-tresc-duza font-bold text-atrament">{z.nazwa}</h3>
                        {z.bezStudiow ? (
                          <span
                            className="rounded-md px-2 py-0.5 text-drobne font-semibold text-white"
                            style={{ background: BARWA.zielenSrednia }}
                          >
                            bez studiów
                          </span>
                        ) : null}
                      </div>

                      {z.trafienia.length > 0 ? (
                        <p className="mt-2 text-male text-atrament-sciszony">
                          Wchodzi tu, bo sam zaznaczyłeś:{" "}
                          <strong className="text-atrament">{z.trafienia.join(", ")}</strong>.
                        </p>
                      ) : null}

                      {z.finanse.zarobki ? (
                        <p className="mt-2 text-male text-atrament-sciszony">
                          Widełki: od {zl(z.finanse.zarobki.start)} na start, typowo około{" "}
                          {zl(z.finanse.zarobki.typowy)}, do {zl(z.finanse.zarobki.szczyt)} na
                          szczycie. Na rękę, miesięcznie.
                        </p>
                      ) : null}

                      {poziom ? (
                        <p className="mt-2 text-male font-medium text-atrament">
                          {OPISY_PASM[z.finanse.pasmo]}
                        </p>
                      ) : null}

                      <Link
                        href={`/u/${kodUczestnika}/zawod/${z.kod}`}
                        className="przejscie mt-3 inline-flex min-h-11 items-center text-male font-semibold text-akcent-jasny hover:text-akcent-ciemny"
                      >
                        Zobacz kartę zawodu <span aria-hidden className="ml-1">→</span>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <p className="proza mt-6 max-w-czytelna text-atrament-sciszony">
              Ta lista ma być punktem wyjścia do rozmowy, a nie jej końcem. Na spotkaniu
              indywidualnym przejdziemy przez nią razem i zobaczymy, co z niej naprawdę do Ciebie
              pasuje.
            </p>
          </>
        )}
      </Sekcja>
    </article>
  );
}
