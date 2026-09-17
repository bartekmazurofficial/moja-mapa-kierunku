import Link from "next/link";
import { prisma } from "@/lib/db/klient";
import { zalogujPokaz } from "@/lib/prowadzacy/akcje";
import {
  IMIE_POKAZ_PELNY,
  IMIE_POKAZ_PUSTY,
  KOD_GRUPY_POKAZ,
  pokazWlaczony,
} from "@/lib/pokaz";

/**
 * Trzy panele do obejrzenia bez kodu.
 *
 * Panel uczestnika przed startem, panel uczestnika po wszystkich czterech
 * modułach razem z raportem i panel prowadzącego. Bez tego każdy pokaz
 * produktu wymaga kodu i cudzych danych.
 *
 * Komponent sam sprawdza przełącznik i nie renderuje niczego, gdy pokaz jest
 * wyłączony. Sprawdzenie w miejscu użycia nie wystarcza: ten blok prowadzi
 * do panelu prowadzącego, więc nie może zależeć od tego, czy ktoś pamiętał
 * owinąć go warunkiem.
 *
 * Wejście w panel prowadzącego zakłada sesję pokazową: widzi wyłącznie grupę
 * pokazową i nie ma prawa zapisu. Hasła nie zdradza i nie obchodzi.
 */
export async function PokazDemo() {
  if (!pokazWlaczony()) return null;

  const grupa = await prisma.grupa.findUnique({
    where: { kod: KOD_GRUPY_POKAZ },
    include: { uczestnicy: true },
  });
  if (!grupa) return null;

  const kod = (imie: string) => grupa.uczestnicy.find((u) => u.imie === imie)?.kodDostepu;
  const pusty = kod(IMIE_POKAZ_PUSTY);
  const pelny = kod(IMIE_POKAZ_PELNY);
  if (!pusty || !pelny) return null;

  return (
    <section className="mt-10 border-t border-linia pt-8">
      <h2 className="text-drobne font-bold uppercase tracking-[0.18em] text-atrament-slaby">
        Zobacz, jak to działa
      </h2>
      <p className="mt-2 max-w-czytelna text-male text-atrament-sciszony">
        Trzy panele na przykładowych danych. Nikt prawdziwy tu nie występuje, a odpowiedzi są
        wygenerowane, nie wypełnione przez człowieka.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <KartaPokazu
          href={`/u/${pusty}`}
          numer="1"
          tytul="Uczestnik przed startem"
          opis="Pusty panel, cztery moduły do wypełnienia."
        />
        <KartaPokazu
          href={`/u/${pelny}/raport`}
          numer="2"
          tytul="Uczestnik po wszystkim"
          opis="Wszystkie moduły wypełnione, raport w komplecie."
        />
        <form action={zalogujPokaz} className="contents">
          <button
            type="submit"
            className="przejscie flex flex-col rounded-karta border border-linia bg-panel p-4 text-left hover:border-akcent/45"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-akcent-tlo text-male font-extrabold text-akcent-jasny">
              3
            </span>
            <span className="mt-3 text-tresc font-bold text-atrament">Panel prowadzącego</span>
            <span className="mt-1 text-male leading-snug text-atrament-sciszony">
              Wgląd w grupę pokazową. Tylko do czytania.
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}

function KartaPokazu({
  href,
  numer,
  tytul,
  opis,
}: {
  href: string;
  numer: string;
  tytul: string;
  opis: string;
}) {
  return (
    <Link
      href={href}
      className="przejscie flex flex-col rounded-karta border border-linia bg-panel p-4 hover:border-akcent/45"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-akcent-tlo text-male font-extrabold text-akcent-jasny">
        {numer}
      </span>
      <span className="mt-3 text-tresc font-bold text-atrament">{tytul}</span>
      <span className="mt-1 text-male leading-snug text-atrament-sciszony">{opis}</span>
    </Link>
  );
}
