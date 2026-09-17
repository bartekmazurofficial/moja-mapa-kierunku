import { notFound } from "next/navigation";
import { pobierzPostepModulow, pobierzUczestnika } from "@/lib/moduly/serwer";
import { stanDostepu } from "@/lib/raport/dostep";
import { stanAssessmentu } from "@/lib/moduly/etapy";
import { Nawigacja, type PozycjaNawigacji } from "@/components/pulpit/Nawigacja";
import { Marka } from "@/components/pulpit/Marka";

export const dynamic = "force-dynamic";

/**
 * Pulpit uczestnika: nawigacja po lewej, treść po prawej.
 *
 * Sekcja zamknięta jest widoczna i podpisana, ale nieklikalna — uczestnik ma
 * wiedzieć, co go czeka, a nie patrzeć na pustą listę przez trzy tygodnie.
 * Zamknięcie i tak stoi na serwerze, tu chodzi wyłącznie o to, co widać.
 */
export default async function Uklad({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ kod: string }>;
}) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const [{ zakonczone, odpowiedziWModule }, dostep] = await Promise.all([
    pobierzPostepModulow(uczestnik.id),
    stanDostepu(uczestnik.id, uczestnik.grupaId),
  ]);

  const stan = stanAssessmentu(zakonczone, odpowiedziWModule);

  /**
   * Trzy pozycje, nie cztery. „Moduły" byly osobna zakladka ze spisem tresci
   * tego samego, co stoi w przegladzie: uczestnik czytal tam te same cztery
   * nazwy drugi raz i klikal o jeden ekran wiecej, zeby zaczac.
   */
  const pozycje: PozycjaNawigacji[] = [
    {
      etykieta: "Przegląd",
      podpis: stan.gotowy ? "Masz to za sobą" : `${stan.ukonczonych} z 4 etapów`,
      href: `/u/${kod}`,
      ikona: "przeglad",
    },
    {
      etykieta: "Mój raport",
      podpis: "To, co już o sobie wiesz",
      href: `/u/${kod}/raport`,
      ikona: "raport",
    },
    {
      etykieta: "Zawody",
      podpis: "Karty do przeczytania",
      href: `/u/${kod}/zawody`,
      ikona: "zawody",
      zamkniete: dostep.dostepne.has("zawody") ? undefined : "odsłoni je prowadzący",
    },
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[106rem] flex-col gap-5 px-4 py-4 lg:flex-row lg:gap-6 lg:px-6 lg:py-4 2xl:px-8">
      <aside className="lg:sticky lg:top-4 lg:h-fit lg:w-[17.5rem] lg:shrink-0">
        <div className="szklo p-4 lg:p-5">
          <div className="flex items-center justify-between gap-4">
            <Marka href={`/u/${kod}`} />
            {/* Na telefonie inicjał zastępuje całą kartę uczestnika. */}
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-akcent-jasny to-akcent text-male font-extrabold text-na-akcencie lg:hidden"
            >
              {uczestnik.imie.trim().charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Kto tu jest. Zamiast zdjęcia inicjał: nie mamy fotografii
              uczestników i nie zamierzamy ich zbierać. */}
          <div className="mt-5 hidden items-center gap-3 rounded-xl border border-linia bg-tlo/50 p-4 lg:flex">
            <span
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-akcent-jasny to-akcent text-naglowek-maly font-extrabold text-na-akcencie"
            >
              {uczestnik.imie.trim().charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block text-drobne text-atrament-slaby">Cześć,</span>
              <span className="block truncate text-tresc-duza font-bold leading-tight">
                {uczestnik.imie}
              </span>
              <span className="block text-drobne leading-snug text-atrament-slaby">
                {uczestnik.grupa.nazwa}
              </span>
            </span>
          </div>

          <div className="mt-4 rounded-xl border-linia bg-tlo/50 p-0 lg:border lg:p-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-linia">
              <div
                className="h-full rounded-full bg-gradient-to-r from-akcent-ciemny to-akcent-jasny"
                style={{ width: `${(stan.ukonczonych / 4) * 100}%` }}
              />
            </div>
            <p className="mt-2 hidden text-drobne text-atrament-slaby lg:block">
              {stan.gotowy ? "Assessment wypełniony" : `${stan.ukonczonych} z 4 etapów za Tobą`}
            </p>
          </div>

          <div className="mt-4 lg:mt-5">
            <Nawigacja pozycje={pozycje} />
          </div>

        </div>
      </aside>

      <main className="min-w-0 flex-1 pb-6">{children}</main>
    </div>
  );
}
