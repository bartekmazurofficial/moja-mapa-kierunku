import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { pobierzKarte } from "@/lib/raport/serwer";

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

  const poziomy: Record<string, string> = {
    szybki: "szybkie wejście",
    sredni: "średnia droga",
    dlugi: "długa droga",
    bardzo_dlugi: "bardzo długa droga",
  };
  const studia: Record<string, string> = {
    tak: "wymaga studiów",
    nie: "bez studiów",
    czesciowo: "studia częściowo",
  };

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
          {poziomy[karta.poziom] ?? karta.poziom} · {studia[karta.studia] ?? karta.studia}
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

      <div className="szklo flex flex-col gap-2 p-6 sm:p-9">
        {karta.sekcje.map((s) => (
          <section key={s.tytul}>
            <h2 className="text-naglowek-maly font-bold leading-snug">{s.tytul}</h2>
            <div
              className="karta mt-3"
              dangerouslySetInnerHTML={{ __html: marked.parse(s.tresc, { async: false }) }}
            />
          </section>
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
