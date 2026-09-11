import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzPostepModulow, pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly, MODULY_SPOTKANIA, SPOTKANIE_MODULU } from "@/lib/moduly/otwarcie";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import { Bramy } from "@/components/pulpit/Bramy";
import { KOLORY_MODULOW } from "@/lib/ui/kolory";

export const dynamic = "force-dynamic";

/** Po co jest każda część. Jedno zdanie, językiem uczestnika. */
const PO_CO: Record<string, string> = {
  A0: "Kilka podstawowych informacji o Twojej sytuacji: gdzie jesteś, co Ci idzie, na co masz przestrzeń.",
  A1: "Co Cię realnie ciągnie. Nie deklaracje, tylko wybory między konkretnymi zajęciami.",
  A3: "Jak naturalnie działasz: sam czy z ludźmi, z planem czy w biegu, cisza czy ruch.",
  A2: "W czym możesz być dobry. Osobno od tego, co lubisz, bo to nie zawsze to samo.",
  A4: "Czego potrzebujesz od pracy, żeby miała dla Ciebie sens.",
  M1: "Jakiego życia chcesz. Jedyna część, w której piszesz własnymi słowami.",
  A5: "Warunki pracy, które są nie do pogodzenia z tym, jak chcesz żyć.",
};

export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const [{ zakonczone, odpowiedziWModule }, otwarte] = await Promise.all([
    pobierzPostepModulow(uczestnik.id),
    otwarteModuly(uczestnik.grupaId),
  ]);

  /** Ile odpowiedzi uczestnik ma już zapisanych w module. */
  const zapisane = (m: (typeof KOLEJNOSC_MODULOW)[number]) => odpowiedziWModule.get(m) ?? 0;

  const stan = (m: (typeof KOLEJNOSC_MODULOW)[number]) => {
    const gotowe = zakonczone.get(m)?.size ?? 0;
    if (!otwarte.has(m)) return "zamkniety" as const;
    if (gotowe >= CZESCI_MODULOW[m].length) return "gotowy" as const;
    // Zaczęte to także moduł przerwany w połowie pierwszej części: liczy się
    // pierwsza zapisana odpowiedź, nie domknięcie całej części.
    return gotowe > 0 || zapisane(m) > 0 ? "wtrakcie" : "przed";
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="szklo relative overflow-hidden p-7 sm:p-9 lg:pr-[26rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-akcent/20 blur-3xl"
        />
        <Bramy klasa="pointer-events-none absolute -right-6 bottom-0 hidden h-[15rem] w-[24rem] opacity-80 lg:block" />
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">Siedem części</p>
        <h1 className="mt-3 text-naglowek-duzy font-extrabold tracking-tight">
          Małe wybory.
          <br />
          <span className="gradient-tytul">Wielkie możliwości.</span>
        </h1>
        <p className="proza mt-4 max-w-czytelna">
          Każdą część można przerwać i wrócić. Nie ma dobrych ani złych odpowiedzi. Liczy się to,
          co jest najbliżej prawdy o Tobie.
        </p>
      </header>

      {Object.entries(MODULY_SPOTKANIA).map(([nr, moduly]) => (
        <section key={nr} className="flex flex-col gap-3">
          <h2 className="flex items-center gap-3 px-1 text-drobne uppercase tracking-[0.16em] text-atrament-slaby">
            Spotkanie {nr}
            <span aria-hidden className="h-px flex-1 bg-linia" />
          </h2>

          {/* Wszystkie części jednego spotkania w jednym szeregu: spotkanie
              pierwsze ma trzy, drugie jedną, trzecie trzy. Na telefonie
              jedna pod drugą, bo trzy kolumny nie mieszczą tytułu. */}
          <ul
            className="grid gap-3 md:[grid-template-columns:repeat(var(--ile),minmax(0,1fr))]"
            style={{ "--ile": moduly.length } as CSSProperties}
          >
            {moduly.map((m) => {
              const s = stan(m);
              const kolor = KOLORY_MODULOW[m];
              const tresc = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="text-tresc-duza font-bold"
                      style={s === "zamkniety" ? undefined : { color: kolor.atrament }}
                    >
                      {NAZWY_MODULOW[m]}
                    </h3>
                    <Odznaka stan={s} spotkanie={SPOTKANIE_MODULU[m]} />
                  </div>
                  <p className="mt-2 text-male leading-relaxed text-atrament-sciszony">{PO_CO[m]}</p>
                  {s !== "zamkniety" ? (
                    <p className="mt-4 flex items-center justify-end text-drobne text-akcent-jasny">
                      <span aria-hidden className="przejscie group-hover:translate-x-0.5">→</span>
                    </p>
                  ) : null}
                </>
              );

              return (
                <li key={m} className="flex flex-col gap-2">
                  {s === "zamkniety" ? (
                    <div className="szklo h-full p-5 opacity-60">{tresc}</div>
                  ) : (
                    <Link
                      href={`/u/${kod}/modul/${m}`}
                      className="przejscie group block flex-1 rounded-karta border-2 p-5"
                      style={{
                        borderColor: s === "wtrakcie" ? kolor.neon : kolor.obwod,
                        background: kolor.tlo,
                        boxShadow:
                          s === "wtrakcie" ? `0 16px 34px -20px ${kolor.neon}` : undefined,
                      }}
                    >
                      {tresc}
                    </Link>
                  )}
                  {/* Wyniki są dostępne od razu po wypełnieniu, niezależnie od
                      warstw raportu: to własne odpowiedzi uczestnika, nie wynik
                      dopasowania. */}
                  {/* Od nowa da się wypełnić wszystko, co ma choć jedną
                      zapisaną odpowiedź — także moduł przerwany w połowie. */}
                  {s !== "zamkniety" && zapisane(m) > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {s === "gotowy" && m !== "A0" ? (
                        <Link
                          href={`/u/${kod}/wyniki/${m}`}
                          className="przejscie inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-linia px-4 text-male font-semibold text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
                        >
                          Zobacz swoje odpowiedzi <span aria-hidden>→</span>
                        </Link>
                      ) : null}
                      {/* Pojedynczej odpowiedzi nie da się podmienić: moduły liczą
                          się z całości. Kto chce coś zmienić, wypełnia część od
                          nowa — przez ekran potwierdzenia, bo to kasuje dane. */}
                      <Link
                        href={`/u/${kod}/modul/${m}/od-nowa`}
                        className="przejscie inline-flex min-h-10 items-center justify-center rounded-xl border border-linia px-4 text-male font-semibold text-atrament-slaby hover:border-uwaga/45 hover:text-uwaga"
                      >
                        Wypełnij od nowa
                      </Link>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Odznaka({ stan, spotkanie }: { stan: string; spotkanie: number }) {
  const style: Record<string, string> = {
    gotowy: "border-akcent/45 bg-akcent-tlo text-akcent-jasny",
    wtrakcie: "border-uwaga/40 bg-uwaga-tlo text-uwaga",
    przed: "border-linia-mocna text-atrament-sciszony",
    zamkniety: "border-linia text-atrament-slaby",
  };
  const tekst: Record<string, string> = {
    gotowy: "wypełnione",
    wtrakcie: "zaczęte",
    przed: "do zrobienia",
    zamkniety: `spotkanie ${spotkanie}`,
  };
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-drobne font-semibold ${style[stan]}`}>
      {tekst[stan]}
    </span>
  );
}
