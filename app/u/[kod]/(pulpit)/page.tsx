import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzPostepModulow, pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly, SPOTKANIE_MODULU } from "@/lib/moduly/otwarcie";
import { stanDostepu } from "@/lib/raport/dostep";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import { DZIS_ODKRYWASZ, KROTKO } from "@/lib/moduly/opisy";
import { WARSTWY } from "@/lib/raport/sekcje";
import { Bramy } from "@/components/pulpit/Bramy";
import { ZnakModulu, Szczyt } from "@/components/pulpit/ZnakModulu";

export const dynamic = "force-dynamic";

type Stan = "zamkniety" | "przed" | "wtrakcie" | "gotowy";

/**
 * Strona główna uczestnika: gdzie jestem i co jest dalej.
 *
 * Trzy rzeczy naraz, bo o trzy uczestnik pyta po wejściu: ile już za mną,
 * co robię teraz i czego jeszcze nie widzę. Ostatnia jest najważniejsza:
 * raport otwiera się warstwami i uczestnik ma **wiedzieć, że coś jest
 * zamknięte**, zamiast szukać tego po zakładkach.
 *
 * Czego tu nie ma i być nie może: wyniku przed spotkaniem. Kafelek „co już
 * wiemy" pokazuje wyłącznie warstwy, które prowadzący odsłonił.
 */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const [{ zakonczone }, otwarte, dostep] = await Promise.all([
    pobierzPostepModulow(uczestnik.id),
    otwarteModuly(uczestnik.grupaId),
    stanDostepu(uczestnik.id, uczestnik.grupaId),
  ]);

  const stan = (m: (typeof KOLEJNOSC_MODULOW)[number]): Stan => {
    const gotowe = zakonczone.get(m)?.size ?? 0;
    if (!otwarte.has(m)) return "zamkniety";
    if (gotowe >= CZESCI_MODULOW[m].length) return "gotowy";
    return gotowe > 0 ? "wtrakcie" : "przed";
  };

  const dalej =
    KOLEJNOSC_MODULOW.find((m) => stan(m) === "wtrakcie") ??
    KOLEJNOSC_MODULOW.find((m) => stan(m) === "przed");
  const nastepnyZamkniety = KOLEJNOSC_MODULOW.find((m) => stan(m) === "zamkniety");

  const ukonczone = KOLEJNOSC_MODULOW.filter((m) => stan(m) === "gotowy").length;
  const procent = Math.round((ukonczone / KOLEJNOSC_MODULOW.length) * 100);

  const otwarteWarstwy = WARSTWY.filter(
    (w) => w.kod !== "ZAWSZE" && dostep.warstwy.get(w.kod) !== null,
  );
  const zamknieteWarstwy = WARSTWY.filter(
    (w) => w.kod !== "ZAWSZE" && dostep.warstwy.get(w.kod) === null,
  );

  return (
    <div className="flex flex-col gap-3">
      {/* NAGŁÓWEK: powitanie z lewej, postęp i zdanie na dziś z prawej.
          Jeden rząd zamiast dwóch, żeby całość mieściła się na ekranie
          komputera bez przewijania. */}
      <header className="szklo relative overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-akcent/20 blur-3xl"
        />
        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">Twój program</p>
            <h1 className="mt-2 text-naglowek font-extrabold leading-[1.1] tracking-tight sm:text-naglowek-duzy">
              Cześć, {uczestnik.imie}.
              <br />
              <span className="gradient-tytul">
                {dalej ? `Dziś odkrywasz, ${DZIS_ODKRYWASZ[dalej] ?? "co Cię ciągnie."}` : "Masz to za sobą."}
              </span>
            </h1>
            <p className="mt-3 max-w-czytelna text-tresc leading-relaxed text-atrament-sciszony">
              Krok po kroku poznajesz siebie, swoje mocne strony i realne możliwości.
            </p>
            {dalej ? (
              <Link
                href={`/u/${kod}/modul/${dalej}`}
                className="przejscie przycisk-gradient mt-5 inline-flex min-h-12 items-center gap-3 rounded-xl px-6 text-tresc font-bold"
              >
                {stan(dalej) === "wtrakcie" ? "Dokończ" : "Zacznij"}: {NAZWY_MODULOW[dalej]}
                <span aria-hidden>→</span>
              </Link>
            ) : (
              <p className="mt-5 inline-flex rounded-xl border border-linia bg-szklo px-5 py-3 text-male text-atrament-sciszony">
                Masz wypełnione wszystko, co jest teraz otwarte.
              </p>
            )}
          </div>

          <div className="relative flex flex-col gap-3">
            <div className="rounded-2xl border border-linia bg-panel/80 p-4">
              <p className="text-drobne uppercase tracking-[0.16em] text-atrament-slaby">Twój postęp</p>
              <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="text-naglowek-duzy font-extrabold leading-none tabular-nums">
                  {ukonczone}
                  <span className="text-naglowek-maly text-atrament-slaby"> z {KOLEJNOSC_MODULOW.length}</span>
                </p>
                <p className="text-male text-atrament-sciszony">
                  części ukończonych
                  <span className="ml-2 text-drobne text-atrament-slaby">{procent}% programu</span>
                </p>
              </div>
              {/* Siedem przystanków zamiast paska: widać, ile zostało, a nie ułamek. */}
              <ol className="mt-3 flex items-center gap-1.5">
                {KOLEJNOSC_MODULOW.map((m) => {
                  const s = stan(m);
                  return (
                    <li key={m} className="flex-1">
                      <span className="sr-only">
                        {NAZWY_MODULOW[m]}: {OPIS_STANU[s]}
                      </span>
                      <span
                        aria-hidden
                        className={`block h-2 rounded-full ${
                          s === "gotowy"
                            ? "bg-gradient-to-r from-akcent-ciemny to-akcent"
                            : s === "wtrakcie"
                              ? "bg-akcent/45"
                              : "bg-linia"
                        }`}
                      />
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-akcent/20 bg-akcent-tlo/60 px-4 py-3">
              <span aria-hidden className="text-naglowek font-extrabold leading-none text-akcent/40">„</span>
              <p className="text-tresc font-semibold leading-snug text-atrament">
                Nie musisz znać całej drogi. Wystarczy, że zrobisz kolejny krok.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* SIEDEM CZĘŚCI */}
      <section>
        <div className="mb-2 flex items-end justify-between gap-4 px-1">
          <h2 className="text-drobne uppercase tracking-[0.16em] text-atrament-slaby">
            Siedem części Twojej podróży
          </h2>
          <Link
            href={`/u/${kod}/moduly`}
            className="przejscie shrink-0 text-male font-semibold text-akcent-jasny hover:underline"
          >
            Zobacz szczegóły <span aria-hidden>→</span>
          </Link>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
          {KOLEJNOSC_MODULOW.map((m, i) => (
            <li key={m}>
              <KafelekModulu
                kod={kod}
                modul={m}
                numer={i + 1}
                stan={stan(m)}
                spotkanie={SPOTKANIE_MODULU[m]}
              />
            </li>
          ))}
        </ol>
      </section>

      {/* CO JUŻ WIDAĆ, CO JESZCZE NIE */}
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.8fr]">
        <section className="szklo p-5">
          <h2 className="text-naglowek-maly font-bold">Co już o sobie wiesz</h2>
          {otwarteWarstwy.length > 0 ? (
            <>
              <ul className="mt-3 flex flex-col gap-1.5">
                {otwarteWarstwy.slice(0, 4).map((w) => (
                  <li key={w.kod} className="flex items-start gap-3">
                    <Ptaszek />
                    <span className="text-male leading-relaxed text-atrament-sciszony">{w.nazwa}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/u/${kod}/raport`}
                className="przejscie przycisk-pigulka mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-male font-semibold"
              >
                {otwarteWarstwy.length > 4 ? `Otwórz raport, ${otwarteWarstwy.length} części` : "Otwórz raport"}{" "}
                <span aria-hidden>→</span>
              </Link>
            </>
          ) : (
            <p className="proza mt-4">
              Na razie nic nie jest odsłonięte. Pierwsze wnioski zobaczysz po spotkaniu, razem
              z prowadzącym. To nie jest opóźnienie, tylko kolejność: wynik czyta się inaczej, kiedy
              jest komu zadać pytanie.
            </p>
          )}
        </section>

        <section className="szklo p-5">
          <h2 className="flex items-center gap-2.5 text-naglowek-maly font-bold">
            <Klodka />
            Co jeszcze odkryjesz
          </h2>
          {zamknieteWarstwy.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {zamknieteWarstwy.slice(0, 4).map((w) => (
                <li key={w.kod} className="flex items-start gap-3 opacity-70">
                  <span aria-hidden className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border border-linia-mocna" />
                  <span className="min-w-0">
                    <span className="block text-male leading-snug text-atrament-sciszony">{w.nazwa}</span>
                    <span className="block text-drobne text-atrament-slaby">{w.kiedy}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="proza mt-4">Cały raport jest już otwarty.</p>
          )}
        </section>

        <section className="szklo relative overflow-hidden p-5">
          <Szczyt klasa="pointer-events-none absolute -bottom-2 -right-4 h-32 w-52 opacity-90" />
          <h2 className="text-naglowek-maly font-bold leading-tight">
            Ta podróż
            <br />
            ma sens.
          </h2>
          <p className="mt-3 max-w-[14rem] text-male leading-relaxed text-atrament-sciszony">
            {nastepnyZamkniety
              ? `Kolejna część otworzy się na ${SPOTKANIE_MODULU[nastepnyZamkniety]}. spotkaniu. Termin ustala prowadzący.`
              : "Wszystkie części są już otwarte. Reszta zależy od Ciebie."}
          </p>
        </section>
      </div>
    </div>
  );
}

const OPIS_STANU: Record<Stan, string> = {
  gotowy: "wypełnione",
  wtrakcie: "zaczęte",
  przed: "do zrobienia",
  zamkniety: "jeszcze zamknięte",
};

/**
 * Kafelek jednej części. Zamknięta jest widoczna i podpisana, ale nieklikalna:
 * uczestnik ma wiedzieć, co go czeka, a nie patrzeć na pustą listę.
 */
function KafelekModulu({
  kod,
  modul,
  numer,
  stan,
  spotkanie,
}: {
  kod: string;
  modul: string;
  numer: number;
  stan: Stan;
  spotkanie: number;
}) {
  const tresc = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-male font-bold tabular-nums text-atrament-slaby">{numer}</span>
        <Odznaka stan={stan} spotkanie={spotkanie} />
      </div>
      <span
        className={`mt-3 block ${stan === "zamkniety" ? "text-atrament-slaby" : "text-akcent-jasny"}`}
      >
        <ZnakModulu modul={modul} rozmiar={26} />
      </span>
      <span className="mt-2 block text-male font-bold leading-snug text-atrament">
        {NAZWY_MODULOW[modul as keyof typeof NAZWY_MODULOW]}
      </span>
      <span className="mt-1 block text-drobne leading-relaxed text-atrament-slaby">
        {KROTKO[modul]}
      </span>
    </>
  );

  if (stan === "zamkniety") {
    return <div className="szklo h-full p-3.5 opacity-60">{tresc}</div>;
  }

  return (
    <Link
      href={`/u/${kod}/modul/${modul}`}
      className={`przejscie block h-full rounded-karta border-2 bg-szklo p-3.5 ${
        stan === "wtrakcie"
          ? "border-akcent poswiata"
          : "border-linia hover:border-akcent/45"
      }`}
    >
      {tresc}
    </Link>
  );
}

function Odznaka({ stan, spotkanie }: { stan: Stan; spotkanie: number }) {
  const styl: Record<Stan, string> = {
    gotowy: "border-akcent/40 bg-akcent-tlo text-akcent-jasny",
    wtrakcie: "border-uwaga/40 bg-uwaga-tlo text-uwaga",
    przed: "border-linia-mocna text-atrament-sciszony",
    zamkniety: "border-linia text-atrament-slaby",
  };
  const tekst: Record<Stan, string> = {
    gotowy: "ukończony",
    wtrakcie: "w trakcie",
    przed: "do zrobienia",
    zamkniety: `spotkanie ${spotkanie}`,
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold ${styl[stan]}`}
    >
      {tekst[stan]}
    </span>
  );
}

function Ptaszek() {
  return (
    <span
      aria-hidden
      className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-akcent text-na-akcencie"
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M2 6.3 4.6 9 10 3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Klodka() {
  return (
    <span aria-hidden className="text-atrament-slaby">
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      </svg>
    </span>
  );
}
