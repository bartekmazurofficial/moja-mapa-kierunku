import Link from "next/link";
import { prisma } from "@/lib/db/klient";
import { CZESCI_MODULOW, KOLEJNOSC_MODULOW } from "@/lib/moduly/ekrany";
import { MARKER_ZAKONCZENIA } from "@/lib/moduly/typy";
import { trybTestowy } from "@/lib/tryb";

/**
 * Lista uczestników do wejścia bez kodu.
 *
 * **Wyłącznie do testów.** Publiczna lista uczestników łamie zasadę, że nie da
 * się wyliczyć, kto jest w programie, a raport zawiera wizję życia, informacje
 * o zdrowiu i sytuacji finansowej. Komponent sam sprawdza tryb i nie renderuje
 * niczego, gdy `TRYB_TESTOWY` nie jest ustawiony — sprawdzenie w miejscu
 * użycia nie wystarcza.
 */
export async function ListaTestowa() {
  if (!trybTestowy()) return null;

  const grupy = await prisma.grupa.findMany({
    orderBy: { utworzona: "desc" },
    include: { uczestnicy: { orderBy: { imie: "asc" } } },
  });

  const zamkniete = await prisma.odpowiedz.findMany({
    where: { pozycja: MARKER_ZAKONCZENIA },
    select: { uczestnikId: true, modul: true },
  });
  const ileGotowych = (id: string) =>
    KOLEJNOSC_MODULOW.filter(
      (m) =>
        zamkniete.filter((z) => z.uczestnikId === id && z.modul === m).length >=
        CZESCI_MODULOW[m].length,
    ).length;

  return (
    <section className="mt-10 rounded-xl border border-uwaga/35 bg-uwaga-tlo/40 p-5">
      <h2 className="text-drobne uppercase tracking-[0.14em] text-uwaga">Tryb testowy</h2>
      <p className="mt-2 text-male text-atrament-sciszony">
        Wejście bez kodu, żeby dało się klikać po aplikacji. Ten blok znika, gdy w środowisku
        nie ma <code className="rounded bg-tlo/60 px-1.5 py-0.5 text-drobne">TRYB_TESTOWY=1</code>,
        i nigdy nie wolno go włączyć na produkcji.
      </p>

      {grupy.map((g) => (
        <div key={g.id} className="mt-5">
          <p className="text-drobne uppercase tracking-[0.12em] text-atrament-slaby">{g.nazwa}</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {g.uczestnicy.map((u) => {
              const gotowe = ileGotowych(u.id);
              return (
                <li key={u.id}>
                  <Link
                    href={`/u/${u.kodDostepu}`}
                    className="przejscie inline-flex items-baseline gap-2 rounded-lg border border-linia-mocna bg-szklo px-3 py-2 text-male hover:border-akcent/50 hover:text-akcent-jasny"
                  >
                    {u.imie}
                    <span className="text-drobne tabular-nums text-atrament-slaby">
                      {gotowe}/{KOLEJNOSC_MODULOW.length}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
