"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Długa treść przycięta do kilku akapitów, z przyciskiem „Rozwiń".
 *
 * Karta zawodu ma dwadzieścia sekcji i w całości rozciągała się na dziewięć
 * ekranów. Przycinamy **tylko to, co naprawdę jest za długie**: wysokość
 * mierzymy po wyrenderowaniu, więc krótka sekcja nigdy nie dostaje przycisku
 * do rozwijania czegoś, co i tak widać.
 *
 * Nic nie znika: treść jest w drzewie od początku, więc znajdzie ją i czytnik
 * ekranu, i wyszukiwanie w przeglądarce po rozwinięciu.
 */
export function Zwijane({
  maks = 264,
  children,
}: {
  /** Powyżej ilu pikseli przycinamy. */
  maks?: number;
  children: React.ReactNode;
}) {
  const [rozwiniete, ustawRozwiniete] = useState(false);
  const [zaDlugie, ustawZaDlugie] = useState(false);
  const tresc = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = tresc.current;
    if (!el) return;
    // Zapas, żeby nie przycinać czegoś, co wystaje o dwa piksele.
    const sprawdz = () => ustawZaDlugie(el.scrollHeight > maks + 48);
    sprawdz();
    const obserwator = new ResizeObserver(sprawdz);
    obserwator.observe(el);
    return () => obserwator.disconnect();
  }, [maks]);

  const przyciete = zaDlugie && !rozwiniete;

  return (
    <div>
      <div
        ref={tresc}
        className="relative overflow-hidden"
        style={przyciete ? { maxHeight: maks } : undefined}
      >
        {children}
        {przyciete ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-szklo to-transparent"
          />
        ) : null}
      </div>
      {zaDlugie ? (
        <button
          type="button"
          onClick={() => ustawRozwiniete((p) => !p)}
          aria-expanded={rozwiniete}
          className="przejscie mt-2 inline-flex min-h-9 items-center gap-1.5 text-male font-semibold text-akcent-jasny hover:underline"
        >
          {rozwiniete ? "Zwiń" : "Rozwiń"}
          <span aria-hidden className={rozwiniete ? "rotate-180" : undefined}>
            ↓
          </span>
        </button>
      ) : null}
    </div>
  );
}
