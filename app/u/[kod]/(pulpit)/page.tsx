import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzPostepModulow, pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly, SPOTKANIE_MODULU } from "@/lib/moduly/otwarcie";
import { stanDostepu } from "@/lib/raport/dostep";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import { WARSTWY } from "@/lib/raport/sekcje";
import { Bramy } from "@/components/pulpit/Bramy";

export const dynamic = "force-dynamic";

export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const [{ zakonczone }, otwarte, dostep] = await Promise.all([
    pobierzPostepModulow(uczestnik.id),
    otwarteModuly(uczestnik.grupaId),
    stanDostepu(uczestnik.id, uczestnik.grupaId),
  ]);

  const stan = (m: (typeof KOLEJNOSC_MODULOW)[number]) => {
    const gotowe = zakonczone.get(m)?.size ?? 0;
    if (!otwarte.has(m)) return "zamkniety" as const;
    if (gotowe >= CZESCI_MODULOW[m].length) return "gotowy" as const;
    return gotowe > 0 ? "wtrakcie" : "przed";
  };

  const dalej = KOLEJNOSC_MODULOW.find((m) => stan(m) === "wtrakcie") ?? KOLEJNOSC_MODULOW.find((m) => stan(m) === "przed");
  const otwarteWarstwy = WARSTWY.filter((w) => dostep.warstwy.get(w.kod) !== null);
  const zamknieteWarstwy = WARSTWY.filter((w) => w.kod !== "ZAWSZE" && dostep.warstwy.get(w.kod) === null);

  return (
    <div className="flex flex-col gap-6">
      <header className="szklo relative overflow-hidden p-7 sm:p-9 lg:pr-[26rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-akcent/25 blur-3xl"
        />
        <Bramy klasa="pointer-events-none absolute -right-6 bottom-0 hidden h-[15rem] w-[24rem] opacity-80 lg:block" />
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">
          Program rozwoju zawodowego
        </p>
        <h1 className="mt-3 text-naglowek-duzy font-extrabold tracking-tight">
          Cześć, {uczestnik.imie}.
          <br />
          <span className="gradient-tytul">Zobacz, gdzie jesteś.</span>
        </h1>
        <p className="proza mt-4 max-w-czytelna">
          Wypełniasz kolejne części na spotkaniach, a raport otwiera się stopniowo. Nic nie musisz
          robić jednym ciągiem, bo odpowiedzi zapisują się same.
        </p>

        {dalej ? (
          <Link
            href={`/u/${kod}/modul/${dalej}`}
            className="przejscie poswiata mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-gradient-to-r from-akcent-ciemny to-akcent px-6 text-tresc font-bold text-na-akcencie hover:brightness-110"
          >
            {stan(dalej) === "wtrakcie" ? "Dokończ" : "Zacznij"}: {NAZWY_MODULOW[dalej]}
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <p className="mt-7 inline-flex rounded-xl border border-linia bg-szklo px-5 py-3 text-male text-atrament-sciszony">
            Masz wypełnione wszystko, co jest teraz otwarte.
          </p>
        )}
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="szklo p-6">
          <h2 className="text-naglowek-maly font-bold">Twoje części</h2>
          <p className="mt-1 text-male text-atrament-slaby">
            Siedem części, otwieranych po kolei przez prowadzącego.
          </p>

          <ul className="mt-5 flex flex-col gap-2.5">
            {KOLEJNOSC_MODULOW.map((m) => {
              const s = stan(m);
              const wiersz = (
                <>
                  <Kropka stan={s} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-tresc font-semibold">{NAZWY_MODULOW[m]}</span>
                    <span className="block text-drobne text-atrament-slaby">
                      {s === "gotowy"
                        ? "wypełnione"
                        : s === "wtrakcie"
                          ? "zaczęte, można dokończyć"
                          : s === "przed"
                            ? "do zrobienia"
                            : `otworzy się na ${SPOTKANIE_MODULU[m]}. spotkaniu`}
                    </span>
                  </span>
                  {s !== "zamkniety" ? (
                    <span aria-hidden className="przejscie shrink-0 text-atrament-slaby group-hover:translate-x-0.5 group-hover:text-akcent-jasny">
                      →
                    </span>
                  ) : null}
                </>
              );

              return (
                <li key={m}>
                  {s === "zamkniety" ? (
                    <span className="flex items-center gap-3 rounded-xl border border-linia/70 px-4 py-3 opacity-60">
                      {wiersz}
                    </span>
                  ) : (
                    <Link
                      href={`/u/${kod}/modul/${m}`}
                      className="przejscie group flex items-center gap-3 rounded-xl border border-linia bg-tlo/40 px-4 py-3 hover:border-akcent/40 hover:bg-szklo"
                    >
                      {wiersz}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="szklo p-6">
          <h2 className="text-naglowek-maly font-bold">Twój raport</h2>
          <p className="mt-1 text-male text-atrament-slaby">
            Powstaje stopniowo, część po części.
          </p>

          <ul className="mt-5 flex flex-col gap-2">
            {otwarteWarstwy.map((w) => (
              <li key={w.kod} className="flex items-start gap-3 rounded-xl border border-akcent/25 bg-akcent-tlo/60 px-4 py-2.5">
                <Ptaszek />
                <span className="min-w-0">
                  <span className="block text-male font-semibold">{w.nazwa}</span>
                  <span className="block text-drobne text-atrament-slaby">otwarte</span>
                </span>
              </li>
            ))}
            {zamknieteWarstwy.map((w) => (
              <li key={w.kod} className="flex items-start gap-3 rounded-xl border border-linia/70 px-4 py-2.5 opacity-60">
                <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded-full border border-linia-mocna" />
                <span className="min-w-0">
                  <span className="block text-male font-medium text-atrament-sciszony">{w.nazwa}</span>
                  <span className="block text-drobne text-atrament-slaby">{w.kiedy}</span>
                </span>
              </li>
            ))}
          </ul>

          <Link
            href={`/u/${kod}/raport`}
            className="przejscie mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-linia-mocna bg-szklo px-5 text-male font-semibold hover:border-akcent/50 hover:text-akcent-jasny"
          >
            Otwórz raport <span aria-hidden>→</span>
          </Link>
        </section>
      </div>
    </div>
  );
}

function Kropka({ stan }: { stan: "zamkniety" | "przed" | "wtrakcie" | "gotowy" }) {
  if (stan === "gotowy") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-akcent-jasny to-akcent-ciemny text-na-akcencie">
        <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M2 6.3 4.6 9 10 3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">wypełnione</span>
      </span>
    );
  }
  if (stan === "wtrakcie") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-akcent">
        <span className="h-2.5 w-2.5 rounded-full bg-akcent" />
        <span className="sr-only">zaczęte</span>
      </span>
    );
  }
  if (stan === "przed") {
    return (
      <span className="h-7 w-7 shrink-0 rounded-full border border-linia-mocna">
        <span className="sr-only">jeszcze nie zaczęte</span>
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-linia text-atrament-slaby">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      </svg>
      <span className="sr-only">jeszcze zamknięte</span>
    </span>
  );
}

function Ptaszek() {
  return (
    <span aria-hidden className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-akcent text-na-akcencie">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M2 6.3 4.6 9 10 3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
