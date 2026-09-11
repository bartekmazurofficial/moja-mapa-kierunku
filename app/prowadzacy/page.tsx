import Link from "next/link";
import { zalogowany } from "@/lib/prowadzacy/sesja";
import { listaGrup } from "@/lib/prowadzacy/dane";
import { wyloguj } from "@/lib/prowadzacy/akcje";
import { Logowanie } from "@/components/prowadzacy/Logowanie";
import { Znak } from "@/components/pulpit/Znak";
import { Bramy } from "@/components/pulpit/Bramy";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panel prowadzącego" };

export default async function Strona() {
  if (!(await zalogowany())) return <Logowanie />;

  const grupy = await listaGrup();

  return (
    <main className="mx-auto flex max-w-[72rem] flex-col gap-6 px-5 py-8 sm:px-8">
      <header className="szklo relative overflow-hidden p-7 sm:p-9 lg:pr-[24rem]">
        <Bramy klasa="pointer-events-none absolute -right-8 bottom-0 hidden h-[14rem] w-[22rem] opacity-70 lg:block" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Znak rozmiar={40} />
            <span>
              <span className="block text-tresc-duza font-extrabold tracking-tight">Kierunek</span>
              <span className="block text-drobne uppercase tracking-[0.14em] text-atrament-slaby">
                panel prowadzącego
              </span>
            </span>
          </div>
          <form action={wyloguj}>
            <button
              type="submit"
              className="przejscie min-h-10 rounded-xl border border-linia px-4 text-male text-atrament-sciszony hover:border-linia-mocna hover:text-atrament"
            >
              Wyloguj
            </button>
          </form>
        </div>

        <h1 className="mt-7 text-naglowek-duzy font-extrabold leading-tight tracking-tight">
          Twoje <span className="gradient-tytul">grupy.</span>
        </h1>
        <p className="proza mt-3 max-w-czytelna">
          Stąd otwierasz moduły i warstwy raportu, i stąd wchodzisz w kartę uczestnika przed
          rozmową indywidualną.
        </p>
      </header>

      {grupy.length === 0 ? (
        <p className="szklo p-7 text-tresc text-atrament-sciszony">
          Nie ma jeszcze żadnej grupy. Zakłada się ją skryptem{" "}
          <code className="rounded bg-tlo/60 px-1.5 py-0.5 text-male">scripts/seed-grupa.ts</code>.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {grupy.map((g) => (
            <li key={g.kod}>
              <Link
                href={`/prowadzacy/grupa/${g.kod}`}
                className="przejscie szklo group flex h-full flex-col p-6 hover:border-akcent/45"
              >
                <h2 className="text-naglowek-maly font-bold leading-snug">{g.nazwa}</h2>
                <p className="mt-1.5 text-male text-atrament-slaby">
                  {g.uczestnikow} {g.uczestnikow === 1 ? "osoba" : "osób"}
                </p>
                <p className="przejscie mt-5 text-male font-semibold text-akcent-jasny group-hover:translate-x-0.5">
                  Otwórz grupę <span aria-hidden>→</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
