import { notFound } from "next/navigation";
import { pobierzPostepModulow, pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly } from "@/lib/moduly/otwarcie";
import { stanDostepu } from "@/lib/raport/dostep";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW } from "@/lib/moduly/ekrany";
import { Nawigacja, type PozycjaNawigacji } from "@/components/pulpit/Nawigacja";
import { Znak } from "@/components/pulpit/Znak";

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

  const [{ zakonczone }, otwarte, dostep] = await Promise.all([
    pobierzPostepModulow(uczestnik.id),
    otwarteModuly(uczestnik.grupaId),
    stanDostepu(uczestnik.id, uczestnik.grupaId),
  ]);

  const doZrobienia = KOLEJNOSC_MODULOW.filter((m) => otwarte.has(m));
  const ukonczone = doZrobienia.filter(
    (m) => (zakonczone.get(m)?.size ?? 0) >= CZESCI_MODULOW[m].length,
  ).length;
  const zostalo = doZrobienia.length - ukonczone;

  const pozycje: PozycjaNawigacji[] = [
    { etykieta: "Przegląd", podpis: "Gdzie jesteś", href: `/u/${kod}`, ikona: "przeglad" },
    {
      etykieta: "Moduły",
      podpis: doZrobienia.length === 0 ? "otworzą się na spotkaniu" : `${ukonczone} z ${doZrobienia.length} wypełnionych`,
      href: `/u/${kod}/moduly`,
      ikona: "moduly",
      odznaka: zostalo > 0 ? String(zostalo) : undefined,
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
      zamkniete: dostep.dostepne.has("zawody") ? undefined : "otworzy się na spotkaniu 4",
    },
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[86rem] flex-col gap-6 px-4 py-5 lg:flex-row lg:gap-8 lg:px-8 lg:py-8">
      <aside className="lg:sticky lg:top-8 lg:h-fit lg:w-[19rem] lg:shrink-0">
        <div className="szklo p-5">
          <div className="flex items-center gap-3">
            <Znak />
            <span className="min-w-0">
              <span className="block truncate text-tresc-duza font-extrabold tracking-tight">
                DreamWork
              </span>
              <span className="block text-drobne uppercase tracking-[0.14em] text-atrament-slaby">
                więcej niż zawód
              </span>
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-linia bg-tlo/50 p-4">
            <p className="text-drobne uppercase tracking-[0.1em] text-atrament-slaby">
              {uczestnik.grupa.nazwa}
            </p>
            <p className="mt-1 text-tresc-duza font-bold">{uczestnik.imie}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-linia">
              <div
                className="h-full rounded-full bg-gradient-to-r from-akcent-ciemny to-akcent-jasny"
                style={{ width: `${doZrobienia.length > 0 ? (ukonczone / doZrobienia.length) * 100 : 0}%` }}
              />
            </div>
            <p className="mt-2 text-drobne text-atrament-slaby">
              {doZrobienia.length === 0
                ? "Pierwsza część otworzy się na spotkaniu."
                : `Wypełnione ${ukonczone} z ${doZrobienia.length} otwartych części`}
            </p>
          </div>

          <div className="mt-5">
            <Nawigacja pozycje={pozycje} />
          </div>

          <p className="odreczny mt-6 pl-1">Poznaj siebie.<br />Zobacz więcej.</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 pb-10">{children}</main>
    </div>
  );
}
