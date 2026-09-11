import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly } from "@/lib/moduly/otwarcie";
import { coZniknie } from "@/lib/moduly/odnowa";
import { wypelnijOdNowa } from "@/lib/moduly/akcje";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW, NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import type { KodModulu } from "@/lib/moduly/typy";

export const dynamic = "force-dynamic";

/**
 * Potwierdzenie przed skasowaniem odpowiedzi.
 *
 * Osobny ekran, nie przycisk na liscie. Kasowanie jest nieodwracalne, a M1
 * zawiera tekst pisany wlasnymi slowami — jedno przypadkowe klikniecie nie
 * moze tego zabrac. Ekran mowi wprost, ile odpowiedzi zniknie.
 */
export default async function Strona({
  params,
}: {
  params: Promise<{ kod: string; modul: string }>;
}) {
  const { kod, modul } = await params;
  if (!KOLEJNOSC_MODULOW.includes(modul as KodModulu)) notFound();

  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const otwarte = await otwarteModuly(uczestnik.grupaId);
  if (!otwarte.has(modul as KodModulu)) notFound();

  const stan = await coZniknie(uczestnik.id, modul as KodModulu);
  // Nie ma czego kasowac: wchodzimy wprost w modul, zamiast pytac o zgode
  // na usuniecie zera odpowiedzi.
  if (!stan.cokolwiek) redirect(`/u/${kod}/modul/${modul}`);

  const nazwa = NAZWY_MODULOW[modul as KodModulu];
  const wszystkich = CZESCI_MODULOW[modul as KodModulu].length;

  return (
    <main className="mx-auto flex min-h-dvh max-w-czytelna flex-col justify-center px-6 py-16">
      <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">{nazwa}</p>
      <h1 className="mt-3 text-naglowek font-extrabold tracking-tight">
        Wypełnić tę część od nowa?
      </h1>

      <div className="szklo mt-7 p-6">
        <p className="text-male font-semibold text-uwaga">Co zniknie</p>
        <ul className="proza mt-3 flex flex-col gap-2 text-atrament-sciszony">
          <li>
            <strong className="text-atrament">
              {stan.odpowiedzi} {slowoOdpowiedzi(stan.odpowiedzi)}
            </strong>{" "}
            zapisanych w tej części
            {stan.zakonczoneCzesci.length > 0 ? (
              <>
                {" "}
                ({stan.zakonczoneCzesci.length} z {wszystkich}{" "}
                {wszystkich === 1 ? "części wypełniona" : "części wypełnionych"})
              </>
            ) : null}
          </li>
          <li>kolejność bloków wylosowana dla Ciebie — nowy przebieg będzie w innej kolejności</li>
          {modul === "M1" ? <li>tekst, który napisałeś własnymi słowami</li> : null}
        </ul>
        <p className="proza mt-4 text-atrament-sciszony">
          Tego się nie da cofnąć. Zaczynasz tę część od pierwszego ekranu.
        </p>
      </div>

      <p className="proza mt-5 max-w-czytelna text-atrament-slaby">
        Reszta zostaje bez zmian: pozostałe części, Twój raport i to, co zapisał prowadzący. Raport
        przeliczy się sam z nowych odpowiedzi, kiedy skończysz.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <form action={wypelnijOdNowa}>
          <input type="hidden" name="kod" value={kod} />
          <input type="hidden" name="modul" value={modul} />
          <button
            type="submit"
            className="przejscie inline-flex min-h-12 items-center rounded-lg border border-uwaga/50 bg-uwaga-tlo px-6 text-male font-semibold text-uwaga hover:border-uwaga"
          >
            Tak, skasuj i wypełnię od nowa
          </button>
        </form>
        <Link
          href={`/u/${kod}/moduly`}
          className="przejscie inline-flex min-h-12 items-center rounded-lg bg-akcent px-6 text-male font-medium text-na-akcencie hover:bg-akcent-ciemny"
        >
          Nie, zostaw jak jest
        </Link>
      </div>
    </main>
  );
}

/** „1 odpowiedź", ale „2 odpowiedzi" i „7 odpowiedzi" — dwie formy wystarczą. */
function slowoOdpowiedzi(n: number): string {
  return n === 1 ? "odpowiedź" : "odpowiedzi";
}
