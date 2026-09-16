import { notFound } from "next/navigation";
import { pobierzRaport } from "@/lib/raport/serwer";
import { kartyNowego } from "@/lib/raport/nowy";
import { pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly } from "@/lib/moduly/otwarcie";
import { KOLEJNOSC_NOWA, programGrupy } from "@/lib/moduly/ekrany";
import { stanDostepu } from "@/lib/raport/dostep";
import { prisma } from "@/lib/db/klient";
import { Bramy } from "@/components/pulpit/Bramy";
import { ListaZawodow, type ZawodNaLiscie } from "@/components/pulpit/ListaZawodow";

/** Ekran zamiast listy, dopoki prowadzacy nie odslonil zawodow. */
function Zamkniete({ spotkanie }: { spotkanie: number }) {
  return (
    <div className="szklo p-8">
      <h1 className="text-naglowek font-extrabold tracking-tight">Karty zawodów</h1>
      <p className="proza mt-4 max-w-czytelna">
        Ta część otworzy się na {spotkanie === 2 ? "drugim" : "czwartym"} spotkaniu, po obszarach.
        Kolejność ma znaczenie: konkretny zawód czyta się inaczej, kiedy wiadomo już, z jakiej
        dziedziny wyszedł.
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

  const otwarte = await otwarteModuly(uczestnik.grupaId);
  const nowy = programGrupy(otwarte) === KOLEJNOSC_NOWA;

  /**
   * Kolejnosc listy musi pochodzic z tego silnika, ktory wypelnial uczestnik.
   *
   * Przed ta poprawka uczestnik nowego programu dostawal liste ulozona przez
   * stary silnik, ktory nie mial ani jednej jego odpowiedzi, i czytal przy
   * pierwszym zawodzie „to bardzo mocno do Ciebie pasuje". Zdanie o
   * dopasowaniu wystawione bez danych jest gorsze niz brak zdania.
   */
  let wszystkie: ZawodNaLiscie[];
  let oceny: Record<string, string>;

  if (nowy) {
    const dostep = await stanDostepu(uczestnik.id, uczestnik.grupaId);
    if (!dostep.dostepne.has("zawody")) return <Zamkniete spotkanie={2} />;
    const karty = await kartyNowego(uczestnik.id);
    if (karty.length === 0) return <Zamkniete spotkanie={2} />;
    wszystkie = karty.map((z) => ({ ...z, klaster: null }));
    const zapisane = await prisma.ocenaZawodu.findMany({ where: { uczestnikId: uczestnik.id } });
    oceny = Object.fromEntries(zapisane.map((o) => [o.zawodKod, o.ocena]));
  } else {
    const widok = await pobierzRaport(kod);
    if (!widok) notFound();
    const sekcja = widok.raport.zawody;
    if (!sekcja) return <Zamkniete spotkanie={4} />;
    wszystkie = sekcja.pozycje.flatMap((p) =>
      p.zawody.map((z) => ({ ...z, klaster: p.typ === "klaster" ? p.nazwa : null })),
    );
    oceny = widok.oceny;
  }

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
