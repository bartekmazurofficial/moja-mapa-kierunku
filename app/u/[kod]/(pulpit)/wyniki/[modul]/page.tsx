import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly } from "@/lib/moduly/otwarcie";
import { planszaWynikow } from "@/lib/moduly/wyniki";
import { NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import { Ikona } from "@/components/Ikona";
import { Bramy } from "@/components/pulpit/Bramy";
import type { KodModulu } from "@/lib/moduly/typy";

export const dynamic = "force-dynamic";

const MODULY: KodModulu[] = ["A0", "A1", "A2", "A3", "A4", "A5", "M1"];

/**
 * Wyniki jednego modułu na jednej planszy: wszystkie kategorie naraz,
 * po kilka w rzędzie. To nie jest raport — raport mówi, co z tego wynika
 * dla zawodów, i otwiera się warstwami. Tu uczestnik widzi własne odpowiedzi.
 */
export default async function Strona({
  params,
}: {
  params: Promise<{ kod: string; modul: string }>;
}) {
  const { kod, modul } = await params;
  if (!MODULY.includes(modul as KodModulu) || modul === "A0") notFound();

  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const otwarte = await otwarteModuly(uczestnik.grupaId);
  if (!otwarte.has(modul as KodModulu)) notFound();

  const plansza = await planszaWynikow(uczestnik.id, modul as KodModulu);
  const nazwa = NAZWY_MODULOW[modul as KodModulu];

  return (
    <div className="flex flex-col gap-6">
      <header className="szklo relative overflow-hidden p-7 sm:p-9 lg:pr-[22rem]">
        <Bramy klasa="pointer-events-none absolute -right-10 bottom-0 hidden h-[13rem] w-[20rem] opacity-60 lg:block" />
        <Link
          href={`/u/${kod}/moduly`}
          className="przejscie inline-flex items-center gap-2 text-male text-atrament-slaby hover:text-atrament"
        >
          <span aria-hidden>←</span> Wszystkie części
        </Link>
        <p className="mt-5 text-drobne uppercase tracking-[0.18em] text-atrament-slaby">
          Twoje odpowiedzi
        </p>
        <h1 className="mt-2 text-naglowek-duzy font-extrabold leading-tight tracking-tight">
          <span className="gradient-tytul">{nazwa}</span>
        </h1>
        <p className="proza mt-3 max-w-czytelna">
          {plansza.gotowy
            ? "Wszystko, co wybrałeś w tej części, na jednym ekranie. Możesz wrócić i zmienić, co chcesz — nic nie jest zamknięte na klucz."
            : "Ta część nie jest jeszcze wypełniona. Wyniki pojawią się tu od razu po jej ukończeniu."}
        </p>
        <Link
          href={`/u/${kod}/modul/${modul}`}
          className="przejscie mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl border border-linia-mocna bg-szklo px-6 text-male font-semibold hover:border-akcent/50 hover:text-akcent-jasny"
        >
          {plansza.gotowy ? "Wróć do części i popraw" : "Wypełnij tę część"}
          <span aria-hidden>→</span>
        </Link>
      </header>

      {plansza.gotowy
        ? plansza.sekcje.map((sekcja) => (
            <section key={sekcja.tytul} className="szklo p-6 sm:p-7">
              <h2 className="text-naglowek-maly font-bold">{sekcja.tytul}</h2>
              {sekcja.wstep ? (
                <p className="proza mt-2 max-w-artykul">{sekcja.wstep}</p>
              ) : null}

              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {sekcja.kafle.map((k) => (
                  <li
                    key={k.klucz}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 ${
                      k.mocne
                        ? "border-akcent/40 bg-akcent-tlo/50"
                        : "border-linia bg-tlo/40"
                    }`}
                  >
                    {k.ikona ? <Ikona klucz={k.ikona} rozmiar={40} aktywna={k.mocne} /> : null}
                    <span className="min-w-0 flex-1">
                      <span className="block text-male font-semibold leading-snug">{k.tytul}</span>
                      <span
                        className={`block text-male leading-snug ${
                          k.mocne ? "text-akcent-jasny" : "text-atrament-sciszony"
                        }`}
                      >
                        {k.odpowiedz}
                      </span>
                      {k.podpis ? (
                        <span className="block text-drobne text-atrament-slaby">{k.podpis}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))
        : null}
    </div>
  );
}
