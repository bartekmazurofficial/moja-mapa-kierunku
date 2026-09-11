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
    <article className="mx-auto max-w-artykul px-5 py-10 sm:px-8 sm:py-14">
      <nav className="mb-8">
        <Link href={`/u/${kod}/raport`} className="text-male text-atrament-slaby hover:text-atrament">
          ← Wróć do raportu
        </Link>
      </nav>

      <header className="border-b border-linia pb-6">
        <h1 className="font-serif text-naglowek-duzy leading-tight">{karta.tytul}</h1>
        <p className="mt-2 text-male text-atrament-sciszony">
          {poziomy[karta.poziom] ?? karta.poziom} · {studia[karta.studia] ?? karta.studia}
        </p>
        {karta.zdanieKierunkowe ? (
          <p className="mt-4 border-l-2 border-akcent pl-4 font-serif text-tresc-duza leading-relaxed">
            {karta.zdanieKierunkowe}
          </p>
        ) : null}
        {!karta.pelna ? (
          <p className="mt-4 rounded bg-podklad px-3 py-2 text-male text-atrament-sciszony">
            Ta karta jest na razie w wersji skróconej. Pełny opis powstaje.
          </p>
        ) : null}
      </header>

      <div className="mt-8 flex flex-col gap-9">
        {karta.sekcje.map((s) => (
          <section key={s.tytul}>
            <h2 className="font-serif text-naglowek-maly leading-snug">{s.tytul}</h2>
            <div
              className="karta mt-3"
              dangerouslySetInnerHTML={{ __html: marked.parse(s.tresc, { async: false }) }}
            />
          </section>
        ))}
      </div>

      <footer className="mt-12 border-t border-linia pt-6">
        <Link
          href={`/u/${kod}/raport`}
          className="przejscie inline-flex min-h-11 items-center rounded-lg border border-linia-mocna px-5 text-male hover:border-atrament-slaby"
        >
          Wróć do raportu
        </Link>
      </footer>
    </article>
  );
}
