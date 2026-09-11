import Link from "next/link";
import { notFound } from "next/navigation";
import { zalogowany } from "@/lib/prowadzacy/sesja";
import { pobierzGrupe, NAZWY_MODULOW } from "@/lib/prowadzacy/dane";
import { otworzModulAkcja, odslonWarstweAkcja } from "@/lib/prowadzacy/akcje";
import { Logowanie } from "@/components/prowadzacy/Logowanie";
import { MODULY_SPOTKANIA } from "@/lib/moduly/otwarcie";
import { WARSTWY } from "@/lib/raport/sekcje";

export const dynamic = "force-dynamic";

export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  if (!(await zalogowany())) return <Logowanie />;
  const { kod } = await params;
  const grupa = await pobierzGrupe(kod);
  if (!grupa) notFound();

  const otwarte = new Set(grupa.otwarteModuly);
  const odsloniete = new Set(grupa.otwarteWarstwy);

  return (
    <main className="mx-auto max-w-[72rem] px-5 py-10 sm:px-8">
      <Link href="/prowadzacy" className="przejscie text-male text-atrament-slaby hover:text-atrament">
        ← Grupy
      </Link>
      <h1 className="mt-3 font-serif text-naglowek-duzy leading-tight">{grupa.nazwa}</h1>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-linia bg-papier p-5">
          <h2 className="text-drobne uppercase tracking-[0.08em] text-atrament-slaby">
            Moduły otwarte dla grupy
          </h2>
          <p className="mt-2 text-male text-atrament-sciszony">
            Otwarte zostaje otwarte. Moduł nieotwarty jest niedostępny także pod bezpośrednim
            adresem.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(MODULY_SPOTKANIA).map(([nr, moduly]) => {
              const wszystkieOtwarte = moduly.every((m) => otwarte.has(m));
              return (
                <form key={nr} action={otworzModulAkcja}>
                  <input type="hidden" name="grupaId" value={grupa.id} />
                  <input type="hidden" name="modul" value={nr} />
                  <button
                    type="submit"
                    disabled={wszystkieOtwarte}
                    className="przejscie min-h-10 rounded-lg border border-linia-mocna px-4 text-male hover:border-akcent hover:text-akcent disabled:border-linia disabled:text-atrament-slaby"
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

        <div className="rounded-xl border border-linia bg-papier p-5">
          <h2 className="text-drobne uppercase tracking-[0.08em] text-atrament-slaby">
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
                  className="przejscie min-h-10 rounded-lg border border-linia-mocna px-4 text-male hover:border-akcent hover:text-akcent disabled:border-linia disabled:text-atrament-slaby"
                >
                  {odsloniete.has(w.kod) ? `${w.kod} odsłonięta` : `Odsłoń ${w.kod}`}
                  <span className="block text-drobne text-atrament-slaby">{w.nazwa}</span>
                </button>
              </form>
            ))}
          </div>
        </div>
      </section>

      <h2 className="mt-12 font-serif text-naglowek">Uczestnicy</h2>
      <p className="mt-1 text-male text-atrament-slaby">
        Kropki to moduły w kolejności {grupa.uczestnicy[0]?.moduly.map((m) => m.kod).join(" ")}.
        Obwódka oznacza wypełnienie poniżej połowy przewidzianego czasu.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-linia-mocna text-drobne uppercase tracking-[0.08em] text-atrament-slaby">
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
              <tr key={u.kodDostepu} className="border-b border-linia align-top">
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
                  {u.brakiDanych.length > 0 ? u.brakiDanych.join(", ") : "—"}
                </td>
                <td className="py-3 pr-4 text-male tabular-nums">{u.liczbaWet}</td>
                <td className="py-3 pr-4 text-male">
                  {u.sesja === "po" ? "odbyta" : "przed"}
                </td>
                <td className="py-3 text-male">
                  <Link
                    href={`/prowadzacy/uczestnik/${u.kodDostepu}`}
                    className="przejscie underline underline-offset-4 hover:text-akcent"
                  >
                    Karta
                  </Link>
                  <span aria-hidden className="px-2 text-linia-mocna">
                    |
                  </span>
                  <Link
                    href={`/prowadzacy/sesja/${u.kodDostepu}`}
                    className="przejscie underline underline-offset-4 hover:text-akcent"
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
        ? "wypełniony bardzo szybko"
        : "wypełniony"
      : stan === "wtrakcie"
        ? "zaczęty"
        : stan === "pusty"
          ? "otwarty, nietknięty"
          : "jeszcze zamknięty";
  const tlo =
    stan === "gotowy"
      ? "bg-akcent"
      : stan === "wtrakcie"
        ? "bg-akcent/35"
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
