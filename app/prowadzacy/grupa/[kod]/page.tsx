import Link from "next/link";
import { notFound } from "next/navigation";
import { zalogowany } from "@/lib/prowadzacy/sesja";
import { pobierzGrupe, NAZWY_MODULOW } from "@/lib/prowadzacy/dane";
import { otworzModulAkcja, odslonWarstweAkcja } from "@/lib/prowadzacy/akcje";
import { Logowanie } from "@/components/prowadzacy/Logowanie";
import { MODULY_SPOTKANIA, MODULY_SPOTKANIA_NOWE } from "@/lib/moduly/otwarcie";
import { WARSTWY } from "@/lib/raport/sekcje";
import { TEMPO } from "@/lib/engine/config";
import { Bramy } from "@/components/pulpit/Bramy";

export const dynamic = "force-dynamic";

export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  if (!(await zalogowany())) return <Logowanie />;
  const { kod } = await params;
  const grupa = await pobierzGrupe(kod);
  if (!grupa) notFound();

  const otwarte = new Set(grupa.otwarteModuly);
  const odsloniete = new Set(grupa.otwarteWarstwy);

  return (
    <main className="mx-auto flex max-w-[80rem] flex-col gap-6 px-5 py-8 sm:px-8">
      <header className="szklo relative overflow-hidden p-7 sm:p-9 lg:pr-[22rem]">
        <Bramy klasa="pointer-events-none absolute -right-10 bottom-0 hidden h-[13rem] w-[20rem] opacity-60 lg:block" />
        <Link
          href="/prowadzacy"
          className="przejscie inline-flex items-center gap-2 text-male text-atrament-slaby hover:text-atrament"
        >
          <span aria-hidden>←</span> Grupy
        </Link>
        <h1 className="mt-4 text-naglowek-duzy font-extrabold leading-tight tracking-tight">
          <span className="gradient-tytul">{grupa.nazwa}</span>
        </h1>
        <p className="proza mt-3 max-w-czytelna">
          {grupa.uczestnicy.length} {grupa.uczestnicy.length === 1 ? "uczestnik" : "uczestników"}.
          Jedno kliknięcie otwiera moduł albo warstwę raportu całej grupie.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="szklo p-6">
          <h2 className="text-drobne uppercase tracking-[0.14em] text-atrament-slaby">
            Moduły otwarte dla grupy
          </h2>
          <p className="mt-2 text-male text-atrament-sciszony">
            Otwarte zostaje otwarte. Moduł nieotwarty jest niedostępny także pod bezpośrednim
            adresem.
          </p>
          <p className="mt-2 text-drobne text-atrament-slaby">
            Grupa widzi tę wersję programu, której moduł otwarto jej jako pierwszy. Nie mieszaj
            obu wersji w jednej grupie.
          </p>

          <h3 className="mt-5 text-drobne font-semibold uppercase tracking-[0.14em] text-atrament-sciszony">
            Nowy program · cztery moduły
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(MODULY_SPOTKANIA_NOWE).map(([nr, moduly]) => {
              const wszystkieOtwarte = moduly.every((m) => otwarte.has(m));
              return (
                <form key={`N${nr}`} action={otworzModulAkcja}>
                  <input type="hidden" name="grupaId" value={grupa.id} />
                  <input type="hidden" name="modul" value={`N${nr}`} />
                  <button
                    type="submit"
                    disabled={wszystkieOtwarte}
                    className={`przejscie min-h-12 rounded-xl border px-4 py-2 text-left text-male ${
                      wszystkieOtwarte
                        ? "border-akcent/35 bg-akcent-tlo/60 text-atrament-sciszony"
                        : "border-linia-mocna bg-szklo font-semibold hover:border-akcent hover:text-akcent-jasny"
                    }`}
                  >
                    {wszystkieOtwarte ? `Spotkanie ${nr} otwarte` : `Otwórz spotkanie ${nr}`}
                    <span className="block text-drobne text-atrament-slaby">
                      {moduly.map((m) => NAZWY_MODULOW[m]).join(" · ")}
                    </span>
                  </button>
                </form>
              );
            })}
          </div>

          <h3 className="mt-6 text-drobne font-semibold uppercase tracking-[0.14em] text-atrament-sciszony">
            Poprzedni program · osiem modułów
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(MODULY_SPOTKANIA).map(([nr, moduly]) => {
              const wszystkieOtwarte = moduly.every((m) => otwarte.has(m));
              return (
                <form key={nr} action={otworzModulAkcja}>
                  <input type="hidden" name="grupaId" value={grupa.id} />
                  <input type="hidden" name="modul" value={nr} />
                  <button
                    type="submit"
                    disabled={wszystkieOtwarte}
                    className={`przejscie min-h-12 rounded-xl border px-4 py-2 text-left text-male ${
                      wszystkieOtwarte
                        ? "border-akcent/35 bg-akcent-tlo/60 text-atrament-sciszony"
                        : "border-linia-mocna bg-szklo font-semibold hover:border-akcent hover:text-akcent-jasny"
                    }`}
                  >
                    {wszystkieOtwarte ? `Spotkanie ${nr} otwarte` : `Otwórz spotkanie ${nr}`}
                    <span className="block text-drobne text-atrament-slaby">
                      {moduly.map((m) => m).join(" · ")}
                    </span>
                  </button>
                </form>
              );
            })}
          </div>
        </div>

        <div className="szklo p-6">
          <h2 className="text-drobne uppercase tracking-[0.14em] text-atrament-slaby">
            Warstwy raportu
          </h2>
          <p className="mt-2 text-male text-atrament-sciszony">
            Jedno kliknięcie odsłania warstwę całej grupie.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {WARSTWY.filter((w) => w.kod !== "ZAWSZE").map((w) => (
              <form key={w.kod} action={odslonWarstweAkcja}>
                <input type="hidden" name="grupaId" value={grupa.id} />
                <input type="hidden" name="warstwa" value={w.kod} />
                <button
                  type="submit"
                  disabled={odsloniete.has(w.kod)}
                  className={`przejscie min-h-12 rounded-xl border px-4 py-2 text-left text-male ${
                    odsloniete.has(w.kod)
                      ? "border-akcent/35 bg-akcent-tlo/60 text-atrament-sciszony"
                      : "border-linia-mocna bg-szklo font-semibold hover:border-akcent hover:text-akcent-jasny"
                  }`}
                >
                  {odsloniete.has(w.kod) ? `${w.kod} odsłonięta` : `Odsłoń ${w.kod}`}
                  <span className="block text-drobne text-atrament-slaby">{w.nazwa}</span>
                </button>
              </form>
            ))}
          </div>
        </div>
      </section>

      <h2 className="mt-4 text-naglowek font-extrabold tracking-tight">Uczestnicy</h2>
      <p className="mt-1 text-male text-atrament-slaby">
        Kropki to moduły w kolejności {grupa.uczestnicy[0]?.moduly.map((m) => m.kod).join(" ")}.
        Obwódka oznacza czas na blok poniżej {Math.round(TEMPO.UDZIAL_MEDIANY * 100)}% mediany tej
        grupy na tym module. Liczona dopiero od {TEMPO.MIN_UKONCZEN} ukończeń, najwyżej{" "}
        {TEMPO.MAKS_OFLAGOWANYCH} osoby na moduł.
      </p>

      <div className="szklo mt-1 overflow-x-auto p-2 sm:p-4">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-linia-mocna text-drobne uppercase tracking-[0.12em] text-atrament-slaby">
              <th scope="col" className="py-2 pr-4 font-normal">Imię</th>
              <th scope="col" className="py-2 pr-4 font-normal">Moduły</th>
              <th scope="col" className="py-2 pr-4 font-normal">Braki</th>
              <th scope="col" className="py-2 pr-4 font-normal">Weta</th>
              <th scope="col" className="py-2 pr-4 font-normal">Sesja</th>
              <th scope="col" className="py-2 font-normal">
                <span className="sr-only">Przejdź</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {grupa.uczestnicy.map((u) => (
              <tr key={u.kodDostepu} className="przejscie border-b border-linia align-top last:border-0 hover:bg-szklo/50">
                <th scope="row" className="py-3 pr-4 text-left font-normal text-tresc-duza">
                  {u.imie}
                </th>
                <td className="py-3 pr-4">
                  <span className="flex gap-1.5">
                    {u.moduly.map((m) => (
                      <Kropka key={m.kod} kod={m.kod} stan={m.stan} pobiezny={m.pobiezny} />
                    ))}
                  </span>
                </td>
                <td className="py-3 pr-4 text-male text-atrament-sciszony">
                  {u.brakiDanych.length > 0 ? u.brakiDanych.join(", ") : "komplet"}
                </td>
                <td className="py-3 pr-4 text-male tabular-nums">{u.liczbaWet}</td>
                <td className="py-3 pr-4 text-male">
                  {u.sesja === "po" ? "odbyta" : "przed"}
                </td>
                <td className="py-3 text-male">
                  <Link
                    href={`/prowadzacy/uczestnik/${u.kodDostepu}`}
                    className="przejscie underline underline-offset-4 hover:text-akcent-jasny"
                  >
                    Karta
                  </Link>
                  <span aria-hidden className="px-2 text-linia-mocna">
                    |
                  </span>
                  <Link
                    href={`/prowadzacy/sesja/${u.kodDostepu}`}
                    className="przejscie underline underline-offset-4 hover:text-akcent-jasny"
                  >
                    Sesja
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Kropka({
  kod,
  stan,
  pobiezny,
}: {
  kod: string;
  stan: "zamkniety" | "pusty" | "wtrakcie" | "gotowy";
  pobiezny: boolean;
}) {
  const opis =
    stan === "gotowy"
      ? pobiezny
        ? "wypełniony znacznie szybciej niż w grupie"
        : "wypełniony"
      : stan === "wtrakcie"
        ? "zaczęty"
        : stan === "pusty"
          ? "otwarty, nietknięty"
          : "jeszcze zamknięty";
  const tlo =
    stan === "gotowy"
      ? "bg-gradient-to-br from-akcent-jasny to-akcent-ciemny"
      : stan === "wtrakcie"
        ? "bg-akcent/45"
        : stan === "pusty"
          ? "bg-linia-mocna"
          : "bg-transparent";
  return (
    <span
      title={`${kod}: ${opis}`}
      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
        pobiezny ? "border-2 border-uwaga" : "border-linia"
      }`}
    >
      <span className={`h-3 w-3 rounded-full ${tlo}`} />
      <span className="sr-only">
        {kod}: {opis}
      </span>
    </span>
  );
}
