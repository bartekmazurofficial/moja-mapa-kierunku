import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzKarte } from "@/lib/raport/serwer";
import { ulozKarte } from "@/lib/karty/uklad";
import { BlokKarty } from "@/components/karta/Bloki";
import { POZIOM, STUDIA, ZAGROZENIE } from "@/lib/karty/etykiety";
import { towarzyszeZKlastra } from "@/lib/karty/klastry";

export const dynamic = "force-dynamic";

/** Karta zawodu: dlugi tekst do czytania. Uklad czytelniczy, jak artykul. */
export default async function Strona({
  params,
}: {
  params: Promise<{ kod: string; zawod: string }>;
}) {
  const { kod, zawod } = await params;
  const karta = await pobierzKarte(kod, zawod);
  if (!karta) notFound();

  const bloki = ulozKarte(karta.sekcje);
  // Zawody z jednego klastra rozstrzyga sie czytaniem obu kart obok siebie,
  // a nie na zmiane. Wejscie w porownanie stoi przy karcie, nie tylko w raporcie.
  const obok = await towarzyszeZKlastra(karta.kod, karta.klasterKod);

  return (
    <article className="flex flex-col gap-6">
      <nav>
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie inline-flex items-center gap-2 text-male text-atrament-slaby hover:text-atrament"
        >
          <span aria-hidden>←</span> Wszystkie karty
        </Link>
      </nav>

      <header className="szklo relative overflow-hidden p-7 sm:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-akcent/20 blur-3xl"
        />
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">
          {POZIOM[karta.poziom] ?? karta.poziom} · {STUDIA[karta.studia] ?? karta.studia}
        </p>
        <h1 className="mt-3 text-naglowek-duzy font-extrabold leading-tight tracking-tight">
          <span className="gradient-tytul">{karta.tytul}</span>
        </h1>
        {karta.zdanieKierunkowe ? (
          <p className="mt-5 border-l-2 border-akcent pl-4 text-tresc-duza font-semibold leading-relaxed">
            {karta.zdanieKierunkowe}
          </p>
        ) : null}
        {!karta.pelna ? (
          <p className="mt-5 rounded-xl border border-linia bg-tlo/50 px-4 py-3 text-male text-atrament-sciszony">
            Ta karta jest na razie w wersji skróconej. Pełny opis powstaje.
          </p>
        ) : null}
      </header>

      {obok.length > 0 ? (
        <aside className="szklo p-6">
          <p className="text-male text-atrament-sciszony">
            {obok.length === 1
              ? "Ten zawód trudno odróżnić od jednego innego na podstawie samych odpowiedzi."
              : "Ten zawód trudno odróżnić od kilku innych na podstawie samych odpowiedzi."}{" "}
            Łatwiej to rozstrzygnąć, czytając obie karty obok siebie.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {obok.map((z) => (
              <Link
                key={z.kod}
                href={`/u/${kod}/porownanie?a=${karta.kod}&b=${z.kod}`}
                className="przejscie inline-flex min-h-11 items-center gap-2 rounded-xl bg-akcent px-5 text-male font-semibold text-na-akcencie hover:bg-akcent-ciemny"
              >
                Porównaj z: {z.nazwa} <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </aside>
      ) : null}

      <div className="szklo flex flex-col p-6 sm:p-9">
        {bloki.map((b, i) => (
          <BlokKarty key={`${b.rodzaj}-${i}`} blok={b} stopienZagrozenia={ZAGROZENIE[karta.zagrozenie]} />
        ))}
      </div>

      <footer className="szklo flex flex-wrap gap-3 p-6">
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie inline-flex min-h-12 items-center rounded-xl border border-linia-mocna bg-szklo px-6 text-male font-semibold hover:border-akcent/50 hover:text-akcent-jasny"
        >
          Wszystkie karty
        </Link>
        <Link
          href={`/u/${kod}/raport?otwarte=zawody`}
          className="przejscie inline-flex min-h-12 items-center rounded-xl border border-linia px-6 text-male font-semibold text-atrament-sciszony hover:border-linia-mocna hover:text-atrament"
        >
          Wróć do raportu
        </Link>
      </footer>
    </article>
  );
}
