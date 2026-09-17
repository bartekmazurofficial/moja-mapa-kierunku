import type { KartaUczestnika } from "@/lib/prowadzacy/dane";

/**
 * Wspolne kafle panelu prowadzacego.
 *
 * `Blok` jest tu jedynym elementem uzywanym poza tym plikiem: bierze go
 * `KartaNowa`, ktora niesie cala tresc karty uczestnika.
 */

export function Naglowek({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2.5 text-drobne uppercase tracking-[0.14em] text-atrament-slaby">{children}</h2>
  );
}

export function Blok({ tytul, children }: { tytul: string; children: React.ReactNode }) {
  return (
    <section className="szklo p-5">
      <Naglowek>{tytul}</Naglowek>
      {children}
    </section>
  );
}

export function PytanieUczestnika({ karta }: { karta: KartaUczestnika }) {
  return (
    <Blok tytul="Pytanie zapisane przez uczestnika">
      {karta.pytanie ? (
        <p className="text-tresc-duza font-semibold leading-relaxed">„{karta.pytanie}”</p>
      ) : (
        <p className="text-male text-atrament-slaby">Nie zapisał pytania.</p>
      )}
    </Blok>
  );
}

/** Lista strat. Widzi ją wyłącznie prowadzący — uczestnik nigdy. */