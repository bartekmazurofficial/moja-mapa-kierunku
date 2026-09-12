import { notFound } from "next/navigation";
import { pobierzRaport } from "@/lib/raport/serwer";
import { Bramy } from "@/components/pulpit/Bramy";
import { ListaZawodow, type ZawodNaLiscie } from "@/components/pulpit/ListaZawodow";

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

  const wszystkie: ZawodNaLiscie[] = sekcja.pozycje.flatMap((p) =>
    p.zawody.map((z) => ({ ...z, klaster: p.typ === "klaster" ? p.nazwa : null })),
  );

  /**
   * Czolowka uczestnika: trzy obszary, ktore pojawiaja sie najwyzej na liscie
   * ulozonej wynikiem z silnika. Te grupy startuja otwarte, reszta czeka pod
   * przyciskiem. Liczymy to z samej listy, a nie z sekcji obszarow, bo tamta
   * siedzi w innej warstwie i moze byc jeszcze zamknieta.
   */
  const czolowka = [...new Set(wszystkie.map((z) => z.obszarId))].slice(0, 3);

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
        <h1 className="mt-3 text-naglowek font-extrabold tracking-tight sm:text-naglowek-duzy">
          Jak wygląda życie
          <br />
          <span className="gradient-tytul">człowieka, który to robi.</span>
        </h1>
        <p className="proza mt-4 max-w-czytelna">
          Nie obowiązki, tylko życie. O której wstaje, ile go boli, kiedy ma wolne, co go wykańcza.
          To jest różnica między katalogiem zawodów a materiałem do decyzji.
        </p>
      </header>

      <ListaZawodow kod={kod} zawody={wszystkie} czolowka={czolowka} />
    </div>
  );
}
