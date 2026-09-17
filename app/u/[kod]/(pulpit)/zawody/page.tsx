import { notFound } from "next/navigation";
import { kartyNowego } from "@/lib/raport/nowy";
import { pobierzUczestnika } from "@/lib/moduly/serwer";
import { stanDostepu } from "@/lib/raport/dostep";
import { prisma } from "@/lib/db/klient";
import { Bramy } from "@/components/pulpit/Bramy";
import { ListaZawodow, type ZawodNaLiscie } from "@/components/pulpit/ListaZawodow";

/** Ekran zamiast listy, dopoki prowadzacy nie odslonil zawodow. */
function Zamkniete() {
  return (
    <div className="szklo p-8">
      <h1 className="text-naglowek font-extrabold tracking-tight">Karty zawodów</h1>
      <p className="proza mt-4 max-w-czytelna">
        Ta część otworzy się na drugim spotkaniu, po omówieniu obszarów. Kolejność ma znaczenie:
        konkretny zawód czyta się inaczej, kiedy wiadomo już, z jakiej dziedziny wyszedł.
      </p>
    </div>
  );
}

export const dynamic = "force-dynamic";

/**
 * Lista kart zawodów. Otwiera się razem z sekcją zawodów w raporcie — nigdy
 * wcześniej, bo zawody nie mogą pojawić się przed obszarami.
 */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  /**
   * Kolejnosc listy pochodzi z tego samego silnika, co raport.
   *
   * Uczestnik czyta przy pierwszym zawodzie zdanie o dopasowaniu, wiec ta
   * kolejnosc musi wynikac z jego odpowiedzi, a nie z czegokolwiek innego.
   */
  const dostep = await stanDostepu(uczestnik.id, uczestnik.grupaId);
  if (!dostep.dostepne.has("zawody")) return <Zamkniete />;

  const karty = await kartyNowego(uczestnik.id);
  if (karty.length === 0) return <Zamkniete />;

  const wszystkie: ZawodNaLiscie[] = karty.map((z) => ({ ...z, klaster: null }));
  const zapisane = await prisma.ocenaZawodu.findMany({ where: { uczestnikId: uczestnik.id } });
  const oceny: Record<string, string> = Object.fromEntries(
    zapisane.map((o) => [o.zawodKod, o.ocena]),
  );

  return (
    <div className="flex flex-col gap-5">
      <header className="szklo relative overflow-hidden p-6 sm:p-8 lg:pr-[26rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-akcent/20 blur-3xl"
        />
        <Bramy klasa="pointer-events-none absolute -right-6 bottom-0 hidden h-[14rem] w-[22rem] opacity-80 lg:block" />
        <p aria-hidden className="odreczny absolute right-8 top-7 hidden xl:block">
          Więcej niż zawód.
        </p>
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">
          Realne możliwości. Prawdziwi ludzie.
        </p>
        <h1 className="mt-3 text-naglowek font-extrabold leading-tight tracking-tight sm:text-naglowek-duzy">
          Zawody. Poznaj drogi.
          <br />
          <span className="gradient-tytul">Wybierz swoją.</span>
        </h1>
        <p className="proza mt-3 max-w-czytelna">
          Nie obowiązki, tylko życie. O której wstaje, ile go boli, kiedy ma wolne, co go wykańcza.
          {" "}{wszystkie.length} {wszystkie.length === 1 ? "karta" : "kart"} do przeczytania, w kolejności dopasowania.
        </p>
      </header>

      <ListaZawodow kod={kod} zawody={wszystkie} oceny={oceny} />
    </div>
  );
}
