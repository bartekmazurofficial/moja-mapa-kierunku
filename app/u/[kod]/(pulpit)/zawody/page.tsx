import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzRaport } from "@/lib/raport/serwer";
import { Pasmo } from "@/components/raport/Sekcje";
import { Bramy } from "@/components/pulpit/Bramy";

export const dynamic = "force-dynamic";

/**
 * Lista kart zawodów. Otwiera się razem z sekcją zawodów w raporcie — nigdy
 * wcześniej, bo zawody nie mogą pojawić się przed obszarami.
 */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const widok = await pobierzRaport(kod);
  if (!widok) notFound();

  const sekcja = widok.raport.zawody;

  if (!sekcja) {
    return (
      <div className="szklo p-8">
        <h1 className="text-naglowek font-extrabold tracking-tight">Karty zawodów</h1>
        <p className="proza mt-4 max-w-czytelna">
          Ta część otworzy się na czwartym spotkaniu, po obszarach. Kolejność ma znaczenie:
          konkretny zawód czyta się inaczej, kiedy wiadomo już, z jakiej dziedziny wyszedł.
        </p>
      </div>
    );
  }

  const wszystkie = sekcja.pozycje.flatMap((p) =>
    p.zawody.map((z) => ({ ...z, klaster: p.typ === "klaster" ? p.nazwa : null })),
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="szklo relative overflow-hidden p-7 sm:p-9 lg:pr-[26rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-akcent/20 blur-3xl"
        />
        <Bramy klasa="pointer-events-none absolute -right-6 bottom-0 hidden h-[15rem] w-[24rem] opacity-80 lg:block" />
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">
          {wszystkie.length} kart do przeczytania
        </p>
        <h1 className="mt-3 text-naglowek-duzy font-extrabold tracking-tight">
          Jak wygląda życie
          <br />
          <span className="gradient-tytul">człowieka, który to robi.</span>
        </h1>
        <p className="proza mt-4 max-w-czytelna">
          Nie obowiązki, tylko życie. O której wstaje, ile go boli, kiedy ma wolne, co go wykańcza.
          To jest różnica między katalogiem zawodów a materiałem do decyzji.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {wszystkie.map((z) => (
          <li key={z.kod}>
            <Link
              href={`/u/${kod}/zawod/${z.kod}`}
              className="przejscie szklo group flex h-full flex-col p-5 hover:border-akcent/45"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-tresc-duza font-bold leading-snug">{z.nazwa}</h2>
                {z.maPelnaKarte ? null : (
                  <span className="mt-0.5 shrink-0 rounded-full border border-linia-mocna px-2 py-0.5 text-drobne text-atrament-slaby">
                    skrót
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-drobne text-atrament-slaby">{z.obszar}</p>
              <div className="mt-3">
                <Pasmo opis={z.pasmoOpis} />
              </div>
              {z.klaster ? (
                <p className="mt-3 text-drobne text-atrament-slaby">
                  Razem z innym zawodem w grupie „{z.klaster}"
                </p>
              ) : null}
              <p className="przejscie mt-auto pt-4 text-male font-semibold text-akcent-jasny group-hover:translate-x-0.5">
                Przeczytaj kartę <span aria-hidden>→</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
