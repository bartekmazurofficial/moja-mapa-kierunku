import Link from "next/link";
import { zalogowany } from "@/lib/prowadzacy/sesja";
import { listaGrup } from "@/lib/prowadzacy/dane";
import { wyloguj } from "@/lib/prowadzacy/akcje";
import { Logowanie } from "@/components/prowadzacy/Logowanie";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panel prowadzącego" };

export default async function Strona() {
  if (!(await zalogowany())) return <Logowanie />;

  const grupy = await listaGrup();

  return (
    <main className="mx-auto max-w-artykul px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-naglowek-duzy leading-tight">Grupy</h1>
        <form action={wyloguj}>
          <button type="submit" className="przejscie text-male text-atrament-slaby underline underline-offset-4 hover:text-atrament">
            Wyloguj
          </button>
        </form>
      </div>

      {grupy.length === 0 ? (
        <p className="proza mt-6 text-atrament-sciszony">
          Nie ma jeszcze żadnej grupy. Zakłada się ją skryptem <code>scripts/seed-grupa.ts</code>.
        </p>
      ) : (
        <ul className="mt-8 border-t border-linia">
          {grupy.map((g) => (
            <li key={g.kod}>
              <Link
                href={`/prowadzacy/grupa/${g.kod}`}
                className="przejscie group flex items-baseline gap-4 border-b border-linia py-4 hover:bg-podklad/60"
              >
                <span className="flex-1 text-tresc-duza">{g.nazwa}</span>
                <span className="text-male tabular-nums text-atrament-slaby">
                  {g.uczestnikow} {g.uczestnikow === 1 ? "osoba" : "osób"}
                </span>
                <span aria-hidden className="przejscie text-atrament-slaby group-hover:translate-x-0.5 group-hover:text-atrament">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
