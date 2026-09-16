import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly } from "@/lib/moduly/otwarcie";
import { planszaWynikow } from "@/lib/moduly/wyniki";
import { NAZWY_MODULOW, WSZYSTKIE_MODULY } from "@/lib/moduly/ekrany";
import { Ikona } from "@/components/Ikona";
import { kolorKategorii } from "@/lib/ui/kolory";
import { Bramy } from "@/components/pulpit/Bramy";
import type { KodModulu } from "@/lib/moduly/typy";

export const dynamic = "force-dynamic";

/** Ta sama zasada co na stronie modulu: jedna lista, nie kopia. */
const MODULY = WSZYSTKIE_MODULY;

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
          {nazwa}
        </h1>
        <p className="proza mt-3 max-w-czytelna">
          {plansza.gotowy
            ? "Wszystko, co wybrałeś w tej części, na jednym ekranie. Nic nie jest zamknięte na klucz: tę część można wypełnić jeszcze raz."
            : "Ta część nie jest jeszcze wypełniona. Wyniki pojawią się tu od razu po jej ukończeniu."}
        </p>
        <Link
          href={plansza.gotowy ? `/u/${kod}/modul/${modul}/od-nowa` : `/u/${kod}/modul/${modul}`}
          className="przejscie przycisk-pigulka mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl px-7 text-male font-semibold"
        >
          {plansza.gotowy ? "Wypełnij tę część od nowa" : "Wypełnij tę część"}
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
                {sekcja.kafle.map((k) => {
                  // Blok odpowiedzi w kolorze kategorii. Kolor nigdy nie jest
                  // jedynym nośnikiem: obok stoi znak i pełny tekst.
                  const kolor = k.ikona ? kolorKategorii(k.ikona) : null;
                  return (
                    <li
                      key={k.klucz}
                      className="flex items-start gap-3 rounded-xl border p-3.5"
                      style={
                        kolor
                          ? {
                              borderColor: k.mocne ? kolor.neon : kolor.obwod,
                              background: kolor.tlo,
                              boxShadow: k.mocne ? `0 10px 26px -16px ${kolor.neon}` : undefined,
                            }
                          : undefined
                      }
                    >
                      {k.ikona ? <Ikona klucz={k.ikona} rozmiar={56} aktywna={k.mocne} /> : null}
                      <span className="min-w-0 flex-1">
                        <span
                          className="block text-tresc font-bold leading-snug"
                          style={kolor ? { color: kolor.atrament } : undefined}
                        >
                          {k.tytul}
                        </span>
                        <span className="mt-0.5 block text-male font-semibold leading-snug text-atrament">
                          {k.odpowiedz}
                        </span>
                        {k.podpis ? (
                          <span className="mt-0.5 block text-drobne text-atrament-sciszony">
                            {k.podpis}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        : null}
    </div>
  );
}
