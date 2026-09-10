import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzPostepModulow, pobierzUczestnika } from "@/lib/moduly/serwer";
import { CZASY_MODULOW, CZESCI_MODULOW, KOLEJNOSC_MODULOW, NAZWY_MODULOW } from "@/lib/moduly/ekrany";

export const dynamic = "force-dynamic";

/** Ktore moduly naleza do ktorego spotkania. Zgodnie ze scenariuszami. */
const SPOTKANIE: Record<string, number> = { A0: 1, A1: 1, A3: 1, A2: 2, M1: 3, A4: 3, A5: 3 };

export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const { zakonczone } = await pobierzPostepModulow(uczestnik.id);

  const moduly = KOLEJNOSC_MODULOW.map((m) => {
    const gotowe = zakonczone.get(m)?.size ?? 0;
    const wszystkie = CZESCI_MODULOW[m].length;
    return {
      kod: m,
      nazwa: NAZWY_MODULOW[m],
      czas: CZASY_MODULOW[m],
      spotkanie: SPOTKANIE[m],
      stan: gotowe === 0 ? "przed" : gotowe < wszystkie ? "wtrakcie" : "gotowe",
    } as const;
  });

  const ukonczone = moduly.filter((m) => m.stan === "gotowe").length;

  return (
    <main className="mx-auto max-w-artykul px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-drobne uppercase tracking-[0.1em] text-atrament-slaby">
        {uczestnik.grupa.nazwa}
      </p>
      <h1 className="mt-2 font-serif text-naglowek-duzy leading-tight">
        Cześć, {uczestnik.imie}
      </h1>
      <p className="proza mt-4 max-w-czytelna text-atrament-sciszony">
        Siedem części, wypełniasz je na spotkaniach. Każdą można przerwać i wrócić —
        odpowiedzi zapisują się same.
      </p>

      <ol className="mt-10 border-t border-linia">
        {moduly.map((m, i) => {
          const poprzednieSpotkanie = i > 0 ? moduly[i - 1].spotkanie : 0;
          return (
            <li key={m.kod}>
              {m.spotkanie !== poprzednieSpotkanie ? (
                <p className="pb-2 pt-7 text-drobne uppercase tracking-[0.08em] text-atrament-slaby">
                  Spotkanie {m.spotkanie}
                </p>
              ) : null}
              <Link
                href={`/u/${kod}/modul/${m.kod}`}
                className="przejscie group flex items-center gap-4 border-b border-linia py-4 hover:bg-podklad/60"
              >
                <ZnacznikStanu stan={m.stan} />
                <span className="flex-1">
                  <span className="block text-tresc-duza">{m.nazwa}</span>
                  <span className="block text-male text-atrament-slaby">
                    {m.stan === "gotowe"
                      ? "wypełnione"
                      : m.stan === "wtrakcie"
                        ? "zaczęte, można dokończyć"
                        : m.czas}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="przejscie text-atrament-slaby group-hover:translate-x-0.5 group-hover:text-atrament"
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-male tabular-nums text-atrament-slaby">
        Wypełnione {ukonczone} z {moduly.length}
      </p>

      <section className="mt-14 rounded-xl border border-linia bg-papier p-6">
        <h2 className="font-serif text-naglowek-maly">Twój raport</h2>
        <p className="proza mt-2 text-atrament-sciszony">
          Powstaje stopniowo. Kolejne części otwierają się po spotkaniach — zobaczysz je tutaj.
        </p>
      </section>
    </main>
  );
}

function ZnacznikStanu({ stan }: { stan: "przed" | "wtrakcie" | "gotowe" }) {
  if (stan === "gotowe") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-akcent text-white">
        <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 6.5 4.5 9 10 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">wypełnione</span>
      </span>
    );
  }
  if (stan === "wtrakcie") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-akcent">
        <span className="h-2 w-2 rounded-full bg-akcent" />
        <span className="sr-only">zaczęte</span>
      </span>
    );
  }
  return (
    <span className="h-6 w-6 shrink-0 rounded-full border border-linia-mocna">
      <span className="sr-only">jeszcze nie zaczęte</span>
    </span>
  );
}
